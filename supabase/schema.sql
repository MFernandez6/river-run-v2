-- River Run Condo: Supabase schema

-- 1) Board members
create table if not exists public.board_members (
  id uuid primary key,
  name text not null,
  position text not null,
  email text not null,
  phone text,
  photo_url text,
  created_at timestamptz not null default now()
);

-- 2) Announcements (max 4 shown publicly, but we store all if desired)
create table if not exists public.announcements (
  id uuid primary key,
  title text not null,
  content text not null,
  date_label text not null,
  type text not null default 'Update',
  created_at timestamptz not null default now()
);

-- Optional: speed ordering
create index if not exists announcements_created_at_idx on public.announcements (created_at desc);
create index if not exists board_members_created_at_idx on public.board_members (created_at asc);

-- RLS (optional). If you enable RLS, add policies that restrict writes to an admin role/user.
-- For now the app uses SUPABASE_SERVICE_ROLE_KEY for server writes.

