import type { Timestamps } from './common'
import type { NavLink } from './site'

// Section meta — controls order & visibility globally
export type SectionMeta = {
  key: string // hero, about, programs, activities, schedule, whyUs, registration, staffRegistration, location, contact
  label: string // label in admin
  isVisible: boolean
  order: number
}

// Activities gallery item
export type ActivityItem = Timestamps & {
  id: string
  title: string
  description?: string
  image?: string // idb:// or URL
  order: number
  isVisible: boolean
}

export type ActivitiesContent = {
  title: string
  description: string
  items: ActivityItem[]
}

// Footer
export type FooterContent = Timestamps & {
  id: string
  description: string
  links: NavLink[] // reused NavLink for footer links
  copyright: string
  showSocial: boolean
}

// Contact section
export type ContactContent = {
  title: string
  description: string
  phoneLabel: string
  whatsappButtonLabel: string
  callButtonLabel: string
}

// Location section
export type LocationContent = {
  title: string
  helperText: string
  buttonLabel: string
}

// Form field
export type FormFieldType = 'text' | 'date' | 'select' | 'radio' | 'textarea' | 'checkboxGroup'
export type FormField = {
  id: string
  label: string
  placeholder?: string
  type: FormFieldType
  required: boolean
  options?: string[] // for select/radio/checkboxGroup
  hint?: string
  order: number
  isVisible: boolean
}

export type FormConfig = {
  title: string
  description: string
  submitLabel: string
  successTitle: string
  successDescription: string
  fields: FormField[]
}
