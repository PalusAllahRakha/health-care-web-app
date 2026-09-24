# HealthPortal

A modern healthcare patient portal demo built with **Next.js 16**, **React 19**, and **TypeScript**. It covers patient care workflows (appointments, labs, prescriptions, messaging), plus lightweight **provider** and **admin** role shells — all driven by client-side mock data (no backend required).

> App lives in [`frontend/`](./frontend/). Run all commands from that directory.

---

## Features

### Patient portal
| Area | What you can do |
|------|-----------------|
| **Dashboard** | Overview stats, upcoming visit, quick actions, activity feed, critical alerts |
| **Appointments** | List + calendar views, specialty filters, multi-step booking (specialty → doctor → date/time → confirm), in-person or video visits, appointment detail |
| **Doctors** | Browse and filter providers; start booking from a doctor card |
| **Prescriptions** | Medication cards, pharmacy selection, refill / renewal requests with simulated progress timeline and history |
| **Lab results** | Filter by status (normal / borderline / critical), detail view with trend charts (Recharts), export as **PDF**, **PNG**, or **WebP** |
| **Insurance** | Plan summary (deductible, copays), insurance card front/back upload UI |
| **Messages** | Thread list, conversation detail, compose new thread (toast stub; not persisted) |
| **Notifications** | Notification center and full page; unread count via Zustand |
| **Profile** | Role-aware profile fields, notification preferences, avatar upload + crop, change password |

### Provider portal
- **Patient queue** — table of patients (MRN, conditions, visits, status)
- **Profile** — provider profile settings

### Admin portal
- **Overview** — system metrics and storage cards
- **Users** — demo user list
- **Profile** — admin profile settings

### Shared UX
- Light / dark / system theme (`next-themes`)
- Global toasts (Sonner)
- Framer Motion transitions
- Healthcare consent banner (stored as `healthcare-consent-accepted`)
- Idle session timeout: **15 minutes**, warning **2 minutes** before logout
- Role switcher (demo shortcut to jump between patient / provider / admin after login)
- Responsive layout: sidebar + top bar + patient mobile bottom nav

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js **16.2.10** (App Router) |
| UI | React **19.2.4**, Tailwind CSS **v4**, Radix UI / shadcn-style primitives |
| Language | TypeScript **5** |
| Data / state | TanStack Query **5**, Zustand **5**, in-memory mock data |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| PDF / image export | jsPDF (+ canvas for PNG/WebP) |
| Motion | Framer Motion |
| Theming | next-themes |
| Icons | Lucide React |
| Toasts | Sonner |
| Avatar crop | react-easy-crop |
| Font | Outfit (`next/font`) |

**Note:** `next-intl` is listed as a dependency and `messages/en.json` exists, but i18n is **not wired** into the app yet.

There is **no API server, database, or real auth**. Sessions are mock and stored in `sessionStorage`.

---

## Prerequisites

- **Node.js** 20+ recommended (no `engines` field pinned)
- **npm** (lockfile: `frontend/package-lock.json`)

---

## Getting started

```bash
cd frontend
npm install
npm run dev
```

Open **[http://localhost:3001](http://localhost:3001)**.

### Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `npm run dev` | `next dev -p 3001` | Development server on port **3001** |
| `npm run build` | `next build` | Production build |
| `npm start` | `next start` | Serve production build (default port **3000**) |
| `npm run lint` | `eslint` | Lint the project |

No `.env` or environment variables are required.

### Turbopack root

`frontend/next.config.ts` sets `turbopack.root` to the `frontend/` directory. This prevents a parent-folder `package-lock.json` (e.g. on Desktop) from being treated as the workspace root, which can break the React Client Manifest on routes like `/mfa`.

---

## Demo credentials

| Field | Value |
|-------|-------|
| Email | `sarah.chen@email.com` |
| Password | `password` |
| MFA code | `123456` |

1. Open `/login` (form is pre-filled).
2. Sign in → you are sent to `/mfa`.
3. Enter `123456`.
4. You land on the **patient** dashboard (`/dashboard`).

### Switching roles (demo)

After MFA, use the **Role switcher** in the top bar (or mobile menu) to jump to:

| Role | Name | Email | Home |
|------|------|-------|------|
| Patient | Sarah Chen | `sarah.chen@email.com` | `/dashboard` |
| Provider | Dr. James Wilson | `j.wilson@healthcare.org` | `/provider/patients` |
| Admin | Alex Rivera | `a.rivera@healthcare.org` | `/admin/overview` |

Only the patient email/password works on the login form. Provider and admin users are reached via the role switcher (MFA already verified).

Change-password on profile still expects the demo current password: `password` (not persisted).

---

## Auth flow

1. Landing `/` — marketing page; authenticated users redirect to their role home.
2. Login → mock delay → `mfaRequired` → `/mfa`.
3. **Signup** (`/signup`) — tabs for Patient vs Provider; new accounts stored in `sessionStorage` (`hp-registered-accounts`), then MFA.
4. **Forgot password** (`/forgot-password`) — tabs for Patient vs Provider account type; demo reset for known emails.
5. MFA success → `isAuthenticated`; session key `hp-auth` in `sessionStorage`; profiles under `hp-profile-{userId}`.
6. `AuthGuard` protects shells:
   - no user → `/login`
   - user without MFA → `/mfa`
   - wrong role → that role’s home
7. Logout clears the session.

---

## Routes

### Public / auth
| Path | Description |
|------|-------------|
| `/` | Marketing landing |
| `/login` | Email + password |
| `/signup` | Tabbed **Patient** / **Provider** signup |
| `/forgot-password` | Tabbed **Patient** / **Provider** password reset |
| `/mfa` | One-time code |

### Patient (`(patient)` route group)
| Path | Description |
|------|-------------|
| `/dashboard` | Patient home |
| `/appointments` | Appointments list / calendar |
| `/appointments/[id]` | Appointment detail |
| `/doctors` | Find a doctor |
| `/prescriptions` | Meds & refills |
| `/lab-results` | Lab list |
| `/lab-results/[id]` | Lab detail + export |
| `/insurance` | Coverage & cards |
| `/messages` | Inbox |
| `/messages/[threadId]` | Thread |
| `/notifications` | All notifications |
| `/profile` | Account settings |

### Provider
| Path | Description |
|------|-------------|
| `/provider/patients` | Patient queue |
| `/provider/profile` | Profile |

### Admin
| Path | Description |
|------|-------------|
| `/admin/overview` | System overview |
| `/admin/users` | Users |
| `/admin/profile` | Profile |

---

## Project structure

```
health-care/
└── frontend/
    ├── next.config.ts          # Turbopack root pin
    ├── package.json
    ├── messages/en.json        # Unused i18n strings
    ├── public/
    └── src/
        ├── app/                # App Router
        │   ├── (auth)/         # login, mfa
        │   ├── (patient)/      # patient pages
        │   ├── (provider)/     # provider pages
        │   ├── (admin)/        # admin pages
        │   ├── layout.tsx
        │   ├── page.tsx        # landing
        │   ├── globals.css
        │   ├── robots.ts
        │   └── sitemap.ts
        ├── components/
        │   ├── ui/             # Radix / shadcn primitives
        │   ├── layout/         # shell, sidebar, topbar, nav, role switcher
        │   ├── booking/        # appointment booking modal & steps
        │   ├── prescriptions/  # refill / renewal UI
        │   ├── labs/           # lab report download
        │   ├── messages/       # messaging UI
        │   ├── profile/        # profile + avatar crop
        │   ├── motion/         # Framer Motion helpers
        │   ├── landing/
        │   └── shared/         # loaders, consent, session timeout, toaster
        ├── lib/
        │   ├── mock-data.ts    # Doctors, visits, labs, meds, users, etc.
        │   ├── api/queries.ts  # TanStack Query + mockFetch delays
        │   ├── auth/roles.ts   # Role home / profile paths
        │   ├── motion.ts
        │   ├── validators/     # Zod schemas
        │   └── ...
        ├── providers/          # Theme, React Query, Auth, Toaster
        ├── stores/             # booking, refill, notifications (Zustand)
        ├── styles/tokens.css   # Brand / surface / status tokens
        └── types/
```

### Architecture notes
- **Providers:** `ThemeProvider` → `QueryClientProvider` → `AuthProvider` → app + Sonner toaster. Query defaults: `staleTime` 60s, `refetchOnWindowFocus: false`.
- **Mock API:** hooks in `lib/api/queries.ts` wrap delayed fetches over `lib/mock-data.ts`.
- **Zustand stores:** `booking-store`, `refill-store`, `notification-store`.
- **Design tokens:** teal brand (`#16766b`), light/dark surfaces, radii, shadows, motion easing in `styles/tokens.css`.

---

## Design system

- **Brand:** HealthPortal, Outfit sans, teal primary
- **Theme:** CSS variables + Tailwind v4 `@custom-variant dark`
- **UI kit:** Shared `components/ui/*` (button, dialog, select, tabs, etc.)
- **Motion:** Shared variants in `lib/motion.ts` and `components/motion/*`

---

## Important behaviors

| Behavior | Detail |
|----------|--------|
| Booking | Multi-step modal; success via toast (no success modal) |
| Lab export | Dropdown: PDF / PNG / WebP |
| Refills | Simulated status progression after request |
| Notifications | Deep-link to related pages where applicable |
| Auth hydration | Loading overlay until session restore finishes (avoids UI flash) |
| Consent | First visit banner; acceptance stored in localStorage |
| Session idle | 15 min idle → logout; warning dialog at 13 min |

---

## Limitations (demo)

- No real backend, HIPAA compliance, or encryption of PHI
- Auth is hard-coded for one login pair; MFA is a fixed code
- Messages compose and some mutations are stubs / in-memory only
- `next-intl` / `messages/en.json` not integrated
- Production `npm start` uses port **3000** unless you pass `-p`

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Port already in use | Kill the process on 3001, or change the port in `package.json` `dev` script |
| MFA / Client Manifest errors | Ensure you run from `frontend/` and keep `turbopack.root` in `next.config.ts` |
| Wrong lockfile / workspace root | Do not run Next from a parent folder that has another `package-lock.json` |
| Theme flash | Theme is handled by `next-themes` in the root providers |

---

## License

Private demo project (`"private": true` in `package.json`). Not licensed for production clinical use.
