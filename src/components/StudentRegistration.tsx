import { useState } from 'react'
import { CheckCircle, Send } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { FieldWrapper, Input, RadioGroup, Textarea } from '@/components/ui/FormField'
import { mockApplicationsService } from '@/services/applications.service'
import { siteContentService } from '@/services/site.service'

type FormData = Record<string, string>

export default function StudentRegistration() {
  const formConfig = siteContentService.getStudentForm()
  const visibleFields = formConfig.fields.filter((f) => f.isVisible).sort((a, b) => a.order - b.order)

  const getField = (id: string) => visibleFields.find((f) => f.id === id)

  const initial: FormData = Object.fromEntries(visibleFields.map((f) => [f.id, ''])) as FormData

  const [data, setData] = useState<FormData>(initial)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const fieldLabel = (id: string, fallback: string) => getField(id)?.label ?? fallback
  const fieldRequired = (id: string) => !!getField(id)?.required
  const fieldOptions = (id: string, fallback: string[]) => getField(id)?.options ?? fallback
  const fieldPlaceholder = (id: string) => getField(id)?.placeholder
  const fieldHint = (id: string) => getField(id)?.hint

  const isVisible = (id: string) => !!getField(id)

  const update = (field: string, value: string) => {
    setData((p) => ({ ...p, [field]: value }))
    if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }))
  }

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {}
    for (const f of visibleFields) {
      const v = (data[f.id] ?? '').trim()
      if (f.required && !v) e[f.id] = `${f.label} مطلوب`
      if (f.id === 'guardianPhone' && v && !/^(05\d{8}|\+9665\d{8})$/.test(v.replace(/[\s-]/g, ''))) e[f.id] = 'رقم الجوال غير صحيح (مثال: 05XXXXXXXX)'
      if (f.id === 'birthDate' && v) {
        const d = new Date(v)
        if (Number.isNaN(d.getTime())) e[f.id] = 'تاريخ الميلاد غير صحيح'
        else if (d > new Date()) e[f.id] = 'تاريخ الميلاد لا يمكن أن يكون في المستقبل'
      }
    }
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const v = validate()
    setErrors(v)
    if (Object.keys(v).filter((k) => v[k]).length > 0) {
      const first = Object.keys(v).find((k) => v[k])
      if (first) document.getElementById(first)?.focus()
      return
    }
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      const stageMap: Record<string, 'kindergarten' | 'pre_primary'> = {
        'روضة (تمهيدي)': 'kindergarten',
        'تمهيدي صف أول': 'pre_primary',
      }
      const periodMap: Record<string, 'morning' | 'evening'> = {
        صباحية: 'morning',
        مسائية: 'evening',
      }
      await mockApplicationsService.createStudent({
        studentName: (data.studentName ?? '').trim(),
        birthDate: data.birthDate ?? '',
        gender: data.gender === 'ذكر' ? 'male' : 'female',
        stage: stageMap[data.stage] ?? 'kindergarten',
        period: periodMap[data.period] ?? 'morning',
        guardianName: (data.guardianName ?? '').trim(),
        guardianPhone: (data.guardianPhone ?? '').replace(/[\s-]/g, ''),
        district: (data.district ?? '').trim(),
        needsTransport: data.needsTransport === 'نعم' ? 'yes' : 'no',
        healthNotes: (data.healthNotes ?? '').trim() || undefined,
        extraNotes: (data.extraNotes ?? '').trim() || undefined,
      })
      setIsSuccess(true)
      setData(initial)
      setErrors({})
    } catch {
      setErrors({ studentName: 'حدث خطأ أثناء الإرسال، حاول مرة أخرى' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <section id="registration" className="scroll-mt-20 bg-white py-20 sm:py-28" aria-labelledby="reg-heading">
        <Container>
          <div className="mx-auto max-w-2xl rounded-3xl bg-teal-50 p-8 text-center sm:p-12">
            <CheckCircle size={48} className="mx-auto text-teal-600" aria-hidden />
            <h2 className="mt-4 font-display text-2xl font-bold text-ink-800">{formConfig.successTitle}</h2>
            <p className="mt-3 text-base leading-relaxed text-ink-600">{formConfig.successDescription}</p>
            <button onClick={() => setIsSuccess(false)} className="mt-6 inline-flex rounded-full border border-teal-600 px-6 py-2 text-sm font-bold text-teal-700 hover:bg-teal-600 hover:text-white">
              إرسال طلب آخر
            </button>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section id="registration" className="scroll-mt-20 bg-white py-20 sm:py-28" aria-labelledby="reg-heading">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-raspberry-50 px-3.5 py-1 text-xs font-bold tracking-wide text-raspberry-700 ring-1 ring-raspberry-200">
            <span className="h-1.5 w-1.5 rounded-full bg-raspberry-500 pulse-dot inline-block" aria-hidden />
            التسجيل مفتوح الآن
          </p>
          <h2 id="reg-heading" className="font-display bg-gradient-to-l from-raspberry-600 via-raspberry-500 to-teal-600 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
            {formConfig.title}
          </h2>
          <div aria-hidden className="mx-auto mt-3 h-1 w-16 rounded-full bg-gradient-to-l from-raspberry-400 to-teal-400" />
          <p className="mt-4 text-lg leading-relaxed text-ink-600">{formConfig.description}</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mx-auto mt-10 max-w-3xl rounded-3xl bg-cream-50 p-6 shadow-card sm:p-8">
          {(isVisible('studentName') || isVisible('birthDate')) && (
            <div className="grid gap-6 sm:grid-cols-2">
              {isVisible('studentName') && (
                <FieldWrapper label={fieldLabel('studentName', 'اسم الطالب/الطالبة')} id="studentName" required={fieldRequired('studentName')} error={errors.studentName}>
                  <Input id="studentName" error={errors.studentName} value={data.studentName ?? ''} onChange={(e) => update('studentName', e.target.value)} placeholder={fieldPlaceholder('studentName') ?? 'مثال: محمد أحمد'} autoComplete="name" />
                </FieldWrapper>
              )}
              {isVisible('birthDate') && (
                <FieldWrapper label={fieldLabel('birthDate', 'تاريخ الميلاد')} id="birthDate" required={fieldRequired('birthDate')} error={errors.birthDate}>
                  <Input id="birthDate" error={errors.birthDate} type="date" value={data.birthDate ?? ''} onChange={(e) => update('birthDate', e.target.value)} max={new Date().toISOString().split('T')[0]} />
                </FieldWrapper>
              )}
            </div>
          )}

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {isVisible('gender') && (
              <RadioGroup
                legend={fieldLabel('gender', 'الجنس')}
                name="gender"
                required={fieldRequired('gender')}
                options={fieldOptions('gender', ['ذكر', 'أنثى']).map((o) => ({ value: o, label: o }))}
                value={data.gender ?? ''}
                onChange={(v) => update('gender', v)}
                error={errors.gender}
              />
            )}
            {isVisible('stage') && (
              <RadioGroup
                legend={fieldLabel('stage', 'المرحلة المطلوبة')}
                name="stage"
                required={fieldRequired('stage')}
                options={fieldOptions('stage', ['روضة (تمهيدي)', 'تمهيدي صف أول']).map((o) => ({ value: o, label: o }))}
                value={data.stage ?? ''}
                onChange={(v) => update('stage', v)}
                error={errors.stage}
              />
            )}
          </div>

          {isVisible('period') && (
            <div className="mt-6">
              <RadioGroup
                legend={fieldLabel('period', 'الفترة المطلوبة')}
                name="period"
                required={fieldRequired('period')}
                options={fieldOptions('period', ['صباحية', 'مسائية']).map((o) => ({ value: o, label: o }))}
                value={data.period ?? ''}
                onChange={(v) => update('period', v)}
                error={errors.period}
              />
            </div>
          )}

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {isVisible('guardianName') && (
              <FieldWrapper label={fieldLabel('guardianName', 'اسم ولي الأمر')} id="guardianName" required={fieldRequired('guardianName')} error={errors.guardianName}>
                <Input id="guardianName" error={errors.guardianName} value={data.guardianName ?? ''} onChange={(e) => update('guardianName', e.target.value)} placeholder="الاسم الكامل" autoComplete="name" />
              </FieldWrapper>
            )}
            {isVisible('guardianPhone') && (
              <FieldWrapper label={fieldLabel('guardianPhone', 'رقم جوال ولي الأمر (واتساب)')} id="guardianPhone" required={fieldRequired('guardianPhone')} error={errors.guardianPhone} hint={fieldHint('guardianPhone') ?? 'مثال: 05XXXXXXXX'}>
                <Input id="guardianPhone" error={errors.guardianPhone} value={data.guardianPhone ?? ''} onChange={(e) => update('guardianPhone', e.target.value)} placeholder="05XXXXXXXX" inputMode="numeric" dir="ltr" />
              </FieldWrapper>
            )}
          </div>

          {isVisible('district') && (
            <div className="mt-6">
              <FieldWrapper label={fieldLabel('district', 'العنوان/الحي')} id="district" required={fieldRequired('district')} error={errors.district}>
                <Input id="district" error={errors.district} value={data.district ?? ''} onChange={(e) => update('district', e.target.value)} placeholder={fieldPlaceholder('district') ?? 'مثال: حي النزهة'} />
              </FieldWrapper>
            </div>
          )}

          {isVisible('needsTransport') && (
            <div className="mt-6">
              <RadioGroup
                legend={fieldLabel('needsTransport', 'الحاجة للمواصلات')}
                name="needsTransport"
                required={fieldRequired('needsTransport')}
                options={fieldOptions('needsTransport', ['نعم', 'لا']).map((o) => ({ value: o, label: o }))}
                value={data.needsTransport ?? ''}
                onChange={(v) => update('needsTransport', v)}
                error={errors.needsTransport}
              />
            </div>
          )}

          {isVisible('healthNotes') && (
            <div className="mt-6">
              <FieldWrapper label={fieldLabel('healthNotes', 'ملاحظات صحية/حساسية غذائية')} id="healthNotes" required={fieldRequired('healthNotes')} error={errors.healthNotes} hint={fieldHint('healthNotes') ?? 'اختياري'}>
                <Textarea id="healthNotes" error={errors.healthNotes} value={data.healthNotes ?? ''} onChange={(e) => update('healthNotes', e.target.value)} placeholder="اذكر أي ملاحظات صحية أو حساسيات إن وجدت" rows={3} />
              </FieldWrapper>
            </div>
          )}

          {isVisible('extraNotes') && (
            <div className="mt-6">
              <FieldWrapper label={fieldLabel('extraNotes', 'ملاحظات إضافية')} id="extraNotes" required={fieldRequired('extraNotes')} error={errors.extraNotes} hint={fieldHint('extraNotes') ?? 'اختياري'}>
                <Textarea id="extraNotes" error={errors.extraNotes} value={data.extraNotes ?? ''} onChange={(e) => update('extraNotes', e.target.value)} placeholder="أي ملاحظات أخرى ترغب بإضافتها" rows={3} />
              </FieldWrapper>
            </div>
          )}

          <button type="submit" disabled={isSubmitting} className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-raspberry-500 px-8 py-3.5 text-base font-bold text-white shadow-sm transition-colors hover:bg-raspberry-600 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-raspberry-700">
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden />
                جارٍ الإرسال...
              </>
            ) : (
              <>
                <Send size={18} aria-hidden />
                {formConfig.submitLabel}
              </>
            )}
          </button>

          <p className="mt-4 text-center text-xs text-ink-400">بياناتك محمية ولن تُشارك مع أي جهة خارجية. سيتم حفظ الطلب بأمان ومتابعته من الإدارة.</p>
        </form>
      </Container>
    </section>
  )
}
