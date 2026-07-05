import { StudentImportWorkspace } from "@/components/internal/StudentImportWorkspace";
import { getStudents } from "@/lib/data/students";

export const dynamic = "force-dynamic";

export default async function ImportStudentsPage() {
  const students = await getStudents();
  return (
    <StudentImportWorkspace
      existingStudentCodes={students.data.map((student) => student.student_code)}
      initialStatus={students.status}
    />
  );
}
