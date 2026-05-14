# Opinionated Kalam — by Dense

A sharp, opinionated blogging platform for articles, podcasts, videos, and short reads.

---

## Stack

| Layer        | Tech                          |
|--------------|-------------------------------|
| Framework    | Next.js 14 (App Router)       |
| Database     | MongoDB (Mongoose ODM)        |
| Auth         | Firebase Auth (Google + Email)|
| Media        | ImageKit (CDN + transforms)   |
| Editor       | Tiptap (rich text)            |
| Styling      | Tailwind CSS                  |
| Deployment   | Vercel                        |

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Set up MongoDB
Create a MongoDB Atlas cluster (or use a local instance) and note the connection string.

### 3. Set up Firebase
- Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
- Enable **Authentication** → **Email/Password** and **Google** sign-in providers
- Download your **Service Account Key** JSON from Project Settings → Service Accounts

### 4. Set up ImageKit
- Create an account at [imagekit.io](https://imagekit.io)
- Note your **Public Key**, **Private Key**, and **URL Endpoint**

### 5. Configure environment variables
```bash
cp .env.local.example .env.local
```
Fill in your MongoDB URI, Firebase client & admin keys, and ImageKit credentials.

### 6. Run the dev server
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
├── db/                       → Database layer
│   ├── mongodb.ts             → Mongoose connection setup
│   ├── Article.ts             → Article schema & indexes
│   └── User.ts                → User schema
├── auth/                     → Authentication & authorization
│   ├── firebase.ts            → Firebase client SDK
│   ├── firebase-admin.ts      → Firebase Admin SDK
│   ├── tokenCache.ts          → In-memory token cache
│   ├── verifyToken.ts         → User-level token verification
│   └── verifyAdmin.ts         → Admin authorization
├── services/                 → External services
│   ├── imagekit.ts            → ImageKit upload + CDN transforms
│   └── cache.ts               → Client-side fetch cache
├── security/                 → Input validation & sanitization
│   ├── validators.ts          → Zod input schemas
│   └── sanitize.ts            → DOMPurify HTML sanitization
├── types.ts                  → TypeScript type definitions
└── utils.ts                  → Helpers (formatDate, slugify, etc.)
```

---

## Phase Roadmap

- [x] **Phase 1** — Layout components (Header, Nav, Footer, Logo, Sidebar)
- [x] **Phase 1** — TypeScript types & MongoDB schemas
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
