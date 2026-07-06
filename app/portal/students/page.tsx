import { getStudentCounselingWorkspace } from "@/lib/data/cases";
import { StudentsWorkspace } from "@/components/internal/StudentsWorkspace";

export const dynamic = "force-dynamic";

export default async function StudentCounselingPage() {
  const result = await getStudentCounselingWorkspace();
  return (
    <StudentsWorkspace
      initialStudents={result.data.students}
      cases={result.data.cases}
      status={result.status}
    />
  );
}
