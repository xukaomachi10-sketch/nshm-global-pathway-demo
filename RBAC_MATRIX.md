# Internal Operations MVP - Security Phase 1 RBAC

## Enforcement status

Security Phase 1 uses Supabase Auth plus active `staff_profiles`. Portal pages and mutations verify the session server-side; database policies independently enforce `auth.uid()` scope. Real student import remains disabled.

## Roles

| Role | Scope |
| --- | --- |
| `ADMIN` | System setup and staff-profile administration; department-wide access |
| `ICCO_HEAD` | Department-wide student/case oversight and fake pilot import |
| `COUNSELOR` | Assigned students, cases, sessions, and tasks only; no bulk import |

## Table access matrix

`C` = create, `R` = read, `U` = update. Hard delete is not granted.

| Table | ADMIN | ICCO_HEAD | COUNSELOR |
| --- | --- | --- | --- |
| `staff_profiles` | C/R/U | R own | R own |
| `students` | C/R/U All | C/R/U All | R assigned |
| `counseling_cases` | C/R/U All | C/R/U All | C/R/U assigned |
| `counseling_sessions` | C/R/U All | C/R/U All | C/R/U own |
| `internal_tasks` | C/R/U All | C/R/U All | C/R/U own/assigned case |
| `student_import_batches` | C/R/U fake only | C/R/U fake only | - |
| `student_import_staging` | C/R/U fake only | C/R/U fake only | - |
| `activity_logs` | C/R All | C/R All | C/R own context |

## Enforcement helpers

- `current_staff_role()` maps `auth.uid()` to an active Phase 1 role.
- `current_internal_user_id()` maps the Auth identity to the existing `users` counselor assignment.
- `is_active_staff()` rejects inactive or unmapped Auth users.
- `can_import_students()` permits only `ICCO_HEAD` and `ADMIN`.

The publishable key identifies the Supabase project but grants no staff access by itself. Authenticated user JWTs and RLS determine access. A counselor cannot expand scope merely by knowing a student or case ID.

## Import boundary

- The Import menu and page are available only to `ICCO_HEAD` and `ADMIN`.
- The server action repeats the role check.
- `import_fake_students_transaction()` repeats authorization and accepts only complete `FAKE-*` rows with `is_fake=true`.
- Staging, upsert, activity logs, batch completion, and PII scrubbing run in one transaction.
- Successful imports immediately scrub staging row PII. `purge_student_import_staging()` provides the reviewed retention cleanup path.

## Phase 1 restrictions

- Use fake data only; real import remains explicitly blocked.
- Protect the `database-pilot` Preview before sensitive testing.
- Access-token sessions expire after at most one hour and require login again; refresh rotation is a later hardening item.
- No student or parent login exists.
- No service-role or secret key is used by the application.
- Do not configure Supabase variables in Vercel Production.
