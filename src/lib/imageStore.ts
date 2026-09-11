/**
 * Real file storage — IndexedDB (not base64 in DB column)
 * يخزن الملف كـ Blob ثنائي في IndexedDB، ويُحفظ في siteConfig/siteContent مجرد مرجع idb://key
 * عند العرض يتم تحويله إلى objectURL مؤقت.
 */
import { imageSpecs, type ImageSpecKey } from '@/lib/imageSpecs'

const DB_NAME = 'hor_images'
const STORE = 'images'
const DB_VERSION = 1

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_SIZE = 4 * 1024 * 1024 // 4MB قبل الضغط
const MAX_DIM = 1600

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE)
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export function validateFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) return 'نوع الملف غير مدعوم — يسمح فقط JPG/PNG/WEBP'
  if (file.size > MAX_SIZE) return 'حجم الملف كبير جداً — الحد الأقصى 4MB'
  return null
}

export async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  const bmp = await createImageBitmap(file)
  const res = { width: bmp.width, height: bmp.height }
  bmp.close?.()
  return res
}

async function processForSpec(file: File, specKey: ImageSpecKey, rotateDeg = 0): Promise<{ blob: Blob; width: number; height: number }> {
  const spec = imageSpecs[specKey]
  let bmp = await createImageBitmap(file)
  let width = bmp.width
  let height = bmp.height

  // Handle rotation (swap dimensions for 90/270)
  const rot = ((rotateDeg % 360) + 360) % 360
  const isSwapped = rot === 90 || rot === 270

  // Step 1: Crop to aspect via center cover (no stretch)
  let srcX = 0
  let srcY = 0
  let srcW = width
  let srcH = height

  if (spec.aspect !== null) {
    const targetAspect = spec.aspect
    const srcAspect = width / height
    if (Math.abs(srcAspect - targetAspect) > 0.01) {
      if (srcAspect > targetAspect) {
        // wider — crop width
        srcW = Math.round(height * targetAspect)
        srcX = Math.round((width - srcW) / 2)
      } else {
        srcH = Math.round(width / targetAspect)
        srcY = Math.round((height - srcH) / 2)
      }
    }
  }

  // Step 2: Determine target size (respect max, use targetWidth/Height)
  let targetW = spec.targetWidth
  let targetH = spec.targetHeight
  if (isSwapped) [targetW, targetH] = [targetH, targetW]

  // If spec is contain (logo), fit inside without crop, preserve aspect
  if (spec.display === 'contain') {
    const fitRatio = Math.min(targetW / srcW, targetH / srcH, 1)
    targetW = Math.round(srcW * fitRatio)
    targetH = Math.round(srcH * fitRatio)
    // For contain, we will draw centered on canvas with transparent/white bg
  }

  const canvas = document.createElement('canvas')
  canvas.width = targetW
  canvas.height = targetH
  const ctx = canvas.getContext('2d')!

  if (spec.display === 'contain') {
    ctx.fillStyle = '#FFFFFF'
    // keep transparent for PNG
    if (file.type !== 'image/png') ctx.fillRect(0, 0, targetW, targetH)
    const dx = Math.round((targetW - srcW * Math.min(targetW / srcW, targetH / srcH)) / 2)
    const dy = Math.round((targetH - srcH * Math.min(targetW / srcW, targetH / srcH)) / 2)
    const drawW = Math.round(srcW * Math.min(targetW / srcW, targetH / srcH))
    const drawH = Math.round(srcH * Math.min(targetW / srcW, targetH / srcH))
    if (rot) {
      ctx.save()
      ctx.translate(targetW / 2, targetH / 2)
      ctx.rotate((rot * Math.PI) / 180)
      ctx.drawImage(bmp, srcX, srcY, srcW, srcH, -drawW / 2, -drawH / 2, drawW, drawH)
      ctx.restore()
    } else {
      ctx.drawImage(bmp, srcX, srcY, srcW, srcH, dx, dy, drawW, drawH)
    }
  } else {
    // cover — src already cropped to aspect, draw to fill canvas
    if (rot) {
      ctx.save()
      ctx.translate(targetW / 2, targetH / 2)
      ctx.rotate((rot * Math.PI) / 180)
      const drawW = isSwapped ? targetH : targetW
      const drawH = isSwapped ? targetW : targetH
      ctx.drawImage(bmp, srcX, srcY, srcW, srcH, -drawW / 2, -drawH / 2, drawW, drawH)
      ctx.restore()
    } else {
      ctx.drawImage(bmp, srcX, srcY, srcW, srcH, 0, 0, targetW, targetH)
    }
  }

  bmp.close?.()

  // Compress iteratively to meet maxSizeKB
  let quality = 0.85
  let blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b!), file.type === 'image/png' ? 'image/png' : 'image/jpeg', quality))
  let attempts = 0
  while (blob.size > spec.maxSizeKB * 1024 && quality > 0.5 && attempts < 3) {
    quality -= 0.15
    const next: Blob = await new Promise((res) =>
      canvas.toBlob((b) => res(b!), 'image/jpeg', quality),
    )
    if (next.size < blob.size) blob = next
    attempts++
  }

  return { blob, width: targetW, height: targetH }
}

export async function saveImageWithSpec(key: string, file: File, specKey: ImageSpecKey, rotateDeg = 0): Promise<{ ref: string; width: number; height: number; size: number }> {
  const err = validateFile(file)
  if (err) throw new Error(err)
  const { blob, width, height } = await processForSpec(file, specKey, rotateDeg)
  try {
    const { hasSupabase, supabase } = await import('@/lib/supabase')
    if (hasSupabase() && supabase) {
      const { error } = await supabase.storage.from('images').upload(key, blob, { contentType: file.type === 'image/png' ? 'image/png' : 'image/jpeg', upsert: true, cacheControl: '31536000' })
      if (!error) {
        const { data } = supabase.storage.from('images').getPublicUrl(key)
        return { ref: data.publicUrl, width, height, size: blob.size }
      }
    }
  } catch {
    // fallback
  }
  const db = await openDB()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(blob, key)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
  db.close()
  return { ref: `idb://${key}`, width, height, size: blob.size }
}

async function compressImage(file: File): Promise<Blob> {
  // إذا كان صغيراً لا داعي للضغط
  if (file.size < 900 * 1024) return file

  const img = await createImageBitmap(file)
  let { width, height } = img
  const ratio = Math.min(1, MAX_DIM / Math.max(width, height))
  width = Math.round(width * ratio)
  height = Math.round(height * ratio)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0, width, height)

  const blob: Blob = await new Promise((res) =>
    canvas.toBlob((b) => res(b!), file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.82),
  )
  return blob
}

export async function saveImage(key: string, file: File): Promise<string> {
  const err = validateFile(file)
  if (err) throw new Error(err)
  const blob = await compressImage(file)
  // Try Supabase Storage first (production, shared)
  try {
    const { hasSupabase, supabase } = await import('@/lib/supabase')
    if (hasSupabase() && supabase) {
      const { error } = await supabase.storage.from('images').upload(key, blob, { contentType: file.type, upsert: true, cacheControl: '31536000' })
      if (!error) {
        const { data } = supabase.storage.from('images').getPublicUrl(key)
        return data.publicUrl // https://... — production-ready, not per-browser
      }
    }
  } catch {
    // fallback to IndexedDB
  }
  const db = await openDB()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(blob, key)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
  db.close()
  return `idb://${key}`
}

export async function getImageBlobUrl(key: string): Promise<string | null> {
  const actualKey = key.startsWith('idb://') ? key.slice(6) : key
  const db = await openDB()
  const blob: Blob | undefined = await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).get(actualKey)
    req.onsuccess = () => resolve(req.result as Blob | undefined)
    req.onerror = () => reject(req.error)
  })
  db.close()
  if (!blob) return null
  return URL.createObjectURL(blob)
}

export async function deleteImage(key: string): Promise<void> {
  const actualKey = key.startsWith('idb://') ? key.slice(6) : key
  // Try Supabase first
  try {
    const { hasSupabase, supabase } = await import('@/lib/supabase')
    if (hasSupabase() && supabase) {
      const isSupabaseUrl = key.startsWith('http') && key.includes('supabase')
      const supaKey = isSupabaseUrl ? key.split('/images/').pop() ?? actualKey : actualKey
      await supabase.storage.from('images').remove([supaKey])
    }
  } catch {
    // ignore
  }
  const db = await openDB()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).delete(actualKey)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
  db.close()
}

export function isIdbRef(src?: string | null): boolean {
  return !!src && src.startsWith('idb://')
}

export async function listImageKeys(): Promise<string[]> {
  const db = await openDB()
  const keys: string[] = await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).getAllKeys()
    req.onsuccess = () => resolve((req.result as string[]).map((k) => `idb://${k}`))
    req.onerror = () => reject(req.error)
  })
  db.close()
  return keys
}

export async function getImageBlob(key: string): Promise<Blob | null> {
  const actualKey = key.startsWith('idb://') ? key.slice(6) : key
  const db = await openDB()
  const blob: Blob | undefined = await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).get(actualKey)
    req.onsuccess = () => resolve(req.result as Blob | undefined)
    req.onerror = () => reject(req.error)
  })
  db.close()
  return blob ?? null
}
