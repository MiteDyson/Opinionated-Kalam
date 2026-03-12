-- ============================================================
-- Opinionated Kalam — Supabase Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────────────────────
-- AUTHORS
-- ─────────────────────────────────────────────────────────────
create table public.authors (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id) on delete cascade,
  name        text not null,
  email       text not null unique,
  avatar_url  text,
  bio         text,
  role        text not null default 'author' check (role in ('admin', 'author')),
  created_at  timestamptz not null default now()
);

-- Row-Level Security
alter table public.authors enable row level security;

create policy "Anyone can read authors"
  on public.authors for select using (true);

create policy "Admins can manage authors"
  on public.authors for all
  using (
    exists (
      select 1 from public.authors a
      where a.user_id = auth.uid() and a.role = 'admin'
    )
  );

-- ─────────────────────────────────────────────────────────────
-- CATEGORIES
-- ─────────────────────────────────────────────────────────────
create table public.categories (
  id    uuid primary key default uuid_generate_v4(),
  name  text not null,
  slug  text not null unique
);

alter table public.categories enable row level security;

create policy "Anyone can read categories"
  on public.categories for select using (true);

create policy "Admins can manage categories"
  on public.categories for all
  using (
    exists (
      select 1 from public.authors a
      where a.user_id = auth.uid() and a.role = 'admin'
    )
  );

-- Seed default categories
insert into public.categories (name, slug) values
  ('Automotive',    'automotive'),
  ('Geopolitics',   'geopolitics'),
  ('Scandals',      'scandals'),
  ('Crime',         'crime'),
  ('Explainers',    'explainers'),
  ('Economy',       'economy'),
  ('Technology',    'technology');

-- ─────────────────────────────────────────────────────────────
-- POSTS
-- ─────────────────────────────────────────────────────────────
create table public.posts (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  slug          text not null unique,
  type          text not null default 'article'
                  check (type in ('article', 'short', 'podcast', 'video')),
  body          text,           -- Tiptap JSON or HTML
  excerpt       text,
  cover_image   text,
  author_id     uuid references public.authors(id) on delete set null,
  category_id   uuid references public.categories(id) on delete set null,
  tags          text[],
  status        text not null default 'draft'
                  check (status in ('draft', 'published')),
  published_at  timestamptz,
  -- podcast-specific
  audio_url     text,
  duration      text,
  -- video-specific
  video_url     text,
  video_duration text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.posts enable row level security;

-- Public can read published posts
create policy "Anyone can read published posts"
  on public.posts for select
  using (status = 'published');

-- Authors can read their own drafts
create policy "Authors can read own drafts"
  on public.posts for select
  using (author_id in (
    select id from public.authors where user_id = auth.uid()
  ));

-- Authors can insert their own posts
create policy "Authors can create posts"
  on public.posts for insert
  with check (author_id in (
    select id from public.authors where user_id = auth.uid()
  ));

-- Authors can update their own posts; admins can update any
create policy "Authors can update own posts"
  on public.posts for update
  using (
    author_id in (select id from public.authors where user_id = auth.uid())
    or
    exists (select 1 from public.authors where user_id = auth.uid() and role = 'admin')
  );

-- Admins can delete posts
create policy "Admins can delete posts"
  on public.posts for delete
  using (
    exists (select 1 from public.authors where user_id = auth.uid() and role = 'admin')
  );

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger posts_updated_at
  before update on public.posts
  for each row execute procedure update_updated_at();

-- ─────────────────────────────────────────────────────────────
-- COMMENTS
-- ─────────────────────────────────────────────────────────────
create table public.comments (
  id          uuid primary key default uuid_generate_v4(),
  post_id     uuid references public.posts(id) on delete cascade,
  user_id     uuid references auth.users(id) on delete cascade,
  user_name   text,
  user_avatar text,
  body        text not null,
  approved    boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table public.comments enable row level security;

-- Anyone can read approved comments
create policy "Anyone can read approved comments"
  on public.comments for select
  using (approved = true);

-- Authenticated users can create comments
create policy "Authenticated users can comment"
  on public.comments for insert
  with check (auth.uid() = user_id);

-- Users can delete their own comments
create policy "Users can delete own comments"
  on public.comments for delete
  using (auth.uid() = user_id);

-- Admins can moderate all comments
create policy "Admins can manage comments"
  on public.comments for all
  using (
    exists (select 1 from public.authors where user_id = auth.uid() and role = 'admin')
  );

-- ─────────────────────────────────────────────────────────────
-- MEDIA
-- ─────────────────────────────────────────────────────────────
create table public.media (
  id          uuid primary key default uuid_generate_v4(),
  url         text not null,
  type        text not null check (type in ('image', 'audio', 'video')),
  filename    text,
  size_bytes  integer,
  uploader_id uuid references public.authors(id) on delete set null,
  created_at  timestamptz not null default now()
);

alter table public.media enable row level security;

create policy "Authors can read media"
  on public.media for select
  using (
    exists (select 1 from public.authors where user_id = auth.uid())
  );

create policy "Authors can upload media"
  on public.media for insert
  with check (
    exists (select 1 from public.authors where user_id = auth.uid())
  );

-- ─────────────────────────────────────────────────────────────
-- STORAGE BUCKETS (run separately in Supabase dashboard)
-- ─────────────────────────────────────────────────────────────
-- Create bucket: covers     (public)
-- Create bucket: audio      (private, requires signed URLs)
-- Create bucket: avatars    (public)
