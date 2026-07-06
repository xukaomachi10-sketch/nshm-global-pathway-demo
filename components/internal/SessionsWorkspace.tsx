"use client";

import { useMemo, useState, useTransition } from "react";
import { CalendarCheck2, CalendarPlus, Clock3, Pencil } from "lucide-react";
import { createSessionAction, updateSessionAction } from "@/app/portal/sessions/actions";
import { DataModeNotice } from "./DataModeNotice";
import {
  Button,
  Card,
  EmptyState,
  FilterBar,
  Modal,
  PageHeader,
  Select,
  StatCard,
  StatusBadge,
  useToast,
} from "@/components/ui";
import type { DataAccessStatus } from "@/lib/data-access";
import type {
  CounselingCase,
  CounselingSession,
  SessionStatus,
  StudentRecord,
} from "@/types/database";

const statusLabel: Record<SessionStatus, string> = {
  scheduled: "Đã lên lịch",
  confirmed: "Đã xác nhận",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
  no_show: "Vắng mặt",
};
const modeLabel: Record<CounselingSession["mode"], string> = {
  in_person: "Trực tiếp",
  online: "Trực tuyến",
  phone: "Điện thoại",
};
const fieldClass = "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-[#D21235]";

function toLocalInput(value: string) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export function SessionsWorkspace({
  initialSessions,
  students,
  cases,
  initialStatus,
}: {
  initialSessions: CounselingSession[];
  students: StudentRecord[];
  cases: CounselingCase[];
  initialStatus: DataAccessStatus;
}) {
  const [sessions, setSessions] = useState(initialSessions);
  const [status, setStatus] = useState(initialStatus);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<CounselingSession | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const { toast, showToast } = useToast();
  const [caseId, setCaseId] = useState(cases[0]?.id ?? "");
  const [scheduledAt, setScheduledAt] = useState("");
  const [duration, setDuration] = useState(45);
  const [mode, setMode] = useState<CounselingSession["mode"]>("in_person");
  const [location, setLocation] = useState("");

  const studentById = useMemo(() => new Map(students.map((item) => [item.id, item])), [students]);
  const caseById = useMemo(() => new Map(cases.map((item) => [item.id, item])), [cases]);
  const rows = useMemo(
    () => sessions.filter((session) => {
      const student = studentById.get(session.student_id);
      const haystack = `${student?.full_name ?? ""} ${student?.student_code ?? ""} ${session.location ?? ""}`.toLowerCase();
      return (!search || haystack.includes(search.toLowerCase())) && (!statusFilter || statusLabel[session.session_status] === statusFilter);
    }),
    [search, sessions, statusFilter, studentById],
  );

  const resetCreate = () => {
    setCaseId(cases[0]?.id ?? "");
    setScheduledAt("");
    setDuration(45);
    setMode("in_person");
    setLocation("");
    setError("");
  };
  const submitCreate = () => {
    const counselingCase = caseById.get(caseId);
    if (!counselingCase) return setError("Hãy chọn một hồ sơ tư vấn.");
    const student = studentById.get(counselingCase.student_id);
    const counselorId = counselingCase.assigned_counselor_id ?? student?.assigned_counselor_id;
    if (!counselorId) return setError("Hồ sơ chưa có chuyên viên phụ trách.");
    setError("");
    startTransition(async () => {
      const response = await createSessionAction({
        studentId: counselingCase.student_id,
        caseId,
        counselorId,
        scheduledAt,
        durationMinutes: duration,
        mode,
        location,
      });
      if (!response.ok) return setError(response.error);
      setSessions((current) => [response.result.data, ...current]);
      setStatus(response.result.status);
      setCreateOpen(false);
      resetCreate();
      showToast(response.result.activityLogged ? "Đã tạo lịch và activity log" : "Đã tạo lịch; activity log đang có cảnh báo");
    });
  };
  const submitUpdate = () => {
    if (!editing) return;
    setError("");
    startTransition(async () => {
      const response = await updateSessionAction({
        id: editing.id,
        scheduledAt: editing.scheduled_at,
        durationMinutes: editing.duration_minutes,
        mode: editing.mode,
        location: editing.location,
        sessionStatus: editing.session_status,
        summary: editing.summary,
        nextAction: editing.next_action,
      });
      if (!response.ok) return setError(response.error);
      setSessions((current) => current.map((item) => item.id === editing.id ? response.result.data : item));
      setStatus(response.result.status);
      setEditing(null);
      showToast(response.result.activityLogged ? "Đã cập nhật lịch và activity log" : "Đã cập nhật; activity log đang có cảnh báo");
    });
  };

  return (
    <div className="space-y-6 animate-rise">
      {toast}
      <PageHeader
        eyebrow="Internal Operations"
        title="Lịch tư vấn"
        description="Lập lịch, cập nhật trạng thái và ghi nhận nội dung các buổi tư vấn của hồ sơ pilot."
        actions={<Button onClick={() => { resetCreate(); setCreateOpen(true); }}><CalendarPlus className="h-4 w-4" /> Tạo lịch tư vấn</Button>}
      />
      <DataModeNotice status={status} />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Tổng buổi" value={sessions.length} helper="Trong dữ liệu pilot" icon={<CalendarCheck2 className="h-5 w-5" />} />
        <StatCard label="Sắp diễn ra" value={sessions.filter((item) => ["scheduled", "confirmed"].includes(item.session_status)).length} helper="Cần theo dõi lịch" icon={<Clock3 className="h-5 w-5" />} accent="gold" />
        <StatCard label="Hoàn thành" value={sessions.filter((item) => item.session_status === "completed").length} helper="Đã có nhật ký" icon={<CalendarCheck2 className="h-5 w-5" />} accent="green" />
      </div>
      <FilterBar search={search} setSearch={setSearch} placeholder="Học sinh, mã học sinh, địa điểm..." onClear={() => { setSearch(""); setStatusFilter(""); }}>
        <Select value={statusFilter} onChange={setStatusFilter} label="Trạng thái" options={Object.values(statusLabel)} />
      </FilterBar>
      <Card className="overflow-hidden">
        {rows.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-3">Thời gian</th><th className="px-4 py-3">Học sinh</th><th className="px-4 py-3">Hình thức</th><th className="px-4 py-3">Trạng thái</th><th className="px-4 py-3">Tiếp theo</th><th className="px-5 py-3">Sửa</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((session) => {
                  const student = studentById.get(session.student_id);
                  return <tr key={session.id} className="hover:bg-[#FBFAF7]">
                    <td className="px-5 py-4"><p className="font-black text-[#23328C]">{new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(session.scheduled_at))}</p><p className="mt-1 text-xs text-slate-400">{session.duration_minutes} phút</p></td>
                    <td className="px-4 py-4"><p className="font-semibold text-slate-700">{student?.full_name ?? "Học sinh pilot"}</p><p className="text-xs text-slate-400">{student?.student_code}</p></td>
                    <td className="px-4 py-4"><p className="font-semibold text-slate-700">{modeLabel[session.mode]}</p><p className="text-xs text-slate-400">{session.location ?? "Chưa có địa điểm"}</p></td>
                    <td className="px-4 py-4"><StatusBadge value={statusLabel[session.session_status]} /></td>
                    <td className="max-w-xs px-4 py-4 text-slate-600">{session.next_action ?? "Cập nhật ghi chú sau buổi tư vấn"}</td>
                    <td className="px-5 py-4"><Button variant="ghost" onClick={() => { setError(""); setEditing(session); }}><Pencil className="h-4 w-4" /> Cập nhật</Button></td>
                  </tr>;
                })}
              </tbody>
            </table>
          </div>
        ) : <EmptyState message="Chưa có lịch tư vấn phù hợp" />}
      </Card>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Tạo lịch tư vấn">
        <div className="space-y-4">
          <label className="block text-sm font-bold text-slate-700">Hồ sơ học sinh<select value={caseId} onChange={(e) => setCaseId(e.target.value)} className={`${fieldClass} mt-1`}>{cases.map((item) => { const student = studentById.get(item.student_id); return <option key={item.id} value={item.id}>{student?.student_code} · {student?.full_name} · {item.case_number}</option>; })}</select></label>
          <label className="block text-sm font-bold text-slate-700">Thời gian<input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} className={`${fieldClass} mt-1`} /></label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-bold text-slate-700">Thời lượng<input type="number" min={15} max={240} step={15} value={duration} onChange={(e) => setDuration(Number(e.target.value))} className={`${fieldClass} mt-1`} /></label>
            <label className="block text-sm font-bold text-slate-700">Hình thức<select value={mode} onChange={(e) => setMode(e.target.value as CounselingSession["mode"])} className={`${fieldClass} mt-1`}>{Object.entries(modeLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          </div>
          <label className="block text-sm font-bold text-slate-700">Địa điểm / liên kết<input value={location} onChange={(e) => setLocation(e.target.value)} className={`${fieldClass} mt-1`} /></label>
          {error && <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
          <div className="flex justify-end gap-2"><Button variant="secondary" onClick={() => setCreateOpen(false)}>Hủy</Button><Button disabled={isPending || !caseId || !scheduledAt} onClick={submitCreate}>{isPending ? "Đang lưu..." : "Tạo lịch"}</Button></div>
        </div>
      </Modal>

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title="Cập nhật buổi tư vấn">
        {editing && <div className="space-y-4">
          <label className="block text-sm font-bold text-slate-700">Thời gian<input type="datetime-local" value={toLocalInput(editing.scheduled_at)} onChange={(e) => setEditing({ ...editing, scheduled_at: e.target.value })} className={`${fieldClass} mt-1`} /></label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-bold text-slate-700">Trạng thái<select value={editing.session_status} onChange={(e) => setEditing({ ...editing, session_status: e.target.value as SessionStatus })} className={`${fieldClass} mt-1`}>{Object.entries(statusLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label className="block text-sm font-bold text-slate-700">Hình thức<select value={editing.mode} onChange={(e) => setEditing({ ...editing, mode: e.target.value as CounselingSession["mode"] })} className={`${fieldClass} mt-1`}>{Object.entries(modeLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          </div>
          <label className="block text-sm font-bold text-slate-700">Ghi chú<textarea value={editing.summary ?? ""} onChange={(e) => setEditing({ ...editing, summary: e.target.value })} className="mt-1 min-h-24 w-full rounded-xl border border-slate-200 p-3 text-sm" /></label>
          <label className="block text-sm font-bold text-slate-700">Hành động tiếp theo<input value={editing.next_action ?? ""} onChange={(e) => setEditing({ ...editing, next_action: e.target.value })} className={`${fieldClass} mt-1`} /></label>
          {error && <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
          <div className="flex justify-end gap-2"><Button variant="secondary" onClick={() => setEditing(null)}>Hủy</Button><Button disabled={isPending} onClick={submitUpdate}>{isPending ? "Đang lưu..." : "Lưu thay đổi"}</Button></div>
        </div>}
      </Modal>
    </div>
  );
}
