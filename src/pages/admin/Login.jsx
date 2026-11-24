import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, LogIn, Mail } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { isSupabaseConfigured } from '../../lib/supabase'
import { site } from '../../config/site'
import Logo from '../../components/Logo'
import ConfigNotice from '../../components/ConfigNotice'
import { FullScreenLoader } from '../../components/admin/ProtectedRoute'

export default function Login() {
  useDocumentTitle('Masuk Admin')
  const { user, loading, signIn } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (loading) return <FullScreenLoader />
  if (user) return <Navigate to={location.state?.from || '/admin'} replace />

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await signIn(email.trim(), password)
      toast.success('Selamat datang kembali!')
      navigate(location.state?.from || '/admin', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative isolate grid min-h-screen place-items-center overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 px-4 py-10">
      <div className="bg-batik absolute inset-0 -z-10 opacity-60" />
      <div className="absolute -right-32 -top-32 -z-10 h-96 w-96 animate-float rounded-full bg-accent-500/20 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 -z-10 h-96 w-96 rounded-full bg-primary-500/30 blur-3xl" />

      <div className="w-full max-w-md animate-fade-up">
        <Link
          to="/"
          className="group mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-200 transition hover:text-accent-300"
        >
          <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" /> Kembali ke situs
        </Link>

        <div className="rounded-3xl bg-white p-7 shadow-2xl sm:p-9">
          <div className="flex flex-col items-center text-center">
            <Logo className="h-20 w-20 animate-float" />
            <h1 className="mt-4 font-display text-2xl font-bold text-primary-900">Panel Admin</h1>
            <p className="mt-1 text-sm text-stone-500">{site.fullName}</p>
          </div>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="email" className="label">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@email.com"
                  className="input !pl-11"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="label">
                Kata sandi
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input !pl-11 !pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-stone-400 transition hover:text-stone-600"
                  aria-label={showPass ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="animate-fade-in rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-100">
                {error}
              </p>
            )}

            <button type="submit" disabled={submitting || !isSupabaseConfigured} className="btn-primary w-full !py-3">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
              {submitting ? 'Memproses…' : 'Masuk'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-stone-400">
            Akun admin dibuat oleh pengelola melalui dashboard Supabase.
          </p>
        </div>
      </div>
      <ConfigNotice />
    </div>
  )
}
