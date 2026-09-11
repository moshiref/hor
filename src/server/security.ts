/**
 * Security helpers — server-side only.
 * هذه الدوال لا تُستورد في Frontend أبداً.
 */

// Sanitize plain text — يمنع < > ومسح المسافات الزائدة
export function sanitizeText(input: string, maxLen = 500): string {
  return input.trim().replace(/[<>]/g, '').slice(0, maxLen)
}

// Rate limiting بسيط (in-memory) — في الإنتاج يُستبدل بـ Redis/DB
const hits = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(key: string, max = 5, windowMs = 60 * 60 * 1000): boolean {
  const now = Date.now()
  const entry = hits.get(key)
  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (entry.count >= max) return false
  entry.count++
  return true
}

// Validate Saudi phone (E.164 normalized)
export function isValidSaudiPhone(phone: string): boolean {
  return /^(05\d{8}|\+9665\d{8})$/.test(phone.replace(/[\s-]/g, ''))
}
