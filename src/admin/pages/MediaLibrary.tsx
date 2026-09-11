import { useEffect, useState } from 'react'
import { Image as ImageIcon, Trash2, Upload, Copy, Check } from 'lucide-react'
import { listImageKeys, getImageBlobUrl, deleteImage, saveImage } from '@/lib/imageStore'

export default function MediaLibrary() {
  const [keys, setKeys] = useState<string[]>([])
  const [previews, setPreviews] = useState<Record<string, string>>({})
  const [uploading, setUploading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const refresh = async () => {
    const k = await listImageKeys()
    setKeys(k)
    const map: Record<string, string> = {}
    for (const key of k) {
      const url = await getImageBlobUrl(key)
      if (url) map[key] = url
    }
    setPreviews(map)
  }

  useEffect(() => {
    refresh()
    return () => {
      Object.values(previews).forEach((u) => URL.revokeObjectURL(u))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleUpload = async (files: FileList | null) => {
    if (!files) return
    setUploading(true)
    for (const file of Array.from(files)) {
      const key = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`
      try {
        await saveImage(key, file)
      } catch (e) {
        alert(e instanceof Error ? e.message : 'فشل الرفع')
      }
    }
    setUploading(false)
    refresh()
  }

  const handleDelete = async (key: string) => {
    if (!confirm('حذف الصورة؟ قد يؤثر على أماكن استخدامها')) return
    await deleteImage(key)
    refresh()
  }

  const handleCopy = async (key: string) => {
    await navigator.clipboard.writeText(key)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-800">مكتبة الوسائط</h1>
        <p className="mt-1 text-sm text-gray-500">كل الصور المرفوعة من الجهاز — تُخزن فعلياً في IndexedDB وتظهر مباشرة في الموقع</p>
      </div>

      <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cream-100">
          <Upload size={24} className="text-ink-600" />
        </div>
        <p className="mt-3 text-sm font-bold text-ink-800">اسحب الصور هنا أو اختر من الجهاز</p>
        <p className="mt-1 text-xs text-gray-500">JPG • PNG • WEBP — حتى 4MB للصورة — رفع متعدد مدعوم</p>
        <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full bg-ink-800 px-6 py-2.5 text-sm font-bold text-white hover:bg-ink-900">
          <Upload size={16} />
          اختيار صور
          <input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" multiple className="hidden" onChange={(e) => handleUpload(e.target.files)} />
        </label>
        {uploading && <p className="mt-3 text-xs text-raspberry-600">جارٍ الرفع والضغط...</p>}
      </div>

      {keys.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
          <ImageIcon size={32} className="mx-auto text-gray-300" />
          <p className="mt-3 text-sm font-bold text-ink-700">لا توجد صور بعد</p>
          <p className="mt-1 text-xs text-gray-500">ارفع أول صورة لتظهر هنا ويمكنك اختيارها في أي مكان بالموقع</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {keys.map((key) => (
            <div key={key} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="aspect-[4/3] bg-cream-50">
                {previews[key] ? <img src={previews[key]} alt={key} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-gray-400"><ImageIcon size={24} /></div>}
              </div>
              <div className="p-3">
                <p className="truncate text-xs font-medium text-ink-700" title={key}>
                  {key.replace('idb://', '')}
                </p>
                <div className="mt-2 flex items-center gap-1">
                  <button onClick={() => handleCopy(key)} className="flex flex-1 items-center justify-center gap-1 rounded-full border border-gray-200 py-1.5 text-xs font-bold text-ink-700 hover:bg-gray-50">
                    {copied === key ? <Check size={12} className="text-teal-600" /> : <Copy size={12} />}
                    {copied === key ? 'تم النسخ' : 'نسخ المرجع'}
                  </button>
                  <button onClick={() => handleDelete(key)} className="rounded-full p-1.5 text-raspberry-600 hover:bg-raspberry-50">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
