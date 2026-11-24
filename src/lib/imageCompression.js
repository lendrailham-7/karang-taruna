/**
 * Kompres gambar di browser sebelum diupload agar hemat kuota Supabase gratis.
 * - Sisi terpanjang maksimal `maxSize` px (default 800)
 * - Ukuran file target <= `maxBytes` (default 200 KB)
 * - Output WebP (jika didukung browser) atau JPEG
 */
export async function compressImage(file, { maxSize = 800, maxBytes = 200 * 1024 } = {}) {
  if (!file || !file.type?.startsWith('image/')) {
    throw new Error('File yang dipilih bukan gambar.')
  }

  const image = await loadImage(file)
  let { width, height } = fitSize(image.naturalWidth || image.width, image.naturalHeight || image.height, maxSize)

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  const mime = (await supportsWebp()) ? 'image/webp' : 'image/jpeg'
  let quality = 0.85
  let blob = null

  // Loop: turunkan kualitas dulu, lalu dimensi jika masih terlalu besar
  for (let attempt = 0; attempt < 12; attempt++) {
    canvas.width = width
    canvas.height = height
    ctx.fillStyle = '#ffffff' // latar putih untuk PNG transparan -> JPEG
    ctx.fillRect(0, 0, width, height)
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(image, 0, 0, width, height)

    blob = await canvasToBlob(canvas, mime, quality)
    if (blob.size <= maxBytes) break

    if (quality > 0.5) {
      quality -= 0.1
    } else {
      width = Math.round(width * 0.85)
      height = Math.round(height * 0.85)
    }
  }

  if (image.close) image.close()
  return blob
}

function fitSize(w, h, max) {
  if (w <= max && h <= max) return { width: w, height: h }
  const ratio = w > h ? max / w : max / h
  return { width: Math.round(w * ratio), height: Math.round(h * ratio) }
}

async function loadImage(file) {
  // createImageBitmap otomatis menghormati orientasi EXIF di browser modern
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' })
    } catch {
      /* fallback ke <img> */
    }
  }
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Gagal membaca gambar. Coba file lain.'))
    }
    img.src = url
  })
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Gagal mengompres gambar.'))),
      type,
      quality,
    )
  })
}

let webpSupport
async function supportsWebp() {
  if (webpSupport !== undefined) return webpSupport
  try {
    const c = document.createElement('canvas')
    c.width = c.height = 1
    const b = await canvasToBlob(c, 'image/webp', 0.8)
    webpSupport = b.type === 'image/webp'
  } catch {
    webpSupport = false
  }
  return webpSupport
}

export function formatBytes(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}
