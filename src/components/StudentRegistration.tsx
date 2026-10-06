import { useState } from 'react'
import { CheckCircle, Send, Copy, Check, Landmark, Building2, AlertCircle } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { FieldWrapper, Input, RadioGroup, Textarea } from '@/components/ui/FormField'
import FileUploader from '@/components/ui/FileUploader'
import RegistrationRequirements from '@/components/RegistrationRequirements'
import RegistrationTerms from '@/components/RegistrationTerms'
import { mockApplicationsService } from '@/services/applications.service'
import { siteContentService } from '@/services/site.service'
import { uploadDocument, validateDocumentFile, type DocumentCategory } from '@/lib/documentStore'

type FormData = Record<string, string>

const BANK_ACCOUNTS = [
  { bank: 'بنك الراجحي', iban: 'SA3980000186608010778856', icon: Landmark },
  { bank: 'البنك الأهلي السعودي', iban: 'SA3510000015600002082604', icon: Building2 },
] as const

const PHONE_REGEX = /^(05\d{8}|\+9665\d{8})$/

export default function StudentRegistration() {
  const formConfig = siteContentService.getStudentForm()
  const visibleFields = formConfig.fields.filter((f) => f.isVisible).sort((a, b) => a.order - b.order)

  const getField = (id: string) => visibleFields.find((f) => f.id === id)

  const initial: FormData = Object.fromEntries(visibleFields.map((f) => [f.id, ''])) as FormData

  const [data, setData] = useState<FormData>(initial)
  const [motherPhone, setMotherPhone] = useState('')
  const [fatherPhone, setFatherPhone] = useState('')
  const [otherPhone, setOtherPhone] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [copiedIban, setCopiedIban] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)
  // files
  const [healthFile, setHealthFile] = useState<File | null>(null)
  const [childIdFile, setChildIdFile] = useState<File | null>(null)
  const [guardianIdFile, setGuardianIdFile] = useState<File | null>(null)
  const [childPhotoFile, setChildPhotoFile] = useState<File | null>(null)
  const [birthCertFile, setBirthCertFile] = useState<File | null>(null)
  const [sketchFile, setSketchFile] = useState<File | null>(null)
  const [paymentFile, setPaymentFile] = useState<File | null>(null)
  const [termsAccepted, setTermsAccepted] = useState(false)

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

  const copyIban = async (iban: string) => {
    try {
      await navigator.clipboard.writeText(iban)
      setCopiedIban(iban)
      setTimeout(() => setCopiedIban(null), 2000)
    } catch {
      // fallback
      const ta = document.createElement('textarea')
      ta.value = iban
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopiedIban(iban)
      setTimeout(() => setCopiedIban(null), 2000)
    }
  }

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {}
    for (const f of visibleFields) {
      const v = (data[f.id] ?? '').trim()
      if (f.required && !v) e[f.id] = `${f.label} مطلوب`
      if (f.id === 'guardianPhone' && v && !PHONE_REGEX.test(v.replace(/[\s-]/g, ''))) e[f.id] = 'رقم الجوال غير صحيح (مثال: 05XXXXXXXX)'
      if (f.id === 'birthDate' && v) {
        const d = new Date(v)
        if (Number.isNaN(d.getTime())) e[f.id] = 'تاريخ الميلاد غير صحيح'
        else if (d > new Date()) e[f.id] = 'تاريخ الميلاد لا يمكن أن يكون في المستقبل'
      }
    }
    // phones new — required
    if (!motherPhone.trim()) e.motherPhone = 'رقم الأم مطلوب'
    else if (!PHONE_REGEX.test(motherPhone.replace(/[\s-]/g, ''))) e.motherPhone = 'رقم الأم غير صحيح (مثال: 05XXXXXXXX)'
    if (!fatherPhone.trim()) e.fatherPhone = 'رقم الأب مطلوب'
    else if (!PHONE_REGEX.test(fatherPhone.replace(/[\s-]/g, ''))) e.fatherPhone = 'رقم الأب غير صحيح (مثال: 05XXXXXXXX)'
    if (otherPhone.trim() && !PHONE_REGEX.test(otherPhone.replace(/[\s-]/g, ''))) e.otherPhone = 'رقم الجوال غير صحيح'

    // documents — required (5 + payment)
    const checkFile = (file: File | null, key: string, label: string) => {
      if (!file) e[key] = `${label} مطلوب`
      else {
        const err = validateDocumentFile(file)
        if (err) e[key] = err
      }
    }
    checkFile(guardianIdFile, 'guardianId', 'صورة الهوية')
    checkFile(childPhotoFile, 'childPhoto', 'الصورة الشخصية')
    checkFile(healthFile, 'healthReport', 'التقرير الطبي أو الإحالة')
    checkFile(sketchFile, 'locationSketch', 'كروكي موقع السكن')
    checkFile(childIdFile, 'childId', 'هوية الطفل أو كرت العائلة')
    checkFile(birthCertFile, 'birthCertificate', 'شهادة الميلاد')
    checkFile(paymentFile, 'paymentProof', 'إثبات التحويل')

    if (!termsAccepted) e.termsAccepted = 'يجب الإقرار بصحة البيانات والالتزام بالشروط قبل التقديم'

    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const v = validate()
    setErrors(v)
    if (Object.keys(v).filter((k) => v[k]).length > 0) {
      const first = Object.keys(v).find((k) => v[k])
      if (first) {
        const el = document.getElementById(first)
        if (el) el.focus()
        else {
          // try scroll to file uploader section
          const sec = document.getElementById('documents-section')
          sec?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
      return
    }
    if (isSubmitting) return
    setIsSubmitting(true)
    setUploadProgress(null)
    try {
      const stageMap: Record<string, 'kindergarten' | 'pre_primary'> = {
        'روضة (تمهيدي)': 'kindergarten',
        'تمهيدي صف أول': 'pre_primary',
      }
      const periodMap: Record<string, 'morning' | 'evening'> = {
        صباحية: 'morning',
        مسائية: 'evening',
      }
      // Step 1: create record to get id
      setUploadProgress('جارٍ حفظ البيانات...')
      const createRes = await mockApplicationsService.createStudent({
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
        motherPhone: motherPhone.replace(/[\s-]/g, ''),
        fatherPhone: fatherPhone.replace(/[\s-]/g, ''),
        otherPhone: otherPhone.trim() ? otherPhone.replace(/[\s-]/g, '') : undefined,
        termsAcceptedAt: new Date().toISOString(),
      })
      const studentId = createRes.data.id

      // Step 2: upload documents sequentially (private bucket)
      const uploads: Array<{ cat: DocumentCategory; file: File; key: keyof typeof urlMap }> = [
        { cat: 'health-report', file: healthFile!, key: 'healthReportUrl' },
        { cat: 'child-id', file: childIdFile!, key: 'childIdUrl' },
        { cat: 'guardian-id', file: guardianIdFile!, key: 'guardianIdUrl' },
        { cat: 'child-photo', file: childPhotoFile!, key: 'childPhotoUrl' },
        { cat: 'birth-certificate', file: birthCertFile!, key: 'birthCertificateUrl' },
        { cat: 'location-sketch', file: sketchFile!, key: 'locationSketchUrl' },
        { cat: 'payment-proof', file: paymentFile!, key: 'paymentProofUrl' },
      ]
      const urlMap: Record<string, string> = {}
      for (let i = 0; i < uploads.length; i++) {
        const u = uploads[i]
        setUploadProgress(`جارٍ رفع ${i + 1} من ${uploads.length}...`)
        try {
          const { path } = await uploadDocument(u.file, studentId, u.cat)
          urlMap[u.key] = path
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'فشل رفع الملف'
          // cleanup: try delete already uploaded? not needed for now
          throw new Error(`${u.cat}: ${msg}`)
        }
      }

      // Step 3: patch record with urls
      setUploadProgress('جارٍ إكمال التسجيل...')
      if (Object.keys(urlMap).length > 0) {
        await mockApplicationsService.updateStudentDocs(studentId, urlMap as never)
      }

      setIsSuccess(true)
      setData(initial)
      setMotherPhone('')
      setFatherPhone('')
      setOtherPhone('')
      setHealthFile(null)
      setChildIdFile(null)
      setGuardianIdFile(null)
      setChildPhotoFile(null)
      setBirthCertFile(null)
      setSketchFile(null)
      setPaymentFile(null)
      setTermsAccepted(false)
      setErrors({})
      setUploadProgress(null)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ أثناء الإرسال، حاول مرة أخرى'
      setErrors({ studentName: msg })
      setUploadProgress(null)
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

        <RegistrationRequirements />

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
                <Input id="guardianPhone" error={errors.guardianPhone} value={data.guardianPhone ?? ''} onChange={(e) => update('guardianPhone', e.target.value)} placeholder="05XXXXXXXX" inputMode="numeric" dir="ltr" type="tel" autoComplete="tel" />
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

          {/* ── مستندات وبيانات ولي الأمر ── */}
          <div id="documents-section" className="mt-10 rounded-3xl border border-ink-100 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="font-display text-lg font-bold text-ink-800 sm:text-xl">مستندات وبيانات ولي الأمر</h3>
            <p className="mt-1 text-sm text-ink-400">يرجى تعبئة أرقام التواصل ورفع المستندات المطلوبة بصيغة JPG / JPEG / PNG / PDF</p>

            {/* أرقام الهاتف الجديد */}
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <FieldWrapper label="رقم الأم" id="motherPhone" required error={errors.motherPhone} hint="مثال: 05XXXXXXXX">
                <Input id="motherPhone" error={errors.motherPhone} value={motherPhone} onChange={(e) => { setMotherPhone(e.target.value); if (errors.motherPhone) setErrors((p) => ({ ...p, motherPhone: '' })) }} placeholder="05XXXXXXXX" type="tel" inputMode="tel" dir="ltr" autoComplete="tel" />
              </FieldWrapper>
              <FieldWrapper label="رقم الأب" id="fatherPhone" required error={errors.fatherPhone} hint="مثال: 05XXXXXXXX">
                <Input id="fatherPhone" error={errors.fatherPhone} value={fatherPhone} onChange={(e) => { setFatherPhone(e.target.value); if (errors.fatherPhone) setErrors((p) => ({ ...p, fatherPhone: '' })) }} placeholder="05XXXXXXXX" type="tel" inputMode="tel" dir="ltr" autoComplete="tel" />
              </FieldWrapper>
              <div className="sm:col-span-2">
                <FieldWrapper label="جوال آخر" id="otherPhone" error={errors.otherPhone} hint="اختياري">
                  <Input id="otherPhone" error={errors.otherPhone} value={otherPhone} onChange={(e) => { setOtherPhone(e.target.value); if (errors.otherPhone) setErrors((p) => ({ ...p, otherPhone: '' })) }} placeholder="05XXXXXXXX" type="tel" inputMode="tel" dir="ltr" autoComplete="tel" />
                </FieldWrapper>
              </div>
            </div>

            {/* رفع المستندات — بنفس ترتيب شروط ومتطلبات التسجيل */}
            <h4 className="mt-8 text-sm font-bold text-ink-500">الوثائق المطلوبة</h4>
            <div className="mt-3 grid gap-5 sm:grid-cols-2">
              <FileUploader label="رفع صورة الهوية (هوية المقيم أو بطاقة الأحوال المدنية)" id="guardianId" category="guardian-id" required value={guardianIdFile} error={errors.guardianId} onChange={(f) => { setGuardianIdFile(f); if (errors.guardianId) setErrors((p) => ({ ...p, guardianId: '' })) }} hint="يجب أن تكون سارية المفعول" />
              <FileUploader label="رفع صورة شخصية حديثة للطفل" id="childPhoto" category="child-photo" required value={childPhotoFile} error={errors.childPhoto} onChange={(f) => { setChildPhotoFile(f); if (errors.childPhoto) setErrors((p) => ({ ...p, childPhoto: '' })) }} hint="واضحة الملامح وبخلفية فاتحة" />
              <FileUploader label="هوية الطفل أو كرت العائلة" id="childId" category="child-id" required value={childIdFile} error={errors.childId} onChange={(f) => { setChildIdFile(f); if (errors.childId) setErrors((p) => ({ ...p, childId: '' })) }} hint="JPG / PNG / PDF — حتى 5MB" />
              <FileUploader label="شهادة الميلاد" id="birthCertificate" category="birth-certificate" required value={birthCertFile} error={errors.birthCertificate} onChange={(f) => { setBirthCertFile(f); if (errors.birthCertificate) setErrors((p) => ({ ...p, birthCertificate: '' })) }} hint="JPG / PNG / PDF — حتى 5MB" />
            </div>

            <h4 className="mt-8 text-sm font-bold text-ink-500">التقارير والعنوان</h4>
            <div className="mt-3 grid gap-5 sm:grid-cols-2">
              <FileUploader label="رفع التقرير الطبي أو الإحالة المعتمدة" id="healthReport" category="health-report" required value={healthFile} error={errors.healthReport} onChange={(f) => { setHealthFile(f); if (errors.healthReport) setErrors((p) => ({ ...p, healthReport: '' })) }} hint="صادر من المستشفى أو المركز الصحي" />
              <FileUploader label="رفع الكروكي / خريطة موقع السكن" id="locationSketch" category="location-sketch" required value={sketchFile} error={errors.locationSketch} onChange={(f) => { setSketchFile(f); if (errors.locationSketch) setErrors((p) => ({ ...p, locationSketch: '' })) }} hint="يمكن رفع لقطة شاشة من خرائط Google" />
            </div>
          </div>

          {/* ── الحسابات البنكية ── */}
          <div className="mt-8 rounded-3xl border border-ink-100 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="font-display text-lg font-bold text-ink-800 sm:text-xl">الحسابات البنكية</h3>
            <p className="mt-1 text-sm text-ink-400">يمكنك التحويل على أحد الحسابين التاليين ثم رفع إثبات التحويل أدناه</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {BANK_ACCOUNTS.map((acc) => {
                const Icon = acc.icon
                const isCopied = copiedIban === acc.iban
                return (
                  <div key={acc.iban} className="rounded-2xl border border-ink-100 bg-cream-50 p-4 sm:p-5">
                    <div className="flex items-center gap-2 text-sm font-bold text-ink-700">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-800 text-white">
                        <Icon size={16} />
                      </span>
                      <span className="break-words">{acc.bank}</span>
                    </div>
                    <p className="mt-3 break-all text-left font-mono text-sm font-bold tracking-wide text-ink-800" dir="ltr">
                      {acc.iban}
                    </p>
                    <button
                      type="button"
                      onClick={() => copyIban(acc.iban)}
                      className={`mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold transition-colors ${isCopied ? 'bg-teal-600 text-white' : 'bg-ink-800 text-white hover:bg-ink-900'}`}
                    >
                      {isCopied ? <><Check size={16} /> تم النسخ</> : <><Copy size={16} /> نسخ رقم الحساب</>}
                    </button>
                  </div>
                )
              })}
            </div>
            {copiedIban && <p className="mt-3 flex items-center justify-center gap-1 text-xs font-medium text-teal-700"><Check size={12} /> تم نسخ رقم الحساب</p>}
          </div>

          {/* ── إثبات التحويل ── */}
          <div className="mt-8 rounded-3xl border border-ink-100 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="font-display text-lg font-bold text-ink-800 sm:text-xl">إثبات التحويل</h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-500">بعد إتمام التحويل، يرجى رفع صورة أو ملف PDF لإثبات التحويل.</p>
            <div className="mt-5">
              <FileUploader label="ملف إثبات التحويل" id="paymentProof" category="payment-proof" required value={paymentFile} error={errors.paymentProof} onChange={(f) => { setPaymentFile(f); if (errors.paymentProof) setErrors((p) => ({ ...p, paymentProof: '' })) }} hint="JPG / JPEG / PNG / PDF — حتى 5MB — اسحب الملف أو اختر من الجهاز" />
            </div>
          </div>

          {/* ── الإقرار والتعهد ── */}
          <div className={`mt-8 rounded-3xl border bg-white p-5 shadow-sm sm:p-6 ${errors.termsAccepted ? 'border-raspberry-300' : 'border-ink-100'}`}>
            <h3 className="font-display text-lg font-bold text-ink-800 sm:text-xl">الإقرار والتعهد</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">يُرجى قراءة الشروط التالية بعناية قبل الموافقة.</p>
            <RegistrationTerms />
            <label htmlFor="termsAccepted" className="mt-4 flex cursor-pointer items-start gap-3">
              <input
                id="termsAccepted"
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => { setTermsAccepted(e.target.checked); if (errors.termsAccepted) setErrors((p) => ({ ...p, termsAccepted: '' })) }}
                aria-invalid={!!errors.termsAccepted}
                aria-describedby={errors.termsAccepted ? 'termsAccepted-error' : undefined}
                className="mt-1 h-5 w-5 shrink-0 cursor-pointer rounded border-ink-300 accent-raspberry-500"
              />
              <span className="text-sm leading-relaxed text-ink-700">
                أقر أنا المتقدم بصحة البيانات والأوراق المرفقة، وأنني قرأت الشروط أعلاه ووافقت عليها، وأتعهد بالالتزام بتعليمات مركز حور العين وأنظمته الداخلية، وسداد الرسوم المقررة، وعدم المطالبة باسترداد الرسوم بعد أسبوع من تاريخ السند.
                <span className="ms-1 text-raspberry-500">*</span>
              </span>
            </label>
            {errors.termsAccepted && (
              <p id="termsAccepted-error" className="mt-2 flex items-center gap-1 text-xs font-medium text-raspberry-600" role="alert">
                <AlertCircle size={12} /> {errors.termsAccepted}
              </p>
            )}
          </div>

          {errors.studentName && errors.studentName !== 'حدث خطأ أثناء الإرسال، حاول مرة أخرى' && (
            <div className="mt-6 flex items-center gap-2 rounded-2xl border border-raspberry-200 bg-raspberry-50 px-4 py-3 text-sm font-medium text-raspberry-700">
              <AlertCircle size={16} className="shrink-0" />
              <span className="break-words">{errors.studentName}</span>
            </div>
          )}

          {uploadProgress && (
            <div className="mt-6 flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" aria-hidden />
              {uploadProgress}
            </div>
          )}

          <button type="submit" disabled={isSubmitting} className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-raspberry-500 px-8 py-3.5 text-base font-bold text-white shadow-sm transition-colors hover:bg-raspberry-600 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-raspberry-700">
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden />
                {uploadProgress ?? 'جارٍ الإرسال...'}
              </>
            ) : (
              <>
                <Send size={18} aria-hidden />
                {formConfig.submitLabel}
              </>
            )}
          </button>

          <p className="mt-4 text-center text-xs text-ink-400">بياناتك ومستنداتك محمية ولن تُشارك مع أي جهة خارجية. سيتم حفظ الطلب بأمان ومتابعته من الإدارة.</p>
        </form>
      </Container>
    </section>
  )
}
