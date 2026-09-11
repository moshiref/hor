import { useEffect, useRef, useState } from 'react'
import { Upload, X, Loader2, Trash2, RotateCw, Crop, AlertTriangle, Check } from 'lucide-react'
import { saveImage, saveImageWithSpec, deleteImage, getImageDimensions, getImageBlob } from '@/lib/imageStore'
import { useImageUrl } from '@/hooks/useImageUrl'
import { imageSpecs, type ImageSpecKey, formatDimensions } from '@/lib/imageSpecs'

type Props = {
  label: string
  description?: string
  value?: string | null
  storageKey: string
  specKey?: ImageSpecKey
  onChange: (next: string | null) => void
  aspect?: string
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

function inferSpec(storageKey: string): ImageSpecKey {
  if (storageKey.startsWith('logo')) return 'logo'
  if (storageKey.startsWith('hero')) return 'hero'
  if (storageKey.startsWith('program_')) return 'program'
  if (storageKey.startsWith('activity_')) return 'activity'
  return 'program'
}

export default function ImageUploader({ label, description, value, storageKey, specKey, onChange, aspect }: Props) {
  const spec = imageSpecs[specKey ?? inferSpec(storageKey)]
  const inputRef = useRef<HTMLInputElement>(null)
  const resolvedUrl = useImageUrl(value ?? null)
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [storedMeta, setStoredMeta] = useState<{ width: number; height: number; size: number } | null>(null)

  // Crop modal state
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [pendingUrl, setPendingUrl] = useState<string | null>(null)
  const [pendingDim, setPendingDim] = useState<{ width: number; height: number } | null>(null)
  const [rotate, setRotate] = useState(0)
  const [showCrop, setShowCrop] = useState(false)

  // Load stored image meta for current value
  useEffect(() => {
    if (!value || !value.startsWith('idb://')) {
      setStoredMeta(null)
      return
    }
    getImageBlob(value).then((blob) => {
      if (!blob) return
      createImageBitmap(blob).then((bmp) => {
        setStoredMeta({ width: bmp.width, height: bmp.height, size: blob.size })
        bmp.close?.()
      })
    })
  }, [value])

  const handleFileSelect = async (file: File) => {
    setError(null)
    const dims = await getImageDimensions(file)
    setPendingFile(file)
    setPendingDim(dims)
    setRotate(0)
    const url = URL.createObjectURL(file)
    setPendingUrl(url)
    setShowCrop(true)
  }

  const handleConfirmCrop = async () => {
    if (!pendingFile) return
    setUploading(true)
    setShowCrop(false)
    try {
      // Use spec-aware save to apply correct aspect & size
      const result = await saveImageWithSpec(storageKey, pendingFile, spec.key, rotate)
      onChange(result.ref)
      // Update stored meta for display
      setStoredMeta({ width: result.width, height: result.height, size: result.size })
    } catch (e) {
      // Fallback to simple save if spec fails
      try {
        const ref = await saveImage(storageKey, pendingFile)
        onChange(ref)
      } catch (err) {
        setError(e instanceof Error ? e.message : err instanceof Error ? (err as Error).message : 'فشل الرفع')
      }
    } finally {
      setUploading(false)
      if (pendingUrl) URL.revokeObjectURL(pendingUrl)
      setPendingFile(null)
      setPendingUrl(null)
      setPendingDim(null)
      setRotate(0)
    }
  }

  const handleCancelCrop = () => {
    if (pendingUrl) URL.revokeObjectURL(pendingUrl)
    setPendingFile(null)
    setPendingUrl(null)
    setPendingDim(null)
    setRotate(0)
    setShowCrop(false)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFileSelect(file)
  }

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
    e.target.value = ''
  }

  const handleDelete = async () => {
    if (!value) return
    if (!confirm('حذف الصورة؟')) return
    await deleteImage(storageKey)
    onChange(null)
    setStoredMeta(null)
  }

  const isTooSmall = pendingDim ? pendingDim.width < spec.minWidth || pendingDim.height < spec.minHeight : false
  const aspectStyle = spec.aspect ? { aspectRatio: `${spec.aspect}` } : undefined
  const displayAspect = aspect ?? (spec.aspect ? `aspect-[${spec.aspect}]` : 'aspect-[16/9]')

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold text-ink-800">
            <span className="rounded-full bg-ink-800 px-2 py-0.5 text-[10px] font-bold text-white">{spec.label}</span>
            {label}
          </p>
          {description && <p className="mt-1 text-xs leading-relaxed text-gray-500">{description}</p>}
          <p className="mt-1 flex flex-wrap gap-2 text-[11px] text-gray-400">
            <span className="inline-flex items-center gap-1 rounded-full bg-cream-100 px-2 py-0.5">
              <Crop size={10} />
              {spec.aspect ? `نسبة ${spec.aspect.toFixed(2)} (${spec.targetWidth}×${spec.targetHeight})` : 'أبعاد حرة'}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-cream-100 px-2 py-0.5">
              حد {formatSize(spec.maxSizeKB * 1024)}
            </span>
            {spec.display === 'cover' ? 'قص احترافي' : 'احتواء بدون تشويه'}
          </p>
        </div>
        {value && !uploading && (
          <button type="button" onClick={handleDelete} className="shrink-0 inline-flex items-center gap-1 rounded-full border border-raspberry-200 bg-raspberry-50 px-3 py-1 text-xs font-bold text-raspberry-600 hover:bg-raspberry-100">
            <Trash2 size={12} />
            حذف
          </button>
        )}
      </div>

      {/* Current stored meta */}
      {value && storedMeta && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-teal-100 bg-teal-50 px-3 py-2 text-xs">
          <span className="inline-flex items-center gap-1 font-medium text-teal-700">
            <Check size={12} />
            الصورة الحالية
          </span>
          <span className="text-teal-600">
            {formatDimensions(storedMeta.width, storedMeta.height)} • {formatSize(storedMeta.size)}
          </span>
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${storedMeta.width >= spec.minWidth && storedMeta.height >= spec.minHeight ? 'bg-white text-teal-700' : 'bg-amber-100 text-amber-700'}`}>
            {storedMeta.width >= spec.minWidth && storedMeta.height >= spec.minHeight ? 'جودة جيدة' : 'جودة منخفضة'}
          </span>
        </div>
      )}

      {/* Preview current */}
      {value && resolvedUrl ? (
        <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50" style={spec.aspect ? aspectStyle : undefined}>
          <img
            src={resolvedUrl}
            alt={label}
            className={`h-full w-full ${spec.display === 'contain' ? 'object-contain p-2' : 'object-cover'}`}
            style={spec.aspect ? { aspectRatio: String(spec.aspect) } : undefined}
          />
          <div className="absolute inset-0 hidden items-center justify-center gap-2 bg-black/40 group-hover:flex">
            <button type="button" onClick={() => inputRef.current?.click()} className="rounded-full bg-white px-4 py-2 text-xs font-bold text-ink-800 shadow">
              تغيير الصورة
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-cream-50 px-6 py-8 text-center transition-colors ${dragOver ? 'border-raspberry-300 bg-raspberry-50' : 'border-gray-200 hover:border-gray-300 hover:bg-white'} ${displayAspect}`}
          style={spec.aspect ? aspectStyle : undefined}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
            {uploading ? <Loader2 size={22} className="animate-spin text-raspberry-500" /> : <Upload size={22} className="text-gray-400" />}
          </div>
          <p className="mt-3 text-sm font-bold text-ink-700">اسحب الصورة هنا أو اضغط للاختيار</p>
          <p className="mt-1 text-xs text-gray-500">JPG • PNG • WEBP — حتى 4MB — {spec.label}</p>
          <p className="mt-1 text-[11px] text-gray-400">
            الأبعاد المثالية {spec.targetWidth}×{spec.targetHeight} — الحد الأدنى {spec.minWidth}×{spec.minHeight}
          </p>
        </div>
      )}

      {uploading && (
        <div className="flex items-center gap-2 text-xs font-medium text-raspberry-600">
          <Loader2 size={14} className="animate-spin" />
          جارٍ رفع الصورة ومعالجتها حسب المواصفات...
        </div>
      )}

      {error && (
        <div className="flex items-center justify-between rounded-xl border border-raspberry-200 bg-raspberry-50 px-3 py-2">
          <p className="text-xs font-medium text-raspberry-600">{error}</p>
          <button onClick={() => setError(null)} className="rounded p-1 hover:bg-raspberry-100">
            <X size={14} />
          </button>
        </div>
      )}

      <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="hidden" onChange={onPick} />

      {/* Crop Modal */}
      {showCrop && pendingUrl && pendingDim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-ink-800">معالجة الصورة — {spec.label}</h3>
              <button onClick={handleCancelCrop} className="rounded-full p-1.5 hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-cream-50" style={spec.aspect ? aspectStyle : undefined}>
              <div className="relative flex items-center justify-center p-2" style={spec.aspect ? { aspectRatio: String(spec.aspect) } : undefined}>
                <img
                  src={pendingUrl}
                  alt="معاينة"
                  className={`max-h-[320px] w-full ${spec.display === 'contain' ? 'object-contain' : 'object-cover'}`}
                  style={{ transform: `rotate(${rotate}deg)`, aspectRatio: spec.aspect ? String(spec.aspect) : undefined }}
                />
              </div>
            </div>

            <div className="mt-4 space-y-3 rounded-xl bg-cream-50 p-4">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-white px-3 py-1 font-medium">الأبعاد الأصلية {formatDimensions(pendingDim.width, pendingDim.height)}</span>
                <span className="rounded-full bg-white px-3 py-1 font-medium">{formatSize(pendingFile?.size ?? 0)}</span>
                <span className={`rounded-full px-3 py-1 font-bold ${isTooSmall ? 'bg-amber-100 text-amber-700' : 'bg-teal-100 text-teal-700'}`}>
                  {isTooSmall ? 'صغيرة — جودة منخفضة' : 'الأبعاد مناسبة'}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-gray-500">
                سيتم قص الصورة تلقائياً إلى نسبة <b>{spec.aspect ? spec.aspect.toFixed(2) : 'حرة'}</b> ({spec.targetWidth}×{spec.targetHeight}) بدون تشويه باستخدام <b>قص احترافي (cover)</b>. يمكنك تدوير الصورة قبل الحفظ.
              </p>
              {isTooSmall && (
                <p className="flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
                  <AlertTriangle size={14} />
                  الصورة صغيرة وقد تظهر بجودة منخفضة. يفضل رفع صورة لا تقل عن {spec.minWidth}×{spec.minHeight}
                </p>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button onClick={() => setRotate((r) => (r + 90) % 360)} className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-ink-700 hover:bg-gray-50">
                <RotateCw size={14} />
                تدوير 90°
              </button>
              <button onClick={() => setRotate(0)} className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-ink-700 hover:bg-gray-50">
                إعادة ضبط
              </button>
              <div className="ms-auto flex gap-2">
                <button onClick={handleCancelCrop} className="rounded-full border border-gray-200 bg-white px-5 py-2.5 text-xs font-bold text-ink-700 hover:bg-gray-50">
                  إلغاء
                </button>
                <button onClick={handleConfirmCrop} className="inline-flex items-center gap-1.5 rounded-full bg-raspberry-500 px-6 py-2.5 text-xs font-bold text-white hover:bg-raspberry-600">
                  <Check size={14} />
                  حفظ الصورة
                </button>
              </div>
            </div>

            <p className="mt-3 text-center text-[11px] text-gray-400">سيتم ضغط الصورة تلقائياً للحفاظ على جودة جيدة وسرعة تحميل عالية — Responsive على Mobile و Desktop</p>
          </div>
        </div>
      )}
    </div>
  )
}
