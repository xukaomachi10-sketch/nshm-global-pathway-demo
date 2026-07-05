# Internal Operations MVP - RBAC Matrix

## Pilot enforcement status

The v1 schema defines roles and confidentiality levels, but real-data CRUD is not enabled. The isolated dev pilot permits publishable-key operations only on student rows protected by both `FAKE-*` and `students.is_fake=true`; related task/import metadata also carries fake markers. Non-fake records and unrelated tables remain blocked.

The matrix below is the target policy for the next phase. It must be implemented as reviewed RLS policies and server authorization checks before any real data is used.

## Roles

| Role | Scope |
| --- | --- |
| `admin` | System administration, user lifecycle, configuration, emergency support |
| `manager` | Department-wide case oversight, assignment, quality review, reporting |
| `counselor` | Assigned students/cases, sessions, tasks, scores, operational notes |
| `auditor` | Read-only compliance access and audit-log review |
| `viewer` | Limited operational summaries; no sensitive notes or consent evidence |

## Operation legend

- `C`: create
- `R`: read
- `U`: update
- `SD`: soft delete only
- `-`: no access
- `Own`: records assigned to the user or explicitly shared
- `All`: department-wide scope
- `Meta`: non-sensitive metadata only

## Table access matrix

| Table | Admin | Manager | Counselor | Auditor | Viewer |
| --- | --- | --- | --- | --- | --- |
| `users` | C/R/U/SD All | R All; U assignment-safe fields | R own profile and active staff directory | R All | R active directory Meta |
| `students` | C/R/U/SD All | C/R/U/SD All | C/R/U Own | R All | R approved summary Meta |
| `counseling_cases` | C/R/U/SD All | C/R/U/SD All | C/R/U Own | R All | R approved status Meta |
| `counseling_sessions` | C/R/U/SD All | C/R/U/SD All | C/R/U/SD Own | R All | R schedule Meta only |
| `internal_tasks` | C/R/U/SD All | C/R/U/SD All | C/R/U/SD Own | R All | - |
| `test_scores` | C/R/U/SD All | C/R/U/SD All | C/R/U Own; verify only if authorized | R All | R verified summary only |
| `consents` | C/R/U/SD All | C/R/U/SD All | C/R/U Own | R All | - |
| `activity_logs` | C via system; R All | C via system; R All | C via system; R Own context | R All | - |

Hard delete is not granted through application roles. `activity_logs` is append-only for every role, including administrators.

## Confidentiality clearance

| Level | Admin | Manager | Counselor | Auditor | Viewer |
| --- | --- | --- | --- | --- | --- |
| `internal` | All | All | Own/assigned | Read | Approved summary |
| `restricted` | All | All | Own/assigned | Read with audit purpose | No direct row access |
| `highly_restricted` | Break-glass or explicit duty | Explicit department need | Explicit case assignment and purpose | Approved audit only | No access |

Rules:

1. Effective access is the intersection of role, assignment scope, confidentiality clearance, and record state.
2. A counselor does not gain access solely because they know a student ID.
3. `consents`, family contact data, date of birth, and sensitive counseling notes default to `highly_restricted` handling.
4. The publishable/anon key is only a connectivity mechanism; RLS remains the enforcement boundary for the pilot read.
5. Break-glass access requires a reason, short expiry, manager notification, and audit-log entry.

## Field restrictions

| Field group | Allowed roles | Notes |
| --- | --- | --- |
| User role and activation | Admin; manager by delegated workflow | Role escalation requires admin approval |
| Student identity/contact | Admin, manager, assigned counselor, approved auditor | Viewer receives redacted summary only |
| Case assignment | Admin, manager | Counselor may request reassignment but not self-assign |
| Session summary | Admin, manager, assigned counselor, approved auditor | Must respect case confidentiality |
| Score verification | Manager or designated counselor | Creator should not verify their own entry where separation is required |
| Consent evidence/status | Admin, manager, assigned counselor, approved auditor | Withdrawal cannot be overwritten or hard deleted |
| Activity before/after JSON | Admin, manager, auditor; scoped counselor | Exclude secrets and raw document content |

## Target RLS policy outline

Before enabling authenticated access, add helper functions such as:

- `current_internal_user_id()` - maps `auth.uid()` to active `public.users`.
- `current_user_role()` - returns the active internal role.
- `can_access_student(student_id, confidentiality_level)` - checks role, assignment, and clearance.
- `can_manage_case(case_id)` - checks admin/manager or assigned counselor scope.

Policies should then enforce:

- Active internal profile required for every authenticated query.
- Soft-deleted rows excluded by default.
- Counselors limited to `assigned_counselor_id = current_internal_user_id()` or explicitly shared cases.
- Viewers exposed through narrow database views, not base tables.
- Consent and highly restricted access written to `activity_logs`.
- Inserts/updates validated again in server actions; RLS is a second boundary, not the only boundary.

## Pilot restrictions

Until these policies and Supabase Auth are implemented:

- Use fake data only.
- Use `/demo` only for repository connectivity/count tests.
- Do not expose operational CRUD endpoints during this connection pilot.
- Do not configure Supabase variables in Vercel Production.
