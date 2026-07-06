"use server";

import { revalidatePath } from "next/cache";
import {
  createSession,
  updateSession,
  type CreateSessionInput,
  type UpdateSessionInput,
} from "@/lib/data/sessions";
import { requireStaffRole } from "@/lib/auth/session";

export async function createSessionAction(input: CreateSessionInput) {
  try {
    await requireStaffRole(["ICCO_HEAD", "COUNSELOR", "ADMIN"]);
    const result = await createSession(input);
    revalidatePath("/portal/sessions");
    return { ok: true as const, result };
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : "Không thể tạo lịch tư vấn.",
    };
  }
}

export async function updateSessionAction(input: UpdateSessionInput) {
  try {
    await requireStaffRole(["ICCO_HEAD", "COUNSELOR", "ADMIN"]);
    const result = await updateSession(input);
    revalidatePath("/portal/sessions");
    return { ok: true as const, result };
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : "Không thể cập nhật lịch tư vấn.",
    };
  }
}
