import { useEffect, useMemo, useState } from 'react'
import { load, storageKeys } from '@/lib/storage'
import { mockApplicationsService } from '@/services/applications.service'
import { exportToExcel, exportToPDF, printTable } from '@/lib/exportUtils'
import type { StaffApplication } from '@/types/applications'

type SortOpt = 'newest' | 'oldest' | 'az' | 'za'

export default function Staff() {
  const [raw, setRaw] = useState<StaffApplication[]>(() => load<StaffApplication[]>(storageKeys.staff, []))
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [sort, setSort] = useState<SortOpt>('newest')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selected, setSelected] = useState<string[]>([])
  const [detail, setDetail] = useState<StaffApplication | null>(null)

  useEffect(() => setRaw(load<StaffApplication[]>(storageKeys.staff, [])), [])
  const refresh = () => setRaw(load<StaffApplication[]>(storageKeys.staff, []))

  const filtered = useMemo(() => {
    let arr = [...raw]
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      arr = arr.filter((r) => `${r.fullName} ${r.phone} ${r.currentEmployer} ${r.currentRole}`.toLowerCase().includes(q))
    }
    if (statusFilter !== 'all') arr = arr.filter((r) => r.status === statusFilter)
    if (dateFrom) arr = arr.filter((r) => new Date(r.createdAt) >= new Date(dateFrom))
    if (dateTo) {
      const to = new Date(dateTo)
      to.setHours(23, 59, 59, 999)
      arr = arr.filter((r) => new Date(r.createdAt) <= to)
    }
    if (sort === 'newest') arr.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    if (sort === 'oldest') arr.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt))
    if (sort === 'az') arr.sort((a, b) => a.fullName.localeCompare(b.fullName, 'ar'))
    if (sort === 'za') arr.sort((a, b) => b.fullName.localeCompare(a.fullName, 'ar'))
    return arr
  }, [raw, search, dateFrom, dateTo, sort, statusFilter])

  const toggleSelect = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map((r) => r.id))

  const handleStatus = async (id: string, status: StaffApplication['status']) => {
    await mockApplicationsService.updateStaffStatus(id, status)
    refresh()
    if (detail?.id === id) setDetail({ ...detail, status })
  }

  const handleDeleteSelected = async () => {
    if (!selected.length || !confirm(`حذف ${selected.length} طلب؟`)) return
    await mockApplicationsService.deleteStaff(selected)
    setSelected([])
    refresh()
  }

  const handleDeleteOne = async (id: string) => {
    if (!confirm('حذف هذا الطلب؟')) return
    await mockApplicationsService.deleteStaff([id])
    refresh()
    setDetail(null)
  }

  const columns = ['الاسم', 'الجوال', 'جهة العمل', 'طبيعة العمل', 'سبب الالتحاق', 'قائمة حلول', 'البرامج المستقبلية', 'الحالة', 'التاريخ']

  const doExcel = () => {
    const rows = filtered.map((r) => ({
      الاسم: r.fullName,
      الجوال: r.phone,
      'جهة العمل': r.currentEmployer ?? '',
      'طبيعة العمل': r.currentRole ?? '',
      'سبب الالتحاق': r.reasonToJoin,
      'قائمة حلول': r.wantsToJoinList === 'yes' ? 'نعم' : 'لا',
      'البرامج المستقبلية': r.futureTopics ?? '',
      الحالة: r.status,
      التاريخ: new Date(r.createdAt).toLocaleDateString('ar-SA'),
    }))
    exportToExcel(rows, columns, 'عاملات')
  }

  const doPdf = () => {
    const rows = filtered.map((r) => [r.fullName, r.phone, r.currentEmployer ?? '', r.currentRole ?? '', r.reasonToJoin, r.wantsToJoinList === 'yes' ? 'نعم' : 'لا', r.futureTopics ?? '', r.status, new Date(r.createdAt).toLocaleDateString('ar-SA')])
    const filters = []
    if (search) filters.push(`بحث: ${search}`)
    if (statusFilter !== 'all') filters.push(`حالة: ${statusFilter}`)
    if (dateFrom) filters.push(`من: ${dateFrom}`)
    if (dateTo) filters.push(`إلى: ${dateTo}`)
    filters.push(`ترتيب: ${sort}`)
    exportToPDF(rows, columns, 'طلبات العاملات', filters)
  }

  return (
    <div className="min-w-0 space-y-4">
      <h1 className="break-words font-display text-lg font-bold leading-tight text-ink-800 sm:text-xl">طلبات العاملات — {filtered.length} / {raw.length}</h1>
      <div className="min-w-0 space-y-4 overflow-hidden rounded-2xl bg-white p-3 shadow-card sm:p-4">
        <div className="grid min-w-0 gap-2.5 sm:gap-3 grid-cols-1 min-[430px]:grid-cols-2 lg:grid-cols-5">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث بالاسم أو الجوال..." className="min-h-[42px] min-w-0 w-full rounded-xl border border-ink-100 px-3 py-2.5 text-sm focus:border-raspberry-200 focus:outline-none focus:ring-2 focus:ring-raspberry-100" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="min-h-[42px] min-w-0 w-full rounded-xl border border-ink-100 bg-white px-3 py-2.5 text-sm">
            <option value="all">كل الحالات</option>
            <option value="new">جديد</option>
            <option value="under_review">قيد المراجعة</option>
            <option value="contacted">تم التواصل</option>
            <option value="accepted">مقبول</option>
            <option value="rejected">مرفوض</option>
          </select>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="min-h-[42px] min-w-0 w-full rounded-xl border border-ink-100 px-3 py-2.5 text-sm" />
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="min-h-[42px] min-w-0 w-full rounded-xl border border-ink-100 px-3 py-2.5 text-sm" />
          <select value={sort} onChange={(e) => setSort(e.target.value as SortOpt)} className="min-h-[42px] min-w-0 w-full rounded-xl border border-ink-100 bg-white px-3 py-2.5 text-sm">
            <option value="newest">الأحدث</option>
            <option value="oldest">الأقدم</option>
            <option value="az">أبجدي أ → ي</option>
            <option value="za">أبجدي ي → أ</option>
          </select>
        </div>
        <div className="flex flex-col gap-2 min-[380px]:flex-row min-[380px]:flex-wrap min-[380px]:items-center">
          <div className="flex flex-wrap gap-2">
            <button onClick={doExcel} className="inline-flex min-h-[36px] items-center justify-center rounded-full bg-teal-600 px-4 py-2 text-sm font-bold text-white hover:bg-teal-700">Excel</button>
            <button onClick={doPdf} className="inline-flex min-h-[36px] items-center justify-center rounded-full bg-raspberry-500 px-4 py-2 text-sm font-bold text-white hover:bg-raspberry-600">PDF</button>
            <button onClick={() => printTable('staff-table')} className="inline-flex min-h-[36px] items-center justify-center rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-bold text-ink-700 hover:bg-ink-50">طباعة</button>
          </div>
          {selected.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 pt-2 min-[380px]:border-0 min-[380px]:pt-0">
              <span className="text-sm font-medium text-ink-600">{selected.length} محدد</span>
              <button onClick={handleDeleteSelected} className="inline-flex min-h-[36px] items-center justify-center rounded-full bg-raspberry-100 px-4 py-2 text-sm font-bold text-raspberry-700 hover:bg-raspberry-200">حذف المحدد</button>
            </div>
          )}
        </div>

        <div id="staff-table" className="-mx-3 overflow-hidden sm:mx-0 sm:rounded-xl sm:border sm:border-ink-100">
          <div className="overflow-x-auto overscroll-x-contain">
            <table className="w-full min-w-[980px] border-collapse text-sm">
              <thead>
                <tr className="bg-ink-800 text-white">
                  <th className="p-2.5 text-center"><input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="h-4 w-4" aria-label="تحديد الكل" /></th>
                  {columns.map((c) => <th key={c} className="whitespace-nowrap p-2.5 text-center text-xs font-bold sm:text-sm">{c}</th>)}
                  <th className="whitespace-nowrap p-2.5 text-center text-xs font-bold sm:text-sm">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? <tr><td colSpan={11} className="p-8 text-center text-ink-400">لا توجد نتائج</td></tr> : filtered.map((r) => (
                  <tr key={r.id} className="border-b border-ink-100 hover:bg-cream-50">
                    <td className="p-2 text-center"><input type="checkbox" checked={selected.includes(r.id)} onChange={() => toggleSelect(r.id)} className="h-4 w-4" /></td>
                    <td className="p-2 text-center"><button onClick={() => setDetail(r)} className="block max-w-[130px] truncate font-bold text-raspberry-600 hover:underline">{r.fullName}</button></td>
                    <td className="whitespace-nowrap p-2 text-center text-xs"><bdi dir="ltr">{r.phone}</bdi></td>
                    <td className="p-2 text-center text-xs"><span className="block max-w-[120px] truncate">{r.currentEmployer}</span></td>
                    <td className="p-2 text-center text-xs"><span className="block max-w-[120px] truncate">{r.currentRole}</span></td>
                    <td className="p-2 text-center text-xs"><span className="block max-w-[160px] truncate">{r.reasonToJoin}</span></td>
                    <td className="whitespace-nowrap p-2 text-center text-xs">{r.wantsToJoinList === 'yes' ? 'نعم' : 'لا'}</td>
                    <td className="p-2 text-center text-xs"><span className="block max-w-[180px] truncate">{r.futureTopics}</span></td>
                    <td className="p-2 text-center">
                      <select value={r.status} onChange={(e) => handleStatus(r.id, e.target.value as StaffApplication['status'])} className="max-w-[120px] rounded-full border border-ink-100 bg-white px-2 py-1.5 text-xs">
                        <option value="new">جديد</option>
                        <option value="under_review">قيد المراجعة</option>
                        <option value="contacted">تم التواصل</option>
                        <option value="accepted">مقبول</option>
                        <option value="rejected">مرفوض</option>
                      </select>
                    </td>
                    <td className="whitespace-nowrap p-2 text-center text-xs">{new Date(r.createdAt).toLocaleDateString('ar-SA')}</td>
                    <td className="whitespace-nowrap p-2 text-center"><button onClick={() => handleDeleteOne(r.id)} className="inline-flex min-h-[32px] min-w-[44px] items-center justify-center rounded-full px-3 py-1 text-xs font-bold text-raspberry-600 hover:bg-raspberry-50">حذف</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 backdrop-blur-[1px] sm:p-4" onClick={() => setDetail(null)} role="dialog" aria-modal="true" aria-label="تفاصيل طلب العاملة">
          <div onClick={(e) => e.stopPropagation()} className="flex max-h-[92vh] max-h-[92dvh] w-full max-w-[92vw] flex-col overflow-hidden rounded-2xl bg-white shadow-xl sm:max-w-2xl">
            <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 py-4 sm:px-6">
              <h2 className="font-display text-base font-bold text-ink-800 sm:text-lg">تفاصيل طلب العاملة</h2>
              <button onClick={() => setDetail(null)} className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-400 hover:bg-gray-50 hover:text-ink-600" aria-label="إغلاق">✕</button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="grid gap-6 text-sm">
                <section className="min-w-0">
                  <h3 className="font-bold text-raspberry-600">البيانات الأساسية</h3>
                  <p className="mt-2 break-words"><span className="text-ink-400">الاسم:</span> {detail.fullName}</p>
                  <p className="break-words"><span className="text-ink-400">الجوال:</span> <bdi dir="ltr">{detail.phone}</bdi></p>
                </section>
                <section className="min-w-0">
                  <h3 className="font-bold text-raspberry-600">بيانات التواصل</h3>
                  <p className="mt-2 break-words"><span className="text-ink-400">جهة العمل:</span> {detail.currentEmployer}</p>
                  <p className="break-words"><span className="text-ink-400">طبيعة العمل:</span> {detail.currentRole}</p>
                </section>
                <section className="min-w-0">
                  <h3 className="font-bold text-raspberry-600">بيانات الطلب</h3>
                  <p className="mt-2 break-words"><span className="text-ink-400">سبب الالتحاق:</span> {detail.reasonToJoin}</p>
                  <p className="break-words"><span className="text-ink-400">قائمة حلول الطفولة:</span> {detail.wantsToJoinList === 'yes' ? 'نعم' : 'لا'}</p>
                  <p className="break-words"><span className="text-ink-400">البرامج المستقبلية:</span> {detail.futureTopics}</p>
                </section>
                <section className="min-w-0">
                  <h3 className="font-bold text-raspberry-600">تاريخ الطلب</h3>
                  <p className="mt-2 break-words text-sm">{new Date(detail.createdAt).toLocaleString('ar-SA')}</p>
                  <p className="break-words"><span className="text-ink-400">الحالة:</span> {detail.status}</p>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
