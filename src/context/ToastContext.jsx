import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

const STYLES = {
  success: { icon: CheckCircle2, bar: 'bg-emerald-500', iconColor: 'text-emerald-500' },
  error: { icon: AlertTriangle, bar: 'bg-primary-600', iconColor: 'text-primary-600' },
  info: { icon: Info, bar: 'bg-accent-500', iconColor: 'text-accent-600' },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    (type, message) => {
      const id = ++idRef.current
      setToasts((list) => [...list, { id, type, message }])
      setTimeout(() => dismiss(id), 4000)
    },
    [dismiss],
  )

  const api = useMemo(
    () => ({
      success: (m) => push('success', m),
      error: (m) => push('error', m),
      info: (m) => push('info', m),
    }),
    [push],
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-4 sm:items-end"
      >
        {toasts.map((t) => {
          const { icon: Icon, bar, iconColor } = STYLES[t.type] ?? STYLES.info
          return (
            <div
              key={t.id}
              role="status"
              className="pointer-events-auto relative flex w-full max-w-sm animate-slide-in-right items-start gap-3 overflow-hidden rounded-xl bg-white p-4 pr-10 shadow-soft ring-1 ring-stone-200"
            >
              <span className={`absolute inset-y-0 left-0 w-1 ${bar}`} />
              <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconColor}`} />
              <p className="text-sm font-medium text-stone-700">{t.message}</p>
              <button
                onClick={() => dismiss(t.id)}
                className="absolute right-2 top-2 rounded-md p-1 text-stone-400 transition hover:bg-stone-100 hover:text-stone-600"
                aria-label="Tutup notifikasi"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast harus dipakai di dalam <ToastProvider>')
  return ctx
}
