# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the App

```bash
npm install
npm run dev        # → http://localhost:3000
npm run build      # production build
npm run lint
```

No environment variables needed — this is a demo build (see Deployment).

## Tech Stack

- **Next.js 15 App Router** — all pages under `app/` (fully static; no API routes)
- **Tailwind CSS v4** — uses `@tailwindcss/postcss` plugin (not the v3 plugin)
- **Zod** — `CarePlan` schema/types in `lib/types/care-plan.ts`

The Python files (`main.py`, `requirements.txt`, `Procfile`) are legacy artifacts. The app runs entirely on Next.js.

## Architecture

### Data Flow

1. User pastes discharge text or captures an image on `/upload`
2. `demoExtract()` in `lib/demo.ts` shows progress steps and returns the sample `CarePlan`
3. `CarePlan` is saved to `localStorage` (key: `pdc-care-plan-v1`) via `lib/care-plan-storage.ts`
4. `/plan` (Today) renders the hero, warning signs and checklist; `/plan/medications`, `/plan/warnings`, `/plan/appointments`, `/plan/details` hold the rest
5. `/check-in` streams scripted replies from `demoReply()` based on the loaded plan

The `CarePlan` type in `lib/types/care-plan.ts` is the data contract every page renders from.

### Key Files

| File | Purpose |
|---|---|
| `lib/types/care-plan.ts` | All Zod schemas — change here first when modifying data shape |
| `lib/care-plan-storage.ts` | localStorage read/write; saving clears old reminder state |
| `lib/reminders.ts` | Browser Notification API scheduling; `getActiveReminder()` drives the med banner |
| `lib/demo.ts` | Demo mode: simulated extraction, scripted chat replies, fake SMS |
| `app/globals.css` | Design tokens (`@theme`), `.glass` / `.pill` / `.pressable` materials, a11y media queries |
| `components/ui.tsx` | Shared UI primitives (Button, Screen, Sheet, RowLink, ProgressBar, EmptyPlan…) — use these, not ad-hoc classes |
| `lib/use-care-plan.ts` | `useCarePlan()` hook — loads plan after mount with a `ready` flag |
| `fixtures/sample-care-plan.json` | The sample care plan every demo upload resolves to |

## Deployment

**Demo build — no API keys.** All AI and SMS behavior is simulated client-side in `lib/demo.ts`: uploads/photos/pasted text play progress steps then load `fixtures/sample-care-plan.json`, the Companion chat streams scripted replies grounded in the plan, and SMS reminders are faked. There are no API routes, so the whole app is static. The original Claude/Twilio routes live in git history (before the "demo mode" commit).

Deploys to Vercel as a standard Next.js app — no environment variables or `vercel.json` needed. The Railway/Python files are legacy and ignored.
