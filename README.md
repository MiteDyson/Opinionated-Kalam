# Opinionated Kalam 🖋️

Opinionated Kalam is a premium, independent digital journalism publication platform. It serves digital-first formats including deep-dive **Articles**, **Podcasts**, and **Short Reads**, backed by an elegant user subscriptions dashboard and automated email newsletters.

---

## 🛠️ The Tech Stack

The application is built with a state-of-the-art developer environment and highly scalable services:

* **Core Framework**: [Next.js (v15+)](https://nextjs.org/) with App Router and [React 19](https://react.dev/).
* **Language**: [TypeScript](https://www.typescriptlang.org/) for static typing and maximum stability.
* **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) utilizing [Mongoose](https://mongoosejs.com/) for elegant object modeling.
* **Authentication**: [Firebase Client Authentication](https://firebase.google.com/docs/auth) secured with [Firebase Admin SDK](https://firebase.google.com/docs/admin) JWT token verification on server-side API endpoints.
* **Email Delivery**: [Resend](https://resend.com/) integrated via standard [Nodemailer](https://nodemailer.com/) for high-deliverability transactional and format-targeted newsletter alerts.
* **Interactive UI & Animations**: [Framer Motion](https://www.framer.com/motion/) for fluid page transitions, loading spinners, and custom toasts.
* **Styling**: Sleek modern layout styling with [Tailwind CSS](https://tailwindcss.com/) and Vanilla CSS variables.
* **Content Editor**: [TipTap Editor](https://tiptap.dev/) for smooth, rich-text admin article creation.
* **Image CDN**: [ImageKit](https://imagekit.io/) for fast, optimized asset loading.

---

## 🚀 Quick Start & Setup

Follow these steps to get your local environment up and running in minutes:

### 1. Clone & Install Dependencies
First, clone this repository to your local machine and install the required npm packages:
```bash
git clone <your-repo-url>
cd Opinionated-Kalam-main
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in your root directory (or copy the values from `.env`):
```env
# ── MongoDB Database ──────────────────────────────────────────
MONGODB_URI=your_mongodb_connection_string

# ── Firebase Client SDK ───────────────────────────────────────
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# ── Firebase Admin SDK ────────────────────────────────────────
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY="your_firebase_private_key"

# ── ImageKit CDN ──────────────────────────────────────────────
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key

# ── Administration Settings ──────────────────────────────────
ADMIN_EMAIL=your_admin_email@gmail.com
NEXT_PUBLIC_ADMIN_EMAIL=your_admin_email@gmail.com

# ── Resend SMTP Email Service ────────────────────────────────
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=resend
SMTP_PASS=re_your_resend_api_key
EMAIL_FROM="Opinionated Kalam <onboarding@resend.dev>"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run the Development Server
Launch the Next.js local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📬 Email Notification System

The project features a **fully automated subscriber notification pipeline** utilizing **Resend SMTP**:

### Preference Filters & Beats
* Readers can manage their exact notification rules (toggling specific Beats like Technology, Business, Geo-Politics, or formats like Articles and Podcasts) on the `/subscriptions` control panel.
* When a post is published, the backend maps categories and matches them dynamically with qualified users.

### Local Development / Dry-Run Testing
* **Simulation Mode**: If SMTP credentials (`SMTP_USER` / `SMTP_PASS`) are commented out in your `.env`, the email service will seamlessly fall back to **Simulation Mode** and log full email details directly to your terminal.
* **Onboarding Key**: To test live dispatches without a custom domain, configure your verified signup address and use the default `onboarding@resend.dev` email in your `.env`.

### Production Deployment
To open dispatches to all recipients, verify your custom domain on the [Resend Domains Dashboard](https://resend.com/domains) and update your configuration:
```env
EMAIL_FROM="Opinionated Kalam <newsletter@yourdomain.com>"
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

## 🛠️ Key Scripts
* `npm run dev` - Start local development server.
* `npm run build` - Compile production bundle.
* `npm run start` - Launch built production server.
* `npm run lint` - Perform ESLint code check.
