"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  FileClock,
  FilePlus2,
  FileUp,
  RefreshCw,
  UsersRound,
} from "lucide-react";
import { students } from "@/lib/data-access/demo-data";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  FilterBar,
  PageHeader,
  Progress,
  Select,
  StatCard,
  StatusBadge,
  useToast,
} from "@/components/ui";
import { useMemo, useState } from "react";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [risk, setRisk] = useState("");
  const [stage, setStage] = useState("");
  const { toast, showToast } = useToast();
  const rows = useMemo(
    () =>
      students
        .filter(
          (s) =>
            (!search ||
              `${s.name} ${s.id} ${s.targetUniversity}`
                .toLowerCase()
                .includes(search.toLowerCase())) &&
            (!risk || s.risk === risk) &&
            (!stage || s.stage === stage),
        )
        .slice(0, 10),
    [search, risk, stage],
  );
  return (
    <div className="space-y-6 animate-rise">
      {toast}
      <PageHeader
        eyebrow="Thứ Tư, 01 tháng 07"
        title="Chào buổi sáng, cô Linh"
        description="Đây là những việc cần ưu tiên hôm nay. 4 hồ sơ có deadline trong 7 ngày và 6 tài liệu mới đang chờ rà soát."
        actions={
          <>
            <Link
              href="/portal/import-students"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-[#23328C] transition hover:bg-slate-50"
            >
              <FileUp className="h-4 w-4" /> Import học sinh
            </Link>
            <Button
              variant="secondary"
              onClick={() => showToast("Đã làm mới dữ liệu lúc 09:42")}
            >
              <RefreshCw className="h-4 w-4" /> Làm mới
            </Button>
            <Button onClick={() => showToast("Đã mở lịch tư vấn mới")}>
              <CalendarDays className="h-4 w-4" /> Tạo lịch tư vấn
            </Button>
          </>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Hồ sơ đang phụ trách"
          value="36"
          helper="+4 so với tháng trước"
          icon={<UsersRound className="h-5 w-5" />}
        />
        <StatCard
          label="Deadline trong 7 ngày"
          value="12"
          helper="4 mục cần xử lý hôm nay"
          icon={<Clock3 className="h-5 w-5" />}
          accent="red"
        />
        <StatCard
          label="Tài liệu chờ duyệt"
          value="18"
          helper="6 tài liệu mới tải lên"
          icon={<FileClock className="h-5 w-5" />}
          accent="gold"
        />
        <StatCard
          label="Hồ sơ đúng tiến độ"
          value="89%"
          helper="Mục tiêu vận hành ≥ 90%"
          icon={<CheckCircle2 className="h-5 w-5" />}
          accent="green"
        />
      </div>
      <FilterBar
        search={search}
        setSearch={setSearch}
        placeholder="Tìm theo tên, mã HS hoặc trường..."
        onClear={() => {
          setSearch("");
          setRisk("");
          setStage("");
        }}
      >
        <Select
          value={stage}
          onChange={setStage}
          label="Trạng thái"
          options={[...new Set(students.map((s) => s.stage))]}
        />
        <Select
          value={risk}
          onChange={setRisk}
          label="Mức rủi ro"
          options={["Cao", "Trung bình", "Thấp"]}
        />
        <Button
          variant="secondary"
          onClick={() => showToast("Đã xuất 10 dòng theo bộ lọc hiện tại")}
        >
          <Download className="h-4 w-4" /> Xuất dữ liệu
        </Button>
      </FilterBar>
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="font-black text-[#23328C]">
              Hồ sơ cần xử lý hôm nay
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Sắp xếp theo quá hạn, deadline gần và tài liệu mới
            </p>
          </div>
          <Badge tone="red">
            {rows.filter((x) => x.risk === "Cao").length} rủi ro cao
          </Badge>
        </div>
        <div className="overflow-x-auto">
          {rows.length ? (
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3">Học sinh</th>
                  <th className="px-4 py-3">Mục tiêu</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3">Tiến độ</th>
                  <th className="px-4 py-3">Việc tiếp theo</th>
                  <th className="px-4 py-3">Deadline</th>
                  <th className="px-4 py-3">Rủi ro</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((s, i) => (
                  <tr key={s.id} className="group hover:bg-slate-50/80">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#23328C] text-xs font-black text-white">
                          {s.name
                            .split(" ")
                            .slice(-2)
                            .map((x) => x[0])
                            .join("")}
                        </div>
                        <div>
                          <Link
                            href={`/portal/students/${s.id}`}
                            className="font-bold text-[#23328C] hover:text-[#D21235]"
                          >
                            {s.name}
                          </Link>
                          <p className="text-xs text-slate-400">
                            {s.id} · {s.className}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-700">
                        {s.targetUniversity}
                      </p>
                      <p className="text-xs text-slate-400">
                        {s.country} · {s.major}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge value={s.stage} />
                    </td>
                    <td className="px-4 py-4">
                      <div className="w-28">
                        <div className="mb-1 flex justify-between text-[10px] font-bold text-slate-500">
                          <span>Hồ sơ</span>
                          <span>{s.progress}%</span>
                        </div>
                        <Progress value={s.progress} small />
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {
                        [
                          "Duyệt essay v4",
                          "Bổ sung minh chứng",
                          "Chốt University List",
                          "Gửi yêu cầu LOR",
                        ][i % 4]
                      }
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-bold text-slate-700">{s.deadline}</p>
                      <p
                        className={`text-xs ${i < 3 ? "text-[#D21235]" : "text-slate-400"}`}
                      >
                        {i < 3
                          ? `${i + 2} ngày còn lại`
                          : `${8 + i} ngày còn lại`}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge value={s.risk} />
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/portal/students/${s.id}`}
                        aria-label={`Mở hồ sơ ${s.name}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-[#D21235] hover:text-white"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState />
          )}
        </div>
      </Card>
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-[#23328C]">Deadline 7 ngày tới</h3>
            <Link
              href="/portal/applications"
              className="text-xs font-bold text-[#D21235]"
            >
              Xem tất cả
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {students.slice(0, 4).map((s, i) => (
              <div key={s.id} className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 flex-col items-center justify-center rounded-xl text-xs font-black ${i < 2 ? "bg-[#FAC7D0]/35 text-[#D21235]" : "bg-[#FFEBD6] text-[#23328C]"}`}
                >
                  <span>{4 + i}</span>
                  <span className="text-[8px]">THG 7</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{s.name}</p>
                  <p className="truncate text-xs text-slate-400">
                    {
                      [
                        "Nộp bản sửa essay",
                        "Xác nhận LOR",
                        "Hoàn thiện transcript",
                        "Review CSS Profile",
                      ][i]
                    }
                  </p>
                </div>
                <StatusBadge value={i === 0 ? "Quá hạn" : "Đang xử lý"} />
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-[#23328C]">Tài liệu mới hôm nay</h3>
            <Link
              href="/portal/documents"
              className="text-xs font-bold text-[#D21235]"
            >
              Mở hộp duyệt
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {[
              "IELTS_Certificate.pdf",
              "Essay_Personal_v4.docx",
              "Transcript_Grade11.pdf",
              "Activity_List_v3.docx",
            ].map((x, i) => (
              <div
                key={x}
                className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"
              >
                <div className="rounded-lg bg-white p-2 text-[#D21235]">
                  <FilePlus2 className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold">{x}</p>
                  <p className="text-[10px] text-slate-400">
                    {students[i].name} · {8 + i}:2{i}
                  </p>
                </div>
                <Badge tone="amber">Chờ duyệt</Badge>
              </div>
            ))}
          </div>
        </Card>
        <Card className="overflow-hidden">
          <div className="bg-[#23328C] p-5 text-white">
            <div className="flex items-center gap-2 text-[#FFAD00]">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs font-black uppercase tracking-wider">
                Cần chú ý
              </span>
            </div>
            <h3 className="mt-2 text-lg font-black">4 hồ sơ có rủi ro cao</h3>
            <p className="mt-1 text-xs leading-5 text-slate-300">
              Chủ yếu do trễ essay, thiếu minh chứng và chưa có phương án
              Safety.
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            {students
              .filter((s) => s.risk === "Cao")
              .slice(0, 3)
              .map((s, i) => (
                <Link
                  href={`/portal/students/${s.id}`}
                  key={s.id}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50"
                >
                  <div className="h-2 w-2 rounded-full bg-[#D21235]" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold">{s.name}</p>
                    <p className="truncate text-xs text-slate-400">
                      {
                        [
                          "Essay quá hạn 2 ngày",
                          "Thiếu phương án Safety",
                          "Minh chứng chưa xác thực",
                        ][i]
                      }
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-300" />
                </Link>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
