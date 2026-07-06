"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  ArrowLeft,
  CalendarClock,
  ChevronRight,
  ClipboardCheck,
  Save,
  ShieldCheck,
  SquareCheckBig,
  UserRound,
} from "lucide-react";
import { saveStudentIntakeAssessmentAction } from "@/app/portal/students/[studentId]/actions";
import { DataModeNotice } from "./DataModeNotice";
import {
  intakeConclusionTemplate,
  type StudentIntakeAssessmentFormValues,
} from "@/lib/intake-assessment";
import type { DataAccessStatus } from "@/lib/data-access";
import type {
  CounselingCase,
  CounselingSession,
  InternalTask,
  StaffProfile,
  StudentIntakeAssessment,
  StudentRecord,
} from "@/types/database";
import { Badge, Button, Card, EmptyState, StatusBadge } from "@/components/ui";

type Tab = "overview" | "intake" | "tasks" | "sessions";

const tabs: Array<{ value: Tab; label: string; icon: typeof UserRound }> = [
  { value: "overview", label: "Overview", icon: UserRound },
  { value: "intake", label: "Intake Assessment", icon: ClipboardCheck },
  { value: "tasks", label: "Tasks", icon: SquareCheckBig },
  { value: "sessions", label: "Sessions", icon: CalendarClock },
];

const requestSourceOptions = [
  ["", "Chọn nguồn tiếp nhận"],
  ["student_request", "Học sinh đăng ký"],
  ["school_referral", "Nhà trường/GVCN chuyển tiếp"],
  ["parent_request", "CMHS đề nghị"],
  ["portfolio_handoff", "Portfolio handoff"],
  ["follow_up", "Theo dõi ca trước"],
  ["other", "Khác"],
];

const branchOptions = [
  ["", "Chọn nhánh tư vấn"],
  ["vietnam", "Đại học Việt Nam"],
  ["international", "Quốc tế / du học"],
  ["scholarship", "Học bổng / đối tác"],
  ["career_orientation", "Hướng nghiệp"],
  ["portfolio", "Phát triển Portfolio"],
  ["mixed", "Liên nhánh"],
];

const goalOptions = [
  ["", "Chọn mục tiêu sau THPT"],
  ["university_vietnam", "Đại học tại Việt Nam"],
  ["university_abroad", "Đại học quốc tế / du học"],
  ["scholarship_path", "Lộ trình học bổng"],
  ["gap_year", "Gap year có kế hoạch"],
  ["undecided", "Chưa xác định"],
];

function initialValues(
  assessment: StudentIntakeAssessment | null,
  student: StudentRecord,
  cases: CounselingCase[],
  currentStaff: StaffProfile,
): StudentIntakeAssessmentFormValues {
  return {
    counseling_case_id: assessment?.counseling_case_id ?? cases[0]?.id ?? null,
    request_source: assessment?.request_source ?? null,
    intake_date: assessment?.intake_date ?? new Date().toISOString().slice(0, 10),
    assigned_counselor_id:
      assessment?.assigned_counselor_id ?? currentStaff.id,
    counseling_branch: assessment?.counseling_branch ?? null,
    priority_level: assessment?.priority_level ?? null,
    intake_status: assessment?.intake_status ?? null,
    post_high_school_goal: assessment?.post_high_school_goal ?? null,
    target_majors_text: assessment?.target_majors_text ?? student.intended_major,
    career_cluster: assessment?.career_cluster ?? null,
    target_countries: assessment?.target_countries ?? student.target_country,
    target_universities_text:
      assessment?.target_universities_text ?? student.target_university,
    scholarship_interest: assessment?.scholarship_interest ?? null,
    orientation_clarity_score: assessment?.orientation_clarity_score ?? null,
    goal_note: assessment?.goal_note ?? null,
    gpa_summary: assessment?.gpa_summary ?? null,
    strong_subjects: assessment?.strong_subjects ?? null,
    weak_subjects: assessment?.weak_subjects ?? null,
    academic_track: assessment?.academic_track ?? student.academic_track,
    ielts_score: assessment?.ielts_score ?? null,
    sat_total: assessment?.sat_total ?? null,
    sat_math: assessment?.sat_math ?? null,
    sat_rw: assessment?.sat_rw ?? null,
    other_certificates: assessment?.other_certificates ?? null,
    academic_readiness_score: assessment?.academic_readiness_score ?? null,
    academic_gap_note: assessment?.academic_gap_note ?? null,
    activities_summary: assessment?.activities_summary ?? null,
    leadership_summary: assessment?.leadership_summary ?? null,
    projects_summary: assessment?.projects_summary ?? null,
    awards_summary: assessment?.awards_summary ?? null,
    evidence_status: assessment?.evidence_status ?? null,
    highest_evidence_level: assessment?.highest_evidence_level ?? null,
    profile_strength_score: assessment?.profile_strength_score ?? null,
    portfolio_readiness_status:
      assessment?.portfolio_readiness_status ?? null,
    cv_status: assessment?.cv_status ?? null,
    activity_list_status: assessment?.activity_list_status ?? null,
    portfolio_evidence_status: assessment?.portfolio_evidence_status ?? null,
    portfolio_gap_note: assessment?.portfolio_gap_note ?? null,
    parent_involvement_level: assessment?.parent_involvement_level ?? null,
    geography_constraints: assessment?.geography_constraints ?? null,
    budget_range: assessment?.budget_range ?? null,
    safety_or_family_constraints:
      assessment?.safety_or_family_constraints ?? null,
    sensitive_note: assessment?.sensitive_note ?? null,
    nearest_deadline: assessment?.nearest_deadline ?? null,
    next_test_date: assessment?.next_test_date ?? null,
    application_season: assessment?.application_season ?? null,
    deadline_risk_level: assessment?.deadline_risk_level ?? null,
    deadline_action_note: assessment?.deadline_action_note ?? null,
    overall_readiness_score: assessment?.overall_readiness_score ?? null,
    key_strengths: assessment?.key_strengths ?? null,
    key_gaps: assessment?.key_gaps ?? null,
    risk_summary: assessment?.risk_summary ?? null,
    risk_level: assessment?.risk_level ?? null,
    escalation_required: assessment?.escalation_required ?? null,
    escalation_to: assessment?.escalation_to ?? null,
    intake_conclusion:
      assessment?.intake_conclusion ?? intakeConclusionTemplate,
    next_action: assessment?.next_action ?? null,
    next_owner_id: assessment?.next_owner_id ?? null,
    next_due_date: assessment?.next_due_date ?? null,
    create_session_recommended:
      assessment?.create_session_recommended ?? null,
    create_task_recommended: assessment?.create_task_recommended ?? null,
    assessment_status: assessment?.assessment_status ?? "Draft",
    confidentiality_level: "D2",
  };
}

export function StudentIntakeWorkspace({
  student,
  cases,
  tasks,
  sessions,
  initialAssessment,
  staffProfiles,
  currentStaff,
  status,
}: {
  student: StudentRecord;
  cases: CounselingCase[];
  tasks: InternalTask[];
  sessions: CounselingSession[];
  initialAssessment: StudentIntakeAssessment | null;
  staffProfiles: StaffProfile[];
  currentStaff: StaffProfile;
  status: DataAccessStatus;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>(initialAssessment ? "intake" : "overview");
  const [assessment, setAssessment] = useState(initialAssessment);
  const [assessmentId, setAssessmentId] = useState(initialAssessment?.id);
  const [values, setValues] = useState(() =>
    initialValues(initialAssessment, student, cases, currentStaff),
  );
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [technicalError, setTechnicalError] = useState("");
  const [pending, startTransition] = useTransition();

  const canCreate = ["ICCO_HEAD", "ADMIN"].includes(currentStaff.role);
  const canEdit =
    canCreate ||
    (currentStaff.role === "COUNSELOR" &&
      assessment?.assigned_counselor_id === currentStaff.id);

  const setText = (key: keyof StudentIntakeAssessmentFormValues, value: string) =>
    setValues((current) => ({ ...current, [key]: value || null }));
  const setNumber = (
    key: keyof StudentIntakeAssessmentFormValues,
    value: string,
  ) => setValues((current) => ({ ...current, [key]: value ? Number(value) : null }));

  const submit = (event: "save" | "review") => {
    const isCreating = !assessmentId;
    setMessage("");
    setError("");
    setTechnicalError("");
    startTransition(async () => {
      const response = await saveStudentIntakeAssessmentAction({
        assessmentId,
        studentId: student.id,
        values,
        event,
      });
      if (!response.ok) {
        setError(response.error);
        setTechnicalError(response.technicalError);
        return;
      }
      setAssessmentId(response.result.data.id);
      setAssessment(response.result.data);
      setValues((current) => ({
        ...current,
        assigned_counselor_id:
          response.result.data.assigned_counselor_id,
        assessment_status: response.result.data.assessment_status,
      }));
      setMessage(
        event === "review"
          ? "Đã rà soát đánh giá và ghi activity log."
          : isCreating
            ? "Đã tạo bản Draft assessment và ghi activity log."
            : "Đã lưu cập nhật assessment và ghi activity log.",
      );
      router.refresh();
    });
  };

  return (
    <div className="space-y-6 animate-rise">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 items-center gap-1.5 text-sm font-bold"
        >
          <Link href="/portal/students" className="text-[#23328C] hover:text-[#D21235]">
            Học sinh tư vấn
          </Link>
          <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
          <span className="truncate text-slate-500">{student.full_name}</span>
        </nav>
        <Link
          href="/portal/students"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#D21235]"
        >
          <ArrowLeft className="h-4 w-4" /> Quay lại danh sách học sinh
        </Link>
      </div>

      <Card className="overflow-hidden">
        <div className="bg-[#23328C] px-5 py-6 text-white lg:px-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-xl font-black ring-1 ring-white/20">
              {student.full_name
                .split(" ")
                .slice(-2)
                .map((part) => part[0])
                .join("")
                .toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black">{student.full_name}</h1>
                <Badge tone={student.is_active_student ? "green" : "slate"}>
                  {student.is_active_student ? "Đang học" : "Không hoạt động"}
                </Badge>
                {assessment && (
                  <Badge tone="blue">{values.assessment_status}</Badge>
                )}
              </div>
              <div className="mt-3 grid gap-2 text-sm text-slate-200 sm:grid-cols-2 lg:grid-cols-5">
                <Identity label="Mã học sinh" value={student.student_code} />
                <Identity label="Lớp" value={student.class_name ?? "—"} />
                <Identity label="Khối" value={student.grade_level?.toString() ?? "—"} />
                <Identity label="Tốt nghiệp" value={student.graduation_year?.toString() ?? "—"} />
                <Identity label="GVCN" value={student.homeroom_teacher ?? "Chưa cập nhật"} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex overflow-x-auto border-b border-slate-200 bg-white px-3 lg:px-6">
          {tabs.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setTab(value)}
              className={`inline-flex min-w-max items-center gap-2 border-b-2 px-4 py-4 text-sm font-bold ${tab === value ? "border-[#D21235] text-[#D21235]" : "border-transparent text-slate-500 hover:text-[#23328C]"}`}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>
      </Card>

      <DataModeNotice status={status} />

      {tab === "overview" && (
        <Overview student={student} assessment={assessment} cases={cases} />
      )}
      {tab === "intake" && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="font-black">Phạm vi dữ liệu an toàn</p>
            <p className="mt-1 leading-6">
              Chỉ ghi dữ liệu cần cho tư vấn. Không nhập ngày sinh, điện thoại/email
              phụ huynh, dữ liệu sức khỏe hoặc nội dung nhạy cảm không cần thiết.
            </p>
          </div>
          {!canEdit && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
              Bạn chỉ có quyền xem. COUNSELOR chỉ được cập nhật assessment được phân công.
            </div>
          )}
          <IntakeForm
            values={values}
            setValues={setValues}
            setText={setText}
            setNumber={setNumber}
            cases={cases}
            staffProfiles={staffProfiles}
            disabled={!canEdit || pending}
          />
          {(message || error) && (
            <div className={`rounded-xl p-4 text-sm font-bold ${error ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
              {error || message}
              {error && technicalError && status.requestedMode === "supabase" && (
                <details className="mt-3 rounded-lg bg-white/70 p-3 text-left font-mono text-xs font-medium text-slate-700">
                  <summary className="cursor-pointer font-sans font-black text-slate-600">
                    Chi tiết kỹ thuật dành cho IT
                  </summary>
                  <p className="mt-2 break-words leading-5">{technicalError}</p>
                </details>
              )}
            </div>
          )}
          <div className="sticky bottom-4 flex flex-wrap justify-end gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur">
            <Button
              variant="secondary"
              disabled={!canEdit || pending}
              onClick={() => submit("save")}
            >
              <Save className="h-4 w-4" />
              {pending ? "Đang lưu..." : assessmentId ? "Lưu cập nhật" : "Tạo assessment"}
            </Button>
            <Button
              disabled={!canEdit || pending || !assessmentId}
              onClick={() => submit("review")}
            >
              <ShieldCheck className="h-4 w-4" /> Đánh dấu đã rà soát
            </Button>
          </div>
        </div>
      )}
      {tab === "tasks" && <TasksPanel tasks={tasks} />}
      {tab === "sessions" && <SessionsPanel sessions={sessions} />}
    </div>
  );
}

function Identity({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">{label}</p>
      <p className="mt-0.5 font-bold text-white">{value}</p>
    </div>
  );
}

function Overview({
  student,
  assessment,
  cases,
}: {
  student: StudentRecord;
  assessment: StudentIntakeAssessment | null;
  cases: CounselingCase[];
}) {
  return (
    <div className="space-y-5">
      <Card className="p-5">
        <h2 className="text-lg font-black text-[#23328C]">Student master data</h2>
        <p className="mt-1 text-sm text-slate-500">
          UUID được dùng cho điều hướng; student_code chỉ dùng để hiển thị và đối chiếu.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Summary label="student_code" value={student.student_code} />
          <Summary label="full_name" value={student.full_name} />
          <Summary label="class_name" value={student.class_name} />
          <Summary label="grade_level" value={student.grade_level?.toString()} />
          <Summary label="graduation_year" value={student.graduation_year?.toString()} />
          <Summary label="homeroom_teacher" value={student.homeroom_teacher} />
          <Summary label="is_active_student" value={student.is_active_student ? "true" : "false"} />
          <Summary label="is_fake" value={student.is_fake ? "true" : "false"} />
          <Summary label="source_system" value={student.source_system} />
          <Summary label="source_record_id" value={student.source_record_id} />
        </div>
      </Card>
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h2 className="text-lg font-black text-[#23328C]">Tổng quan trước tư vấn</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Summary label="Ngành quan tâm" value={assessment?.target_majors_text ?? student.intended_major} />
            <Summary label="Quốc gia mục tiêu" value={assessment?.target_countries ?? student.target_country} />
            <Summary label="Trường quan tâm" value={assessment?.target_universities_text ?? student.target_university} />
            <Summary label="Lộ trình học thuật" value={assessment?.academic_track ?? student.academic_track} />
            <Summary label="Điểm mạnh chính" value={assessment?.key_strengths} />
            <Summary label="Khoảng trống chính" value={assessment?.key_gaps} />
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="font-black text-[#23328C]">Trạng thái vận hành</h2>
          <div className="mt-4 space-y-3">
            <Summary label="Assessment" value={assessment?.assessment_status ?? "Chưa tạo"} />
            <Summary label="Mức rủi ro" value={assessment?.risk_level ?? student.risk_level} />
            <Summary label="Hồ sơ tư vấn" value={cases[0]?.case_number ?? "Chưa liên kết"} />
            <Summary label="Hành động tiếp" value={assessment?.next_action ?? cases[0]?.next_action} />
          </div>
        </Card>
      </div>
    </div>
  );
}

function Summary({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-bold leading-6 text-slate-700">{value || "Chưa cập nhật"}</p>
    </div>
  );
}

function IntakeForm({
  values,
  setValues,
  setText,
  setNumber,
  cases,
  staffProfiles,
  disabled,
}: {
  values: StudentIntakeAssessmentFormValues;
  setValues: React.Dispatch<React.SetStateAction<StudentIntakeAssessmentFormValues>>;
  setText: (key: keyof StudentIntakeAssessmentFormValues, value: string) => void;
  setNumber: (key: keyof StudentIntakeAssessmentFormValues, value: string) => void;
  cases: CounselingCase[];
  staffProfiles: StaffProfile[];
  disabled: boolean;
}) {
  return (
    <div className="space-y-5">
      <Section title="1. Tiếp nhận và phân công" description="Nguồn yêu cầu, nhánh tư vấn, owner và mức ưu tiên.">
        <SelectField label="Nguồn tiếp nhận" value={values.request_source ?? ""} onChange={(v) => setText("request_source", v)} options={requestSourceOptions} disabled={disabled} />
        <Field label="Ngày tiếp nhận" type="date" value={values.intake_date} onChange={(v) => setText("intake_date", v)} disabled={disabled} />
        <SelectField label="Nhánh tư vấn" value={values.counseling_branch ?? ""} onChange={(v) => setText("counseling_branch", v)} options={branchOptions} disabled={disabled} />
        <SelectField label="Mức ưu tiên" value={values.priority_level ?? ""} onChange={(v) => setValues((c) => ({ ...c, priority_level: v ? v as NonNullable<typeof c.priority_level> : null }))} options={[["", "Chưa xác định"], ["low", "Thấp"], ["normal", "Bình thường"], ["high", "Cao"], ["urgent", "Khẩn cấp"]]} disabled={disabled} />
        <SelectField label="Trạng thái tiếp nhận" value={values.intake_status ?? ""} onChange={(v) => setText("intake_status", v)} options={[["", "Chưa xác định"], ["new", "Mới tiếp nhận"], ["collecting_data", "Đang thu thập dữ liệu"], ["ready_for_counseling", "Sẵn sàng tư vấn"], ["on_hold", "Tạm dừng"]]} disabled={disabled} />
        <SelectField label="Chuyên viên phụ trách" value={values.assigned_counselor_id ?? ""} onChange={(v) => setText("assigned_counselor_id", v)} options={[["", "Chưa phân công"], ...staffProfiles.filter((s) => s.role !== "ADMIN").map((s) => [s.id, `${s.full_name} · ${s.role}`])]} disabled={disabled} />
        <SelectField label="Hồ sơ tư vấn liên kết" value={values.counseling_case_id ?? ""} onChange={(v) => setText("counseling_case_id", v)} options={[["", "Chưa liên kết"], ...cases.map((item) => [item.id, item.case_number])]} disabled={disabled} />
        <SelectField label="Trạng thái assessment" value={values.assessment_status} onChange={(v) => setValues((c) => ({ ...c, assessment_status: v as typeof c.assessment_status }))} options={[["Draft", "Draft"], ["In Review", "In Review"], ["Reviewed", "Reviewed"], ["Closed", "Closed"]]} disabled={disabled} />
      </Section>

      <Section title="2. Mục tiêu học sinh" description="Làm rõ nguyện vọng, độ rõ định hướng và căn cứ tư vấn.">
        <SelectField label="Mục tiêu sau THPT" value={values.post_high_school_goal ?? ""} onChange={(v) => setText("post_high_school_goal", v)} options={goalOptions} disabled={disabled} />
        <SelectField label="Quan tâm học bổng" value={values.scholarship_interest ?? ""} onChange={(v) => setText("scholarship_interest", v)} options={[["", "Chưa xác định"], ["yes", "Có"], ["no", "Không"], ["exploring", "Đang tìm hiểu"]]} disabled={disabled} />
        <ScoreField label="Độ rõ định hướng (1-5)" value={values.orientation_clarity_score} onChange={(v) => setNumber("orientation_clarity_score", v)} disabled={disabled} />
        <Field label="Nhóm nghề / career cluster" value={values.career_cluster ?? ""} onChange={(v) => setText("career_cluster", v)} disabled={disabled} />
        <TextArea label="Ngành mục tiêu" value={values.target_majors_text ?? ""} onChange={(v) => setText("target_majors_text", v)} disabled={disabled} />
        <TextArea label="Quốc gia mục tiêu" value={values.target_countries ?? ""} onChange={(v) => setText("target_countries", v)} disabled={disabled} />
        <TextArea label="Trường mục tiêu ban đầu" value={values.target_universities_text ?? ""} onChange={(v) => setText("target_universities_text", v)} disabled={disabled} />
        <TextArea label="Ghi chú mục tiêu" value={values.goal_note ?? ""} onChange={(v) => setText("goal_note", v)} disabled={disabled} />
      </Section>

      <Section title="3. Hồ sơ học thuật" description="Tóm tắt GPA, môn mạnh/yếu, chứng chỉ và khoảng trống học thuật.">
        <TextArea label="Tóm tắt GPA" value={values.gpa_summary ?? ""} onChange={(v) => setText("gpa_summary", v)} disabled={disabled} />
        <Field label="Lộ trình học thuật" value={values.academic_track ?? ""} onChange={(v) => setText("academic_track", v)} disabled={disabled} />
        <Field label="Môn mạnh" value={values.strong_subjects ?? ""} onChange={(v) => setText("strong_subjects", v)} disabled={disabled} />
        <Field label="Môn cần củng cố" value={values.weak_subjects ?? ""} onChange={(v) => setText("weak_subjects", v)} disabled={disabled} />
        <Field label="IELTS" type="number" step="0.5" min="0" max="9" value={values.ielts_score ?? ""} onChange={(v) => setNumber("ielts_score", v)} disabled={disabled} />
        <Field label="SAT tổng" type="number" min="400" max="1600" value={values.sat_total ?? ""} onChange={(v) => setNumber("sat_total", v)} disabled={disabled} />
        <Field label="SAT Math" type="number" min="200" max="800" value={values.sat_math ?? ""} onChange={(v) => setNumber("sat_math", v)} disabled={disabled} />
        <Field label="SAT Reading & Writing" type="number" min="200" max="800" value={values.sat_rw ?? ""} onChange={(v) => setNumber("sat_rw", v)} disabled={disabled} />
        <TextArea label="Chứng chỉ khác" value={values.other_certificates ?? ""} onChange={(v) => setText("other_certificates", v)} disabled={disabled} />
        <ScoreField label="Mức sẵn sàng học thuật (1-5)" value={values.academic_readiness_score} onChange={(v) => setNumber("academic_readiness_score", v)} disabled={disabled} />
        <TextArea label="Khoảng trống học thuật" value={values.academic_gap_note ?? ""} onChange={(v) => setText("academic_gap_note", v)} disabled={disabled} />
      </Section>

      <Section title="4. Hoạt động và Portfolio" description="Theo SOP.HT-04: cấu trúc, minh chứng, mức sẵn sàng và handoff.">
        <TextArea label="Tóm tắt hoạt động" value={values.activities_summary ?? ""} onChange={(v) => setText("activities_summary", v)} disabled={disabled} />
        <TextArea label="Vai trò lãnh đạo" value={values.leadership_summary ?? ""} onChange={(v) => setText("leadership_summary", v)} disabled={disabled} />
        <TextArea label="Dự án" value={values.projects_summary ?? ""} onChange={(v) => setText("projects_summary", v)} disabled={disabled} />
        <TextArea label="Giải thưởng" value={values.awards_summary ?? ""} onChange={(v) => setText("awards_summary", v)} disabled={disabled} />
        <SelectField label="Tình trạng minh chứng" value={values.evidence_status ?? ""} onChange={(v) => setText("evidence_status", v)} options={[["", "Chưa đánh giá"], ["missing", "Thiếu"], ["partial", "Một phần"], ["sufficient", "Đủ"], ["verified", "Đã xác thực"]]} disabled={disabled} />
        <SelectField label="Mức minh chứng cao nhất" value={values.highest_evidence_level ?? ""} onChange={(v) => setText("highest_evidence_level", v)} options={[["", "Chưa có"], ["D", "D"], ["C", "C"], ["B", "B"], ["A", "A"]]} disabled={disabled} />
        <SelectField label="Portfolio readiness" value={values.portfolio_readiness_status ?? ""} onChange={(v) => setText("portfolio_readiness_status", v)} options={[["", "Chưa đánh giá"], ["Draft", "Draft"], ["Reviewed", "Reviewed"], ["Verified", "Verified"], ["Handoff-ready", "Handoff-ready"]]} disabled={disabled} />
        <ScoreField label="Độ mạnh hồ sơ (1-5)" value={values.profile_strength_score} onChange={(v) => setNumber("profile_strength_score", v)} disabled={disabled} />
        <Field label="Trạng thái CV" value={values.cv_status ?? ""} onChange={(v) => setText("cv_status", v)} disabled={disabled} />
        <Field label="Trạng thái Activity List" value={values.activity_list_status ?? ""} onChange={(v) => setText("activity_list_status", v)} disabled={disabled} />
        <Field label="Trạng thái evidence Portfolio" value={values.portfolio_evidence_status ?? ""} onChange={(v) => setText("portfolio_evidence_status", v)} disabled={disabled} />
        <TextArea label="Khoảng trống Portfolio" value={values.portfolio_gap_note ?? ""} onChange={(v) => setText("portfolio_gap_note", v)} disabled={disabled} />
      </Section>

      <Section title="5. Ràng buộc gia đình" description="Chỉ ghi thông tin vận hành tối thiểu; không nhập dữ liệu liên hệ hay dữ liệu sức khỏe.">
        <Field label="Mức tham gia của CMHS" value={values.parent_involvement_level ?? ""} onChange={(v) => setText("parent_involvement_level", v)} disabled={disabled} />
        <Field label="Ràng buộc địa lý" value={values.geography_constraints ?? ""} onChange={(v) => setText("geography_constraints", v)} disabled={disabled} />
        <Field label="Khoảng ngân sách (không nhập thông tin tài khoản)" value={values.budget_range ?? ""} onChange={(v) => setText("budget_range", v)} disabled={disabled} />
        <TextArea label="Ràng buộc an toàn/gia đình ở mức vận hành" value={values.safety_or_family_constraints ?? ""} onChange={(v) => setText("safety_or_family_constraints", v)} disabled={disabled} />
        <TextArea label="Ghi chú hạn chế — không ghi dữ liệu sức khỏe/tâm lý" value={values.sensitive_note ?? ""} onChange={(v) => setText("sensitive_note", v)} disabled={disabled} />
      </Section>

      <Section title="6. Timeline, rủi ro và kết luận" description="Bám deadline, xác định escalation và giao hành động tiếp theo.">
        <Field label="Deadline gần nhất" type="date" value={values.nearest_deadline ?? ""} onChange={(v) => setText("nearest_deadline", v)} disabled={disabled} />
        <Field label="Ngày thi tiếp theo" type="date" value={values.next_test_date ?? ""} onChange={(v) => setText("next_test_date", v)} disabled={disabled} />
        <Field label="Mùa ứng tuyển" value={values.application_season ?? ""} onChange={(v) => setText("application_season", v)} disabled={disabled} />
        <RiskField label="Rủi ro deadline" value={values.deadline_risk_level} onChange={(v) => setValues((c) => ({ ...c, deadline_risk_level: v }))} disabled={disabled} />
        <TextArea label="Hành động xử lý deadline" value={values.deadline_action_note ?? ""} onChange={(v) => setText("deadline_action_note", v)} disabled={disabled} />
        <ScoreField label="Mức sẵn sàng tổng thể (1-5)" value={values.overall_readiness_score} onChange={(v) => setNumber("overall_readiness_score", v)} disabled={disabled} />
        <TextArea label="Điểm mạnh chính" value={values.key_strengths ?? ""} onChange={(v) => setText("key_strengths", v)} disabled={disabled} />
        <TextArea label="Khoảng trống chính" value={values.key_gaps ?? ""} onChange={(v) => setText("key_gaps", v)} disabled={disabled} />
        <TextArea label="Tóm tắt rủi ro" value={values.risk_summary ?? ""} onChange={(v) => setText("risk_summary", v)} disabled={disabled} />
        <RiskField label="Mức rủi ro tổng thể" value={values.risk_level} onChange={(v) => setValues((c) => ({ ...c, risk_level: v }))} disabled={disabled} />
        <CheckField label="Cần escalation" checked={Boolean(values.escalation_required)} onChange={(v) => setValues((c) => ({ ...c, escalation_required: v }))} disabled={disabled} />
        <Field label="Escalation tới" value={values.escalation_to ?? ""} onChange={(v) => setText("escalation_to", v)} disabled={disabled} />
        <TextArea label="Kết luận intake theo mẫu cố định" rows={8} className="lg:col-span-2" value={values.intake_conclusion ?? ""} onChange={(v) => setText("intake_conclusion", v)} disabled={disabled} />
      </Section>

      <Section title="7. Hành động tiếp theo" description="Mỗi hành động có owner và due date theo nguyên tắc vận hành SOP.">
        <TextArea label="Hành động tiếp theo" value={values.next_action ?? ""} onChange={(v) => setText("next_action", v)} disabled={disabled} />
        <SelectField label="Owner tiếp theo" value={values.next_owner_id ?? ""} onChange={(v) => setText("next_owner_id", v)} options={[["", "Chưa giao"], ...staffProfiles.map((s) => [s.id, `${s.full_name} · ${s.role}`])]} disabled={disabled} />
        <Field label="Hạn hoàn thành" type="date" value={values.next_due_date ?? ""} onChange={(v) => setText("next_due_date", v)} disabled={disabled} />
        <CheckField label="Khuyến nghị tạo lịch tư vấn" checked={Boolean(values.create_session_recommended)} onChange={(v) => setValues((c) => ({ ...c, create_session_recommended: v }))} disabled={disabled} />
        <CheckField label="Khuyến nghị tạo công việc" checked={Boolean(values.create_task_recommended)} onChange={(v) => setValues((c) => ({ ...c, create_task_recommended: v }))} disabled={disabled} />
      </Section>
    </div>
  );
}

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <Card className="p-5 lg:p-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-lg font-black text-[#23328C]">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">{children}</div>
    </Card>
  );
}

function Field({ label, value, onChange, disabled, type = "text", step, min, max }: { label: string; value: string | number; onChange: (value: string) => void; disabled: boolean; type?: string; step?: string; min?: string; max?: string }) {
  return (
    <label className="space-y-1.5 text-sm font-bold text-slate-700">
      <span>{label}</span>
      <input type={type} step={step} min={min} max={max} value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium outline-none focus:border-[#23328C] disabled:bg-slate-100" />
    </label>
  );
}

function TextArea({ label, value, onChange, disabled, rows = 4, className = "" }: { label: string; value: string; onChange: (value: string) => void; disabled: boolean; rows?: number; className?: string }) {
  return (
    <label className={`space-y-1.5 text-sm font-bold text-slate-700 ${className}`}>
      <span>{label}</span>
      <textarea rows={rows} value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium leading-6 outline-none focus:border-[#23328C] disabled:bg-slate-100" />
    </label>
  );
}

function SelectField({ label, value, onChange, options, disabled }: { label: string; value: string; onChange: (value: string) => void; options: string[][]; disabled: boolean }) {
  return (
    <label className="space-y-1.5 text-sm font-bold text-slate-700">
      <span>{label}</span>
      <select value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium outline-none focus:border-[#23328C] disabled:bg-slate-100">
        {options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}
      </select>
    </label>
  );
}

function ScoreField({ label, value, onChange, disabled }: { label: string; value: number | null; onChange: (value: string) => void; disabled: boolean }) {
  return <SelectField label={label} value={value?.toString() ?? ""} onChange={onChange} options={[["", "Chưa đánh giá"], ...[1, 2, 3, 4, 5].map((score) => [String(score), String(score)])]} disabled={disabled} />;
}

function RiskField({ label, value, onChange, disabled }: { label: string; value: StudentIntakeAssessment["risk_level"]; onChange: (value: StudentIntakeAssessment["risk_level"]) => void; disabled: boolean }) {
  return <SelectField label={label} value={value ?? ""} onChange={(next) => onChange(next ? next as NonNullable<StudentIntakeAssessment["risk_level"]> : null)} options={[["", "Chưa đánh giá"], ["low", "Xanh · thấp"], ["medium", "Vàng · trung bình"], ["high", "Cam · cao"], ["critical", "Đỏ · nghiêm trọng"]]} disabled={disabled} />;
}

function CheckField({ label, checked, onChange, disabled }: { label: string; checked: boolean; onChange: (checked: boolean) => void; disabled: boolean }) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-700">
      <input type="checkbox" checked={checked} disabled={disabled} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 accent-[#D21235]" />
      {label}
    </label>
  );
}

function TasksPanel({ tasks }: { tasks: InternalTask[] }) {
  if (!tasks.length) return <Card><EmptyState message="Học sinh chưa có công việc nội bộ" /></Card>;
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-100 px-5 py-4"><h2 className="font-black text-[#23328C]">Công việc của học sinh</h2></div>
      <div className="divide-y divide-slate-100">
        {tasks.map((task) => (
          <div key={task.id} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="font-bold text-slate-800">{task.title}</p><p className="mt-1 text-xs text-slate-500">Hạn: {task.due_date ?? "Chưa đặt"}</p></div>
            <div className="flex gap-2"><StatusBadge value={task.task_status} /><Badge>{task.priority}</Badge></div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function SessionsPanel({ sessions }: { sessions: CounselingSession[] }) {
  if (!sessions.length) return <Card><EmptyState message="Học sinh chưa có lịch tư vấn" /></Card>;
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-100 px-5 py-4"><h2 className="font-black text-[#23328C]">Lịch sử và lịch sắp tới</h2></div>
      <div className="divide-y divide-slate-100">
        {sessions.map((session) => (
          <div key={session.id} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="font-bold text-slate-800">{new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(session.scheduled_at))}</p><p className="mt-1 text-xs text-slate-500">{session.mode} · {session.duration_minutes} phút · {session.location ?? "Chưa có địa điểm"}</p></div>
            <StatusBadge value={session.session_status} />
          </div>
        ))}
      </div>
    </Card>
  );
}
