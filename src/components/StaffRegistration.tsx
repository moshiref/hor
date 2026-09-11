import { useState } from 'react'
import { CheckCircle, Send } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { CheckboxGroup, FieldWrapper, Input, RadioGroup, Select, Textarea } from '@/components/ui/FormField'
import { mockApplicationsService } from '@/services/applications.service'
import { siteContentService } from '@/services/site.service'

type FormData = {
  fullName: string
  phone: string
  currentEmployer: string
  currentRole: string
  currentRoleOther: string
  reasonToJoin: string
  reasonOther: string
  wantsToJoinList: string
  futureTopics: string[]
  futureTopicsOther: string
}

const initial: FormData = {
  fullName: '',
  phone: '',
  currentEmployer: '',
  currentRole: '',
  currentRoleOther: '',
  reasonToJoin: '',
  reasonOther: '',
  wantsToJoinList: '',
  futureTopics: [],
  futureTopicsOther: '',
}

type Errors = Partial<Record<string, string>>

function validate(data: FormData): Errors {
  const e: Errors = {}
  if (!data.fullName.trim()) e.fullName = 'الاسم مطلوب'
  if (!data.phone.trim()) e.phone = 'رقم الجوال مطلوب'
  else if (!/^(05\d{8}|\+9665\d{8})$/.test(data.phone.replace(/[\s-]/g, ''))) e.phone = 'رقم الجوال غير صحيح (مثال: 05XXXXXXXX)'
  if (!data.currentEmployer.trim()) e.currentEmployer = 'جهة العمل الحالية مطلوبة'
  if (!data.currentRole) e.currentRole = 'طبيعة عملك الحالية مطلوبة'
  if (data.currentRole === 'أخرى' && !data.currentRoleOther.trim()) e.currentRoleOther = 'حددي طبيعة العمل عند اختيار أخرى'
  if (!data.reasonToJoin) e.reasonToJoin = 'هذا الحقل مطلوب'
  if (data.reasonToJoin === 'أخرى' && !data.reasonOther.trim()) e.reasonOther = 'حددي السبب عند اختيار أخرى'
  if (!data.wantsToJoinList) e.wantsToJoinList = 'الاختيار مطلوب'
  if (data.futureTopics.length === 0) e.futureTopics = 'اختيار برنامج واحد على الأقل مطلوب'
  if (data.futureTopics.includes('أخرى') && !data.futureTopicsOther.trim()) e.futureTopicsOther = 'حددي الموضوع عند اختيار أخرى'
  return e
}

export default function StaffRegistration() {
  const formConfig = siteContentService.getStaffForm()
  const getField = (id: string) => formConfig.fields.find((f) => f.id === id)
  const roleOptions = getField('currentRole')?.options ?? ['مقدمة رعاية', 'معلمة رياض أطفال', 'مشرفة', 'قائدة مركز', 'أخرى']
  const reasonOptions = getField('reasonToJoin')?.options ?? ['الحصول على شهادة مهنية', 'تطوير مهاراتي في رعاية الأطفال', 'تحسين فرصي الوظيفية', 'متطلبات جهة العمل', 'الاستفادة من الرسوم المدعومة', 'أخرى']
  const futureTopicsOptions = getField('futureTopics')?.options ?? ['الممارس المعتمد في الطفولة', 'مراحل نمو الطفل وخصائصه النمائية', 'إدارة السلوك والتربية الإيجابية', 'ملاحظة الطفل وإعداد خطط التدخل', 'تصميم الأنشطة والبرامج التربوية', 'حماية الطفل والسلامة المهنية', 'الصحة النفسية للطفل', 'التعامل مع الأطفال ذوي الاحتياجات الخاصة', 'إدارة وتشغيل مراكز ضيافة الأطفال', 'القيادة والإشراف التربوي', 'الجودة والاعتماد في مراكز الطفولة', 'إدارة المشاريع والمبادرات التربوية', 'أخرى']

  const [data, setData] = useState<FormData>(initial)
  const [errors, setErrors] = useState<Errors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const update = (field: keyof FormData, value: string | string[]) => {
    setData((p) => ({ ...p, [field]: value }))
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const v = validate(data)
    setErrors(v)
    if (Object.keys(v).length > 0) {
      const first = Object.keys(v)[0]
      document.getElementById(first)?.focus()
      return
    }
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      const roleFinal = data.currentRole === 'أخرى' ? data.currentRoleOther.trim() : data.currentRole
      const reasonFinal = data.reasonToJoin === 'أخرى' ? data.reasonOther.trim() : data.reasonToJoin
      const topicsFinal = data.futureTopics.includes('أخرى')
        ? [...data.futureTopics.filter((t) => t !== 'أخرى'), `أخرى: ${data.futureTopicsOther.trim()}`].join('، ')
        : data.futureTopics.join('، ')

      await mockApplicationsService.createStaff({
        fullName: data.fullName.trim(),
        phone: data.phone.replace(/[\s-]/g, ''),
        currentEmployer: data.currentEmployer.trim(),
        currentRole: roleFinal,
        reasonToJoin: reasonFinal,
        wantsToJoinList: data.wantsToJoinList === 'نعم' ? 'yes' : 'no',
        futureTopics: topicsFinal,
      })
      setIsSuccess(true)
      setData(initial)
      setErrors({})
    } catch {
      setErrors({ fullName: 'حدث خطأ أثناء الإرسال، حاولي مرة أخرى' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <section id="staff-registration" className="scroll-mt-20 bg-cream-50 py-20 sm:py-28" aria-labelledby="staff-heading">
        <Container>
          <div className="mx-auto max-w-2xl rounded-3xl bg-teal-50 p-8 text-center sm:p-12">
            <CheckCircle size={48} className="mx-auto text-teal-600" aria-hidden />
            <h2 className="mt-4 font-display text-2xl font-bold text-ink-800">{formConfig.successTitle}</h2>
            <p className="mt-3 text-base leading-relaxed text-ink-600">{formConfig.successDescription}</p>
            <button
              onClick={() => setIsSuccess(false)}
              className="mt-6 inline-flex rounded-full border border-teal-600 px-6 py-2 text-sm font-bold text-teal-700 hover:bg-teal-600 hover:text-white"
            >
              إرسال طلب آخر
            </button>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section id="staff-registration" className="scroll-mt-20 bg-cream-50 py-20 sm:py-28" aria-labelledby="staff-heading">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="staff-heading" className="font-display text-3xl font-bold text-ink-800 sm:text-4xl">
            {formConfig.title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-600">{formConfig.description}</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mx-auto mt-10 max-w-3xl rounded-3xl bg-white p-6 shadow-card sm:p-8">
          <h3 className="font-display text-lg font-bold text-ink-800">بيانات المتقدمة</h3>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <FieldWrapper label="الاسم" id="fullName" required error={errors.fullName}>
              <Input id="fullName" error={errors.fullName} value={data.fullName} onChange={(e) => update('fullName', e.target.value)} placeholder="الاسم الكامل" autoComplete="name" />
            </FieldWrapper>
            <FieldWrapper label="رقم الجوال" id="phone" required error={errors.phone} hint="مثال: 05XXXXXXXX">
              <Input id="phone" error={errors.phone} value={data.phone} onChange={(e) => update('phone', e.target.value)} placeholder="05XXXXXXXX" inputMode="numeric" dir="ltr" />
            </FieldWrapper>
          </div>

          <div className="mt-6">
            <FieldWrapper label="جهة العمل الحالية" id="currentEmployer" required error={errors.currentEmployer}>
              <Input
                id="currentEmployer"
                error={errors.currentEmployer}
                value={data.currentEmployer}
                onChange={(e) => update('currentEmployer', e.target.value)}
                placeholder="مثال: مركز حور العين"
              />
            </FieldWrapper>
          </div>

          <div className="mt-6">
            <FieldWrapper label="طبيعة عملك الحالية" id="currentRole" required error={errors.currentRole}>
              <Select id="currentRole" error={errors.currentRole} value={data.currentRole} onChange={(e) => update('currentRole', e.target.value)}>
                <option value="">اختر طبيعة العمل</option>
                {roleOptions.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </Select>
            </FieldWrapper>
            {data.currentRole === 'أخرى' && (
              <div className="mt-4">
                <FieldWrapper label="حددي طبيعة العمل" id="currentRoleOther" required error={errors.currentRoleOther}>
                  <Input
                    id="currentRoleOther"
                    error={errors.currentRoleOther}
                    value={data.currentRoleOther}
                    onChange={(e) => update('currentRoleOther', e.target.value)}
                    placeholder="اكتبي طبيعة عملك"
                  />
                </FieldWrapper>
              </div>
            )}
          </div>

          <div className="mt-6">
            <FieldWrapper label="ما أكثر ما يدفعك للالتحاق بالبرنامج؟" id="reasonToJoin" required error={errors.reasonToJoin}>
              <Select id="reasonToJoin" error={errors.reasonToJoin} value={data.reasonToJoin} onChange={(e) => update('reasonToJoin', e.target.value)}>
                <option value="">اختر السبب</option>
                {reasonOptions.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </Select>
            </FieldWrapper>
            {data.reasonToJoin === 'أخرى' && (
              <div className="mt-4">
                <FieldWrapper label="حددي السبب" id="reasonOther" required error={errors.reasonOther}>
                  <Textarea
                    id="reasonOther"
                    error={errors.reasonOther}
                    value={data.reasonOther}
                    onChange={(e) => update('reasonOther', e.target.value)}
                    placeholder="اكتبي السبب"
                    rows={3}
                  />
                </FieldWrapper>
              </div>
            )}
          </div>

          <div className="mt-6">
            <RadioGroup
              legend="هل ترغبين في الانضمام لقائمة برامج شركة حلول الطفولة وإشعارك بالبرامج القادمة؟"
              name="wantsToJoinList"
              required
              options={[
                { value: 'نعم', label: 'نعم' },
                { value: 'لا', label: 'لا' },
              ]}
              value={data.wantsToJoinList}
              onChange={(v) => update('wantsToJoinList', v)}
              error={errors.wantsToJoinList}
            />
          </div>

          <div className="mt-6">
            <CheckboxGroup
              legend="ما البرامج أو الموضوعات التي ترغبين في الالتحاق بها مستقبلاً؟"
              required
              options={futureTopicsOptions.map((o) => ({ value: o, label: o }))}
              values={data.futureTopics}
              onChange={(v) => update('futureTopics', v)}
              error={errors.futureTopics}
            />
            {data.futureTopics.includes('أخرى') && (
              <div className="mt-4">
                <FieldWrapper label="حددي البرنامج أو الموضوع" id="futureTopicsOther" required error={errors.futureTopicsOther}>
                  <Textarea
                    id="futureTopicsOther"
                    error={errors.futureTopicsOther}
                    value={data.futureTopicsOther}
                    onChange={(e) => update('futureTopicsOther', e.target.value)}
                    placeholder="اكتبي البرامج التي ترغبين بها"
                    rows={3}
                  />
                </FieldWrapper>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-raspberry-500 px-8 py-3.5 text-base font-bold text-white shadow-sm transition-colors hover:bg-raspberry-600 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-raspberry-700"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden />
                جارٍ الإرسال...
              </>
            ) : (
              <>
                <Send size={18} aria-hidden />
                إرسال طلب التقديم
              </>
            )}
          </button>
          <p className="mt-4 text-center text-xs text-ink-400">بياناتك محمية ولن تُشارك خارج نطاق إدارة المركز وشركة حلول الطفولة.</p>
        </form>
      </Container>
    </section>
  )
}
