/**
 * Utilities — pure, no side-effects, testable.
 */

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Format ISO date to Saudi locale (ar-SA) — used in Dashboard tables later.
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(d)
}

/**
 * Normalize Saudi phone for storage — strips spaces/dashes.
 * Server will do strict E.164 validation; this is client helper only.
 */
export function normalizePhone(phone: string): string {
  return phone.replace(/[\s-]/g, '').trim()
}

/**
 * Sanitize plain text input — strips dangerous chars.
 * Server MUST re-sanitize; this is defense-in-depth on client.
 */
export function sanitizeText(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}
