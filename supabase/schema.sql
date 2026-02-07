-- Mo Consult (UI-first -> production-ready schema)
-- Run this in Supabase SQL Editor.

-- Required for gen_random_uuid()
create extension if not exists pgcrypto;

-- 1) Profiles (role + display name)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  role text not null default 'USER',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles(role);

-- 2) Dossiers (stores the draft JSON + workflow)
create table if not exists public.dossiers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('srl','pp')),
  status text not null default 'draft',
  step_index int not null default 0,
  draft jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, type)
);

create index if not exists dossiers_user_idx on public.dossiers(user_id);
create index if not exists dossiers_status_idx on public.dossiers(status);

-- 3) Messages (client/admin discussion)
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  dossier_id uuid not null references public.dossiers(id) on delete cascade,
  sender text not null check (sender in ('client','admin')),
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists messages_dossier_idx on public.messages(dossier_id);

-- 4) Promo codes
create table if not exists public.promo_codes (
  code text primary key,
  type text not null check (type in ('percent','fixed')),
  value numeric not null,
  active boolean not null default true,
  note text,
  created_at timestamptz not null default now()
);

-- 5) Partners (for partner cards + profile page)
create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  category text not null,
  name text not null,
  website text,
  city text,
  address text,
  phone text,
  email text,
  vat text,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 6) Analytics events (simple pageviews)
create table if not exists public.page_events (
  id uuid primary key default gen_random_uuid(),
  event text not null default 'pageview',
  path text not null,
  lang text,
  referrer text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists page_events_created_idx on public.page_events(created_at);
create index if not exists page_events_path_idx on public.page_events(path);

-- ---------------------------
-- RLS
-- ---------------------------
alter table public.profiles enable row level security;
alter table public.dossiers enable row level security;
alter table public.messages enable row level security;
alter table public.promo_codes enable row level security;
alter table public.partners enable row level security;
alter table public.page_events enable row level security;

-- Profiles: user can read/update own profile. Admin can read all.
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Auto-create a profile row when a new auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', ''), 'USER')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Dossiers: user can CRUD own dossiers.
create policy "dossiers_select_own" on public.dossiers
  for select using (auth.uid() = user_id);

create policy "dossiers_insert_own" on public.dossiers
  for insert with check (auth.uid() = user_id);

create policy "dossiers_update_own" on public.dossiers
  for update using (auth.uid() = user_id);

-- Messages: user can read messages for own dossiers, insert as client.
create policy "messages_select_own" on public.messages
  for select using (
    exists (
      select 1 from public.dossiers d
      where d.id = messages.dossier_id and d.user_id = auth.uid()
    )
  );

create policy "messages_insert_client_own" on public.messages
  for insert with check (
    sender = 'client' and
    exists (
      select 1 from public.dossiers d
      where d.id = messages.dossier_id and d.user_id = auth.uid()
    )
  );

-- Promo codes: public read (for applying in checkout), admin write later.
create policy "promo_codes_public_select" on public.promo_codes
  for select using (true);

-- Partners: public read active partners.
create policy "partners_public_select_active" on public.partners
  for select using (is_active = true);

-- Analytics: public insert only (read via service role from server routes).
create policy "page_events_public_insert" on public.page_events
  for insert with check (true);

-- NOTE:
-- Admin policies (read all dossiers/messages, manage partners/promos) should be implemented
-- via either:
--  - Supabase "service role" from server routes ONLY, OR
--  - Custom JWT claims / "role" checks using a Postgres function.
-- For v1 launch: use server-side service role for admin CRUD.
