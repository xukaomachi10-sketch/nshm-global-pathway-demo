"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Bold,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Eye,
  Heading2,
  ImagePlus,
  Italic,
  Link2,
  List,
  MoreHorizontal,
  Save,
  Search,
  Send,
  Settings2,
  Sparkles,
  Undo2,
} from "lucide-react";
import { posts } from "@/lib/data-access/demo-data";
import {
  Badge,
  Button,
  Card,
  Modal,
  StatusBadge,
  useToast,
} from "@/components/ui";
import { useState } from "react";
import { Navbar } from "@/components/brand";

export default function CMS() {
  const [title, setTitle] = useState("Học bổng Future Leaders 2027 tại Canada");
  const [category, setCategory] = useState("Học bổng");
  const [preview, setPreview] = useState(false);
  const [panel, setPanel] = useState(true);
  const { toast, showToast } = useToast();
  return (
    <div className="min-h-screen bg-[#eef0f3]">
      {toast}
      <Navbar className="sticky top-0 z-30 flex h-16 items-center gap-3 px-4 lg:px-6">
        <Link
          href="/portal"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <Image src="/nshm-mark.svg" alt="NSHM" width={34} height={34} />
        <div>
          <p className="text-sm font-black text-[#23328C]">
            NSHM Content Studio
          </p>
          <p className="text-[10px] text-slate-400">Website công khai · CMS</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden items-center gap-1 text-xs text-slate-400 sm:flex">
            <Check className="h-3.5 w-3.5 text-[#2DA037]" /> Đã lưu 10:26
          </span>
          <Button variant="secondary" onClick={() => setPreview(true)}>
            <Eye className="h-4 w-4" />{" "}
            <span className="hidden sm:inline">Xem trước</span>
          </Button>
          <Button
            onClick={() =>
              showToast("Bài viết đã được lên lịch xuất bản 08:00 ngày 05/07")
            }
          >
            <Send className="h-4 w-4" />{" "}
            <span className="hidden sm:inline">Xuất bản</span>
          </Button>
          <button
            onClick={() => setPanel(!panel)}
            className="rounded-xl border border-slate-200 p-2.5 text-slate-500"
          >
            <Settings2 className="h-4 w-4" />
          </button>
        </div>
      </Navbar>
      <main className="mx-auto grid max-w-[1600px] gap-5 p-4 lg:grid-cols-[260px_1fr_310px] lg:p-5">
        <aside className="hidden lg:block">
          <Card className="sticky top-21 overflow-hidden">
            <div className="border-b border-slate-100 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black text-[#23328C]">Nội dung</h2>
                <button className="rounded-lg bg-[#D21235] px-3 py-1.5 text-xs font-black text-white">
                  + Bài mới
                </button>
              </div>
              <label className="relative mt-3 block">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  className="h-9 w-full rounded-lg bg-slate-100 pl-9 pr-3 text-xs"
                  placeholder="Tìm bài viết..."
                />
              </label>
            </div>
            <div className="max-h-[calc(100vh-180px)] overflow-y-auto">
              {posts.slice(0, 9).map((p, i) => (
                <button
                  key={p.slug}
                  onClick={() => {
                    setTitle(p.title);
                    setCategory(p.category);
                  }}
                  className={`w-full border-b border-slate-100 p-4 text-left hover:bg-slate-50 ${i === 1 ? "bg-[#FAC7D0]/45" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <Badge tone={p.published ? "green" : "amber"}>
                      {p.published ? "Đã xuất bản" : "Bản nháp"}
                    </Badge>
                    <MoreHorizontal className="h-4 w-4 text-slate-300" />
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs font-black leading-5 text-[#23328C]">
                    {p.title}
                  </p>
                  <p className="mt-1 text-[10px] text-slate-400">
                    {p.category} · {p.date}
                  </p>
                </button>
              ))}
            </div>
          </Card>
        </aside>
        <section className="min-w-0">
          <Card className="overflow-hidden">
            <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 px-4 py-2">
              <Tool icon={<Undo2 />} />
              <span className="mx-1 h-6 border-l border-slate-200" />
              <Tool icon={<Heading2 />} text="Heading 2" />
              <Tool icon={<Bold />} />
              <Tool icon={<Italic />} />
              <Tool icon={<Link2 />} />
              <Tool icon={<List />} />
              <Tool icon={<ImagePlus />} />
              <span className="ml-auto text-[10px] font-bold text-slate-400">
                1.248 từ · 6 phút đọc
              </span>
            </div>
            <div className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
              <div className="flex items-center gap-2">
                <Badge tone="amber">{category}</Badge>
                <span className="text-xs text-slate-400">Bản nháp</span>
              </div>
              <textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                rows={2}
                className="font-display mt-4 w-full resize-none border-0 p-0 text-4xl font-bold leading-tight text-[#23328C] outline-none"
              />
              <textarea
                defaultValue="Cơ hội học bổng đến 50% dành cho học sinh có thành tích học thuật và hoạt động cộng đồng nổi bật."
                rows={2}
                className="mt-4 w-full resize-none border-0 p-0 text-lg leading-8 text-slate-500 outline-none"
              />
              <div className="relative mt-7 flex h-72 items-center justify-center overflow-hidden rounded-2xl bg-[#23328C]">
                <Image
                  src="/campus-hero.svg"
                  alt="Ảnh bài viết"
                  fill
                  className="object-cover opacity-55"
                />
                <button className="relative rounded-xl bg-white/90 px-4 py-2 text-xs font-black text-[#23328C] shadow">
                  <ImagePlus className="mr-2 inline h-4 w-4" /> Thay ảnh đại
                  diện
                </button>
              </div>
              <EditorBlock
                heading="Tổng quan học bổng"
                text="Chương trình Future Leaders ghi nhận những học sinh không chỉ có nền tảng học thuật vững vàng mà còn thể hiện năng lực lãnh đạo và đóng góp tích cực cho cộng đồng. Hồ sơ được xem xét toàn diện dựa trên kết quả học tập, hoạt động và bài luận."
              />
              <div className="my-6 rounded-2xl border-l-4 border-[#FFAD00] bg-[#FFEBD6] p-5">
                <p className="font-display text-xl font-bold leading-8 text-[#23328C]">
                  Hãy bắt đầu sớm để có đủ thời gian xây câu chuyện hồ sơ nhất
                  quán và chân thực.
                </p>
              </div>
              <EditorBlock
                heading="Điều kiện ứng tuyển"
                text="Ứng viên cần có GPA từ 8.5, chứng chỉ tiếng Anh phù hợp yêu cầu chương trình và ít nhất một minh chứng rõ ràng về leadership hoặc hoạt động cộng đồng. Mỗi thành tích trọng yếu nên đi kèm tài liệu xác thực."
              />
              <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-5 text-center text-xs font-bold text-slate-400 hover:border-[#D21235]">
                + Thêm khối nội dung
              </div>
            </div>
          </Card>
        </section>
        {panel && (
          <aside>
            <div className="sticky top-21 space-y-4">
              <Card className="p-5">
                <h3 className="text-sm font-black text-[#23328C]">
                  Thiết lập xuất bản
                </h3>
                <div className="mt-4 space-y-4">
                  <label className="block">
                    <span className="text-xs font-bold text-slate-500">
                      Trạng thái
                    </span>
                    <button className="mt-2 flex h-10 w-full items-center justify-between rounded-xl border border-slate-200 px-3 text-sm font-bold">
                      Bản nháp <ChevronDown className="h-4 w-4" />
                    </button>
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold text-slate-500">
                      Chuyên mục
                    </span>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="mt-2 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm"
                    >
                      <option>Tin tức</option>
                      <option>Học bổng</option>
                      <option>Tuyển sinh</option>
                      <option>Câu chuyện</option>
                      <option>Chuyến đi</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold text-slate-500">
                      Ngày xuất bản
                    </span>
                    <div className="relative mt-2">
                      <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="date"
                        defaultValue="2026-07-05"
                        className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm"
                      />
                    </div>
                  </label>
                  <label className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                    <span className="text-xs font-bold">
                      Hiển thị CTA tư vấn
                    </span>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 accent-[#D21235]"
                    />
                  </label>
                </div>
                <Button
                  variant="secondary"
                  className="mt-4 w-full"
                  onClick={() => showToast("Đã lưu bản nháp")}
                >
                  <Save className="h-4 w-4" /> Lưu bản nháp
                </Button>
              </Card>
              <Card className="p-5">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#D21235]" />
                  <h3 className="text-sm font-black text-[#23328C]">
                    Kiểm tra trước xuất bản
                  </h3>
                </div>
                <div className="mt-4 space-y-3 text-xs">
                  {[
                    ["Tiêu đề & mô tả", "Đạt"],
                    ["Ảnh đại diện", "Đạt"],
                    ["Nguồn tham chiếu", "Cần bổ sung"],
                    ["CTA đăng ký tư vấn", "Đã bật"],
                  ].map((x) => (
                    <div key={x[0]} className="flex justify-between">
                      <span className="text-slate-500">{x[0]}</span>
                      <span
                        className={`font-bold ${x[1] === "Cần bổ sung" ? "text-[#23328C]" : "text-[#2DA037]"}`}
                      >
                        {x[1]}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="p-5">
                <h3 className="text-sm font-black text-[#23328C]">
                  SEO & chia sẻ
                </h3>
                <p className="mt-2 text-xs leading-5 text-slate-400">
                  URL thân thiện, ảnh Open Graph và mô tả tìm kiếm đã sẵn sàng.
                </p>
                <button className="mt-3 text-xs font-black text-[#D21235]">
                  Chỉnh sửa SEO
                </button>
              </Card>
            </div>
          </aside>
        )}
      </main>
      <Modal
        open={preview}
        onClose={() => setPreview(false)}
        title="Xem trước bài viết"
        width="max-w-4xl"
      >
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <div className="bg-[#23328C] px-8 py-10 text-white">
            <Badge tone="gold">{category}</Badge>
            <h1 className="font-display mt-4 text-4xl font-bold leading-tight">
              {title}
            </h1>
            <p className="mt-4 text-slate-300">
              Cơ hội học bổng đến 50% dành cho học sinh có thành tích học thuật
              và hoạt động cộng đồng nổi bật.
            </p>
          </div>
          <div className="p-8">
            <p className="text-lg leading-8 text-slate-600">
              Chương trình Future Leaders ghi nhận những học sinh không chỉ có
              nền tảng học thuật vững vàng mà còn thể hiện năng lực lãnh đạo và
              đóng góp tích cực cho cộng đồng.
            </p>
            <button className="mt-8 rounded-xl bg-[#FFAD00] px-5 py-3 text-sm font-black text-[#23328C]">
              Đăng ký tư vấn du học
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
function Tool({ icon, text }: { icon: React.ReactElement; text?: string }) {
  return (
    <button className="flex items-center gap-1 rounded-lg px-2.5 py-2 text-xs font-bold text-slate-500 hover:bg-white hover:text-[#23328C] [&_svg]:h-4 [&_svg]:w-4">
      {icon}
      {text}
    </button>
  );
}
function EditorBlock({ heading, text }: { heading: string; text: string }) {
  return (
    <div className="mt-8">
      <input
        defaultValue={heading}
        className="font-display w-full border-0 p-0 text-2xl font-bold text-[#23328C] outline-none"
      />
      <textarea
        defaultValue={text}
        rows={4}
        className="mt-3 w-full resize-none border-0 p-0 text-base leading-8 text-slate-600 outline-none"
      />
    </div>
  );
}
