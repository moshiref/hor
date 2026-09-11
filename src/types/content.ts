import type { Timestamps } from './common'

/**
 * Editable page content — each section is a DB entity.
 * Admin edits via Dashboard → API → DB → revalidation.
 * Frontend reads via Service layer (never hardcoded arrays).
 */

export type HeroContent = Timestamps & {
  id: string
  eyebrow: string // "مركز حور العين لضيافة الأطفال"
  title: string // "التسجيل مفتوح الآن"
  description: string
  primaryCta: { label: string; href: string }
  secondaryCta: { label: string; href: string }
  image: {
    src: string
    alt: string
  }
  badge?: {
    text: string // "رعاية واهتمام بكل طفل"
  }
  isVisible: boolean
}

export type AboutContent = Timestamps & {
  id: string
  title: string // "من نحن"
  paragraphs: string[]
  features: Feature[]
  isVisible: boolean
}

export type Feature = Timestamps & {
  id: string
  icon: FeatureIcon
  title: string
  description: string
  order: number
  isVisible: boolean
}

export type FeatureIcon =
  | 'book-open'
  | 'languages'
  | 'clock'
  | 'bus'
  | 'users'
  | 'shield'
  | 'heart'
  | 'star'

export type Program = Timestamps & {
  id: string
  title: string
  description: string
  icon: FeatureIcon
  image?: string // idb://key أو URL — يُرفع من الجهاز
  ageRange?: string // "3-6 سنوات"
  order: number
  isVisible: boolean
}

export type Activity = Timestamps & {
  id: string
  title: string
  description: string
  image?: string
  date?: string
  isVisible: boolean
}

export type ScheduleInfo = Timestamps & {
  id: string
  title: string
  morning: string // "7:30 ص - 12:00 م"
  evening: string // "4:00 م - 9:00 م"
  notes?: string
  isVisible: boolean
}

export type TransportInfo = Timestamps & {
  id: string
  title: string
  description: string
  isAvailable: boolean
  coverage?: string[] // أحياء
  contactPhone?: string
}
