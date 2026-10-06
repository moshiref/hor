import { IdCard, ClipboardList, MapPin, ShieldCheck, Info, Wallet, Backpack } from 'lucide-react'

const REQUIREMENTS = [
  {
    icon: IdCard,
    title: 'الوثائق المطلوبة',
    tone: 'bg-raspberry-50 text-raspberry-600 ring-raspberry-100',
    items: [
      'صورة من هوية الطفل (كرت العائلة أو الإقامة أو هوية الطفل).',
      'صورة من هوية ولي الأمر، على أن تكون سارية المفعول.',
      'صورة شهادة الميلاد وصورة كرت التطعيم.',
      'صورة شخصية حديثة للطفل، إضافة إلى 8 صور شمسية مقاس 4×3 تُسلَّم للمركز مع كتابة اسم الطفل كاملاً خلفها.',
    ],
  },
  {
    icon: ClipboardList,
    title: 'النماذج والتقارير',
    tone: 'bg-teal-50 text-teal-600 ring-teal-100',
    items: [
      'تعبئة استمارة التسجيل بكامل بياناتها دون ترك فراغات، وخاصة أرقام الجوالات (النموذج الإلكتروني أدناه).',
      'تقرير أو كشف طبي من المركز الصحي أو أي مستوصف أو مستشفى يوضّح حالة الطفل الصحية وأي حساسية أو مرض، لا قدّر الله.',
    ],
  },
  {
    icon: MapPin,
    title: 'العنوان والوصول',
    tone: 'bg-amber-50 text-amber-600 ring-amber-100',
    items: [
      'رسم كروكي مبسّط لموقع السكن، ويمكن الاكتفاء بلقطة شاشة من خرائط Google تُظهر الموقع بوضوح.',
    ],
  },
  {
    icon: Wallet,
    title: 'الرسوم والسداد',
    tone: 'bg-raspberry-50 text-raspberry-600 ring-raspberry-100',
    items: [
      'دفع الرسوم عند تقديم الاستمارة، ولا يُعتمد التسجيل إلا بعد تسديد الرسوم.',
      'اختيار طريقة السداد وإرفاق إثبات التحويل.',
    ],
  },
  {
    icon: Backpack,
    title: 'تُسلَّم للمعلمة عند الالتحاق',
    tone: 'bg-teal-50 text-teal-600 ring-teal-100',
    items: [
      'زي (ملابس) احتياطي للطفل في كيس مكتوب عليه اسمه.',
      'المتطلبات الشخصية للطفل مع كتابة اسمه عليها.',
    ],
  },
  {
    icon: ShieldCheck,
    title: 'الإقرار والتعهد',
    tone: 'bg-ink-50 text-ink-700 ring-ink-100',
    items: [
      'قراءة شروط عقد الاتفاق والموافقة عليها (في نهاية النموذج).',
      'التعهد بالالتزام بتعليمات المركز وأنظمته وسداد الرسوم في مواعيدها.',
    ],
  },
] as const

export default function RegistrationRequirements() {
  return (
    <div id="requirements" className="mx-auto mt-10 max-w-3xl scroll-mt-24" aria-labelledby="requirements-heading">
      <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-sm sm:p-8">
        <h3 id="requirements-heading" className="font-display text-xl font-bold text-ink-800 sm:text-2xl">
          شروط ومتطلبات التسجيل
        </h3>
        <p className="mt-2 text-base leading-loose text-ink-600">
          حرصاً على تنظيم عملية القبول وتقديم أفضل رعاية لأطفالكم، نأمل من أولياء الأمور الكرام استيفاء المتطلبات التالية قبل تقديم طلب التسجيل.
        </p>

        <ol className="mt-6 grid gap-4 sm:grid-cols-2">
          {REQUIREMENTS.map((req, i) => {
            const Icon = req.icon
            return (
              <li key={req.title} className="min-w-0 rounded-2xl border border-ink-100 bg-cream-50 p-5">
                <div className="flex items-center gap-3">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ${req.tone}`}>
                    <Icon size={18} aria-hidden />
                  </span>
                  <h4 className="font-display text-base font-bold text-ink-800">
                    <span className="text-ink-400">{i + 1}. </span>
                    {req.title}
                  </h4>
                </div>
                <ul className="mt-4 space-y-2.5">
                  {req.items.map((item) => (
                    <li key={item} className="flex gap-2 text-sm leading-relaxed text-ink-600">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-raspberry-400" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </li>
            )
          })}
        </ol>

        <div className="mt-6 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-800">
          <Info size={18} className="mt-0.5 shrink-0" aria-hidden />
          <div>
            <p className="font-bold">ملاحظات مهمة</p>
            <ul className="mt-1 list-disc space-y-1 ps-4">
              <li>الصيغ المقبولة للمرفقات: JPG أو PNG أو PDF، بحجم لا يتجاوز 5MB للملف الواحد.</li>
              <li>يُرجى التأكد من وضوح الصور وقراءة جميع البيانات قبل الرفع.</li>
              <li>لا يُعتمد الطلب إلا بعد اكتمال جميع المرفقات المطلوبة والإقرار بالشروط.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
