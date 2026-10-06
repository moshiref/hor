import { useEffect, useMemo, useState } from 'react'
import { load, storageKeys } from '@/lib/storage'
import { mockApplicationsService } from '@/services/applications.service'
import { exportToExcel, exportToPDF, printTable } from '@/lib/exportUtils'
import { getDocumentUrl } from '@/lib/documentStore'
import type { StudentApplication } from '@/types/applications'
import { FileText, Image as ImageIcon, ExternalLink, Loader2, Eye } from 'lucide-react'

type SortOpt = 'newest' | 'oldest' | 'az' | 'za'

type DocItem = { label: string; path?: string | null }

function DocumentLink({ label, path }: DocItem) {
  const [url, setUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const isPdf = path?.toLowerCase().endsWith('.pdf') || path?.includes('.pdf')

  const handleOpen = async () => {
    if (!path) return
    setLoading(true)
    try {
      const signed = await getDocumentUrl(path)
      if (signed) {
        setUrl(signed)
        window.open(signed, '_blank', 'noopener,noreferrer')
      }
    } finally {
      setLoading(false)
    }
  }

  // preload url for preview if image
  useEffect(() => {
    if (!path) return
    let cancelled = false
    // try to get signed url silently
    getDocumentUrl(path).then((u) => {
      if (!cancelled && u) setUrl(u)
    })
    return () => {
      cancelled = true
    }
  }, [path])

  if (!path) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-dashed border-gray-200 bg-gray-50 px-3 py-2.5 text-xs text-gray-400">
        {isPdf ? <FileText size={14} /> : <ImageIcon size={14} />}
        <span className="break-words">{label}</span>
        <span className="ms-auto text-[11px]">غير مرفوع</span>
      </div>
    )
  }

  const isImage = !isPdf

  return (
    <div className="overflow-hidden rounded-xl border border-ink-100 bg-white">
      <div className="flex items-center gap-2 bg-cream-50 px-3 py-2">
        {isPdf ? <FileText size={14} className="shrink-0 text-raspberry-500" /> : <ImageIcon size={14} className="shrink-0 text-teal-600" />}
        <span className="min-w-0 flex-1 truncate text-xs font-bold text-ink-700">{label}</span>
        <button
          onClick={handleOpen}
          disabled={loading}
          className="inline-flex h-7 shrink-0 items-center gap-1 rounded-full bg-ink-800 px-3 text-[11px] font-bold text-white hover:bg-ink-900 disabled:opacity-50"
        >
          {loading ? <Loader2 size={12} className="animate-spin" /> : <ExternalLink size={12} />}
          {isPdf ? 'فتح الملف' : 'معاينة'}
        </button>
      </div>
      {isImage && url ? (
        <div className="p-2">
          <img src={url} alt={label} className="max-h-40 w-full rounded-lg object-contain bg-cream-50" loading="lazy" />
        </div>
      ) : isImage && !url ? (
        <div className="flex items-center justify-center p-4 text-xs text-gray-400">
          <Loader2 size={14} className="animate-spin me-1" /> جارٍ التحميل...
        </div>
      ) : null}
      <p className="truncate px-3 pb-2 text-[10px] text-gray-400" dir="ltr" title={path}>
        {path}
      </p>
    </div>
  )
}

export default function Students() {
  const [raw, setRaw] = useState<StudentApplication[]>(() => load<StudentApplication[]>(storageKeys.students, []))
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [sort, setSort] = useState<SortOpt>('newest')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selected, setSelected] = useState<string[]>([])
  const [detail, setDetail] = useState<StudentApplication | null>(null)

  useEffect(() => {
    // try sync from Supabase
    mockApplicationsService.listStudents().then((res) => {
      if (res.data) setRaw(res.data)
    }).catch(() => setRaw(load<StudentApplication[]>(storageKeys.students, [])))
    const onStorage = () => setRaw(load<StudentApplication[]>(storageKeys.students, []))
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const refresh = () => {
    // prefer supabase if available, else local
    mockApplicationsService.listStudents().then((r) => {
      if (r.data) setRaw(r.data)
      else setRaw(load<StudentApplication[]>(storageKeys.students, []))
    }).catch(() => setRaw(load<StudentApplication[]>(storageKeys.students, [])))
  }

  const filtered = useMemo(() => {
    let arr = [...raw]
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      arr = arr.filter((r) => `${r.studentName} ${r.guardianName} ${r.guardianPhone} ${r.motherPhone ?? ''} ${r.fatherPhone ?? ''} ${r.district}`.toLowerCase().includes(q))
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
    if (sort === 'az') arr.sort((a, b) => a.studentName.localeCompare(b.studentName, 'ar'))
    if (sort === 'za') arr.sort((a, b) => b.studentName.localeCompare(a.studentName, 'ar'))
    return arr
  }, [raw, search, dateFrom, dateTo, sort, statusFilter])

  const toggleSelect = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map((r) => r.id))

  const handleStatus = async (id: string, status: StudentApplication['status']) => {
    await mockApplicationsService.updateStudentStatus(id, status)
    refresh()
    if (detail?.id === id) setDetail({ ...detail, status })
  }

  const handleDeleteSelected = async () => {
    if (!selected.length || !confirm(`حذف ${selected.length} طلب؟`)) return
    await mockApplicationsService.deleteStudents(selected)
    setSelected([])
    refresh()
  }

  const handleDeleteOne = async (id: string) => {
    if (!confirm('حذف هذا الطلب؟')) return
    await mockApplicationsService.deleteStudents([id])
    refresh()
    setDetail(null)
  }

  const columns = ['الطالب', 'الميلاد', 'الجنس', 'المرحلة', 'الفترة', 'ولي الأمر', 'الجوال', 'الحي', 'مواصلات', 'الحالة', 'التاريخ']

  const doExcel = () => {
    const rows = filtered.map((r) => ({
      الطالب: r.studentName,
      الميلاد: r.birthDate,
      الجنس: r.gender === 'male' ? 'ذكر' : 'أنثى',
      المرحلة: r.stage,
      الفترة: r.period,
      'ولي الأمر': r.guardianName,
      الجوال: r.guardianPhone,
      'رقم الأم': r.motherPhone ?? '—',
      'رقم الأب': r.fatherPhone ?? '—',
      'جوال آخر': r.otherPhone ?? '—',
      الحي: r.district,
      مواصلات: r.needsTransport === 'yes' ? 'نعم' : 'لا',
      الحالة: r.status,
      التاريخ: new Date(r.createdAt).toLocaleDateString('ar-SA'),
    }))
    exportToExcel(rows, [...columns.slice(0, 7), 'رقم الأم', 'رقم الأب', 'جوال آخر', ...columns.slice(7)], 'طلاب')
  }

  const doPdf = () => {
    const rows = filtered.map((r) => [
      r.studentName,
      r.birthDate,
      r.gender === 'male' ? 'ذكر' : 'أنثى',
      r.stage,
      r.period,
      r.guardianName,
      r.guardianPhone,
      r.motherPhone ?? '—',
      r.fatherPhone ?? '—',
      r.district,
      r.needsTransport === 'yes' ? 'نعم' : 'لا',
      r.status,
      new Date(r.createdAt).toLocaleDateString('ar-SA'),
    ])
    const filters = []
    if (search) filters.push(`بحث: ${search}`)
    if (statusFilter !== 'all') filters.push(`حالة: ${statusFilter}`)
    if (dateFrom) filters.push(`من: ${dateFrom}`)
    if (dateTo) filters.push(`إلى: ${dateTo}`)
    filters.push(`ترتيب: ${sort}`)
    exportToPDF(rows, [...columns], 'طلبات الطلاب', filters)
  }

  return (
    <div className="min-w-0 space-y-4">
      <h1 className="break-words font-display text-lg font-bold leading-tight text-ink-800 sm:text-xl">طلبات الطلاب — {filtered.length} / {raw.length}</h1>

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
            <button onClick={doExcel} className="inline-flex min-h-[36px] items-center justify-center rounded-full bg-teal-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600">Excel</button>
            <button onClick={doPdf} className="inline-flex min-h-[36px] items-center justify-center rounded-full bg-raspberry-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-raspberry-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-raspberry-600">PDF</button>
            <button onClick={() => printTable('students-table')} className="inline-flex min-h-[36px] items-center justify-center rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-bold text-ink-700 transition-colors hover:bg-ink-50">طباعة</button>
          </div>
          {selected.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 pt-2 min-[380px]:border-0 min-[380px]:pt-0">
              <span className="text-sm font-medium text-ink-600">{selected.length} محدد</span>
              <button onClick={handleDeleteSelected} className="inline-flex min-h-[36px] items-center justify-center rounded-full bg-raspberry-100 px-4 py-2 text-sm font-bold text-raspberry-700 transition-colors hover:bg-raspberry-200">حذف المحدد</button>
            </div>
          )}
        </div>

        <div id="students-table" className="-mx-3 overflow-hidden sm:mx-0 sm:rounded-xl sm:border sm:border-ink-100">
          <div className="overflow-x-auto overscroll-x-contain">
            <table className="w-full min-w-[920px] border-collapse text-sm">
              <thead>
                <tr className="bg-ink-800 text-white">
                  <th className="p-2.5 text-center"><input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="h-4 w-4" aria-label="تحديد الكل" /></th>
                  {columns.map((c) => (
                    <th key={c} className="whitespace-nowrap p-2.5 text-center text-xs font-bold sm:text-sm">{c}</th>
                  ))}
                  <th className="whitespace-nowrap p-2.5 text-center text-xs font-bold sm:text-sm">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={13} className="p-8 text-center text-ink-400">لا توجد نتائج</td></tr>
                ) : (
                  filtered.map((r) => (
                    <tr key={r.id} className="border-b border-ink-100 hover:bg-cream-50">
                      <td className="p-2 text-center"><input type="checkbox" checked={selected.includes(r.id)} onChange={() => toggleSelect(r.id)} className="h-4 w-4" /></td>
                      <td className="p-2 text-center"><button onClick={() => setDetail(r)} className="max-w-[130px] truncate font-bold text-raspberry-600 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-raspberry-500">{r.studentName}</button></td>
                      <td className="whitespace-nowrap p-2 text-center text-xs"><bdi dir="ltr">{r.birthDate}</bdi></td>
                      <td className="whitespace-nowrap p-2 text-center text-xs">{r.gender === 'male' ? 'ذكر' : 'أنثى'}</td>
                      <td className="whitespace-nowrap p-2 text-center text-xs">{r.stage}</td>
                      <td className="whitespace-nowrap p-2 text-center text-xs">{r.period}</td>
                      <td className="p-2 text-center text-xs"><span className="block max-w-[110px] truncate">{r.guardianName}</span></td>
                      <td className="whitespace-nowrap p-2 text-center text-xs"><bdi dir="ltr">{r.guardianPhone}</bdi></td>
                      <td className="p-2 text-center text-xs"><span className="block max-w-[90px] truncate">{r.district}</span></td>
                      <td className="whitespace-nowrap p-2 text-center text-xs">{r.needsTransport === 'yes' ? 'نعم' : 'لا'}</td>
                      <td className="p-2 text-center">
                        <select value={r.status} onChange={(e) => handleStatus(r.id, e.target.value as StudentApplication['status'])} className="max-w-[120px] rounded-full border border-ink-100 bg-white px-2 py-1.5 text-xs focus:border-raspberry-200 focus:outline-none focus:ring-2 focus:ring-raspberry-100">
                          <option value="new">جديد</option>
                          <option value="under_review">قيد المراجعة</option>
                          <option value="contacted">تم التواصل</option>
                          <option value="accepted">مقبول</option>
                          <option value="rejected">مرفوض</option>
                        </select>
                      </td>
                      <td className="whitespace-nowrap p-2 text-center text-xs">{new Date(r.createdAt).toLocaleDateString('ar-SA')}</td>
                      <td className="whitespace-nowrap p-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => setDetail(r)} className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-ink-50 text-ink-700 hover:bg-ink-100" aria-label="عرض التفاصيل"><Eye size={12} /></button>
                          <button onClick={() => handleDeleteOne(r.id)} className="inline-flex min-h-[32px] min-w-[44px] items-center justify-center rounded-full px-3 py-1 text-xs font-bold text-raspberry-600 transition-colors hover:bg-raspberry-50">حذف</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 backdrop-blur-[1px] sm:p-4" onClick={() => setDetail(null)} role="dialog" aria-modal="true" aria-label="تفاصيل الطلب">
          <div onClick={(e) => e.stopPropagation()} className="flex max-h-[92vh] max-h-[92dvh] w-full max-w-[92vw] flex-col overflow-hidden rounded-2xl bg-white shadow-xl sm:max-w-3xl">
            <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 py-4 sm:px-6">
              <h2 className="font-display text-base font-bold text-ink-800 sm:text-lg">تفاصيل الطلب — {detail.studentName}</h2>
              <button onClick={() => setDetail(null)} className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-gray-50 hover:text-ink-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-raspberry-500" aria-label="إغلاق">✕</button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="grid gap-6">
                <section className="min-w-0 rounded-xl bg-cream-50 p-4">
                  <h3 className="text-sm font-bold text-raspberry-600">البيانات الأساسية</h3>
                  <div className="mt-3 grid gap-3 text-sm min-[480px]:grid-cols-2">
                    <p className="break-words"><span className="text-ink-400">الطالب:</span> {detail.studentName}</p>
                    <p className="break-words"><span className="text-ink-400">الميلاد:</span> <bdi dir="ltr">{detail.birthDate}</bdi></p>
                    <p><span className="text-ink-400">الجنس:</span> {detail.gender === 'male' ? 'ذكر' : 'أنثى'}</p>
                    <p className="break-words"><span className="text-ink-400">المرحلة:</span> {detail.stage}</p>
                    <p className="break-words"><span className="text-ink-400">الفترة:</span> {detail.period}</p>
                  </div>
                </section>

                <section className="min-w-0 rounded-xl border border-ink-100 bg-white p-4">
                  <h3 className="text-sm font-bold text-raspberry-600">بيانات التواصل</h3>
                  <div className="mt-3 grid gap-3 text-sm min-[480px]:grid-cols-2">
                    <p className="break-words"><span className="text-ink-400">ولي الأمر:</span> {detail.guardianName}</p>
                    <p className="break-words"><span className="text-ink-400">الجوال الرئيسي:</span> <bdi dir="ltr">{detail.guardianPhone}</bdi></p>
                    <p className="break-words"><span className="text-ink-400">رقم الأم:</span> <bdi dir="ltr">{detail.motherPhone ?? '—'}</bdi></p>
                    <p className="break-words"><span className="text-ink-400">رقم الأب:</span> <bdi dir="ltr">{detail.fatherPhone ?? '—'}</bdi></p>
                    <p className="break-words"><span className="text-ink-400">جوال آخر:</span> <bdi dir="ltr">{detail.otherPhone ?? '—'}</bdi></p>
                    <p className="break-words"><span className="text-ink-400">الحي:</span> {detail.district}</p>
                    <p><span className="text-ink-400">مواصلات:</span> {detail.needsTransport === 'yes' ? 'نعم' : 'لا'}</p>
                  </div>
                </section>

                <section className="min-w-0">
                  <h3 className="text-sm font-bold text-raspberry-600">الملاحظات</h3>
                  <p className="mt-2 break-words text-sm"><span className="text-ink-400">صحية:</span> {detail.healthNotes || '—'}</p>
                  <p className="mt-1 break-words text-sm"><span className="text-ink-400">إضافية:</span> {detail.extraNotes || '—'}</p>
                </section>

                <section className="min-w-0 rounded-xl border border-amber-100 bg-amber-50/40 p-4">
                  <h3 className="flex items-center gap-1.5 text-sm font-bold text-amber-700"><FileText size={14} /> مستندات وبيانات ولي الأمر</h3>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <DocumentLink label="الكشف الصحي للطفل" path={detail.healthReportUrl} />
                    <DocumentLink label="هوية الطفل / كرت العائلة" path={detail.childIdUrl} />
                    <DocumentLink label="هوية ولي الأمر" path={detail.guardianIdUrl} />
                    <DocumentLink label="صورة الطفل" path={detail.childPhotoUrl} />
                    <DocumentLink label="شهادة الميلاد" path={detail.birthCertificateUrl} />
                    <DocumentLink label="كروكي موقع السكن" path={detail.locationSketchUrl} />
                    <DocumentLink label="إثبات التحويل" path={detail.paymentProofUrl} />
                  </div>
                  <p className="mt-3 text-[11px] text-gray-400">الملفات محفوظة في التخزين الخاص — يتم توليد رابط آمن مؤقت عند المعاينة (صلاحية ساعة). لا يتم عرضها للعامة.</p>
                </section>

                <section className="min-w-0 text-xs text-gray-500">
                  <p>تاريخ الطلب: {new Date(detail.createdAt).toLocaleString('ar-SA')}</p>
                  <p>الحالة: {detail.status}</p>
                  <p>الإقرار بالشروط: {detail.termsAcceptedAt ? new Date(detail.termsAcceptedAt).toLocaleString('ar-SA') : '—'}</p>
                  <p className="mt-1 break-all">المعرّف: <span className="font-mono text-[11px]">{detail.id}</span></p>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
