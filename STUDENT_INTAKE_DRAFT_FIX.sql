-- Student Intake Assessment Draft persistence fix
-- Apply only to the database-pilot Supabase project.
-- This migration does not import students, alter import gates, or grant anon access.

begin;

alter table public.student_intake_assessments
  alter column intake_date set default current_date,
  alter column assigned_counselor_id set default public.current_staff_profile_id(),
  alter column assessment_status set default 'Draft',
  alter column counseling_case_id drop not null,
  alter column request_source drop not null,
  alter column counseling_branch drop not null,
  alter column post_high_school_goal drop not null,
  alter column target_majors_text drop not null,
  alter column career_cluster drop not null,
  alter column target_countries drop not null,
  alter column target_universities_text drop not null,
  alter column scholarship_interest drop not null,
  alter column orientation_clarity_score drop not null,
  alter column goal_note drop not null,
  alter column gpa_summary drop not null,
  alter column strong_subjects drop not null,
  alter column weak_subjects drop not null,
  alter column academic_track drop not null,
  alter column ielts_score drop not null,
  alter column sat_total drop not null,
  alter column sat_math drop not null,
  alter column sat_rw drop not null,
  alter column other_certificates drop not null,
  alter column academic_readiness_score drop not null,
  alter column academic_gap_note drop not null,
  alter column activities_summary drop not null,
  alter column leadership_summary drop not null,
  alter column projects_summary drop not null,
  alter column awards_summary drop not null,
  alter column evidence_status drop not null,
  alter column highest_evidence_level drop not null,
  alter column profile_strength_score drop not null,
  alter column portfolio_readiness_status drop not null,
  alter column cv_status drop not null,
  alter column activity_list_status drop not null,
  alter column portfolio_evidence_status drop not null,
  alter column portfolio_gap_note drop not null,
  alter column parent_involvement_level drop not null,
  alter column geography_constraints drop not null,
  alter column budget_range drop not null,
  alter column safety_or_family_constraints drop not null,
  alter column sensitive_note drop not null,
  alter column nearest_deadline drop not null,
  alter column next_test_date drop not null,
  alter column application_season drop not null,
  alter column deadline_action_note drop not null,
  alter column overall_readiness_score drop not null,
  alter column key_strengths drop not null,
  alter column key_gaps drop not null,
  alter column risk_summary drop not null,
  alter column escalation_to drop not null,
  alter column intake_conclusion drop not null,
  alter column next_action drop not null,
  alter column next_owner_id drop not null,
  alter column next_due_date drop not null,
  alter column created_by drop not null,
  alter column updated_by drop not null,
  alter column deleted_at drop not null;

alter table public.student_intake_assessments enable row level security;
revoke all on table public.student_intake_assessments from anon;
revoke delete on table public.student_intake_assessments from authenticated;
grant select, insert, update on table public.student_intake_assessments to authenticated;

drop policy if exists head_admin_read_all_intakes on public.student_intake_assessments;
create policy head_admin_read_all_intakes
on public.student_intake_assessments for select to authenticated
using (
  deleted_at is null
  and public.current_staff_role() in ('ICCO_HEAD', 'ADMIN')
);

drop policy if exists counselor_read_assigned_intakes on public.student_intake_assessments;
create policy counselor_read_assigned_intakes
on public.student_intake_assessments for select to authenticated
using (
  deleted_at is null
  and public.current_staff_role() = 'COUNSELOR'
  and assigned_counselor_id = public.current_staff_profile_id()
);

drop policy if exists head_admin_create_intakes on public.student_intake_assessments;
create policy head_admin_create_intakes
on public.student_intake_assessments for insert to authenticated
with check (
  deleted_at is null
  and public.current_staff_role() in ('ICCO_HEAD', 'ADMIN')
  and assigned_counselor_id is not null
  and created_by = public.current_staff_profile_id()
  and updated_by = public.current_staff_profile_id()
);

drop policy if exists head_admin_update_intakes on public.student_intake_assessments;
create policy head_admin_update_intakes
on public.student_intake_assessments for update to authenticated
using (
  deleted_at is null
  and public.current_staff_role() in ('ICCO_HEAD', 'ADMIN')
)
with check (
  deleted_at is null
  and public.current_staff_role() in ('ICCO_HEAD', 'ADMIN')
  and assigned_counselor_id is not null
  and updated_by = public.current_staff_profile_id()
);

drop policy if exists counselor_update_assigned_intakes on public.student_intake_assessments;
create policy counselor_update_assigned_intakes
on public.student_intake_assessments for update to authenticated
using (
  deleted_at is null
  and public.current_staff_role() = 'COUNSELOR'
  and assigned_counselor_id = public.current_staff_profile_id()
)
with check (
  deleted_at is null
  and public.current_staff_role() = 'COUNSELOR'
  and assigned_counselor_id = public.current_staff_profile_id()
  and updated_by = public.current_staff_profile_id()
);

drop trigger if exists set_student_intake_assessments_updated_at
on public.student_intake_assessments;
create trigger set_student_intake_assessments_updated_at
before update on public.student_intake_assessments
for each row execute function public.set_updated_at();

create or replace function public.log_student_intake_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_action text;
  v_previous_data jsonb;
begin
  if tg_op = 'INSERT' then
    v_action := 'student_intake.created';
    v_previous_data := null;
  elsif new.assessment_status = 'Reviewed'
    and old.assessment_status is distinct from new.assessment_status then
    v_action := 'student_intake.reviewed';
    v_previous_data := jsonb_build_object(
      'assessment_status', old.assessment_status,
      'risk_level', old.risk_level,
      'assigned_counselor_id', old.assigned_counselor_id,
      'next_due_date', old.next_due_date
    );
  else
    v_action := 'student_intake.updated';
    v_previous_data := jsonb_build_object(
      'assessment_status', old.assessment_status,
      'risk_level', old.risk_level,
      'assigned_counselor_id', old.assigned_counselor_id,
      'next_due_date', old.next_due_date
    );
  end if;

  insert into public.activity_logs (
    actor_id, student_id, counseling_case_id, entity_type, entity_id,
    action, confidentiality_level, previous_data, new_data, metadata
  ) values (
    public.current_internal_user_id(), new.student_id, new.counseling_case_id,
    'student_intake_assessment', new.id, v_action, 'restricted',
    v_previous_data,
    jsonb_build_object(
      'assessment_status', new.assessment_status,
      'risk_level', new.risk_level,
      'assigned_counselor_id', new.assigned_counselor_id,
      'next_due_date', new.next_due_date
    ),
    jsonb_build_object(
      'actor_staff_profile_id', public.current_staff_profile_id(),
      'source', 'student_intake_assessment_trigger'
    )
  );
  return new;
end;
$$;

revoke all on function public.log_student_intake_change() from public, anon, authenticated;
drop trigger if exists audit_student_intake_change on public.student_intake_assessments;
create trigger audit_student_intake_change
after insert or update on public.student_intake_assessments
for each row execute function public.log_student_intake_change();

commit;
