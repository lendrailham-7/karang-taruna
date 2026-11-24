import { Navigate, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export function FullScreenLoader({ label = 'Memuat…' }) {
  return (
    <div className="grid min-h-screen place-items-center bg-stone-50">
      <div className="flex flex-col items-center gap-3 text-primary-700">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm font-medium text-stone-500">{label}</p>
      </div>
    </div>
  )
}

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <FullScreenLoader label="Memeriksa sesi…" />
  if (!user) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  return children
}
