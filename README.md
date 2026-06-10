# Kalakriti

**A warm, artisan-first handmade marketplace for independent Indian creators.**

Browse pottery, textiles, woodwork, brass craft, and more — listed directly by verified makers. Message artisans, request custom pieces, and support genuine craft traditions.

---

## Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# Fill in your Supabase URL and anon key

# 3. Set up the database
# Run supabase/schema.sql in your Supabase SQL Editor

# 4. Create storage buckets in Supabase
# → product-images (public)
# → avatars (public)

# 5. Start development
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Features

- **Marketplace** — Browse handmade products with category filtering
- **Creator profiles** — Each artisan has a studio page with bio and listed pieces
- **Messaging** — Real-time direct conversations between buyers and creators
- **Order requests** — Buyers can request pieces with customisation notes
- **Dual roles** — Separate flows for buyers and creator/artisans
- **Google OAuth** — Optional, enable in Supabase dashboard
- **Works without Supabase** — Graceful degradation when env vars are absent

## Architecture

See [`CLAUDE.md`](./CLAUDE.md) for the full technical architecture guide.

## Tech Stack

- [Next.js 16](https://nextjs.org) — App Router, Server Actions, RSC
- [Supabase](https://supabase.com) — Postgres, Auth, Storage, Realtime
- [Tailwind CSS v4](https://tailwindcss.com)
- [TypeScript](https://typescriptlang.org)

---

*Kalakriti — where every piece carries a story.*
