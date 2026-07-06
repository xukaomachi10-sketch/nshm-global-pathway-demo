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
import type { Json } from "@/types/database";
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
  createActivityLogs(input: InsertOf<"activity_logs">[]): Promise<ActivityLog[]>;
  upsertStudents(
    input: InsertOf<"students">[],
  ): Promise<StudentRecord[]>;
  createStudentImportBatch(
    input: InsertOf<"student_import_batches">,
  ): Promise<StudentImportBatch>;
  updateStudentImportBatch(
    id: string,
    input: UpdateOf<"student_import_batches">,
  ): Promise<StudentImportBatch>;
  createStudentImportStaging(
    input: InsertOf<"student_import_staging">[],
  ): Promise<StudentImportStaging[]>;
  importFakeStudentsTransaction(input: {
    fileName: string;
    fileSize: number;
    rows: Json;
  }): Promise<{
    batch_id: string;
    total_rows: number;
    valid_rows: number;
    error_rows: number;
    new_students: number;
    updated_students: number;
    imported_students: number;
  }>;
  importRealStudentsTransaction(input: {
    fileName: string;
    fileSize: number;
    rows: Json;
  }): Promise<{
    batch_id: string;
    total_rows: number;
    valid_rows: number;
    error_rows: number;
    new_students: number;
    updated_students: number;
    imported_students: number;
  }>;
}
