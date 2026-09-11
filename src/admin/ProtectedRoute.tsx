import { Navigate } from 'react-router-dom'
import { useAuth } from '@/admin/auth'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthed } = useAuth()
  if (!isAuthed) return <Navigate to="/admin/login" replace />
  return <>{children}</>
}
