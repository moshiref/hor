# Database Schema — مقترح للتنفيذ

## الجداول

### users
- id (uuid, pk)
- email (unique)
- password_hash
- role (enum: super_admin, admin, viewer)
- created_at, updated_at

### site_config (singleton)
- id
- name, short_name, tagline
- logo_mark_url, logo_full_url
- seo_title, seo_description
- contact_phone, contact_whatsapp, contact_address_label
- social_json
- location_address, location_city, location_region, google_maps_url, lat, lng

### site_sections
- id, key (hero|about|programs|activities|schedule), title, description, data_json, is_visible, order

### programs
- id, title, description, icon (enum), order, is_visible

### activities / media
- id, title, image_url, is_visible, order, created_at

### student_applications
- id, student_name, birth_date, gender (enum), stage (enum), period (enum)
- guardian_name, guardian_phone_encrypted, district, needs_transport (boolean)
- health_notes_encrypted, extra_notes_encrypted
- status (enum: new, under_review, contacted, accepted, rejected, archived)
- reviewed_at, reviewed_by (fk users.id), notes_internal
- created_at, updated_at, deleted_at (soft delete)

### staff_applications
- id, full_name, phone_encrypted, current_employer, current_role, reason_to_join, wants_to_join_list (bool), future_topics_json
- status, reviewed_at, reviewed_by, notes_internal, timestamps + soft delete

## العلاقات
- users 1—N student_applications.reviewed_by
- users 1—N staff_applications.reviewed_by

## الفهارس
- index على status, created_at للفلترة السريعة في الداشبورد
- بحث GIN على الاسم والجوال (pg_trgm)

## ملاحظة
المخطط يُطبق بـ Prisma:
```prisma
model StudentApplication {
  id String @id @default(cuid())
  studentName String
  birthDate DateTime
  gender Gender
  // ...
  status ApplicationStatus @default(new)
}
```
