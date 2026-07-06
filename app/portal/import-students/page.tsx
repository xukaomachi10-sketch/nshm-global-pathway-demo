import { StudentImportWorkspace } from "@/components/internal/StudentImportWorkspace";
import { getStudents } from "@/lib/data/students";
import { requireStaffRole } from "@/lib/auth/session";
import { isRealStudentImportEnabled } from "@/lib/features";

export const dynamic = "force-dynamic";

export default async function ImportStudentsPage() {
  await requireStaffRole(["ICCO_HEAD", "ADMIN"]);
  const students = await getStudents();
  return (
    <StudentImportWorkspace
      existingStudentCodes={students.data.map((student) => student.student_code)}
      initialStatus={students.status}
      realImportEnabled={isRealStudentImportEnabled()}
    />
  );
}
