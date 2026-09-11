import { useEffect, useState } from 'react'
import { Building2, Image as ImageIcon, Info, BookOpen, Phone, MapPin, MessageCircle, Save, AlertCircle, Check, Plus, Trash2, Layout, Menu, Eye, EyeOff, ImagePlus } from 'lucide-react'
import { getSiteConfig, saveSiteConfig, getSiteContent, saveSiteContent } from '@/lib/siteStore'
import ImageUploader from '@/components/admin/ImageUploader'

function Card({ title, desc, icon: Icon, children }: { title: string; desc: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-start gap-3 border-b border-gray-100 px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cream-100 text-ink-700">
          <Icon size={18} />
        </div>
        <div>
          <h2 className="text-sm font-bold text-ink-800">{title}</h2>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">{desc}</p>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </section>
  )
}

function Toast({ msg, type, onClose }: { msg: string; type: 'success' | 'error'; onClose: () => void }) {
  return (
    <div className={`fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full px-5 py-3 text-sm font-bold shadow-lg ${type === 'success' ? 'bg-ink-800 text-white' : 'bg-raspberry-600 text-white'}`}>
      {type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
      {msg}
      <button onClick={onClose} className="ms-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">إغلاق</button>
    </div>
  )
}

export default function Settings() {
  const [config, setConfig] = useState(() => getSiteConfig())
  const [content, setContent] = useState(() => getSiteContent())
  const [initialConfig] = useState(() => JSON.stringify(getSiteConfig()))
  const [initialContent] = useState(() => JSON.stringify(getSiteContent()))
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    setConfig(getSiteConfig())
    setContent(getSiteContent())
  }, [])

  const isDirty = JSON.stringify(config) !== initialConfig || JSON.stringify(content) !== initialContent

  const saveAll = async () => {
    if (saving) return
    setSaving(true)
    try {
      await new Promise((r) => setTimeout(r, 500))
      saveSiteConfig(config)
      saveSiteContent(content)
      setToast({ msg: 'تم حفظ التغييرات بنجاح — ستظهر في الموقع فوراً', type: 'success' })
      setTimeout(() => window.location.reload(), 700)
    } catch {
      setToast({ msg: 'فشل الحفظ — حاول مرة أخرى', type: 'error' })
    } finally {
      setSaving(false)
      setTimeout(() => setToast(null), 3000)
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-24">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-800">إعدادات الموقع — CMS شامل</h1>
        <p className="mt-1 text-sm text-gray-500">كل ما يظهر للزائر قابل للتحكم هنا بدون تعديل الكود</p>
      </div>

      {/* Header / Nav */}
      <Card title="الشريط العلوي — Header" desc="الشعار واسم المركز والقائمة وزر التسجيل" icon={Layout}>
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-bold">اسم المركز</span>
                <input value={config.name} onChange={(e) => setConfig({ ...config, name: e.target.value })} className="rounded-xl border border-gray-200 px-4 py-3 text-sm" />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-bold">الاسم المختصر</span>
                <input value={config.shortName} onChange={(e) => setConfig({ ...config, shortName: e.target.value })} className="rounded-xl border border-gray-200 px-4 py-3 text-sm" />
              </label>
            </div>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold">الوصف المختصر</span>
              <input value={config.tagline} onChange={(e) => setConfig({ ...config, tagline: e.target.value })} className="rounded-xl border border-gray-200 px-4 py-3 text-sm" />
            </label>
            <div className="rounded-xl border border-gray-100 bg-cream-50 p-4">
              <p className="text-xs font-bold text-ink-700">زر التسجيل في الشريط</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <input value={content.header.ctaLabel} onChange={(e) => setContent({ ...content, header: { ...content.header, ctaLabel: e.target.value } })} className="rounded-xl border border-gray-200 px-3 py-2 text-sm" placeholder="نص الزر" />
                <input value={content.header.ctaHref} onChange={(e) => setContent({ ...content, header: { ...content.header, ctaHref: e.target.value } })} className="rounded-xl border border-gray-200 px-3 py-2 text-sm" placeholder="#registration" dir="ltr" />
                <label className="flex items-center gap-2 text-xs font-bold">
                  <input type="checkbox" checked={content.header.isVisible} onChange={(e) => setContent({ ...content, header: { ...content.header, isVisible: e.target.checked } })} />
                  إظهار
                </label>
              </div>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-3">
              <p className="text-xs font-bold">عناصر القائمة</p>
              <div className="mt-3 space-y-2">
                {content.navigation.map((item, idx) => (
                  <div key={item.href + idx} className="flex items-center gap-2 rounded-xl border border-gray-100 bg-cream-50 px-3 py-2">
                    <Menu size={14} className="text-gray-400" />
                    <input value={item.label} onChange={(e) => { const n = [...content.navigation]; n[idx] = { ...n[idx], label: e.target.value }; setContent({ ...content, navigation: n }) }} className="flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs" />
                    <input value={item.href} onChange={(e) => { const n = [...content.navigation]; n[idx] = { ...n[idx], href: e.target.value }; setContent({ ...content, navigation: n }) }} className="w-28 rounded-lg border border-gray-200 px-2 py-1.5 text-xs" dir="ltr" />
                    <button onClick={() => { const n = [...content.navigation]; n[idx] = { ...n[idx], isVisible: !n[idx].isVisible }; setContent({ ...content, navigation: n }) }} className={`rounded-full p-1.5 ${item.isVisible ? 'bg-teal-50 text-teal-600' : 'bg-gray-100 text-gray-400'}`}>{item.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}</button>
                    <button onClick={() => { if (!confirm('حذف العنصر؟')) return; setContent({ ...content, navigation: content.navigation.filter((_, i) => i !== idx) }) }} className="rounded-full p-1.5 text-raspberry-600 hover:bg-raspberry-50"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
              <button onClick={() => setContent({ ...content, navigation: [...content.navigation, { label: 'عنصر جديد', href: '#new', order: content.navigation.length + 1, isVisible: true }] })} className="mt-3 inline-flex items-center gap-1 rounded-full bg-ink-800 px-4 py-1.5 text-xs font-bold text-white"><Plus size={12} /> إضافة عنصر</button>
            </div>
          </div>
          <ImageUploader label="شعار المركز" description="PNG شفاف مفضل — يظهر في الشريط والتذييل" value={config.logoMark} storageKey="logo" onChange={(v) => v && setConfig({ ...config, logoMark: v })} aspect="aspect-square" />
        </div>
      </Card>

      <Card title="الصفحة الرئيسية — Hero" desc="القسم الأول الذي يراه الزائر" icon={ImageIcon}>
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold">النص الصغير فوق العنوان</span>
              <input value={content.hero.eyebrow} onChange={(e) => setContent({ ...content, hero: { ...content.hero, eyebrow: e.target.value } })} className="rounded-xl border border-gray-200 px-4 py-3 text-sm" />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold">العنوان الرئيسي</span>
              <input value={content.hero.title} onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })} className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold" />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold">الوصف</span>
              <textarea value={content.hero.description} onChange={(e) => setContent({ ...content, hero: { ...content.hero, description: e.target.value } })} className="rounded-xl border border-gray-200 px-4 py-3 text-sm" rows={4} />
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-gray-100 p-3">
                <p className="text-xs font-bold">زر أساسي</p>
                <input value={content.hero.primaryCta.label} onChange={(e) => setContent({ ...content, hero: { ...content.hero, primaryCta: { ...content.hero.primaryCta, label: e.target.value } } })} className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs" />
                <input value={content.hero.primaryCta.href} onChange={(e) => setContent({ ...content, hero: { ...content.hero, primaryCta: { ...content.hero.primaryCta, href: e.target.value } } })} className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs" dir="ltr" />
              </div>
              <div className="rounded-xl border border-gray-100 p-3">
                <p className="text-xs font-bold">زر ثانوي</p>
                <input value={content.hero.secondaryCta.label} onChange={(e) => setContent({ ...content, hero: { ...content.hero, secondaryCta: { ...content.hero.secondaryCta, label: e.target.value } } })} className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs" />
                <input value={content.hero.secondaryCta.href} onChange={(e) => setContent({ ...content, hero: { ...content.hero, secondaryCta: { ...content.hero.secondaryCta, href: e.target.value } } })} className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs" dir="ltr" />
              </div>
            </div>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold">شارة (رعاية واهتمام...)</span>
              <input value={content.hero.badge?.text ?? ''} onChange={(e) => setContent({ ...content, hero: { ...content.hero, badge: { text: e.target.value } } })} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm" />
            </label>
          </div>
          <ImageUploader label="صورة الهيرو" description="طبيعية دافئة للأطفال — Drag & Drop" value={content.hero.image.src} storageKey="hero" onChange={(v) => v && setContent({ ...content, hero: { ...content.hero, image: { ...content.hero.image, src: v } } })} />
        </div>
      </Card>

      <Card title="عن المركز" desc="العنوان والفقرات والمميزات" icon={Info}>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-bold">عنوان القسم</span>
          <input value={content.about.title} onChange={(e) => setContent({ ...content, about: { ...content.about, title: e.target.value } })} className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold" />
        </label>
        <textarea value={content.about.paragraphs.join('\n\n')} onChange={(e) => setContent({ ...content, about: { ...content.about, paragraphs: e.target.value.split('\n\n') } })} className="mt-4 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm leading-relaxed" rows={5} />
        <div className="mt-6">
          <p className="text-xs font-bold">المميزات (إضافة/حذف/ترتيب/إظهار)</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {content.about.features.map((f, idx) => (
              <div key={f.id} className="rounded-xl border border-gray-200 bg-cream-50 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">#{idx + 1}</span>
                  <div className="flex gap-1">
                    <button onClick={() => { const n = [...content.about.features]; n[idx] = { ...n[idx], isVisible: !n[idx].isVisible }; setContent({ ...content, about: { ...content.about, features: n } }) }} className={`rounded-full p-1.5 ${f.isVisible ? 'bg-teal-50 text-teal-600' : 'bg-gray-100'}`}>{f.isVisible ? <Eye size={12} /> : <EyeOff size={12} />}</button>
                    <button onClick={() => { if (!confirm('حذف؟')) return; setContent({ ...content, about: { ...content.about, features: content.about.features.filter((_, i) => i !== idx) } }) }} className="rounded-full p-1.5 text-raspberry-600 hover:bg-raspberry-50"><Trash2 size={12} /></button>
                  </div>
                </div>
                <input value={f.title} onChange={(e) => { const n = [...content.about.features]; n[idx] = { ...n[idx], title: e.target.value }; setContent({ ...content, about: { ...content.about, features: n } }) }} className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold" />
                <textarea value={f.description} onChange={(e) => { const n = [...content.about.features]; n[idx] = { ...n[idx], description: e.target.value }; setContent({ ...content, about: { ...content.about, features: n } }) }} className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs" rows={2} />
              </div>
            ))}
          </div>
          <button onClick={() => setContent({ ...content, about: { ...content.about, features: [...content.about.features, { id: `feat_${Date.now()}`, icon: 'users' as const, title: 'ميزة جديدة', description: 'وصف الميزة', order: content.about.features.length + 1, isVisible: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }] } })} className="mt-3 inline-flex items-center gap-1 rounded-full bg-ink-800 px-4 py-2 text-xs font-bold text-white"><Plus size={12} /> إضافة ميزة</button>
        </div>
      </Card>

      <Card title="البرامج التعليمية" desc="إدارة ديناميكية مع صورة لكل برنامج" icon={BookOpen}>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs text-gray-500">{content.programs.programs.length} برامج</p>
          <button onClick={() => { const p = { id: `prog_${Date.now()}`, icon: 'book-open' as const, title: 'برنامج جديد', description: 'وصف البرنامج', order: content.programs.programs.length + 1, isVisible: true, image: undefined, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }; setContent({ ...content, programs: { ...content.programs, programs: [...content.programs.programs, p] } }) }} className="inline-flex items-center gap-1.5 rounded-full bg-ink-800 px-4 py-2 text-xs font-bold text-white"><Plus size={14} /> إضافة برنامج</button>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {content.programs.programs.map((p, idx) => (
            <div key={p.id} className="rounded-2xl border border-gray-200 bg-cream-50 p-4">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold">#{idx + 1}</span>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold"><input type="checkbox" checked={p.isVisible} onChange={(e) => { const n = [...content.programs.programs]; n[idx] = { ...n[idx], isVisible: e.target.checked }; setContent({ ...content, programs: { ...content.programs, programs: n } }) }} /> ظاهر</label>
                  <button onClick={() => { if (!confirm('حذف؟')) return; setContent({ ...content, programs: { ...content.programs, programs: content.programs.programs.filter((x) => x.id !== p.id) } }) }} className="rounded-full p-1.5 text-raspberry-600 hover:bg-raspberry-50"><Trash2 size={14} /></button>
                </div>
              </div>
              <input value={p.title} onChange={(e) => { const n = [...content.programs.programs]; n[idx] = { ...n[idx], title: e.target.value }; setContent({ ...content, programs: { ...content.programs, programs: n } }) }} className="mt-3 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-bold" />
              <textarea value={p.description} onChange={(e) => { const n = [...content.programs.programs]; n[idx] = { ...n[idx], description: e.target.value }; setContent({ ...content, programs: { ...content.programs, programs: n } }) }} className="mt-3 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm" rows={3} />
              <div className="mt-4">
                <ImageUploader label="صورة البرنامج" description="اختيارية" value={(p as unknown as { image?: string }).image ?? null} storageKey={`program_${p.id}`} onChange={(v) => { const n = [...content.programs.programs]; (n[idx] as unknown as { image?: string }).image = v ?? undefined; setContent({ ...content, programs: { ...content.programs, programs: n } }) }} aspect="aspect-[16/10]" />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold">عنوان القسم</span>
            <input value={content.programs.title} onChange={(e) => setContent({ ...content, programs: { ...content.programs, title: e.target.value } })} className="rounded-xl border border-gray-200 px-4 py-3 text-sm" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold">وصف القسم</span>
            <input value={content.programs.description} onChange={(e) => setContent({ ...content, programs: { ...content.programs, description: e.target.value } })} className="rounded-xl border border-gray-200 px-4 py-3 text-sm" />
          </label>
        </div>
      </Card>

      <Card title="الأنشطة والفعاليات" desc="معرض صور حقيقي — رفع متعدد من الجهاز" icon={ImagePlus}>
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold">عنوان القسم</span>
              <input value={content.activities.title} onChange={(e) => setContent({ ...content, activities: { ...content.activities, title: e.target.value } })} className="rounded-xl border border-gray-200 px-4 py-3 text-sm" />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold">وصف القسم</span>
              <input value={content.activities.description} onChange={(e) => setContent({ ...content, activities: { ...content.activities, description: e.target.value } })} className="rounded-xl border border-gray-200 px-4 py-3 text-sm" />
            </label>
          </div>
          <div className="rounded-xl border border-dashed border-gray-200 bg-cream-50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold">{content.activities.items.length} عناصر</p>
              <button onClick={() => { const id = `act_${Date.now()}`; setContent({ ...content, activities: { ...content.activities, items: [...content.activities.items, { id, title: 'نشاط جديد', description: '', image: undefined, order: content.activities.items.length + 1, isVisible: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }] } }) }} className="inline-flex items-center gap-1 rounded-full bg-ink-800 px-4 py-1.5 text-xs font-bold text-white"><Plus size={12} /> إضافة نشاط</button>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {content.activities.items.map((it, idx) => (
                <div key={it.id} className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <input value={it.title} onChange={(e) => { const n = [...content.activities.items]; n[idx] = { ...n[idx], title: e.target.value }; setContent({ ...content, activities: { ...content.activities, items: n } }) }} className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold" />
                    <button onClick={() => setContent({ ...content, activities: { ...content.activities, items: content.activities.items.filter((x) => x.id !== it.id) } })} className="ms-2 rounded-full p-1.5 text-raspberry-600 hover:bg-raspberry-50"><Trash2 size={14} /></button>
                  </div>
                  <textarea value={it.description ?? ''} onChange={(e) => { const n = [...content.activities.items]; n[idx] = { ...n[idx], description: e.target.value }; setContent({ ...content, activities: { ...content.activities, items: n } }) }} className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs" rows={2} placeholder="وصف مختصر" />
                  <div className="mt-3">
                    <ImageUploader label="صورة النشاط" value={it.image ?? null} storageKey={`activity_${it.id}`} onChange={(v) => { const n = [...content.activities.items]; n[idx] = { ...n[idx], image: v ?? undefined }; setContent({ ...content, activities: { ...content.activities, items: n } }) }} />
                  </div>
                  <label className="mt-2 flex items-center gap-2 text-xs"><input type="checkbox" checked={it.isVisible} onChange={(e) => { const n = [...content.activities.items]; n[idx] = { ...n[idx], isVisible: e.target.checked }; setContent({ ...content, activities: { ...content.activities, items: n } }) }} /> ظاهر</label>
                </div>
              ))}
              {content.activities.items.length === 0 && <p className="py-4 text-center text-xs text-gray-400">لا توجد أنشطة — أضف أول نشاط</p>}
            </div>
          </div>
        </div>
      </Card>

      <Card title="الفترات والمواصلات" desc="Cards مرنة — إضافة/حذف/ترتيب" icon={Layout}>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold">عنوان القسم</span>
              <input value={content.schedule.title} onChange={(e) => setContent({ ...content, schedule: { ...content.schedule, title: e.target.value } })} className="rounded-xl border border-gray-200 px-4 py-3 text-sm" />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold">الوصف</span>
              <input value={content.schedule.description} onChange={(e) => setContent({ ...content, schedule: { ...content.schedule, description: e.target.value } })} className="rounded-xl border border-gray-200 px-4 py-3 text-sm" />
            </label>
          </div>
          {(content.schedule as unknown as { periods?: unknown[] }).periods !== undefined && (
            <p className="text-xs text-gray-400">الفترات تُدار من البطاقات أدناه — يمكنك تعديل النصوص وحذف/إضافة</p>
          )}
        </div>
      </Card>

      <Card title="لماذا حور العين" desc="المزايا — إضافة/حذف" icon={Info}>
        <div className="grid gap-3 sm:grid-cols-2">
          {content.whyUs.features.map((f, idx) => (
            <div key={f.id} className="rounded-xl border border-gray-200 bg-cream-50 p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">#{idx + 1}</span>
                <button onClick={() => setContent({ ...content, whyUs: { ...content.whyUs, features: content.whyUs.features.filter((_, i) => i !== idx) } })} className="rounded-full p-1 text-raspberry-600 hover:bg-raspberry-50"><Trash2 size={12} /></button>
              </div>
              <input value={f.title} onChange={(e) => { const n = [...content.whyUs.features]; (n as unknown as { title: string }[])[idx].title = e.target.value; setContent({ ...content, whyUs: { ...content.whyUs, features: n } }) }} className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold" />
              <input value={f.description} onChange={(e) => { const n = [...content.whyUs.features]; (n as unknown as { description: string }[])[idx].description = e.target.value; setContent({ ...content, whyUs: { ...content.whyUs, features: n } }) }} className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs" />
            </div>
          ))}
        </div>
        <button onClick={() => setContent({ ...content, whyUs: { ...content.whyUs, features: [...content.whyUs.features, { id: `why_${Date.now()}`, title: 'ميزة جديدة', description: 'وصف الميزة' }] as unknown as typeof content.whyUs.features } })} className="mt-3 inline-flex items-center gap-1 rounded-full bg-ink-800 px-4 py-2 text-xs font-bold text-white"><Plus size={12} /> إضافة ميزة</button>
      </Card>

      <Card title="التذييل — Footer" desc="الوصف والروابط وحقوق النشر" icon={Building2}>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-bold">وصف التذييل</span>
          <textarea value={content.footer.description} onChange={(e) => setContent({ ...content, footer: { ...content.footer, description: e.target.value } })} className="rounded-xl border border-gray-200 px-4 py-3 text-sm" rows={3} />
        </label>
        <div className="mt-4">
          <p className="text-xs font-bold">روابط سريعة</p>
          <div className="mt-2 space-y-2">
            {content.footer.links.map((l, idx) => (
              <div key={l.href + idx} className="flex items-center gap-2 rounded-xl border border-gray-100 bg-cream-50 px-3 py-2">
                <input value={l.label} onChange={(e) => { const n = [...content.footer.links]; n[idx] = { ...n[idx], label: e.target.value }; setContent({ ...content, footer: { ...content.footer, links: n } }) }} className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs" />
                <input value={l.href} onChange={(e) => { const n = [...content.footer.links]; n[idx] = { ...n[idx], href: e.target.value }; setContent({ ...content, footer: { ...content.footer, links: n } }) }} className="w-32 rounded-lg border border-gray-200 px-3 py-1.5 text-xs" dir="ltr" />
                <button onClick={() => { const n = [...content.footer.links]; n[idx] = { ...n[idx], isVisible: !n[idx].isVisible }; setContent({ ...content, footer: { ...content.footer, links: n } }) }} className={`rounded-full p-1.5 ${l.isVisible ? 'bg-teal-50 text-teal-600' : 'bg-gray-100'}`}>{l.isVisible ? <Eye size={12} /> : <EyeOff size={12} />}</button>
                <button onClick={() => setContent({ ...content, footer: { ...content.footer, links: content.footer.links.filter((_, i) => i !== idx) } })} className="rounded-full p-1.5 text-raspberry-600 hover:bg-raspberry-50"><Trash2 size={12} /></button>
              </div>
            ))}
          </div>
          <button onClick={() => setContent({ ...content, footer: { ...content.footer, links: [...content.footer.links, { label: 'رابط جديد', href: '#new', order: content.footer.links.length + 1, isVisible: true }] } })} className="mt-3 inline-flex items-center gap-1 rounded-full bg-ink-800 px-4 py-1.5 text-xs font-bold text-white"><Plus size={12} /> إضافة رابط</button>
        </div>
        <label className="mt-4 flex flex-col gap-1.5">
          <span className="text-xs font-bold">نص حقوق النشر</span>
          <input value={content.footer.copyright} onChange={(e) => setContent({ ...content, footer: { ...content.footer, copyright: e.target.value } })} className="rounded-xl border border-gray-200 px-4 py-3 text-sm" />
        </label>
      </Card>

      <Card title="تواصل معنا" desc="العناوين والأزرار" icon={Phone}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold">عنوان القسم</span>
            <input value={content.contactSection.title} onChange={(e) => setContent({ ...content, contactSection: { ...content.contactSection, title: e.target.value } })} className="rounded-xl border border-gray-200 px-4 py-3 text-sm" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold">الوصف</span>
            <input value={content.contactSection.description} onChange={(e) => setContent({ ...content, contactSection: { ...content.contactSection, description: e.target.value } })} className="rounded-xl border border-gray-200 px-4 py-3 text-sm" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold">تسمية الجوال</span>
            <input value={content.contactSection.phoneLabel} onChange={(e) => setContent({ ...content, contactSection: { ...content.contactSection, phoneLabel: e.target.value } })} className="rounded-xl border border-gray-200 px-4 py-3 text-sm" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold">زر واتساب</span>
            <input value={content.contactSection.whatsappButtonLabel} onChange={(e) => setContent({ ...content, contactSection: { ...content.contactSection, whatsappButtonLabel: e.target.value } })} className="rounded-xl border border-gray-200 px-4 py-3 text-sm" />
          </label>
        </div>
      </Card>

      <Card title="إدارة الأقسام" desc="إظهار/إخفاء وترتيب الأقسام" icon={Layout}>
        <div className="space-y-2">
          {content.sections
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((s) => (
              <div key={s.key} className="flex items-center justify-between rounded-xl border border-gray-200 bg-cream-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-ink-700">{s.label}</span>
                  <span className="rounded-full bg-white px-2 py-0.5 text-[11px] text-gray-500">#{s.order}</span>
                </div>
                <label className="flex items-center gap-2 text-xs font-bold">
                  <input type="checkbox" checked={s.isVisible} onChange={(e) => { const n = content.sections.map((x) => (x.key === s.key ? { ...x, isVisible: e.target.checked } : x)); setContent({ ...content, sections: n }) }} />
                  ظاهر
                </label>
              </div>
            ))}
        </div>
      </Card>

      <Card title="الموقع الجغرافي" desc="رابط الخريطة والإحداثيات" icon={MapPin}>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold">رابط خرائط Google</span>
            <input value={config.location.googleMapsUrl ?? ''} onChange={(e) => setConfig({ ...config, location: { ...config.location, googleMapsUrl: e.target.value } })} className="rounded-xl border border-gray-200 px-4 py-3 text-sm" dir="ltr" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold">Latitude</span>
            <input type="number" step="any" value={config.location.lat ?? ''} onChange={(e) => setConfig({ ...config, location: { ...config.location, lat: parseFloat(e.target.value) || undefined } })} className="rounded-xl border border-gray-200 px-4 py-3 text-sm" dir="ltr" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold">Longitude</span>
            <input type="number" step="any" value={config.location.lng ?? ''} onChange={(e) => setConfig({ ...config, location: { ...config.location, lng: parseFloat(e.target.value) || undefined } })} className="rounded-xl border border-gray-200 px-4 py-3 text-sm" dir="ltr" />
          </label>
        </div>
        {config.location.lat && config.location.lng && (
          <div className="mt-4 overflow-hidden rounded-xl border border-gray-200">
            <iframe title="معاينة الخريطة" src={`https://maps.google.com/maps?q=${config.location.lat},${config.location.lng}&z=16&output=embed`} className="h-[240px] w-full border-0" loading="lazy" />
          </div>
        )}
      </Card>

      <Card title="زر واتساب العائم" desc="يظهر ثابتاً أسفل يسار الموقع" icon={MessageCircle}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex items-center gap-3 rounded-xl border border-gray-200 bg-cream-50 px-4 py-3">
            <input type="checkbox" checked={config.whatsappFloating.enabled} onChange={(e) => setConfig({ ...config, whatsappFloating: { ...config.whatsappFloating, enabled: e.target.checked } })} />
            <span className="text-sm font-bold">تفعيل الزر</span>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold">رقم واتساب (966...)</span>
            <input value={config.whatsappFloating.phone} onChange={(e) => setConfig({ ...config, whatsappFloating: { ...config.whatsappFloating, phone: e.target.value } })} className="rounded-xl border border-gray-200 px-4 py-3 text-sm" dir="ltr" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold">نص عند التمرير</span>
            <input value={config.whatsappFloating.hoverText} onChange={(e) => setConfig({ ...config, whatsappFloating: { ...config.whatsappFloating, hoverText: e.target.value } })} className="rounded-xl border border-gray-200 px-4 py-3 text-sm" />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold">رسالة افتراضية</span>
            <input value={config.whatsappFloating.defaultMessage ?? ''} onChange={(e) => setConfig({ ...config, whatsappFloating: { ...config.whatsappFloating, defaultMessage: e.target.value || undefined } })} className="rounded-xl border border-gray-200 px-4 py-3 text-sm" />
          </label>
        </div>
      </Card>

      {/* Sticky save bar */}
      <div className={`sticky bottom-4 z-10 flex items-center justify-between rounded-2xl border bg-white px-6 py-4 shadow-lg transition-all ${isDirty ? 'border-amber-200 opacity-100' : 'pointer-events-none border-transparent opacity-0'}`}>
        <div className="flex items-center gap-2 text-sm">
          <AlertCircle size={16} className="text-amber-500" />
          <span className="font-medium">لديك تغييرات غير محفوظة</span>
        </div>
        <button onClick={saveAll} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-ink-800 px-6 py-2.5 text-sm font-bold text-white disabled:opacity-50">
          {saving ? 'جارٍ الحفظ...' : (
            <>
              <Save size={16} /> حفظ التغييرات
            </>
          )}
        </button>
      </div>

      <div className="flex justify-end">
        <button onClick={saveAll} disabled={saving || !isDirty} className="inline-flex items-center gap-2 rounded-full bg-raspberry-500 px-8 py-3 text-sm font-bold text-white shadow disabled:opacity-40">
          <Save size={16} />
          {saving ? 'جارٍ الحفظ...' : 'حفظ جميع التغييرات'}
        </button>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
