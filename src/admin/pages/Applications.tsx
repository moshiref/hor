import { useEffect, useMemo, useState } from 'react'
import { load, storageKeys } from '@/lib/storage'
import { mockApplicationsService } from '@/services/applications.service'
import type { ApplicationStatus, StaffApplication } from '@/types/applications'
import { APPLICATION_STATUS_LABEL } from '@/types/applications'
import { Search, Phone, Building2, Briefcase, Calendar, Eye, Trash2, Save, X, Check, AlertCircle, FileText, Users } from 'lucide-react'

type StatusFilter = ApplicationStatus | 'all'

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'الكل' },
  { value: 'new', label: 'جديد' },
  { value: 'under_review', label: 'قيد المراجعة' },
  { value: 'contacted', label: 'تم التواصل' },
  { value: 'accepted', label: 'مقبول' },
  { value: 'rejected', label: 'مرفوض' },
]

function statusBadge(status: ApplicationStatus) {
  const map: Record<ApplicationStatus, string> = {
    new: 'bg-amber-100 text-amber-700 ring-amber-200',
    under_review: 'bg-sky-100 text-sky-700 ring-sky-200',
    contacted: 'bg-teal-100 text-teal-700 ring-teal-200',
    accepted: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
    rejected: 'bg-raspberry-100 text-raspberry-700 ring-raspberry-200',
    archived: 'bg-gray-100 text-gray-700 ring-gray-200',
  }
  return map[status] ?? 'bg-gray-100 text-gray-700 ring-gray-200'
}

export default function Applications() {
  const [raw, setRaw] = useState<StaffApplication[]>(() => load<StaffApplication[]>(storageKeys.staff, []))
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [detail, setDetail] = useState<StaffApplication | null>(null)
  const [editStatus, setEditStatus] = useState<ApplicationStatus>('new')
  const [editNotes, setEditNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const refresh = () => {
    setRaw(load<StaffApplication[]>(storageKeys.staff, []))
  }

  useEffect(() => {
    // try to sync from Supabase on mount
    mockApplicationsService.listStaff().then((res) => {
      if (res.data) setRaw(res.data)
    }).catch(() => refresh())
    const onStorage = () => refresh()
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  useEffect(() => {
    if (detail) {
      setEditStatus(detail.status)
      setEditNotes(detail.notesInternal ?? '')
    }
  }, [detail])

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: raw.length, new: 0, under_review: 0, contacted: 0, accepted: 0, rejected: 0 }
    for (const r of raw) {
      if (r.status in c) c[r.status]++
    }
    return c
  }, [raw])

  const filtered = useMemo(() => {
    let arr = [...raw]
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      arr = arr.filter((r) =>
        `${r.fullName} ${r.phone} ${r.currentEmployer ?? ''} ${r.currentRole ?? ''} ${r.reasonToJoin ?? ''}`.toLowerCase().includes(q)
      )
    }
    if (statusFilter !== 'all') arr = arr.filter((r) => r.status === statusFilter)
    arr.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    return arr
  }, [raw, search, statusFilter])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const handleSave = async () => {
    if (!detail) return
    if (editStatus === detail.status && editNotes === (detail.notesInternal ?? '')) {
      showToast('لا توجد تغييرات للحفظ')
      return
    }
    if (!confirm('تأكيد حفظ التعديلات؟')) return
    setSaving(true)
    try {
      const res = await mockApplicationsService.updateStaff(detail.id, { status: editStatus, notesInternal: editNotes || undefined })
      setDetail(res.data)
      refresh()
      showToast('تم حفظ التعديلات بنجاح')
    } catch {
      showToast('فشل الحفظ — حاولي مرة أخرى')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب؟ لا يمكن التراجع.')) return
    await mockApplicationsService.deleteStaff([id])
    refresh()
    setDetail(null)
    showToast('تم حذف الطلب')
  }

  const handleInlineStatus = async (id: string, status: ApplicationStatus) => {
    await mockApplicationsService.updateStaff(id, { status })
    refresh()
    if (detail?.id === id) setDetail((prev) => (prev ? { ...prev, status } : null))
  }

  return (
    <div className="min-w-0 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="min-w-0">
        <h1 className="flex flex-wrap items-center gap-2 break-words font-display text-lg font-bold leading-tight text-ink-800 sm:text-xl">
          <Users size={20} className="shrink-0 text-raspberry-500" />
          طلبات التقديم — عاملة رعاية طفولة
          {counts.new > 0 && (
            <span className="inline-flex items-center rounded-full bg-raspberry-500 px-2.5 py-0.5 text-xs font-bold text-white">{counts.new} جديد</span>
          )}
        </h1>
        <p className="mt-1 break-words text-sm text-gray-500">كل طلبات المتقدمات لوظيفة عاملة رعاية طفولة — تظهر هنا تلقائياً بعد إرسال النموذج من الموقع</p>
      </div>

      {/* Counts */}
      <div className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { label: 'إجمالي الطلبات', value: counts.all, color: 'bg-ink-800 text-white' },
          { label: 'جديد', value: counts.new, color: 'bg-amber-500 text-white' },
          { label: 'قيد المراجعة', value: counts.under_review, color: 'bg-sky-500 text-white' },
          { label: 'تم التواصل', value: counts.contacted, color: 'bg-teal-600 text-white' },
          { label: 'مقبول', value: counts.accepted, color: 'bg-emerald-600 text-white' },
          { label: 'مرفوض', value: counts.rejected, color: 'bg-raspberry-500 text-white' },
        ].map((c) => (
          <div key={c.label} className={`min-w-0 rounded-2xl p-3 sm:p-4 ${c.color === 'bg-ink-800 text-white' ? 'bg-ink-800 text-white' : c.color} shadow-sm`}>
            <p className="truncate text-xs font-medium opacity-90">{c.label}</p>
            <p className="mt-1 text-xl font-bold sm:text-2xl">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="min-w-0 space-y-3 overflow-hidden rounded-2xl bg-white p-3 shadow-card sm:p-4">
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث بالاسم أو الهاتف أو البريد..."
              className="h-[42px] w-full min-w-0 rounded-xl border border-ink-100 bg-white py-2.5 pe-4 ps-9 text-sm placeholder:text-gray-400 focus:border-raspberry-200 focus:outline-none focus:ring-2 focus:ring-raspberry-100"
            />
          </div>
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className={`inline-flex min-h-[36px] items-center justify-center rounded-full px-3 py-1.5 text-xs font-bold transition-colors sm:px-4 sm:text-sm ${statusFilter === opt.value ? 'bg-ink-800 text-white shadow' : 'border border-gray-200 bg-white text-ink-600 hover:bg-gray-50'}`}
              >
                {opt.label}
                <span className={`ms-1.5 rounded-full px-1.5 py-0.5 text-[11px] ${statusFilter === opt.value ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>{counts[opt.value] ?? 0}</span>
              </button>
            ))}
          </div>
        </div>
        <p className="break-words text-xs text-gray-500">يعرض {filtered.length} من أصل {raw.length} طلب — البحث يشمل الاسم والهاتف والبريد وجهة العمل</p>
      </div>

      {/* Desktop Table */}
      <div className="hidden min-w-0 overflow-hidden rounded-2xl bg-white shadow-card md:block">
        <div className="overflow-x-auto overscroll-x-contain">
          <table className="w-full min-w-[860px] border-collapse text-sm">
            <thead>
              <tr className="bg-ink-800 text-white">
                <th className="whitespace-nowrap p-3 text-center text-xs font-bold">الاسم</th>
                <th className="whitespace-nowrap p-3 text-center text-xs font-bold">رقم الهاتف</th>
                <th className="whitespace-nowrap p-3 text-center text-xs font-bold">البريد الإلكتروني</th>
                <th className="whitespace-nowrap p-3 text-center text-xs font-bold">الوظيفة</th>
                <th className="whitespace-nowrap p-3 text-center text-xs font-bold">تاريخ التقديم</th>
                <th className="whitespace-nowrap p-3 text-center text-xs font-bold">حالة الطلب</th>
                <th className="whitespace-nowrap p-3 text-center text-xs font-bold">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="p-10 text-center text-sm text-ink-400">لا توجد طلبات مطابقة</td></tr>
              ) : filtered.map((r) => (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-cream-50">
                  <td className="p-3 text-center"><button onClick={() => setDetail(r)} className="max-w-[160px] truncate font-bold text-ink-800 hover:text-raspberry-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-raspberry-500">{r.fullName}</button></td>
                  <td className="whitespace-nowrap p-3 text-center text-xs"><bdi dir="ltr" className="font-medium text-ink-700">{r.phone}</bdi></td>
                  <td className="p-3 text-center text-xs text-gray-500">—</td>
                  <td className="p-3 text-center text-xs"><span className="inline-flex max-w-[140px] truncate rounded-full bg-cream-100 px-2.5 py-1 font-medium text-ink-700">{r.currentRole ?? 'عاملة رعاية طفولة'}</span></td>
                  <td className="whitespace-nowrap p-3 text-center text-xs text-ink-500">{new Date(r.createdAt).toLocaleDateString('ar-SA')} <span className="text-[11px] text-gray-400">{new Date(r.createdAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</span></td>
                  <td className="p-3 text-center">
                    <select value={r.status} onChange={(e) => handleInlineStatus(r.id, e.target.value as ApplicationStatus)} className={`min-w-[120px] rounded-full border px-2 py-1.5 text-xs font-bold ring-1 focus:outline-none focus:ring-2 focus:ring-raspberry-100 ${statusBadge(r.status)}`}>
                      <option value="new">جديد</option>
                      <option value="under_review">قيد المراجعة</option>
                      <option value="contacted">تم التواصل</option>
                      <option value="accepted">مقبول</option>
                      <option value="rejected">مرفوض</option>
                    </select>
                  </td>
                  <td className="whitespace-nowrap p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => setDetail(r)} className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink-50 text-ink-700 hover:bg-ink-100" aria-label="عرض التفاصيل"><Eye size={14} /></button>
                      <button onClick={() => setConfirmDeleteId(r.id)} className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-raspberry-50 text-raspberry-600 hover:bg-raspberry-100" aria-label="حذف"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="grid min-w-0 gap-3 md:hidden">
        {filtered.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-card"><FileText size={28} className="mx-auto text-gray-300" /><p className="mt-2 text-sm text-ink-400">لا توجد طلبات</p></div>
        ) : filtered.map((r) => (
          <div key={r.id} className="min-w-0 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex min-w-0 items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-ink-800">{r.fullName}</p>
                <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-gray-500"><Briefcase size={12} />{r.currentRole ?? 'عاملة رعاية طفولة'}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${statusBadge(r.status)}`}>{APPLICATION_STATUS_LABEL[r.status]}</span>
            </div>
            <div className="mt-3 grid gap-1.5 text-xs text-ink-600">
              <span className="flex items-center gap-1.5 break-words"><Phone size={12} className="shrink-0 text-gray-400" /><bdi dir="ltr">{r.phone}</bdi></span>
              <span className="flex items-center gap-1.5 break-words"><Building2 size={12} className="shrink-0 text-gray-400" />{r.currentEmployer ?? '—'}</span>
              <span className="flex items-center gap-1.5"><Calendar size={12} className="shrink-0 text-gray-400" />{new Date(r.createdAt).toLocaleDateString('ar-SA')}</span>
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => setDetail(r)} className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-ink-800 py-2.5 text-xs font-bold text-white hover:bg-ink-900"><Eye size={14} /> عرض التفاصيل</button>
              <button onClick={() => setConfirmDeleteId(r.id)} className="inline-flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full border border-raspberry-200 bg-raspberry-50 text-raspberry-600"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal/Drawer — responsive */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 backdrop-blur-[1px] sm:p-4" onClick={() => setDetail(null)} role="dialog" aria-modal="true" aria-label="تفاصيل الطلب">
          <div onClick={(e) => e.stopPropagation()} className="flex max-h-[92vh] max-h-[92dvh] w-full max-w-[92vw] flex-col overflow-hidden rounded-2xl bg-white shadow-xl sm:max-w-2xl">
            <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 py-4 sm:px-6">
              <div className="min-w-0">
                <h2 className="truncate font-display text-base font-bold text-ink-800 sm:text-lg">{detail.fullName}</h2>
                <p className="text-xs text-gray-500">عاملة رعاية طفولة • {new Date(detail.createdAt).toLocaleString('ar-SA')}</p>
              </div>
              <button onClick={() => setDetail(null)} className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-400 hover:bg-gray-50 hover:text-ink-600" aria-label="إغلاق"><X size={18} /></button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="grid gap-6">
                <section className="min-w-0 rounded-xl bg-cream-50 p-4">
                  <h3 className="flex items-center gap-1.5 text-sm font-bold text-ink-800"><Users size={14} className="text-raspberry-500" /> المعلومات الشخصية</h3>
                  <div className="mt-3 grid gap-2 text-sm">
                    <p className="break-words"><span className="text-ink-400">الاسم الكامل:</span> <span className="font-medium text-ink-800">{detail.fullName}</span></p>
                    <p className="break-words"><span className="text-ink-400">رقم الهاتف:</span> <bdi dir="ltr" className="font-medium text-ink-800">{detail.phone}</bdi></p>
                    <p className="break-words"><span className="text-ink-400">البريد الإلكتروني:</span> <span className="text-gray-500">غير متوفر في النموذج الحالي</span></p>
                    <p className="break-words"><span className="text-ink-400">الوظيفة المتقدم لها:</span> <span className="font-medium">عاملة رعاية طفولة</span></p>
                  </div>
                </section>

                <section className="min-w-0">
                  <h3 className="text-sm font-bold text-raspberry-600">الخبرة والعمل</h3>
                  <div className="mt-2 grid gap-2 text-sm">
                    <p className="break-words"><span className="text-ink-400">جهة العمل الحالية:</span> {detail.currentEmployer ?? '—'}</p>
                    <p className="break-words"><span className="text-ink-400">طبيعة العمل:</span> {detail.currentRole ?? '—'}</p>
                    <p className="break-words"><span className="text-ink-400">سبب الالتحاق:</span> {detail.reasonToJoin}</p>
                    <p className="break-words"><span className="text-ink-400">الانضمام لقائمة حلول:</span> {detail.wantsToJoinList === 'yes' ? 'نعم' : 'لا'}</p>
                    <p className="break-words"><span className="text-ink-400">البرامج المستقبلية:</span> {detail.futureTopics ?? '—'}</p>
                  </div>
                </section>

                <section className="min-w-0 rounded-xl border border-amber-100 bg-amber-50/60 p-4">
                  <h3 className="text-sm font-bold text-amber-700">إدارة الطلب — الحالة والملاحظات</h3>
                  <div className="mt-3 grid gap-4">
                    <label className="flex min-w-0 flex-col gap-1.5">
                      <span className="text-xs font-bold text-ink-700">حالة الطلب</span>
                      <select value={editStatus} onChange={(e) => setEditStatus(e.target.value as ApplicationStatus)} className="min-h-[42px] w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium focus:border-raspberry-200 focus:outline-none focus:ring-2 focus:ring-raspberry-100">
                        <option value="new">جديد</option>
                        <option value="under_review">قيد المراجعة</option>
                        <option value="contacted">تم التواصل</option>
                        <option value="accepted">مقبول</option>
                        <option value="rejected">مرفوض</option>
                      </select>
                    </label>
                    <label className="flex min-w-0 flex-col gap-1.5">
                      <span className="text-xs font-bold text-ink-700">ملاحظات الإدارة (خاصة — لا تظهر للمتقدم)</span>
                      <textarea value={editNotes} onChange={(e) => setEditNotes(e.target.value)} placeholder="اكتب ملاحظات داخلية حول الطلب..." rows={3} className="min-h-[84px] w-full resize-y rounded-xl border border-gray-200 px-3 py-2.5 text-sm placeholder:text-gray-400 focus:border-raspberry-200 focus:outline-none focus:ring-2 focus:ring-raspberry-100" />
                    </label>
                    <button onClick={handleSave} disabled={saving} className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-raspberry-500 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-raspberry-600 disabled:opacity-50">
                      {saving ? 'جارٍ الحفظ...' : <><Save size={16} /> حفظ التعديلات</>}
                    </button>
                    {detail.notesInternal && (
                      <p className="break-words rounded-xl bg-white p-3 text-xs leading-relaxed text-ink-600 ring-1 ring-amber-100"><span className="font-bold text-ink-700">ملاحظة محفوظة:</span> {detail.notesInternal}</p>
                    )}
                  </div>
                </section>

                <section className="min-w-0 text-xs text-gray-500">
                  <p>تاريخ التقديم: {new Date(detail.createdAt).toLocaleString('ar-SA')}</p>
                  <p>آخر تحديث: {new Date(detail.updatedAt).toLocaleString('ar-SA')}</p>
                  {detail.reviewedAt && <p>تاريخ المراجعة: {new Date(detail.reviewedAt).toLocaleString('ar-SA')}</p>}
                  <p className="mt-1">المعرّف: <span className="font-mono text-[11px]">{detail.id}</span></p>
                </section>

                <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                  <a href={`tel:${detail.phone}`} className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-teal-600 px-5 py-2 text-sm font-bold text-white hover:bg-teal-700"><Phone size={14} /> اتصال</a>
                  <a href={`https://wa.me/${detail.phone.replace(/^0/, '966')}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-[#25D366] px-5 py-2 text-sm font-bold text-white hover:bg-[#20BD5A]">واتساب</a>
                  <button onClick={() => setConfirmDeleteId(detail.id)} className="ms-auto inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-raspberry-200 bg-white px-5 py-2 text-sm font-bold text-raspberry-600 hover:bg-raspberry-50"><Trash2 size={14} /> حذف الطلب</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[1px]" onClick={() => setConfirmDeleteId(null)} role="dialog" aria-modal="true">
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-raspberry-100 text-raspberry-600"><AlertCircle size={24} /></div>
            <h3 className="mt-4 text-center font-bold text-ink-800">تأكيد الحذف</h3>
            <p className="mt-2 text-center text-sm leading-relaxed text-gray-500">هل أنت متأكد من حذف هذا الطلب؟ لا يمكن التراجع بعد الحذف وسيتم فقد البيانات نهائياً.</p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setConfirmDeleteId(null)} className="flex-1 rounded-full border border-gray-200 bg-white py-2.5 text-sm font-bold text-ink-700 hover:bg-gray-50">إلغاء</button>
              <button onClick={() => { const id = confirmDeleteId; setConfirmDeleteId(null); handleDelete(id) }} className="flex-1 rounded-full bg-raspberry-600 py-2.5 text-sm font-bold text-white hover:bg-raspberry-700">تأكيد الحذف</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink-800 px-5 py-3 text-sm font-bold text-white shadow-lg">
          <Check size={16} className="text-emerald-400" />
          {toast}
        </div>
      )}
    </div>
  )
}
