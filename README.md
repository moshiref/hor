# مركز حور العين لضيافة الأطفال — Public Website

موقع احترافي متكامل (RTL، عربي، Mobile-first) مبني بـ React + TypeScript + Vite + Tailwind 4.

## التشغيل
```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

## البنية
- `src/types` — عقود TypeScript (جاهزة للـ DB)
- `src/config/site.ts` — إعدادات الموقع
- `src/data/site-content.ts` — محتوى قابل للتحرير (سيصبح API)
- `src/services` — واجهة البيانات (mock الآن، fetch لاحقاً)
- `src/components/ui` — Design System
- `src/components` — أقسام الصفحة

## الأقسام
Hero → من نحن → برامجنا → الأنشطة → ما يناسب وقت أسرتكم → لماذا حور العين → تسجيل طالب → التقديم كعاملة → موقعنا → تواصل → Footer

## النماذج
- تسجيل طالب: كل الحقول المطلوبة حرفياً + Validation عربية + منع تكرار + رسالة نجاح
- التقديم كعاملة: كل الأسئلة حرفياً مع حالات "أخرى" + Multi Select

## لوحة التحكم (مستقبلاً)
البنية جاهزة لـ `/admin` محمي بـ Auth. راجع `docs/ARCHITECTURE.md` و `docs/DATABASE.md` و `docs/HANDOVER.md`.

## النشر
`dist` جاهز للنشر على Vercel/Netlify/Cloudflare Pages بدون خدمات مدفوعة.

## الوثائق
- `docs/ARCHITECTURE.md`
- `docs/DATABASE.md`
- `docs/HANDOVER.md`
- `.env.example`
