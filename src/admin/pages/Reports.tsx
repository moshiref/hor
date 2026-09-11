import { useMemo, useState } from 'react'
import { load, storageKeys } from '@/lib/storage'
import { exportToExcel, exportToPDF, printTable } from '@/lib/exportUtils'
import type { StudentApplication, StaffApplication } from '@/types/applications'

type ReportType = 'students' | 'staff'

export default function Reports() {
  const [type, setType] = useState<ReportType>('students')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [status, setStatus] = useState('all')
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest')

  const students = load<StudentApplication[]>(storageKeys.students, [])
  const staff = load<StaffApplication[]>(storageKeys.staff, [])

  const data = useMemo(() => {
    const base = (type === 'students' ? students : staff) as (StudentApplication | StaffApplication)[]
    let arr = [...base]
    if (status !== 'all') arr = arr.filter((r: unknown) => (r as { status: string }).status === status)
    if (dateFrom) arr = arr.filter((r) => new Date((r as { createdAt: string }).createdAt) >= new Date(dateFrom))
    if (dateTo) {
      const to = new Date(dateTo)
      to.setHours(23, 59, 59, 999)
      arr = arr.filter((r) => new Date((r as { createdAt: string }).createdAt) <= to)
    }
    arr.sort((a, b) => sort === 'newest' ? +new Date((b as { createdAt: string }).createdAt) - +new Date((a as { createdAt: string }).createdAt) : +new Date((a as { createdAt: string }).createdAt) - +new Date((b as { createdAt: string }).createdAt))
    return arr
  }, [type, students, staff, status, dateFrom, dateTo, sort])

  const title = type === 'students' ? 'تقرير طلبات الطلاب' : 'تقرير طلبات العاملات'

  const doExcel = () => {
    if (type === 'students') {
      const rows = (data as StudentApplication[]).map((r) => ({
        الطالب: r.studentName,
        'ولي الأمر': r.guardianName,
        الجوال: r.guardianPhone,
        الحالة: r.status,
        التاريخ: new Date(r.createdAt).toLocaleDateString('ar-SA'),
      }))
      exportToExcel(rows, ['الطالب', 'ولي الأمر', 'الجوال', 'الحالة', 'التاريخ'], 'تقرير_طلاب')
    } else {
      const rows = (data as StaffApplication[]).map((r) => ({
        الاسم: r.fullName,
        الجوال: r.phone,
        'جهة العمل': r.currentEmployer ?? '',
        الحالة: r.status,
        التاريخ: new Date(r.createdAt).toLocaleDateString('ar-SA'),
      }))
      exportToExcel(rows, ['الاسم', 'الجوال', 'جهة العمل', 'الحالة', 'التاريخ'], 'تقرير_عاملات')
    }
  }

  const doPdf = () => {
    const cols = type === 'students' ? ['الطالب', 'ولي الأمر', 'الحالة', 'التاريخ'] : ['الاسم', 'جهة العمل', 'الحالة', 'التاريخ']
    const rows = type === 'students'
      ? (data as StudentApplication[]).map((r) => [r.studentName, r.guardianName, r.status, new Date(r.createdAt).toLocaleDateString('ar-SA')])
      : (data as StaffApplication[]).map((r) => [r.fullName, r.currentEmployer ?? '', r.status, new Date(r.createdAt).toLocaleDateString('ar-SA')])
    const filters = [`النوع: ${type === 'students' ? 'طلاب' : 'عاملات'}`, `حالة: ${status}`, `من: ${dateFrom || '—'}`, `إلى: ${dateTo || '—'}`, `ترتيب: ${sort}`]
    exportToPDF(rows as (string | number)[][], cols, title, filters)
  }

  return (
    <div className="min-w-0 space-y-4 sm:space-y-6">
      <h1 className="break-words font-display text-lg font-bold text-ink-800 sm:text-xl">التقارير</h1>

      <div className="min-w-0 space-y-4 overflow-hidden rounded-2xl bg-white p-3 shadow-card sm:p-4">
        <div className="grid min-w-0 gap-2.5 sm:gap-3 grid-cols-1 min-[430px]:grid-cols-2 lg:grid-cols-5">
          <select value={type} onChange={(e) => setType(e.target.value as ReportType)} className="min-h-[42px] min-w-0 w-full rounded-xl border border-ink-100 bg-white px-3 py-2.5 text-sm">
            <option value="students">طلاب</option>
            <option value="staff">عاملات</option>
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="min-h-[42px] min-w-0 w-full rounded-xl border border-ink-100 bg-white px-3 py-2.5 text-sm">
            <option value="all">كل الحالات</option>
            <option value="new">جديد</option>
            <option value="under_review">قيد المراجعة</option>
            <option value="contacted">تم التواصل</option>
            <option value="accepted">مقبول</option>
            <option value="rejected">مرفوض</option>
          </select>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="min-h-[42px] min-w-0 w-full rounded-xl border border-ink-100 px-3 py-2.5 text-sm" />
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="min-h-[42px] min-w-0 w-full rounded-xl border border-ink-100 px-3 py-2.5 text-sm" />
          <select value={sort} onChange={(e) => setSort(e.target.value as 'newest' | 'oldest')} className="min-h-[42px] min-w-0 w-full rounded-xl border border-ink-100 bg-white px-3 py-2.5 text-sm">
            <option value="newest">الأحدث</option>
            <option value="oldest">الأقدم</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={doExcel} className="inline-flex min-h-[36px] items-center justify-center rounded-full bg-teal-600 px-4 py-2 text-sm font-bold text-white">Excel</button>
          <button onClick={doPdf} className="inline-flex min-h-[36px] items-center justify-center rounded-full bg-raspberry-500 px-4 py-2 text-sm font-bold text-white">PDF</button>
          <button onClick={() => printTable('report-table')} className="inline-flex min-h-[36px] items-center justify-center rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-bold text-ink-700">طباعة</button>
        </div>

        <div id="report-table" className="min-w-0 overflow-hidden rounded-xl border border-ink-100 p-3 sm:p-4">
          <h2 className="break-words text-center font-display text-base font-bold text-ink-800 sm:text-lg">{title}</h2>
          <p className="mt-1 break-words text-center text-xs text-ink-400">تاريخ التقرير: {new Date().toLocaleString('ar-SA')} — {data.length} نتيجة</p>
          <div className="-mx-3 mt-4 overflow-x-auto overscroll-x-contain sm:mx-0">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <thead>
                <tr className="bg-ink-800 text-white">
                  {(type === 'students' ? ['الطالب', 'ولي الأمر', 'الجوال', 'الحالة', 'التاريخ'] : ['الاسم', 'الجوال', 'جهة العمل', 'الحالة', 'التاريخ']).map((c) => (
                    <th key={c} className="whitespace-nowrap p-2.5 text-center text-xs font-bold sm:text-sm">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? <tr><td colSpan={5} className="p-6 text-center text-ink-400">لا توجد بيانات</td></tr> : data.slice(0, 100).map((r: unknown) => {
                  const s = r as StudentApplication & StaffApplication
                  return (
                    <tr key={(s as { id: string }).id} className="border-b border-ink-100">
                      <td className="p-2 text-center text-xs sm:text-sm"><span className="block max-w-[140px] truncate sm:max-w-none sm:whitespace-nowrap">{(s as StudentApplication).studentName ?? (s as StaffApplication).fullName}</span></td>
                      <td className="p-2 text-center text-xs sm:text-sm"><span className="block max-w-[120px] truncate sm:max-w-none sm:whitespace-nowrap">{(s as StudentApplication).guardianName ?? (s as StaffApplication).currentEmployer}</span></td>
                      <td className="whitespace-nowrap p-2 text-center text-xs sm:text-sm"><bdi dir="ltr">{(s as StudentApplication).guardianPhone ?? (s as StaffApplication).phone}</bdi></td>
                      <td className="whitespace-nowrap p-2 text-center text-xs sm:text-sm">{(s as { status: string }).status}</td>
                      <td className="whitespace-nowrap p-2 text-center text-xs">{new Date((s as { createdAt: string }).createdAt).toLocaleDateString('ar-SA')}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
