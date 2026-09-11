/**
 * Common shared types — foundation for all domain models.
 * Keeps the codebase consistent and DB-ready.
 */

export type Locale = 'ar'

export type Timestamps = {
  createdAt: string // ISO 8601
  updatedAt: string // ISO 8601
}

export type SoftDelete = {
  deletedAt?: string | null
}

export type BrandedId<T extends string> = string & { readonly __brand: T }

export type PaginationParams = {
  page: number
  perPage: number
}

export type PaginationMeta = {
  page: number
  perPage: number
  total: number
  totalPages: number
}

export type SortOrder = 'asc' | 'desc'

export type ApiResponse<T> = {
  data: T
  meta?: PaginationMeta
  message?: string
}

export type ApiError = {
  message: string
  code?: string
  fields?: Record<string, string[]>
}
