import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, description, children, footer, size = 'lg', locked = false }) {
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape' && !locked) onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose, locked])

  if (!open) return null

  const width = { sm: 'sm:max-w-md', md: 'sm:max-w-lg', lg: 'sm:max-w-2xl' }[size] ?? 'sm:max-w-2xl'

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 animate-fade-in bg-primary-950/60 backdrop-blur-sm"
        onClick={() => !locked && onClose()}
      />
      <div
        className={`relative flex max-h-[92vh] w-full ${width} animate-fade-up flex-col rounded-t-3xl bg-white shadow-2xl sm:animate-scale-in sm:rounded-2xl`}
      >
        <div className="mx-auto mt-2.5 h-1.5 w-12 rounded-full bg-stone-200 sm:hidden" />
        <div className="flex items-start justify-between gap-4 border-b border-stone-100 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-stone-900">{title}</h2>
            {description && <p className="mt-0.5 text-sm text-stone-500">{description}</p>}
          </div>
          <button
            onClick={onClose}
            disabled={locked}
            className="rounded-lg p-1.5 text-stone-400 transition hover:rotate-90 hover:bg-stone-100 hover:text-stone-700 disabled:opacity-40"
            aria-label="Tutup"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
        {footer && (
          <div className="flex flex-col-reverse gap-2 border-t border-stone-100 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
