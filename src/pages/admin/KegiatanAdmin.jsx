import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CalendarDays, CalendarPlus, ExternalLink, ImageOff, MapPin, Pencil, Search, Trash2, X } from 'lucide-react'
import {
  createKegiatan,
  deleteKegiatan,
  getKegiatan,
  simpanDenganFoto,
  updateKegiatan,
} from '../../lib/api'
import { formatTanggal, isUpcoming } from '../../lib/format'
import { useAsync } from '../../hooks/useAsync'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useToast } from '../../context/ToastContext'
import KegiatanForm from '../../components/admin/KegiatanForm'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import EmptyState from '../../components/EmptyState'
import ErrorState from '../../components/ErrorState'
import { TableRowSkeleton } from '../../components/Skeleton'

export default function KegiatanAdmin() {
  useDocumentTitle('Kelola Kegiatan')
  const toast = useToast()
  const [params, setParams] = useSearchParams()
  const { data, loading, error, reload } = useAsync(() => getKegiatan(), [])
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
      (k) =>
        k.judul?.toLowerCase().includes(q) ||
        k.lokasi?.toLowerCase().includes(q) ||
        k.deskripsi?.toLowerCase().includes(q),
    )
  }, [data, query])

  const openNew = () => setFormState({ open: true, item: null })
  const openEdit = (item) => setFormState({ open: true, item })
  const closeForm = () => setFormState({ open: false, item: null })

  const handleSave = async (values, foto) => {
    const editing = formState.item
    await simpanDenganFoto({
      folder: 'kegiatan',
      oldUrl: editing?.foto_url ?? null,
      newFile: foto.file,
      removeFoto: foto.removed,
      save: (foto_url) =>
        editing
          ? updateKegiatan(editing.id, { ...values, foto_url })
          : createKegiatan({ ...values, foto_url }),
    })
    toast.success(editing ? 'Kegiatan berhasil diperbarui.' : 'Kegiatan berhasil ditambahkan.')
    closeForm()
    reload()
  }

  const handleDelete = async () => {
    if (!toDelete) return
    setDeleting(true)
    try {
      await deleteKegiatan(toDelete)
      toast.success('Kegiatan dan fotonya berhasil dihapus.')
      setToDelete(null)
      reload()
    } catch (err) {
      toast.error(err.message || 'Gagal menghapus kegiatan.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary-900 sm:text-3xl">Kelola Kegiatan</h1>
          <p className="mt-1 text-sm text-stone-500">Tambah, ubah, atau hapus dokumentasi kegiatan Karang Taruna.</p>
        </div>
        <button onClick={openNew} className="btn-primary shrink-0">
          <CalendarPlus className="h-4 w-4" /> Tambah Kegiatan
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari judul atau lokasi…"
            className="input !rounded-full !pl-11 !pr-10"
            aria-label="Cari kegiatan"
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
            <strong className="text-stone-800">{data.length}</strong> kegiatan
          </p>
        )}
      </div>

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
              icon={CalendarDays}
              title="Belum ada kegiatan"
              description="Klik tombol di bawah untuk menambahkan kegiatan pertama."
              action={
                <button onClick={openNew} className="btn-primary">
                  <CalendarPlus className="h-4 w-4" /> Tambah Kegiatan
                </button>
              }
            />
          </div>
        ) : !filtered.length ? (
          <div className="p-6">
            <EmptyState
              icon={Search}
              title="Tidak ditemukan"
              description={`Tidak ada kegiatan yang cocok dengan “${query}”.`}
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
                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-primary-900/10 ring-1 ring-stone-200">
                    {item.foto_url ? (
                      <img src={item.foto_url} alt={item.judul} loading="lazy" className="h-full w-full object-cover" />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-stone-400">
                        <ImageOff className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate font-bold text-stone-900">{item.judul}</h3>
                      {isUpcoming(item.tanggal) && (
                        <span className="rounded-full bg-accent-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-800">
                          Akan Datang
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5 text-accent-600" />
                        {formatTanggal(item.tanggal)}
                      </span>
                      {item.lokasi && (
                        <span className="inline-flex min-w-0 items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-accent-600" />
                          <span className="truncate">{item.lokasi}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center justify-end gap-1.5 border-t border-stone-100 pt-3 sm:border-t-0 sm:pt-0">
                  <Link
                    to={`/kegiatan/${item.id}`}
                    target="_blank"
                    title="Lihat halaman publik"
                    className="rounded-lg p-2 text-stone-500 transition hover:bg-stone-100 hover:text-primary-700"
                    aria-label={`Lihat ${item.judul}`}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
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
        <KegiatanForm
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
        title="Hapus Kegiatan?"
        message={
          <>
            Kegiatan <strong>“{toDelete?.judul}”</strong>
            {toDelete?.foto_url ? ' beserta file fotonya di penyimpanan' : ''} akan dihapus secara permanen dan tidak
            dapat dikembalikan.
          </>
        }
      />
    </div>
  )
}
