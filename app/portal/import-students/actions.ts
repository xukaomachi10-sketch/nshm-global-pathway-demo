"use server";

import { revalidatePath } from "next/cache";
import {
  confirmStudentImport,
  type ConfirmStudentImportInput,
} from "@/lib/data/student-import";
import { requireStaffRole } from "@/lib/auth/session";
import { isRealStudentImportEnabled } from "@/lib/features";

export async function confirmStudentImportAction(
  input: ConfirmStudentImportInput,
) {
  try {
    const session = await requireStaffRole(["ICCO_HEAD", "ADMIN"]);
    if (input.mode === "real" && !isRealStudentImportEnabled()) {
      return { ok: false as const, error: "Real student import is disabled." };
    }
    if (input.mode === "real" && session.mode !== "supabase") {
      return {
        ok: false as const,
        error: "Real student import requires the authenticated Supabase Preview.",
      };
    }
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
