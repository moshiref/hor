-- Supabase Production Schema for Hor Al-Ain
-- Run this in Supabase Dashboard > SQL Editor
-- Project: https://pknyjxachxspbjkgvfxx.supabase.co

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- CMS single row
create table if not exists public.cms (
  id int primary key,
  config jsonb,
  content jsonb,
  updated_at timestamptz default now()
);
insert into public.cms (id, config, content) values (1, '{}'::jsonb, '{}'::jsonb)
on conflict (id) do nothing;

-- Student applications
create table if not exists public.student_applications (
  id text primary key,
  data jsonb not null,
  created_at timestamptz default now()
);
create index if not exists idx_student_created on public.student_applications (created_at desc);
create index if not exists idx_student_data_status on public.student_applications ((data->>'status'));

-- Staff applications
create table if not exists public.staff_applications (
  id text primary key,
  data jsonb not null,
  created_at timestamptz default now()
);
create index if not exists idx_staff_created on public.staff_applications (created_at desc);

-- Storage bucket for images
insert into storage.buckets (id, name, public) values ('images', 'images', true)
on conflict (id) do nothing;

-- RLS
alter table public.cms enable row level security;
alter table public.student_applications enable row level security;
alter table public.staff_applications enable row level security;

-- Policies: public can read cms, insert applications; only authenticated can read/update applications and update cms
drop policy if exists "public read cms" on public.cms;
create policy "public read cms" on public.cms for select using (true);

drop policy if exists "auth update cms" on public.cms;
create policy "auth update cms" on public.cms for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "public insert students" on public.student_applications;
create policy "public insert students" on public.student_applications for insert with check (true);

drop policy if exists "auth read students" on public.student_applications;
create policy "auth read students" on public.student_applications for select using (auth.role() = 'authenticated');

drop policy if exists "auth update students" on public.student_applications;
create policy "auth update students" on public.student_applications for all using (auth.role() = 'authenticated');

drop policy if exists "public insert staff" on public.staff_applications;
create policy "public insert staff" on public.staff_applications for insert with check (true);

drop policy if exists "auth read staff" on public.staff_applications;
create policy "auth read staff" on public.staff_applications for select using (auth.role() = 'authenticated');

drop policy if exists "auth update staff" on public.staff_applications;
create policy "auth update staff" on public.staff_applications for all using (auth.role() = 'authenticated');

-- Storage policies: public read, authenticated write
drop policy if exists "public read images" on storage.objects;
create policy "public read images" on storage.objects for select using (bucket_id = 'images');

drop policy if exists "auth write images" on storage.objects;
create policy "auth write images" on storage.objects for all using (bucket_id = 'images' and auth.role() = 'authenticated') with check (bucket_id = 'images');

-- Note: create admin user via Supabase Dashboard > Authentication > Add user
-- Email: admin@hor-alain.local  Password: (set strong password)
-- Then login at /admin/login will use supabase.auth.signInWithPassword when VITE_SUPABASE_* is set
