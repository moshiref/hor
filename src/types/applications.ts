import type { SoftDelete, Timestamps } from './common'

// ── Enums — stored as strings in DB, validated server-side ──

export type ApplicationStatus =
  | 'new' // جديد
  | 'under_review' // قيد المراجعة
  | 'contacted' // تم التواصل
  | 'accepted' // مقبول
  | 'rejected' // مرفوض
  | 'archived' // مؤرشف

export type Gender = 'male' | 'female'

export type Stage =
  | 'nursery' // حضانة
  | 'kindergarten' // روضة
  | 'pre_primary' // تمهيدي

export type Period =
  | 'morning' // صباحية
  | 'evening' // مسائية

export type YesNo = 'yes' | 'no'

// ── Student Application ──
export type StudentApplication = Timestamps &
  SoftDelete & {
    id: string

    // الطفل
    studentName: string
    birthDate: string // ISO date YYYY-MM-DD
    gender: Gender
    stage: Stage
    period: Period

    // ولي الأمر
    guardianName: string
    guardianPhone: string // E.164 normalized server-side
    district: string // الحي / العنوان
    needsTransport: YesNo

    // صحي
    healthNotes?: string
    foodAllergy?: string
    extraNotes?: string

    // Meta
    status: ApplicationStatus
    reviewedAt?: string | null
    reviewedBy?: string | null // admin user id
    notesInternal?: string // ملاحظات داخلية لا تظهر للعميل
  }

// Payload for creating (client → server)
export type CreateStudentApplicationPayload = Omit<
  StudentApplication,
  'id' | 'createdAt' | 'updatedAt' | 'status' | 'reviewedAt' | 'reviewedBy' | 'notesInternal' | 'deletedAt'
>

// ── Staff Application (عاملة رعاية طفولة) ──
export type StaffApplication = Timestamps &
  SoftDelete & {
    id: string

    fullName: string
    phone: string
    currentEmployer?: string
    currentRole?: string
    reasonToJoin: string // سبب الالتحاق
    wantsToJoinList: YesNo
    futureTopics?: string // برامج وموضوعات مستقبلية

    status: ApplicationStatus
    reviewedAt?: string | null
    reviewedBy?: string | null
    notesInternal?: string
  }

export type CreateStaffApplicationPayload = Omit<
  StaffApplication,
  'id' | 'createdAt' | 'updatedAt' | 'status' | 'reviewedAt' | 'reviewedBy' | 'notesInternal' | 'deletedAt'
>

// ── List filters (for Dashboard tables) ──
export type ApplicationFilters = {
  status?: ApplicationStatus
  stage?: Stage
  period?: Period
  gender?: Gender
  needsTransport?: YesNo
  search?: string // بحث بالاسم / الجوال
  dateFrom?: string
  dateTo?: string
}

export const APPLICATION_STATUS_LABEL: Record<ApplicationStatus, string> = {
  new: 'جديد',
  under_review: 'قيد المراجعة',
  contacted: 'تم التواصل',
  accepted: 'مقبول',
  rejected: 'مرفوض',
  archived: 'مؤرشف',
}

export const GENDER_LABEL: Record<Gender, string> = {
  male: 'ذكر',
  female: 'أنثى',
}

export const STAGE_LABEL: Record<Stage, string> = {
  nursery: 'حضانة',
  kindergarten: 'روضة',
  pre_primary: 'تمهيدي',
}

export const PERIOD_LABEL: Record<Period, string> = {
  morning: 'صباحية',
  evening: 'مسائية',
}
