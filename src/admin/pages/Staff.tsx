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
    <div className="space-y-4">
      <h1 className="font-display text-xl font-bold text-ink-800">طلبات العاملات — {filtered.length} / {raw.length}</h1>
      <div className="rounded-2xl bg-white p-4 shadow-card space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث بالاسم أو الجوال..." className="rounded-xl border border-ink-100 px-3 py-2 text-sm" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-xl border border-ink-100 px-3 py-2 text-sm">
            <option value="all">كل الحالات</option>
            <option value="new">جديد</option>
            <option value="under_review">قيد المراجعة</option>
            <option value="contacted">تم التواصل</option>
            <option value="accepted">مقبول</option>
            <option value="rejected">مرفوض</option>
          </select>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="rounded-xl border border-ink-100 px-3 py-2 text-sm" />
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="rounded-xl border border-ink-100 px-3 py-2 text-sm" />
          <select value={sort} onChange={(e) => setSort(e.target.value as SortOpt)} className="rounded-xl border border-ink-100 px-3 py-2 text-sm">
            <option value="newest">الأحدث</option>
            <option value="oldest">الأقدم</option>
            <option value="az">أبجدي أ → ي</option>
            <option value="za">أبجدي ي → أ</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={doExcel} className="rounded-full bg-teal-600 px-4 py-1.5 text-sm font-bold text-white">Excel</button>
          <button onClick={doPdf} className="rounded-full bg-raspberry-500 px-4 py-1.5 text-sm font-bold text-white">PDF</button>
          <button onClick={() => printTable('staff-table')} className="rounded-full border border-ink-200 px-4 py-1.5 text-sm font-bold text-ink-700">طباعة</button>
          {selected.length > 0 && (
            <>
              <span className="ms-2 text-sm text-ink-600">{selected.length} محدد</span>
              <button onClick={handleDeleteSelected} className="rounded-full bg-raspberry-100 px-4 py-1.5 text-sm font-bold text-raspberry-700">حذف المحدد</button>
            </>
          )}
        </div>

        <div id="staff-table" className="overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse text-sm">
            <thead>
              <tr className="bg-ink-800 text-white">
                <th className="p-2"><input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} /></th>
                {columns.map((c) => <th key={c} className="p-2 text-center">{c}</th>)}
                <th className="p-2">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? <tr><td colSpan={11} className="p-8 text-center text-ink-400">لا توجد نتائج</td></tr> : filtered.map((r) => (
                <tr key={r.id} className="border-b border-ink-100 hover:bg-cream-50">
                  <td className="p-2 text-center"><input type="checkbox" checked={selected.includes(r.id)} onChange={() => toggleSelect(r.id)} /></td>
                  <td className="p-2 text-center"><button onClick={() => setDetail(r)} className="font-bold text-raspberry-600 hover:underline">{r.fullName}</button></td>
                  <td className="p-2 text-center"><bdi dir="ltr">{r.phone}</bdi></td>
                  <td className="p-2 text-center">{r.currentEmployer}</td>
                  <td className="p-2 text-center">{r.currentRole}</td>
                  <td className="p-2 text-center text-xs">{r.reasonToJoin}</td>
                  <td className="p-2 text-center">{r.wantsToJoinList === 'yes' ? 'نعم' : 'لا'}</td>
                  <td className="p-2 text-center text-xs max-w-[180px] truncate">{r.futureTopics}</td>
                  <td className="p-2 text-center">
                    <select value={r.status} onChange={(e) => handleStatus(r.id, e.target.value as StaffApplication['status'])} className="rounded-full border border-ink-100 px-2 py-1 text-xs">
                      <option value="new">جديد</option>
                      <option value="under_review">قيد المراجعة</option>
                      <option value="contacted">تم التواصل</option>
                      <option value="accepted">مقبول</option>
                      <option value="rejected">مرفوض</option>
                    </select>
                  </td>
                  <td className="p-2 text-center text-xs">{new Date(r.createdAt).toLocaleDateString('ar-SA')}</td>
                  <td className="p-2 text-center"><button onClick={() => handleDeleteOne(r.id)} className="text-xs text-raspberry-600">حذف</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setDetail(null)}>
          <div onClick={(e) => e.stopPropagation()} className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white p-6">
            <div className="flex justify-between">
              <h2 className="font-display text-lg font-bold">تفاصيل طلب العاملة</h2>
              <button onClick={() => setDetail(null)} className="text-ink-400">✕</button>
            </div>
            <div className="mt-6 grid gap-6 text-sm">
              <section>
                <h3 className="font-bold text-raspberry-600">البيانات الأساسية</h3>
                <p className="mt-2"><span className="text-ink-400">الاسم:</span> {detail.fullName}</p>
                <p><span className="text-ink-400">الجوال:</span> <bdi dir="ltr">{detail.phone}</bdi></p>
              </section>
              <section>
                <h3 className="font-bold text-raspberry-600">بيانات التواصل</h3>
                <p className="mt-2"><span className="text-ink-400">جهة العمل:</span> {detail.currentEmployer}</p>
                <p><span className="text-ink-400">طبيعة العمل:</span> {detail.currentRole}</p>
              </section>
              <section>
                <h3 className="font-bold text-raspberry-600">بيانات الطلب</h3>
                <p className="mt-2"><span className="text-ink-400">سبب الالتحاق:</span> {detail.reasonToJoin}</p>
                <p><span className="text-ink-400">قائمة حلول الطفولة:</span> {detail.wantsToJoinList === 'yes' ? 'نعم' : 'لا'}</p>
                <p><span className="text-ink-400">البرامج المستقبلية:</span> {detail.futureTopics}</p>
              </section>
              <section>
                <h3 className="font-bold text-raspberry-600">تاريخ الطلب</h3>
                <p className="mt-2 text-sm">{new Date(detail.createdAt).toLocaleString('ar-SA')}</p>
                <p><span className="text-ink-400">الحالة:</span> {detail.status}</p>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
