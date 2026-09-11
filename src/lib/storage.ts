/**
 * Storage layer — client-side persistence (localStorage)
 * يمثل قاعدة البيانات الحالية. مستقبلاً يُستبدل بطلبات API دون تغيير واجهة الخدمات.
 * المفاتيح معزولة باسم hor_* لتجنب التعارض.
 */

const KEYS = {
  students: 'hor_student_applications',
  staff: 'hor_staff_applications',
  siteConfig: 'hor_site_config',
  siteContent: 'hor_site_content',
  session: 'hor_admin_session',
} as const

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined'
}

export function load<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function save<T>(key: string, value: T): void {
  if (!isBrowser()) return
  localStorage.setItem(key, JSON.stringify(value))
}

export function remove(key: string): void {
  if (!isBrowser()) return
  localStorage.removeItem(key)
}

export const storageKeys = KEYS
