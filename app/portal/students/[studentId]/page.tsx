import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui";
import { DataModeNotice } from "@/components/internal/DataModeNotice";
import { StudentIntakeWorkspace } from "@/components/internal/StudentIntakeWorkspace";
import { requireStaffSession } from "@/lib/auth/session";
import { getStudentIntakeWorkspace } from "@/lib/data/intake-assessments";

export const dynamic = "force-dynamic";

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const [{ studentId }, session] = await Promise.all([
    params,
    requireStaffSession(),
  ]);
  if (!uuidPattern.test(studentId)) notFound();

  const result = await getStudentIntakeWorkspace(studentId);
  if (!result.data && result.status.fallbackReason) {
    return (
      <div className="space-y-5 animate-rise">
        <Link
          href="/portal/students"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#D21235]"
        >
          <ArrowLeft className="h-4 w-4" /> Quay lại danh sách học sinh
        </Link>
        <DataModeNotice status={result.status} />
        <Card className="p-8 text-center">
          <AlertTriangle className="mx-auto h-10 w-10 text-amber-500" />
          <h1 className="mt-4 text-xl font-black text-[#23328C]">
            Chưa thể tải hồ sơ học sinh
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Supabase không trả về hồ sơ này và dữ liệu mock không có UUID tương
            ứng. Hãy kiểm tra kết nối, RLS và bảng student_intake_assessments;
            không cần thay đổi khóa bảo mật hay quyền anonymous.
          </p>
        </Card>
      </div>
    );
  }
  if (!result.data) notFound();

  return (
    <StudentIntakeWorkspace
      student={result.data.student}
      cases={result.data.cases}
      tasks={result.data.tasks}
      sessions={result.data.sessions}
      initialAssessment={result.data.assessment}
      staffProfiles={result.data.staffProfiles}
      currentStaff={session.staff}
      status={result.status}
    />
  );
}
