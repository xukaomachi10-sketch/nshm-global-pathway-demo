"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, FolderKanban, UsersRound } from "lucide-react";
import { DataModeNotice } from "./DataModeNotice";
import {
  Badge,
  Card,
  EmptyState,
  FilterBar,
  PageHeader,
  Select,
  StatusBadge,
  StatCard,
} from "@/components/ui";
import type { DataAccessStatus } from "@/lib/data-access";
import type { CounselingCase, StudentRecord } from "@/types/database";

const caseLabels: Record<CounselingCase["case_status"], string> = {
  intake: "Tiếp nhận",
  assessment: "Đánh giá",
  active: "Đang tư vấn",
  waiting_student: "Chờ học sinh",
  waiting_parent: "Chờ phụ huynh",
  on_hold: "Tạm dừng",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

const riskLabels: Record<StudentRecord["risk_level"], string> = {
  low: "Thấp",
  medium: "Trung bình",
  high: "Cao",
  critical: "Cao · khẩn cấp",
};

export function StudentsWorkspace({
  initialStudents,
  cases,
  status,
}: {
  initialStudents: StudentRecord[];
  cases: CounselingCase[];
  status: DataAccessStatus;
}) {
  const [search, setSearch] = useState("");
  const [caseStatus, setCaseStatus] = useState("");
  const [risk, setRisk] = useState("");
  const caseByStudent = useMemo(
    () => new Map(cases.map((item) => [item.student_id, item])),
    [cases],
  );
  const rows = useMemo(
    () =>
      initialStudents.filter((student) => {
        const counselingCase = caseByStudent.get(student.id);
        const haystack = `${student.student_code} ${student.full_name} ${student.class_name ?? ""} ${student.target_country ?? ""}`.toLowerCase();
        return (
          (!search || haystack.includes(search.toLowerCase())) &&
          (!risk || student.risk_level === risk) &&
          (!caseStatus ||
            (counselingCase && caseLabels[counselingCase.case_status] === caseStatus))
        );
      }),
    [caseByStudent, caseStatus, initialStudents, risk, search],
  );

  return (
    <div className="space-y-6 animate-rise">
      <PageHeader
        eyebrow="Internal Operations"
        title="Danh sách học sinh tư vấn"
        description="Theo dõi hồ sơ tư vấn, mức độ rủi ro và hành động tiếp theo trên một danh sách thống nhất."
      />
      <DataModeNotice status={status} />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Học sinh"
          value={initialStudents.length}
          helper="Chỉ dữ liệu giả trong pilot"
          icon={<UsersRound className="h-5 w-5" />}
        />
        <StatCard
          label="Hồ sơ đang mở"
          value={cases.filter((item) => !["completed", "cancelled"].includes(item.case_status)).length}
          helper="Cần tiếp tục theo dõi"
          icon={<FolderKanban className="h-5 w-5" />}
          accent="green"
        />
        <StatCard
          label="Rủi ro cao"
          value={initialStudents.filter((item) => ["high", "critical"].includes(item.risk_level)).length}
          helper="Ưu tiên rà soát"
          icon={<AlertTriangle className="h-5 w-5" />}
          accent="red"
        />
      </div>
      <FilterBar
        search={search}
        setSearch={setSearch}
        placeholder="Tên, mã học sinh, lớp, quốc gia..."
        onClear={() => {
          setSearch("");
          setCaseStatus("");
          setRisk("");
        }}
      >
        <Select
          value={caseStatus}
          onChange={setCaseStatus}
          label="Trạng thái hồ sơ"
          options={Object.values(caseLabels)}
        />
        <label className="relative">
          <span className="sr-only">Mức rủi ro</span>
          <select
            value={risk}
            onChange={(event) => setRisk(event.target.value)}
            className="h-11 min-w-36 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700"
          >
            <option value="">Mức rủi ro</option>
            {Object.entries(riskLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
      </FilterBar>
      <Card className="overflow-hidden">
        {rows.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] text-left text-sm">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3">Học sinh</th>
                  <th className="px-4 py-3">Lớp / Khối</th>
                  <th className="px-4 py-3">Định hướng</th>
                  <th className="px-4 py-3">Hồ sơ</th>
                  <th className="px-4 py-3">Rủi ro</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-5 py-3">Hành động tiếp theo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((student) => {
                  const counselingCase = caseByStudent.get(student.id);
                  return (
                    <tr key={student.id} className="hover:bg-[#FBFAF7]">
                      <td className="px-5 py-4">
                        <p className="font-black text-[#23328C]">{student.full_name}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {student.student_code}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-semibold text-slate-700">
                          {student.class_name ?? "Chưa có lớp"} · Khối {student.grade_level ?? "—"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          GVCN: {student.homeroom_teacher ?? "Chưa cập nhật"}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-semibold text-slate-700">{student.target_country ?? "Chưa xác định"}</p>
                        <p className="mt-1 text-xs text-slate-500">{student.intended_major ?? "Chưa chọn ngành"}</p>
                      </td>
                      <td className="px-4 py-4">
                        {counselingCase ? (
                          <>
                            <StatusBadge value={caseLabels[counselingCase.case_status]} />
                            <p className="mt-1 text-xs text-slate-400">{counselingCase.case_number}</p>
                          </>
                        ) : <Badge>Chưa mở hồ sơ</Badge>}
                      </td>
                      <td className="px-4 py-4"><StatusBadge value={riskLabels[student.risk_level]} /></td>
                      <td className="px-4 py-4">
                        <Badge tone={student.is_active_student ? "green" : "slate"}>
                          {student.is_active_student ? "Đang học" : "Không hoạt động"}
                        </Badge>
                      </td>
                      <td className="max-w-sm px-5 py-4 text-slate-600">
                        {counselingCase?.next_action ?? "Mở hồ sơ tư vấn và xác nhận nhu cầu."}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : <EmptyState message="Chưa có học sinh phù hợp" />}
      </Card>
    </div>
  );
}
