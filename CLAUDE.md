# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # Install dependencies
npm run dev       # Start dev server at http://localhost:3000
npm run build     # Production build
npm run lint      # Type-check only (tsc --noEmit) — no test runner configured
npm run clean     # Remove dist and server.js
```

## Environment Setup

Copy `.env.example` to `.env.local` and set `GEMINI_API_KEY`. The app also reads `APP_URL` for self-referential links. These are injected automatically by Google AI Studio at runtime.

## Design System

All styling must follow `jembatani_design_tokens.md` — the single source of truth for the design system. Key points:

- **Tokens live in `src/index.css`** inside a `@theme {}` block (Tailwind v4 CSS-in-CSS format, not `tailwind.config.ts`)
- **Color tokens** follow Material Design 3 semantic naming: always use `bg-surface`, `text-on-primary`, etc. — never raw hex
- **Typography scale**: `text-display-lg-mobile` / `text-headline-lg` / `text-headline-md` (Fraunces), `text-body-lg` / `text-body-md` / `text-body-sm` / `text-label-md` / `text-numeral-xl` (Plus Jakarta Sans)
- **`body-sm` vs `label-md`**: both are 14px, but `body-sm` is weight 400 (input text, captions), `label-md` is weight 600 + letter-spacing (buttons, chips, tags)
- **No shadow-based elevation** — depth comes from `surface-container-*` variants
- **Cards**: always `rounded-lg` (16px), not `rounded-md`
- **Numbers/prices**: always add `tabular-nums` when using Fraunces

## Architecture

**JembaTani** is a mobile-first React 19 + Vite + TypeScript SPA — an Indonesian agricultural marketplace connecting farmers (`PETANI`) and buyers (`PEMBELI`).

### Routing & Shell Pattern

`App.tsx` defines two layout shells via React Router v7 nested routes:

- `AuthShell` — wraps unauthenticated screens (splash, onboarding, login, register); no bottom nav
- `AppShell` — wraps authenticated screens; holds global state (`posts`, `currentRoleMode`), renders `BottomNav` and `CreateBottomSheet`, passes state down via `useOutletContext<AppShellContext>`

Each authenticated screen requiring shared state uses a wrapper component (e.g., `BerandaWrapper`, `AkunWrapper`) to extract the context and forward typed props. This avoids prop-drilling through the router layer.

### Feature Screens (`src/features/`)

| Route                 | Screen          | Purpose                                                                                                          |
| --------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------- |
| `/beranda`            | `Beranda`       | Social feed of supply/demand posts (`PENAWARAN`/`PERMINTAAN`) with filtering, search, and commodity price ticker |
| `/harga`              | `Harga`         | Commodity price list with spotlight carousel, sparkline SVGs, and category filtering                             |
| `/harga/:commodityId` | `HargaDetail`   | 30-day price history for a single commodity                                                                      |
| `/pesan`              | `Pesan`         | Chat thread list                                                                                                 |
| `/pesan/:chatId`      | `ChatDetail`    | Individual chat with negotiation flow                                                                            |
| `/akun`               | `Akun`          | User profile with role mode toggle (`PETANI` ↔ `PEMBELI`)                                                        |
| `/post/create`        | `CreateListing` | Form to create a new supply/demand post                                                                          |

### State Management

All app state lives in `AppShell` (no external store). `currentRoleMode` (`UserRole`) switches between `PETANI` and `PEMBELI` modes, which changes feed personalization messaging in `Beranda` and available actions.

### Data Layer

All data is currently mocked: `src/data/mockData.ts` exports `mockPosts` (Post[]) and `mockCommodities` (CommodityPriceInfo[]). There is no backend API integration yet — the `GEMINI_API_KEY` dependency exists for planned AI features.

### Types (`src/types/`)

- `user.ts` — `UserRole` (`'PETANI' | 'PEMBELI'`), `UserProfile`
- `post.ts` — `Post`, `PostAuthor`, `PostType` (`'PENAWARAN' | 'PERMINTAAN'`)
- `commodity.ts` — `CommodityPriceInfo`, `CommodityCategory` (`'SAYURAN' | 'BUAH' | 'PADI' | 'REMPAH' | 'PERKEBUNAN'`)
- `chat.ts` — chat-related types

### Styling

Tailwind CSS v4 (via `@tailwindcss/vite` plugin). Uses Material Design 3-style semantic color tokens as Tailwind classes (e.g., `bg-surface`, `text-on-primary`, `bg-primary-container`). Two font families: `font-fraunces` (display/headings) and `font-jakarta` (body). The `@` alias resolves to `src/`.

### UI Components (`src/components/`)

- `ui/` — `Avatar` (with verification badge), `Badge` (variants: `penawaran`, `permintaan`, `organic`), `Button` (variants: `primary`, `secondary`)
- `layout/` — `SafeArea`, `BottomNav`, `CreateBottomSheet` (slide-up sheet for creating posts or requests)

### Utilities (`src/lib/utils.ts`)

- `formatRupiah(value)` — IDR currency formatting using `Intl.NumberFormat`
- `formatRelativeTime(hoursAgo)` — Bahasa Indonesia relative time strings
- `getInitials(name)` — two-letter avatar initials
