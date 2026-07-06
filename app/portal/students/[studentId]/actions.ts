"use server";

import { revalidatePath } from "next/cache";
import { requireStaffRole } from "@/lib/auth/session";
import { saveStudentIntakeAssessment } from "@/lib/data/intake-assessments";
import type { StudentIntakeAssessmentFormValues } from "@/lib/intake-assessment";

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
    return {
      ok: false as const,
      error:
        error instanceof Error
          ? error.message
          : "Không thể lưu đánh giá đầu vào.",
    };
  }
}
