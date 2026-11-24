import { useState } from 'react'
import { Crown, Layers, Loader2, Save, UserCheck } from 'lucide-react'
import Modal from './Modal'
import ImageUpload from './ImageUpload'
import {
  DAFTAR_DIVISI,
  JABATAN_INTI,
  PERAN_DIVISI,
  formatJabatanDivisi,
  parseJabatan,
} from '../../config/struktur'

export default function AnggotaForm({ open, item, onClose, onSubmit }) {
  const isEdit = Boolean(item)
  const parsed = parseJabatan(item?.jabatan)

  const [nama, setNama] = useState(item?.nama ?? '')
  const [tipe, setTipe] = useState(parsed.kategori === 'divisi' ? 'divisi' : 'inti')
  const [jabatanInti, setJabatanInti] = useState(
    parsed.kategori === 'divisi' ? 'Ketua' : item?.jabatan || 'Ketua',
  )
  const [divisi, setDivisi] = useState(parsed.divisi ?? DAFTAR_DIVISI[0].nama)
  const [peranDivisi, setPeranDivisi] = useState(parsed.peranDivisi ?? 'Anggota')
  const [foto, setFoto] = useState({ file: null, removed: false })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const finalJabatan = tipe === 'divisi' ? formatJabatanDivisi(divisi, peranDivisi) : jabatanInti.trim()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!nama.trim()) return setError('Nama wajib diisi.')
    if (!finalJabatan) return setError('Jabatan wajib diisi.')
    setSaving(true)
    try {
      await onSubmit({ nama: nama.trim(), jabatan: finalJabatan }, foto)
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
      description="Tentukan posisi struktural atau divisi beserta perannya."
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
          <span className="label">
            Kelompok Struktural <span className="text-red-500">*</span>
          </span>
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-stone-100 p-1.5">
            <button
              type="button"
              onClick={() => setTipe('inti')}
              className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition ${
                tipe === 'inti'
                  ? 'bg-primary-700 text-white shadow'
                  : 'text-stone-600 hover:text-primary-800'
              }`}
            >
              <Crown className="h-4 w-4" /> Pengurus Inti
            </button>
            <button
              type="button"
              onClick={() => setTipe('divisi')}
              className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition ${
                tipe === 'divisi'
                  ? 'bg-primary-700 text-white shadow'
                  : 'text-stone-600 hover:text-primary-800'
              }`}
            >
              <Layers className="h-4 w-4" /> Divisi
            </button>
          </div>
        </div>

        {tipe === 'inti' ? (
          <div>
            <label htmlFor="jabatan-inti" className="label">
              Jabatan Struktural <span className="text-red-500">*</span>
            </label>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {JABATAN_INTI.map((j) => {
                const active = jabatanInti.trim().toLowerCase() === j.label.toLowerCase()
                return (
                  <button
                    type="button"
                    key={j.id}
                    onClick={() => setJabatanInti(j.label)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition active:scale-95 ${
                      active
                        ? 'bg-accent-400 text-primary-950 shadow-sm ring-1 ring-accent-500'
                        : 'bg-stone-100 text-stone-700 hover:bg-primary-50 hover:text-primary-700'
                    }`}
                  >
                    {j.label}
                  </button>
                )
              })}
            </div>
            <input
              id="jabatan-inti"
              value={jabatanInti}
              onChange={(e) => setJabatanInti(e.target.value)}
              required
              placeholder="cth. Ketua, Sekretaris, Bendahara"
              className="input"
            />
            <p className="mt-1 text-xs text-stone-400">
              Pilih tombol di atas atau ketik manual jika ada penomoran (mis. Sekretaris 2).
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <span className="label">
                Pilih Divisi <span className="text-red-500">*</span>
              </span>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {DAFTAR_DIVISI.map((d) => {
                  const active = divisi === d.nama
                  return (
                    <button
                      type="button"
                      key={d.id}
                      onClick={() => setDivisi(d.nama)}
                      className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition active:scale-95 ${
                        active
                          ? 'bg-primary-700 text-white shadow-md shadow-primary-900/15'
                          : 'bg-stone-100 text-stone-700 hover:bg-primary-50 hover:text-primary-700'
                      }`}
                    >
                      {d.nama}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <span className="label">
                Peran di Divisi {divisi} <span className="text-red-500">*</span>
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                {PERAN_DIVISI.map((p) => {
                  const active = peranDivisi === p
                  const isKoor = p === 'Koordinator'
                  return (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setPeranDivisi(p)}
                      className={`flex items-center gap-2.5 rounded-xl border-2 px-3.5 py-3 text-left transition active:scale-95 ${
                        active
                          ? isKoor
                            ? 'border-accent-500 bg-accent-50 text-primary-950'
                            : 'border-primary-600 bg-primary-50 text-primary-900'
                          : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                      }`}
                    >
                      <span
                        className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                          active
                            ? isKoor
                              ? 'bg-accent-400 text-primary-950'
                              : 'bg-primary-700 text-white'
                            : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        {isKoor ? <Crown className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-bold">{p}</p>
                        <p className="truncate text-[11px] opacity-75">
                          {isKoor ? 'Ketua divisi' : 'Tim divisi'}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="rounded-xl bg-stone-50 px-3.5 py-2.5 text-xs text-stone-600 ring-1 ring-stone-200">
              Akan tampil sebagai: <strong className="text-primary-800">{finalJabatan}</strong>
            </div>
          </div>
        )}

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-100">{error}</p>
        )}
      </form>
    </Modal>
  )
}
