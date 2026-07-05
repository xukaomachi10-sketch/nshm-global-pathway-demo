import type {
  ActivityLog,
  ConsentRecord,
  CounselingCase,
  CounselingSession,
  InternalTask,
  InternalUser,
  StudentRecord,
  TestScore,
} from "@/types/database";
import type { InsertOf, UpdateOf } from "@/types/database";
import type { DataMode } from "./config";

export interface InternalOperationsRepository {
  readonly mode: DataMode;
  listUsers(limit?: number): Promise<InternalUser[]>;
  listStudents(limit?: number): Promise<StudentRecord[]>;
  listCounselingCases(limit?: number): Promise<CounselingCase[]>;
  listCounselingSessions(limit?: number): Promise<CounselingSession[]>;
  listInternalTasks(limit?: number): Promise<InternalTask[]>;
  listTestScores(limit?: number): Promise<TestScore[]>;
  listConsents(limit?: number): Promise<ConsentRecord[]>;
  listActivityLogs(limit?: number): Promise<ActivityLog[]>;
  createInternalTask(input: InsertOf<"internal_tasks">): Promise<InternalTask>;
  updateInternalTask(
    id: string,
    input: UpdateOf<"internal_tasks">,
  ): Promise<InternalTask>;
  createCounselingSession(
    input: InsertOf<"counseling_sessions">,
  ): Promise<CounselingSession>;
  updateCounselingSession(
    id: string,
    input: UpdateOf<"counseling_sessions">,
  ): Promise<CounselingSession>;
  createActivityLog(input: InsertOf<"activity_logs">): Promise<ActivityLog>;
}
