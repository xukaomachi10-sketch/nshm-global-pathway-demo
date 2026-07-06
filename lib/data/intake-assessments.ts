import { createInternalOperationsRepository } from "@/lib/data-access";
import { MockInternalOperationsRepository } from "@/lib/data-access/mock-repository";
import { getRepositoryAccessToken } from "@/lib/auth/session";
import type {
  StaffProfile,
  StudentIntakeAssessment,
} from "@/types/database";
import type { InsertOf, UpdateOf } from "@/types/database";
import { activityBase, readWithMockFallback } from "./shared";
import {
  intakeConclusionTemplate,
  type StudentIntakeAssessmentFormValues,
} from "@/lib/intake-assessment";

export type SaveStudentIntakeAssessmentInput = {
  assessmentId?: string;
  studentId: string;
  staff: Pick<StaffProfile, "id">;
  values: StudentIntakeAssessmentFormValues;
  event: "save" | "review";
};

const reviewFieldLabels = {
  counseling_branch: "Nhánh tư vấn",
  priority_level: "Mức ưu tiên",
  risk_level: "Mức rủi ro",
  next_action: "Hành động tiếp theo",
  intake_conclusion: "Kết luận intake",
} as const;

function validateReview(values: StudentIntakeAssessmentFormValues) {
  const missing = Object.entries(reviewFieldLabels)
    .filter(([key]) => {
      const value = values[key as keyof typeof reviewFieldLabels];
      if (key === "intake_conclusion") {
        return !value || value.trim() === intakeConclusionTemplate.trim();
      }
      return typeof value === "string" ? !value.trim() : !value;
    })
    .map(([, label]) => label);

  if (missing.length) {
    throw new Error(
      `Chưa thể đánh dấu Đã rà soát. Vui lòng bổ sung: ${missing.join(", ")}.`,
    );
  }
}

function draftPayloadValues(values: StudentIntakeAssessmentFormValues) {
  return Object.fromEntries(
    Object.entries(values).filter(
      ([, value]) => value !== null && value !== undefined && value !== "",
    ),
  ) as Partial<StudentIntakeAssessmentFormValues>;
}

export async function getStudentIntakeWorkspace(studentId: string) {
  return readWithMockFallback("hồ sơ đánh giá đầu vào", async (repository) => {
    const [student, cases, tasks, sessions, assessments, staffProfiles] =
      await Promise.all([
        repository.getStudentById(studentId),
        repository.listCounselingCases(1000),
        repository.listInternalTasks(1000),
        repository.listCounselingSessions(1000),
        repository.listStudentIntakeAssessments(1000),
        repository.listStaffProfiles(100),
      ]);
    if (!student) return null;

    return {
      student,
      cases: cases.filter((item) => item.student_id === student.id),
      tasks: tasks.filter((item) => item.student_id === student.id),
      sessions: sessions.filter((item) => item.student_id === student.id),
      assessment:
        assessments.find((item) => item.student_id === student.id) ?? null,
      staffProfiles: staffProfiles.filter((item) => item.is_active),
    };
  });
}

export async function saveStudentIntakeAssessment(
  input: SaveStudentIntakeAssessmentInput,
) {
  if (!input.studentId) throw new Error("Không xác định được học sinh.");
  if (!input.values.intake_date) throw new Error("Ngày tiếp nhận là bắt buộc.");
  if (
    input.event === "review" ||
    input.values.assessment_status === "Reviewed"
  ) {
    if (!input.assessmentId) {
      throw new Error("Hãy tạo và lưu bản Draft trước khi đánh dấu đã rà soát.");
    }
    validateReview(input.values);
  }

  const selected = createInternalOperationsRepository(
    await getRepositoryAccessToken(),
  );
  const repository = selected.repository;
  const values = {
    ...input.values,
    assigned_counselor_id:
      input.values.assigned_counselor_id || input.staff.id,
    assessment_status:
      input.event === "review" ? "Reviewed" : input.values.assessment_status,
    updated_by: input.staff.id,
  } satisfies UpdateOf<"student_intake_assessments">;

  let assessment: StudentIntakeAssessment;
  if (input.assessmentId) {
    assessment = await repository.updateStudentIntakeAssessment(
      input.assessmentId,
      values,
    );
  } else {
    const payload = {
      ...(repository instanceof MockInternalOperationsRepository
        ? input.values
        : draftPayloadValues(input.values)),
      student_id: input.studentId,
      intake_date: input.values.intake_date,
      assigned_counselor_id:
        input.values.assigned_counselor_id || input.staff.id,
      assessment_status: "Draft" as const,
      created_by: input.staff.id,
      updated_by: input.staff.id,
    } as InsertOf<"student_intake_assessments">;
    assessment = await repository.createStudentIntakeAssessment(payload);
  }

  // Supabase writes its audit event in a database trigger so record + audit are
  // atomic. Mock mode mirrors the same observable behavior in memory.
  if (repository instanceof MockInternalOperationsRepository) {
    await repository.createActivityLog(
      activityBase({
        studentId: assessment.student_id,
        caseId: assessment.counseling_case_id,
        entityType: "student_intake_assessment",
        entityId: assessment.id,
        action: input.assessmentId
          ? input.event === "review"
            ? "student_intake.reviewed"
            : "student_intake.updated"
          : "student_intake.created",
        record: {
          assessment_status: assessment.assessment_status,
          risk_level: assessment.risk_level,
          assigned_counselor_id: assessment.assigned_counselor_id,
          actor_staff_profile_id: input.staff.id,
        },
      }),
    );
  }

  return { data: assessment, status: selected.status, activityLogged: true };
}
