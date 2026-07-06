# Internal Operations MVP - Database Test Plan

## Objective

Validate the v1 schema, controlled Student Intake Assessment module, repository switching, security boundaries, fallback behavior, and regression safety for the current mock-data demo. The database-pilot Preview may contain the four already authorized real student master rows; this plan does not import or seed any additional real student.

## Environments

| Environment | Data mode | Data allowed | Purpose |
| --- | --- | --- | --- |
| Local default | `mock` | Existing mock fixtures | Regression and build testing |
| Local Supabase pilot | `supabase` | Fake seed data and approved existing pilot records | Connectivity and schema testing |
| Vercel Preview | `supabase` only on database-pilot | Four existing controlled student records; no new import | Authenticated intake testing |
| Vercel Production | `mock` | Mock only | Current demo; no Supabase variables |

## Preconditions

1. Use a dedicated pilot Supabase project.
2. Apply `SUPABASE_SCHEMA.sql` to a clean project.
3. Confirm only the four previously approved real student master rows are present and real import is locked again.
4. Create fake Auth users linked to active `staff_profiles` roles.
5. Use only the publishable/anon key in `.env.local`.
5. Record test evidence without copying sensitive credentials.

## Schema and constraint tests

| ID | Test | Procedure | Expected result |
| --- | --- | --- | --- |
| DB-001 | Required tables | Query `information_schema.tables` for all thirteen names | Thirteen rows returned |
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
| DB-015 | Import batch counts | Insert negative row counts | Insert rejected |
| DB-016 | Import staging line | Insert `row_number < 2` | Insert rejected |
| DB-017 | Import batch fake marker | Insert `is_fake_only=false` | Insert rejected |
| DB-018 | One active intake | Create a second active intake for the same student | Unique index rejects it |
| DB-019 | Intake score range | Save a rubric score outside 1-5 | Insert/update rejected |
| DB-020 | SAT/IELTS range | Save an out-of-range score | Insert/update rejected |
| DB-021 | Intake audit | Create/update/review through UI | Matching append-only activity action is written in the same transaction |

Useful inspection query:

```sql
select
  tc.table_name,
  tc.constraint_type,
  tc.constraint_name
from information_schema.table_constraints tc
where tc.table_schema = 'public'
  and tc.table_name in (
    'users', 'staff_profiles', 'system_settings', 'students', 'counseling_cases', 'counseling_sessions',
    'internal_tasks', 'test_scores', 'consents', 'activity_logs',
    'student_import_batches', 'student_import_staging',
    'student_intake_assessments'
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
| SEED-003 | Explicit fake marker | Seed student column `is_fake` is `true` |
| SEED-004 | Evidence references | References are fake labels, not accessible URLs/files |
| SEED-005 | Rerun schema | Seed inserts do not duplicate deterministic IDs |

The schema seed rows remain fake even when the pilot database also contains separately approved real rows. Check only deterministic seed IDs:

```sql
select id, student_code, student_email, is_fake
from public.students
where id in (
  '20000000-0000-4000-8000-000000000001',
  '20000000-0000-4000-8000-000000000002',
  '20000000-0000-4000-8000-000000000003'
);

select count(*) as unsafe_seed_students
from public.students
where id in (
  '20000000-0000-4000-8000-000000000001',
  '20000000-0000-4000-8000-000000000002',
  '20000000-0000-4000-8000-000000000003'
)
and (
  student_code not like 'FAKE-%'
  or student_email not like '%@example.invalid'
  or is_fake is not true
);
```

Expected `unsafe_seed_students`: `0`.

## Security tests

| ID | Test | Procedure | Expected result |
| --- | --- | --- | --- |
| SEC-001 | RLS enabled | Inspect `pg_class.relrowsecurity` | True for all thirteen tables |
| SEC-002 | Anonymous boundary | Query REST with anon key | Only narrow fake-student demo read succeeds; portal writes fail |
| SEC-003 | Real rows role-scoped | Query real rows anonymously or as an unassigned counselor | Permission denied/no rows; Head/Admin remain authorized |
| SEC-004 | No admin credential | Search source and environment files | No admin/secret key is requested or stored |
| SEC-005 | Vercel disconnected | Inspect `vercel.json` and Production env | No Supabase variables |
| SEC-006 | Activity mutation blocked | Attempt update/delete | Database exception |
| SEC-007 | No secret logging | Review `activity_logs.metadata` and app logs | No tokens, keys, or raw documents |
| SEC-008 | Real code blocked | Import a non-`FAKE-*` student code | Row error in UI; no student upsert |
| SEC-009 | Invalid-row minimization | Inspect staging after a rejected row | Only sanitized rejection metadata is stored |
| SEC-010 | Portal redirect | Request `/portal` without staff cookie | Redirect to `/login` |
| SEC-011 | Inactive staff | Authenticate an inactive profile | Portal access denied |
| SEC-012 | Counselor import | Sign in as `COUNSELOR` and call import action/RPC | Menu hidden and operation denied |
| SEC-013 | Head import | Sign in as `ICCO_HEAD` and import fake rows | Transaction succeeds |
| SEC-014 | Atomic rollback | Force an activity-log failure in a test transaction | No batch, staging, or student changes persist |
| SEC-015 | Staging scrubbing | Inspect completed import staging | Raw PII is removed immediately |
| SEC-016 | Real UI default | Build without real-import flag | Real tab/button disabled |
| SEC-017 | Database gate default | Query `system_settings` | `real_student_import_enabled=false` |
| SEC-018 | Single-gate bypass | Enable only environment or only database gate | Real import remains blocked |
| SEC-019 | Counselor real RPC | Call real RPC as counselor | Permission denied |
| SEC-020 | Anonymous real RPC | Call real RPC with publishable key only | Permission denied |
| SEC-021 | Anonymous intake | Query/mutate intake with publishable key only | Permission denied/no rows |
| SEC-022 | Head/Admin intake | Create/read/update an intake | Succeeds for any visible student |
| SEC-023 | Counselor assigned intake | Read/update assigned intake | Succeeds; create and reassignment fail |
| SEC-024 | Counselor unassigned intake | Guess another assessment/student UUID | No row/access denied |
| SEC-025 | Intake hard delete | Attempt `DELETE` as any staff role | Permission denied |
| SEC-026 | Intake data minimization | Inspect UI and audit JSON | No DOB, parent contact, health/diagnostic narrative |

RLS inspection:

```sql
select relname, relrowsecurity
from pg_class
join pg_namespace on pg_namespace.oid = pg_class.relnamespace
where pg_namespace.nspname = 'public'
  and relname in (
    'users', 'staff_profiles', 'system_settings', 'students', 'counseling_cases', 'counseling_sessions',
    'internal_tasks', 'test_scores', 'consents', 'activity_logs',
    'student_import_batches', 'student_import_staging',
    'student_intake_assessments'
  )
order by relname;
```

## Application mode tests

| ID | Environment variables | Expected mode/result |
| --- | --- | --- |
| APP-001 | No data variables | Requested/effective `mock`; routes work |
| APP-002 | `NEXT_PUBLIC_DATA_MODE=mock` | Effective `mock`; no Supabase request |
| APP-003 | Invalid mode value | Effective `mock` |
| APP-004 | `supabase`, no URL/key | Effective `mock`; `/login` offers mock session |
| APP-005 | `supabase`, URL only | Effective `mock` |
| APP-006 | `supabase`, key only | Effective `mock` |
| APP-007 | `supabase`, valid URL/key | Effective `supabase`; fake `students` rows load |
| APP-008 | `supabase`, unreachable URL | Effective `mock`; `/demo` remains usable |

## Route regression tests

Verify public routes render in mock mode. Portal routes must first redirect anonymously to `/login`; after starting the mock staff session, verify each portal route renders:

- `/`
- `/demo`
- `/login`
- `/portal`
- `/portal/registrations`
- `/portal/students/NSHM260101`
- `/portal/students/[one-of-the-four-real-student-UUIDs]`
- `/portal/students`
- `/portal/tasks`
- `/portal/sessions`
- `/portal/import-students`
- `/portal/evidence`
- `/portal/applications`
- `/portal/documents`
- `/cms`
- `/dang-ky-tu-van`
- A valid `/bai-viet/[slug]` route

The main demo pages must not import `@/lib/data` or the Supabase adapter directly; they use `lib/data-access/demo-data.ts`.

## CSV import workflow tests

| ID | Test | Expected result |
| --- | --- | --- |
| IMP-001 | Download template | Header-only CSV containing all required and optional columns |
| IMP-002 | Missing required value | Row shows field-specific error and is skipped |
| IMP-003 | Duplicate code in file | Every duplicate occurrence shows an error |
| IMP-004 | Existing fake code | Preview shows update; student count does not duplicate |
| IMP-005 | New fake code | Preview shows new; one student is created |
| IMP-006 | Mixed valid/error rows | Only valid rows import; batch completes with errors |
| IMP-007 | Activity audit | One create/update activity entry exists per imported student in the same transaction |
| IMP-008 | Mock mode | Workflow completes in mock memory and shows developer warning |
| IMP-009 | Missing import policies | Supabase rejects confirmation with safe guidance; no key escalation |
| IMP-010 | No hard delete | Importing inactive status updates the flag; existing row remains stored |
| IMP-011 | Retention cleanup | Call `purge_student_import_staging(7)` as Head/Admin | Old staging PII/metadata is soft-purged |
| IMP-012 | Real minimal template | Download real template | Exactly nine approved columns; no sensitive fields |
| IMP-013 | Real required sources | Omit source system/record ID | Row rejected before confirmation |
| IMP-014 | Sensitive real field | Populate DOB/contact/parent field | Row rejected and not staged/imported |
| IMP-015 | Real code collision | Real import targets fake student code | Entire transaction rolls back |
| IMP-016 | First-five limit procedure | Submit reviewed five-row file with both gates enabled | Counts/audit match exactly; gates disabled afterward |

## Student Intake Assessment tests

Use the four existing real student rows only. Do not upload or insert more students.

| ID | Test | Expected result |
| --- | --- | --- |
| INTAKE-001 | Open from student list | Student name links to `/portal/students/[studentId]`; identity header matches code/name/class/grade/graduation/GVCN |
| INTAKE-002 | Tabs | Overview, Intake Assessment, Tasks, and Sessions render without exposing DOB or contact data |
| INTAKE-003 | Create as Head | Create a Draft for a student without one | One row created and `student_intake.created` logged |
| INTAKE-004 | Edit as Head/Admin | Change goals, readiness, risk, owner, and due date | Same row updates; `student_intake.updated` logged |
| INTAKE-005 | Fixed conclusion | Open a new form | Five numbered conclusion prompts appear |
| INTAKE-006 | Review | Save Draft, then choose “Đánh dấu đã rà soát” | Status becomes `Reviewed`; `student_intake.reviewed` logged |
| INTAKE-007 | Assigned counselor | Assign intake to counselor, sign in as that counselor | Student/intake read and update succeed |
| INTAKE-008 | Unassigned counselor | Sign in as another counselor | Student/intake does not become accessible by guessed URL |
| INTAKE-009 | No counselor create | As counselor, attempt server action without assessment ID | Rejected before data mutation |
| INTAKE-010 | Audit minimization | Inspect three activity actions | Only status/risk/assignment/due date and staff metadata are stored |
| INTAKE-011 | Existing operations tabs | Open Tasks/Sessions for a student | Only records allowed by existing RLS are shown; empty state is safe |
| INTAKE-012 | Real-import lock regression | Check UI flag and `system_settings` | Both real-import gates remain false after intake tests |

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
3. Supabase mode requires the explicit flag, project URL, and a publishable/anon key.
4. Automatic fallback works for missing and failed Supabase configuration.
5. No real student data is committed/seeded, no additional real row is imported, and no production Supabase credential is present.
6. `pnpm lint` and `pnpm build` pass.
7. Production Vercel remains in mock mode.
8. Anonymous portal requests redirect to `/login`; inactive/unmapped Auth users cannot open the portal.
9. Fake Supabase import succeeds only for `ICCO_HEAD`/`ADMIN` through the transactional RPC.
10. Real import remains disabled unless both Preview and database gates are explicitly true.
