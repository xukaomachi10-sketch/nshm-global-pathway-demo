import {
  createInternalOperationsRepository,
  type DataAccessStatus,
  type InternalOperationsRepository,
} from "@/lib/data-access";
import { MockInternalOperationsRepository } from "@/lib/data-access/mock-repository";
import {
  STUDENT_CSV_HEADERS,
  validateStudentImportRows,
  type ParsedStudentCsvRow,
  type StudentCsvValues,
  type ValidatedStudentImportRow,
} from "@/lib/import/student-csv";
import type {
  InsertOf,
  Json,
  StudentImportBatch,
  StudentRecord,
} from "@/types/database";

export type ConfirmStudentImportInput = {
  fileName: string;
  fileSize: number;
  rows: ParsedStudentCsvRow[];
};

export type StudentImportResult = {
  batchId: string;
  status: DataAccessStatus;
  totalRows: number;
  validRows: number;
  errorRows: number;
  newStudents: number;
  updatedStudents: number;
  importedStudents: number;
  validation: ValidatedStudentImportRow[];
};

function safeFileName(value: string): string {
  return value.replace(/[^a-zA-Z0-9._ -]/g, "_").slice(0, 150) || "students.csv";
}

function sanitizedRows(rows: ParsedStudentCsvRow[]): ParsedStudentCsvRow[] {
  return rows.slice(0, 1001).map((row, index) => {
    const values = Object.fromEntries(
      STUDENT_CSV_HEADERS.map((header) => [
        header,
        typeof row.values?.[header] === "string" ? row.values[header].trim() : "",
      ]),
    ) as StudentCsvValues;
    return {
      rowNumber:
        Number.isInteger(row.rowNumber) && row.rowNumber >= 2
          ? row.rowNumber
          : index + 2,
      values,
    };
  });
}

function profileObject(profile: Json): Record<string, Json | undefined> {
  return profile && typeof profile === "object" && !Array.isArray(profile)
    ? profile
    : {};
}

function studentPayload(
  row: ValidatedStudentImportRow,
  existing?: StudentRecord,
): InsertOf<"students"> {
  return {
    ...(existing ? { id: existing.id, created_at: existing.created_at } : {}),
    student_code: row.normalized.student_code,
    full_name: row.normalized.full_name,
    class_name: row.normalized.class_name,
    grade_level: row.normalized.grade_level,
    graduation_year: row.normalized.graduation_year,
    date_of_birth: row.normalized.date_of_birth,
    gender: row.normalized.gender,
    homeroom_teacher: row.normalized.homeroom_teacher,
    academic_track: row.normalized.academic_track,
    student_email: row.normalized.student_email,
    parent_name: row.normalized.parent_name,
    parent_email: row.normalized.parent_email,
    parent_phone: row.normalized.parent_phone,
    source_system: row.normalized.source_system,
    source_record_id: row.normalized.source_record_id,
    is_active_student: row.normalized.is_active_student,
    is_fake: true,
    assigned_counselor_id: existing?.assigned_counselor_id ?? null,
    target_country: existing?.target_country ?? null,
    target_university: existing?.target_university ?? null,
    intended_major: existing?.intended_major ?? null,
    risk_level: existing?.risk_level ?? "low",
    confidentiality_level: existing?.confidentiality_level ?? "restricted",
    profile_data: {
      ...profileObject(existing?.profile_data ?? {}),
      is_fake: true,
      imported_by: "student_csv_pilot",
    },
    deleted_at: null,
    deleted_by: null,
    delete_reason: null,
  };
}

function fallbackStatus(status: DataAccessStatus): DataAccessStatus {
  return {
    ...status,
    effectiveMode: "mock",
    fallbackReason:
      "Không thể đọc student master từ Supabase. Import đang chạy bằng mock data.",
  };
}

async function selectRepository() {
  const selected = createInternalOperationsRepository();
  try {
    const students = await selected.repository.listStudents(1000);
    return { repository: selected.repository, students, status: selected.status };
  } catch {
    const repository = new MockInternalOperationsRepository();
    return {
      repository,
      students: await repository.listStudents(1000),
      status: fallbackStatus(selected.status),
    };
  }
}

async function failBatch(
  repository: InternalOperationsRepository,
  batchId: string,
  error: unknown,
) {
  try {
    await repository.updateStudentImportBatch(batchId, {
      batch_status: "failed",
      completed_at: new Date().toISOString(),
      error_summary: {
        message: error instanceof Error ? error.message.slice(0, 500) : "Import failed",
      },
    });
  } catch {
    // Preserve the original failure; batch recovery is best-effort only.
  }
}

export async function confirmStudentImport(
  input: ConfirmStudentImportInput,
): Promise<StudentImportResult> {
  if (input.fileSize < 0 || input.fileSize > 2 * 1024 * 1024) {
    throw new Error("Tệp CSV phải nhỏ hơn hoặc bằng 2 MB.");
  }
  const rows = sanitizedRows(input.rows);
  if (!rows.length) throw new Error("Không có dòng dữ liệu để nhập.");
  if (rows.length > 1000) throw new Error("Pilot giới hạn tối đa 1.000 dòng.");

  const selected = await selectRepository();
  const existingByCode = new Map(
    selected.students.map((student) => [student.student_code.toUpperCase(), student]),
  );
  const validation = validateStudentImportRows(rows, existingByCode.keys());
  const valid = validation.filter((row) => !row.errors.length);
  if (!valid.length) throw new Error("Không có dòng hợp lệ để nhập.");

  const newRows = valid.filter((row) => row.action === "new").length;
  const updatedRows = valid.filter((row) => row.action === "update").length;
  let batch: StudentImportBatch;
  try {
    batch = await selected.repository.createStudentImportBatch({
      source_file_name: safeFileName(input.fileName),
      source_file_size_bytes: input.fileSize,
      batch_status: "validated",
      data_mode: selected.repository.mode,
      is_fake_only: true,
      total_rows: validation.length,
      valid_rows: valid.length,
      error_rows: validation.length - valid.length,
      new_rows: newRows,
      updated_rows: updatedRows,
      skipped_rows: validation.length - valid.length,
      created_by: null,
      confirmed_at: new Date().toISOString(),
      completed_at: null,
      error_summary: null,
    });
  } catch (error) {
    throw new Error(
      selected.repository.mode === "supabase"
        ? "Supabase chưa có bảng hoặc fake-only RLS cho student import. Hãy chạy lại SUPABASE_SCHEMA.sql trong dev project."
        : error instanceof Error
          ? error.message
          : "Không thể tạo import batch.",
    );
  }

  try {
    await selected.repository.createStudentImportStaging(
      validation.map((row) => {
        const safeInvalidRow = row.errors.length > 0;
        return {
          batch_id: batch.id,
          row_number: row.rowNumber,
          student_code:
            row.normalized.student_code.startsWith("FAKE-")
              ? row.normalized.student_code
              : null,
          raw_data: safeInvalidRow
            ? { rejected: true, row_number: row.rowNumber }
            : row.raw,
          normalized_data: safeInvalidRow
            ? { pilot_fake: true, rejected: true }
            : { ...row.normalized, pilot_fake: true },
          validation_status: safeInvalidRow ? "error" : "valid",
          validation_errors: row.errors,
          validation_warnings: row.warnings,
          import_action: row.action,
          imported_student_id: null,
          imported_at: null,
        } satisfies InsertOf<"student_import_staging">;
      }),
    );
    await selected.repository.updateStudentImportBatch(batch.id, {
      batch_status: "importing",
    });

    const payloads = valid.map((row) =>
      studentPayload(row, existingByCode.get(row.normalized.student_code)),
    );
    const newPayloads = payloads.filter((payload) => !payload.id);
    const updatePayloads = payloads.filter((payload) => Boolean(payload.id));
    const imported = [
      ...(await selected.repository.upsertStudents(newPayloads)),
      ...(await selected.repository.upsertStudents(updatePayloads)),
    ];
    const actionByCode = new Map(
      valid.map((row) => [row.normalized.student_code, row.action]),
    );
    await selected.repository.createActivityLogs(
      imported.map((student) => ({
        actor_id: null,
        student_id: student.id,
        counseling_case_id: null,
        entity_type: "student_import_batch",
        entity_id: batch.id,
        action:
          actionByCode.get(student.student_code) === "update"
            ? "student.import_updated"
            : "student.import_created",
        confidentiality_level: "restricted",
        previous_data: null,
        new_data: {
          student_code: student.student_code,
          batch_id: batch.id,
          is_fake: true,
        },
        metadata: {
          pilot: true,
          is_fake: true,
          source: "csv_import",
        },
      })),
    );
    await selected.repository.updateStudentImportBatch(batch.id, {
      batch_status:
        validation.length === valid.length ? "completed" : "completed_with_errors",
      completed_at: new Date().toISOString(),
    });

    return {
      batchId: batch.id,
      status: selected.status,
      totalRows: validation.length,
      validRows: valid.length,
      errorRows: validation.length - valid.length,
      newStudents: newRows,
      updatedStudents: updatedRows,
      importedStudents: imported.length,
      validation,
    };
  } catch (error) {
    await failBatch(selected.repository, batch.id, error);
    throw new Error(
      selected.repository.mode === "supabase"
        ? "Supabase đã từ chối import. Hãy chạy SQL schema mới và kiểm tra fake-only RLS; không có khóa quản trị nào được sử dụng."
        : error instanceof Error
          ? error.message
          : "Không thể hoàn tất import mock.",
    );
  }
}
