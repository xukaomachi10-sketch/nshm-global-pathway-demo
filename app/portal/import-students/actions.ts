"use server";

import { revalidatePath } from "next/cache";
import {
  confirmStudentImport,
  type ConfirmStudentImportInput,
} from "@/lib/data/student-import";
import { requireStaffRole } from "@/lib/auth/session";

export async function confirmStudentImportAction(
  input: ConfirmStudentImportInput,
) {
  try {
    const session = await requireStaffRole(["ICCO_HEAD", "ADMIN"]);
    const result = await confirmStudentImport(input, session.accessToken);
    revalidatePath("/portal/import-students");
    revalidatePath("/portal/students");
    return { ok: true as const, result };
  } catch (error) {
    return {
      ok: false as const,
      error:
        error instanceof Error ? error.message : "Không thể hoàn tất import.",
    };
  }
}
