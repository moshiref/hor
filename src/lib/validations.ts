/**
 * Validation schemas — client-side helpers.
 * Server-side MUST re-validate with same rules (Zod shared package in future).
 *
 * For Phase 1 we use lightweight functions (no zod dep yet) to keep bundle minimal.
 * When forms phase starts, replace with zod schemas and share with API.
 */

const PHONE_REGEX = /^(05\d{8}|\+9665\d{8})$/

export type FieldError = string | undefined

export function validateRequired(value: string | undefined, fieldName: string): FieldError {
  if (!value || !value.trim()) return `${fieldName} مطلوب`
  return undefined
}

export function validatePhone(phone: string | undefined): FieldError {
  if (!phone || !phone.trim()) return 'رقم الجوال مطلوب'
  const normalized = phone.replace(/[\s-]/g, '')
  if (!PHONE_REGEX.test(normalized)) return 'رقم الجوال غير صحيح (مثال: 05XXXXXXXX)'
  return undefined
}

export function validateBirthDate(date: string | undefined): FieldError {
  if (!date) return 'تاريخ الميلاد مطلوب'
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return 'تاريخ الميلاد غير صحيح'
  if (d > new Date()) return 'تاريخ الميلاد لا يمكن أن يكون في المستقبل'
  // Child must be at least 1 month old and less than 7 years
  const ageMs = Date.now() - d.getTime()
  const ageYears = ageMs / (365.25 * 24 * 60 * 60 * 1000)
  if (ageYears > 7) return 'عمر الطفل يجب أن يكون أقل من 7 سنوات'
  return undefined
}

// Payload validators for future forms
export type StudentFormErrors = Partial<Record<string, string>>
export type StaffFormErrors = Partial<Record<string, string>>

export function validateStudentPayload(data: Record<string, unknown>): StudentFormErrors {
  const errors: StudentFormErrors = {}
  if (validateRequired(data.studentName as string, 'اسم الطالب'))
    errors.studentName = validateRequired(data.studentName as string, 'اسم الطالب')
  if (validateBirthDate(data.birthDate as string)) errors.birthDate = validateBirthDate(data.birthDate as string)
  if (!data.gender) errors.gender = 'الجنس مطلوب'
  if (!data.stage) errors.stage = 'المرحلة مطلوبة'
  if (!data.period) errors.period = 'الفترة مطلوبة'
  if (validateRequired(data.guardianName as string, 'اسم ولي الأمر'))
    errors.guardianName = validateRequired(data.guardianName as string, 'اسم ولي الأمر')
  if (validatePhone(data.guardianPhone as string)) errors.guardianPhone = validatePhone(data.guardianPhone as string)
  if (validateRequired(data.district as string, 'الحي/العنوان'))
    errors.district = validateRequired(data.district as string, 'الحي/العنوان')
  return errors
}

export function validateStaffPayload(data: Record<string, unknown>): StaffFormErrors {
  const errors: StaffFormErrors = {}
  if (validateRequired(data.fullName as string, 'الاسم')) errors.fullName = validateRequired(data.fullName as string, 'الاسم')
  if (validatePhone(data.phone as string)) errors.phone = validatePhone(data.phone as string)
  if (validateRequired(data.reasonToJoin as string, 'سبب الالتحاق'))
    errors.reasonToJoin = validateRequired(data.reasonToJoin as string, 'سبب الالتحاق')
  return errors
}
