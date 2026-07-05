# NSHM Global Pathways - Clickable MVP

High-fidelity UI prototype for the International Counseling Office at Trường Ngôi Sao Hoàng Mai. The prototype follows the supplied SRS and SOP.HT-03/04/05, with realistic Vietnamese mock data and no production backend.

## Technology

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- Lucide icons
- In-memory mock data: 36 students and 18 public posts

## NSHM brand system

The interface follows `NSHM - BRAND GUIDELINE (02042026)`:

- Primary: NSHM Crimson `#D21235` and NSHM Antique/Vanilla `#FFEBD6`
- Secondary: Egyptian Blue `#23328C`, Emerald `#2DA037`, Orange `#FFAD00`
- Typography: Lexend for functional UI and Literata for editorial/display headings
- Official Khuê Văn Các-inspired mark, core-value patterns, and `Brilliance Within` positioning
- No gradients; branded surfaces use solid color, contrast, pattern, and clear content hierarchy

## Run locally

Requirements: Node.js 20.9+ and npm 10+.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

`NEXT_PUBLIC_SITE_URL` is optional. For local development, it can be left unset or set to the final public domain when validating metadata.

Production check:

```bash
npm run lint
npm run build
npm run start
```

The project retains its mock data in `lib/data.ts`; no database or external service is required.

## Safe database pilot

The application supports two requested data modes:

```env
NEXT_PUBLIC_DATA_MODE=mock
# or
NEXT_PUBLIC_DATA_MODE=supabase
```

Missing or invalid values always resolve to `mock`. Supabase mode requires `NEXT_PUBLIC_SUPABASE_URL` plus either `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`; if configuration is missing or the fake-student query fails, `/demo` falls back to the mock repository.

The current public, portal, and CMS demo screens remain fixture-backed through `lib/data-access/demo-data.ts`, so enabling the isolated pilot cannot partially replace their data. Follow [DATABASE_SETUP.md](DATABASE_SETUP.md) to create and test the Supabase pilot locally. Do not add Supabase variables to Vercel Production yet.

## Deploy to Vercel

### Vercel Dashboard

1. Push this project to GitHub, GitLab, or Bitbucket.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Keep the detected framework preset as **Next.js**.
4. Leave the root directory as the repository root.
5. The repository's `vercel.json` uses `pnpm install --frozen-lockfile` and `npm run build`; no dashboard command overrides are required.
6. Optionally add `NEXT_PUBLIC_SITE_URL` with the production URL. If omitted, the app uses Vercel's `VERCEL_PROJECT_PRODUCTION_URL` automatically.
7. Deploy.

### Vercel CLI

```bash
npm install -g vercel
vercel
vercel --prod
```

All public, counselor, student, and CMS demo routes are part of the same Next.js application and deploy together. `.vercelignore` excludes the source PDFs and document-rendering artifacts that are not needed at runtime.

## Main routes

| Screen | Route |
| --- | --- |
| Public website | `/` |
| Demo hub | `/demo` |
| Public article | `/bai-viet/[slug]` |
| Consultation CTA/form | `/dang-ky-tu-van` |
| Counselor Workbench | `/portal` |
| Consultation Registration Queue | `/portal/registrations` |
| Student 360 | `/portal/students/NSHM260101` |
| Evidence Vault | `/portal/evidence` |
| University Application Pipeline | `/portal/applications` |
| Documents, Essays & Checklist | `/portal/documents` |
| CMS/Admin editor | `/cms` |

## Clickable flows

- Filter and open a student from the Counselor Workbench.
- Create a consultation registration; enter `NSHM260101` to see duplicate detection and profile linking.
- Schedule a consultation from the queue.
- Review and verify evidence using Evidence Level A/B/C/D.
- Move a university application to the next pipeline stage.
- Open an essay and inspect version history from v1 to v4.
- Read a public article and use the `Đăng ký tư vấn du học` CTA.
- Complete the three-step public registration form.
- Edit, preview, save, and publish a CMS article.

## Project structure

```text
app/
  page.tsx                       Public website
  demo/page.tsx                  Demo hub and data-mode pilot status
  bai-viet/[slug]/page.tsx       Article detail
  dang-ky-tu-van/page.tsx        Public consultation form
  portal/                        Six counselor-facing screens
  cms/page.tsx                   CMS editor
components/
  brand.tsx                      Brand layout, hero, pattern, table primitives
  PortalShell.tsx                Internal sidebar/header shell
  PublicSite.tsx                 Public header/footer
  ui.tsx                         Shared cards, badges, filters, modal, toast
lib/data.ts                      Original mock fixtures
lib/data-access/                 Repository contract and mock/Supabase adapters
types/database.ts                Internal operations table types
SUPABASE_SCHEMA.sql              Pilot schema, indexes, triggers, and RLS lock-down
DATABASE_SETUP.md                Local Supabase setup and safety instructions
public/                          Local brand and hero SVG assets
```

## Prototype scope

Interactions are client-side demonstrations. Authentication, persistence, uploads, email, Google Drive, audit log storage, APIs, and role-based permissions are intentionally mocked for the MVP.
