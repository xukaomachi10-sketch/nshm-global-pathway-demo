"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Activity,
  ArrowLeft,
  Award,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  FileText,
  FolderLock,
  GraduationCap,
  Mail,
  MapPin,
  MessageSquareText,
  MoreHorizontal,
  Pencil,
  Phone,
  School,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
} from "lucide-react";
import { students } from "@/lib/data-access/demo-data";
import {
  Badge,
  Button,
  Card,
  PageHeader,
  Progress,
  StatusBadge,
  useToast,
} from "@/components/ui";

const tabs = [
  { label: "Tổng quan", href: "#overview" },
  { label: "Học thuật", href: "#academic" },
  { label: "Chứng chỉ & hoạt động", href: "/portal/evidence" },
  { label: "University List", href: "/portal/applications" },
  { label: "Tài liệu & Essays", href: "/portal/documents" },
  { label: "Lịch sử tư vấn", href: "#sessions" },
];
export default function Student360() {
  const { id } = useParams<{ id: string }>();
  const student = students.find((s) => s.id === id) || students[0];
  const { toast, showToast } = useToast();
  return (
    <div className="space-y-6 animate-rise">
      {toast}
      <div>
        <Link
          href="/portal"
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#D21235]"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Quay lại bàn làm việc
        </Link>
      </div>
      <Card className="overflow-hidden">
        <div className="relative bg-[#23328C] px-5 py-6 text-white soft-grid lg:px-7">
          <div className="soft-grid absolute right-0 top-0 h-full w-72 bg-[#D21235]/75" />
          <div className="relative flex flex-col gap-5 md:flex-row md:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-2 border-white/20 bg-white/10 text-2xl font-black">
              MA
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black">{student.name}</h1>
                <Badge tone="green">Hồ sơ đang hoạt động</Badge>
                <Badge tone="blue">Handoff-ready</Badge>
              </div>
              <p className="mt-2 text-sm text-slate-300">
                {student.id} · Lớp {student.className} · Tốt nghiệp{" "}
                {student.graduationYear}
              </p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> minhanh@nshm.edu.vn
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" /> 0986 238 117
                </span>
                <span className="flex items-center gap-1.5">
                  <UserRound className="h-3.5 w-3.5" /> GVCN: Nguyễn Thu Hà
                </span>
              </div>
            </div>
            <div className="relative flex gap-2">
              <Button
                variant="secondary"
                onClick={() => showToast("Đã mở chế độ chỉnh sửa hồ sơ")}
              >
                <Pencil className="h-4 w-4" /> Chỉnh sửa
              </Button>
              <Button
                variant="gold"
                onClick={() => showToast("Đã tạo lịch hẹn mới cho học sinh")}
              >
                <CalendarDays className="h-4 w-4" /> Đặt lịch
              </Button>
              <button className="rounded-xl border border-white/20 p-2.5 text-white hover:bg-white/10">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        <div className="scrollbar-none flex overflow-x-auto border-b border-slate-200 bg-white px-4 lg:px-6">
          {tabs.map((t, i) => (
            <Link
              key={t.label}
              href={t.href}
              className={`whitespace-nowrap border-b-2 px-4 py-4 text-sm font-bold ${i === 0 ? "border-[#D21235] text-[#D21235]" : "border-transparent text-slate-500 hover:text-[#23328C]"}`}
            >
              {t.label}
            </Link>
          ))}
        </div>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          ["GPA tích lũy", "9.2 / 10", "Top 8% khối", TrendingUp, "#23328C"],
          [
            "IELTS tốt nhất",
            "7.5",
            "Hết hạn 05/2028",
            BookOpenCheck,
            "#D21235",
          ],
          ["SAT tốt nhất", "1450", "Math 760", Target, "#FFAD00"],
          [
            "Portfolio",
            "Verified",
            "12 minh chứng A/B",
            ShieldCheck,
            "#2DA037",
          ],
          ["Tiến độ hồ sơ", "76%", "18/24 mục", CheckCircle2, "#23328C"],
        ].map(([l, v, h, I, c], i) => (
          <Card key={String(l)} className="p-4">
            <div className="flex items-center gap-3">
              <div
                className="rounded-xl p-2.5 text-white"
                style={{ background: String(c) }}
              >
                <I className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  {String(l)}
                </p>
                <p className="mt-0.5 text-xl font-black text-[#23328C]">
                  {String(v)}
                </p>
              </div>
            </div>
            {i === 4 ? (
              <div className="mt-3">
                <Progress value={76} />
                <p className="mt-1 text-[10px] text-slate-400">{String(h)}</p>
              </div>
            ) : (
              <p className="mt-2 text-[10px] text-slate-400">{String(h)}</p>
            )}
          </Card>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
        <div className="space-y-6">
          <Card className="p-5 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-black text-[#23328C]">
                  Hồ sơ định hướng du học
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Cập nhật sau buổi tư vấn 26/06/2026
                </p>
              </div>
              <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
                <Pencil className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <Info
                icon={<MapPin />}
                label="Quốc gia ưu tiên"
                value="Hoa Kỳ · Canada"
                helper="Ưu tiên thành phố có hệ sinh thái công nghệ"
              />
              <Info
                icon={<GraduationCap />}
                label="Ngành học quan tâm"
                value="Khoa học dữ liệu"
                helper="Phụ: Computer Science, Economics"
              />
              <Info
                icon={<School />}
                label="Trường mục tiêu"
                value="Boston University"
                helper="Northeastern · Wisconsin-Madison"
              />
              <Info
                icon={<CircleDollarSign />}
                label="Ngân sách dự kiến"
                value="$45,000 - $60,000/năm"
                helper="Có nhu cầu học bổng merit"
              />
            </div>
            <div className="mt-5 rounded-xl border border-[#23328C]/20 bg-[#ADDDFF]/35 p-4">
              <div className="flex gap-3">
                <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-[#23328C]" />
                <div>
                  <p className="text-sm font-black text-[#23328C]">
                    Nhận định của chuyên viên
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[#23328C]">
                    Hồ sơ học thuật tốt, có câu chuyện xuyên suốt về công nghệ
                    vì cộng đồng. Cần làm rõ impact định lượng của dự án Green
                    Steps và hoàn thiện phương án Safety trước 15/07.
                  </p>
                </div>
              </div>
            </div>
          </Card>
          <Card id="academic" className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="font-black text-[#23328C]">
                  Học thuật & điểm số
                </h2>
                <p className="text-xs text-slate-400">
                  Điểm tổng kết theo học kỳ
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={() => showToast("Đã mở bảng điểm đầy đủ")}
              >
                Xem bảng điểm <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead className="bg-slate-50 text-xs text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Học kỳ</th>
                    <th className="px-4 py-3">GPA</th>
                    <th className="px-4 py-3">Toán</th>
                    <th className="px-4 py-3">Ngữ văn</th>
                    <th className="px-4 py-3">Tiếng Anh</th>
                    <th className="px-4 py-3">Xếp loại</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    ["Lớp 10 · HK1", "8.8", "9.2", "8.4", "9.4"],
                    ["Lớp 10 · HK2", "9.0", "9.4", "8.5", "9.6"],
                    ["Lớp 11 · HK1", "9.2", "9.6", "8.7", "9.7"],
                    ["Lớp 11 · HK2", "9.3", "9.7", "8.8", "9.8"],
                  ].map((r) => (
                    <tr key={r[0]}>
                      <td className="px-5 py-3.5 font-bold">{r[0]}</td>
                      {r.slice(1).map((x) => (
                        <td key={x} className="px-4 py-3.5 text-slate-600">
                          {x}
                        </td>
                      ))}
                      <td className="px-4 py-3.5">
                        <Badge tone="green">Xuất sắc</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-[#23328C]">Dấu ấn nổi bật</h2>
              <Link
                href="/portal/evidence"
                className="text-xs font-bold text-[#D21235]"
              >
                Mở Evidence Vault
              </Link>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {[
                ["Giải Nhì Tin học TP", "Giải thưởng · Level A", Award],
                ["Green Steps", "Đồng sáng lập · Level A", Activity],
                ["NSHM Debate Club", "Chủ nhiệm · Level B", MessageSquareText],
              ].map(([a, b, I]) => (
                <div
                  key={String(a)}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                >
                  <I className="h-5 w-5 text-[#D21235]" />
                  <p className="mt-3 text-sm font-black">{String(a)}</p>
                  <p className="mt-1 text-xs text-slate-400">{String(b)}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-[#23328C]">Việc cần làm tiếp</h2>
              <Badge tone="red">3 ưu tiên</Badge>
            </div>
            <div className="mt-4 space-y-4">
              {[
                ["Hoàn thiện Personal Essay v4", "Hôm nay · 17:00", "Cao"],
                ["Bổ sung biên bản Green Steps", "04/07/2026", "Trung bình"],
                ["Chốt 2 trường Safety", "08/07/2026", "Trung bình"],
                ["Gửi package cho GVCN viết LOR", "12/07/2026", "Thấp"],
              ].map(([a, b, c], i) => (
                <div key={a} className="flex gap-3">
                  <button
                    onClick={() => showToast(`Đã đánh dấu hoàn thành: ${a}`)}
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-slate-300 hover:border-[#2DA037]/35 hover:bg-[#C7F1BF]/45"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold">{a}</p>
                    <p
                      className={`text-xs ${i === 0 ? "text-[#D21235]" : "text-slate-400"}`}
                    >
                      {b}
                    </p>
                  </div>
                  <StatusBadge value={c} />
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-[#23328C]">University List</h2>
              <Link
                href="/portal/applications"
                className="text-xs font-bold text-[#D21235]"
              >
                Chi tiết
              </Link>
            </div>
            <div className="mt-4 flex items-center justify-around rounded-xl bg-slate-50 p-4">
              {[
                ["Reach", 3, "purple"],
                ["Target", 4, "blue"],
                ["Safety", 2, "green"],
              ].map(([a, b, c]) => (
                <div key={String(a)} className="text-center">
                  <p className="text-2xl font-black text-[#23328C]">
                    {String(b)}
                  </p>
                  <Badge tone={c as "purple" | "blue" | "green"}>
                    {String(a)}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-3">
              {[
                "Boston University",
                "Northeastern University",
                "UW-Madison",
              ].map((x, i) => (
                <div key={x} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#23328C] text-xs font-black text-white">
                    {x
                      .split(" ")
                      .map((y) => y[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{x}</p>
                    <p className="text-xs text-slate-400">
                      Độ phù hợp {88 - i * 2}%
                    </p>
                  </div>
                  <StatusBadge value={i < 2 ? "Reach" : "Target"} />
                </div>
              ))}
            </div>
          </Card>
          <Card id="sessions" className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-[#23328C]">Lịch sử tư vấn</h2>
              <Button
                variant="ghost"
                onClick={() => showToast("Đã mở biên bản tư vấn đầy đủ")}
              >
                Xem tất cả
              </Button>
            </div>
            <div className="mt-4 space-y-4">
              {[
                [
                  "26/06",
                  "Tư vấn chiến lược hồ sơ",
                  "Chốt theme Data for Good và kế hoạch essay",
                ],
                [
                  "12/06",
                  "Rà soát University List",
                  "Bổ sung 2 trường Safety, cập nhật nguồn",
                ],
                [
                  "28/05",
                  "Khai thác hồ sơ lần 1",
                  "Xác định ngành, quốc gia và điểm thiếu",
                ],
              ].map(([d, t, n], i) => (
                <div key={d} className="relative flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[10px] font-black text-slate-600">
                    {d}
                  </div>
                  <div>
                    {i < 2 && (
                      <div className="absolute left-5 top-10 h-4 border-l border-slate-200" />
                    )}
                    <p className="text-sm font-bold">{t}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">{n}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card className="border-[#FFAD00]/40 bg-[#FFEBD6] p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#FFAD00] p-2 text-[#23328C]">
                <Clock3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-[#23328C]">
                  Lịch tiếp theo
                </p>
                <p className="font-black text-[#23328C]">14:30 · 03/07/2026</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Review Personal Essay v4 · Phòng HTQT 02
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Info({
  icon,
  label,
  value,
  helper,
}: {
  icon: React.ReactElement;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[#D21235]">
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400">{label}</p>
        <p className="mt-0.5 text-sm font-black text-[#23328C]">{value}</p>
        <p className="mt-1 text-xs text-slate-400">{helper}</p>
      </div>
    </div>
  );
}
