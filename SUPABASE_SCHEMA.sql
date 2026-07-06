-- NSHM Internal Operations MVP - Supabase database pilot v1
-- All seed records are explicitly fake and reserved for testing.
-- Safe default: RLS exposes only explicitly fake Internal Operations pilot records.

create extension if not exists pgcrypto;

do $$ begin
  create type public.user_role as enum ('admin', 'manager', 'counselor', 'auditor', 'viewer');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.staff_role as enum ('ICCO_HEAD', 'COUNSELOR', 'ADMIN');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.risk_level as enum ('low', 'medium', 'high', 'critical');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.confidentiality_level as enum (
    'internal', 'restricted', 'highly_restricted'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.case_status as enum (
    'intake', 'assessment', 'active', 'waiting_student', 'waiting_parent',
    'on_hold', 'completed', 'cancelled'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.session_status as enum (
    'scheduled', 'confirmed', 'completed', 'cancelled', 'no_show'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.task_status as enum (
    'todo', 'in_progress', 'blocked', 'done', 'cancelled'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.priority_level as enum ('low', 'normal', 'high', 'urgent');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.test_type as enum (
    'gpa', 'ielts', 'toefl', 'sat', 'act', 'ap', 'ib', 'other'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.consent_type as enum (
    'counseling', 'data_processing', 'document_sharing', 'media', 'parent_communication'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.consent_status as enum ('pending', 'granted', 'withdrawn', 'expired');
exception when duplicate_object then null; end $$;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  email text not null unique check (position('@' in email) > 1),
  full_name text not null check (length(trim(full_name)) >= 2),
  role public.user_role not null default 'counselor',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.staff_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text not null check (length(trim(full_name)) >= 2),
  email text not null unique check (position('@' in email) > 1),
  role public.staff_role not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  student_code text not null unique check (length(trim(student_code)) >= 3),
  full_name text not null check (length(trim(full_name)) >= 2),
  date_of_birth date,
  gender text check (gender is null or gender in ('female', 'male', 'other', 'unspecified')),
  class_name text,
  grade_level smallint check (grade_level between 1 and 12),
  graduation_year smallint check (graduation_year between 2020 and 2100),
  homeroom_teacher text,
  academic_track text,
  student_email text,
  parent_name text,
  parent_email text,
  parent_phone text,
  source_system text,
  source_record_id text,
  is_active_student boolean not null default true,
  is_fake boolean not null default false,
  assigned_counselor_id uuid references public.users(id) on delete set null,
  target_country text,
  target_university text,
  intended_major text,
  risk_level public.risk_level not null default 'low',
  confidentiality_level public.confidentiality_level not null default 'restricted',
  profile_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  deleted_by uuid references public.users(id) on delete set null,
  delete_reason text
);

-- Idempotent additions for pilot projects created from an earlier schema revision.
alter table public.students add column if not exists date_of_birth date;
alter table public.students add column if not exists class_name text;
alter table public.students add column if not exists grade_level smallint;
alter table public.students add column if not exists graduation_year smallint;
alter table public.students add column if not exists gender text;
alter table public.students add column if not exists homeroom_teacher text;
alter table public.students add column if not exists academic_track text;
alter table public.students add column if not exists student_email text;
alter table public.students add column if not exists parent_name text;
alter table public.students add column if not exists parent_phone text;
alter table public.students add column if not exists parent_email text;
alter table public.students add column if not exists source_system text;
alter table public.students add column if not exists source_record_id text;
alter table public.students add column if not exists is_active_student boolean not null default true;
alter table public.students add column if not exists is_fake boolean not null default false;
alter table public.students add column if not exists created_at timestamptz not null default now();
alter table public.students add column if not exists updated_at timestamptz not null default now();
alter table public.students add column if not exists deleted_at timestamptz;
alter table public.students add column if not exists deleted_by uuid;
alter table public.students add column if not exists delete_reason text;

alter table public.students alter column is_active_student set default true;
update public.students set is_active_student = true where is_active_student is null;
alter table public.students alter column is_active_student set not null;

alter table public.students alter column is_fake set default false;
update public.students
set is_fake = true
where student_code like 'FAKE-%'
  and is_fake is not true;
update public.students set is_fake = false where is_fake is null;
alter table public.students alter column is_fake set not null;

do $$ begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'students_deleted_by_fkey'
      and conrelid = 'public.students'::regclass
  ) then
    alter table public.students
      add constraint students_deleted_by_fkey
      foreign key (deleted_by) references public.users(id) on delete set null;
  end if;
end $$;

do $$ begin
  alter table public.students add constraint students_grade_level_import_check
    check (grade_level is null or grade_level between 1 and 12);
exception when duplicate_object then null; end $$;

do $$ begin
  alter table public.students add constraint students_gender_import_check
    check (gender is null or gender in ('female', 'male', 'other', 'unspecified'));
exception when duplicate_object then null; end $$;

create table if not exists public.counseling_cases (
  id uuid primary key default gen_random_uuid(),
  case_number text not null unique,
  student_id uuid not null references public.students(id) on delete restrict,
  case_status public.case_status not null default 'intake',
  priority public.priority_level not null default 'normal',
  risk_level public.risk_level not null default 'low',
  confidentiality_level public.confidentiality_level not null default 'restricted',
  assigned_counselor_id uuid references public.users(id) on delete set null,
  opened_at timestamptz not null default now(),
  target_country text,
  intended_major text,
  summary text,
  next_action text,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint counseling_cases_closed_state_check check (
    (case_status in ('completed', 'cancelled') and closed_at is not null)
    or (case_status not in ('completed', 'cancelled') and closed_at is null)
  )
);

create table if not exists public.counseling_sessions (
  id uuid primary key default gen_random_uuid(),
  counseling_case_id uuid not null references public.counseling_cases(id) on delete restrict,
  student_id uuid not null references public.students(id) on delete restrict,
  counselor_id uuid not null references public.users(id) on delete restrict,
  scheduled_at timestamptz not null,
  duration_minutes smallint not null default 45 check (duration_minutes between 15 and 240),
  mode text not null default 'in_person' check (mode in ('in_person', 'online', 'phone')),
  location text,
  session_status public.session_status not null default 'scheduled',
  confidentiality_level public.confidentiality_level not null default 'restricted',
  summary text,
  next_action text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.internal_tasks (
  id uuid primary key default gen_random_uuid(),
  counseling_case_id uuid references public.counseling_cases(id) on delete restrict,
  student_id uuid references public.students(id) on delete restrict,
  counseling_session_id uuid references public.counseling_sessions(id) on delete restrict,
  title text not null check (length(trim(title)) >= 2),
  description text,
  assigned_to uuid references public.users(id) on delete set null,
  task_status public.task_status not null default 'todo',
  priority public.priority_level not null default 'normal',
  due_date date,
  completed_at timestamptz,
  confidentiality_level public.confidentiality_level not null default 'restricted',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint internal_tasks_has_context check (
    counseling_case_id is not null
    or student_id is not null
    or counseling_session_id is not null
  ),
  constraint internal_tasks_completion_check check (
    (task_status = 'done' and completed_at is not null)
    or (task_status <> 'done' and completed_at is null)
  )
);

create table if not exists public.test_scores (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete restrict,
  counseling_case_id uuid references public.counseling_cases(id) on delete set null,
  test_type public.test_type not null,
  test_name text not null,
  test_date date not null,
  overall_score numeric(8,2) check (overall_score is null or overall_score >= 0),
  score_scale text,
  component_scores jsonb not null default '{}'::jsonb,
  is_verified boolean not null default false,
  verified_by uuid references public.users(id) on delete set null,
  verified_at timestamptz,
  evidence_reference text,
  confidentiality_level public.confidentiality_level not null default 'restricted',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint test_scores_verification_check check (
    (is_verified = true and verified_by is not null and verified_at is not null)
    or (is_verified = false and verified_at is null)
  )
);

create table if not exists public.consents (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete restrict,
  counseling_case_id uuid references public.counseling_cases(id) on delete set null,
  consent_type public.consent_type not null,
  consent_status public.consent_status not null default 'pending',
  granted_by_name text,
  granted_by_relationship text,
  granted_at timestamptz,
  expires_at timestamptz,
  withdrawn_at timestamptz,
  evidence_reference text,
  notes text,
  confidentiality_level public.confidentiality_level not null default 'highly_restricted',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint consents_status_timeline_check check (
    (consent_status = 'pending' and granted_at is null and withdrawn_at is null)
    or (consent_status = 'granted' and granted_at is not null and withdrawn_at is null)
    or (consent_status = 'withdrawn' and granted_at is not null and withdrawn_at is not null)
    or (consent_status = 'expired' and granted_at is not null and expires_at is not null)
  )
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.users(id) on delete set null,
  student_id uuid references public.students(id) on delete set null,
  counseling_case_id uuid references public.counseling_cases(id) on delete set null,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  confidentiality_level public.confidentiality_level not null default 'restricted',
  previous_data jsonb,
  new_data jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.student_import_batches (
  id uuid primary key default gen_random_uuid(),
  source_file_name text not null check (length(trim(source_file_name)) >= 1),
  source_file_size_bytes bigint check (source_file_size_bytes is null or source_file_size_bytes >= 0),
  batch_status text not null default 'uploaded' check (
    batch_status in ('uploaded', 'validated', 'importing', 'completed', 'completed_with_errors', 'failed')
  ),
  data_mode text not null check (data_mode in ('mock', 'supabase')),
  is_fake_only boolean not null default true check (is_fake_only = true),
  total_rows integer not null default 0 check (total_rows >= 0),
  valid_rows integer not null default 0 check (valid_rows >= 0),
  error_rows integer not null default 0 check (error_rows >= 0),
  new_rows integer not null default 0 check (new_rows >= 0),
  updated_rows integer not null default 0 check (updated_rows >= 0),
  skipped_rows integer not null default 0 check (skipped_rows >= 0),
  created_by uuid references public.users(id) on delete set null,
  confirmed_at timestamptz,
  completed_at timestamptz,
  error_summary jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.student_import_staging (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.student_import_batches(id) on delete restrict,
  row_number integer not null check (row_number >= 2),
  student_code text,
  raw_data jsonb not null default '{}'::jsonb,
  normalized_data jsonb not null default '{}'::jsonb,
  validation_status text not null check (validation_status in ('valid', 'error')),
  validation_errors jsonb not null default '[]'::jsonb,
  validation_warnings jsonb not null default '[]'::jsonb,
  import_action text not null check (import_action in ('new', 'update', 'skipped', 'imported')),
  imported_student_id uuid references public.students(id) on delete set null,
  imported_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (batch_id, row_number)
);

-- Required and operational indexes.
create index if not exists students_student_code_idx
  on public.students(student_code) where deleted_at is null;
create index if not exists staff_profiles_auth_active_idx
  on public.staff_profiles(auth_user_id, is_active);
create index if not exists staff_profiles_role_active_idx
  on public.staff_profiles(role, is_active);
create index if not exists students_assigned_counselor_idx
  on public.students(assigned_counselor_id) where deleted_at is null;
create index if not exists students_risk_level_idx
  on public.students(risk_level) where deleted_at is null;
create index if not exists students_fake_active_idx
  on public.students(is_fake, is_active_student)
  where deleted_at is null;
create index if not exists counseling_cases_case_status_idx
  on public.counseling_cases(case_status) where deleted_at is null;
create index if not exists counseling_cases_assigned_counselor_idx
  on public.counseling_cases(assigned_counselor_id) where deleted_at is null;
create index if not exists counseling_cases_risk_level_idx
  on public.counseling_cases(risk_level) where deleted_at is null;
create index if not exists counseling_cases_student_idx
  on public.counseling_cases(student_id) where deleted_at is null;
create index if not exists counseling_sessions_schedule_idx
  on public.counseling_sessions(counselor_id, scheduled_at) where deleted_at is null;
create index if not exists internal_tasks_due_date_idx
  on public.internal_tasks(due_date) where deleted_at is null and task_status not in ('done', 'cancelled');
create index if not exists internal_tasks_assigned_to_idx
  on public.internal_tasks(assigned_to, task_status) where deleted_at is null;
create index if not exists test_scores_student_type_idx
  on public.test_scores(student_id, test_type, test_date desc) where deleted_at is null;
create index if not exists consents_student_type_idx
  on public.consents(student_id, consent_type, consent_status) where deleted_at is null;
create index if not exists activity_logs_student_created_idx
  on public.activity_logs(student_id, created_at desc);
create index if not exists activity_logs_case_created_idx
  on public.activity_logs(counseling_case_id, created_at desc);
create index if not exists activity_logs_entity_idx
  on public.activity_logs(entity_type, entity_id, created_at desc);
create index if not exists students_source_record_idx
  on public.students(source_system, source_record_id)
  where deleted_at is null and source_record_id is not null;
create index if not exists student_import_batches_status_idx
  on public.student_import_batches(batch_status, created_at desc)
  where deleted_at is null;
create index if not exists student_import_staging_batch_idx
  on public.student_import_staging(batch_id, validation_status, row_number)
  where deleted_at is null;
create index if not exists student_import_staging_student_code_idx
  on public.student_import_staging(student_code)
  where deleted_at is null and student_code is not null;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'users', 'staff_profiles', 'students', 'counseling_cases', 'counseling_sessions',
    'internal_tasks', 'test_scores', 'consents',
    'student_import_batches', 'student_import_staging'
  ] loop
    execute format(
      'drop trigger if exists %I on public.%I',
      'set_' || table_name || '_updated_at',
      table_name
    );
    execute format(
      'create trigger %I before update on public.%I for each row execute function public.set_updated_at()',
      'set_' || table_name || '_updated_at',
      table_name
    );
  end loop;
end $$;

create or replace function public.prevent_activity_log_mutation()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  raise exception 'activity_logs are append-only';
end;
$$;

drop trigger if exists prevent_activity_log_update on public.activity_logs;
create trigger prevent_activity_log_update
before update or delete on public.activity_logs
for each row execute function public.prevent_activity_log_mutation();

alter table public.users enable row level security;
alter table public.staff_profiles enable row level security;
alter table public.students enable row level security;
alter table public.counseling_cases enable row level security;
alter table public.counseling_sessions enable row level security;
alter table public.internal_tasks enable row level security;
alter table public.test_scores enable row level security;
alter table public.consents enable row level security;
alter table public.activity_logs enable row level security;
alter table public.student_import_batches enable row level security;
alter table public.student_import_staging enable row level security;

-- Pilot security posture: all tables are blocked by default.
revoke all on table public.users from anon, authenticated;
revoke all on table public.staff_profiles from anon, authenticated;
revoke all on table public.students from anon, authenticated;
revoke all on table public.counseling_cases from anon, authenticated;
revoke all on table public.counseling_sessions from anon, authenticated;
revoke all on table public.internal_tasks from anon, authenticated;
revoke all on table public.test_scores from anon, authenticated;
revoke all on table public.consents from anon, authenticated;
revoke all on table public.activity_logs from anon, authenticated;
revoke all on table public.student_import_batches from anon, authenticated;
revoke all on table public.student_import_staging from anon, authenticated;

-- The database pilot may read only fake, active student rows with the publishable key.
grant usage on schema public to anon, authenticated;
grant select on table public.students to anon;
grant select, insert, update on table public.students to authenticated;

drop policy if exists pilot_read_fake_students on public.students;
create policy pilot_read_fake_students
on public.students
for select
to anon
using (
  deleted_at is null
  and student_code like 'FAKE-%'
  and is_fake is true
);

drop policy if exists pilot_insert_fake_students on public.students;
create policy pilot_insert_fake_students
on public.students
for insert
to authenticated
with check (
  deleted_at is null
  and student_code like 'FAKE-%'
  and is_fake is true
);

drop policy if exists pilot_update_fake_students on public.students;
create policy pilot_update_fake_students
on public.students
for update
to authenticated
using (
  deleted_at is null
  and student_code like 'FAKE-%'
  and is_fake is true
)
with check (
  deleted_at is null
  and student_code like 'FAKE-%'
  and is_fake is true
);

grant select, insert, update on table public.student_import_batches to authenticated;
grant select, insert, update on table public.student_import_staging to authenticated;

drop policy if exists pilot_manage_fake_import_batches on public.student_import_batches;
create policy pilot_manage_fake_import_batches
on public.student_import_batches
for all
to authenticated
using (deleted_at is null and is_fake_only = true)
with check (deleted_at is null and is_fake_only = true);

drop policy if exists pilot_manage_fake_import_staging on public.student_import_staging;
create policy pilot_manage_fake_import_staging
on public.student_import_staging
for all
to authenticated
using (
  deleted_at is null
  and (student_code is null or student_code like 'FAKE-%')
  and exists (
    select 1 from public.student_import_batches b
    where b.id = student_import_staging.batch_id
      and b.deleted_at is null
      and b.is_fake_only = true
  )
)
with check (
  deleted_at is null
  and (student_code is null or student_code like 'FAKE-%')
  and coalesce(normalized_data ->> 'pilot_fake', 'false') = 'true'
  and exists (
    select 1 from public.student_import_batches b
    where b.id = student_import_staging.batch_id
      and b.deleted_at is null
      and b.is_fake_only = true
  )
);

-- Internal Operations core pilot. These policies intentionally permit only records
-- linked to fake students. They are for the dev project and must not be copied to
-- Vercel Production before real authentication/RBAC replaces the publishable-key pilot.
grant select on table public.counseling_cases to authenticated;
grant select, insert, update on table public.counseling_sessions to authenticated;
grant select, insert, update on table public.internal_tasks to authenticated;
grant select, insert on table public.activity_logs to authenticated;

drop policy if exists pilot_read_fake_cases on public.counseling_cases;
create policy pilot_read_fake_cases
on public.counseling_cases
for select
to authenticated
using (
  deleted_at is null
  and exists (
    select 1 from public.students s
    where s.id = counseling_cases.student_id
      and s.deleted_at is null
      and s.student_code like 'FAKE-%'
      and s.is_fake is true
  )
);

drop policy if exists pilot_manage_fake_sessions on public.counseling_sessions;
create policy pilot_manage_fake_sessions
on public.counseling_sessions
for all
to authenticated
using (
  deleted_at is null
  and exists (
    select 1 from public.students s
    where s.id = counseling_sessions.student_id
      and s.deleted_at is null
      and s.student_code like 'FAKE-%'
      and s.is_fake is true
  )
)
with check (
  deleted_at is null
  and exists (
    select 1 from public.students s
    where s.id = counseling_sessions.student_id
      and s.deleted_at is null
      and s.student_code like 'FAKE-%'
      and s.is_fake is true
  )
);

drop policy if exists pilot_manage_fake_tasks on public.internal_tasks;
create policy pilot_manage_fake_tasks
on public.internal_tasks
for all
to authenticated
using (
  deleted_at is null
  and coalesce(metadata ->> 'is_fake', 'false') = 'true'
  and exists (
    select 1 from public.students s
    where s.id = internal_tasks.student_id
      and s.deleted_at is null
      and s.student_code like 'FAKE-%'
      and s.is_fake is true
  )
)
with check (
  deleted_at is null
  and coalesce(metadata ->> 'is_fake', 'false') = 'true'
  and exists (
    select 1 from public.students s
    where s.id = internal_tasks.student_id
      and s.deleted_at is null
      and s.student_code like 'FAKE-%'
      and s.is_fake is true
  )
);

drop policy if exists pilot_insert_fake_activity_logs on public.activity_logs;
create policy pilot_insert_fake_activity_logs
on public.activity_logs
for insert
to authenticated
with check (
  coalesce(metadata ->> 'is_fake', 'false') = 'true'
  and student_id is not null
  and exists (
    select 1 from public.students s
    where s.id = activity_logs.student_id
      and s.deleted_at is null
      and s.student_code like 'FAKE-%'
      and s.is_fake is true
  )
);

drop policy if exists pilot_read_fake_activity_logs on public.activity_logs;
create policy pilot_read_fake_activity_logs
on public.activity_logs
for select
to authenticated
using (
  coalesce(metadata ->> 'is_fake', 'false') = 'true'
  and student_id is not null
  and exists (
    select 1 from public.students s
    where s.id = activity_logs.student_id
      and s.deleted_at is null
      and s.student_code like 'FAKE-%'
      and s.is_fake is true
  )
);

-- ---------------------------------------------------------------------------
-- SECURITY PHASE 1: authenticated staff RBAC. Real-data import remains disabled.
-- Anonymous access keeps only the narrow fake-student read used by /demo.
-- ---------------------------------------------------------------------------

create or replace function public.current_staff_role()
returns public.staff_role
language sql
stable
security definer
set search_path = public
as $$
  select sp.role
  from public.staff_profiles sp
  where sp.auth_user_id = auth.uid()
    and sp.is_active = true
  limit 1
$$;

create or replace function public.current_internal_user_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select u.id
  from public.users u
  where u.auth_user_id = auth.uid()
    and u.is_active = true
    and u.deleted_at is null
  limit 1
$$;

create or replace function public.is_active_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_staff_role() is not null
$$;

create or replace function public.can_import_students()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_staff_role() in ('ICCO_HEAD', 'ADMIN')
$$;

revoke all on function public.current_staff_role() from public, anon;
revoke all on function public.current_internal_user_id() from public, anon;
revoke all on function public.is_active_staff() from public, anon;
revoke all on function public.can_import_students() from public, anon;
grant execute on function public.current_staff_role() to authenticated;
grant execute on function public.current_internal_user_id() to authenticated;
grant execute on function public.is_active_staff() to authenticated;
grant execute on function public.can_import_students() to authenticated;

grant select, insert, update on table public.staff_profiles to authenticated;

drop policy if exists staff_read_profiles on public.staff_profiles;
create policy staff_read_profiles
on public.staff_profiles for select to authenticated
using (
  auth_user_id = auth.uid()
  or public.current_staff_role() = 'ADMIN'
);

drop policy if exists admin_insert_staff_profiles on public.staff_profiles;
create policy admin_insert_staff_profiles
on public.staff_profiles for insert to authenticated
with check (public.current_staff_role() = 'ADMIN');

drop policy if exists admin_update_staff_profiles on public.staff_profiles;
create policy admin_update_staff_profiles
on public.staff_profiles for update to authenticated
using (public.current_staff_role() = 'ADMIN')
with check (public.current_staff_role() = 'ADMIN');

revoke insert, update on table public.students from anon;
grant select on table public.students to anon;
grant select, insert, update on table public.students to authenticated;

drop policy if exists pilot_read_fake_students on public.students;
create policy pilot_read_fake_students
on public.students for select to anon
using (
  deleted_at is null
  and student_code like 'FAKE-%'
  and is_fake is true
);

drop policy if exists pilot_insert_fake_students on public.students;
drop policy if exists pilot_update_fake_students on public.students;

drop policy if exists staff_read_students on public.students;
create policy staff_read_students
on public.students for select to authenticated
using (
  deleted_at is null
  and public.is_active_staff()
  and (
    public.current_staff_role() in ('ICCO_HEAD', 'ADMIN')
    or assigned_counselor_id = public.current_internal_user_id()
  )
);

drop policy if exists head_admin_insert_students on public.students;
create policy head_admin_insert_students
on public.students for insert to authenticated
with check (
  public.current_staff_role() in ('ICCO_HEAD', 'ADMIN')
  and deleted_at is null
);

drop policy if exists head_admin_update_students on public.students;
create policy head_admin_update_students
on public.students for update to authenticated
using (
  public.current_staff_role() in ('ICCO_HEAD', 'ADMIN')
  and deleted_at is null
)
with check (public.current_staff_role() in ('ICCO_HEAD', 'ADMIN'));

revoke all on table public.student_import_batches from anon;
revoke all on table public.student_import_staging from anon;
revoke insert, update on table public.student_import_batches from authenticated;
revoke insert, update on table public.student_import_staging from authenticated;
grant select on table public.student_import_batches to authenticated;
grant select on table public.student_import_staging to authenticated;

drop policy if exists pilot_manage_fake_import_batches on public.student_import_batches;
drop policy if exists staff_manage_fake_import_batches on public.student_import_batches;
drop policy if exists staff_read_fake_import_batches on public.student_import_batches;
create policy staff_read_fake_import_batches
on public.student_import_batches for select to authenticated
using (public.can_import_students() and deleted_at is null and is_fake_only = true);

drop policy if exists pilot_manage_fake_import_staging on public.student_import_staging;
drop policy if exists staff_manage_fake_import_staging on public.student_import_staging;
drop policy if exists staff_read_fake_import_staging on public.student_import_staging;
create policy staff_read_fake_import_staging
on public.student_import_staging for select to authenticated
using (
  public.can_import_students()
  and deleted_at is null
  and (student_code is null or student_code like 'FAKE-%')
);

revoke all on table public.counseling_cases from anon;
revoke all on table public.counseling_sessions from anon;
revoke all on table public.internal_tasks from anon;
grant select, insert, update on table public.counseling_cases to authenticated;
grant select, insert, update on table public.counseling_sessions to authenticated;
grant select, insert, update on table public.internal_tasks to authenticated;

drop policy if exists pilot_read_fake_cases on public.counseling_cases;
drop policy if exists staff_manage_cases on public.counseling_cases;
create policy staff_manage_cases
on public.counseling_cases for all to authenticated
using (
  deleted_at is null and public.is_active_staff() and (
    public.current_staff_role() in ('ICCO_HEAD', 'ADMIN')
    or assigned_counselor_id = public.current_internal_user_id()
  )
)
with check (
  public.current_staff_role() in ('ICCO_HEAD', 'ADMIN')
  or assigned_counselor_id = public.current_internal_user_id()
);

drop policy if exists pilot_manage_fake_sessions on public.counseling_sessions;
drop policy if exists staff_manage_sessions on public.counseling_sessions;
create policy staff_manage_sessions
on public.counseling_sessions for all to authenticated
using (
  deleted_at is null and public.is_active_staff() and (
    public.current_staff_role() in ('ICCO_HEAD', 'ADMIN')
    or counselor_id = public.current_internal_user_id()
  )
)
with check (
  public.current_staff_role() in ('ICCO_HEAD', 'ADMIN')
  or counselor_id = public.current_internal_user_id()
);

drop policy if exists pilot_manage_fake_tasks on public.internal_tasks;
drop policy if exists staff_manage_tasks on public.internal_tasks;
create policy staff_manage_tasks
on public.internal_tasks for all to authenticated
using (
  deleted_at is null and public.is_active_staff() and (
    public.current_staff_role() in ('ICCO_HEAD', 'ADMIN')
    or assigned_to = public.current_internal_user_id()
    or exists (
      select 1 from public.counseling_cases c
      where c.id = internal_tasks.counseling_case_id
        and c.assigned_counselor_id = public.current_internal_user_id()
        and c.deleted_at is null
    )
  )
)
with check (
  public.current_staff_role() in ('ICCO_HEAD', 'ADMIN')
  or assigned_to = public.current_internal_user_id()
);

revoke all on table public.activity_logs from anon;
grant select, insert on table public.activity_logs to authenticated;
drop policy if exists pilot_insert_fake_activity_logs on public.activity_logs;
drop policy if exists pilot_read_fake_activity_logs on public.activity_logs;
drop policy if exists staff_insert_activity_logs on public.activity_logs;
drop policy if exists staff_read_activity_logs on public.activity_logs;

create policy staff_insert_activity_logs
on public.activity_logs for insert to authenticated
with check (
  public.is_active_staff()
  and (
    public.current_staff_role() in ('ICCO_HEAD', 'ADMIN')
    or actor_id = public.current_internal_user_id()
  )
);

create policy staff_read_activity_logs
on public.activity_logs for select to authenticated
using (
  public.current_staff_role() in ('ICCO_HEAD', 'ADMIN')
  or actor_id = public.current_internal_user_id()
);

create or replace function public.import_fake_students_transaction(
  p_source_file_name text,
  p_source_file_size_bytes bigint,
  p_rows jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_batch_id uuid;
  v_row jsonb;
  v_staging_id uuid;
  v_student_id uuid;
  v_existing_id uuid;
  v_code text;
  v_status text;
  v_total integer;
  v_valid integer;
  v_errors integer;
  v_new integer := 0;
  v_updated integer := 0;
begin
  if not public.can_import_students() then
    raise exception 'ICCO_HEAD or ADMIN role required' using errcode = '42501';
  end if;
  if jsonb_typeof(p_rows) <> 'array' then
    raise exception 'p_rows must be a JSON array';
  end if;

  v_total := jsonb_array_length(p_rows);
  if v_total < 1 or v_total > 1000 then
    raise exception 'Import must contain between 1 and 1000 rows';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(p_rows) item
    where item ->> 'validation_status' = 'valid'
      and (
        coalesce(item #>> '{normalized,student_code}', '') not like 'FAKE-%'
        or coalesce((item #>> '{normalized,is_fake}')::boolean, false) is not true
        or coalesce(item #>> '{normalized,full_name}', '') = ''
        or coalesce(item #>> '{normalized,class_name}', '') = ''
        or item #>> '{normalized,grade_level}' is null
        or item #>> '{normalized,graduation_year}' is null
      )
  ) then
    raise exception 'Only complete FAKE-* rows with is_fake=true are allowed in Phase 1';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(p_rows) item
    where item ->> 'validation_status' = 'valid'
    group by upper(item #>> '{normalized,student_code}')
    having count(*) > 1
  ) then
    raise exception 'Duplicate student_code in import batch';
  end if;

  select count(*) filter (where item ->> 'validation_status' = 'valid'),
         count(*) filter (where item ->> 'validation_status' <> 'valid')
  into v_valid, v_errors
  from jsonb_array_elements(p_rows) item;

  insert into public.student_import_batches (
    source_file_name, source_file_size_bytes, batch_status, data_mode,
    is_fake_only, total_rows, valid_rows, error_rows, new_rows,
    updated_rows, skipped_rows, created_by, confirmed_at
  ) values (
    left(coalesce(nullif(trim(p_source_file_name), ''), 'students.csv'), 150),
    p_source_file_size_bytes, 'importing', 'supabase', true,
    v_total, v_valid, v_errors, 0, 0, v_errors,
    public.current_internal_user_id(), now()
  ) returning id into v_batch_id;

  for v_row in select value from jsonb_array_elements(p_rows)
  loop
    v_status := coalesce(v_row ->> 'validation_status', 'error');
    v_code := upper(nullif(v_row #>> '{normalized,student_code}', ''));
    v_existing_id := null;

    if v_status = 'valid' then
      if exists (
        select 1 from public.students s
        where s.student_code = v_code and s.is_fake is not true
      ) then
        raise exception 'Fake import cannot update a non-fake student record';
      end if;
      select s.id into v_existing_id
      from public.students s
      where s.student_code = v_code and s.deleted_at is null;
      if v_existing_id is null then v_new := v_new + 1;
      else v_updated := v_updated + 1;
      end if;
    end if;

    insert into public.student_import_staging (
      batch_id, row_number, student_code, raw_data, normalized_data,
      validation_status, validation_errors, validation_warnings,
      import_action, imported_student_id, imported_at
    ) values (
      v_batch_id,
      greatest(coalesce((v_row ->> 'row_number')::integer, 2), 2),
      case when v_code like 'FAKE-%' then v_code else null end,
      case when v_status = 'valid' then coalesce(v_row -> 'raw', '{}'::jsonb)
           else jsonb_build_object('rejected', true) end,
      case when v_status = 'valid' then coalesce(v_row -> 'normalized', '{}'::jsonb) || '{"pilot_fake":true}'::jsonb
           else '{"pilot_fake":true,"rejected":true}'::jsonb end,
      case when v_status = 'valid' then 'valid' else 'error' end,
      coalesce(v_row -> 'validation_errors', '[]'::jsonb),
      coalesce(v_row -> 'validation_warnings', '[]'::jsonb),
      case when v_status <> 'valid' then 'skipped'
           when v_existing_id is null then 'new' else 'update' end,
      null, null
    ) returning id into v_staging_id;

    if v_status = 'valid' then
      insert into public.students (
        student_code, full_name, date_of_birth, gender, class_name,
        grade_level, graduation_year, homeroom_teacher, academic_track,
        student_email, parent_name, parent_phone, parent_email,
        source_system, source_record_id, is_active_student, is_fake
      ) values (
        v_code,
        v_row #>> '{normalized,full_name}',
        nullif(v_row #>> '{normalized,date_of_birth}', '')::date,
        nullif(v_row #>> '{normalized,gender}', ''),
        v_row #>> '{normalized,class_name}',
        (v_row #>> '{normalized,grade_level}')::smallint,
        (v_row #>> '{normalized,graduation_year}')::smallint,
        nullif(v_row #>> '{normalized,homeroom_teacher}', ''),
        nullif(v_row #>> '{normalized,academic_track}', ''),
        nullif(v_row #>> '{normalized,student_email}', ''),
        nullif(v_row #>> '{normalized,parent_name}', ''),
        nullif(v_row #>> '{normalized,parent_phone}', ''),
        nullif(v_row #>> '{normalized,parent_email}', ''),
        nullif(v_row #>> '{normalized,source_system}', ''),
        nullif(v_row #>> '{normalized,source_record_id}', ''),
        coalesce((v_row #>> '{normalized,is_active_student}')::boolean, true),
        true
      )
      on conflict (student_code) do update set
        full_name = excluded.full_name,
        date_of_birth = excluded.date_of_birth,
        gender = excluded.gender,
        class_name = excluded.class_name,
        grade_level = excluded.grade_level,
        graduation_year = excluded.graduation_year,
        homeroom_teacher = excluded.homeroom_teacher,
        academic_track = excluded.academic_track,
        student_email = excluded.student_email,
        parent_name = excluded.parent_name,
        parent_phone = excluded.parent_phone,
        parent_email = excluded.parent_email,
        source_system = excluded.source_system,
        source_record_id = excluded.source_record_id,
        is_active_student = excluded.is_active_student,
        is_fake = true
      returning id into v_student_id;

      update public.student_import_staging
      set imported_student_id = v_student_id, imported_at = now()
      where id = v_staging_id;

      insert into public.activity_logs (
        actor_id, student_id, entity_type, entity_id, action,
        confidentiality_level, previous_data, new_data, metadata
      ) values (
        public.current_internal_user_id(), v_student_id,
        'student_import_batch', v_batch_id,
        case when v_existing_id is null then 'student.import_created'
             else 'student.import_updated' end,
        'restricted', null,
        jsonb_build_object('student_code', v_code, 'batch_id', v_batch_id, 'is_fake', true),
        '{"pilot":true,"is_fake":true,"source":"transactional_csv_import"}'::jsonb
      );
    end if;
  end loop;

  -- Successful imports retain validation metadata but immediately scrub row PII.
  update public.student_import_staging
  set raw_data = jsonb_build_object('purged_after_import', true),
      normalized_data = jsonb_build_object(
        'student_code', student_code,
        'pilot_fake', true,
        'purged_after_import', true
      )
  where batch_id = v_batch_id;

  update public.student_import_batches
  set batch_status = case when v_errors > 0 then 'completed_with_errors' else 'completed' end,
      new_rows = v_new,
      updated_rows = v_updated,
      completed_at = now()
  where id = v_batch_id;

  return jsonb_build_object(
    'batch_id', v_batch_id,
    'total_rows', v_total,
    'valid_rows', v_valid,
    'error_rows', v_errors,
    'new_students', v_new,
    'updated_students', v_updated,
    'imported_students', v_valid
  );
end;
$$;

revoke all on function public.import_fake_students_transaction(text, bigint, jsonb) from public, anon;
grant execute on function public.import_fake_students_transaction(text, bigint, jsonb) to authenticated;

create or replace function public.purge_student_import_staging(
  p_retention_days integer default 7
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare v_count integer;
begin
  if not public.can_import_students() then
    raise exception 'ICCO_HEAD or ADMIN role required' using errcode = '42501';
  end if;
  if p_retention_days < 1 then
    raise exception 'Retention must be at least one day';
  end if;

  update public.student_import_staging s
  set raw_data = '{"purged":true}'::jsonb,
      normalized_data = jsonb_build_object('student_code', s.student_code, 'purged', true),
      deleted_at = coalesce(s.deleted_at, now())
  from public.student_import_batches b
  where b.id = s.batch_id
    and b.completed_at < now() - make_interval(days => p_retention_days)
    and b.batch_status in ('completed', 'completed_with_errors');
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

revoke all on function public.purge_student_import_staging(integer) from public, anon;
grant execute on function public.purge_student_import_staging(integer) to authenticated;

comment on table public.users is 'Internal operations user profiles; optional Supabase Auth link.';
comment on table public.staff_profiles is 'Active Supabase Auth staff identity and Phase 1 portal role.';
comment on table public.students is 'Student master records. Pilot seeds are fake only.';
comment on table public.counseling_cases is 'Case-level counseling workflow and ownership.';
comment on table public.counseling_sessions is 'Scheduled and completed counseling interactions.';
comment on table public.internal_tasks is 'Operational tasks tied to cases, students, or sessions.';
comment on table public.test_scores is 'Academic and standardized test score history.';
comment on table public.consents is 'Consent lifecycle and evidence references.';
comment on table public.activity_logs is 'Append-only audit trail for internal operations.';
comment on table public.student_import_batches is 'Fake-only CSV import confirmation batches; source file bytes are not stored.';
comment on table public.student_import_staging is 'Validated fake-only CSV row staging with sanitized invalid-row payloads.';

-- ---------------------------------------------------------------------------
-- FAKE PILOT SEED DATA. Never replace these values with real student data.
-- ---------------------------------------------------------------------------

insert into public.users (
  id, email, full_name, role, is_active
) values
  ('10000000-0000-4000-8000-000000000001', 'fake.manager@example.invalid', 'Quản lý Mẫu', 'manager', true),
  ('10000000-0000-4000-8000-000000000002', 'fake.counselor1@example.invalid', 'Chuyên viên Mẫu 01', 'counselor', true),
  ('10000000-0000-4000-8000-000000000003', 'fake.auditor@example.invalid', 'Kiểm soát Mẫu', 'auditor', true)
on conflict (id) do nothing;

insert into public.students (
  id, student_code, full_name, class_name, grade_level, graduation_year,
  student_email, parent_name, parent_email, parent_phone,
  assigned_counselor_id, target_country, target_university, intended_major,
  risk_level, confidentiality_level, profile_data, is_fake
) values
  (
    '20000000-0000-4000-8000-000000000001', 'FAKE-NSHM-0001', 'Học Sinh Mẫu 01', '11P1', 11, 2028,
    'fake.student1@example.invalid', 'Phụ Huynh Mẫu 01', 'fake.parent1@example.invalid', '0000000001',
    '10000000-0000-4000-8000-000000000002', 'Canada', 'Pilot University A', 'Data Science',
    'medium', 'restricted', '{"is_fake":true,"purpose":"database_pilot"}'::jsonb, true
  ),
  (
    '20000000-0000-4000-8000-000000000002', 'FAKE-NSHM-0002', 'Học Sinh Mẫu 02', '12P1', 12, 2027,
    'fake.student2@example.invalid', 'Phụ Huynh Mẫu 02', 'fake.parent2@example.invalid', '0000000002',
    '10000000-0000-4000-8000-000000000002', 'United Kingdom', 'Pilot University B', 'Economics',
    'high', 'restricted', '{"is_fake":true,"purpose":"database_pilot"}'::jsonb, true
  ),
  (
    '20000000-0000-4000-8000-000000000003', 'FAKE-NSHM-0003', 'Học Sinh Mẫu 03', '10P1', 10, 2029,
    'fake.student3@example.invalid', 'Phụ Huynh Mẫu 03', 'fake.parent3@example.invalid', '0000000003',
    null, 'Australia', 'Pilot University C', 'Design',
    'low', 'restricted', '{"is_fake":true,"purpose":"database_pilot"}'::jsonb, true
  )
on conflict (id) do nothing;

insert into public.counseling_cases (
  id, case_number, student_id, case_status, priority, risk_level,
  confidentiality_level, assigned_counselor_id, target_country, intended_major,
  summary, next_action
) values
  (
    '30000000-0000-4000-8000-000000000001', 'CASE-FAKE-0001',
    '20000000-0000-4000-8000-000000000001', 'active', 'high', 'medium',
    'restricted', '10000000-0000-4000-8000-000000000002', 'Canada', 'Data Science',
    'Fake case for database testing only.', 'Review fake test score evidence.'
  ),
  (
    '30000000-0000-4000-8000-000000000002', 'CASE-FAKE-0002',
    '20000000-0000-4000-8000-000000000002', 'assessment', 'urgent', 'high',
    'highly_restricted', '10000000-0000-4000-8000-000000000002', 'United Kingdom', 'Economics',
    'Fake high-risk case for access testing.', 'Confirm fake consent record.'
  )
on conflict (id) do nothing;

insert into public.counseling_sessions (
  id, counseling_case_id, student_id, counselor_id, scheduled_at,
  duration_minutes, mode, location, session_status, confidentiality_level,
  summary, next_action
) values
  (
    '40000000-0000-4000-8000-000000000001',
    '30000000-0000-4000-8000-000000000001',
    '20000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000002',
    now() + interval '2 days', 45, 'in_person', 'Pilot Room', 'scheduled', 'restricted',
    null, 'Complete the fake academic review task.'
  )
on conflict (id) do nothing;

insert into public.internal_tasks (
  id, counseling_case_id, student_id, counseling_session_id, title,
  description, assigned_to, task_status, priority, due_date,
  confidentiality_level, metadata
) values
  (
    '50000000-0000-4000-8000-000000000001',
    '30000000-0000-4000-8000-000000000001',
    '20000000-0000-4000-8000-000000000001',
    '40000000-0000-4000-8000-000000000001',
    'Review fake IELTS evidence', 'No real evidence is attached.',
    '10000000-0000-4000-8000-000000000002', 'todo', 'high', current_date + 5,
    'restricted', '{"is_fake":true}'::jsonb
  ),
  (
    '50000000-0000-4000-8000-000000000002',
    '30000000-0000-4000-8000-000000000002',
    '20000000-0000-4000-8000-000000000002', null,
    'Confirm fake parent consent', 'Pilot consent workflow only.',
    '10000000-0000-4000-8000-000000000002', 'in_progress', 'urgent', current_date + 2,
    'highly_restricted', '{"is_fake":true}'::jsonb
  )
on conflict (id) do nothing;

insert into public.test_scores (
  id, student_id, counseling_case_id, test_type, test_name, test_date,
  overall_score, score_scale, component_scores, is_verified,
  confidentiality_level, evidence_reference
) values
  (
    '60000000-0000-4000-8000-000000000001',
    '20000000-0000-4000-8000-000000000001',
    '30000000-0000-4000-8000-000000000001',
    'ielts', 'IELTS Academic - FAKE', current_date - 30, 7.00, '0-9',
    '{"listening":7.5,"reading":7.0,"writing":6.5,"speaking":7.0}'::jsonb,
    false, 'restricted', 'FAKE-REFERENCE-NO-REAL-FILE'
  ),
  (
    '60000000-0000-4000-8000-000000000002',
    '20000000-0000-4000-8000-000000000002',
    '30000000-0000-4000-8000-000000000002',
    'sat', 'Digital SAT - FAKE', current_date - 45, 1420, '400-1600',
    '{"math":740,"reading_writing":680}'::jsonb,
    false, 'restricted', null
  )
on conflict (id) do nothing;

insert into public.consents (
  id, student_id, counseling_case_id, consent_type, consent_status,
  granted_by_name, granted_by_relationship, granted_at,
  evidence_reference, notes, confidentiality_level
) values
  (
    '70000000-0000-4000-8000-000000000001',
    '20000000-0000-4000-8000-000000000001',
    '30000000-0000-4000-8000-000000000001',
    'counseling', 'granted', 'Phụ Huynh Mẫu 01', 'parent', now(),
    'FAKE-CONSENT-REFERENCE', 'Fake consent for pilot testing.', 'highly_restricted'
  ),
  (
    '70000000-0000-4000-8000-000000000002',
    '20000000-0000-4000-8000-000000000002',
    '30000000-0000-4000-8000-000000000002',
    'data_processing', 'pending', null, null, null,
    null, 'Fake pending consent.', 'highly_restricted'
  )
on conflict (id) do nothing;

insert into public.activity_logs (
  id, actor_id, student_id, counseling_case_id, entity_type, entity_id,
  action, confidentiality_level, previous_data, new_data, metadata
) values
  (
    '80000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000002',
    '20000000-0000-4000-8000-000000000001',
    '30000000-0000-4000-8000-000000000001',
    'counseling_case', '30000000-0000-4000-8000-000000000001',
    'case.created', 'restricted', null,
    '{"case_status":"active","is_fake":true}'::jsonb,
    '{"seed":"SUPABASE_SCHEMA.sql"}'::jsonb
  )
on conflict (id) do nothing;
