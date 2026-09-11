import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, ADMIN_CREDENTIALS_HINT } from '@/admin/auth'

export default function Login() {
  const { login, isAuthed } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState(ADMIN_CREDENTIALS_HINT.email)
  const [pass, setPass] = useState(ADMIN_CREDENTIALS_HINT.pass)
  const [err, setErr] = useState('')

  if (isAuthed) {
    nav('/admin', { replace: true })
    return null
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (login(email, pass)) nav('/admin', { replace: true })
    else setErr('بيانات الدخول غير صحيحة')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-100 p-4" dir="rtl">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-card">
        <h1 className="font-display text-2xl font-bold text-ink-800">دخول لوحة التحكم</h1>
        <p className="mt-2 text-sm text-ink-600">استخدم بيانات المسؤول للدخول</p>
        <div className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-bold text-ink-700">البريد الإلكتروني</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl border border-ink-100 px-4 py-3 text-sm" dir="ltr" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-bold text-ink-700">كلمة المرور</span>
            <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} className="rounded-xl border border-ink-100 px-4 py-3 text-sm" dir="ltr" />
          </label>
          {err && <p className="text-sm text-raspberry-600" role="alert">{err}</p>}
          <button type="submit" className="rounded-full bg-raspberry-500 py-3 text-base font-bold text-white hover:bg-raspberry-600">دخول</button>
          <p className="text-center text-xs text-ink-400">افتراضي: {ADMIN_CREDENTIALS_HINT.email} / {ADMIN_CREDENTIALS_HINT.pass}</p>
        </div>
      </form>
    </div>
  )
}
