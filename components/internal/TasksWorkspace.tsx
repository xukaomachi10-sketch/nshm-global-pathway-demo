"use client";

import { useMemo, useState, useTransition } from "react";
import { CheckSquare2, Clock3, Pencil, Plus, TriangleAlert } from "lucide-react";
import { createTaskAction, updateTaskAction } from "@/app/portal/tasks/actions";
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
import type { CounselingCase, InternalTask, Priority, StudentRecord, TaskStatus } from "@/types/database";

const statusLabel: Record<TaskStatus, string> = {
  todo: "Cần làm",
  in_progress: "Đang thực hiện",
  blocked: "Đang vướng",
  done: "Hoàn thành",
  cancelled: "Đã hủy",
};
const priorityLabel: Record<Priority, string> = {
  low: "Thấp",
  normal: "Bình thường",
  high: "Cao",
  urgent: "Khẩn cấp",
};
const fieldClass = "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-[#D21235]";

export function TasksWorkspace({
  initialTasks,
  students,
  cases,
  initialStatus,
}: {
  initialTasks: InternalTask[];
  students: StudentRecord[];
  cases: CounselingCase[];
  initialStatus: DataAccessStatus;
}) {
  const [tasks, setTasks] = useState(initialTasks);
  const [status, setStatus] = useState(initialStatus);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<InternalTask | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const { toast, showToast } = useToast();
  const [title, setTitle] = useState("");
  const [studentId, setStudentId] = useState(students[0]?.id ?? "");
  const [priority, setPriority] = useState<Priority>("normal");
  const [dueDate, setDueDate] = useState("");

  const studentById = useMemo(() => new Map(students.map((item) => [item.id, item])), [students]);
  const caseForStudent = useMemo(
    () => new Map(cases.map((item) => [item.student_id, item])),
    [cases],
  );
  const rows = useMemo(
    () => tasks.filter((task) => {
      const student = task.student_id ? studentById.get(task.student_id) : undefined;
      const haystack = `${task.title} ${student?.full_name ?? ""} ${student?.student_code ?? ""}`.toLowerCase();
      return (!search || haystack.includes(search.toLowerCase())) && (!statusFilter || statusLabel[task.task_status] === statusFilter);
    }),
    [search, statusFilter, studentById, tasks],
  );

  const resetCreate = () => {
    setTitle("");
    setStudentId(students[0]?.id ?? "");
    setPriority("normal");
    setDueDate("");
    setError("");
  };
  const submitCreate = () => {
    const student = studentById.get(studentId);
    const counselingCase = caseForStudent.get(studentId);
    setError("");
    startTransition(async () => {
      const response = await createTaskAction({
        title,
        studentId,
        caseId: counselingCase?.id ?? null,
        assignedTo: counselingCase?.assigned_counselor_id ?? student?.assigned_counselor_id ?? null,
        priority,
        dueDate: dueDate || null,
      });
      if (!response.ok) return setError(response.error);
      setTasks((current) => [response.result.data, ...current]);
      setStatus(response.result.status);
      setCreateOpen(false);
      resetCreate();
      showToast(response.result.activityLogged ? "Đã tạo công việc và activity log" : "Đã tạo công việc; activity log đang có cảnh báo");
    });
  };
  const submitUpdate = () => {
    if (!editing) return;
    setError("");
    startTransition(async () => {
      const response = await updateTaskAction({
        id: editing.id,
        title: editing.title,
        taskStatus: editing.task_status,
        priority: editing.priority,
        dueDate: editing.due_date,
      });
      if (!response.ok) return setError(response.error);
      setTasks((current) => current.map((item) => item.id === editing.id ? response.result.data : item));
      setStatus(response.result.status);
      setEditing(null);
      showToast(response.result.activityLogged ? "Đã cập nhật công việc và activity log" : "Đã cập nhật; activity log đang có cảnh báo");
    });
  };

  return (
    <div className="space-y-6 animate-rise">
      {toast}
      <PageHeader
        eyebrow="Internal Operations"
        title="Công việc nội bộ"
        description="Theo dõi đầu việc theo học sinh, mức ưu tiên và deadline; mọi thay đổi đều tạo activity log."
        actions={<Button onClick={() => { resetCreate(); setCreateOpen(true); }}><Plus className="h-4 w-4" /> Tạo công việc</Button>}
      />
      <DataModeNotice status={status} />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Đang mở" value={tasks.filter((item) => !["done", "cancelled"].includes(item.task_status)).length} helper="Công việc cần theo dõi" icon={<CheckSquare2 className="h-5 w-5" />} />
        <StatCard label="Khẩn cấp" value={tasks.filter((item) => item.priority === "urgent" && item.task_status !== "done").length} helper="Ưu tiên xử lý" icon={<TriangleAlert className="h-5 w-5" />} accent="red" />
        <StatCard label="Đã hoàn thành" value={tasks.filter((item) => item.task_status === "done").length} helper="Có nhật ký thay đổi" icon={<Clock3 className="h-5 w-5" />} accent="green" />
      </div>
      <FilterBar search={search} setSearch={setSearch} placeholder="Công việc, học sinh, mã học sinh..." onClear={() => { setSearch(""); setStatusFilter(""); }}>
        <Select value={statusFilter} onChange={setStatusFilter} label="Trạng thái" options={Object.values(statusLabel)} />
      </FilterBar>
      <Card className="overflow-hidden">
        {rows.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-3">Công việc</th><th className="px-4 py-3">Học sinh</th><th className="px-4 py-3">Trạng thái</th><th className="px-4 py-3">Ưu tiên</th><th className="px-4 py-3">Deadline</th><th className="px-5 py-3">Sửa</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((task) => {
                  const student = task.student_id ? studentById.get(task.student_id) : undefined;
                  return <tr key={task.id} className="hover:bg-[#FBFAF7]">
                    <td className="px-5 py-4"><p className="font-black text-[#23328C]">{task.title}</p><p className="mt-1 text-xs text-slate-400">{task.id.slice(0, 8)}</p></td>
                    <td className="px-4 py-4"><p className="font-semibold text-slate-700">{student?.full_name ?? "Chưa gắn học sinh"}</p><p className="text-xs text-slate-400">{student?.student_code}</p></td>
                    <td className="px-4 py-4"><StatusBadge value={statusLabel[task.task_status]} /></td>
                    <td className="px-4 py-4"><StatusBadge value={priorityLabel[task.priority]} /></td>
                    <td className="px-4 py-4 font-semibold text-slate-600">{task.due_date ? new Intl.DateTimeFormat("vi-VN").format(new Date(`${task.due_date}T00:00:00`)) : "—"}</td>
                    <td className="px-5 py-4"><Button variant="ghost" onClick={() => { setError(""); setEditing(task); }}><Pencil className="h-4 w-4" /> Cập nhật</Button></td>
                  </tr>;
                })}
              </tbody>
            </table>
          </div>
        ) : <EmptyState message="Chưa có công việc phù hợp" />}
      </Card>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Tạo công việc nội bộ">
        <div className="space-y-4">
          <label className="block text-sm font-bold text-slate-700">Tiêu đề<input value={title} onChange={(e) => setTitle(e.target.value)} className={`${fieldClass} mt-1`} /></label>
          <label className="block text-sm font-bold text-slate-700">Học sinh<select value={studentId} onChange={(e) => setStudentId(e.target.value)} className={`${fieldClass} mt-1`}>{students.map((student) => <option key={student.id} value={student.id}>{student.student_code} · {student.full_name}</option>)}</select></label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-bold text-slate-700">Ưu tiên<select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className={`${fieldClass} mt-1`}>{Object.entries(priorityLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label className="block text-sm font-bold text-slate-700">Deadline<input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={`${fieldClass} mt-1`} /></label>
          </div>
          {error && <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
          <div className="flex justify-end gap-2"><Button variant="secondary" onClick={() => setCreateOpen(false)}>Hủy</Button><Button disabled={isPending || !title.trim() || !studentId} onClick={submitCreate}>{isPending ? "Đang lưu..." : "Tạo công việc"}</Button></div>
        </div>
      </Modal>

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title="Cập nhật công việc">
        {editing && <div className="space-y-4">
          <label className="block text-sm font-bold text-slate-700">Tiêu đề<input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className={`${fieldClass} mt-1`} /></label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-bold text-slate-700">Trạng thái<select value={editing.task_status} onChange={(e) => setEditing({ ...editing, task_status: e.target.value as TaskStatus })} className={`${fieldClass} mt-1`}>{Object.entries(statusLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label className="block text-sm font-bold text-slate-700">Ưu tiên<select value={editing.priority} onChange={(e) => setEditing({ ...editing, priority: e.target.value as Priority })} className={`${fieldClass} mt-1`}>{Object.entries(priorityLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          </div>
          <label className="block text-sm font-bold text-slate-700">Deadline<input type="date" value={editing.due_date ?? ""} onChange={(e) => setEditing({ ...editing, due_date: e.target.value || null })} className={`${fieldClass} mt-1`} /></label>
          {error && <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
          <div className="flex justify-end gap-2"><Button variant="secondary" onClick={() => setEditing(null)}>Hủy</Button><Button disabled={isPending || !editing.title.trim()} onClick={submitUpdate}>{isPending ? "Đang lưu..." : "Lưu thay đổi"}</Button></div>
        </div>}
      </Modal>
    </div>
  );
}
