# The Docket 2.0 — Product Spec

**Version:** 2.0
**Date:** March 8, 2026
**Author:** Alex (Random Software)
**Domain:** docket.random-software.com
**Repo:** github.com/toowitttoquit/docket

---

## Product Overview

**The Docket** is a mobile-optimized web app for discovering, scheduling, and sharing events during Austin's biggest week in March. Unlike existing lists that silo tech and music, The Docket bridges both worlds — reflecting how people actually experience the festival. The app is branded under Random Software, with email collection serving as the primary airCFO acquisition channel post-event.

**Trademark Note:** The app intentionally avoids any use of "South by Southwest," "SXSW," "South By," "SX," or any derived variations, all of which are registered trademarks of SXSW, LLC. The Docket is an independent, unofficial community tool. This disclaimer appears in the app footer.

### Core Value Proposition

> "Your schedule for Austin's biggest week — tech by day, music by night."

### Success Metrics

- Email addresses collected (primary KPI)
- Shared docket links generated (viral loop)
- Events saved per user
- Docket copies (user-to-user viral adoption)
- User-submitted events received
- Event ownership claims submitted

---

## Target User

Startup/tech-adjacent attendees who also want to explore music, film, parties, and wellness programming. These users are frustrated by existing tools that force them to choose between tech-only or music-only event lists. They want a curated, opinionated guide — not an exhaustive directory.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.x |
| Language | TypeScript (strict mode) | 5.x |
| Database & Auth | Supabase (Postgres + Auth + RLS) | Client v2.98 |
| CSS | Tailwind CSS 4 + shadcn/ui (New York theme) | 4.x |
| Icons | lucide-react | 0.577 |
| Date utils | date-fns + date-fns-tz | 4.x / 3.x |
| Toasts | sonner | 2.x |
| Testing | Vitest + React Testing Library + happy-dom | Vitest 4.x |
| Package Manager | pnpm | 10.x |
| Hosting | Vercel | — |

---

## Information Architecture

```
Home (Event Feed)
├── Filter bar (category, vibe, date range slider, official/unofficial)
├── Event cards sorted by popularity (save count), with infinite scroll
├── Search (keyword across title, description, venue)
└── Personalized defaults from onboarding preferences

Event Detail (/events/[id])
├── Full metadata (time, venue, tags, description, capacity, price)
├── Organizer info (claimed owner name or "Unclaimed")
├── Social proof (save count with saver names)
├── RSVP button (external link) + Save to Docket + Share
├── Claim event ownership (proof note + URL → admin review)
└── SEO: generateMetadata + OG tags

Edit Event (/events/[id]/edit)
├── Pre-filled form (all event fields)
├── Gated by approved event ownership
└── Edits go live immediately (no re-approval)

Onboarding (/onboarding)
├── Step 1: Badge preference (official / unofficial / all)
├── Step 2: Date range selection
├── Step 3: Category multi-select
└── Step 4: Vibe multi-select

My Docket (/my-docket)
├── Share CTA (copy public URL, toggle visibility)
├── Owned events section (claim status + edit links)
├── Saved events grouped by day (dark pill headers)
├── Compact event cards with unsave
├── Profile info + sign out (bottom of page)
└── Auth-gated (soft prompt)

Submit Event (/submit)
├── URL scraper (pre-fills from event page)
├── Full event form with validation
└── Status: pending review by admin

Public Docket (/u/[slug])
├── Profile banner (avatar, name, category breakdown)
├── Copy Docket CTA (inline + floating sticky)
├── Compact event cards grouped by day
├── Dynamic OG image (1200x630, dark bg, category dots)
└── CTA to create own docket

People (/people)
├── Public profile directory
└── Debounced name search

Sign In (/sign-in)
└── Google OAuth via Supabase
```

---

## Data Model

### `users`

Extends `auth.users`. Auto-populated via trigger on signup.

| Field | Type | Notes |
|-------|------|-------|
| id | uuid (PK) | From auth.users |
| email | text | From OAuth |
| display_name | text | From OAuth profile |
| avatar_url | text | From OAuth profile |
| public_slug | text (unique) | Auto-generated, for `/u/[slug]` |
| is_public | boolean | Default false; toggleable on My Docket |
| has_onboarded | boolean | Default false; set after wizard |
| pref_badge | text | 'official' / 'unofficial' / 'all' / null |
| pref_categories | text[] | Subset of event categories |
| pref_vibes | text[] | Subset of vibe tags |
| pref_start_date | text | ISO date string or null |
| pref_end_date | text | ISO date string or null |
| created_at | timestamptz | |

### `events`

| Field | Type | Notes |
|-------|------|-------|
| id | uuid (PK) | |
| title | text | Required |
| description | text | |
| start_time | timestamptz | Austin timezone assumed for user inputs |
| end_time | timestamptz | Optional |
| venue_name | text | |
| venue_address | text | Tappable → Google Maps |
| category | enum | tech, music, film, party, wellness |
| vibe_tags | text[] | chill, rowdy, networking, deep-dive |
| is_official | boolean | Official festival vs. sidebar/independent |
| is_free | boolean | |
| price_note | text | Optional — "Free with badge" / "$25" etc. |
| rsvp_url | text | External RSVP/ticket link |
| capacity_note | text | Optional — "Limited to 100" etc. |
| organizer_name | text | Optional |
| organizer_url | text | Optional |
| save_count | integer | Denormalized via trigger (performance) |
| status | enum | draft, pending, approved, rejected |
| submitted_by | uuid (FK) | Null for admin-loaded events |
| source | text | "scraped", "network", "user_submission" |
| fts | tsvector | Generated full-text search column |
| created_at | timestamptz | |
| updated_at | timestamptz | Auto-updated via trigger |

### `saved_events`

| Field | Type | Notes |
|-------|------|-------|
| user_id | uuid (FK) | |
| event_id | uuid (FK) | |
| saved_at | timestamptz | |
| (PK) | composite | (user_id, event_id) |

### `event_owners`

Tracks ownership claims. Multiple users can claim the same event.

| Field | Type | Notes |
|-------|------|-------|
| id | uuid (PK) | |
| user_id | uuid (FK) | CASCADE delete |
| event_id | uuid (FK) | CASCADE delete |
| status | text | pending / approved / rejected |
| proof_note | text | Free-text explanation of connection |
| proof_url | text | Optional supporting link |
| requested_at | timestamptz | |
| reviewed_at | timestamptz | Set on admin action |
| | | UNIQUE (user_id, event_id) |

---

## Feature Specs

### 1. Event Discovery (Home Feed) — COMPLETE

The home screen is a filterable, scrollable feed of approved events sorted by popularity (save count descending). Infinite scroll loads 20 events per page via Intersection Observer.

Each event card shows:
- Title (links to detail page)
- Save count (fire emoji + number, top-right)
- Description preview (2-line clamp, hidden in compact variant)
- Date/time (formatted to Austin timezone)
- Venue name (links to Google Maps if address available)
- Category badge (color-coded pill)
- Official/Unofficial badge
- Vibe tags (hidden in compact variant)
- RSVP button (external link) or "RSVP Not Found" placeholder
- Save/unsave button ("Add to Docket" / "On the Docket")

**Filters** (sticky filter bar):
- **Date**: Dual-thumb range slider across event dates
- **Category**: Tech, Music, Film, Party, Wellness
- **Vibe**: Chill, Rowdy, Networking, Deep-dive
- **Type**: Official / Unofficial
- **Search**: Keyword search across title, description, venue name (via `.ilike()`)

**Personalization**: Authenticated users with onboarding complete see a personalized feed by default. A subtle "Showing your personalized feed" indicator with "Show all" link lets them bypass. URL params always override stored preferences.

### 2. Event Detail Page — COMPLETE

Full detail view at `/events/[id]`:

- Title (large, uppercase)
- Organizer row: claimed owner name or "Unclaimed" with inline "Claim This Event" link
- Date/time (Austin timezone)
- Venue name (links to Maps) + address
- Full description
- Category + Official/Unofficial + vibe tag badges
- Price indicator (Free/Paid with optional note)
- Capacity note if present
- Save count with saver names ("Saved by Alex and 12 others")
- Action buttons: RSVP (external) + Save to Docket + Share Event
- Edit button (visible only to approved owners)
- Claim status section (pending/approved/rejected, or claim form if unclaimed)
- SEO: `generateMetadata` with OG/Twitter tags

### 3. Event Ownership & Editing — COMPLETE

Authenticated users can claim ownership of any unclaimed event:
- Claim form asks for a proof note (required, max 1,000 chars) and optional supporting URL
- Claims go to `pending` status for admin review
- Approved owners see an "Edit Event" button on the detail page
- Edit page (`/events/[id]/edit`) shows a pre-filled form with all event fields
- Edits go live immediately — no re-approval needed
- Multiple users can claim the same event (e.g., co-organizers)

On My Docket, users see a "My Events" section showing all their claims with status badges and edit links for approved ones.

### 4. My Docket — COMPLETE

Authenticated users see their saved events organized into day buckets (e.g., "Saturday, March 7"). Within each day, events are sorted chronologically.

**Layout (top to bottom):**
1. Page title
2. Share CTA (copy public URL + visibility toggle)
3. Owned events section (if any claims exist)
4. Saved events grouped by day, with dark pill headers showing event count
5. Compact event cards with unsave button
6. Profile info + sign out at bottom

**Key actions:**
- Unsave events (optimistic UI with undo toast)
- Toggle public profile visibility
- Copy public docket URL
- Edit owned events

### 5. Public Docket Sharing — COMPLETE

Public docket at `/u/[slug]` (no auth required to view):

- Profile banner: 64px avatar with primary ring, display name, category breakdown (colored dots with counts)
- Inline "Copy Docket" CTA: copies all events to viewer's own docket in one tap
- Floating sticky "Copy Docket" CTA: appears via IntersectionObserver when inline CTA scrolls out of view
- Compact event cards grouped by day with dark pill headers
- Bottom CTA: "Build your own Docket" → sign-in
- Dynamic OG image at `/u/[slug]/opengraph-image`: dark background, branding, name, event count, category color dots
- `copyDocket` action: deduplicates against existing saves, uses `toggle_save_event` RPC for each new save
- Security: verifies owner's profile is public before allowing copy

### 6. Onboarding Wizard — COMPLETE

4-step wizard on first sign-in:

1. **Badge preference**: Official / Unofficial / Show me everything
2. **Date range**: Multi-select date pills (March 8–19)
3. **Categories**: Multi-select (Tech, Music, Film, Party, Wellness)
4. **Vibes**: Multi-select (Chill, Rowdy, Networking, Deep-dive)

Each step has Back/Next/Skip. Preferences stored on `users` table and applied as silent default filters on the home feed.

### 7. Event Submission — COMPLETE

Authenticated users submit events via a form at `/submit`:

- Optional URL scraper: paste an event page URL → server-side fetch + HTML parse → pre-fills form fields
- Full form: title, description, date/time (start + end), venue, category, vibes, official/unofficial, free/paid, price note, RSVP URL, capacity note, organizer info
- Validation: required fields, length limits, URL format checks
- SSRF protection on URL scraper: blocks private/internal IP ranges
- Submits with `status: 'pending'` and `submitted_by: user.id`
- Confirmation message on success

### 8. People Directory — COMPLETE

Public directory at `/people`:
- Grid of public user profiles (avatar, name, event count)
- Debounced name search via URL param
- Links to public docket pages

### 9. Auth Flow — COMPLETE

- Google OAuth via Supabase Auth
- Sign-in page with "Sign in with Google" button
- Callback at `/auth/callback` exchanges code for session
- Post-auth routing: if `has_onboarded = false` → `/onboarding`, else → `/`
- `useUser()` hook subscribes to `onAuthStateChange` for reactive state
- Middleware refreshes session cookies on every request
- Soft prompt pattern: auth-required pages show centered sign-in message, not redirects (except `/events/[id]/edit` which hard-redirects)

### 10. Share Mechanics — COMPLETE

Two share surfaces:

1. **Share Event**: Copies deep link to event detail page via Web Share API (with clipboard fallback)
2. **Share My Docket**: Copies public docket URL (`/u/[slug]`)
3. **Copy Docket**: One-tap copy of another user's entire docket (viral loop)

---

## What's NOT Built Yet

### Priority 1: Admin Dashboard

**Why**: Event submissions and ownership claims are piling up with no way to review them. This is the most critical missing piece.

**Scope:**
- Admin route at `/admin` (gated by `ADMIN_EMAILS` env var)
- Pending submissions queue: preview event details → Approve / Reject
- Ability to edit event details before approving (fix typos, adjust tags)
- Ownership claims queue: preview proof note/URL → Approve / Reject
- Quick filters: Pending / Approved / Rejected
- Basic stats: total events, total users, total saves, pending items count

### Priority 2: ICS Calendar Export

**Why**: Users want to add their docket to Apple Calendar / Google Calendar. This was in the original spec and is a natural extension of the scheduling use case.

**Scope:**
- "Export to Calendar" button on My Docket page
- Generates `.ics` file containing all saved events
- Each event includes: title, start/end time (Austin timezone), venue name + address, description, RSVP URL
- Download triggers on button click (no server storage needed)

### Priority 3: PWA Configuration

**Why**: Users at the festival need quick access from their home screen. Installability and an app-like experience are important for a tool they'll use dozens of times per day.

**Scope:**
- Web app manifest (icons, theme color `#0F1012`, standalone display mode)
- Service worker caches the app shell (event data requires network)
- Install prompt handling
- Home screen icon (Docket branding)
- Consider `@ducanh2912/next-pwa` or manual service worker

### Priority 4: Apple OAuth

**Why**: A significant portion of the target audience uses Apple devices and prefers Sign in with Apple.

**Scope:**
- Add Apple as Supabase Auth provider
- Update sign-in page with "Sign in with Apple" button
- Handle Apple's name/email privacy relay

### Stretch Goals (Post-Festival)

- **Push notifications**: "Starting in 30 min" reminders for saved events (service worker + Push API)
- **Direct calendar sync**: Google Calendar / Apple Calendar API integration beyond `.ics`
- **Full-text search**: Use the existing `fts` tsvector column instead of `.ilike()` for better search quality
- **Trending/hot events**: Surface events gaining saves quickly (time-weighted save velocity)
- **Event scraper pipeline**: Playwright-based scraper for official schedule + Eventbrite/Lu.ma/Do512

---

## Design System

### Theme

Light background with dark navigation. No dark mode toggle.

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| Page background | `#EEEEF0` | Main content area |
| Card background | `#FFFFFF` | Cards, inputs |
| Primary green | `#0BA03D` | CTAs, links, active states |
| Accent yellow | `#F9CB0D` | Secondary actions, highlights |
| Destructive red | `#EF2D18` | Errors, delete actions |
| Nav background | `#0F1012` | Top nav (desktop), bottom nav (mobile), footer |
| Nav active | `#9BEAA8` | Active nav item, selected states |
| Nav foreground | `#EAEAEA` | Nav text, footer text |
| Border | `#D4D4D4` | Dividers, card borders |
| Muted foreground | `#6B6B6B` | Secondary text, timestamps |

### Category Colors

| Category | Color | Hex |
|----------|-------|-----|
| Tech | Blue | `#006CA8` |
| Music | Purple | `#9C99E8` |
| Film | Red | `#EF2D18` |
| Party | Yellow | `#F9CB0D` |
| Wellness | Green | `#0BA03D` |

Applied via inline `style={{ backgroundColor }}` on Badge components.

### Typography

- **Font**: "Founders Grotesk" declared, system-ui fallback active (font files not loaded)
- **Headings**: Semibold, uppercase for page titles and day headers
- **Body**: Regular weight
- **Rounded pills**: `rounded-[32px]` on badges, buttons, filter pills

### Navigation

- **Mobile**: Fixed bottom tab bar (Home, My Docket, People) — 80px height, dark background
- **Desktop**: Fixed top nav bar (logo left, links + avatar right) — 72px height, dark background
- **Active state**: `text-nav-active` (#9BEAA8) with bottom border (mobile) or text highlight (desktop)

### Component Patterns

- shadcn/ui foundation: Card, Badge, Button, Input, Textarea, Select, Switch, Skeleton, Sheet, Separator
- EventCard supports `variant` prop: `"default"` (full detail) or `"compact"` (hides description, vibe tags)
- Loading states use Skeleton components mimicking the layout they replace
- Empty states are centered text messages with muted foreground
- Toasts via sonner for success/error feedback
- Day headers: dark pill badges (`bg-nav-bg text-nav-foreground`) with event count

---

## RLS Policies

### `users`
- Anyone can view public profiles (`is_public = true`)
- Users can update their own row

### `events`
- Anyone can view approved events (`status = 'approved'`)
- Admins can view all events (checked against `ADMIN_EMAILS`)
- Authenticated users can insert pending events (`status = 'pending'`, `submitted_by = auth.uid()`)
- Admins can update any event
- Approved event owners can update their events

### `event_owners`
- Users can view their own claims
- Admins can view all claims
- Users can request ownership (`status = 'pending'`, `user_id = auth.uid()`)
- Admins can update claims (approve/reject)

### `saved_events`
- Anyone can view saves (needed for public docket + save counts)
- Users can insert/delete their own saves

---

## Database Functions

| Function | Type | Purpose |
|----------|------|---------|
| `toggle_save_event(p_event_id)` | RPC | Atomic save/unsave + denormalized save_count update |
| `handle_new_user()` | Trigger | Creates user profile row on `auth.users` INSERT with auto-generated `public_slug` |
| `update_updated_at()` | Trigger | Sets `updated_at` to `now()` on events UPDATE |

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key |
| `NEXT_PUBLIC_SITE_URL` | Site URL for metadataBase (OG images) |
| `ADMIN_EMAILS` | Comma-separated admin emails (server-only) |

---

## Architectural Decisions

10 documented decisions in `context/decisions.md`:

1. Light theme with dark navigation (no toggle)
2. Founders Grotesk with system-ui fallback
3. Bottom tab navigation on mobile (3 tabs: Home, My Docket, People)
4. SQL seed data for development (18 events)
5. Optimistic UI for save/bookmark via `toggle_save_event` RPC
6. Preferences stored directly on `users` table (not separate table)
7. Silent default filters with subtle "personalized feed" indicator
8. Consolidated My Docket + Profile into single page
9. URL params override stored preferences; `?all=true` bypasses entirely
10. Event ownership via junction table with claim flow (pending → approved → edit access)

---

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm lint         # ESLint
pnpm test         # Vitest watch mode
pnpm test:run     # Vitest single run (CI)
```

---

## Current Stats

- **10 routes** (home, sign-in, auth callback, onboarding, event detail, event edit, my docket, submit, public docket, people)
- **7 server action files** with 10+ distinct actions
- **40+ React components** (including shadcn/ui primitives)
- **4 database tables** with comprehensive RLS policies
- **3 Supabase functions** (1 RPC, 2 triggers)
- **27+ tests** passing
- **18 seed events** in database (all categories, March 7–15 2026)
