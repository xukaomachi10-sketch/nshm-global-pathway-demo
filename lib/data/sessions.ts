import { activityBase, mutateWithActivityLog, readWithMockFallback } from "./shared";
import type {
  CounselingSession,
  SessionStatus,
} from "@/types/database";
import type { InsertOf, UpdateOf } from "@/types/database";

export type CreateSessionInput = {
  studentId: string;
  caseId: string;
  counselorId: string;
  scheduledAt: string;
  durationMinutes: number;
  mode: CounselingSession["mode"];
  location?: string | null;
  nextAction?: string | null;
};

export type UpdateSessionInput = {
  id: string;
  scheduledAt?: string;
  durationMinutes?: number;
  mode?: CounselingSession["mode"];
  location?: string | null;
  sessionStatus?: SessionStatus;
  summary?: string | null;
  nextAction?: string | null;
};

export async function getSessionsWorkspace() {
  return readWithMockFallback("lịch tư vấn", async (repository) => {
    const [sessions, students, cases] = await Promise.all([
      repository.listCounselingSessions(1000),
      repository.listStudents(1000),
      repository.listCounselingCases(1000),
    ]);
    return { sessions, students, cases };
  });
}

export async function createSession(input: CreateSessionInput) {
  if (!input.studentId || !input.caseId || !input.counselorId || !input.scheduledAt) {
    throw new Error("Học sinh, hồ sơ, chuyên viên và thời gian là bắt buộc.");
  }

  const payload: InsertOf<"counseling_sessions"> = {
    counseling_case_id: input.caseId,
    student_id: input.studentId,
    counselor_id: input.counselorId,
    scheduled_at: new Date(input.scheduledAt).toISOString(),
    duration_minutes: input.durationMinutes,
    mode: input.mode,
    location: input.location?.trim() || null,
    session_status: "scheduled",
    confidentiality_level: "restricted",
    summary: null,
    next_action: input.nextAction?.trim() || null,
  };

  return mutateWithActivityLog({
    subject: "lịch tư vấn mới",
    mutate: (repository) => repository.createCounselingSession(payload),
    activity: (session) =>
      activityBase({
        actorId: session.counselor_id,
        studentId: session.student_id,
        caseId: session.counseling_case_id,
        entityType: "counseling_session",
        entityId: session.id,
        action: "session.created",
        record: session,
      }),
  });
}

export async function updateSession(input: UpdateSessionInput) {
  const payload: UpdateOf<"counseling_sessions"> = {
    ...(input.scheduledAt
      ? { scheduled_at: new Date(input.scheduledAt).toISOString() }
      : {}),
    ...(input.durationMinutes
      ? { duration_minutes: input.durationMinutes }
      : {}),
    ...(input.mode ? { mode: input.mode } : {}),
    ...(input.location !== undefined
      ? { location: input.location?.trim() || null }
      : {}),
    ...(input.sessionStatus ? { session_status: input.sessionStatus } : {}),
    ...(input.summary !== undefined
      ? { summary: input.summary?.trim() || null }
      : {}),
    ...(input.nextAction !== undefined
      ? { next_action: input.nextAction?.trim() || null }
      : {}),
  };

  return mutateWithActivityLog<CounselingSession>({
    subject: "cập nhật lịch tư vấn",
    mutate: (repository) =>
      repository.updateCounselingSession(input.id, payload),
    activity: (session) =>
      activityBase({
        actorId: session.counselor_id,
        studentId: session.student_id,
        caseId: session.counseling_case_id,
        entityType: "counseling_session",
        entityId: session.id,
        action: "session.updated",
        record: session,
      }),
  });
}
