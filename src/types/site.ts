import type { Timestamps } from './common'

/**
 * Site-wide configuration — single source of truth.
 * Admin Dashboard will edit this row in DB (singleton).
 * All components must read from this, never hardcode.
 */
export type SiteConfig = Timestamps & {
  id: string
  // Brand
  name: string // "مركز حور العين لضيافة الأطفال"
  shortName: string // "حور العين"
  tagline: string // "لضيافة الأطفال"
  logoMark: string // path / URL
  logoFull?: string
  favicon?: string

  // SEO / Meta
  seoTitle: string
  seoDescription: string
  themeColor: string

  // Contact (will be editable via Dashboard)
  contact: ContactInfo
  social: SocialLinks
  location: LocationInfo

  // Floating WhatsApp — Admin → إعدادات الموقع → WhatsApp
  whatsappFloating: WhatsappFloatingConfig
}

export type ContactInfo = {
  phone?: string
  whatsapp?: string
  email?: string
  addressLabel?: string // "حي ... - الرياض"
}

export type SocialLinks = {
  x?: string
  instagram?: string
  snapchat?: string
  tiktok?: string
  whatsappChannel?: string
}

export type LocationInfo = {
  address?: string
  city: string
  region: string
  googleMapsUrl?: string
  lat?: number
  lng?: number
}

export type NavLink = {
  label: string
  href: string
  // For future CMS: allow external links, visibility toggle
  isExternal?: boolean
  isVisible?: boolean
  order: number
}

export type CtaConfig = {
  label: string
  href: string
  variant: 'primary' | 'secondary' | 'ghost'
}

export type WhatsappFloatingConfig = {
  /** تفعيل/تعطيل الزر من لوحة التحكم */
  enabled: boolean
  /** الرقم بصيغة wa.me بدون + أو 00 — مثال 966547893386 */
  phone: string
  /** النص الظاهر عند Hover / Focus */
  hoverText: string
  /** رسالة افتراضية تُضاف ?text= (اختيارية) */
  defaultMessage?: string
}
