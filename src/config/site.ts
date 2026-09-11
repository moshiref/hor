import type { NavLink, SiteConfig } from '@/types/site'
import logoMark from '@/assets/logo-mark.png'

/**
 * SiteConfig — Source of truth for brand & contact.
 * Currently static. In production, this will be fetched from:
 *   GET /api/site-config  (cached, ISR)
 * Admin Dashboard edits via:
 *   PATCH /api/admin/site-config
 *
 * DO NOT put secrets here. Only public-safe data.
 */
export const siteConfig: SiteConfig = {
  id: 'site-main',
  name: 'مركز حور العين لضيافة الأطفال',
  shortName: 'حور العين',
  tagline: 'لضيافة الأطفال',
  logoMark,
  seoTitle: 'مركز حور العين لضيافة الأطفال | رعاية وتعليم في بيئة آمنة',
  seoDescription:
    'في مركز حور العين نوفر بيئة تربوية آمنة ومحفزة، تجمع بين الرعاية والتعليم والقرآن الكريم، مع فترات صباحية ومسائية وخدمة مواصلات.',
  themeColor: '#FAF6F0',
  contact: {
    phone: '0547893386',
    whatsapp: '966547893386',
    email: undefined,
    addressLabel: undefined,
  },
  social: {
    whatsappChannel: 'https://wa.me/966547893386',
  },
  location: {
    address: undefined,
    city: 'الرياض',
    region: 'منطقة الرياض',
    googleMapsUrl: 'https://maps.google.com/?q=21.399221,39.302299',
    lat: 21.399221,
    lng: 39.302299,
  },
  whatsappFloating: {
    enabled: true,
    phone: '966547893386',
    hoverText: 'تواصل معنا عبر واتساب',
    defaultMessage: undefined, // مثال: 'مرحبا، أرغب بالاستفسار عن التسجيل في مركز حور العين'
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export const navLinks: NavLink[] = [
  { label: 'الرئيسية', href: '#hero', order: 1, isVisible: true },
  { label: 'من نحن', href: '#about', order: 2, isVisible: true },
  { label: 'البرامج', href: '#programs', order: 3, isVisible: true },
  { label: 'الأنشطة', href: '#activities', order: 4, isVisible: true },
  { label: 'موقعنا', href: '#location', order: 5, isVisible: true },
  { label: 'تواصل معنا', href: '#contact', order: 6, isVisible: true },
]
