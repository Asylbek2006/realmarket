# RealMarket

A full-stack e-commerce marketplace built with Next.js, Prisma, and Supabase. Buy, sell, and manage products with a clean, responsive interface.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)
![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ECF8E?logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel)

---

## Features

- **JWT authentication** with secure refresh token rotation and httpOnly cookies
- **Product CRUD** — sellers can create, update, and delete their listings
- **Search and category filters** — find products quickly with full-text search and category browsing
- **Role-based access control** — distinct Buyer, Seller, and Admin roles with enforced permissions
- **Cart with localStorage persistence** — cart state survives page refreshes via Zustand + persist
- **Transactional order creation** — stock validation, price snapshot, and atomic decrement in a single DB transaction
- **Responsive design** — mobile-first layout built with Tailwind CSS

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Database | PostgreSQL via Supabase |
| ORM | Prisma 7 |
| Auth | JWT (jsonwebtoken) + httpOnly cookies |
| State | Zustand 5 |
| Styling | Tailwind CSS 4 |
| UI Components | Base UI + shadcn/ui |
| Notifications | Sonner |
| Deployment | Vercel |

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Asylbek2006/realmarket.git
cd realmarket
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your Supabase connection strings and JWT secrets.

### 4. Run database migrations

```bash
npx prisma migrate dev
```

### 5. Seed demo data

```bash
npm run seed
```

This creates 5 categories, an admin user (`admin@realmarket.com` / `Admin1234`), a seller (`seller@realmarket.com` / `Seller1234`), and 8 sample products.

### 6. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Key Directory Structure

```
src/
├── app/
│   ├── (auth)/          # Login and register pages
│   ├── (main)/          # Marketplace pages (products, cart, checkout, orders)
│   ├── api/             # API route handlers (auth, products, categories, orders)
│   ├── error.tsx        # Global error boundary
│   └── not-found.tsx    # 404 page
├── components/
│   └── ui/              # Shared UI components
└── lib/
    ├── auth.ts          # JWT sign/verify helpers
    ├── prisma.ts        # Prisma client singleton
    ├── hooks/           # React hooks (useAuth)
    ├── middleware/      # requireAuth helper
    ├── stores/          # Zustand stores (cart)
    └── validators/      # Zod schemas
prisma/
├── schema.prisma        # Database schema
└── seed.ts              # Demo data seed script
```

---

## Deploying to Vercel

1. Push your repository to GitHub.
2. Import the project in [Vercel](https://vercel.com/new).
3. Add all environment variables from `.env.example` in the Vercel project settings.
4. Deploy — Vercel will automatically run `next build` on each push.

> Make sure to use the **pooled** Supabase connection string for `DATABASE_URL` and the **direct** connection string for `DIRECT_URL` (required by Prisma migrations).

---

Built by Asyl — [https://github.com/Asylbek2006](https://github.com/Asylbek2006)
