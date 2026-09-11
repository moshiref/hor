import { createContext, useContext, useEffect, useState } from 'react'
import { load, save, remove, storageKeys } from '@/lib/storage'
import { hasSupabase, supabase } from '@/lib/supabase'

type Session = { email: string; role: 'admin'; loginAt: string }

const ADMIN_EMAIL = 'admin@hor-alain.local'
const ADMIN_PASS = 'Admin@123'

function getSession(): Session | null {
  return load<Session | null>(storageKeys.session, null)
}

function isValidSession(s: Session | null): boolean {
  if (!s) return false
  const age = Date.now() - new Date(s.loginAt).getTime()
  return age < 12 * 60 * 60 * 1000
}

type AuthCtx = {
  session: Session | null
  isAuthed: boolean
  login: (email: string, pass: string) => Promise<boolean>
  logout: () => Promise<void>
  isSupabase: boolean
}

const Ctx = createContext<AuthCtx>(null!)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => getSession())
  const [supaAuthed, setSupaAuthed] = useState(false)
  const isSupabase = hasSupabase()

  useEffect(() => {
    if (isSupabase && supabase) {
      supabase.auth.getSession().then(({ data }) => setSupaAuthed(!!data.session))
      const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSupaAuthed(!!s))
      return () => sub.subscription.unsubscribe()
    } else {
      if (!isValidSession(session)) {
        setSession(null)
        remove(storageKeys.session)
      }
    }
  }, [])

  const login = async (email: string, pass: string): Promise<boolean> => {
    if (isSupabase && supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pass })
      if (!error) return true
      return false
    }
    if (email.trim() === ADMIN_EMAIL && pass === ADMIN_PASS) {
      const s: Session = { email: ADMIN_EMAIL, role: 'admin', loginAt: new Date().toISOString() }
      save(storageKeys.session, s)
      setSession(s)
      return true
    }
    return false
  }

  const logout = async () => {
    if (isSupabase && supabase) {
      await supabase.auth.signOut()
      setSupaAuthed(false)
    }
    remove(storageKeys.session)
    setSession(null)
  }

  const isAuthed = isSupabase ? supaAuthed : isValidSession(session)

  return <Ctx.Provider value={{ session, isAuthed, login, logout, isSupabase }}>{children}</Ctx.Provider>
}

export function useAuth(): AuthCtx {
  return useContext(Ctx)
}

export const ADMIN_CREDENTIALS_HINT = { email: ADMIN_EMAIL, pass: ADMIN_PASS }
