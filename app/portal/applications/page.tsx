"use client";

import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  Columns3,
  ExternalLink,
  Filter,
  GraduationCap,
  List,
  Plus,
  Target,
  Trophy,
} from "lucide-react";
import { applications } from "@/lib/data";
import {
  Badge,
  Button,
  Card,
  FilterBar,
  Modal,
  PageHeader,
  Progress,
  Select,
  StatusBadge,
  useToast,
} from "@/components/ui";
import { useMemo, useState } from "react";

type App = (typeof applications)[number];
const stages = ["Chưa bắt đầu", "Chuẩn bị hồ sơ", "Sẵn sàng nộp", "Đã nộp"];
export default function Applications() {
  const [data, setData] = useState<App[]>([...applications]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [view, setView] = useState<"board" | "list">("board");
  const [selected, setSelected] = useState<App | null>(null);
  const { toast, showToast } = useToast();
  const rows = useMemo(
    () =>
      data.filter(
        (x) =>
          (!search ||
            `${x.university} ${x.country}`
              .toLowerCase()
              .includes(search.toLowerCase())) &&
          (!type || x.type === type),
      ),
    [data, search, type],
  );
  const advance = (app: App) => {
    const i = stages.indexOf(app.status);
    const status = stages[Math.min(i + 1, stages.length - 1)];
    setData(
      data.map((x) => (x.university === app.university ? { ...x, status } : x)),
    );
    setSelected(null);
    showToast(`${app.university} đã chuyển sang “${status}”`);
  };
  return (
    <div className="space-y-6 animate-rise">
      {toast}
      <PageHeader
        eyebrow="University List · Reach / Target / Safety"
        title="University Application Pipeline"
        description="Quản trị chiến lược danh sách trường, deadline, độ phù hợp, học bổng và trạng thái nộp hồ sơ trên một không gian thống nhất."
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => showToast("University List đã được rà soát chéo")}
            >
              Rà soát chéo
            </Button>
            <Button onClick={() => showToast("Đã mở biểu mẫu thêm trường")}>
              <Plus className="h-4 w-4" /> Thêm trường
            </Button>
          </>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Tổng nguyện vọng
              </p>
              <p className="mt-2 text-3xl font-black text-[#10233f]">9</p>
              <p className="mt-1 text-xs text-slate-400">
                3 Reach · 4 Target · 2 Safety
              </p>
            </div>
            <div className="rounded-xl bg-[#10233f] p-3 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Sắp đến hạn
              </p>
              <p className="mt-2 text-3xl font-black text-[#10233f]">3</p>
              <p className="mt-1 text-xs text-red-600">Trong 30 ngày tới</p>
            </div>
            <div className="rounded-xl bg-[#941b2b] p-3 text-white">
              <CalendarClock className="h-5 w-5" />
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Đã nộp</p>
              <p className="mt-2 text-3xl font-black text-[#10233f]">1</p>
              <p className="mt-1 text-xs text-slate-400">11% University List</p>
            </div>
            <div className="rounded-xl bg-emerald-600 p-3 text-white">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Học bổng dự kiến
              </p>
              <p className="mt-2 text-3xl font-black text-[#10233f]">$48K</p>
              <p className="mt-1 text-xs text-slate-400">
                Tổng giá trị mỗi năm
              </p>
            </div>
            <div className="rounded-xl bg-[#d6aa49] p-3 text-white">
              <CircleDollarSign className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>
      <Card className="overflow-hidden">
        <div className="grid lg:grid-cols-[1.3fr_1fr]">
          <div className="p-5 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-black text-[#10233f]">
                  Cân bằng chiến lược
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Mục tiêu tối thiểu 2 phương án Safety phù hợp
                </p>
              </div>
              <Badge tone="green">Đạt chuẩn</Badge>
            </div>
            <div className="mt-5 flex h-4 overflow-hidden rounded-full">
              <div className="w-[33%] bg-purple-500" />
              <div className="w-[45%] bg-blue-500" />
              <div className="w-[22%] bg-emerald-500" />
            </div>
            <div className="mt-3 flex flex-wrap gap-5 text-xs font-bold">
              <span className="flex items-center gap-2">
                <i className="h-2.5 w-2.5 rounded-full bg-purple-500" /> Reach 3
              </span>
              <span className="flex items-center gap-2">
                <i className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Target 4
              </span>
              <span className="flex items-center gap-2">
                <i className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Safety
                2
              </span>
            </div>
          </div>
          <div className="border-t border-slate-100 bg-amber-50 p-5 lg:border-l lg:border-t-0">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0 text-amber-700" />
              <div>
                <p className="text-sm font-black text-amber-950">
                  1 rủi ro cần theo dõi
                </p>
                <p className="mt-1 text-xs leading-5 text-amber-800">
                  Boston University: Supplemental Essay mới đạt 45%, còn 24 ngày
                  trước mốc review nội bộ.
                </p>
                <button
                  onClick={() =>
                    showToast("Đã giao việc sửa essay cho học sinh")
                  }
                  className="mt-2 text-xs font-black text-amber-900 underline"
                >
                  Giao việc ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <FilterBar
        search={search}
        setSearch={setSearch}
        placeholder="Tìm trường, quốc gia..."
        onClear={() => {
          setSearch("");
          setType("");
        }}
      >
        <Select
          value={type}
          onChange={setType}
          label="Nhóm chiến lược"
          options={["Reach", "Target", "Safety"]}
        />
        <Button variant="secondary">
          <Filter className="h-4 w-4" /> Thêm bộ lọc
        </Button>
        <div className="flex rounded-xl border border-slate-200 bg-white p-1">
          <button
            onClick={() => setView("board")}
            className={`rounded-lg p-2 ${view === "board" ? "bg-[#10233f] text-white" : "text-slate-400"}`}
          >
            <Columns3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`rounded-lg p-2 ${view === "list" ? "bg-[#10233f] text-white" : "text-slate-400"}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </FilterBar>
      {view === "board" ? (
        <div className="grid gap-4 xl:grid-cols-4">
          {stages.map((stage, si) => {
            const items = rows.filter((x) => x.status === stage);
            return (
              <div key={stage} className="min-w-0">
                <div className="mb-3 flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${si === 0 ? "bg-slate-400" : si === 1 ? "bg-amber-500" : si === 2 ? "bg-blue-500" : "bg-emerald-500"}`}
                    />
                    <h3 className="text-sm font-black text-[#10233f]">
                      {stage}
                    </h3>
                  </div>
                  <Badge>{items.length}</Badge>
                </div>
                <div className="min-h-72 space-y-3 rounded-2xl bg-slate-200/50 p-3">
                  {items.map((app) => (
                    <button
                      key={app.university}
                      onClick={() => setSelected(app)}
                      className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#941b2b] hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10233f] text-xs font-black text-white">
                          {app.university
                            .split(" ")
                            .map((x) => x[0])
                            .slice(0, 2)
                            .join("")}
                        </div>
                        <StatusBadge value={app.type} />
                      </div>
                      <h4 className="mt-3 text-sm font-black leading-5 text-[#10233f]">
                        {app.university}
                      </h4>
                      <p className="mt-1 text-xs text-slate-400">
                        {app.country} · {app.round}
                      </p>
                      <div className="mt-4">
                        <div className="mb-1 flex justify-between text-[10px] font-bold text-slate-400">
                          <span>Độ phù hợp</span>
                          <span>{app.fit}%</span>
                        </div>
                        <Progress
                          value={app.fit}
                          small
                          color={
                            app.type === "Reach"
                              ? "#a855f7"
                              : app.type === "Target"
                                ? "#3b82f6"
                                : "#10b981"
                          }
                        />
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                          <CalendarClock className="h-3 w-3" />
                          {app.deadline}
                        </span>
                        {app.scholarship !== "Không" && (
                          <Trophy className="h-4 w-4 text-[#d6aa49]" />
                        )}
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      showToast(`Đã mở biểu mẫu thêm trường ở cột ${stage}`)
                    }
                    className="flex w-full items-center justify-center gap-1 rounded-xl border border-dashed border-slate-300 py-3 text-xs font-bold text-slate-400 hover:border-[#941b2b] hover:text-[#941b2b]"
                  >
                    <Plus className="h-3.5 w-3.5" /> Thêm nguyện vọng
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500">
                <tr>
                  <th className="px-5 py-3">Trường đại học</th>
                  <th className="px-4 py-3">Chiến lược</th>
                  <th className="px-4 py-3">Độ phù hợp</th>
                  <th className="px-4 py-3">Vòng / Deadline</th>
                  <th className="px-4 py-3">Học bổng</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((app) => (
                  <tr key={app.university} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <p className="font-black text-[#10233f]">
                        {app.university}
                      </p>
                      <p className="text-xs text-slate-400">{app.country}</p>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge value={app.type} />
                    </td>
                    <td className="px-4 py-4">
                      <div className="w-28">
                        <div className="mb-1 text-xs font-bold">{app.fit}%</div>
                        <Progress value={app.fit} small />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-bold">{app.round}</p>
                      <p className="text-xs text-slate-400">{app.deadline}</p>
                    </td>
                    <td className="px-4 py-4">{app.scholarship}</td>
                    <td className="px-4 py-4">
                      <StatusBadge value={app.status} />
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => setSelected(app)}>
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.university || "Chi tiết nguyện vọng"}
        width="max-w-2xl"
      >
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            <StatusBadge value={selected?.type || ""} />
            <StatusBadge value={selected?.status || ""} />
            <Badge tone="gold">{selected?.round}</Badge>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Phù hợp học thuật", "4.6 / 5"],
              ["Phù hợp tài chính", "3.8 / 5"],
              ["Phù hợp định hướng", "4.7 / 5"],
            ].map((x) => (
              <div key={x[0]} className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-400">{x[0]}</p>
                <p className="mt-1 text-xl font-black text-[#10233f]">{x[1]}</p>
              </div>
            ))}
          </div>
          <div>
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-bold">Mức độ sẵn sàng hồ sơ</span>
              <span className="font-black">{selected?.fit}%</span>
            </div>
            <Progress value={selected?.fit || 0} />
          </div>
          <div className="rounded-xl border border-slate-100 p-4">
            <h4 className="text-sm font-black">Mốc tiếp theo</h4>
            <p className="mt-1 text-sm text-slate-600">
              Hoàn thiện Supplemental Essay và rà soát financial aid checklist
              trước {selected?.deadline}.
            </p>
          </div>
          <div className="flex justify-between">
            <Button variant="secondary">
              <ExternalLink className="h-4 w-4" /> Nguồn tuyển sinh
            </Button>
            <Button
              disabled={selected?.status === "Đã nộp"}
              onClick={() => selected && advance(selected)}
            >
              Chuyển bước tiếp theo <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
