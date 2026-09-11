import type {
  ApplicationFilters,
  CreateStaffApplicationPayload,
  CreateStudentApplicationPayload,
  StaffApplication,
  StudentApplication,
} from '@/types/applications'
import type { ApiResponse, PaginationMeta, PaginationParams } from '@/types/common'
import { load, save, storageKeys } from '@/lib/storage'

/**
 * ApplicationsService — عملية بالكامل عبر localStorage (قاعدة بيانات فعلية على الجهاز)
 * كل عملية إنشاء/تعديل/حذف تُحفظ فوراً وتظهر في لوحة التحكم.
 * مستقبلاً: استبدال القراءة/الكتابة بـ fetch('/api/...') دون تغيير واجهة الاستدعاء.
 */

type ListResult<T> = ApiResponse<T[]> & { meta: PaginationMeta }

export interface ApplicationsService {
  createStudent(payload: CreateStudentApplicationPayload): Promise<ApiResponse<StudentApplication>>
  listStudents(filters?: ApplicationFilters, pagination?: PaginationParams): Promise<ListResult<StudentApplication>>
  getStudent(id: string): Promise<ApiResponse<StudentApplication>>
  updateStudentStatus(id: string, status: StudentApplication['status']): Promise<ApiResponse<StudentApplication>>
  deleteStudents(ids: string[]): Promise<void>
  createStaff(payload: CreateStaffApplicationPayload): Promise<ApiResponse<StaffApplication>>
  listStaff(filters?: ApplicationFilters, pagination?: PaginationParams): Promise<ListResult<StaffApplication>>
  getStaff(id: string): Promise<ApiResponse<StaffApplication>>
  updateStaffStatus(id: string, status: StaffApplication['status']): Promise<ApiResponse<StaffApplication>>
  updateStaff(id: string, patch: Partial<Pick<StaffApplication, 'status' | 'notesInternal'>>): Promise<ApiResponse<StaffApplication>>
  deleteStaff(ids: string[]): Promise<void>
}

function mockMeta(total: number, pagination?: PaginationParams): PaginationMeta {
  const page = pagination?.page ?? 1
  const perPage = pagination?.perPage ?? 20
  return { page, perPage, total, totalPages: Math.ceil(total / perPage) }
}

function readStudents(): StudentApplication[] {
  return load<StudentApplication[]>(storageKeys.students, [])
}

function writeStudents(arr: StudentApplication[]): void {
  save(storageKeys.students, arr)
}

function readStaff(): StaffApplication[] {
  return load<StaffApplication[]>(storageKeys.staff, [])
}

function writeStaff(arr: StaffApplication[]): void {
  save(storageKeys.staff, arr)
}

export const mockApplicationsService: ApplicationsService = {
  async createStudent(payload) {
    const now = new Date().toISOString()
    const record: StudentApplication = {
      id: `stu_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      ...payload,
      status: 'new',
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    }
    // Try Supabase first (shared DB), fallback to localStorage
    try {
      const { hasSupabase, supabase } = await import('@/lib/supabase')
      if (hasSupabase() && supabase) {
        const { error } = await supabase.from('student_applications').insert({ id: record.id, data: record })
        if (!error) {
          // also cache locally for instant UI
          const all = readStudents()
          all.unshift(record)
          writeStudents(all)
          return { data: record, message: 'تم استلام طلب التسجيل بنجاح' }
        }
      }
    } catch {
      // fallback
    }
    const all = readStudents()
    all.unshift(record)
    writeStudents(all)
    return { data: record, message: 'تم استلام طلب التسجيل بنجاح' }
  },

  async listStudents(_filters, pagination) {
    try {
      const { hasSupabase, supabase } = await import('@/lib/supabase')
      if (hasSupabase() && supabase) {
        const { data, error } = await supabase.from('student_applications').select('data').order('created_at', { ascending: false } as never)
        if (!error && data) {
          const rows = (data as unknown as { data: StudentApplication }[]).map((r) => r.data).filter((r) => !r.deletedAt)
          // sync to local for offline
          save(storageKeys.students, rows)
          return { data: rows, meta: mockMeta(rows.length, pagination) }
        }
      }
    } catch {
      // fallback
    }
    const all = readStudents().filter((r) => !r.deletedAt)
    return { data: all, meta: mockMeta(all.length, pagination) }
  },

  async getStudent(id) {
    const found = readStudents().find((r) => r.id === id)
    if (!found) throw new Error('الطلب غير موجود')
    return { data: found }
  },

  async updateStudentStatus(id, status) {
    try {
      const { hasSupabase, supabase } = await import('@/lib/supabase')
      if (hasSupabase() && supabase) {
        const all = readStudents()
        const rec = all.find((r) => r.id === id)
        if (rec) {
          const updated = { ...rec, status, updatedAt: new Date().toISOString() }
          await supabase.from('student_applications').update({ data: updated } as never).eq('id', id)
        }
      }
    } catch {
      // fallback
    }
    const all = readStudents()
    const idx = all.findIndex((r) => r.id === id)
    if (idx === -1) throw new Error('الطلب غير موجود')
    all[idx] = { ...all[idx], status, updatedAt: new Date().toISOString() }
    writeStudents(all)
    return { data: all[idx] }
  },

  async deleteStudents(ids) {
    try {
      const { hasSupabase, supabase } = await import('@/lib/supabase')
      if (hasSupabase() && supabase) {
        await supabase.from('student_applications').delete().in('id', ids)
      }
    } catch {
      // fallback
    }
    const all = readStudents().filter((r) => !ids.includes(r.id))
    writeStudents(all)
  },

  async createStaff(payload) {
    const now = new Date().toISOString()
    const record: StaffApplication = {
      id: `staff_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      ...payload,
      status: 'new',
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    }
    try {
      const { hasSupabase, supabase } = await import('@/lib/supabase')
      if (hasSupabase() && supabase) {
        const { error } = await supabase.from('staff_applications').insert({ id: record.id, data: record })
        if (!error) {
          const all = readStaff()
          all.unshift(record)
          writeStaff(all)
          return { data: record, message: 'تم استلام طلب التقديم بنجاح' }
        }
      }
    } catch {
      // fallback
    }
    const all = readStaff()
    all.unshift(record)
    writeStaff(all)
    return { data: record, message: 'تم استلام طلب التقديم بنجاح' }
  },

  async listStaff(_filters, pagination) {
    try {
      const { hasSupabase, supabase } = await import('@/lib/supabase')
      if (hasSupabase() && supabase) {
        const { data, error } = await supabase.from('staff_applications').select('data').order('created_at', { ascending: false } as never)
        if (!error && data) {
          const rows = (data as unknown as { data: StaffApplication }[]).map((r) => r.data).filter((r) => !r.deletedAt)
          save(storageKeys.staff, rows)
          return { data: rows, meta: mockMeta(rows.length, pagination) }
        }
      }
    } catch {
      // fallback
    }
    const all = readStaff().filter((r) => !r.deletedAt)
    return { data: all, meta: mockMeta(all.length, pagination) }
  },

  async getStaff(id) {
    const found = readStaff().find((r) => r.id === id)
    if (!found) throw new Error('الطلب غير موجود')
    return { data: found }
  },

  async updateStaffStatus(id, status) {
    try {
      const { hasSupabase, supabase } = await import('@/lib/supabase')
      if (hasSupabase() && supabase) {
        const all = readStaff()
        const rec = all.find((r) => r.id === id)
        if (rec) {
          const updated = { ...rec, status, updatedAt: new Date().toISOString() }
          await supabase.from('staff_applications').update({ data: updated } as never).eq('id', id)
        }
      }
    } catch {
      // fallback
    }
    const all = readStaff()
    const idx = all.findIndex((r) => r.id === id)
    if (idx === -1) throw new Error('الطلب غير موجود')
    all[idx] = { ...all[idx], status, updatedAt: new Date().toISOString() }
    writeStaff(all)
    return { data: all[idx] }
  },

  async updateStaff(id, patch) {
    const now = new Date().toISOString()
    try {
      const { hasSupabase, supabase } = await import('@/lib/supabase')
      if (hasSupabase() && supabase) {
        const all = readStaff()
        const rec = all.find((r) => r.id === id)
        if (rec) {
          const updated = { ...rec, ...patch, updatedAt: now } as StaffApplication
          const { error } = await supabase.from('staff_applications').update({ data: updated } as never).eq('id', id)
          if (!error) {
            const idx2 = all.findIndex((r) => r.id === id)
            if (idx2 !== -1) {
              all[idx2] = updated
              writeStaff(all)
              return { data: updated }
            }
          }
        }
      }
    } catch {
      // fallback
    }
    const all = readStaff()
    const idx = all.findIndex((r) => r.id === id)
    if (idx === -1) throw new Error('الطلب غير موجود')
    all[idx] = { ...all[idx], ...patch, updatedAt: now } as StaffApplication
    if (patch.status) {
      ;(all[idx] as StaffApplication).reviewedAt = now
    }
    writeStaff(all)
    return { data: all[idx] }
  },

  async deleteStaff(ids) {
    try {
      const { hasSupabase, supabase } = await import('@/lib/supabase')
      if (hasSupabase() && supabase) {
        await supabase.from('staff_applications').delete().in('id', ids)
      }
    } catch {
      // fallback
    }
    const all = readStaff().filter((r) => !ids.includes(r.id))
    writeStaff(all)
  },
}

// Helpers for admin bulk operations (used directly by admin tables)
export const adminStorage = {
  readStudents,
  writeStudents,
  readStaff,
  writeStaff,
}
