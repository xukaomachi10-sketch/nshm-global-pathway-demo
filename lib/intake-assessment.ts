import type { StudentIntakeAssessment } from "@/types/database";

export const intakeConclusionTemplate = `1. Học sinh đang ở trạng thái:
2. Hướng phù hợp hiện tại:
3. Dữ liệu còn thiếu:
4. Rủi ro cần lưu ý:
5. Việc ICCO cần làm tiếp:`;

export type StudentIntakeAssessmentFormValues = Omit<
  StudentIntakeAssessment,
  | "id"
  | "student_id"
  | "created_by"
  | "updated_by"
  | "created_at"
  | "updated_at"
  | "deleted_at"
>;
