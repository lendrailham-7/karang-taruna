import { useEffect, useRef, useState } from 'react'
import { ImagePlus, Loader2, RefreshCw, Trash2, UploadCloud } from 'lucide-react'
import { compressImage, formatBytes } from '../../lib/imageCompression'

/**
 * Input foto dengan drag & drop, preview, dan kompresi otomatis di browser.
 * @param {{
 *   existingUrl?: string|null,
 *   onChange: (state: { file: Blob|null, removed: boolean }) => void,
 *   rounded?: boolean,
 *   disabled?: boolean,
 * }} props
 */
export default function ImageUpload({ existingUrl = null, onChange, rounded = false, disabled = false }) {
  const inputRef = useRef(null)
  const [preview, setPreview] = useState(existingUrl)
  const [info, setInfo] = useState(null)
  const [compressing, setCompressing] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const objectUrlRef = useRef(null)

  useEffect(
    () => () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    },
    [],
  )

  const handleFile = async (file) => {
    if (!file) return
    setError('')
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar (JPG, PNG, WebP, dll).')
      return
    }
    if (file.size > 15 * 1024 * 1024) {
      setError('Ukuran gambar terlalu besar (maks 15 MB sebelum kompresi).')
      return
    }
    setCompressing(true)
    try {
      const blob = await compressImage(file, { maxSize: 800, maxBytes: 200 * 1024 })
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
      const url = URL.createObjectURL(blob)
      objectUrlRef.current = url
      setPreview(url)
      setInfo({ before: file.size, after: blob.size })
      onChange({ file: blob, removed: false })
    } catch (e) {
      setError(e.message || 'Gagal memproses gambar.')
    } finally {
      setCompressing(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const remove = () => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    objectUrlRef.current = null
    setPreview(null)
    setInfo(null)
    onChange({ file: null, removed: Boolean(existingUrl) })
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    if (disabled) return
    handleFile(e.dataTransfer.files?.[0])
  }

  const shape = rounded ? 'h-40 w-40 rounded-full' : 'aspect-[16/10] w-full rounded-2xl'

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={disabled}
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {preview ? (
        <div className={`flex flex-col gap-3 ${rounded ? 'items-center' : ''}`}>
          <div className={`group relative overflow-hidden bg-stone-100 ring-1 ring-stone-200 ${shape}`}>
            <img src={preview} alt="Pratinjau foto" className="h-full w-full object-cover" />
            {compressing && (
              <div className="absolute inset-0 grid place-items-center bg-white/70">
                <Loader2 className="h-7 w-7 animate-spin text-primary-700" />
              </div>
            )}
          </div>
          {info && (
            <p className="text-xs text-stone-500">
              Dikompres: <span className="line-through">{formatBytes(info.before)}</span> →{' '}
              <strong className="text-emerald-600">{formatBytes(info.after)}</strong>
            </p>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              disabled={disabled || compressing}
              onClick={() => inputRef.current?.click()}
              className="btn-outline !px-3 !py-2 text-xs"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Ganti
            </button>
            <button
              type="button"
              disabled={disabled || compressing}
              onClick={remove}
              className="btn !px-3 !py-2 text-xs text-red-600 ring-1 ring-red-200 hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5" /> Hapus foto
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled || compressing}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed p-6 text-center transition ${shape} ${
            rounded ? 'mx-auto' : ''
          } ${
            dragging
              ? 'scale-[1.02] border-accent-500 bg-accent-50'
              : 'border-stone-300 bg-stone-50 hover:border-primary-400 hover:bg-primary-50/50'
          }`}
        >
          {compressing ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              <span className="text-sm font-medium text-stone-600">Mengompres…</span>
            </>
          ) : (
            <>
              {dragging ? (
                <UploadCloud className="h-8 w-8 text-accent-600" />
              ) : (
                <ImagePlus className="h-8 w-8 text-primary-500" />
              )}
              <span className="text-sm font-semibold text-stone-700">
                {rounded ? 'Pilih foto' : 'Klik atau seret foto ke sini'}
              </span>
              {!rounded && (
                <span className="text-xs text-stone-500">Otomatis dikompres ≤ 800px & ≤ 200 KB</span>
              )}
            </>
          )}
        </button>
      )}

      {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
    </div>
  )
}
