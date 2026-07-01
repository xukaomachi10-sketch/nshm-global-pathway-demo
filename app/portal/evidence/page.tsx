"use client";

import {
  AlertTriangle,
  Award,
  CheckCircle2,
  Download,
  ExternalLink,
  FileCheck2,
  FileUp,
  FolderLock,
  Grid2X2,
  List,
  MoreHorizontal,
  SearchCheck,
  ShieldCheck,
  Trophy,
  UploadCloud,
} from "lucide-react";
import { evidenceItems } from "@/lib/data";
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

export default function Evidence() {
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState("");
  const [status, setStatus] = useState("");
  const [grid, setGrid] = useState(true);
  const [upload, setUpload] = useState(false);
  const [selected, setSelected] = useState<
    (typeof evidenceItems)[number] | null
  >(null);
  const { toast, showToast } = useToast();
  const rows = useMemo(
    () =>
      evidenceItems.filter(
        (x) =>
          (!search ||
            `${x.title} ${x.detail}`
              .toLowerCase()
              .includes(search.toLowerCase())) &&
          (!kind || x.kind === kind) &&
          (!status || x.status === status),
      ),
    [search, kind, status],
  );
  return (
    <div className="space-y-6 animate-rise">
      {toast}
      <PageHeader
        eyebrow="Portfolio · Kho minh chứng"
        title="Evidence Vault"
        description="Lưu trữ, phân loại và xác thực chứng chỉ, giải thưởng, dự án, CLB và hoạt động ngoại khóa. Chỉ minh chứng Level A/B được dùng cho hồ sơ trọng yếu."
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => showToast("Đã mở thư mục Drive chuẩn NSHM")}
            >
              <FolderLock className="h-4 w-4" /> Mở thư mục
            </Button>
            <Button onClick={() => setUpload(true)}>
              <UploadCloud className="h-4 w-4" /> Tải minh chứng
            </Button>
          </>
        }
      />
      <Card className="overflow-hidden">
        <div className="grid lg:grid-cols-[1.25fr_1fr]">
          <div className="bg-[#10233f] p-6 text-white soft-grid">
            <div className="flex items-center gap-2 text-[#d6aa49]">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-xs font-black uppercase tracking-[.16em]">
                Portfolio Readiness
              </span>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-3xl font-black">Verified</p>
                <p className="mt-1 text-sm text-slate-300">
                  Đủ điều kiện handoff sang tư vấn đại học
                </p>
              </div>
              <span className="text-2xl font-black">82%</span>
            </div>
            <div className="mt-4">
              <Progress value={82} color="#d6aa49" />
            </div>
            <div className="mt-5 grid grid-cols-4 gap-2 text-center">
              {[
                ["12", "Tổng mục"],
                ["7", "Level A"],
                ["3", "Level B"],
                ["2", "Cần xử lý"],
              ].map((x) => (
                <div key={x[1]} className="rounded-xl bg-white/7 p-3">
                  <p className="text-lg font-black">{x[0]}</p>
                  <p className="text-[10px] text-slate-400">{x[1]}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="p-6">
            <h3 className="font-black text-[#10233f]">
              Chuẩn minh chứng A/B/C/D
            </h3>
            <div className="mt-4 space-y-3">
              {[
                [
                  "A",
                  "Xác thực chính thức",
                  "Cơ quan/GV/nhà trường xác nhận",
                  "green",
                ],
                [
                  "B",
                  "Minh chứng đáng tin",
                  "File gốc, hình ảnh, sản phẩm rõ",
                  "blue",
                ],
                [
                  "C",
                  "Minh chứng bổ trợ",
                  "Cần thêm xác nhận hoặc ngữ cảnh",
                  "amber",
                ],
                ["D", "Tự khai báo", "Chưa đủ điều kiện sử dụng", "red"],
              ].map((x) => (
                <div key={x[0]} className="flex items-center gap-3">
                  <Badge tone={x[3] as "green" | "blue" | "amber" | "red"}>
                    Level {x[0]}
                  </Badge>
                  <div>
                    <p className="text-xs font-bold">{x[1]}</p>
                    <p className="text-[10px] text-slate-400">{x[2]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
      <FilterBar
        search={search}
        setSearch={setSearch}
        placeholder="Tìm chứng chỉ, hoạt động, vai trò..."
        onClear={() => {
          setSearch("");
          setKind("");
          setStatus("");
        }}
      >
        <Select
          value={kind}
          onChange={setKind}
          label="Nhóm minh chứng"
          options={[...new Set(evidenceItems.map((x) => x.kind))]}
        />
        <Select
          value={status}
          onChange={setStatus}
          label="Trạng thái duyệt"
          options={["Đã xác thực", "Đã duyệt", "Cần bổ sung"]}
        />
        <div className="flex rounded-xl border border-slate-200 bg-white p-1">
          <button
            onClick={() => setGrid(true)}
            className={`rounded-lg p-2 ${grid ? "bg-[#10233f] text-white" : "text-slate-400"}`}
          >
            <Grid2X2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setGrid(false)}
            className={`rounded-lg p-2 ${!grid ? "bg-[#10233f] text-white" : "text-slate-400"}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </FilterBar>
      <div className="flex flex-wrap gap-2">
        {[
          "Tất cả",
          "Chứng chỉ",
          "Giải thưởng",
          "CLB & Leadership",
          "Hoạt động cộng đồng",
          "Sự kiện quốc tế",
        ].map((x) => (
          <button
            key={x}
            onClick={() => setKind(x === "Tất cả" ? "" : x)}
            className={`rounded-full px-4 py-2 text-xs font-bold transition ${(x === "Tất cả" && !kind) || x === kind ? "bg-[#941b2b] text-white" : "border border-slate-200 bg-white text-slate-600 hover:border-[#941b2b]"}`}
          >
            {x}
          </button>
        ))}
      </div>
      {grid ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((x, i) => (
            <Card key={x.title} className="group overflow-hidden">
              <div
                className={`h-1.5 ${x.level === "A" ? "bg-emerald-500" : x.level === "B" ? "bg-blue-500" : x.level === "C" ? "bg-amber-500" : "bg-red-500"}`}
              />
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div
                    className={`rounded-xl p-3 ${i % 3 === 0 ? "bg-red-50 text-[#941b2b]" : i % 3 === 1 ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"}`}
                  >
                    {i < 2 ? (
                      <FileCheck2 className="h-5 w-5" />
                    ) : i === 4 ? (
                      <Trophy className="h-5 w-5" />
                    ) : (
                      <Award className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      tone={
                        x.level === "A"
                          ? "green"
                          : x.level === "B"
                            ? "blue"
                            : "amber"
                      }
                    >
                      Level {x.level}
                    </Badge>
                    <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="mt-4 text-xs font-black uppercase tracking-wider text-slate-400">
                  {x.kind}
                </p>
                <h3 className="mt-1 text-base font-black text-[#10233f]">
                  {x.title}
                </h3>
                <p className="mt-2 min-h-10 text-sm leading-5 text-slate-500">
                  {x.detail}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <div>
                    <StatusBadge value={x.status} />
                    <p className="mt-1.5 text-[10px] text-slate-400">
                      Cập nhật {x.date}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelected(x)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition group-hover:border-[#941b2b] group-hover:bg-[#941b2b] group-hover:text-white"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500">
                <tr>
                  <th className="px-5 py-3">Minh chứng</th>
                  <th className="px-4 py-3">Nhóm</th>
                  <th className="px-4 py-3">Evidence Level</th>
                  <th className="px-4 py-3">Duyệt</th>
                  <th className="px-4 py-3">Cập nhật</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((x) => (
                  <tr key={x.title}>
                    <td className="px-5 py-4">
                      <p className="font-bold">{x.title}</p>
                      <p className="text-xs text-slate-400">{x.detail}</p>
                    </td>
                    <td className="px-4 py-4">{x.kind}</td>
                    <td className="px-4 py-4">
                      <Badge
                        tone={
                          x.level === "A"
                            ? "green"
                            : x.level === "B"
                              ? "blue"
                              : "amber"
                        }
                      >
                        Level {x.level}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge value={x.status} />
                    </td>
                    <td className="px-4 py-4">{x.date}</td>
                    <td className="px-5 py-4">
                      <button onClick={() => setSelected(x)}>
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
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <h3 className="font-black text-[#10233f]">
              Cần xử lý trước handoff
            </h3>
          </div>
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3 rounded-xl bg-amber-50 p-3">
              <SearchCheck className="h-5 w-5 text-amber-700" />
              <div className="flex-1">
                <p className="text-sm font-bold">MUN Singapore 2026</p>
                <p className="text-xs text-amber-700">
                  Thiếu email xác nhận vai trò Outstanding Delegate
                </p>
              </div>
              <StatusBadge value="Cần bổ sung" />
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-red-50 p-3">
              <FileUp className="h-5 w-5 text-red-700" />
              <div className="flex-1">
                <p className="text-sm font-bold">Hoạt động STEM for Kids</p>
                <p className="text-xs text-red-700">
                  File ảnh mờ, cần tải bản gốc
                </p>
              </div>
              <StatusBadge value="Cần chỉnh sửa" />
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-black text-[#10233f]">Phân bổ Portfolio</h3>
          <div className="mt-5 space-y-4">
            {[
              ["Hướng nghiệp", 90, 9],
              ["Dự án", 75, 6],
              ["Hoạt động ngoại khóa", 84, 8],
              ["Thành tích học tập", 95, 11],
            ].map((x) => (
              <div key={String(x[0])}>
                <div className="mb-1.5 flex justify-between text-xs">
                  <span className="font-bold text-slate-600">{x[0]}</span>
                  <span className="text-slate-400">
                    {x[2]} mục · {x[1]}%
                  </span>
                </div>
                <Progress value={Number(x[1])} small />
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Modal
        open={upload}
        onClose={() => setUpload(false)}
        title="Tải minh chứng mới"
      >
        <div className="space-y-4">
          <button className="flex w-full flex-col items-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center hover:border-[#941b2b] hover:bg-red-50/30">
            <UploadCloud className="h-9 w-9 text-[#941b2b]" />
            <p className="mt-3 text-sm font-black">
              Kéo thả file hoặc bấm để chọn
            </p>
            <p className="mt-1 text-xs text-slate-400">
              PDF, PNG, JPG · tối đa 20 MB/file
            </p>
          </button>
          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className="text-sm font-bold">Nhóm minh chứng</span>
              <select className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm">
                <option>Chứng chỉ</option>
                <option>Giải thưởng</option>
                <option>CLB & Leadership</option>
              </select>
            </label>
            <label>
              <span className="text-sm font-bold">Evidence Level dự kiến</span>
              <select className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm">
                <option>Chờ chuyên viên đánh giá</option>
                <option>Level B</option>
                <option>Level C</option>
              </select>
            </label>
          </div>
          <label className="block">
            <span className="text-sm font-bold">
              Tên thành tích / hoạt động
            </span>
            <input
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"
              placeholder="Nhập tên minh chứng"
            />
          </label>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setUpload(false)}>
              Hủy
            </Button>
            <Button
              onClick={() => {
                setUpload(false);
                showToast("Đã tải minh chứng và chuyển sang hàng chờ xác thực");
              }}
            >
              Tải lên & gửi duyệt
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.title || "Chi tiết minh chứng"}
      >
        <div className="space-y-5">
          <div className="flex items-center justify-center rounded-2xl bg-slate-100 py-12">
            <FileCheck2 className="h-16 w-16 text-slate-300" />
          </div>
          <div>
            <div className="flex gap-2">
              <Badge tone="blue">{selected?.kind}</Badge>
              <StatusBadge value={selected?.status || ""} />
              <Badge tone="green">Level {selected?.level}</Badge>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {selected?.detail}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-wider text-slate-400">
              Nhật ký xác thực
            </p>
            <p className="mt-2 text-sm font-bold">
              Nguyễn Hà Linh · {selected?.date}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Đã đối chiếu file gốc và xác nhận thông tin có thể sử dụng trong
              hồ sơ ứng tuyển.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary">
              <Download className="h-4 w-4" /> Tải file
            </Button>
            <Button
              onClick={() => {
                setSelected(null);
                showToast("Đã xác nhận minh chứng Level A");
              }}
            >
              <CheckCircle2 className="h-4 w-4" /> Xác thực
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
