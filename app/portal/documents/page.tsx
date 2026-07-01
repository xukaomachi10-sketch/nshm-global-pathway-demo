"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  FileCheck2,
  FileText,
  History,
  MessageSquare,
  PenLine,
  Plus,
  Send,
  UploadCloud,
} from "lucide-react";
import { documents } from "@/lib/data";
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

type Doc = (typeof documents)[number];
const versions = [
  {
    v: "v4",
    date: "30/06/2026 · 21:14",
    editor: "Nguyễn Minh Anh",
    note: "Sửa phần mở bài và làm rõ impact dự án",
    status: "Cần chỉnh sửa",
  },
  {
    v: "v3",
    date: "27/06/2026 · 18:42",
    editor: "Nguyễn Minh Anh",
    note: "Bổ sung reflection sau góp ý của chuyên viên",
    status: "Đã review",
  },
  {
    v: "v2",
    date: "22/06/2026 · 20:05",
    editor: "Nguyễn Minh Anh",
    note: "Cấu trúc lại đoạn 2-3, giảm nội dung mô tả",
    status: "Đã review",
  },
  {
    v: "v1",
    date: "18/06/2026 · 16:30",
    editor: "Nguyễn Minh Anh",
    note: "Bản nháp đầu tiên",
    status: "Đã review",
  },
];
export default function Documents() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [review, setReview] = useState("");
  const [selected, setSelected] = useState<Doc | null>(null);
  const [upload, setUpload] = useState(false);
  const { toast, showToast } = useToast();
  const rows = useMemo(
    () =>
      documents.filter(
        (x) =>
          (!search ||
            `${x.name} ${x.university}`
              .toLowerCase()
              .includes(search.toLowerCase())) &&
          (!category || x.category === category) &&
          (!review || x.review === review),
      ),
    [search, category, review],
  );
  return (
    <div className="space-y-6 animate-rise">
      {toast}
      <PageHeader
        eyebrow="Hồ sơ học sinh · Nguyễn Minh Anh"
        title="Documents, Essays & Checklist"
        description="Theo dõi mọi tài liệu, phiên bản bài luận, người phụ trách, trạng thái duyệt và checklist nộp hồ sơ theo từng trường."
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => showToast("Đã mở kho tài liệu dùng chung")}
            >
              <FileText className="h-4 w-4" /> Kho biểu mẫu
            </Button>
            <Button onClick={() => setUpload(true)}>
              <UploadCloud className="h-4 w-4" /> Tải tài liệu
            </Button>
          </>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          ["Tổng tài liệu", "24", "6 nhóm", FileText, "navy"],
          ["Essays", "7", "3 đang viết", PenLine, "red"],
          ["Chờ duyệt", "5", "2 mới hôm nay", Clock3, "gold"],
          ["Còn thiếu", "4", "1 mục sắp hạn", AlertTriangle, "red"],
          ["Checklist", "76%", "18/24 mục", CheckCircle2, "green"],
        ].map(([l, v, h, I, c], i) => (
          <Card key={String(l)} className="p-4">
            <div className="flex items-center gap-3">
              <div
                className={`rounded-xl p-2.5 text-white ${c === "red" ? "bg-[#941b2b]" : c === "gold" ? "bg-[#d6aa49]" : c === "green" ? "bg-emerald-600" : "bg-[#10233f]"}`}
              >
                <I className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  {String(l)}
                </p>
                <p className="text-xl font-black text-[#10233f]">{String(v)}</p>
              </div>
            </div>
            {i === 4 ? (
              <div className="mt-3">
                <Progress value={76} small />
              </div>
            ) : (
              <p className="mt-2 text-[10px] text-slate-400">{String(h)}</p>
            )}
          </Card>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <div className="min-w-0 space-y-4">
          <FilterBar
            search={search}
            setSearch={setSearch}
            placeholder="Tìm tài liệu, bài luận, trường áp dụng..."
            onClear={() => {
              setSearch("");
              setCategory("");
              setReview("");
            }}
          >
            <Select
              value={category}
              onChange={setCategory}
              label="Nhóm tài liệu"
              options={[...new Set(documents.map((x) => x.category))]}
            />
            <Select
              value={review}
              onChange={setReview}
              label="Trạng thái duyệt"
              options={[...new Set(documents.map((x) => x.review))]}
            />
          </FilterBar>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Tài liệu / Bài luận</th>
                    <th className="px-4 py-3">Trường áp dụng</th>
                    <th className="px-4 py-3">Phiên bản</th>
                    <th className="px-4 py-3">Phụ trách</th>
                    <th className="px-4 py-3">Tiến độ</th>
                    <th className="px-4 py-3">Duyệt</th>
                    <th className="px-4 py-3">Deadline</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.map((d, i) => (
                    <tr key={d.name} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`rounded-xl p-2.5 ${d.category === "Essays" ? "bg-red-50 text-[#941b2b]" : "bg-blue-50 text-blue-700"}`}
                          >
                            {d.category === "Essays" ? (
                              <PenLine className="h-4 w-4" />
                            ) : (
                              <FileText className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <button
                              onClick={() => setSelected(d)}
                              className="font-black text-[#10233f] hover:text-[#941b2b]"
                            >
                              {d.name}
                            </button>
                            <p className="text-xs text-slate-400">
                              {d.category} · Cập nhật {30 - i * 2}/06
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {d.university}
                      </td>
                      <td className="px-4 py-4">
                        <Badge tone="blue">{d.version}</Badge>
                      </td>
                      <td className="px-4 py-4 font-semibold text-slate-600">
                        {d.owner}
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge value={d.work} />
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge value={d.review} />
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-bold">{d.deadline}</p>
                        {i < 2 && (
                          <p className="text-xs text-red-600">Sắp đến hạn</p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-1">
                          <button
                            onClick={() => setSelected(d)}
                            title="Xem chi tiết"
                            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-[#941b2b]"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {d.category === "Essays" && (
                            <button
                              onClick={() => setSelected(d)}
                              title="Lịch sử phiên bản"
                              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-[#941b2b]"
                            >
                              <History className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
        <div className="min-w-0 space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-[#10233f]">
                  Checklist nộp hồ sơ
                </h3>
                <p className="text-xs text-slate-400">18/24 mục hoàn thành</p>
              </div>
              <span className="text-2xl font-black text-[#941b2b]">76%</span>
            </div>
            <div className="mt-4">
              <Progress value={76} />
            </div>
            <div className="mt-5 space-y-4">
              {[
                ["Academic Documents", 4, 4],
                ["Essays", 3, 6],
                ["Recommendation Letters", 1, 2],
                ["Financial Documents", 2, 4],
                ["Application Forms", 6, 6],
                ["Others", 2, 2],
              ].map(([x, a, b]) => (
                <div key={String(x)}>
                  <div className="mb-1.5 flex justify-between text-xs">
                    <span className="font-bold text-slate-600">{x}</span>
                    <span
                      className={
                        a === b ? "text-emerald-600" : "text-slate-400"
                      }
                    >
                      {a}/{b}
                    </span>
                  </div>
                  <Progress
                    value={(Number(a) / Number(b)) * 100}
                    small
                    color={a === b ? "#10b981" : "#941b2b"}
                  />
                </div>
              ))}
            </div>
            <Button
              variant="secondary"
              className="mt-5 w-full"
              onClick={() => showToast("Đã mở checklist chi tiết theo trường")}
            >
              Mở checklist chi tiết
            </Button>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <h3 className="font-black text-[#10233f]">Cảnh báo tài liệu</h3>
            </div>
            <div className="mt-4 space-y-3">
              {[
                ["Personal Essay", "Cần sửa theo 3 góp ý", "red"],
                ["CSS Profile", "Chưa bắt đầu · hạn 01/10", "amber"],
                ["LOR GVCN", "Chờ bản nháp đầu tiên", "blue"],
              ].map((x) => (
                <button
                  key={x[0]}
                  onClick={() => showToast(`Đã mở hạng mục ${x[0]}`)}
                  className="flex w-full items-center gap-3 rounded-xl bg-slate-50 p-3 text-left hover:bg-slate-100"
                >
                  <span
                    className={`h-2 w-2 rounded-full ${x[2] === "red" ? "bg-red-500" : x[2] === "amber" ? "bg-amber-500" : "bg-blue-500"}`}
                  />
                  <div>
                    <p className="text-sm font-bold">{x[0]}</p>
                    <p className="text-xs text-slate-400">{x[1]}</p>
                  </div>
                </button>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-[#10233f]">Phản hồi gần nhất</h3>
              <MessageSquare className="h-4 w-4 text-slate-400" />
            </div>
            <div className="mt-4 rounded-xl border-l-4 border-[#941b2b] bg-red-50/60 p-4">
              <p className="text-sm leading-6 text-slate-700">
                “Phần mở bài đã có hình ảnh tốt. Em cần làm rõ khoảnh khắc thay
                đổi nhận thức và giảm khoảng 60 từ ở đoạn 3.”
              </p>
              <p className="mt-2 text-xs font-bold text-[#941b2b]">
                Nguyễn Hà Linh · 30/06
              </p>
            </div>
          </Card>
        </div>
      </div>
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name || "Chi tiết tài liệu"}
        width="max-w-3xl"
      >
        <div className="grid gap-6 md:grid-cols-[1fr_1.1fr]">
          <div>
            <div className="flex aspect-[4/5] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
              <div className="text-center">
                <FileText className="mx-auto h-16 w-16 text-slate-300" />
                <p className="mt-3 text-xs font-bold text-slate-400">
                  PREVIEW · {selected?.version}
                </p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button variant="secondary" className="flex-1">
                <Download className="h-4 w-4" /> Tải xuống
              </Button>
              <Button
                className="flex-1"
                onClick={() => showToast("Đã mở trình xem tài liệu")}
              >
                Mở tài liệu
              </Button>
            </div>
          </div>
          <div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge value={selected?.work || ""} />
              <StatusBadge value={selected?.review || ""} />
              <Badge tone="blue">{selected?.version}</Badge>
            </div>
            <h3 className="mt-5 text-sm font-black text-[#10233f]">
              Lịch sử phiên bản
            </h3>
            <div className="mt-3 space-y-1">
              {versions.map((v, i) => (
                <div
                  key={v.v}
                  className={`relative flex gap-3 rounded-xl p-3 ${i === 0 ? "bg-red-50" : "hover:bg-slate-50"}`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-black ${i === 0 ? "bg-[#941b2b] text-white" : "bg-slate-100 text-slate-500"}`}
                  >
                    {v.v}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold">{v.editor}</p>
                      {i === 0 && <Badge tone="red">Mới nhất</Badge>}
                    </div>
                    <p className="mt-0.5 text-[10px] text-slate-400">
                      {v.date}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {v.note}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() =>
                  showToast("Đã thêm nhận xét vào phiên bản hiện tại")
                }
              >
                <MessageSquare className="h-4 w-4" /> Nhận xét
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  setSelected(null);
                  showToast("Đã gửi yêu cầu chỉnh sửa cho học sinh");
                }}
              >
                <Send className="h-4 w-4" /> Yêu cầu sửa
              </Button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        open={upload}
        onClose={() => setUpload(false)}
        title="Tải tài liệu mới"
      >
        <div className="space-y-4">
          <button className="flex w-full flex-col items-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 py-10 hover:border-[#941b2b]">
            <UploadCloud className="h-9 w-9 text-[#941b2b]" />
            <p className="mt-3 text-sm font-black">Chọn file từ máy tính</p>
            <p className="mt-1 text-xs text-slate-400">
              DOCX, PDF, JPG · tối đa 25 MB
            </p>
          </button>
          <label className="block">
            <span className="text-sm font-bold">Loại tài liệu</span>
            <select className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm">
              <option>Personal Essay</option>
              <option>Supplemental Essay</option>
              <option>Transcript</option>
              <option>Recommendation Letter</option>
            </select>
          </label>
          <label className="flex items-start gap-3 rounded-xl bg-blue-50 p-3">
            <input type="checkbox" defaultChecked className="mt-1" />
            <span className="text-xs leading-5 text-blue-800">
              Tạo phiên bản mới nếu tài liệu cùng loại đã tồn tại; giữ nguyên
              lịch sử trước đó.
            </span>
          </label>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setUpload(false)}>
              Hủy
            </Button>
            <Button
              onClick={() => {
                setUpload(false);
                showToast("Đã tải file và tạo phiên bản mới");
              }}
            >
              <Plus className="h-4 w-4" /> Tạo phiên bản
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
