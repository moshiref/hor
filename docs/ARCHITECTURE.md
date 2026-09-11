# Architecture — مركز حور العين

## الهدف
موقع عام + لوحة تحكم على نفس المشروع، بنية قابلة للتطوير بدون إعادة بناء.

## الطبقات
```
UI / Components (src/components/ui + sections)
  ↓
Pages / Features (src/components/*, src/pages — مستقبلاً)
  ↓
Services / API (src/services/* — واجهة واحدة للـ mock والـ fetch)
  ↓
Database (مخطط مقترح أدناه — PostgreSQL + Prisma / Drizzle)
```

## المجلدات
- `src/types` — عقود TypeScript هي مصدر الحقيقة للـ DB
- `src/config/site.ts` — إعدادات الموقع (singleton) — يصبح `GET /api/site-config`
- `src/data/site-content.ts` — محتوى قابل للتحرير — يصبح `GET /api/content`
- `src/services` — `site.service.ts`, `applications.service.ts` (واجهة `create/list/get/updateStatus`)
- `src/lib` — `utils.ts`, `validations.ts` (مشتركة مع الـ Backend عبر package مستقبلاً)
- `src/components/ui` — Design System (Button, Container, Card, FormField)
- `src/hooks` — `useScrolled`, `useScrollLock`

## Design System
- Tailwind 4 مع tokens في `src/index.css` (@theme)
- ألوان من الشعار: `ink`, `raspberry`, `amber`, `teal`, `cream`
- كل الأقسام تستخدم `Container` + `Section`/`Card` — لا Style منفصل لكل Section

## البيانات
- لا Arrays ثابتة في المكونات — كل المكونات تقرأ من `data` أو `services`
- عند وجود Backend: استبدال `mockApplicationsService` بـ `fetch('/api/applications/students')` — لا تغيير في المكونات

## الأمان
- لا أسرار في Frontend أو VITE_
- كل Validation تُعاد server-side (Zod مشترك)
- PII (أسماء، جوالات) مشفرة في الـ DB
- Rate limiting (5 طلبات / IP / ساعة) + Honeypot + CSRF
- لوحة التحكم: `Authentication + Authorization (RBAC) + Protected routes + Secure sessions`

## الـ Backend المقترح (Free / Open Source)
- **Runtime:** Node.js + Fastify/Express أو Next.js API Routes
- **DB:** PostgreSQL (Neon/Supabase free tier) + Prisma
- **Auth:** Lucia / Auth.js مع Sessions في DB
- **بدون خدمات مدفوعة** — كل شيء قابل للنقل
