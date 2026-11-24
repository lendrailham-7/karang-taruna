import { AlertTriangle, Loader2, Trash2 } from 'lucide-react'
import Modal from './Modal'

export default function ConfirmDialog({ open, onClose, onConfirm, loading, title, message, confirmLabel = 'Ya, hapus' }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      locked={loading}
      size="sm"
      title={title}
      footer={
        <>
          <button onClick={onClose} disabled={loading} className="btn-outline">
            Batal
          </button>
          <button onClick={onConfirm} disabled={loading} className="btn-danger">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            {loading ? 'Menghapus…' : confirmLabel}
          </button>
        </>
      }
    >
      <div className="flex gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-red-50 text-red-600 ring-8 ring-red-50/50">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div className="text-sm leading-relaxed text-stone-600">{message}</div>
      </div>
    </Modal>
  )
}
