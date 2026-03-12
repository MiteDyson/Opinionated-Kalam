# Opinionated Kalam — by Dense

A sharp, opinionated blogging platform for articles, podcasts, videos, and short reads.

---

## Stack

| Layer        | Tech                          |
|--------------|-------------------------------|
| Framework    | Next.js 14 (App Router)       |
| Database     | Supabase (PostgreSQL)         |
| Auth         | Supabase Auth (Google + Email)|
| Editor       | Tiptap (rich text)            |
| Styling      | Tailwind CSS                  |
| Deployment   | Vercel                        |

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Create a Supabase project
Go to [supabase.com](https://supabase.com) → New Project.

### 3. Run the database schema
Copy the contents of `supabase-schema.sql` and run it in the **Supabase SQL Editor**.

### 4. Set up Auth providers in Supabase
- Go to **Authentication → Providers**
- Enable **Email** (with email confirmation)
- Enable **Google** (add your Google OAuth client ID + secret)

### 5. Create Storage buckets
In Supabase → **Storage**, create:
- `covers` — Public bucket (article cover images)
- `audio` — Private bucket (podcast files)
- `avatars` — Public bucket (author avatars)

### 6. Configure environment variables
```bash
cp .env.local.example .env.local
```
Fill in your Supabase URL and keys from **Project Settings → API**.

### 7. Run the dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
app/
├── page.tsx              → Homepage
├── articles/[slug]/      → Article detail
├── podcasts/             → Podcast listing
├── videos/               → Video listing
├── shorts/               → Short reads
├── category/[slug]/      → Category pages
└── admin/                → Admin panel (auth-protected)
    ├── page.tsx           → Dashboard
    ├── posts/             → Create & edit posts
    ├── media/             → Media library
    ├── comments/          → Comment moderation
    ├── authors/           → Author management
    └── categories/        → Category management

components/
├── layout/               → Header, Footer, SideMenu, Logo
├── article/              → ArticleCard, ArticleBody
├── home/                 → HomeFeed
└── admin/                → Editor, MediaUploader

lib/
├── supabase.ts           → Supabase client setup
└── utils.ts              → Helpers (formatDate, slugify, etc.)

types/
└── index.ts              → TypeScript types
```

---

## Phase Roadmap

- [x] **Phase 1** — Layout components (Header, Nav, Footer, Logo, Sidebar)
- [x] **Phase 1** — TypeScript types & Supabase schema
- [ ] **Phase 2** — Public pages (Homepage, Article, Podcast, Video, Shorts)
- [ ] **Phase 2** — Category & Search pages
- [ ] **Phase 3** — Admin CRUD with Tiptap editor
- [ ] **Phase 3** — Media uploader
- [ ] **Phase 4** — Comment system with Google + Email auth
- [ ] **Phase 4** — SEO (metadata, OG tags, sitemap)
- [ ] **Phase 4** — Deploy to Vercel

---

## Design Tokens

```
--bg-color:           #EBE7DF   (warm off-white background)
--text-main:          #1A1A1A   (near-black text)
--text-muted:         #555555   (secondary text)
--accent-terracotta:  #D38B88   (pill badge, CTA highlight)
--accent-red:         #D92323   (YouTube icon, hover states)
--footer-bg:          #151515   (dark footer)
--border-color:       #CFCBC3   (subtle borders)

Fonts:
  DM Serif Display    → headings, logo, article titles
  Inter               → body, nav, UI labels
```
