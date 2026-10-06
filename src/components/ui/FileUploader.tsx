import { useEffect, useRef, useState } from 'react'
import { Upload, X, FileText, Eye, Loader2, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { formatFileSize, MAX_FILE_SIZE, validateDocumentFile, type DocumentCategory } from '@/lib/documentStore'

type UploadState = 'idle' | 'uploading' | 'success' | 'error'

type Props = {
  label: string
  id: string
  category: DocumentCategory
  required?: boolean
  value: File | null
  storedPath?: string | null
  error?: string
  hint?: string
  onChange: (file: File | null) => void
  onRemoveStored?: () => void
}

function isImageFile(file: File | null): boolean {
  if (!file) return false
  return file.type.startsWith('image/')
}

export default function FileUploader({
  label,
  id,
  required,
  value,
  error,
  hint,
  onChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadState, setUploadState] = useState<UploadState>('idle')
  const [localError, setLocalError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // preview for image
  useEffect(() => {
    if (value && isImageFile(value)) {
      const url = URL.createObjectURL(value)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    }
    setPreviewUrl(null)
  }, [value])

  // simulate upload state transitions
  useEffect(() => {
    if (!value) {
      setUploadState('idle')
      setSuccessMsg(null)
      return
    }
    setUploadState('uploading')
    setLocalError(null)
    setSuccessMsg(null)
    const t1 = setTimeout(() => {
      setUploadState('success')
      setSuccessMsg('تم اختيار الملف بنجاح — سيُرفع عند إرسال النموذج')
      const t2 = setTimeout(() => setSuccessMsg(null), 4000)
      return () => clearTimeout(t2)
    }, 400)
    return () => clearTimeout(t1)
  }, [value])

  const handleFile = (file: File | undefined) => {
    setLocalError(null)
    setSuccessMsg(null)
    if (!file) return
    const err = validateDocumentFile(file)
    if (err) {
      setLocalError(err)
      setUploadState('error')
      return
    }
    onChange(file)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  const handleRemove = () => {
    onChange(null)
    setLocalError(null)
    setUploadState('idle')
    setSuccessMsg(null)
  }

  const displayError = error || localError
  const isPdf = value ? value.name.toLowerCase().endsWith('.pdf') || value.type === 'application/pdf' : false

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <label htmlFor={id} className="min-w-0 text-sm font-bold text-ink-700">
        <span className="break-words">{label}</span>
        {required && <span className="ms-1 text-raspberry-500">*</span>}
      </label>

      {!value ? (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              inputRef.current?.click()
            }
          }}
          aria-label={`رفع ${label}`}
          className={`flex min-h-[132px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-6 text-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-raspberry-500 ${
            displayError
              ? 'border-raspberry-300 bg-raspberry-50/50'
              : dragOver
                ? 'border-raspberry-300 bg-raspberry-50'
                : 'border-ink-100 bg-white hover:border-ink-200 hover:bg-cream-50'
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cream-100 shadow-sm">
            <Upload size={20} className={dragOver ? 'text-raspberry-500' : 'text-ink-400'} />
          </div>
          <p className="mt-3 max-w-full break-words text-sm font-bold text-ink-700">اضغط للاختيار أو اسحب الملف هنا</p>
          <p className="mt-1 text-xs text-ink-400">JPG • JPEG • PNG • PDF — حتى {Math.round(MAX_FILE_SIZE / 1024 / 1024)}MB</p>
          {hint && <p className="mt-1 max-w-full break-words text-[11px] text-ink-400">{hint}</p>}
          {displayError && (
            <p className="mt-2 flex items-center gap-1 text-xs font-medium text-raspberry-600" role="alert">
              <AlertCircle size={12} /> {displayError}
            </p>
          )}
        </div>
      ) : (
        <div
          className={`overflow-hidden rounded-2xl border bg-white shadow-sm ${displayError ? 'border-raspberry-300' : uploadState === 'success' ? 'border-teal-200' : 'border-ink-100'}`}
        >
          {/* Preview row */}
          <div className="flex min-w-0 items-center gap-3 p-3 sm:p-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-ink-100 bg-cream-50">
              {previewUrl ? (
                <img src={previewUrl} alt={label} className="h-full w-full object-cover" />
              ) : isPdf ? (
                <FileText size={22} className="text-raspberry-400" />
              ) : (
                <FileText size={22} className="text-ink-400" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-ink-800" title={value.name}>
                {value.name}
              </p>
              <p className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-ink-400">
                <span>{formatFileSize(value.size)}</span>
                <span className="hidden sm:inline">•</span>
                <span className="truncate">{value.type || 'ملف'}</span>
              </p>
              {/* states */}
              {uploadState === 'uploading' && (
                <p className="mt-1 flex items-center gap-1 text-xs font-medium text-amber-600">
                  <Loader2 size={12} className="animate-spin" /> جارٍ تجهيز الملف...
                </p>
              )}
              {uploadState === 'success' && successMsg && (
                <p className="mt-1 flex items-center gap-1 text-xs font-medium text-teal-700">
                  <CheckCircle2 size={12} /> {successMsg}
                </p>
              )}
              {uploadState === 'error' && localError && (
                <p className="mt-1 flex items-center gap-1 text-xs font-medium text-raspberry-600">
                  <AlertCircle size={12} /> {localError}
                </p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              {previewUrl && (
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-ink-50 text-ink-600 transition-colors hover:bg-ink-100"
                  aria-label="معاينة"
                >
                  <Eye size={16} />
                </a>
              )}
              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-raspberry-50 text-raspberry-600 transition-colors hover:bg-raspberry-100"
                aria-label="حذف الملف"
              >
                <Trash2 size={16} />
              </button>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="hidden items-center justify-center rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs font-bold text-ink-700 hover:bg-ink-50 sm:inline-flex"
              >
                تغيير
              </button>
            </div>
          </div>

          {/* success bar */}
          {uploadState === 'success' && (
            <div className="flex items-center gap-2 border-t border-teal-100 bg-teal-50 px-3 py-2 text-xs font-medium text-teal-700 sm:px-4">
              <CheckCircle2 size={14} className="shrink-0" />
              <span className="break-words">الملف جاهز للرفع</span>
              <button type="button" onClick={handleRemove} className="ms-auto inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-raspberry-600 ring-1 ring-raspberry-100 hover:bg-raspberry-50">
                <X size={12} /> حذف
              </button>
            </div>
          )}
          {displayError && (
            <div className="border-t border-raspberry-100 bg-raspberry-50 px-3 py-2 text-xs font-medium text-raspberry-700 sm:px-4">
              {displayError}
            </div>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
        className="hidden"
        onChange={onPick}
        aria-invalid={!!displayError}
        aria-describedby={displayError ? `${id}-error` : undefined}
      />
      {displayError && value && (
        <p id={`${id}-error`} className="text-xs font-medium text-raspberry-600" role="alert">
          {displayError}
        </p>
      )}
    </div>
  )
}
