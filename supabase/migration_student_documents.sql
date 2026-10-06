-- Migration: Student documents — private storage + optional JSON fields
-- Run in Supabase Dashboard > SQL Editor
-- Does NOT delete or alter existing data. Only adds bucket + storage policies.
-- The student_applications table stores `data` as JSONB, so new fields (phones/urls) need no DDL.
-- However we add helper indexes and private bucket for documents.

-- 1) Create private bucket for student documents
insert into storage.buckets (id, name, public)
values ('student-documents', 'student-documents', false)
on conflict (id) do nothing;

-- Ensure bucket is private (if previously created as public, set to private)
update storage.buckets set public = false where id = 'student-documents';

-- 2) Storage RLS policies for student-documents (private)
-- Allow anon (public site) to INSERT (upload) — required for parent registration
-- Only authenticated (admin) can SELECT/UPDATE/DELETE

drop policy if exists "public insert student-documents" on storage.objects;
create policy "public insert student-documents"
on storage.objects for insert
to anon, authenticated
with check (bucket_id = 'student-documents');

drop policy if exists "auth read student-documents" on storage.objects;
create policy "auth read student-documents"
on storage.objects for select
to authenticated
using (bucket_id = 'student-documents');

drop policy if exists "auth update student-documents" on storage.objects;
create policy "auth update student-documents"
on storage.objects for update
to authenticated
using (bucket_id = 'student-documents')
with check (bucket_id = 'student-documents');

drop policy if exists "auth delete student-documents" on storage.objects;
create policy "auth delete student-documents"
on storage.objects for delete
to authenticated
using (bucket_id = 'student-documents');

-- Note: No public SELECT policy — documents remain private.
-- Admin dashboard must use createSignedUrl() to preview (expires in 1h).

-- 3) Optional: indexes for new JSON fields (phones) if you query by them
create index if not exists idx_student_mother_phone on public.student_applications ((data->>'motherPhone'));
create index if not exists idx_student_father_phone on public.student_applications ((data->>'fatherPhone'));

-- 4) Verification query (run manually to check)
-- select * from storage.buckets where id='student-documents';
-- select policyname, cmd, roles from pg_policies where tablename='objects' and policyname like '%student-documents%';
