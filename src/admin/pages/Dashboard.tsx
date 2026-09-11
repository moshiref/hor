import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { load, storageKeys } from '@/lib/storage'
import type { StudentApplication, StaffApplication } from '@/types/applications'

export default function Dashboard() {
  const [students, setStudents] = useState<StudentApplication[]>([])
  const [staff, setStaff] = useState<StaffApplication[]>([])

  useEffect(() => {
    setStudents(load<StudentApplication[]>(storageKeys.students, []))
    setStaff(load<StaffApplication[]>(storageKeys.staff, []))
  }, [])

  const lastStudents = [...students].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 5)
  const lastStaff = [...staff].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 5)

  return (
    <div className="min-w-0 space-y-4 sm:space-y-6">
      <h1 className="font-display truncate text-xl font-bold text-ink-800 sm:text-2xl">لوحة التحكم</h1>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        <div className="min-w-0 rounded-2xl bg-white p-5 shadow-card sm:p-6">
          <p className="text-sm text-ink-400">طلبات الطلاب</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-ink-800 sm:text-3xl">{students.length}</p>
          <Link to="/admin/students" className="mt-3 inline-flex min-h-[36px] items-center text-sm font-bold text-raspberry-600 hover:text-raspberry-700">عرض الطلبات ←</Link>
        </div>
        <div className="min-w-0 rounded-2xl bg-white p-5 shadow-card sm:p-6">
          <p className="text-sm text-ink-400">طلبات العاملات</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-ink-800 sm:text-3xl">{staff.length}</p>
          <Link to="/admin/staff" className="mt-3 inline-flex min-h-[36px] items-center text-sm font-bold text-raspberry-600 hover:text-raspberry-700">عرض الطلبات ←</Link>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <div className="min-w-0 rounded-2xl bg-white p-4 shadow-card sm:p-6">
          <h2 className="font-display text-sm font-bold text-ink-800 sm:text-base">آخر طلبات الطلاب</h2>
          {lastStudents.length === 0 ? <p className="mt-4 text-sm text-ink-400">لا توجد طلبات بعد</p> : (
            <ul className="mt-4 space-y-2">
              {lastStudents.map((s) => (
                <li key={s.id} className="flex min-w-0 flex-col gap-1 rounded-xl bg-cream-50 px-3 py-3 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-4">
                  <span className="min-w-0 break-words font-medium text-ink-700 sm:truncate">{s.studentName} — {s.guardianName}</span>
                  <span className="shrink-0 text-xs text-ink-400 sm:text-sm">{new Date(s.createdAt).toLocaleDateString('ar-SA')}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="min-w-0 rounded-2xl bg-white p-4 shadow-card sm:p-6">
          <h2 className="font-display text-sm font-bold text-ink-800 sm:text-base">آخر طلبات العاملات</h2>
          {lastStaff.length === 0 ? <p className="mt-4 text-sm text-ink-400">لا توجد طلبات بعد</p> : (
            <ul className="mt-4 space-y-2">
              {lastStaff.map((s) => (
                <li key={s.id} className="flex min-w-0 flex-col gap-1 rounded-xl bg-cream-50 px-3 py-3 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-4">
                  <span className="min-w-0 break-words font-medium text-ink-700 sm:truncate">{s.fullName} — {s.currentRole}</span>
                  <span className="shrink-0 text-xs text-ink-400 sm:text-sm">{new Date(s.createdAt).toLocaleDateString('ar-SA')}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
