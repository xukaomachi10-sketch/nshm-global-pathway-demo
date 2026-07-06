export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole =
  | "admin"
  | "manager"
  | "counselor"
  | "auditor"
  | "viewer";
export type StaffRole = "ICCO_HEAD" | "COUNSELOR" | "ADMIN";
export type RiskLevel = "low" | "medium" | "high" | "critical";
export type ConfidentialityLevel =
  | "internal"
  | "restricted"
  | "highly_restricted";
export type CaseStatus =
  | "intake"
  | "assessment"
  | "active"
  | "waiting_student"
  | "waiting_parent"
  | "on_hold"
  | "completed"
  | "cancelled";
export type SessionStatus =
  | "scheduled"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";
export type TaskStatus =
  | "todo"
  | "in_progress"
  | "blocked"
  | "done"
  | "cancelled";
export type Priority = "low" | "normal" | "high" | "urgent";
export type TestType =
  | "gpa"
  | "ielts"
  | "toefl"
  | "sat"
  | "act"
  | "ap"
  | "ib"
  | "other";
export type ConsentType =
  | "counseling"
  | "data_processing"
  | "document_sharing"
  | "media"
  | "parent_communication";
export type ConsentStatus = "pending" | "granted" | "withdrawn" | "expired";
export type StudentImportBatchStatus =
  | "uploaded"
  | "validated"
  | "importing"
  | "completed"
  | "completed_with_errors"
  | "failed";
export type StudentImportValidationStatus = "valid" | "error";
export type StudentImportAction = "new" | "update" | "skipped" | "imported";

type TableDefinition<Row, Insert> = {
  Row: Row;
  Insert: Insert;
  Update: Partial<Insert>;
};

export type InternalUser = {
  id: string;
  auth_user_id: string | null;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type StaffProfile = {
  id: string;
  auth_user_id: string;
  full_name: string;
  email: string;
  role: StaffRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type StudentRecord = {
  id: string;
  student_code: string;
  full_name: string;
  date_of_birth: string | null;
  gender: string | null;
  class_name: string | null;
  grade_level: number | null;
  graduation_year: number | null;
  homeroom_teacher: string | null;
  academic_track: string | null;
  student_email: string | null;
  parent_name: string | null;
  parent_phone: string | null;
  parent_email: string | null;
  source_system: string | null;
  source_record_id: string | null;
  is_active_student: boolean;
  is_fake: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  deleted_by: string | null;
  delete_reason: string | null;
  // Existing counseling-operation fields retained non-destructively.
  assigned_counselor_id: string | null;
  target_country: string | null;
  target_university: string | null;
  intended_major: string | null;
  risk_level: RiskLevel;
  confidentiality_level: ConfidentialityLevel;
  profile_data: Json;
};

export type StudentImportBatch = {
  id: string;
  source_file_name: string;
  source_file_size_bytes: number | null;
  batch_status: StudentImportBatchStatus;
  data_mode: "mock" | "supabase";
  is_fake_only: boolean;
  total_rows: number;
  valid_rows: number;
  error_rows: number;
  new_rows: number;
  updated_rows: number;
  skipped_rows: number;
  created_by: string | null;
  confirmed_at: string | null;
  completed_at: string | null;
  error_summary: Json | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type StudentImportStaging = {
  id: string;
  batch_id: string;
  row_number: number;
  student_code: string | null;
  raw_data: Json;
  normalized_data: Json;
  validation_status: StudentImportValidationStatus;
  validation_errors: Json;
  validation_warnings: Json;
  import_action: StudentImportAction;
  imported_student_id: string | null;
  imported_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type CounselingCase = {
  id: string;
  case_number: string;
  student_id: string;
  case_status: CaseStatus;
  priority: Priority;
  risk_level: RiskLevel;
  confidentiality_level: ConfidentialityLevel;
  assigned_counselor_id: string | null;
  opened_at: string;
  target_country: string | null;
  intended_major: string | null;
  summary: string | null;
  next_action: string | null;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type CounselingSession = {
  id: string;
  counseling_case_id: string;
  student_id: string;
  counselor_id: string;
  scheduled_at: string;
  duration_minutes: number;
  mode: "in_person" | "online" | "phone";
  location: string | null;
  session_status: SessionStatus;
  confidentiality_level: ConfidentialityLevel;
  summary: string | null;
  next_action: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type InternalTask = {
  id: string;
  counseling_case_id: string | null;
  student_id: string | null;
  counseling_session_id: string | null;
  title: string;
  description: string | null;
  assigned_to: string | null;
  task_status: TaskStatus;
  priority: Priority;
  due_date: string | null;
  completed_at: string | null;
  confidentiality_level: ConfidentialityLevel;
  metadata: Json;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type TestScore = {
  id: string;
  student_id: string;
  counseling_case_id: string | null;
  test_type: TestType;
  test_name: string;
  test_date: string;
  overall_score: number | null;
  score_scale: string | null;
  component_scores: Json;
  is_verified: boolean;
  verified_by: string | null;
  verified_at: string | null;
  evidence_reference: string | null;
  confidentiality_level: ConfidentialityLevel;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type ConsentRecord = {
  id: string;
  student_id: string;
  counseling_case_id: string | null;
  consent_type: ConsentType;
  consent_status: ConsentStatus;
  granted_by_name: string | null;
  granted_by_relationship: string | null;
  granted_at: string | null;
  expires_at: string | null;
  withdrawn_at: string | null;
  evidence_reference: string | null;
  notes: string | null;
  confidentiality_level: ConfidentialityLevel;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type ActivityLog = {
  id: string;
  actor_id: string | null;
  student_id: string | null;
  counseling_case_id: string | null;
  entity_type: string;
  entity_id: string | null;
  action: string;
  confidentiality_level: ConfidentialityLevel;
  previous_data: Json | null;
  new_data: Json | null;
  metadata: Json;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      users: TableDefinition<
        InternalUser,
        Omit<InternalUser, "id" | "created_at" | "updated_at" | "deleted_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        }
      >;
      staff_profiles: TableDefinition<
        StaffProfile,
        Omit<StaffProfile, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        }
      >;
      students: TableDefinition<
        StudentRecord,
        Omit<StudentRecord, "id" | "created_at" | "updated_at" | "deleted_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        }
      >;
      student_import_batches: TableDefinition<
        StudentImportBatch,
        Omit<
          StudentImportBatch,
          "id" | "created_at" | "updated_at" | "deleted_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        }
      >;
      student_import_staging: TableDefinition<
        StudentImportStaging,
        Omit<
          StudentImportStaging,
          "id" | "created_at" | "updated_at" | "deleted_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        }
      >;
      counseling_cases: TableDefinition<
        CounselingCase,
        Omit<CounselingCase, "id" | "created_at" | "updated_at" | "deleted_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        }
      >;
      counseling_sessions: TableDefinition<
        CounselingSession,
        Omit<CounselingSession, "id" | "created_at" | "updated_at" | "deleted_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        }
      >;
      internal_tasks: TableDefinition<
        InternalTask,
        Omit<InternalTask, "id" | "created_at" | "updated_at" | "deleted_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        }
      >;
      test_scores: TableDefinition<
        TestScore,
        Omit<TestScore, "id" | "created_at" | "updated_at" | "deleted_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        }
      >;
      consents: TableDefinition<
        ConsentRecord,
        Omit<ConsentRecord, "id" | "created_at" | "updated_at" | "deleted_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        }
      >;
      activity_logs: TableDefinition<
        ActivityLog,
        Omit<ActivityLog, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        }
      >;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      staff_role: StaffRole;
      risk_level: RiskLevel;
      confidentiality_level: ConfidentialityLevel;
      case_status: CaseStatus;
      session_status: SessionStatus;
      task_status: TaskStatus;
      priority_level: Priority;
      test_type: TestType;
      consent_type: ConsentType;
      consent_status: ConsentStatus;
    };
  };
};

export type TableName = keyof Database["public"]["Tables"];
export type RowOf<T extends TableName> = Database["public"]["Tables"][T]["Row"];
export type InsertOf<T extends TableName> = Database["public"]["Tables"][T]["Insert"];
export type UpdateOf<T extends TableName> = Database["public"]["Tables"][T]["Update"];
