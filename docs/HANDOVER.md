# Handover — تشغيل وتسليم المشروع

## التشغيل محلياً
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # إنتاج
npm run preview  # معاينة الإنتاج
```

## المتطلبات
- Node.js 20+
- npm 10+

## متغيرات البيئة
انسخ `.env.example` إلى `.env` وعبئ القيم:
```bash
cp .env.example .env
```
- لا تضع أسرار في `VITE_*` — كل ما يبدأ بـ `VITE_` يظهر في المتصفح
- أسرار الـ Backend (DATABASE_URL, JWT_SECRET) تبقى server-only

## قاعدة البيانات (عند التنفيذ)
1. إنشاء PostgreSQL (Neon https://neon.tech مجاني أو Supabase)
2. ضبط `DATABASE_URL` في `.env` الخاص بالـ Backend
3. `npx prisma migrate dev` ثم `npx prisma generate`

## لوحة التحكم (مستقبلاً)
- المسار: `/admin` محمي بـ Auth
- تسجيل دخول: يُنشأ أول مستخدم عبر `npm run seed:admin` (يعطى role super_admin)
- لا يمكن الوصول للـ API بدون جلسة صالحة

## النشر (Deploy) — مجاني
- **Frontend:** Vercel / Netlify / Cloudflare Pages — ربط المستودع مباشرة، أمر البناء `npm run build`، المجلد `dist`
- **Backend (عند إضافته):** Fly.io / Render free tier أو نفس Vercel API routes
- لا حاجة لحساب العميل — فقط ربط Domain

## الصور
- صور الهيرو حالياً من Pexels كـ Placeholder مؤقت — تُستبدل بصور حقيقية من المركز عبر `src/data/site-content.ts` أو لاحقاً من لوحة التحكم `/admin/media`
- لا تنسب أي صورة للمركز إلا بعد رفعها من لوحة التحكم

## الاختبار قبل التسليم
- [ ] كل روابط Navbar تعمل + إغلاق القائمة بعد الضغط
- [ ] كل CTA يوصل للقسم الصحيح
- [ ] واتساب يفتح https://wa.me/966547893386
- [ ] نماذج التسجيل: Validation عربية + منع إرسال مكرر + رسالة نجاح
- [ ] لا Horizontal scroll على iPhone/Android/Tablet/Desktop
- [ ] `npm run build` ينجح بدون أخطاء Console
