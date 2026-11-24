import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Pencil, Search, Trash2, UserPlus, Users, X } from 'lucide-react'
import {
  createAnggota,
  deleteAnggota,
  getAnggota,
  simpanDenganFoto,
  updateAnggota,
} from '../../lib/api'
import { useAsync } from '../../hooks/useAsync'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useToast } from '../../context/ToastContext'
import Avatar from '../../components/Avatar'
import AnggotaForm from '../../components/admin/AnggotaForm'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import EmptyState from '../../components/EmptyState'
import ErrorState from '../../components/ErrorState'
import { TableRowSkeleton } from '../../components/Skeleton'

export default function AnggotaAdmin() {
  useDocumentTitle('Kelola Anggota')
  const toast = useToast()
  const [params, setParams] = useSearchParams()
  const { data, loading, error, reload } = useAsync(() => getAnggota(), [])
  const [query, setQuery] = useState('')
  const [formState, setFormState] = useState({ open: false, item: null })
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (params.get('baru') === '1') {
      setFormState({ open: true, item: null })
      setParams({}, { replace: true })
    }
  }, [params, setParams])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return data ?? []
    return (data ?? []).filter(
      (a) => a.nama?.toLowerCase().includes(q) || a.jabatan?.toLowerCase().includes(q),
    )
  }, [data, query])

  const openNew = () => setFormState({ open: true, item: null })
  const openEdit = (item) => setFormState({ open: true, item })
  const closeForm = () => setFormState({ open: false, item: null })

  const handleSave = async (values, foto) => {
    const editing = formState.item
    await simpanDenganFoto({
      folder: 'anggota',
      oldUrl: editing?.foto_url ?? null,
      newFile: foto.file,
      removeFoto: foto.removed,
      save: (foto_url) =>
        editing
          ? updateAnggota(editing.id, { ...values, foto_url })
          : createAnggota({ ...values, foto_url }),
    })
    toast.success(editing ? 'Data anggota berhasil diperbarui.' : 'Anggota berhasil ditambahkan.')
    closeForm()
    reload()
  }

  const handleDelete = async () => {
    if (!toDelete) return
    setDeleting(true)
    try {
      await deleteAnggota(toDelete)
      toast.success('Anggota dan fotonya berhasil dihapus.')
      setToDelete(null)
      reload()
    } catch (err) {
      toast.error(err.message || 'Gagal menghapus anggota.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary-900 sm:text-3xl">Kelola Anggota</h1>
          <p className="mt-1 text-sm text-stone-500">Atur daftar pengurus dan anggota Karang Taruna 14.</p>
        </div>
        <button onClick={openNew} className="btn-primary shrink-0">
          <UserPlus className="h-4 w-4" /> Tambah Anggota
        </button>
      </div>

      {/* Pencarian */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama atau jabatan…"
            className="input !rounded-full !pl-11 !pr-10"
            aria-label="Cari anggota"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-stone-400 transition hover:bg-stone-100 hover:text-stone-600"
              aria-label="Hapus pencarian"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {!loading && !error && data?.length > 0 && (
          <p className="text-sm text-stone-500">
            Menampilkan <strong className="text-stone-800">{filtered.length}</strong> dari{' '}
            <strong className="text-stone-800">{data.length}</strong> anggota
          </p>
        )}
      </div>

      {/* Daftar */}
      <div className="card overflow-hidden">
        {loading ? (
          <TableRowSkeleton rows={5} />
        ) : error ? (
          <div className="p-6">
            <ErrorState error={error} onRetry={reload} />
          </div>
        ) : !data?.length ? (
          <div className="p-6">
            <EmptyState
              icon={Users}
              title="Belum ada anggota"
              description="Tambahkan pengurus atau anggota pertama Anda."
              action={
                <button onClick={openNew} className="btn-primary">
                  <UserPlus className="h-4 w-4" /> Tambah Anggota
                </button>
              }
            />
          </div>
        ) : !filtered.length ? (
          <div className="p-6">
            <EmptyState
              icon={Search}
              title="Tidak ditemukan"
              description={`Tidak ada anggota yang cocok dengan “${query}”.`}
              action={
                <button onClick={() => setQuery('')} className="btn-outline">
                  Reset pencarian
                </button>
              }
            />
          </div>
        ) : (
          <ul className="divide-y divide-stone-100">
            {filtered.map((item) => (
              <li
                key={item.id}
                className="flex flex-col gap-4 p-4 transition hover:bg-stone-50/80 sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <Avatar
                    src={item.foto_url}
                    name={item.nama}
                    size="md"
                    className="shrink-0 ring-2 ring-accent-300"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-bold text-stone-900">{item.nama}</h3>
                    <span className="mt-1 inline-block rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-700">
                      {item.jabatan || 'Anggota'}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center justify-end gap-1.5 border-t border-stone-100 pt-3 sm:border-t-0 sm:pt-0">
                  <button
                    onClick={() => openEdit(item)}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-primary-700 ring-1 ring-primary-200 transition hover:bg-primary-50"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Ubah
                  </button>
                  <button
                    onClick={() => setToDelete(item)}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-600 ring-1 ring-red-200 transition hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Hapus
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {formState.open && (
        <AnggotaForm
          key={formState.item?.id ?? 'new'}
          open
          item={formState.item}
          onClose={closeForm}
          onSubmit={handleSave}
        />
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Hapus Anggota?"
        message={
          <>
            Data anggota <strong>“{toDelete?.nama}”</strong>
            {toDelete?.foto_url ? ' beserta foto profilnya di penyimpanan' : ''} akan dihapus secara permanen dan tidak
            dapat dikembalikan.
          </>
        }
      />
    </div>
  )
}
