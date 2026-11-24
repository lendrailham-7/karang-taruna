import { useState } from 'react'
import { Loader2, Save } from 'lucide-react'
import Modal from './Modal'
import ImageUpload from './ImageUpload'

const SARAN_JABATAN = [
  'Pembina',
  'Ketua',
  'Wakil Ketua',
  'Sekretaris',
  'Bendahara',
  'Seksi Sosial',
  'Seksi Olahraga',
  'Seksi Seni & Budaya',
  'Seksi Humas',
  'Seksi Lingkungan Hidup',
  'Anggota',
]

export default function AnggotaForm({ open, item, onClose, onSubmit }) {
  const isEdit = Boolean(item)
  const [nama, setNama] = useState(item?.nama ?? '')
  const [jabatan, setJabatan] = useState(item?.jabatan ?? 'Anggota')
  const [foto, setFoto] = useState({ file: null, removed: false })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!nama.trim()) return setError('Nama wajib diisi.')
    if (!jabatan.trim()) return setError('Jabatan wajib diisi.')
    setSaving(true)
    try {
      await onSubmit({ nama: nama.trim(), jabatan: jabatan.trim() }, foto)
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
      size="md"
      title={isEdit ? 'Ubah Anggota' : 'Tambah Anggota'}
      description="Data anggota akan tampil di halaman publik."
      footer={
        <>
          <button type="button" onClick={onClose} disabled={saving} className="btn-outline">
            Batal
          </button>
          <button type="submit" form="form-anggota" disabled={saving} className="btn-primary">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'Menyimpan…' : 'Simpan'}
          </button>
        </>
      }
    >
      <form id="form-anggota" onSubmit={submit} className="space-y-5">
        <div className="text-center">
          <label className="label">Foto profil</label>
          <ImageUpload existingUrl={item?.foto_url} onChange={setFoto} rounded disabled={saving} />
        </div>

        <div>
          <label htmlFor="nama" className="label">
            Nama lengkap <span className="text-red-500">*</span>
          </label>
          <input
            id="nama"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            maxLength={150}
            required
            placeholder="cth. Budi Santoso"
            className="input"
          />
        </div>

        <div>
          <label htmlFor="jabatan" className="label">
            Jabatan <span className="text-red-500">*</span>
          </label>
          <input
            id="jabatan"
            list="saran-jabatan"
            value={jabatan}
            onChange={(e) => setJabatan(e.target.value)}
            required
            placeholder="cth. Ketua"
            className="input"
          />
          <datalist id="saran-jabatan">
            {SARAN_JABATAN.map((j) => (
              <option key={j} value={j} />
            ))}
          </datalist>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {SARAN_JABATAN.slice(1, 6).map((j) => (
              <button
                type="button"
                key={j}
                onClick={() => setJabatan(j)}
                className={`rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                  jabatan === j
                    ? 'bg-primary-700 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-primary-50 hover:text-primary-700'
                }`}
              >
                {j}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-100">{error}</p>
        )}
      </form>
    </Modal>
  )
}
