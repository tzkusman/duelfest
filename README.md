# DuelFit — Build Plan

> **DuelFit** is a mobile-first competitive fitness app. Friend A creates a duel ("do 10 pushups in 10 minutes for 100 coins"), shares a link with friend B, and whoever completes the task first with a valid video proof wins the coin pot. Built on Next.js 14 + Supabase, installable as a PWA.

---

## Quick Start — How to Run

> Want to run it locally? The **3-command version** is at the top; the detailed version is below.

### ⚡ TL;DR (3 commands)

```bash
cd E:\duelfest
npm install
npm run dev          # → http://localhost:3000
```

Then open **http://localhost:3000** in your browser. The dev server boots with placeholder Supabase keys, so you can browse the full UI (Home, Arena, Ranks, Profile, Create) but auth-gated actions will fail until you configure Supabase (see step 4 below).

---

### 📋 Prerequisites

| Tool | Version | Check |
|---|---|---|
| Node.js | 18.17+ (LTS recommended) | `node --version` |
| npm | 9+ (bundled with Node) | `npm --version` |
| Git | any recent | `git --version` |
| Browser | Chrome / Edge / Firefox / Safari (latest) | — |

> **Optional but recommended for full functionality:** a free [Supabase](https://supabase.com) project (for auth + DB + storage).

---

### 🚀 Step-by-step setup

#### 1. Clone & install
```bash
git clone <your-repo-url> duelfest
cd duelfest
npm install
```

#### 2. Configure environment
```bash
cp .env.local.example .env.local
```
Open `.env.local` in your editor and fill in the values (see [§ Environment Variables](#-environment-variables) below).

> **For just browsing the UI** without real Supabase: leave the placeholder values — the dev server boots fine, only auth-gated actions will error.

#### 3. Start the dev server
```bash
npm run dev
```
You should see:
```
▲ Next.js 14.2.15
- Local:        http://localhost:3000
✓ Ready in ~2s
```

#### 4. (Optional) Set up Supabase for real auth + data
1. Create a free project at [supabase.com/dashboard](https://supabase.com/dashboard)
2. In **Project Settings → API**, copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ never expose to client)
3. In **Authentication → URL Configuration**, add to **Redirect URLs**:
   ```
   http://localhost:3000/auth/callback
   ```
4. Restart `npm run dev` after updating `.env.local`.

#### 5. (Coming in M1) Run database migrations
```bash
# Once M1 lands, you'll be able to run:
supabase db push
# OR apply supabase/migrations/*.sql manually via the Supabase SQL editor
```

---

### 💻 Development commands

| Command | What it does |
|---|---|
| `npm run dev` | Start Next.js dev server with HMR at `http://localhost:3000` |
| `npm run build` | Production build (outputs to `.next/`) |
| `npm run start` | Serve the production build (run `build` first) |
| `npm run lint` | Run ESLint on the whole project |
| `npm run typecheck` | Run `tsc --noEmit` to type-check without emitting |

**Stopping the dev server:** `Ctrl+C` in the terminal, or on Windows from another shell:
```powershell
Get-Process -Name "node" | Stop-Process -Force
```

---

### 🔧 Today's local fixes (2026-06-07)

- **TypeScript fixes:** resolved implicit-`any` errors in `lib/supabase/middleware.ts` and `lib/supabase/server.ts` so `npm run typecheck` passes.
- **Improved auth debugging:** added logging to the auth callback and login flow to surface failures during the magic-link exchange:
  - `app/auth/callback/route.ts` — server-side exchange error logging
  - `app/(auth)/login/page.tsx` — client console logs around `/api/auth/login` and `supabase.auth.setSession`
- **Service worker in dev:** disabled automatic service-worker registration in dev to avoid stale cached bundles causing an older build to run in other browsers (`app/layout.tsx` now registers the worker only when `NODE_ENV === 'production'`). If you previously had a service worker registered, open DevTools → Application → Service Workers and unregister it, or test in an Incognito window.
- **Dev server restarted:** the dev server was restarted during debugging (it may run on a different port if 3000 is in use — check the terminal for the current URL).


### 🌐 Environment Variables

All variables live in `.env.local` (gitignored). See `.env.local.example` for the full template.

| Variable | Required? | Used by | Notes |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes (for auth) | Client + server | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes (for auth) | Client + server | The `anon` public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes (for admin) | Server only | ⚠️ Never prefix with `NEXT_PUBLIC_` — bypasses RLS |
| `NEXT_PUBLIC_APP_URL` | Yes | Server | Used for share-link generation. `http://localhost:3000` in dev |
| `STRIPE_SECRET_KEY` | Phase 2 | Server | Real-money payouts |
| `STRIPE_WEBHOOK_SECRET` | Phase 2 | Server | Stripe webhook verification |
| `RAZORPAY_KEY_ID` | Phase 2 (IN) | Server | Real-money payouts (India) |
| `RAZORPAY_KEY_SECRET` | Phase 2 (IN) | Server | Real-money payouts (India) |

> Variables prefixed with `NEXT_PUBLIC_` are inlined into the client bundle at build time. Never put secrets there.

---

### 📱 PWA testing

The app is a Progressive Web App. To test install behaviour:

**On desktop (Chrome/Edge):**
1. Open `http://localhost:3000`
2. Look for the **install icon** (⊕) in the URL bar
3. Click → "Install DuelFit"
4. Opens as a standalone window (no browser chrome)

**On mobile (iOS Safari / Android Chrome):**
1. Open the URL on your phone (use your machine's LAN IP, e.g. `http://192.168.1.x:3000`)
2. iOS: tap **Share → Add to Home Screen**
3. Android Chrome: tap **Menu → Install app**
4. Launches fullscreen with the splash screen

**Verify PWA basics in DevTools:**
- F12 → **Application** tab → check:
  - **Manifest** loads `/manifest.webmanifest` with no errors
  - **Service Workers** shows `sw.js` registered
  - **Storage** shows the cache (offline shell)

---

### 🗂️ Project structure (key files)

```
duelfest/
├── app/                            # Next.js App Router
│   ├── page.tsx                    # Home (3 nav buttons + stats)
│   ├── (auth)/login/page.tsx       # Magic-link sign-in
│   ├── (app)/                      # Auth-gated app shell (browse open)
│   │   ├── layout.tsx              # Wraps with MobileShell
│   │   ├── home/page.tsx
│   │   ├── arena/page.tsx
│   │   ├── leaderboard/page.tsx
│   │   ├── profile/page.tsx
│   │   └── create/page.tsx
│   └── d/[token]/page.tsx          # (M3) Share-link landing
├── components/mobile/              # Mobile shell + nav primitives
│   ├── MobileShell.tsx             # Phone-frame + top bar + bottom nav
│   ├── ActionButton.tsx            # The 3 primary nav buttons
│   ├── LinkInput.tsx               # Paste-a-link input
│   └── StatTile.tsx
├── lib/
│   └── supabase/                   # Supabase client helpers (browser, server, middleware)
├── public/
│   ├── manifest.webmanifest        # PWA manifest
│   ├── sw.js                       # Service worker (offline shell)
│   └── icons/                      # App icons (SVG, replace with PNG for production)
├── tailwind.config.ts              # DuelFit design tokens (Electric Lime, Cyber Purple, etc.)
├── next.config.mjs                 # Image domains, server actions body limit
├── tsconfig.json
├── opencode.json                   # LSP + Stitch MCP config
├── .env.local.example              # Template for environment variables
└── package.json
```

---

### 🛠️ Troubleshooting

| Issue | Fix |
|---|---|
| `Error: supabaseUrl is required` on `/login` submit | Fill in real `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` |
| Port 3000 already in use | `netstat -ano \| findstr :3000` then `taskkill /PID <pid> /F`, or run `PORT=3001 npm run dev` |
| Tailwind classes not applying | Restart `npm run dev` after editing `tailwind.config.ts` |
| TypeScript errors after pulling new code | `rm -rf .next && npm run dev` |
| Service worker not registering | Ensure you're on `http://localhost:3000` (not `127.0.0.1`); PWA requires localhost or HTTPS |
| "Invalid `next.config.mjs`" on build | Make sure you have Node 18.17+; run `node --version` |

---

## 1. Product Vision

| Aspect | Decision |
|---|---|
| **Name** | DuelFit |
| **Platform** | Mobile PWA (installable to home screen) |
| **Core loop** | Create duel → Share link → Both perform → Submit video → Opponent verifies → Winner paid |
| **Tone** | Aggressive Premium — gamified sport × gaming console |
| **Theme** | Dark mode only. Electric Lime `#DFFF00`, Cyber Purple `#BC13FE`, Victory Gold `#FFD700`, Obsidian `#131313` |
| **Auth** | Magic link (Supabase Auth) — auto-creates account on first link tap |
| **Video verification** | Opponent reviews & confirms; auto-approve after 24h no-response |
| **Coin economy** | Real-money wagers (Phase 2) — see §10 risk flag |
| **Backend** | Supabase (Postgres + Auth + Storage + Realtime) |

---

## 2. Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14+ (App Router) + TypeScript |
| Mobile | PWA (manifest, service worker, install prompt) |
| UI | Tailwind + the existing DuelFit design tokens (Tailwind config carries over verbatim) |
| State | Zustand (client) + React Query (server cache) |
| Backend | Next.js API routes + Supabase |
| DB | Supabase Postgres (with RLS) |
| Auth | Supabase Auth (Magic Link / Email OTP) |
| Storage | Supabase Storage (videos bucket, signed URLs) |
| Realtime | Supabase Realtime (live tracker telemetry) |
| Payments (Phase 2) | Stripe Connect (global) or Razorpay Route (India) |
| Camera | `getUserMedia` + MediaRecorder API (no extra deps) |
| Deploy | Vercel (frontend) + Supabase cloud (data) |

---

## 3. Repo Layout

```
duelfest/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx                  # landing / hero
│   │   └── d/[duelId]/page.tsx       # shared link landing → auth → duel
│   ├── (auth)/
│   │   ├── login/page.tsx            # magic link form
│   │   └── callback/route.ts         # Supabase OAuth/OTP callback
│   ├── (app)/
│   │   ├── layout.tsx                # auth guard + bottom nav
│   │   ├── home/page.tsx             # Dashboard
│   │   ├── arena/page.tsx            # Duel Arena
│   │   ├── create/page.tsx           # Create Duel (NEW)
│   │   ├── duel/[id]/
│   │   │   ├── page.tsx              # Duel detail / lobby (NEW)
│   │   │   ├── live/page.tsx         # Active Duel Tracker
│   │   │   ├── proof/page.tsx        # Record & submit video (NEW)
│   │   │   ├── review/page.tsx       # Opponent review verdict (NEW)
│   │   │   └── result/page.tsx       # Duel Result
│   │   ├── leaderboard/page.tsx      # NEW
│   │   ├── profile/
│   │   │   ├── page.tsx              # own profile
│   │   │   └── [userId]/page.tsx     # opponent profile
│   │   ├── wallet/
│   │   │   ├── page.tsx              # balance + ledger
│   │   │   ├── deposit/page.tsx      # Phase 2
│   │   │   └── withdraw/page.tsx     # Phase 2
│   │   ├── notifications/page.tsx    # NEW
│   │   └── settings/page.tsx         # NEW
│   └── api/
│       ├── duels/route.ts            # POST create, GET list
│       ├── duels/[id]/route.ts       # GET, PATCH (accept/decline)
│       ├── duels/[id]/start/route.ts
│       ├── duels/[id]/proof/route.ts # upload video URL
│       ├── duels/[id]/verdict/route.ts
│       ├── duels/[id]/events/route.ts # telemetry (steps, pace)
│       ├── wallet/balance/route.ts
│       ├── wallet/deposit/route.ts   # Phase 2
│       ├── wallet/payout/route.ts    # Phase 2
│       └── webhooks/stripe/route.ts  # Phase 2
├── components/
│   ├── ui/                           # Button, Card, Chip, Progress, Ring, BottomNav
│   ├── duel/                         # DuelCard, DuelComparison, ProofRecorder
│   ├── feed/                         # LiveTelemetry, ActivityItem
│   └── pwa/                          # InstallPrompt, UpdateToast
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # browser
│   │   ├── server.ts                 # server components
│   │   └── middleware.ts             # session refresh
│   ├── store/                        # zustand stores
│   ├── hooks/                        # useDuel, useWallet, useRealtime
│   └── utils/                        # time, format, share-link
├── supabase/
│   └── migrations/                   # SQL files (schema + RLS)
├── public/
│   ├── manifest.webmanifest
│   ├── sw.js
│   └── icons/
├── tailwind.config.ts                # existing DuelFit tokens
├── next.config.mjs
└── package.json
```

---

## 4. Data Model (Supabase)

```sql
-- Users (extends Supabase auth.users)
profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id),
  username        TEXT UNIQUE,
  display_name    TEXT,
  avatar_url      TEXT,
  country         TEXT,
  kyc_status      TEXT DEFAULT 'none',     -- none | pending | verified
  fitness_level   TEXT,                    -- beginner | intermediate | advanced
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Wallets (one per user; cents = smallest currency unit)
wallets (
  user_id         UUID PRIMARY KEY REFERENCES profiles(id),
  balance_cents   BIGINT NOT NULL DEFAULT 0,
  locked_cents    BIGINT NOT NULL DEFAULT 0,   -- escrowed in active duels
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Append-only ledger
wallet_ledger (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES profiles(id),
  type            TEXT NOT NULL,            -- deposit | withdraw | escrow_hold | escrow_release | payout | fee
  amount_cents    BIGINT NOT NULL,         -- positive = credit, negative = debit
  ref_duel_id     UUID REFERENCES duels(id),
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Duels
duels (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id        UUID REFERENCES profiles(id),
  opponent_id       UUID REFERENCES profiles(id),     -- NULL until accepted
  status            TEXT NOT NULL DEFAULT 'pending',  -- pending | accepted | declined | live | submitted | review | settled | cancelled
  task_title        TEXT NOT NULL,                    -- "10 Pushups in 10 min"
  task_description  TEXT,
  task_metric       TEXT NOT NULL,                    -- reps | duration | distance | steps | calories | custom
  target_value      INT,                              -- 10 reps, 5000 metres, etc.
  duration_seconds  INT NOT NULL,
  wager_cents       BIGINT NOT NULL,
  prize_pool_cents  BIGINT NOT NULL,                  -- 2 × wager − platform fee
  platform_fee_cps  INT DEFAULT 500,                  -- 5% in basis points
  share_token       TEXT UNIQUE NOT NULL,             -- for /d/[token] deep link
  proof_method      TEXT DEFAULT 'video_self',
  is_featured       BOOLEAN DEFAULT FALSE,
  created_at        TIMESTAMPTZ DEFAULT now(),
  started_at        TIMESTAMPTZ,
  ends_at           TIMESTAMPTZ,
  settled_at        TIMESTAMPTZ
);

-- Submissions
submissions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  duel_id           UUID REFERENCES duels(id),
  user_id           UUID REFERENCES profiles(id),
  video_path        TEXT NOT NULL,                    -- Supabase Storage path
  video_duration_s  INT,
  submitted_at      TIMESTAMPTZ DEFAULT now(),
  verdict           TEXT DEFAULT 'pending',           -- pending | approved | rejected
  verdict_by        UUID REFERENCES profiles(id),
  verdict_at        TIMESTAMPTZ,
  notes             TEXT
);

-- Live events (for Active Tracker)
duel_events (
  id          BIGSERIAL PRIMARY KEY,
  duel_id     UUID REFERENCES duels(id),
  user_id     UUID REFERENCES profiles(id),
  kind        TEXT NOT NULL,              -- step | rep | distance | heart_rate | milestone
  value_num   NUMERIC,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Notifications
notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES profiles(id),
  kind        TEXT NOT NULL,              -- duel_invite | duel_accepted | verdict | payout | system
  duel_id     UUID REFERENCES duels(id),
  payload     JSONB,
  read_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Leaderboard view
CREATE VIEW leaderboard_weekly AS
  SELECT user_id, COUNT(*) AS wins, SUM(prize_pool_cents) AS earnings
  FROM duels
  WHERE status = 'settled' AND settled_at > now() - interval '7 days'
  GROUP BY user_id;
```

### RLS Rules (summary)

- `profiles` — public read; update only own row.
- `wallets` — read/write only own row.
- `wallet_ledger` — read only own; insert only via service role.
- `duels` — read public if `status='pending'` (for share-token resolve) else creator + opponent only; write only via API routes.
- `submissions` — read only creator + opponent of that duel.
- `duel_events` — read only participants; insert only own.
- `notifications` — read/update only own.

---

## 5. The 14 Screens

| # | Route | Title | Type | Notes |
|---|---|---|---|---|
| 1 | `/` | Landing | Static | Public marketing / install prompt |
| 2 | `/login` | Magic link | Static→Dynamic | Email-only auth |
| 3 | `/d/[token]` | Share-link landing | Dynamic | Looks up duel, prompts auth, then accepts |
| 4 | `/home` | Dashboard | Enhance existing | Live wallet, streak, recent duels, weekend banner |
| 5 | `/arena` | Duel Arena | Enhance existing | Tabs: Live · Open · Mine; pull from `duels` table |
| 6 | `/create` | **Create Duel** | **NEW (core)** | Task template + custom + duration + wager + share |
| 7 | `/duel/[id]` | **Duel Lobby** | **NEW** | Pre-start: both confirmed, "Start Now" countdown |
| 8 | `/duel/[id]/live` | Active Tracker | Enhance existing | Realtime via Supabase channel; emits step/rep events |
| 9 | `/duel/[id]/proof` | **Proof Submit** | **NEW** | `getUserMedia` + MediaRecorder; upload to Storage |
| 10 | `/duel/[id]/review` | **Opponent Verdict** | **NEW** | Watch opponent's video, Approve/Reject |
| 11 | `/duel/[id]/result` | Result | Enhance existing | Real payout animation, share to social |
| 12 | `/profile` & `/profile/[id]` | Profile | **NEW** | Stats, level, badge, recent form |
| 13 | `/leaderboard` | Leaderboard | **NEW** | Weekly / All-time tabs |
| 14 | `/wallet` (+ deposit/withdraw) | Wallet | **NEW** | Phase 2 = real money; Phase 1 = ledger only |
| 15 | `/notifications` | Inbox | **NEW** | Duel invites, verdicts, payouts |
| 16 | `/settings` | Settings | **NEW** | KYC entry, logout, legal |

---

## 6. Core Flows

### Flow A — Create → Share → Accept

1. User A taps **Create Duel** → picks a template ("10 pushups in 10 min" pre-filled) or custom (task, metric, target, duration, wager) → selects opponent via username / contact / "share link" → submits.
2. Server creates `duels` row (status=`pending`, unique `share_token`), **escrows A's wager** by moving cents from `wallets.balance_cents` to `wallets.locked_cents` and inserts matching `wallet_ledger` row, returns share URL `/d/{token}`.
3. A's screen shows native share sheet (Web Share API) with copy-link fallback.
4. User B taps link → lands on `/d/[token]`. Not logged in → email magic link → returns → duel detail shows **Accept Duel**. On accept: B's wager is escrowed similarly, `duels.status='accepted'`, `opponent_id` set, `share_token` invalidated.
5. Both tap **Start** (or auto-start at scheduled time) → status=`live`, `started_at` and `ends_at` set.

### Flow B — Live → Submit Proof

1. **Active Tracker** subscribes to Supabase Realtime channel `duel:{id}`.
2. Both phones emit events: manual counter UI in v1, auto-detect via `DeviceMotion` (steps) / `Geolocation` (distance) in v2.
3. When timer hits 0 OR a user hits target → status=`submitted`, redirect to **Proof Submit**.
4. Camera opens (`getUserMedia` → `MediaRecorder` → Blob), 30s max, upload to `proofs/{duel_id}/{user_id}.webm`, submit.
5. First valid submission enters `review`; opponent is sent a notification.

### Flow C — Verdict → Settlement

1. Opponent opens **Review** screen, plays the video, taps **Approve** (or **Reject** with reason).
2. On approve → status=`settled`, **payout to winner** by inserting `wallet_ledger` row (`payout`, +prize_pool_cents) and decrementing `wallets.locked_cents`. Platform fee retained.
3. On reject → 24h window for resubmit, then auto-approve via cron. Dispute path = support ticket.
4. Result screen shows payout animation, share button, "Rematch" CTA (pre-fills Create with same parameters).

---

## 7. Make-Everything-Work Checklist (Static → Dynamic)

| Static element in template | Replaced by |
|---|---|
| `1,250 🪙` header | `<WalletPill />` → `useWallet()` from `wallets` table |
| Coin balance card | `SELECT balance_cents FROM wallets WHERE user_id = auth.uid()` |
| Daily Goal ring | `useDailyGoal()` hook (manual log v1, HealthKit/Google Fit v2) |
| Win-rate / streak / HR | Aggregated from `duels` + `submissions` via SQL views |
| Recent Duels list | `duels` filtered by `user_id IN (auth.uid())` |
| "Weekend Warrior" banner | `duels` where `is_featured = true` |
| Arena cards | `duels WHERE status IN ('pending','live')` paginated |
| Active Tracker telemetry | Supabase Realtime channel `duel:{id}` |
| Timer countdown | Server-set `ends_at`; client recomputes from `Date.now()` |
| "Join Duel" / "Rematch" buttons | `POST /api/duels` and `POST /api/duels/[id]/rematch` |
| Bottom nav | Persists active route via `usePathname()` |
| Mock step jitter JS | Real event emit on user action |
| Victory particle animation | Triggered only on real `status='settled'` event |

---

## 8. Design System (carry-over from Stitch)

- **Palette:** Electric Lime `#DFFF00` · Cyber Purple `#BC13FE` · Victory Gold `#FFD700` · Obsidian `#131313`
- **Typography:** Sora (headlines) · Hanken Grotesk (body) · JetBrains Mono (labels)
- **Surfaces:** 5-level tiered dark grey elevations (`#0E` → `#353534`)
- **Effects:** Glassmorphism (rgba white 5% + 16-24px blur), inner-glow borders, outer-glow on coins/CTAs
- **Radius:** Speed-rounded 0.5/0.75/1rem (no full pills)
- **Components:** Glass cards, gradient progress bars, coin chips, status chips, glow buttons
- **Icons:** Material Symbols Outlined

Full Tailwind token config is preserved in `tailwind.config.ts` (extracted from existing Stitch HTML).

---

## 9. Milestones

| Phase | Scope | Est. effort | Status |
|---|---|---|---|
| **M0** | Scaffold: Next.js + Tailwind tokens + Supabase + auth (magic link) + PWA manifest + mobile shell + 5 stub pages | 1 day | ✅ **Done** |
| **M1** | DB schema + RLS + profiles + wallets (virtual cents) + ledger | 1 day | ⏳ Next |
| **M2** | Migrate 4 existing screens to dynamic (Dashboard, Arena, Tracker, Result) | 2 days | ⏳ |
| **M3** | Create Duel + share link + Lobby + auto-escrow | 2 days | ⏳ |
| **M4** | Proof recording + upload + opponent review + settlement | 2 days | ⏳ |
| **M5** | Profile + Leaderboard + Notifications + Settings + Wallet (ledger only) | 1 day | ⏳ |
| **M6** | PWA install prompt + offline shell + push notifications | 1 day | ⏳ |
| **M7** | Phase 2: Stripe/Razorpay + KYC + real payouts | 3-4 days | ⏳ |
| **M8** | Polish: motion, haptics, sound, empty states, error boundaries | 1 day | ⏳ |

**Total: ~12 working days for Phase 1, +4 for real money.**

### M0 — What landed

- ✅ Next.js 14 App Router + TypeScript strict mode
- ✅ Tailwind config with full DuelFit design tokens (electric lime / cyber purple / victory gold / obsidian)
- ✅ Supabase helpers (`lib/supabase/{client,server,middleware}.ts`)
- ✅ Middleware for Supabase session refresh
- ✅ Magic-link login form + `/auth/callback` route
- ✅ PWA manifest + service worker (offline shell)
- ✅ **Mobile shell** (`MobileShell.tsx`) — phone-frame layout, sticky top bar, 4-tab bottom nav
- ✅ **3 primary action buttons** (Create / Duel / Win) on the home page — real navigation
- ✅ **Duel-link paste input** (accepts full URL, `/d/{token}`, or bare token)
- ✅ 5 stub pages: `/` (home), `/arena`, `/leaderboard`, `/profile`, `/create`
- ✅ Sign-out wired in top bar
- ✅ `opencode.json` with LSP (typescript, eslint, tailwindcss, go) + Stitch MCP

---

## 10. Real-Money Wagering — Risk Flag

> Real-money wagering apps require: a licensed payments processor, KYC for every user, escrow logic, a gambling/skill-game legal opinion per jurisdiction, responsible-gaming limits, and tax/audit trails. **Strongly recommended split:**

### Recommended path

- **Phase 1 ships with virtual coins** — all UI/UX complete, escrow + ledger + payouts fully working in `wallet_ledger` with fake cents. Lets us validate product-market fit without regulatory overhead.
- **Phase 2 layers real money** on top, one payment provider at a time per market (Stripe Connect for global, Razorpay Route for India), with a separate KYC step before the user can deposit.

If launching real money on day 1 is non-negotiable, expect +2 weeks and a requirement that you set up a Stripe/Razorpay business account and confirm legal eligibility in your target market(s) before launch.

---

## 11. Open Questions (decide before coding starts)

> Please answer the five questions below so M0 (scaffold) can begin without rework.

### 1. Payments provider preference?
- [ ] **Stripe (global)** — best for international audience, longer KYC for India
- [ ] **Razorpay (India-first)** — instant UPI/cards/netbanking, lower fees in INR
- [ ] **Both from day 1** — abstracted behind a `PaymentProvider` interface

### 2. Default currency?
- [ ] **INR only** (₹) — single-currency MVP, faster to ship
- [ ] **USD only** ($) — single-currency MVP
- [ ] **Multi-currency from KYC country** — supports INR, USD, EUR, GBP, etc. with per-user wallet

### 3. Duel templates library — should I seed the Create screen with a built-in catalog or let users define 100% custom tasks?
- [ ] **Built-in catalog** (recommended) — pre-seeded templates like:
  - 10 Pushups in 10 min
  - 5 km City Run
  - 100 Burpees
  - 2 min Plank Hold
  - 50 Squats
  - 1 km Row / Swim
  - 30-day Streak Challenge
- [ ] **100% custom from the start** — user types task name, picks metric, sets target

### 4. Branding on landing page
- [ ] **Keep "DuelFit" as the only brand mark** for now (text wordmark)
- [ ] **I have a logo** — I'll provide SVG/PNG assets
- [ ] **Generate a logo** — design a wordmark in the same Sora italic-uppercase style

### 5. Do you want me to start with M0 (scaffold) immediately on approval, or rework this plan first?
- [ ] **Start M0 now** — scaffold Next.js + Tailwind + Supabase + magic-link auth + PWA manifest
- [ ] **Rework the plan first** — adjust scope, screens, or flows before any code is written

---

## 12. What Already Exists (from Stitch)

Three identical Stitch projects (each holding the same 4 screens, created within seconds of each other — duplicates to be deleted):

| Project ID | Title |
|---|---|
| `6827764327996097973` | Remix of Dashboard (DuelFit) |
| `11990255239658492155` | Remix of Dashboard (DuelFit) |
| `13662961701605549718` | Remix of Dashboard (DuelFit) |

Screens within (one per project, identical):

1. **Dashboard** — home / wallet / stats / recent duels
2. **Duel Arena** — browse & join live challenges
3. **Active Duel Tracker** — live 1v1 mid-match telemetry
4. **Duel Result** — post-match victory screen

These four HTML screens are the visual baseline. The build plan converts them from static Tailwind prototypes into a fully wired, real-time, multi-user Next.js application.

---

## 13. Definition of Done (for Phase 1 launch)

- [ ] User can sign in via magic link on first try
- [ ] User can create a duel with custom task, duration, wager
- [ ] Share link works end-to-end (creator → friend → accept)
- [ ] Both phones see live telemetry updating in real time
- [ ] Both phones can record & submit a 30s proof video
- [ ] Opponent can approve/reject the proof
- [ ] Winner receives payout in wallet ledger
- [ ] Dashboard, Arena, Profile, Leaderboard, Wallet, Notifications, Settings all render real data
- [ ] App installs to home screen (PWA)
- [ ] Works offline for read-only screens (degraded gracefully)
- [ ] All 14+ screens pass a basic mobile-audit (Lighthouse PWA score ≥ 90)

### Progress so far

**M0 (Scaffold) — done:**
- [x] Next.js + Tailwind + Supabase + magic-link auth + PWA manifest
- [x] Mobile shell + 3 nav buttons + 5 stub pages render correctly
- [x] Dev server boots in <2s, all routes return 200

**Remaining for Phase 1:** M1 → M8 (see milestones table).
