import { activityBase, mutateWithActivityLog, readWithMockFallback } from "./shared";
import type {
  InternalTask,
  Priority,
  TaskStatus,
} from "@/types/database";
import type { InsertOf, UpdateOf } from "@/types/database";

export type CreateTaskInput = {
  title: string;
  description?: string;
  studentId: string;
  caseId?: string | null;
  assignedTo?: string | null;
  priority: Priority;
  dueDate?: string | null;
};

export type UpdateTaskInput = {
  id: string;
  title?: string;
  description?: string | null;
  taskStatus?: TaskStatus;
  priority?: Priority;
  dueDate?: string | null;
};

export async function getTasksWorkspace() {
  return readWithMockFallback("công việc nội bộ", async (repository) => {
    const [tasks, students, cases] = await Promise.all([
      repository.listInternalTasks(1000),
      repository.listStudents(1000),
      repository.listCounselingCases(1000),
    ]);
    return { tasks, students, cases };
  });
}

export async function createTask(input: CreateTaskInput) {
  if (!input.title.trim() || !input.studentId) {
    throw new Error("Tiêu đề và học sinh là bắt buộc.");
  }

  const payload: InsertOf<"internal_tasks"> = {
    counseling_case_id: input.caseId ?? null,
    student_id: input.studentId,
    counseling_session_id: null,
    title: input.title.trim(),
    description: input.description?.trim() || null,
    assigned_to: input.assignedTo ?? null,
    task_status: "todo",
    priority: input.priority,
    due_date: input.dueDate || null,
    completed_at: null,
    confidentiality_level: "restricted",
    metadata: { is_fake: true, pilot: true },
  };

  return mutateWithActivityLog({
    subject: "công việc mới",
    mutate: (repository) => repository.createInternalTask(payload),
    activity: (task) =>
      activityBase({
        actorId: task.assigned_to,
        studentId: task.student_id,
        caseId: task.counseling_case_id,
        entityType: "internal_task",
        entityId: task.id,
        action: "task.created",
        record: task,
      }),
  });
}

export async function updateTask(input: UpdateTaskInput) {
  const payload: UpdateOf<"internal_tasks"> = {
    ...(input.title !== undefined ? { title: input.title.trim() } : {}),
    ...(input.description !== undefined
      ? { description: input.description?.trim() || null }
      : {}),
    ...(input.priority ? { priority: input.priority } : {}),
    ...(input.dueDate !== undefined ? { due_date: input.dueDate || null } : {}),
    ...(input.taskStatus
      ? {
          task_status: input.taskStatus,
          completed_at:
            input.taskStatus === "done" ? new Date().toISOString() : null,
        }
      : {}),
  };

  return mutateWithActivityLog<InternalTask>({
    subject: "cập nhật công việc",
    mutate: (repository) => repository.updateInternalTask(input.id, payload),
    activity: (task) =>
      activityBase({
        actorId: task.assigned_to,
        studentId: task.student_id,
        caseId: task.counseling_case_id,
        entityType: "internal_task",
        entityId: task.id,
        action: "task.updated",
        record: task,
      }),
  });
}
