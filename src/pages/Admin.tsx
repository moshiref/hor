/**
 * Admin Dashboard — scaffold
 * Route: /admin (protected)
 * 
 * حالياً Placeholder — يُفعّل عند إضافة:
 * - Auth (login, session, RBAC)
 * - ProtectedRoute wrapper
 * - API: /api/admin/*
 * 
 * لا يُعرض في الـ Public Website. يُستدعى فقط عند زيارة /admin
 */

export default function Admin() {
  return (
    <div className="min-h-screen bg-cream-50 p-8" dir="rtl">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-card">
        <h1 className="font-display text-2xl font-bold text-ink-800">لوحة التحكم — قريباً</h1>
        <p className="mt-3 leading-relaxed text-ink-600">
          هذه الصفحة محمية وستتطلب تسجيل دخول. البنية جاهزة لـ Dashboard كامل مع إحصائيات وجداول الطلبات وإدارة
          المحتوى. لا أرقام وهمية — ستُعرض البيانات الحقيقية من قاعدة البيانات.
        </p>
        <ul className="mt-6 list-disc space-y-2 pe-6 text-sm text-ink-600">
          <li>Dashboard: إحصائيات التسجيل والطلبات</li>
          <li>Student Applications: عرض/بحث/فلترة/تحديث حالة</li>
          <li>Staff Applications: عرض/بحث/فلترة/تحديث حالة</li>
          <li>Programs / Activities / Media / Site Settings</li>
        </ul>
        <p className="mt-6 text-xs text-ink-400">Auth: سيُطلب JWT/Session + Role check قبل عرض أي بيانات.</p>
      </div>
    </div>
  )
}
