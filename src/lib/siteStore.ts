import { siteConfig as defaultConfig, navLinks as defaultNavLinks } from '@/config/site'
import { heroContent as defaultHero, aboutContent as defaultAbout, programsContent as defaultPrograms, whyUsContent as defaultWhyUs, scheduleContent as defaultSchedule } from '@/data/site-content'
import { load, save, storageKeys } from '@/lib/storage'
import type { SiteConfig, NavLink } from '@/types/site'
import type { ActivitiesContent, ContactContent, FooterContent, FormConfig, LocationContent, SectionMeta } from '@/types/cms'

// Defaults for new CMS sections
const defaultActivities: ActivitiesContent = {
  title: 'أنشطة وفعاليات المركز',
  description: 'لحظات من يوم طفلك داخل المركز — سيتم تحديث هذا المعرض بالصور الحقيقية من المركز قريبًا. البنية جاهزة لربط الصور مباشرة من لوحة التحكم.',
  items: [],
}

const defaultFooter: FooterContent = {
  id: 'footer-main',
  description: 'بيئة تربوية آمنة ودافئة تجمع بين الرعاية والتعليم والقرآن الكريم، مع اهتمام حقيقي بكل طفل.',
  links: [
    { label: 'الرئيسية', href: '#hero', order: 1, isVisible: true },
    { label: 'من نحن', href: '#about', order: 2, isVisible: true },
    { label: 'البرامج', href: '#programs', order: 3, isVisible: true },
    { label: 'تسجيل الطالب', href: '#registration', order: 4, isVisible: true },
    { label: 'التقديم كعاملة', href: '#staff-registration', order: 5, isVisible: true },
    { label: 'تواصل معنا', href: '#contact', order: 6, isVisible: true },
    { label: 'موقعنا', href: '#location', order: 7, isVisible: true },
  ],
  copyright: 'مركز حور العين لضيافة الأطفال. جميع الحقوق محفوظة.',
  showSocial: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

const defaultContact: ContactContent = {
  title: 'تواصل معنا',
  description: 'نسعد بتواصلكم والإجابة على استفساراتكم حول التسجيل والبرامج والمواصلات.',
  phoneLabel: 'جوال / واتساب',
  whatsappButtonLabel: 'تواصل معنا عبر واتساب',
  callButtonLabel: 'اتصال مباشر',
}

const defaultLocation: LocationContent = {
  title: 'موقعنا',
  helperText: 'افتح الموقع مباشرة على خرائط Google باستخدام الإحداثيات المعتمدة',
  buttonLabel: 'احصل على الاتجاهات',
}

const defaultSections: SectionMeta[] = [
  { key: 'hero', label: 'Hero', isVisible: true, order: 1 },
  { key: 'about', label: 'من نحن', isVisible: true, order: 2 },
  { key: 'programs', label: 'البرامج', isVisible: true, order: 3 },
  { key: 'activities', label: 'الأنشطة', isVisible: true, order: 4 },
  { key: 'schedule', label: 'الفترات', isVisible: true, order: 5 },
  { key: 'whyUs', label: 'لماذا حور العين', isVisible: true, order: 6 },
  { key: 'registration', label: 'تسجيل طالب', isVisible: true, order: 7 },
  { key: 'staffRegistration', label: 'التقديم كعاملة', isVisible: true, order: 8 },
  { key: 'location', label: 'الموقع', isVisible: true, order: 9 },
  { key: 'contact', label: 'تواصل', isVisible: true, order: 10 },
]

const defaultHeader = {
  ctaLabel: 'سجّل طفلك',
  ctaHref: '#registration',
  isVisible: true,
}

const defaultStudentForm: FormConfig = {
  title: 'تسجيل طالب/طالبة',
  description: 'املأ البيانات التالية بدقة، وسيتواصل معك فريق المركز لتأكيد التسجيل.',
  submitLabel: 'إرسال طلب التسجيل',
  successTitle: 'تم استلام طلب التسجيل بنجاح',
  successDescription: 'وسنتواصل معكم في أقرب وقت ممكن.',
  fields: [
    { id: 'studentName', label: 'اسم الطالب/الطالبة', type: 'text', required: true, placeholder: 'مثال: محمد أحمد', order: 1, isVisible: true },
    { id: 'birthDate', label: 'تاريخ الميلاد', type: 'date', required: true, order: 2, isVisible: true },
    { id: 'gender', label: 'الجنس', type: 'radio', required: true, options: ['ذكر', 'أنثى'], order: 3, isVisible: true },
    { id: 'stage', label: 'المرحلة المطلوبة', type: 'radio', required: true, options: ['روضة (تمهيدي)', 'تمهيدي صف أول'], order: 4, isVisible: true },
    { id: 'period', label: 'الفترة المطلوبة', type: 'radio', required: true, options: ['صباحية', 'مسائية'], order: 5, isVisible: true },
    { id: 'guardianName', label: 'اسم ولي الأمر', type: 'text', required: true, order: 6, isVisible: true },
    { id: 'guardianPhone', label: 'رقم جوال ولي الأمر (واتساب)', type: 'text', required: true, placeholder: '05XXXXXXXX', hint: 'مثال: 05XXXXXXXX', order: 7, isVisible: true },
    { id: 'district', label: 'العنوان/الحي', type: 'text', required: true, order: 8, isVisible: true },
    { id: 'needsTransport', label: 'الحاجة للمواصلات', type: 'radio', required: true, options: ['نعم', 'لا'], order: 9, isVisible: true },
    { id: 'healthNotes', label: 'ملاحظات صحية/حساسية غذائية', type: 'textarea', required: false, hint: 'اختياري', order: 10, isVisible: true },
    { id: 'extraNotes', label: 'ملاحظات إضافية', type: 'textarea', required: false, hint: 'اختياري', order: 11, isVisible: true },
  ],
}

const defaultStaffForm: FormConfig = {
  title: 'التقديم كعاملة رعاية طفولة',
  description: 'املئي البيانات التالية بدقة، وسيتم التواصل معك حول البرامج المناسبة.',
  submitLabel: 'إرسال طلب التقديم',
  successTitle: 'تم استلام طلب التقديم بنجاح',
  successDescription: 'وسنتواصل معك في أقرب وقت ممكن.',
  fields: [
    { id: 'fullName', label: 'الاسم', type: 'text', required: true, order: 1, isVisible: true },
    { id: 'phone', label: 'رقم الجوال', type: 'text', required: true, hint: 'مثال: 05XXXXXXXX', order: 2, isVisible: true },
    { id: 'currentEmployer', label: 'جهة العمل الحالية', type: 'text', required: true, order: 3, isVisible: true },
    { id: 'currentRole', label: 'طبيعة عملك الحالية', type: 'select', required: true, options: ['مقدمة رعاية', 'معلمة رياض أطفال', 'مشرفة', 'قائدة مركز', 'أخرى'], order: 4, isVisible: true },
    { id: 'currentRoleOther', label: 'حددي طبيعة العمل', type: 'text', required: false, order: 5, isVisible: true },
    { id: 'reasonToJoin', label: 'ما أكثر ما يدفعك للالتحاق بالبرنامج؟', type: 'select', required: true, options: ['الحصول على شهادة مهنية', 'تطوير مهاراتي في رعاية الأطفال', 'تحسين فرصي الوظيفية', 'متطلبات جهة العمل', 'الاستفادة من الرسوم المدعومة', 'أخرى'], order: 6, isVisible: true },
    { id: 'reasonOther', label: 'حددي السبب', type: 'textarea', required: false, order: 7, isVisible: true },
    { id: 'wantsToJoinList', label: 'هل ترغبين في الانضمام لقائمة برامج شركة حلول الطفولة؟', type: 'radio', required: true, options: ['نعم', 'لا'], order: 8, isVisible: true },
    { id: 'futureTopics', label: 'ما البرامج أو الموضوعات التي ترغبين في الالتحاق بها مستقبلاً؟', type: 'checkboxGroup', required: true, options: ['الممارس المعتمد في الطفولة', 'مراحل نمو الطفل وخصائصه النمائية', 'إدارة السلوك والتربية الإيجابية', 'ملاحظة الطفل وإعداد خطط التدخل', 'تصميم الأنشطة والبرامج التربوية', 'حماية الطفل والسلامة المهنية', 'الصحة النفسية للطفل', 'التعامل مع الأطفال ذوي الاحتياجات الخاصة', 'إدارة وتشغيل مراكز ضيافة الأطفال', 'القيادة والإشراف التربوي', 'الجودة والاعتماد في مراكز الطفولة', 'إدارة المشاريع والمبادرات التربوية', 'أخرى'], order: 9, isVisible: true },
    { id: 'futureTopicsOther', label: 'حددي البرنامج', type: 'textarea', required: false, order: 10, isVisible: true },
  ],
}

type StoredSiteContent = {
  hero: typeof defaultHero
  about: typeof defaultAbout
  programs: typeof defaultPrograms
  whyUs: { title: string; description: string; features: Array<{ id: string; title: string; description: string }> }
  schedule: typeof defaultSchedule
  activities: ActivitiesContent
  footer: FooterContent
  contactSection: ContactContent
  locationSection: LocationContent
  navigation: NavLink[]
  sections: SectionMeta[]
  studentForm: FormConfig
  staffForm: FormConfig
  header: typeof defaultHeader
}

export function getSiteConfig(): SiteConfig {
  const stored = load<Partial<SiteConfig> | null>(storageKeys.siteConfig, null)
  if (!stored) return defaultConfig
  // تنظيف عنوان قديم مخزن في localStorage (حي الألفية غير مؤكد — تم حذفه حسب الطلب)
  if (stored.location?.address?.includes('الألفية')) {
    stored.location.address = undefined
  }
  if (stored.contact?.addressLabel?.includes('الألفية')) {
    stored.contact.addressLabel = undefined
  }
  return { ...defaultConfig, ...stored, contact: { ...defaultConfig.contact, ...(stored.contact ?? {}) }, location: { ...defaultConfig.location, ...(stored.location ?? {}) }, whatsappFloating: { ...defaultConfig.whatsappFloating, ...(stored.whatsappFloating ?? {}) } } as SiteConfig
}

export function saveSiteConfig(patch: Partial<SiteConfig>): SiteConfig {
  const current = getSiteConfig()
  const next = { ...current, ...patch, contact: { ...current.contact, ...(patch.contact ?? {}) }, location: { ...current.location, ...(patch.location ?? {}) }, whatsappFloating: { ...current.whatsappFloating, ...(patch.whatsappFloating ?? {}) }, updatedAt: new Date().toISOString() } as SiteConfig
  save(storageKeys.siteConfig, next)
  // Sync to Supabase if configured (non-blocking)
  void syncCmsToSupabase()
  return next
}

async function syncCmsToSupabase(): Promise<void> {
  try {
    const { hasSupabase, supabase } = await import('@/lib/supabase')
    if (!hasSupabase() || !supabase) return
    const config = load(storageKeys.siteConfig, null)
    const content = load(storageKeys.siteContent, null)
    await supabase.from('cms').upsert({ id: 1, config, content, updated_at: new Date().toISOString() }, { onConflict: 'id' })
  } catch {
    // fallback to local only
  }
}

export function getSiteContent(): StoredSiteContent {
  const stored = load<Partial<StoredSiteContent> | null>(storageKeys.siteContent, null)
  if (!stored)
    return {
      hero: defaultHero,
      about: defaultAbout,
      programs: defaultPrograms,
      whyUs: defaultWhyUs as unknown as StoredSiteContent['whyUs'],
      schedule: defaultSchedule,
      activities: defaultActivities,
      footer: defaultFooter,
      contactSection: defaultContact,
      locationSection: defaultLocation,
      navigation: defaultNavLinks,
      sections: defaultSections,
      studentForm: defaultStudentForm,
      staffForm: defaultStaffForm,
      header: defaultHeader,
    }
  return {
    hero: stored.hero ?? defaultHero,
    about: stored.about ?? defaultAbout,
    programs: stored.programs ?? defaultPrograms,
    whyUs: (stored.whyUs as unknown as StoredSiteContent['whyUs']) ?? (defaultWhyUs as unknown as StoredSiteContent['whyUs']),
    schedule: stored.schedule ?? defaultSchedule,
    activities: stored.activities ?? defaultActivities,
    footer: stored.footer ?? defaultFooter,
    contactSection: stored.contactSection ?? defaultContact,
    locationSection: stored.locationSection ?? defaultLocation,
    navigation: stored.navigation ?? defaultNavLinks,
    sections: stored.sections ?? defaultSections,
    studentForm: stored.studentForm ?? defaultStudentForm,
    staffForm: stored.staffForm ?? defaultStaffForm,
    header: stored.header ?? defaultHeader,
  }
}

export function saveSiteContent(patch: Partial<StoredSiteContent>): StoredSiteContent {
  const cur = getSiteContent()
  const next = { ...cur, ...patch }
  save(storageKeys.siteContent, next)
  void syncCmsToSupabase()
  return next
}

export async function hydrateCmsFromSupabase(): Promise<void> {
  try {
    const { hasSupabase, supabase } = await import('@/lib/supabase')
    if (!hasSupabase() || !supabase) return
    const { data, error } = await supabase.from('cms').select('config,content').eq('id', 1).single()
    if (error || !data) return
    if (data.config) save(storageKeys.siteConfig, data.config)
    if (data.content) save(storageKeys.siteContent, data.content)
  } catch {
    // ignore
  }
}

export function getNavigation(): NavLink[] {
  return getSiteContent().navigation
}
export function saveNavigation(navigation: NavLink[]): void {
  saveSiteContent({ navigation })
}
export function getActivities(): ActivitiesContent {
  return getSiteContent().activities
}
export function saveActivities(activities: ActivitiesContent): void {
  saveSiteContent({ activities })
}
export function getFooter(): FooterContent {
  return getSiteContent().footer
}
export function getSections(): SectionMeta[] {
  return getSiteContent().sections
}
export function saveSections(sections: SectionMeta[]): void {
  saveSiteContent({ sections })
}
export function getStudentForm(): FormConfig {
  return getSiteContent().studentForm
}
export function getStaffForm(): FormConfig {
  return getSiteContent().staffForm
}
