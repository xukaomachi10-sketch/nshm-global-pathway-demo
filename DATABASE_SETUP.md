# Internal Operations MVP - Database Pilot Setup

This package is for an isolated Supabase pilot. It must not be connected to the production Vercel environment yet.

## Safety model

- `NEXT_PUBLIC_DATA_MODE=mock` is the committed default.
- Missing or invalid data mode resolves to `mock`.
- Supabase is selected only when the mode, URL, and one supported public key exist:
  - `NEXT_PUBLIC_DATA_MODE=supabase`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- A missing credential or failed Supabase query falls back to the mock repository.
- Public website and CMS screens remain fixture-backed. Only the approved Internal Operations routes use the pilot repository.
- CSV import is restricted to fake `FAKE-*` student codes. Real-data import requires staff authentication and reviewed RBAC first.
- The pilot uses only the Supabase publishable/anon key and never uses an admin key.

## Package contents

- `SUPABASE_SCHEMA.sql`: enums, ten pilot tables, keys, checks, indexes, triggers, fake-only RLS, and fake seed data.
- `DATA_DICTIONARY.md`: field definitions and data classifications.
- `RBAC_MATRIX.md`: target role and confidentiality access model.
- `DATABASE_TEST_PLAN.md`: database, fallback, security, and regression tests.
- `types/database.ts`: TypeScript table and enum types.
- `lib/data-access/`: repository contract plus mock and Supabase adapters.

## 1. Create an isolated Supabase project

Create a new Supabase project specifically for this pilot. Do not reuse a production database.

From **Project Settings -> API**, record:

- Project URL
- Publishable key (or legacy anon key)

The publishable key is constrained by RLS. Store local configuration in `.env.local`, which is ignored by Git.

## 2. Apply the schema

1. Open **SQL Editor** in the pilot project.
2. Create a new query.
3. Copy the complete contents of `SUPABASE_SCHEMA.sql`.
4. Run the query. It uses `CREATE ... IF NOT EXISTS`, safe `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`, and idempotent policy/trigger definitions; it does not drop or truncate student data.
5. Confirm these tables exist:
   - `users`
   - `students`
   - `counseling_cases`
   - `counseling_sessions`
   - `internal_tasks`
   - `test_scores`
   - `consents`
   - `activity_logs`
   - `student_import_batches`
   - `student_import_staging`

The SQL includes fake records identified by `FAKE-*`, `example.invalid`, and `is_fake=true`. It contains no real student data.

For an existing pilot database, the same script safely adds/backfills these student-master fields without resetting rows: `grade_level`, `gender`, `homeroom_teacher`, `academic_track`, `source_system`, `source_record_id`, `is_active_student`, `is_fake`, `deleted_by`, and `delete_reason`. Existing `FAKE-*` rows are marked `is_fake=true`; other rows are not converted to fake data.

The script is intended for a clean pilot project. If an older pilot schema with `consultation_requests` or `tasks` already exists, create a fresh project or write a reviewed migration; do not drop tables in a shared environment.

## 3. Verify the schema

Run:

```sql
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in (
    'users', 'students', 'counseling_cases', 'counseling_sessions',
    'internal_tasks', 'test_scores', 'consents', 'activity_logs',
    'student_import_batches', 'student_import_staging'
  )
order by table_name;
```

Verify the required student columns:

```sql
select column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name = 'students'
  and column_name in (
    'id', 'student_code', 'full_name', 'date_of_birth', 'gender',
    'class_name', 'grade_level', 'graduation_year', 'homeroom_teacher',
    'academic_track', 'student_email', 'parent_name', 'parent_phone',
    'parent_email', 'source_system', 'source_record_id', 'is_active_student',
    'is_fake', 'created_at', 'updated_at', 'deleted_at', 'deleted_by',
    'delete_reason'
  )
order by ordinal_position;
```

Verify fake seed counts:

```sql
select 'users' as table_name, count(*) from public.users
union all select 'students', count(*) from public.students
union all select 'counseling_cases', count(*) from public.counseling_cases
union all select 'counseling_sessions', count(*) from public.counseling_sessions
union all select 'internal_tasks', count(*) from public.internal_tasks
union all select 'test_scores', count(*) from public.test_scores
union all select 'consents', count(*) from public.consents
union all select 'activity_logs', count(*) from public.activity_logs;
```

Use `DATABASE_TEST_PLAN.md` for the complete acceptance suite.

## 4. Run the application in default mock mode

```bash
cp .env.example .env.local
pnpm dev
```

Confirm `.env.local` contains:

```env
NEXT_PUBLIC_DATA_MODE=mock
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Open `/`, `/demo`, `/portal`, and `/cms`. They must work without a database. `/demo` should show requested and effective mode as `mock`.

## 5. Enable Supabase locally

Update `.env.local`:

```env
NEXT_PUBLIC_DATA_MODE=supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
# Optional compatibility alias instead of the publishable variable:
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Restart the development server and open `/demo`. Expected:

- Requested mode: `supabase`
- Effective mode: `supabase`
- Fake rows returned from the `students` table

The public website and CMS remain on the mock facade. Student counseling, tasks, sessions, and the CSV importer use the shared repository with mock fallback.

## 6. Test the fake-only CSV import

1. Re-run the complete `SUPABASE_SCHEMA.sql` in the pilot SQL Editor so the two import tables, student-master columns, grants, and RLS policies exist.
2. Open `/portal/import-students`.
3. Download the header-only CSV template.
4. Add fake rows whose `student_code` begins with `FAKE-`; never use a real export for this pilot.
5. Upload, review row-level errors/warnings, and confirm only the valid rows.
6. Verify that existing codes are updated, new codes are created, error rows are skipped, and `activity_logs` contains `student.import_created` or `student.import_updated`.

The publishable key can write only fake import batches/staging records and fake students. A non-`FAKE-*` code is rejected by both application validation and RLS. Do not weaken these policies to import real data anonymously.

## 7. Verify automatic fallback

Keep `NEXT_PUBLIC_DATA_MODE=supabase`, remove the URL or both supported public key variables, and restart the app.

Expected:

- `/demo` remains available.
- Effective mode becomes `mock`.
- A fallback reason is displayed.
- Existing routes remain unchanged.

Repeat with an invalid `NEXT_PUBLIC_SUPABASE_URL` to verify query-failure fallback.

## 8. Production Vercel restriction

Do not add these variables to Vercel Production:

- `NEXT_PUBLIC_DATA_MODE=supabase`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

`vercel.json` intentionally contains no Supabase environment values. Production therefore remains in mock mode.

If a hosted pilot is later required, use a separate Vercel Preview environment and a separate Supabase project. Apply the RBAC/RLS implementation described in `RBAC_MATRIX.md` before any non-fake data is introduced.

## 9. Validation commands

```bash
pnpm lint
pnpm build
```

Both commands must pass before merging the pilot branch.
