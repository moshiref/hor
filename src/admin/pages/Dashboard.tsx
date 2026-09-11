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
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-ink-800">لوحة التحكم</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-card">
          <p className="text-sm text-ink-400">طلبات الطلاب</p>
          <p className="mt-2 text-3xl font-bold text-ink-800">{students.length}</p>
          <Link to="/admin/students" className="mt-3 inline-block text-sm font-bold text-raspberry-600">عرض الطلبات ←</Link>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-card">
          <p className="text-sm text-ink-400">طلبات العاملات</p>
          <p className="mt-2 text-3xl font-bold text-ink-800">{staff.length}</p>
          <Link to="/admin/staff" className="mt-3 inline-block text-sm font-bold text-raspberry-600">عرض الطلبات ←</Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-card">
          <h2 className="font-display text-base font-bold text-ink-800">آخر طلبات الطلاب</h2>
          {lastStudents.length === 0 ? <p className="mt-4 text-sm text-ink-400">لا توجد طلبات بعد</p> : (
            <ul className="mt-4 space-y-2">
              {lastStudents.map((s) => (
                <li key={s.id} className="flex justify-between rounded-xl bg-cream-50 px-4 py-3 text-sm">
                  <span>{s.studentName} — {s.guardianName}</span>
                  <span className="text-ink-400">{new Date(s.createdAt).toLocaleDateString('ar-SA')}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-card">
          <h2 className="font-display text-base font-bold text-ink-800">آخر طلبات العاملات</h2>
          {lastStaff.length === 0 ? <p className="mt-4 text-sm text-ink-400">لا توجد طلبات بعد</p> : (
            <ul className="mt-4 space-y-2">
              {lastStaff.map((s) => (
                <li key={s.id} className="flex justify-between rounded-xl bg-cream-50 px-4 py-3 text-sm">
                  <span>{s.fullName} — {s.currentRole}</span>
                  <span className="text-ink-400">{new Date(s.createdAt).toLocaleDateString('ar-SA')}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
