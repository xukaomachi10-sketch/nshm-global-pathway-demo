# Internal Operations MVP - Database Test Plan

## Objective

Validate the v1 schema, fake seed data, repository switching, security boundaries, fallback behavior, and regression safety for the current mock-data demo.

## Environments

| Environment | Data mode | Data allowed | Purpose |
| --- | --- | --- | --- |
| Local default | `mock` | Existing mock fixtures | Regression and build testing |
| Local Supabase pilot | `supabase` | Fake seed data only | Connectivity and schema testing |
| Vercel Preview | `mock` initially | Mock only | Optional later pilot gate |
| Vercel Production | `mock` | Mock only | Current demo; no Supabase variables |

## Preconditions

1. Use a dedicated pilot Supabase project.
2. Apply `SUPABASE_SCHEMA.sql` to a clean project.
3. Confirm no real student data is present.
4. Use only the publishable/anon key in `.env.local`.
5. Record test evidence without copying sensitive credentials.

## Schema and constraint tests

| ID | Test | Procedure | Expected result |
| --- | --- | --- | --- |
| DB-001 | Required tables | Query `information_schema.tables` for all eight names | Eight rows returned |
| DB-002 | Primary keys | Inspect constraints for each table | UUID PK exists on every table |
| DB-003 | Foreign keys | Inspect `information_schema` or Supabase UI | All documented FKs exist |
| DB-004 | Updated timestamps | Update one fake mutable row | `updated_at` increases automatically |
| DB-005 | Soft delete | Set fake student `deleted_at=now()` | Row remains stored and partial active indexes exclude it |
| DB-006 | Case close rule | Set case to `completed` without `closed_at` | Insert/update rejected |
| DB-007 | Task context rule | Insert task with all context FKs null | Insert rejected |
| DB-008 | Task completion rule | Set `task_status='done'` without `completed_at` | Update rejected |
| DB-009 | Score verification rule | Set `is_verified=true` without verifier/time | Update rejected |
| DB-010 | Consent lifecycle rule | Grant consent without `granted_at` | Insert/update rejected |
| DB-011 | Session duration rule | Insert duration below 15 or above 240 | Insert rejected |
| DB-012 | Risk enum | Insert unsupported risk value | Insert rejected |
| DB-013 | Confidentiality enum | Insert unsupported confidentiality value | Insert rejected |
| DB-014 | Activity immutability | Update or delete a fake activity log | Operation rejected as append-only |

Useful inspection query:

```sql
select
  tc.table_name,
  tc.constraint_type,
  tc.constraint_name
from information_schema.table_constraints tc
where tc.table_schema = 'public'
  and tc.table_name in (
    'users', 'students', 'counseling_cases', 'counseling_sessions',
    'internal_tasks', 'test_scores', 'consents', 'activity_logs'
  )
order by tc.table_name, tc.constraint_type;
```

## Index tests

| ID | Index requirement | Expected index |
| --- | --- | --- |
| IDX-001 | Student code | `students_student_code_idx` plus unique constraint |
| IDX-002 | Case status | `counseling_cases_case_status_idx` |
| IDX-003 | Assigned counselor | Student and case assigned-counselor indexes |
| IDX-004 | Due date | `internal_tasks_due_date_idx` |
| IDX-005 | Risk level | Student and case risk indexes |
| IDX-006 | Audit lookups | Student, case, and entity activity-log indexes |

Verify:

```sql
select tablename, indexname, indexdef
from pg_indexes
where schemaname = 'public'
  and tablename in (
    'students', 'counseling_cases', 'counseling_sessions',
    'internal_tasks', 'test_scores', 'consents', 'activity_logs'
  )
order by tablename, indexname;
```

For query-plan validation, use `explain (analyze, buffers)` only against fake data and a suitably sized synthetic dataset. Small seed tables may legitimately use sequential scans.

## Seed-data safety tests

| ID | Test | Expected result |
| --- | --- | --- |
| SEED-001 | Student codes | Every seed code starts `FAKE-` |
| SEED-002 | Emails | Every seed email ends `example.invalid` |
| SEED-003 | Profile marker | Seed student JSON contains `is_fake=true` |
| SEED-004 | Evidence references | References are fake labels, not accessible URLs/files |
| SEED-005 | Rerun schema | Seed inserts do not duplicate deterministic IDs |

Queries:

```sql
select student_code, student_email, profile_data
from public.students
where deleted_at is null;

select count(*) as unsafe_seed_students
from public.students
where student_code not like 'FAKE-%'
   or student_email not like '%@example.invalid'
   or coalesce((profile_data->>'is_fake')::boolean, false) is not true;
```

Expected `unsafe_seed_students`: `0`.

## Security tests

| ID | Test | Procedure | Expected result |
| --- | --- | --- | --- |
| SEC-001 | RLS enabled | Inspect `pg_class.relrowsecurity` | True for all eight tables |
| SEC-002 | Anon blocked | Query REST with anon key | Permission denied/no rows |
| SEC-003 | Authenticated blocked | Query with ordinary authenticated token | Permission denied/no rows |
| SEC-004 | No admin credential | Search source and environment files | No admin/secret key is requested or stored |
| SEC-005 | Vercel disconnected | Inspect `vercel.json` and Production env | No Supabase variables |
| SEC-006 | Activity mutation blocked | Attempt update/delete | Database exception |
| SEC-007 | No secret logging | Review `activity_logs.metadata` and app logs | No tokens, keys, or raw documents |

RLS inspection:

```sql
select relname, relrowsecurity
from pg_class
join pg_namespace on pg_namespace.oid = pg_class.relnamespace
where pg_namespace.nspname = 'public'
  and relname in (
    'users', 'students', 'counseling_cases', 'counseling_sessions',
    'internal_tasks', 'test_scores', 'consents', 'activity_logs'
  )
order by relname;
```

## Application mode tests

| ID | Environment variables | Expected mode/result |
| --- | --- | --- |
| APP-001 | No data variables | Requested/effective `mock`; routes work |
| APP-002 | `NEXT_PUBLIC_DATA_MODE=mock` | Effective `mock`; no Supabase request |
| APP-003 | Invalid mode value | Effective `mock` |
| APP-004 | `supabase`, no URL/key | Effective `mock`; fallback reason shown |
| APP-005 | `supabase`, URL only | Effective `mock` |
| APP-006 | `supabase`, key only | Effective `mock` |
| APP-007 | `supabase`, valid URL/key | Effective `supabase`; fake `students` rows load |
| APP-008 | `supabase`, unreachable URL | Effective `mock`; `/demo` remains usable |

## Route regression tests

Verify these routes render in mock mode:

- `/`
- `/demo`
- `/portal`
- `/portal/registrations`
- `/portal/students/NSHM260101`
- `/portal/evidence`
- `/portal/applications`
- `/portal/documents`
- `/cms`
- `/dang-ky-tu-van`
- A valid `/bai-viet/[slug]` route

The main demo pages must not import `@/lib/data` or the Supabase adapter directly; they use `lib/data-access/demo-data.ts`.

## Build and static checks

Run:

```bash
pnpm lint
pnpm build
```

Then verify:

```bash
rg 'SUPABASE_.*(SECRET|ADMIN)' .env.local app lib
rg 'from "@/lib/data"' app components
```

Expected:

- Lint exits `0`.
- Build exits `0` and lists public, demo, portal, and CMS routes.
- Client bundle secret scan returns no matches.
- Direct UI fixture-import scan returns no matches.

## Exit criteria

The pilot package is accepted when:

1. All schema, constraint, seed-safety, and security tests pass.
2. Mock is the default and all existing routes pass regression testing.
3. Supabase mode requires the flag plus both server credentials.
4. Automatic fallback works for missing and failed Supabase configuration.
5. No real student data or production Supabase credentials are present.
6. `pnpm lint` and `pnpm build` pass.
7. Production Vercel remains in mock mode.
