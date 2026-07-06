"use server";

import { revalidatePath } from "next/cache";
import {
  createTask,
  updateTask,
  type CreateTaskInput,
  type UpdateTaskInput,
} from "@/lib/data/tasks";
import { requireStaffRole } from "@/lib/auth/session";

export async function createTaskAction(input: CreateTaskInput) {
  try {
    await requireStaffRole(["ICCO_HEAD", "COUNSELOR", "ADMIN"]);
    const result = await createTask(input);
    revalidatePath("/portal/tasks");
    return { ok: true as const, result };
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : "Không thể tạo công việc.",
    };
  }
}

export async function updateTaskAction(input: UpdateTaskInput) {
  try {
    await requireStaffRole(["ICCO_HEAD", "COUNSELOR", "ADMIN"]);
    const result = await updateTask(input);
    revalidatePath("/portal/tasks");
    return { ok: true as const, result };
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : "Không thể cập nhật công việc.",
    };
  }
}
