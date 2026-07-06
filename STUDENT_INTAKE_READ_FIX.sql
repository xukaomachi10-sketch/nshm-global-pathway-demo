-- Student Intake Assessment exact read/update-mode fix
-- Apply only to the database-pilot Supabase project.
-- This function preserves role scope and grants no anonymous access.

begin;

create or replace function public.get_student_intake_assessment(
  p_student_id uuid
)
returns setof public.student_intake_assessments
language sql
stable
security definer
set search_path = public
as $$
  select sia.*
  from public.student_intake_assessments sia
  where sia.student_id = p_student_id
    and sia.deleted_at is null
    and public.is_active_staff()
    and (
      public.current_staff_role() in ('ICCO_HEAD', 'ADMIN')
      or (
        public.current_staff_role() = 'COUNSELOR'
        and sia.assigned_counselor_id = public.current_staff_profile_id()
      )
    )
  order by sia.created_at desc
  limit 1
$$;

revoke all on function public.get_student_intake_assessment(uuid)
from public, anon;
grant execute on function public.get_student_intake_assessment(uuid)
to authenticated;

commit;
