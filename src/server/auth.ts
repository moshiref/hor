/**
 * Auth guard — server-side only.
 * يُستخدم لحماية /api/admin/* و /admin
 */

export type SessionUser = {
  id: string
  email: string
  role: 'super_admin' | 'admin' | 'viewer'
}

// Placeholder — في الإنتاج: verify JWT / session cookie مقابل DB
export function requireAuth(request: Request): SessionUser | null {
  const cookie = request.headers.get('cookie') ?? ''
  // TODO: verify session cookie, return user or null
  void cookie
  return null
}

export function requireRole(user: SessionUser | null, allowed: SessionUser['role'][]): boolean {
  if (!user) return false
  return allowed.includes(user.role)
}
