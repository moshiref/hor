/**
 * Document storage — Supabase Storage (private bucket `student-documents`)
 * Fallback: IndexedDB for local development when Supabase not configured.
 *
 * Each document is stored at:
 *   student-documents/{studentId}/{category}/{timestamp}-{filename}
 *
 * Categories: health-report, child-id, guardian-id, child-photo, birth-certificate, location-sketch, payment-proof
 */

export type DocumentCategory =
  | 'health-report'
  | 'child-id'
  | 'guardian-id'
  | 'child-photo'
  | 'birth-certificate'
  | 'location-sketch'
  | 'payment-proof'

export const DOCUMENT_CATEGORY_LABEL: Record<DocumentCategory, string> = {
  'health-report': 'الكشف الصحي',
  'child-id': 'هوية الطفل',
  'guardian-id': 'هوية ولي الأمر',
  'child-photo': 'صورة الطفل',
  'birth-certificate': 'شهادة الميلاد',
  'location-sketch': 'كروكي موقع السكن',
  'payment-proof': 'إثبات التحويل',
}

export const BUCKET_NAME = 'student-documents'

const ALLOWED_MIME = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
// map jpg alias
const ALLOWED_EXTS = ['.jpg', '.jpeg', '.png', '.pdf']
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

// ---------- IndexedDB fallback ----------
const DB_NAME = 'hor_documents'
const STORE = 'documents'
const DB_VERSION = 1

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

export function validateDocumentFile(file: File): string | null {
  const ext = '.' + (file.name.split('.').pop()?.toLowerCase() ?? '')
  const type = file.type.toLowerCase()
  // check MIME, but don't trust solely — also check extension
  const mimeOk = ALLOWED_MIME.includes(type) || (type === 'image/jpg' && ALLOWED_MIME.includes('image/jpeg'))
  const extOk = ALLOWED_EXTS.includes(ext)
  if (!mimeOk && !extOk) return 'نوع الملف غير مسموح — يسمح فقط JPG / JPEG / PNG / PDF'
  // double guard: if extension is not allowed, reject even if mime says ok (spoof check)
  if (!extOk) return 'امتداد الملف غير مسموح — يسمح فقط .jpg .jpeg .png .pdf'
  if (file.size > MAX_FILE_SIZE) return `حجم الملف كبير جداً — الحد الأقصى ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}MB`
  if (file.size === 0) return 'الملف فارغ'
  return null
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

function sanitizeFileName(name: string): string {
  // keep arabic/english, replace unsafe chars
  return name.replace(/[^a-zA-Z0-9._\-\u0600-\u06FF]/g, '_').slice(0, 80)
}

function buildPath(studentId: string, category: DocumentCategory, fileName: string): string {
  const ts = Date.now()
  const safe = sanitizeFileName(fileName)
  return `${studentId}/${category}/${ts}-${safe}`
}

/**
 * Upload a document file.
 * Returns storage path (private). For Supabase fallback, returns idb://key
 */
export async function uploadDocument(
  file: File,
  studentId: string,
  category: DocumentCategory,
): Promise<{ path: string; publicUrl: string | null }> {
  const err = validateDocumentFile(file)
  if (err) throw new Error(err)

  const path = buildPath(studentId, category, file.name)

  try {
    const { hasSupabase, supabase } = await import('@/lib/supabase')
    if (hasSupabase() && supabase) {
      const { error } = await supabase.storage.from(BUCKET_NAME).upload(path, file, {
        contentType: file.type || 'application/octet-stream',
        upsert: false,
        cacheControl: '3600',
      })
      if (error) throw error
      // private bucket — no public url; return path only
      // For admin preview, we generate signed url on demand via getDocumentUrl
      return { path, publicUrl: null }
    }
  } catch (e) {
    // if Supabase configured but upload failed, bubble up
    const { hasSupabase } = await import('@/lib/supabase')
    if (hasSupabase()) throw e instanceof Error ? e : new Error('فشل رفع الملف')
  }

  // Fallback IndexedDB (local dev without Supabase)
  const db = await openDB()
  const key = `${BUCKET_NAME}/${path}`
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(file, key)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
  db.close()
  const url = URL.createObjectURL(file)
  return { path: `idb://${key}`, publicUrl: url }
}

/**
 * Get a viewable URL for a stored document.
 * For Supabase private bucket, creates a signed URL (1 hour).
 * For idb:// fallback, returns object URL.
 */
export async function getDocumentUrl(storedPath: string | null | undefined): Promise<string | null> {
  if (!storedPath) return null
  if (storedPath.startsWith('idb://')) {
    const key = storedPath.slice(6)
    const db = await openDB()
    const blob: Blob | undefined = await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly')
      const req = tx.objectStore(STORE).get(key)
      req.onsuccess = () => resolve(req.result as Blob | undefined)
      req.onerror = () => reject(req.error)
    })
    db.close()
    if (!blob) return null
    return URL.createObjectURL(blob)
  }
  if (storedPath.startsWith('http')) return storedPath
  // Supabase private path
  try {
    const { hasSupabase, supabase } = await import('@/lib/supabase')
    if (hasSupabase() && supabase) {
      // storage path stored as full path within bucket: studentId/category/file
      const { data, error } = await supabase.storage.from(BUCKET_NAME).createSignedUrl(storedPath, 3600)
      if (!error && data?.signedUrl) return data.signedUrl
      // fallback to public url if bucket was made public
      const { data: pub } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storedPath)
      if (pub?.publicUrl) return pub.publicUrl
    }
  } catch {
    // ignore
  }
  return null
}

/**
 * Delete a document by stored path
 */
export async function deleteDocument(storedPath: string): Promise<void> {
  if (!storedPath) return
  if (storedPath.startsWith('idb://')) {
    const key = storedPath.slice(6)
    try {
      const db = await openDB()
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE, 'readwrite')
        tx.objectStore(STORE).delete(key)
        tx.oncomplete = () => resolve()
        tx.onerror = () => reject(tx.error)
      })
      db.close()
    } catch {
      // ignore
    }
    return
  }
  if (storedPath.startsWith('http')) return
  try {
    const { hasSupabase, supabase } = await import('@/lib/supabase')
    if (hasSupabase() && supabase) {
      await supabase.storage.from(BUCKET_NAME).remove([storedPath])
    }
  } catch {
    // ignore
  }
}

export function isPdfFile(fileName: string, mime?: string): boolean {
  if (mime === 'application/pdf') return true
  return fileName.toLowerCase().endsWith('.pdf')
}
