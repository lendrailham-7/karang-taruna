import { useState } from 'react'
import { Loader2, Save } from 'lucide-react'
import Modal from './Modal'
import ImageUpload from './ImageUpload'
import { todayISO } from '../../lib/format'

export default function KegiatanForm({ open, item, onClose, onSubmit }) {
  const isEdit = Boolean(item)
  const [values, setValues] = useState(() => ({
    judul: item?.judul ?? '',
    deskripsi: item?.deskripsi ?? '',
    tanggal: item?.tanggal ?? todayISO(),
    lokasi: item?.lokasi ?? '',
  }))
  const [foto, setFoto] = useState({ file: null, removed: false })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!values.judul.trim()) return setError('Judul wajib diisi.')
    if (!values.tanggal) return setError('Tanggal wajib diisi.')
    setSaving(true)
    try {
      await onSubmit(
        {
          judul: values.judul.trim(),
          deskripsi: values.deskripsi.trim() || null,
          tanggal: values.tanggal,
          lokasi: values.lokasi.trim() || null,
        },
        foto,
      )
    } catch (err) {
      setError(err.message || 'Gagal menyimpan.')
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      locked={saving}
      title={isEdit ? 'Ubah Kegiatan' : 'Tambah Kegiatan'}
      description="Lengkapi informasi kegiatan di bawah ini."
      footer={
        <>
          <button type="button" onClick={onClose} disabled={saving} className="btn-outline">
            Batal
          </button>
          <button type="submit" form="form-kegiatan" disabled={saving} className="btn-primary">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Menyimpan…' : 'Simpan'}
          </button>
        </>
      }
    >
      <form id="form-kegiatan" onSubmit={submit} className="space-y-5">
        <div>
          <label className="label">Foto kegiatan</label>
          <ImageUpload existingUrl={item?.foto_url} onChange={setFoto} disabled={saving} />
        </div>

        <div>
          <label htmlFor="judul" className="label">
            Judul <span className="text-red-500">*</span>
          </label>
          <input
            id="judul"
            value={values.judul}
            onChange={set('judul')}
            maxLength={200}
            required
            placeholder="cth. Kerja Bakti Bersih Lingkungan"
            className="input"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="tanggal" className="label">
              Tanggal <span className="text-red-500">*</span>
            </label>
            <input
              id="tanggal"
              type="date"
              value={values.tanggal}
              onChange={set('tanggal')}
              required
              className="input"
            />
          </div>
          <div>
            <label htmlFor="lokasi" className="label">
              Lokasi
            </label>
            <input
              id="lokasi"
              value={values.lokasi}
              onChange={set('lokasi')}
              placeholder="cth. Lapangan RW 14"
              className="input"
            />
          </div>
        </div>

        <div>
          <label htmlFor="deskripsi" className="label">
            Deskripsi
          </label>
          <textarea
            id="deskripsi"
            rows={6}
            value={values.deskripsi}
            onChange={set('deskripsi')}
            placeholder="Ceritakan tentang kegiatan ini…"
            className="input resize-y"
          />
          <p className="mt-1 text-right text-xs text-stone-400">{values.deskripsi.length} karakter</p>
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-100">{error}</p>
        )}
      </form>
    </Modal>
  )
}
