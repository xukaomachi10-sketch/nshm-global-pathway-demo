export const STUDENT_CSV_HEADERS = [
  "student_code",
  "full_name",
  "class_name",
  "grade_level",
  "graduation_year",
  "date_of_birth",
  "gender",
  "homeroom_teacher",
  "academic_track",
  "student_email",
  "parent_name",
  "parent_phone",
  "parent_email",
  "source_system",
  "source_record_id",
  "is_active_student",
] as const;

export type StudentCsvField = (typeof STUDENT_CSV_HEADERS)[number];
export type StudentImportMode = "fake" | "real";
export const REAL_STUDENT_CSV_HEADERS = [
  "student_code",
  "full_name",
  "class_name",
  "grade_level",
  "graduation_year",
  "homeroom_teacher",
  "source_system",
  "source_record_id",
  "is_active_student",
] as const satisfies readonly StudentCsvField[];
export type StudentCsvValues = Record<StudentCsvField, string>;

export type ParsedStudentCsvRow = {
  rowNumber: number;
  values: StudentCsvValues;
};

export type NormalizedStudentImport = {
  student_code: string;
  full_name: string;
  class_name: string;
  grade_level: number | null;
  graduation_year: number | null;
  date_of_birth: string | null;
  gender: "female" | "male" | "other" | "unspecified" | null;
  homeroom_teacher: string | null;
  academic_track: string | null;
  student_email: string | null;
  parent_name: string | null;
  parent_phone: string | null;
  parent_email: string | null;
  source_system: string | null;
  source_record_id: string | null;
  is_active_student: boolean;
};

export type ValidatedStudentImportRow = {
  rowNumber: number;
  raw: StudentCsvValues;
  normalized: NormalizedStudentImport;
  errors: string[];
  warnings: string[];
  action: "new" | "update" | "skipped";
};

export type CsvParseResult = {
  rows: ParsedStudentCsvRow[];
  errors: string[];
};

const fakeRequiredFields: StudentCsvField[] = [
  "student_code",
  "full_name",
  "class_name",
  "grade_level",
  "graduation_year",
];
const realRequiredFields: StudentCsvField[] = [
  ...fakeRequiredFields,
  "source_system",
  "source_record_id",
];
const realForbiddenFields: StudentCsvField[] = [
  "date_of_birth",
  "gender",
  "academic_track",
  "student_email",
  "parent_name",
  "parent_phone",
  "parent_email",
];

function emptyValues(): StudentCsvValues {
  return Object.fromEntries(STUDENT_CSV_HEADERS.map((key) => [key, ""])) as StudentCsvValues;
}

function parseMatrix(text: string): string[][] {
  const matrix: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
    } else if (character === '"') {
      quoted = true;
    } else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n") {
      row.push(field.replace(/\r$/, ""));
      matrix.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  if (quoted) throw new Error("CSV có ô trích dẫn chưa được đóng.");
  if (field.length || row.length) {
    row.push(field.replace(/\r$/, ""));
    matrix.push(row);
  }
  return matrix;
}

export function parseStudentCsv(
  text: string,
  mode: StudentImportMode = "fake",
): CsvParseResult {
  const errors: string[] = [];
  let matrix: string[][];
  try {
    matrix = parseMatrix(text.replace(/^\uFEFF/, ""));
  } catch (error) {
    return {
      rows: [],
      errors: [error instanceof Error ? error.message : "Không thể đọc CSV."],
    };
  }
  if (!matrix.length) return { rows: [], errors: ["Tệp CSV đang trống."] };

  const headers = matrix[0].map((header) => header.trim().toLowerCase());
  const duplicates = headers.filter((header, index) => headers.indexOf(header) !== index);
  if (duplicates.length) errors.push(`Cột bị lặp: ${[...new Set(duplicates)].join(", ")}.`);
  const requiredFields = mode === "real" ? realRequiredFields : fakeRequiredFields;
  for (const field of requiredFields) {
    if (!headers.includes(field)) errors.push(`Thiếu cột bắt buộc: ${field}.`);
  }
  const unknown = headers.filter(
    (header) => header && !STUDENT_CSV_HEADERS.includes(header as StudentCsvField),
  );
  if (unknown.length) errors.push(`Cột không được hỗ trợ: ${unknown.join(", ")}.`);
  if (errors.length) return { rows: [], errors };

  const rows = matrix.slice(1).flatMap((cells, index) => {
    if (cells.every((cell) => !cell.trim())) return [];
    const values = emptyValues();
    headers.forEach((header, cellIndex) => {
      if (STUDENT_CSV_HEADERS.includes(header as StudentCsvField)) {
        values[header as StudentCsvField] = (cells[cellIndex] ?? "").trim();
      }
    });
    return [{ rowNumber: index + 2, values }];
  });
  if (!rows.length) errors.push("CSV không có dòng dữ liệu.");
  if (rows.length > 1000) errors.push("Pilot giới hạn tối đa 1.000 dòng mỗi lần nhập.");
  return { rows: errors.length ? [] : rows, errors };
}

function parseBoolean(value: string): boolean | null {
  if (!value) return true;
  const normalized = value.toLowerCase();
  if (["true", "1", "yes", "y", "có", "co"].includes(normalized)) return true;
  if (["false", "0", "no", "n", "không", "khong"].includes(normalized)) return false;
  return null;
}

function parseGender(value: string): NormalizedStudentImport["gender"] | "invalid" {
  if (!value) return null;
  const normalized = value.toLowerCase();
  if (["female", "nữ", "nu"].includes(normalized)) return "female";
  if (["male", "nam"].includes(normalized)) return "male";
  if (["other", "khác", "khac"].includes(normalized)) return "other";
  if (["unspecified", "không xác định", "khong xac dinh"].includes(normalized)) return "unspecified";
  return "invalid";
}

function validIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function validEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validateStudentImportRows(
  rows: ParsedStudentCsvRow[],
  existingStudentCodes: Iterable<string>,
  mode: StudentImportMode = "fake",
): ValidatedStudentImportRow[] {
  const existing = new Set(
    [...existingStudentCodes].map((code) => code.trim().toUpperCase()),
  );
  const counts = new Map<string, number>();
  rows.forEach(({ values }) => {
    const code = values.student_code.trim().toUpperCase();
    if (code) counts.set(code, (counts.get(code) ?? 0) + 1);
  });

  return rows.map(({ rowNumber, values }) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const code = values.student_code.trim().toUpperCase();
    const grade = Number(values.grade_level);
    const graduationYear = Number(values.graduation_year);
    const active = parseBoolean(values.is_active_student);
    const gender = parseGender(values.gender);

    const requiredFields = mode === "real" ? realRequiredFields : fakeRequiredFields;
    for (const field of requiredFields) {
      if (!values[field].trim()) errors.push(`${field} là bắt buộc.`);
    }
    if (mode === "fake" && code && !/^FAKE-NSHM-[A-Z0-9_-]{1,32}$/.test(code)) {
      errors.push("Fake mode chỉ cho phép student_code theo mẫu FAKE-NSHM-*.");
    }
    if (
      mode === "real" &&
      code &&
      (code.startsWith("FAKE-") || !/^[A-Z0-9][A-Z0-9._-]{2,49}$/.test(code))
    ) {
      errors.push("Real mode yêu cầu mã thật hợp lệ và không được bắt đầu bằng FAKE-.");
    }
    if (code && (counts.get(code) ?? 0) > 1) {
      errors.push("student_code bị trùng trong tệp tải lên.");
    }
    if (values.grade_level && (!Number.isInteger(grade) || grade < 1 || grade > 12)) {
      errors.push("grade_level phải là số nguyên từ 1 đến 12.");
    }
    if (
      values.graduation_year &&
      (!Number.isInteger(graduationYear) || graduationYear < 2020 || graduationYear > 2100)
    ) {
      errors.push("graduation_year phải nằm trong khoảng 2020-2100.");
    }
    if (values.date_of_birth && !validIsoDate(values.date_of_birth)) {
      errors.push("date_of_birth phải theo định dạng YYYY-MM-DD và là ngày hợp lệ.");
    }
    if (gender === "invalid") errors.push("gender không hợp lệ.");
    if (values.student_email && !validEmail(values.student_email)) errors.push("student_email không hợp lệ.");
    if (values.parent_email && !validEmail(values.parent_email)) errors.push("parent_email không hợp lệ.");
    if (active === null) errors.push("is_active_student phải là true/false, 1/0 hoặc yes/no.");
    if (mode === "real") {
      for (const field of realForbiddenFields) {
        if (values[field].trim()) {
          errors.push(`${field} không được phép trong Real Import v1.`);
        }
      }
    }
    if (code && existing.has(code)) warnings.push("Mã đã tồn tại; dòng này sẽ cập nhật hồ sơ hiện có.");
    if (mode === "fake" && !values.source_system) warnings.push("Chưa có source_system.");

    const normalized: NormalizedStudentImport = {
      student_code: code,
      full_name: values.full_name.trim(),
      class_name: values.class_name.trim(),
      grade_level: Number.isInteger(grade) ? grade : null,
      graduation_year: Number.isInteger(graduationYear) ? graduationYear : null,
      date_of_birth: mode === "real" ? null : values.date_of_birth || null,
      gender: mode === "real" ? null : gender === "invalid" ? null : gender,
      homeroom_teacher: values.homeroom_teacher || null,
      academic_track: mode === "real" ? null : values.academic_track || null,
      student_email: mode === "real" ? null : values.student_email || null,
      parent_name: mode === "real" ? null : values.parent_name || null,
      parent_phone: mode === "real" ? null : values.parent_phone || null,
      parent_email: mode === "real" ? null : values.parent_email || null,
      source_system: values.source_system || null,
      source_record_id: values.source_record_id || null,
      is_active_student: active ?? true,
    };
    return {
      rowNumber,
      raw: values,
      normalized,
      errors,
      warnings,
      action: errors.length ? "skipped" : existing.has(code) ? "update" : "new",
    };
  });
}

export const STUDENT_CSV_TEMPLATE = `${STUDENT_CSV_HEADERS.join(",")}\n`;
export const REAL_STUDENT_CSV_TEMPLATE = `${REAL_STUDENT_CSV_HEADERS.join(",")}\n`;
