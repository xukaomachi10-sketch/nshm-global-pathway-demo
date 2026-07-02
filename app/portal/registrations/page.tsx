"use client";

import {
  AlertCircle,
  CalendarPlus,
  CheckCircle2,
  Clock,
  Download,
  Link2,
  Plus,
  RefreshCw,
  UserCheck,
  UsersRound,
} from "lucide-react";
import { students } from "@/lib/data";
import {
  Badge,
  Button,
  Card,
  FilterBar,
  Modal,
  PageHeader,
  Select,
  StatusBadge,
  useToast,
} from "@/components/ui";
import { useMemo, useState } from "react";

type Registration = {
  id: string;
  studentId: string;
  name: string;
  className: string;
  parent: string;
  interest: string;
  status: string;
  duplicate: string;
  counselor: string;
  schedule: string;
  created: string;
};
const initial: Registration[] = students
  .slice(0, 12)
  .map((s, i) => ({
    id: `REG-2607-${String(i + 1).padStart(3, "0")}`,
    studentId: s.id,
    name: s.name,
    className: s.className,
    parent: `09${32 + i} 48${70 + i} 26`,
    interest: `${s.country} · ${s.major}`,
    status: [
      "Mới đăng ký",
      "Chờ phân công",
      "Đã phân công",
      "Đã đặt lịch",
      "Đã tư vấn",
    ][i % 5],
    duplicate:
      i === 0
        ? "Trùng Mã HS"
        : i === 5
          ? "Có hồ sơ cũ"
          : i === 8
            ? "Đăng ký lặp"
            : "Không trùng",
    counselor: i % 5 < 2 ? "—" : s.counselor,
    schedule:
      i % 5 >= 3
        ? `${String(9 + (i % 5)).padStart(2, "0")}:00 · 0${2 + (i % 6)}/07`
        : "—",
    created: `${String(29 - (i % 5)).padStart(2, "0")}/06 · ${8 + (i % 9)}:15`,
  }));

export default function Registrations() {
  const [data, setData] = useState(initial);
  const [search, setSearch] = useState("");
  const [duplicate, setDuplicate] = useState("");
  const [status, setStatus] = useState("");
  const [newOpen, setNewOpen] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [scheduleOpen, setScheduleOpen] = useState<Registration | null>(null);
  const { toast, showToast } = useToast();
  const existing = students.find(
    (s) => s.id.toLowerCase() === studentId.trim().toLowerCase(),
  );
  const rows = useMemo(
    () =>
      data.filter(
        (r) =>
          (!search ||
            `${r.name} ${r.studentId}`
              .toLowerCase()
              .includes(search.toLowerCase())) &&
          (!duplicate ||
            (duplicate === "Có cảnh báo"
              ? r.duplicate !== "Không trùng"
              : r.duplicate === "Không trùng")) &&
          (!status || r.status === status),
      ),
    [data, search, duplicate, status],
  );
  const create = () => {
    if (!studentId || (!name && !existing)) return;
    const reg: Registration = {
      id: `REG-2607-${String(data.length + 1).padStart(3, "0")}`,
      studentId: studentId.toUpperCase(),
      name: existing?.name || name,
      className: existing?.className || "Chờ xác minh",
      parent: "Chưa cung cấp",
      interest: "Chờ khai thác",
      status: "Mới đăng ký",
      duplicate: existing ? "Trùng Mã HS" : "Không trùng",
      counselor: "—",
      schedule: "—",
      created: "01/07 · 10:05",
    };
    setData([reg, ...data]);
    setNewOpen(false);
    setStudentId("");
    setName("");
    showToast(
      existing
        ? "Đã liên kết đăng ký với hồ sơ học sinh hiện có"
        : "Đã tạo đăng ký tư vấn mới",
    );
  };
  const schedule = (r: Registration) => {
    setData(
      data.map((x) =>
        x.id === r.id
          ? {
              ...x,
              status: "Đã đặt lịch",
              counselor: x.counselor === "—" ? "Nguyễn Hà Linh" : x.counselor,
              schedule: "14:30 · 03/07",
            }
          : x,
      ),
    );
    setScheduleOpen(null);
    showToast("Đã đặt lịch và gửi thông báo cho chuyên viên");
  };
  return (
    <div className="space-y-6 animate-rise">
      {toast}
      <PageHeader
        eyebrow="Tiếp nhận & điều phối"
        title="Đăng ký chờ tư vấn"
        description="Đối chiếu Mã HS ngay khi tiếp nhận, liên kết đăng ký lặp vào hồ sơ gốc và điều phối lịch tư vấn trong SLA 2 ngày làm việc."
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => showToast("Danh sách đã được làm mới")}
            >
              <RefreshCw className="h-4 w-4" /> Làm mới
            </Button>
            <Button onClick={() => setNewOpen(true)}>
              <Plus className="h-4 w-4" /> Tiếp nhận đăng ký
            </Button>
          </>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Đăng ký mới", "8", "Trong 48 giờ", UsersRound, "navy"],
          ["Chờ phân công", "5", "Cần owner hôm nay", UserCheck, "red"],
          [
            "Cảnh báo trùng",
            "3",
            "Cần rà soát & liên kết",
            AlertCircle,
            "gold",
          ],
          ["Đã đặt lịch", "12", "7 lịch trong tuần", CalendarPlus, "green"],
        ].map(([l, v, h, I, c]) => (
          <Card key={String(l)} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  {String(l)}
                </p>
                <p className="mt-2 text-3xl font-black text-[#23328C]">
                  {String(v)}
                </p>
                <p className="mt-1 text-xs text-slate-400">{String(h)}</p>
              </div>
              <div
                className={`rounded-xl p-3 text-white ${c === "red" ? "bg-[#D21235]" : c === "gold" ? "bg-[#FFAD00]" : c === "green" ? "bg-[#2DA037]" : "bg-[#23328C]"}`}
              >
                <I className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>
      <FilterBar
        search={search}
        setSearch={setSearch}
        placeholder="Tên học sinh, Mã HS, mã đăng ký..."
        onClear={() => {
          setSearch("");
          setDuplicate("");
          setStatus("");
        }}
      >
        <Select
          value={status}
          onChange={setStatus}
          label="Trạng thái"
          options={[
            "Mới đăng ký",
            "Chờ phân công",
            "Đã phân công",
            "Đã đặt lịch",
            "Đã tư vấn",
          ]}
        />
        <Select
          value={duplicate}
          onChange={setDuplicate}
          label="Đối chiếu trùng"
          options={["Có cảnh báo", "Không trùng"]}
        />
        <Button
          variant="secondary"
          onClick={() => showToast("Đã xuất danh sách theo bộ lọc")}
        >
          <Download className="h-4 w-4" /> Xuất Excel
        </Button>
      </FilterBar>
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="font-black text-[#23328C]">Danh sách đăng ký</h2>
            <p className="text-xs text-slate-400">
              {rows.length} lượt đăng ký · ưu tiên cảnh báo trùng trước
            </p>
          </div>
          <div className="flex gap-2">
            <Badge tone="red">3 cần kiểm tra</Badge>
            <Badge tone="amber">5 chưa có owner</Badge>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px] text-left text-sm">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3">Đăng ký / Học sinh</th>
                <th className="px-4 py-3">Liên hệ CMHS</th>
                <th className="px-4 py-3">Quan tâm</th>
                <th className="px-4 py-3">Đối chiếu</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Chuyên viên</th>
                <th className="px-4 py-3">Lịch hẹn</th>
                <th className="px-5 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows
                .sort(
                  (a, b) =>
                    (a.duplicate === "Không trùng" ? 1 : 0) -
                    (b.duplicate === "Không trùng" ? 1 : 0),
                )
                .map((r) => (
                  <tr
                    key={r.id}
                    className={
                      r.duplicate !== "Không trùng"
                        ? "bg-[#FAC7D0]/20 hover:bg-[#FAC7D0]/30"
                        : "hover:bg-slate-50"
                    }
                  >
                    <td className="px-5 py-4">
                      <p className="font-bold text-[#23328C]">{r.name}</p>
                      <p className="text-xs text-slate-400">
                        {r.id} · {r.studentId} · {r.className}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-600">{r.parent}</p>
                      <p className="text-xs text-slate-400">
                        Đăng ký {r.created}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{r.interest}</td>
                    <td className="px-4 py-4">
                      {r.duplicate === "Không trùng" ? (
                        <Badge tone="green">
                          <CheckCircle2 className="mr-1 h-3 w-3" /> Không trùng
                        </Badge>
                      ) : (
                        <Badge tone="red">
                          <AlertCircle className="mr-1 h-3 w-3" /> {r.duplicate}
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge value={r.status} />
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-600">
                      {r.counselor}
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-bold text-slate-700">{r.schedule}</p>
                      {r.schedule !== "—" && (
                        <p className="text-xs text-slate-400">Phòng HTQT 02</p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        {r.duplicate !== "Không trùng" && (
                          <button
                            title="Liên kết hồ sơ"
                            onClick={() =>
                              showToast(
                                `Đã liên kết ${r.studentId} với hồ sơ gốc`,
                              )
                            }
                            className="rounded-lg border border-[#D21235]/25 p-2 text-[#D21235] hover:bg-[#FAC7D0]/35"
                          >
                            <Link2 className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          title="Đặt lịch"
                          onClick={() => setScheduleOpen(r)}
                          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
                        >
                          <CalendarPlus className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2 p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-[#23328C]">
              Lịch tư vấn hôm nay & ngày mai
            </h3>
            <Badge tone="blue">6 lịch</Badge>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {data
              .filter((x) => x.schedule !== "—")
              .slice(0, 4)
              .map((r, i) => (
                <div
                  key={r.id}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"
                >
                  <div className="rounded-xl bg-[#23328C] px-3 py-2 text-center text-white">
                    <p className="text-xs font-black">
                      {["09:00", "10:30", "14:00", "15:30"][i]}
                    </p>
                    <p className="text-[9px] text-slate-300">
                      {i < 2 ? "HÔM NAY" : "NGÀY MAI"}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{r.name}</p>
                    <p className="text-xs text-slate-400">
                      {r.counselor} · Phòng HTQT
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </Card>
        <Card className="border-[#FFAD00]/35 bg-[#FFEBD6] p-5">
          <Clock className="h-5 w-5 text-[#23328C]" />
          <h3 className="mt-3 font-black text-[#23328C]">SLA tiếp nhận</h3>
          <p className="mt-1 text-sm leading-6 text-[#23328C]">
            100% đăng ký cần được phản hồi trong 2 ngày làm việc. Hiện có{" "}
            <strong>2 đăng ký</strong> còn dưới 8 giờ trước hạn.
          </p>
          <Button
            variant="gold"
            className="mt-4 w-full"
            onClick={() => setStatus("Mới đăng ký")}
          >
            Xem hồ sơ sắp đến hạn
          </Button>
        </Card>
      </div>
      <Modal
        open={newOpen}
        onClose={() => setNewOpen(false)}
        title="Tiếp nhận đăng ký tư vấn"
      >
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-bold text-slate-700">
              Mã học sinh <span className="text-[#D21235]">*</span>
            </span>
            <input
              autoFocus
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Ví dụ: NSHM260101"
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm uppercase focus:border-[#D21235]"
            />
          </label>
          {studentId && existing && (
            <div className="rounded-xl border border-[#D21235]/25 bg-[#FAC7D0]/35 p-4">
              <div className="flex gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#D21235]" />
                <div>
                  <p className="text-sm font-black text-[#D21235]">
                    Phát hiện trùng Mã HS
                  </p>
                  <p className="mt-1 text-sm text-[#D21235]">
                    {existing.name} · {existing.className} đã có hồ sơ ở trạng
                    thái “{existing.stage}”. Đăng ký mới sẽ được liên kết, không
                    tạo hồ sơ học sinh thứ hai.
                  </p>
                </div>
              </div>
            </div>
          )}
          <label className="block">
            <span className="text-sm font-bold text-slate-700">
              Họ tên học sinh
            </span>
            <input
              value={existing?.name || name}
              disabled={!!existing}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập họ và tên"
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm disabled:bg-slate-100"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className="text-sm font-bold text-slate-700">
                Quốc gia quan tâm
              </span>
              <select className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm">
                <option>Hoa Kỳ</option>
                <option>Canada</option>
                <option>Anh</option>
                <option>Úc</option>
              </select>
            </label>
            <label>
              <span className="text-sm font-bold text-slate-700">
                Mức ưu tiên
              </span>
              <select className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm">
                <option>Thường quy</option>
                <option>Deadline gần</option>
                <option>Cần xác minh</option>
              </select>
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setNewOpen(false)}>
              Hủy
            </Button>
            <Button
              disabled={!studentId || (!name && !existing)}
              onClick={create}
            >
              {existing ? "Liên kết đăng ký" : "Tạo đăng ký"}
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        open={!!scheduleOpen}
        onClose={() => setScheduleOpen(null)}
        title={`Đặt lịch tư vấn · ${scheduleOpen?.name || ""}`}
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className="text-sm font-bold">Ngày tư vấn</span>
              <input
                type="date"
                defaultValue="2026-07-03"
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"
              />
            </label>
            <label>
              <span className="text-sm font-bold">Khung giờ</span>
              <select className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm">
                <option>14:30 - 15:15</option>
                <option>15:30 - 16:15</option>
              </select>
            </label>
          </div>
          <label className="block">
            <span className="text-sm font-bold">Chuyên viên</span>
            <select className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm">
              <option>Nguyễn Hà Linh</option>
              <option>Trần Đức Anh</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-bold">Địa điểm</span>
            <select className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm">
              <option>Phòng HTQT 02</option>
              <option>Online · Microsoft Teams</option>
            </select>
          </label>
          <div className="rounded-xl bg-[#ADDDFF]/35 p-3 text-xs text-[#23328C]">
            Hệ thống đã kiểm tra: chuyên viên không có lịch trùng trong khung
            giờ này.
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setScheduleOpen(null)}>
              Hủy
            </Button>
            <Button onClick={() => schedule(scheduleOpen!)}>
              Xác nhận & gửi thông báo
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
