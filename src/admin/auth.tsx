import { createContext, useContext, useEffect, useState } from 'react'
import { load, save, remove, storageKeys } from '@/lib/storage'

type Session = { email: string; role: 'admin'; loginAt: string }

const ADMIN_EMAIL = 'admin@hor-alain.local'
const ADMIN_PASS = 'Admin@123'

function getSession(): Session | null {
  return load<Session | null>(storageKeys.session, null)
}

function isValidSession(s: Session | null): boolean {
  if (!s) return false
  const age = Date.now() - new Date(s.loginAt).getTime()
  // 12 hours
  return age < 12 * 60 * 60 * 1000
}

type AuthCtx = {
  session: Session | null
  isAuthed: boolean
  login: (email: string, pass: string) => boolean
  logout: () => void
}

const Ctx = createContext<AuthCtx>(null!)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => getSession())

  useEffect(() => {
    if (!isValidSession(session)) {
      setSession(null)
      remove(storageKeys.session)
    }
  }, [])

  const login = (email: string, pass: string): boolean => {
    if (email.trim() === ADMIN_EMAIL && pass === ADMIN_PASS) {
      const s: Session = { email: ADMIN_EMAIL, role: 'admin', loginAt: new Date().toISOString() }
      save(storageKeys.session, s)
      setSession(s)
      return true
    }
    return false
  }

  const logout = () => {
    remove(storageKeys.session)
    setSession(null)
  }

  return <Ctx.Provider value={{ session, isAuthed: isValidSession(session), login, logout }}>{children}</Ctx.Provider>
}

export function useAuth(): AuthCtx {
  return useContext(Ctx)
}

export const ADMIN_CREDENTIALS_HINT = { email: ADMIN_EMAIL, pass: ADMIN_PASS }
