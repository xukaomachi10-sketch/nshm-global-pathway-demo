# Internal Operations MVP - Database Pilot Setup

This package is for an isolated Supabase pilot. It must not be connected to the production Vercel environment yet.

## Safety model

- `NEXT_PUBLIC_DATA_MODE=mock` is the committed default.
- `NEXT_PUBLIC_REAL_STUDENT_IMPORT_ENABLED=false` is the committed Phase 2 default.
- Missing or invalid data mode resolves to `mock`.
- Supabase is selected only when the mode, URL, and one supported public key exist:
  - `NEXT_PUBLIC_DATA_MODE=supabase`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- A missing credential or failed Supabase query falls back to the mock repository.
- Public website and CMS screens remain fixture-backed. Only the approved Internal Operations routes use the pilot repository.
- Portal routes require a Supabase Auth user with an active `staff_profiles` row. Fake import remains available; real import requires two explicit gates that both default to disabled.
- The pilot uses only the Supabase publishable/anon key and never uses an admin key.

## Package contents

- `SUPABASE_SCHEMA.sql`: thirteen pilot tables, staff RBAC, intake audit trigger, separate transactional fake/real RPCs, retention controls, and fake seed data.
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
   - `staff_profiles`
   - `system_settings`
   - `students`
   - `counseling_cases`
   - `counseling_sessions`
   - `internal_tasks`
   - `test_scores`
   - `consents`
   - `activity_logs`
   - `student_import_batches`
   - `student_import_staging`
   - `student_intake_assessments`

The SQL includes fake records identified by `FAKE-*`, `example.invalid`, and `is_fake=true`. It contains no real student data.

For an existing pilot database, the same script safely adds/backfills these student-master fields without resetting rows: `grade_level`, `gender`, `homeroom_teacher`, `academic_track`, `source_system`, `source_record_id`, `is_active_student`, `is_fake`, `deleted_by`, and `delete_reason`. Existing `FAKE-*` rows are marked `is_fake=true`; other rows are not converted to fake data.

The script is idempotent for the current pilot schema and does not drop student data. Review it before applying to any database outside the isolated dev project.

## 3. Provision the first fake pilot staff account

1. In **Supabase Authentication → Users**, create a test staff user. Do not create student or parent accounts.
2. Copy its Auth user UUID.
3. In SQL Editor, create the active staff profile with placeholder/fake pilot identity values:

```sql
insert into public.staff_profiles (
  auth_user_id, full_name, email, role, is_active
) values (
  'AUTH_USER_UUID', 'Fake Pilot Head', 'fake.pilot.head@example.invalid',
  'ICCO_HEAD', true
)
on conflict (auth_user_id) do update
set role = excluded.role, is_active = excluded.is_active;
```

For a `COUNSELOR`, also link the Auth UUID to the matching internal `users` row so assigned-case RLS can resolve ownership:

```sql
update public.users
set auth_user_id = 'AUTH_USER_UUID'
where email = 'fake.counselor1@example.invalid';
```

Use SQL Editor only for this bootstrap step. The application never requests an admin or service-role key.

## 4. Verify the schema

Run:

```sql
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in (
    'users', 'staff_profiles', 'system_settings', 'students', 'counseling_cases', 'counseling_sessions',
    'internal_tasks', 'test_scores', 'consents', 'activity_logs',
    'student_import_batches', 'student_import_staging',
    'student_intake_assessments'
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

## 5. Run the application in default mock mode

```bash
cp .env.example .env.local
pnpm dev
```

Confirm `.env.local` contains:

```env
NEXT_PUBLIC_DATA_MODE=mock
NEXT_PUBLIC_REAL_STUDENT_IMPORT_ENABLED=false
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Open `/login` and choose the mock portal session. Anonymous requests to `/portal/*` redirect to `/login`; public `/`, `/demo`, and `/cms` remain available without a database.

## 6. Enable Supabase locally

Update `.env.local`:

```env
NEXT_PUBLIC_DATA_MODE=supabase
NEXT_PUBLIC_REAL_STUDENT_IMPORT_ENABLED=false
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
# Optional compatibility alias instead of the publishable variable:
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Restart the development server, open `/login`, and sign in with the fake staff Auth account. Expected:

- Requested mode: `supabase`
- Effective mode: `supabase`
- Active staff name/role displayed in the portal shell
- `COUNSELOR` cannot see the Import menu; `ICCO_HEAD` and `ADMIN` can

The public website and CMS remain on the mock facade. Student counseling, tasks, sessions, and the CSV importer use the shared repository with mock fallback.

## 7. Test the authenticated transactional fake-only CSV import

1. Re-run the complete `SUPABASE_SCHEMA.sql` in the pilot SQL Editor so the two import tables, student-master columns, grants, and RLS policies exist.
2. Open `/portal/import-students`.
3. Download the header-only CSV template.
4. Add fake rows whose `student_code` begins with `FAKE-`; never use a real export for this pilot.
5. Upload, review row-level errors/warnings, and confirm only the valid rows.
6. Verify that the RPC atomically stages, upserts, writes activity logs, completes the batch, and scrubs staging `raw_data`.

Only authenticated `ICCO_HEAD` and `ADMIN` staff can call the import RPC. A non-`FAKE-*` code is rejected by application validation and again inside the transaction. Do not weaken this guard for real data.

Staging retention:

- Successful transactions immediately remove row PII from `raw_data` and retain only minimal validation metadata.
- Run `select public.purge_student_import_staging(7);` as an authenticated `ICCO_HEAD` or `ADMIN` to soft-purge staging metadata older than seven days.
- Configure a reviewed scheduled job only in the dev pilot after validating this function manually.

## 8. Prepare Real Student Import Phase 2 — keep disabled

Real Import v1 accepts only `student_code`, `full_name`, `class_name`, `grade_level`, `graduation_year`, `homeroom_teacher`, `source_system`, `source_record_id`, and `is_active_student`. Date of birth, gender, student/parent contacts, parent name, and other sensitive fields are rejected.

After applying the schema, verify the database gate remains false:

```sql
select setting_key, setting_value
from public.system_settings
where setting_key = 'real_student_import_enabled';
```

Do **not** enable either gate yet. After the reviewed first-five-row test is approved, enable only the protected `database-pilot` Preview environment:

```env
NEXT_PUBLIC_REAL_STUDENT_IMPORT_ENABLED=true
```

Then enable the dev-database gate in SQL Editor:

```sql
update public.system_settings
set setting_value = 'true'::jsonb, updated_at = now()
where setting_key = 'real_student_import_enabled';
```

Disable either gate immediately after the controlled test.

## 9. Verify automatic fallback

Keep `NEXT_PUBLIC_DATA_MODE=supabase`, remove the URL or both supported public key variables, and restart the app.

Expected:

- `/demo` remains available.
- Effective mode becomes `mock`.
- A fallback reason is displayed.
- Existing routes remain unchanged.

Repeat with an invalid `NEXT_PUBLIC_SUPABASE_URL` to verify query-failure fallback.

## 10. Vercel Preview and Production restriction

Do not add these variables to Vercel Production:

- `NEXT_PUBLIC_DATA_MODE=supabase`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_REAL_STUDENT_IMPORT_ENABLED=true`

`vercel.json` intentionally contains no Supabase environment values. Production therefore remains in mock mode.

Set Supabase variables only for the `database-pilot` Preview environment. Enable Vercel deployment protection or an equivalent access gate before testing any sensitive workflow. Confirm Production has no Supabase variables and resolves to mock mode after every environment change.

## 11. Validation commands

Before application validation, re-run the full `SUPABASE_SCHEMA.sql` in the **database-pilot** Supabase SQL Editor. It adds `student_intake_assessments`, indexes, RLS policies, and the audit trigger with additive/idempotent statements. It does not drop/reset students, import additional students, or enable real import.

Verify the module:

```sql
select column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name = 'student_intake_assessments'
order by ordinal_position;

select policyname, cmd, roles
from pg_policies
where schemaname = 'public'
  and tablename = 'student_intake_assessments'
order by policyname;

select trigger_name, event_manipulation
from information_schema.triggers
where event_object_schema = 'public'
  and event_object_table = 'student_intake_assessments';
```

Expected: five staff policies (Head/Admin read/create/update plus counselor assigned read/update), no anonymous policy, and `audit_student_intake_change` for insert/update. Do not insert test records in SQL Editor; test through the protected Preview UI so `created_by`/`updated_by` match the authenticated staff profile.

```bash
pnpm lint
pnpm build
```

Both commands must pass before merging the pilot branch.
