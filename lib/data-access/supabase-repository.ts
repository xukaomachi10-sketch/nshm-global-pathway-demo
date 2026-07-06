import type { InternalOperationsRepository } from "./repository";
import type {
  InsertOf,
  RowOf,
  TableName,
  UpdateOf,
} from "@/types/database";

type SupabaseConfig = {
  url: string;
  apiKey: string;
  accessToken?: string;
};

export class SupabaseInternalOperationsRepository
  implements InternalOperationsRepository
{
  readonly mode = "supabase" as const;

  constructor(private readonly config: SupabaseConfig) {}

  private async select<T extends TableName>(
    table: T,
    limit = 50,
    filters: Record<string, string> = {},
  ): Promise<RowOf<T>[]> {
    const endpoint = new URL(`/rest/v1/${table}`, this.config.url);
    endpoint.searchParams.set("select", "*");
    endpoint.searchParams.set("limit", String(Math.max(0, limit)));
    endpoint.searchParams.set("order", "created_at.desc");
    Object.entries(filters).forEach(([key, value]) => {
      endpoint.searchParams.set(key, value);
    });

    const response = await fetch(endpoint, {
      cache: "no-store",
      headers: {
        apikey: this.config.apiKey,
        Authorization: `Bearer ${this.config.accessToken ?? this.config.apiKey}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(
        `Supabase ${table} query failed (${response.status}): ${detail}`,
      );
    }

    return (await response.json()) as RowOf<T>[];
  }

  private async mutate<T extends TableName>(
    table: T,
    method: "POST" | "PATCH",
    input: InsertOf<T> | UpdateOf<T>,
    id?: string,
  ): Promise<RowOf<T>> {
    const endpoint = new URL(`/rest/v1/${table}`, this.config.url);
    if (id) endpoint.searchParams.set("id", `eq.${id}`);

    const response = await fetch(endpoint, {
      method,
      cache: "no-store",
      headers: {
        apikey: this.config.apiKey,
        Authorization: `Bearer ${this.config.accessToken ?? this.config.apiKey}`,
        Accept: "application/json",
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(
        `Supabase ${table} mutation failed (${response.status}): ${detail}`,
      );
    }

    const rows = (await response.json()) as RowOf<T>[];
    if (!rows[0]) throw new Error(`Supabase ${table} returned no record.`);
    return rows[0];
  }

  private async insertMany<T extends TableName>(
    table: T,
    input: InsertOf<T>[],
    onConflict?: string,
  ): Promise<RowOf<T>[]> {
    if (!input.length) return [];
    const endpoint = new URL(`/rest/v1/${table}`, this.config.url);
    if (onConflict) endpoint.searchParams.set("on_conflict", onConflict);
    const response = await fetch(endpoint, {
      method: "POST",
      cache: "no-store",
      headers: {
        apikey: this.config.apiKey,
        Authorization: `Bearer ${this.config.accessToken ?? this.config.apiKey}`,
        Accept: "application/json",
        "Content-Type": "application/json",
        Prefer: onConflict
          ? "resolution=merge-duplicates,return=representation"
          : "return=representation",
      },
      body: JSON.stringify(input),
    });
    if (!response.ok) {
      const detail = await response.text();
      throw new Error(
        `Supabase ${table} bulk insert failed (${response.status}): ${detail}`,
      );
    }
    return (await response.json()) as RowOf<T>[];
  }

  listUsers(limit?: number) {
    return this.select("users", limit);
  }

  listStaffProfiles(limit?: number) {
    return this.select("staff_profiles", limit);
  }

  listStudents(limit?: number) {
    return this.select("students", limit, {
      deleted_at: "is.null",
      ...(this.config.accessToken ? {} : { student_code: "like.FAKE-%" }),
    });
  }

  async getStudentById(id: string) {
    const rows = await this.select("students", 1, {
      id: `eq.${id}`,
      deleted_at: "is.null",
    });
    return rows[0] ?? null;
  }

  listCounselingCases(limit?: number) {
    return this.select("counseling_cases", limit, { deleted_at: "is.null" });
  }

  listCounselingSessions(limit?: number) {
    return this.select("counseling_sessions", limit, { deleted_at: "is.null" });
  }

  listInternalTasks(limit?: number) {
    return this.select("internal_tasks", limit, { deleted_at: "is.null" });
  }

  listTestScores(limit?: number) {
    return this.select("test_scores", limit);
  }

  listConsents(limit?: number) {
    return this.select("consents", limit);
  }

  listActivityLogs(limit?: number) {
    return this.select("activity_logs", limit);
  }

  listStudentIntakeAssessments(limit?: number) {
    return this.select("student_intake_assessments", limit, {
      deleted_at: "is.null",
    });
  }

  createInternalTask(input: InsertOf<"internal_tasks">) {
    return this.mutate("internal_tasks", "POST", input);
  }

  updateInternalTask(id: string, input: UpdateOf<"internal_tasks">) {
    return this.mutate("internal_tasks", "PATCH", input, id);
  }

  createCounselingSession(input: InsertOf<"counseling_sessions">) {
    return this.mutate("counseling_sessions", "POST", input);
  }

  updateCounselingSession(
    id: string,
    input: UpdateOf<"counseling_sessions">,
  ) {
    return this.mutate("counseling_sessions", "PATCH", input, id);
  }

  createStudentIntakeAssessment(
    input: InsertOf<"student_intake_assessments">,
  ) {
    return this.mutate("student_intake_assessments", "POST", input);
  }

  updateStudentIntakeAssessment(
    id: string,
    input: UpdateOf<"student_intake_assessments">,
  ) {
    return this.mutate("student_intake_assessments", "PATCH", input, id);
  }

  createActivityLog(input: InsertOf<"activity_logs">) {
    return this.mutate("activity_logs", "POST", input);
  }

  createActivityLogs(input: InsertOf<"activity_logs">[]) {
    return this.insertMany("activity_logs", input);
  }

  upsertStudents(input: InsertOf<"students">[]) {
    return this.insertMany("students", input, "student_code");
  }

  createStudentImportBatch(input: InsertOf<"student_import_batches">) {
    return this.mutate("student_import_batches", "POST", input);
  }

  updateStudentImportBatch(
    id: string,
    input: UpdateOf<"student_import_batches">,
  ) {
    return this.mutate("student_import_batches", "PATCH", input, id);
  }

  createStudentImportStaging(
    input: InsertOf<"student_import_staging">[],
  ) {
    return this.insertMany("student_import_staging", input);
  }

  async importFakeStudentsTransaction(input: {
    fileName: string;
    fileSize: number;
    rows: import("@/types/database").Json;
  }) {
    const endpoint = new URL(
      "/rest/v1/rpc/import_fake_students_transaction",
      this.config.url,
    );
    const response = await fetch(endpoint, {
      method: "POST",
      cache: "no-store",
      headers: {
        apikey: this.config.apiKey,
        Authorization: `Bearer ${this.config.accessToken ?? this.config.apiKey}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        p_source_file_name: input.fileName,
        p_source_file_size_bytes: input.fileSize,
        p_rows: input.rows,
      }),
    });
    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Transactional import failed (${response.status}): ${detail}`);
    }
    return (await response.json()) as {
      batch_id: string;
      total_rows: number;
      valid_rows: number;
      error_rows: number;
      new_students: number;
      updated_students: number;
      imported_students: number;
    };
  }

  async importRealStudentsTransaction(input: {
    fileName: string;
    fileSize: number;
    rows: import("@/types/database").Json;
  }) {
    const endpoint = new URL(
      "/rest/v1/rpc/import_real_students_transaction",
      this.config.url,
    );
    const response = await fetch(endpoint, {
      method: "POST",
      cache: "no-store",
      headers: {
        apikey: this.config.apiKey,
        Authorization: `Bearer ${this.config.accessToken ?? this.config.apiKey}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        p_source_file_name: input.fileName,
        p_source_file_size_bytes: input.fileSize,
        p_rows: input.rows,
      }),
    });
    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Transactional real import failed (${response.status}): ${detail}`);
    }
    return (await response.json()) as {
      batch_id: string;
      total_rows: number;
      valid_rows: number;
      error_rows: number;
      new_students: number;
      updated_students: number;
      imported_students: number;
    };
  }
}
