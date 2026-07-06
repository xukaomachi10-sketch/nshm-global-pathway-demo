import { students as demoStudents } from "@/lib/data";
import type {
  ActivityLog,
  ConsentRecord,
  CounselingCase,
  CounselingSession,
  InternalTask,
  InternalUser,
  StudentImportBatch,
  StudentImportStaging,
  StudentRecord,
  TestScore,
} from "@/types/database";
import type { InsertOf, UpdateOf } from "@/types/database";
import type { InternalOperationsRepository } from "./repository";

const now = "2026-07-02T03:00:00.000Z";

function id(group: number, index: number): string {
  return `00000000-0000-4${String(group).padStart(3, "0")}-8000-${String(
    index + 1,
  ).padStart(12, "0")}`;
}

const counselorNames = [...new Set(demoStudents.map((item) => item.counselor))];

const users: InternalUser[] = counselorNames.map((name, index) => ({
  id: id(1, index),
  auth_user_id: null,
  email: `fake.counselor${index + 1}@example.invalid`,
  full_name: name,
  role: index === 0 ? "manager" : "counselor",
  is_active: true,
  created_at: now,
  updated_at: now,
  deleted_at: null,
}));

const students: StudentRecord[] = demoStudents.map((student, index) => ({
  id: id(2, index),
  student_code: student.id,
  full_name: student.name,
  class_name: student.className,
  grade_level: Number.parseInt(student.className, 10) || null,
  graduation_year: student.graduationYear,
  date_of_birth: null,
  gender: null,
  homeroom_teacher: null,
  academic_track: null,
  student_email: `fake.${student.id.toLowerCase()}@example.invalid`,
  parent_name: null,
  parent_email: null,
  parent_phone: null,
  source_system: "mock_fixture",
  source_record_id: `FAKE-SOURCE-${student.id}`,
  is_active_student: true,
  is_fake: true,
  assigned_counselor_id:
    users.find((user) => user.full_name === student.counselor)?.id ?? null,
  target_country: student.country,
  target_university: student.targetUniversity,
  intended_major: student.major,
  risk_level:
    student.risk === "Cao"
      ? "high"
      : student.risk === "Trung bình"
        ? "medium"
        : "low",
  confidentiality_level: "restricted",
  profile_data: {
    is_fake: true,
    progress: student.progress,
    gpa: student.gpa,
    ielts: student.ielts,
    sat: student.sat,
    missing_items: student.missing,
  },
  created_at: now,
  updated_at: now,
  deleted_at: null,
  deleted_by: null,
  delete_reason: null,
}));

const counselingCases: CounselingCase[] = students
  .slice(0, 12)
  .map((student, index) => ({
    id: id(3, index),
    case_number: `CASE-PILOT-${String(index + 1).padStart(4, "0")}`,
    student_id: student.id,
    case_status: ["intake", "assessment", "active", "waiting_student"][
      index % 4
    ] as CounselingCase["case_status"],
    priority: index < 2 ? "high" : "normal",
    risk_level: student.risk_level,
    confidentiality_level: student.confidentiality_level,
    assigned_counselor_id: student.assigned_counselor_id,
    opened_at: `2026-06-${String(10 + index).padStart(2, "0")}T02:00:00.000Z`,
    target_country: student.target_country,
    intended_major: student.intended_major,
    summary: "Fake counseling case for repository testing only.",
    next_action: "Review portfolio readiness and target university list.",
    closed_at: null,
    created_at: now,
    updated_at: now,
    deleted_at: null,
  }));

const counselingSessions: CounselingSession[] = counselingCases
  .slice(0, 6)
  .map((counselingCase, index) => ({
    id: id(4, index),
    counseling_case_id: counselingCase.id,
    student_id: counselingCase.student_id,
    counselor_id: counselingCase.assigned_counselor_id ?? users[0].id,
    scheduled_at: `2026-07-0${2 + index}T0${8 + index}:00:00.000Z`,
    duration_minutes: 45,
    mode: index % 2 === 0 ? "in_person" : "online",
    location: index % 2 === 0 ? "Phòng HTQT Pilot" : "Pilot video call",
    session_status: index < 2 ? "completed" : "scheduled",
    confidentiality_level: counselingCase.confidentiality_level,
    summary: index < 2 ? "Fake session summary." : null,
    next_action: "Complete the next pilot task.",
    created_at: now,
    updated_at: now,
    deleted_at: null,
  }));

const internalTasks: InternalTask[] = counselingCases
  .slice(0, 10)
  .map((counselingCase, index) => ({
    id: id(5, index),
    counseling_case_id: counselingCase.id,
    student_id: counselingCase.student_id,
    counseling_session_id: counselingSessions[index]?.id ?? null,
    title: [
      "Review academic data",
      "Verify activity evidence",
      "Draft university list",
      "Prepare counseling notes",
    ][index % 4],
    description: "Fake internal task for the database pilot.",
    assigned_to: counselingCase.assigned_counselor_id,
    task_status: index < 3 ? "in_progress" : "todo",
    priority: index < 2 ? "urgent" : index < 5 ? "high" : "normal",
    due_date: `2026-07-${String(3 + index).padStart(2, "0")}`,
    completed_at: null,
    confidentiality_level: counselingCase.confidentiality_level,
    metadata: { is_fake: true },
    created_at: now,
    updated_at: now,
    deleted_at: null,
  }));

const testScores: TestScore[] = students.slice(0, 8).flatMap((student, index) => [
  {
    id: id(6, index * 2),
    student_id: student.id,
    counseling_case_id: counselingCases[index]?.id ?? null,
    test_type: "ielts",
    test_name: "IELTS Academic (fake)",
    test_date: `2026-0${(index % 6) + 1}-15`,
    overall_score: 6.5 + (index % 4) * 0.5,
    score_scale: "0-9",
    component_scores: { listening: 7, reading: 7, writing: 6.5, speaking: 6.5 },
    is_verified: index % 2 === 0,
    verified_by: index % 2 === 0 ? users[0].id : null,
    verified_at: index % 2 === 0 ? now : null,
    evidence_reference: "FAKE-EVIDENCE-NOT-A-REAL-FILE",
    confidentiality_level: "restricted",
    created_at: now,
    updated_at: now,
    deleted_at: null,
  },
  {
    id: id(6, index * 2 + 1),
    student_id: student.id,
    counseling_case_id: counselingCases[index]?.id ?? null,
    test_type: "sat",
    test_name: "Digital SAT (fake)",
    test_date: `2026-0${(index % 6) + 1}-20`,
    overall_score: 1250 + index * 30,
    score_scale: "400-1600",
    component_scores: { math: 650 + index * 10, reading_writing: 600 + index * 20 },
    is_verified: false,
    verified_by: null,
    verified_at: null,
    evidence_reference: null,
    confidentiality_level: "restricted",
    created_at: now,
    updated_at: now,
    deleted_at: null,
  },
]);

const consents: ConsentRecord[] = students.slice(0, 10).map((student, index) => ({
  id: id(7, index),
  student_id: student.id,
  counseling_case_id: counselingCases[index]?.id ?? null,
  consent_type: index % 2 === 0 ? "counseling" : "data_processing",
  consent_status: index < 8 ? "granted" : "pending",
  granted_by_name: index < 8 ? "Fake Parent" : null,
  granted_by_relationship: index < 8 ? "parent" : null,
  granted_at: index < 8 ? now : null,
  expires_at: null,
  withdrawn_at: null,
  evidence_reference: index < 8 ? "FAKE-CONSENT-REFERENCE" : null,
  notes: "Fake consent record for pilot testing.",
  confidentiality_level: "highly_restricted",
  created_at: now,
  updated_at: now,
  deleted_at: null,
}));

const activityLogs: ActivityLog[] = counselingCases
  .slice(0, 12)
  .map((counselingCase, index) => ({
    id: id(8, index),
    actor_id: counselingCase.assigned_counselor_id,
    student_id: counselingCase.student_id,
    counseling_case_id: counselingCase.id,
    entity_type: index % 2 === 0 ? "counseling_case" : "internal_task",
    entity_id:
      index % 2 === 0
        ? counselingCase.id
        : internalTasks[index]?.id ?? counselingCase.id,
    action: index % 2 === 0 ? "case.reviewed" : "task.updated",
    confidentiality_level: counselingCase.confidentiality_level,
    previous_data: null,
    new_data: { source: "mock", is_fake: true },
    metadata: { pilot: true },
    created_at: `2026-07-02T${String(index).padStart(2, "0")}:00:00.000Z`,
  }));

const studentImportBatches: StudentImportBatch[] = [];
const studentImportStaging: StudentImportStaging[] = [];

function createId(): string {
  return globalThis.crypto.randomUUID();
}

function timestamps<T extends { created_at?: string; updated_at?: string }>(
  input: T,
) {
  const timestamp = new Date().toISOString();
  return {
    ...input,
    created_at: input.created_at ?? timestamp,
    updated_at: input.updated_at ?? timestamp,
  };
}

function take<T>(rows: T[], limit = 50): Promise<T[]> {
  return Promise.resolve(rows.slice(0, Math.max(0, limit)));
}

export class MockInternalOperationsRepository
  implements InternalOperationsRepository
{
  readonly mode = "mock" as const;

  listUsers(limit?: number) {
    return take(users, limit);
  }

  listStudents(limit?: number) {
    return take(students, limit);
  }

  listCounselingCases(limit?: number) {
    return take(counselingCases, limit);
  }

  listCounselingSessions(limit?: number) {
    return take(counselingSessions, limit);
  }

  listInternalTasks(limit?: number) {
    return take(internalTasks, limit);
  }

  listTestScores(limit?: number) {
    return take(testScores, limit);
  }

  listConsents(limit?: number) {
    return take(consents, limit);
  }

  listActivityLogs(limit?: number) {
    return take(activityLogs, limit);
  }

  createInternalTask(input: InsertOf<"internal_tasks">) {
    const task = timestamps({
      id: input.id ?? createId(),
      counseling_case_id: input.counseling_case_id ?? null,
      student_id: input.student_id ?? null,
      counseling_session_id: input.counseling_session_id ?? null,
      title: input.title,
      description: input.description ?? null,
      assigned_to: input.assigned_to ?? null,
      task_status: input.task_status ?? "todo",
      priority: input.priority ?? "normal",
      due_date: input.due_date ?? null,
      completed_at: input.completed_at ?? null,
      confidentiality_level: input.confidentiality_level ?? "restricted",
      metadata: input.metadata ?? { is_fake: true },
      deleted_at: input.deleted_at ?? null,
      created_at: input.created_at,
      updated_at: input.updated_at,
    }) satisfies InternalTask;
    internalTasks.unshift(task);
    return Promise.resolve(task);
  }

  updateInternalTask(id: string, input: UpdateOf<"internal_tasks">) {
    const index = internalTasks.findIndex((task) => task.id === id);
    if (index < 0) throw new Error("Mock task not found.");
    const task = {
      ...internalTasks[index],
      ...input,
      id,
      updated_at: new Date().toISOString(),
    } satisfies InternalTask;
    internalTasks[index] = task;
    return Promise.resolve(task);
  }

  createCounselingSession(input: InsertOf<"counseling_sessions">) {
    const session = timestamps({
      id: input.id ?? createId(),
      counseling_case_id: input.counseling_case_id,
      student_id: input.student_id,
      counselor_id: input.counselor_id,
      scheduled_at: input.scheduled_at,
      duration_minutes: input.duration_minutes ?? 45,
      mode: input.mode ?? "in_person",
      location: input.location ?? null,
      session_status: input.session_status ?? "scheduled",
      confidentiality_level: input.confidentiality_level ?? "restricted",
      summary: input.summary ?? null,
      next_action: input.next_action ?? null,
      deleted_at: input.deleted_at ?? null,
      created_at: input.created_at,
      updated_at: input.updated_at,
    }) satisfies CounselingSession;
    counselingSessions.unshift(session);
    return Promise.resolve(session);
  }

  updateCounselingSession(
    id: string,
    input: UpdateOf<"counseling_sessions">,
  ) {
    const index = counselingSessions.findIndex((session) => session.id === id);
    if (index < 0) throw new Error("Mock counseling session not found.");
    const session = {
      ...counselingSessions[index],
      ...input,
      id,
      updated_at: new Date().toISOString(),
    } satisfies CounselingSession;
    counselingSessions[index] = session;
    return Promise.resolve(session);
  }

  createActivityLog(input: InsertOf<"activity_logs">) {
    const log: ActivityLog = {
      id: input.id ?? createId(),
      actor_id: input.actor_id ?? null,
      student_id: input.student_id ?? null,
      counseling_case_id: input.counseling_case_id ?? null,
      entity_type: input.entity_type,
      entity_id: input.entity_id ?? null,
      action: input.action,
      confidentiality_level: input.confidentiality_level ?? "restricted",
      previous_data: input.previous_data ?? null,
      new_data: input.new_data ?? null,
      metadata: input.metadata ?? { pilot: true },
      created_at: input.created_at ?? new Date().toISOString(),
    };
    activityLogs.unshift(log);
    return Promise.resolve(log);
  }

  createActivityLogs(input: InsertOf<"activity_logs">[]) {
    return Promise.all(input.map((item) => this.createActivityLog(item)));
  }

  upsertStudents(input: InsertOf<"students">[]) {
    const result = input.map((candidate) => {
      const index = students.findIndex(
        (student) => student.student_code === candidate.student_code,
      );
      if (index >= 0) {
        const updated = {
          ...students[index],
          ...candidate,
          id: students[index].id,
          deleted_at: students[index].deleted_at,
          updated_at: new Date().toISOString(),
        } satisfies StudentRecord;
        students[index] = updated;
        return updated;
      }
      const created = timestamps({
        ...candidate,
        id: candidate.id ?? createId(),
        created_at: candidate.created_at,
        updated_at: candidate.updated_at,
        deleted_at: candidate.deleted_at ?? null,
      }) satisfies StudentRecord;
      students.unshift(created);
      return created;
    });
    return Promise.resolve(result);
  }

  createStudentImportBatch(input: InsertOf<"student_import_batches">) {
    const batch = timestamps({
      ...input,
      id: input.id ?? createId(),
      created_at: input.created_at,
      updated_at: input.updated_at,
      deleted_at: input.deleted_at ?? null,
    }) satisfies StudentImportBatch;
    studentImportBatches.unshift(batch);
    return Promise.resolve(batch);
  }

  updateStudentImportBatch(
    id: string,
    input: UpdateOf<"student_import_batches">,
  ) {
    const index = studentImportBatches.findIndex((batch) => batch.id === id);
    if (index < 0) throw new Error("Mock import batch not found.");
    const batch = {
      ...studentImportBatches[index],
      ...input,
      id,
      updated_at: new Date().toISOString(),
    } satisfies StudentImportBatch;
    studentImportBatches[index] = batch;
    return Promise.resolve(batch);
  }

  createStudentImportStaging(
    input: InsertOf<"student_import_staging">[],
  ) {
    const rows = input.map((candidate) => {
      const row = timestamps({
        ...candidate,
        id: candidate.id ?? createId(),
        created_at: candidate.created_at,
        updated_at: candidate.updated_at,
        deleted_at: candidate.deleted_at ?? null,
      }) satisfies StudentImportStaging;
      studentImportStaging.push(row);
      return row;
    });
    return Promise.resolve(rows);
  }

  importFakeStudentsTransaction(): Promise<never> {
    return Promise.reject(
      new Error("Mock imports use the in-memory pilot transaction path."),
    );
  }

  importRealStudentsTransaction(): Promise<never> {
    return Promise.reject(
      new Error("Real student import is unavailable in mock mode."),
    );
  }
}
