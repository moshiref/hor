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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    const ok = await login(email, pass)
    if (ok) nav('/admin', { replace: true })
    else setErr('بيانات الدخول غير صحيحة — تأكد من إنشاء المستخدم في Supabase Dashboard > Authentication')
  }

  return (
    <div className="flex min-h-screen min-w-0 items-center justify-center bg-cream-100 p-3 sm:p-4" dir="rtl">
      <form onSubmit={onSubmit} className="w-full max-w-md min-w-0 rounded-2xl bg-white p-5 shadow-card sm:p-8">
        <h1 className="break-words font-display text-xl font-bold text-ink-800 sm:text-2xl">دخول لوحة التحكم</h1>
        <p className="mt-2 break-words text-sm text-ink-600">استخدم بيانات المسؤول للدخول</p>
        <div className="mt-6 flex min-w-0 flex-col gap-4">
          <label className="flex min-w-0 flex-col gap-1">
            <span className="text-sm font-bold text-ink-700">البريد الإلكتروني</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="min-w-0 w-full rounded-xl border border-ink-100 px-4 py-3 text-sm focus:border-raspberry-200 focus:outline-none focus:ring-2 focus:ring-raspberry-100" dir="ltr" />
          </label>
          <label className="flex min-w-0 flex-col gap-1">
            <span className="text-sm font-bold text-ink-700">كلمة المرور</span>
            <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} className="min-w-0 w-full rounded-xl border border-ink-100 px-4 py-3 text-sm focus:border-raspberry-200 focus:outline-none focus:ring-2 focus:ring-raspberry-100" dir="ltr" />
          </label>
          {err && <p className="break-words text-sm text-raspberry-600" role="alert">{err}</p>}
          <button type="submit" className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-raspberry-500 py-3 text-base font-bold text-white transition-colors hover:bg-raspberry-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-raspberry-600">دخول</button>
          <p className="break-words text-center text-xs text-ink-400">افتراضي: {ADMIN_CREDENTIALS_HINT.email} / {ADMIN_CREDENTIALS_HINT.pass}</p>
        </div>
      </form>
    </div>
  )
}
