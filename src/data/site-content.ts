import type { AboutContent, HeroContent, Program } from '@/types/content'

/**
 * Editable page content — decoupled from presentation.
 *
 * Phase 1: static data (typed). Phase 2+: replaced by API.
 * Components MUST import from here, never hardcode strings.
 *
 * Future DB table: `site_sections` with key = hero/about/etc
 * API: GET /api/content  → returns { hero, about }
 * Admin: PATCH /api/admin/content { hero, about }
 */

export const heroContent: HeroContent = {
  id: 'hero-main',
  eyebrow: 'مركز حور العين لضيافة الأطفال',
  title: 'التسجيل مفتوح الآن',
  description:
    'نرحّب بطفلك في بيئة آمنة ودافئة، يتعلّم فيها ويكبر بثقة، وسط رعاية واهتمام حقيقي من فريق متخصص في ضيافة الأطفال.',
  primaryCta: { label: 'سجّل طفلك', href: '#registration' },
  secondaryCta: { label: 'التقديم كعاملة رعاية طفولة', href: '#staff-registration' },
  image: {
    src: 'https://images.pexels.com/photos/8535593/pexels-photo-8535593.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'معلّمة تشارك الأطفال قراءة كتاب في قاعة تعليمية دافئة',
  },
  badge: {
    text: 'رعاية واهتمام بكل طفل',
  },
  isVisible: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export const aboutContent: AboutContent = {
  id: 'about-main',
  title: 'من نحن',
  paragraphs: [
    'في مركز حور العين لضيافة الأطفال، نوفّر بيئة تربوية آمنة ومحفّزة تعين طفلك على التعلّم والنمو واكتساب المهارات، في أجواء تجمع بين الرعاية والتعليم والاهتمام الحقيقي بكل طفل.',
    'نبني الأساس الأول لطفلك من خلال برامج تجمع بين تعليم القرآن الكريم والأسس الدينية، وتعلّم الحروف والأرقام، إلى جانب أنشطة تعليمية وترفيهية تناسب مرحلته العمرية.',
  ],
  features: [
    {
      id: 'feat-1',
      icon: 'book-open',
      title: 'روضة وتمهيدي',
      description: 'روضة (تمهيدي) وبرنامج تمهيدي للصف الأول.',
      order: 1,
      isVisible: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'feat-2',
      icon: 'languages',
      title: 'قرآن وحروف وأرقام',
      description: 'القرآن الكريم والأسس الدينية، إلى جانب الحروف والأرقام العربية والإنجليزية.',
      order: 2,
      isVisible: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'feat-3',
      icon: 'clock',
      title: 'فترتان',
      description: 'فترتان صباحية ومسائية، حسب ما يناسب أسرتكم.',
      order: 3,
      isVisible: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'feat-4',
      icon: 'bus',
      title: 'مواصلات',
      description: 'نظام حضوري مع خدمة مواصلات.',
      order: 4,
      isVisible: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'feat-5',
      icon: 'users',
      title: 'أعداد محدودة',
      description: 'أعداد محدودة في كل فصل، لعناية أقرب بكل طفل.',
      order: 5,
      isVisible: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  isVisible: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export const programsContent: { title: string; description: string; programs: Program[] } = {
  title: 'برامجنا التعليمية',
  description: 'برامج متكاملة تناسب المرحلة العمرية لكل طفل، تجمع بين التأسيس الديني والتعليمي والأنشطة المحفزة.',
  programs: [
    {
      id: 'prog-quran',
      icon: 'book-open',
      title: 'تعليم القرآن الكريم',
      description: 'تعليم القرآن الكريم بطريقة مناسبة للمرحلة العمرية للطفل.',
      order: 1,
      isVisible: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'prog-deen',
      icon: 'heart',
      title: 'الأسس الدينية',
      description: 'غرس المفاهيم والقيم الدينية الأساسية بأسلوب مبسط يناسب الأطفال.',
      order: 2,
      isVisible: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'prog-ar',
      icon: 'languages',
      title: 'الحروف والأرقام العربية',
      description: 'التعرف على الحروف والأرقام العربية وتنمية المهارات الأولية للقراءة والكتابة والحساب.',
      order: 3,
      isVisible: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'prog-en',
      icon: 'languages',
      title: 'الحروف والأرقام الإنجليزية',
      description: 'التأسيس في الحروف والأرقام الإنجليزية بطريقة مناسبة لعمر الطفل.',
      order: 4,
      isVisible: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'prog-hijaa',
      icon: 'star',
      title: 'الهجاء القرآني والقراءة',
      description: 'دمج الهجاء القرآني مع تعلم الحروف لمساعدة الطفل على اكتساب مهارات القراءة بصورة أسهل.',
      order: 5,
      isVisible: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'prog-activities',
      icon: 'users',
      title: 'الأنشطة التعليمية والترفيهية',
      description: 'أنشطة متنوعة تجمع بين التعلم واللعب وتنمية مهارات الطفل.',
      order: 6,
      isVisible: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
}

export const whyUsContent = {
  title: 'لماذا حور العين؟',
  description: 'اختياركم لنا يعني بيئة يجد فيها طفلك الرعاية والتعليم والاهتمام الذي يستحقه.',
  features: [
    { id: 'why-1', title: 'بيئة آمنة ودافئة', description: 'مساحات مهيأة بعناية ليشعر طفلك بالأمان والانتماء.' },
    { id: 'why-2', title: 'رعاية واهتمام حقيقي', description: 'متابعة فردية لكل طفل من فريق متخصص في ضيافة الأطفال.' },
    { id: 'why-3', title: 'برامج مناسبة للمرحلة العمرية', description: 'محتوى تعليمي مدروس يناسب قدرات واحتياجات كل مرحلة.' },
    { id: 'why-4', title: 'القرآن والأسس الدينية', description: 'تأسيس إيماني وقرآني بأسلوب محبب وقريب من الطفل.' },
    { id: 'why-5', title: 'أعداد محدودة', description: 'فصول بأعداد مدروسة لضمان جودة الرعاية والتعليم.' },
    { id: 'why-6', title: 'فترتان صباحية ومسائية', description: 'مرونة تناسب ظروف الأسرة واحتياجاتها اليومية.' },
    { id: 'why-7', title: 'خدمة مواصلات', description: 'توصيل آمن ومريح من وإلى المركز.' },
  ] as const,
}

export const scheduleContent = {
  title: 'ما يناسب وقت أسرتكم',
  description: 'مرونة في الوقت دون مساومة على جودة الرعاية.',
  periods: [
    { id: 'morning', title: 'الفترة الصباحية', time: 'حضورياً داخل المركز', note: 'مناسبة للروضة والتمهيدي' },
    { id: 'evening', title: 'الفترة المسائية', time: 'حضورياً داخل المركز', note: 'مرونة للأسر العاملة' },
  ],
  extras: [
    { id: 'onsite', title: 'حضورياً داخل المركز', description: 'متابعة مباشرة وتفاعل يومي مع المعلمات.' },
    { id: 'transport', title: 'تتوفر خدمة المواصلات', description: 'خدمة آمنة لتسهيل وصول طفلك دون عناء.' },
  ],
}
