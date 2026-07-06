"use server";

import { revalidatePath } from "next/cache";
import { requireStaffRole } from "@/lib/auth/session";
import { saveStudentIntakeAssessment } from "@/lib/data/intake-assessments";
import type { StudentIntakeAssessmentFormValues } from "@/lib/intake-assessment";

function userFacingMutationError(technicalError: string) {
  if (/row-level security|permission denied|42501/i.test(technicalError)) {
    return "Supabase từ chối thao tác do quyền RLS. Hãy kiểm tra vai trò nhân sự và assessment được phân công.";
  }
  if (/duplicate key|student_intake_one_active/i.test(technicalError)) {
    return "Học sinh đã có Intake Assessment nhưng phiên hiện tại không đọc được bản ghi đó. Hãy kiểm tra policy SELECT head_admin_read_all_intakes và tải lại trang.";
  }
  if (/foreign key|violates.*constraint/i.test(technicalError)) {
    return "Dữ liệu liên kết chưa hợp lệ. Hãy kiểm tra chuyên viên phụ trách và hồ sơ tư vấn.";
  }
  return technicalError;
}

export async function saveStudentIntakeAssessmentAction(input: {
  assessmentId?: string;
  studentId: string;
  values: StudentIntakeAssessmentFormValues;
  event: "save" | "review";
}) {
  try {
    const session = await requireStaffRole([
      "ICCO_HEAD",
      "COUNSELOR",
      "ADMIN",
    ]);
    if (!input.assessmentId && session.staff.role === "COUNSELOR") {
      throw new Error("COUNSELOR chỉ được cập nhật đánh giá đã được phân công.");
    }
    const result = await saveStudentIntakeAssessment({
      ...input,
      staff: session.staff,
    });
    revalidatePath(`/portal/students/${input.studentId}`);
    revalidatePath("/portal/students");
    return { ok: true as const, result };
  } catch (error) {
    const technicalError =
      error instanceof Error ? error.message : "Unknown server action error";
    return {
      ok: false as const,
      error: userFacingMutationError(technicalError),
      technicalError,
    };
  }
}
