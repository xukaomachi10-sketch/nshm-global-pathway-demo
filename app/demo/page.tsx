import Link from "next/link";
import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarClock,
  Database,
  FileStack,
  FileUp,
  FolderLock,
  Globe2,
  LayoutDashboard,
  ListChecks,
  Newspaper,
  Settings2,
  SquareCheckBig,
  UserRound,
} from "lucide-react";
import { getPilotOverview } from "@/lib/data-access";
import { PublicLayout } from "@/components/PublicSite";
import {
  PatternBackground,
  SectionHeading,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/brand";
import { Badge, Card, StatusChip } from "@/components/ui";

export const metadata: Metadata = {
  title: "Demo sản phẩm",
  description: "Danh mục màn hình demo của NSHM Global Pathways.",
};

export const dynamic = "force-dynamic";

const screens: Array<{
  href: string;
  title: string;
  description: string;
  category: "Công khai" | "Portal" | "Quản trị";
  icon: LucideIcon;
}> = [
  {
    href: "/",
    title: "Website công khai",
    description: "Tin tức, học bổng, tuyển sinh, câu chuyện và chuyến đi.",
    category: "Công khai",
    icon: Globe2,
  },
  {
    href: "/dang-ky-tu-van",
    title: "Đăng ký tư vấn",
    description: "Biểu mẫu ba bước dành cho học sinh và phụ huynh.",
    category: "Công khai",
    icon: ListChecks,
  },
  {
    href: "/portal",
    title: "Counselor Workbench",
    description: "Tổng quan danh mục hồ sơ, công việc và cảnh báo.",
    category: "Portal",
    icon: LayoutDashboard,
  },
  {
    href: "/portal/registrations",
    title: "Hàng chờ tư vấn",
    description: "Tiếp nhận đăng ký và cảnh báo trùng Student ID.",
    category: "Portal",
    icon: ListChecks,
  },
  {
    href: "/portal/students",
    title: "Danh sách học sinh tư vấn",
    description: "Danh sách hồ sơ tư vấn từ data layer an toàn.",
    category: "Portal",
    icon: UserRound,
  },
  {
    href: "/portal/import-students",
    title: "Import học sinh CSV",
    description: "Xem trước, kiểm tra và upsert fake student master.",
    category: "Portal",
    icon: FileUp,
  },
  {
    href: "/portal/tasks",
    title: "Công việc nội bộ",
    description: "Tạo, cập nhật công việc và ghi activity log.",
    category: "Portal",
    icon: SquareCheckBig,
  },
  {
    href: "/portal/sessions",
    title: "Lịch tư vấn",
    description: "Lập lịch, cập nhật kết quả và bước tiếp theo.",
    category: "Portal",
    icon: CalendarClock,
  },
  {
    href: "/portal/students/NSHM260101",
    title: "Student 360",
    description: "Hồ sơ toàn cảnh của một học sinh mô phỏng.",
    category: "Portal",
    icon: UserRound,
  },
  {
    href: "/portal/evidence",
    title: "Evidence Vault",
    description: "Minh chứng thành tích, CLB và hoạt động ngoại khóa.",
    category: "Portal",
    icon: FolderLock,
  },
  {
    href: "/portal/applications",
    title: "Application Pipeline",
    description: "Theo dõi danh sách trường, giai đoạn và deadline.",
    category: "Portal",
    icon: BriefcaseBusiness,
  },
  {
    href: "/portal/documents",
    title: "Documents & Essays",
    description: "Checklist hồ sơ và lịch sử phiên bản bài luận.",
    category: "Portal",
    icon: FileStack,
  },
  {
    href: "/cms",
    title: "CMS / Admin",
    description: "Soạn, xem trước và lên lịch nội dung website.",
    category: "Quản trị",
    icon: Settings2,
  },
];

const tone = {
  "Công khai": "red",
  Portal: "blue",
  "Quản trị": "gold",
} as const;

export default async function DemoPage() {
  const pilot = await getPilotOverview();
  const tableCounts = [
    ["users", pilot.users.length],
    ["students", pilot.students.length],
    ["counseling_cases", pilot.cases.length],
    ["counseling_sessions", pilot.sessions.length],
    ["internal_tasks", pilot.tasks.length],
    ["test_scores", pilot.scores.length],
    ["consents", pilot.consents.length],
    ["activity_logs", pilot.logs.length],
  ] as const;

  return (
    <PublicLayout>
      <main>
        <PatternBackground tone="blue" className="py-16 sm:py-20">
          <div className="relative mx-auto max-w-[1180px] px-5 lg:px-8">
            <Badge tone="gold">Clickable MVP · NSHM</Badge>
            <h1 className="font-display mt-5 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
              Một lối vào cho toàn bộ trải nghiệm demo
            </h1>
            <p className="mt-5 max-w-2xl leading-7 text-white/75">
              Khám phá website công khai, không gian chuyên viên và CMS trong
              cùng một hệ thống nhận diện NSHM nhất quán.
            </p>
            <div className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#FFEBD6] px-4 py-3 text-sm font-bold text-[#23328C]">
              <Newspaper className="h-4 w-4 text-[#D21235]" /> Chỉ sử dụng dữ
              liệu mô phỏng — không có dữ liệu học sinh thật.
            </div>
          </div>
        </PatternBackground>

        <section className="border-b border-slate-200 bg-white py-10">
          <div className="mx-auto max-w-[1180px] px-5 lg:px-8">
            <Card className="overflow-hidden">
              <div className="grid gap-0 lg:grid-cols-[.8fr_1.2fr]">
                <div className="bg-[#23328C] p-6 text-white sm:p-8">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-white/10 p-3 text-[#FFAD00]">
                      <Database className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[.16em] text-white/60">
                        Safe database pilot
                      </p>
                      <h2 className="mt-1 text-xl font-black">
                        Data access status
                      </h2>
                    </div>
                  </div>
                  <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="text-white/55">Requested</dt>
                      <dd className="mt-1 font-black">
                        {pilot.status.requestedMode}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-white/55">Effective</dt>
                      <dd className="mt-1 font-black">
                        {pilot.status.effectiveMode}
                      </dd>
                    </div>
                  </dl>
                  {pilot.status.fallbackReason && (
                    <p className="mt-5 rounded-xl bg-white/10 p-3 text-xs leading-5 text-white/75">
                      {pilot.status.fallbackReason}
                    </p>
                  )}
                  <p className="mt-4 text-xs leading-5 text-white/55">
                    Pilot scope: {pilot.pilotScope.replaceAll("_", " ")}
                  </p>
                </div>
                <div className="p-6 sm:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[.15em] text-[#D21235]">
                        Repository snapshot
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Counts are loaded through the shared data access layer.
                      </p>
                    </div>
                    <Badge
                      tone={
                        pilot.status.effectiveMode === "supabase"
                          ? "green"
                          : "blue"
                      }
                    >
                      {pilot.status.effectiveMode}
                    </Badge>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {tableCounts.map(([table, count]) => (
                      <div
                        key={table}
                        className="rounded-xl border border-slate-200 bg-[#FBFAF7] p-4"
                      >
                        <p className="text-2xl font-black text-[#23328C]">
                          {count}
                        </p>
                        <p className="mt-1 break-words text-[10px] font-bold text-slate-500">
                          {table}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section className="bg-[#FBFAF7] py-16">
          <div className="mx-auto max-w-[1180px] px-5 lg:px-8">
            <SectionHeading
              eyebrow="13 màn hình chính"
              title="Chọn trải nghiệm bạn muốn xem"
              description="Mỗi thẻ mở đúng route hiện có; logic và luồng nghiệp vụ được giữ nguyên."
            />
            <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {screens.map(({ href, title, description, category, icon: Icon }) => (
                <Link key={href} href={href} className="brand-focus group rounded-2xl">
                  <Card className="h-full p-6 transition duration-200 group-hover:-translate-y-1 group-hover:border-[#D21235]/30 group-hover:shadow-xl">
                    <div className="flex items-start justify-between gap-4">
                      <div className="rounded-xl bg-[#FFEBD6] p-3 text-[#D21235] transition group-hover:bg-[#D21235] group-hover:text-white">
                        <Icon className="h-6 w-6" />
                      </div>
                      <Badge tone={tone[category]}>{category}</Badge>
                    </div>
                    <h2 className="mt-6 text-lg font-black text-[#23328C]">
                      {title}
                    </h2>
                    <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                      {description}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#D21235]">
                      Mở màn hình <ArrowRight className="h-4 w-4" />
                    </span>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="mx-auto max-w-[1180px] px-5 lg:px-8">
            <SectionHeading
              eyebrow="Design system"
              title="Ngôn ngữ thương hiệu trong sản phẩm"
              description="Token màu, kiểu chữ và trạng thái được thiết kế để vừa mang bản sắc NSHM, vừa rõ ràng khi xử lý dữ liệu."
            />
            <div className="mt-9 grid gap-7 lg:grid-cols-[.85fr_1.15fr]">
              <Card className="p-6">
                <h3 className="text-sm font-black text-[#23328C]">Bảng màu cốt lõi</h3>
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
                  {[
                    ["Crimson", "#D21235", "bg-[#D21235]", "text-white"],
                    ["Antique", "#FFEBD6", "bg-[#FFEBD6]", "text-[#23328C]"],
                    ["Egyptian Blue", "#23328C", "bg-[#23328C]", "text-white"],
                    ["Orange", "#FFAD00", "bg-[#FFAD00]", "text-[#23328C]"],
                  ].map(([name, hex, background, foreground]) => (
                    <div key={name} className={`rounded-xl p-4 ${background} ${foreground}`}>
                      <p className="text-xs font-black">{name}</p>
                      <p className="mt-1 text-[11px] opacity-75">{hex}</p>
                    </div>
                  ))}
                </div>
              </Card>
              <div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Thành phần</TableHead>
                      <TableHead>Vai trò</TableHead>
                      <TableHead>Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Lexend</TableCell>
                      <TableCell>Dashboard, bảng, form, điều hướng</TableCell>
                      <TableCell><StatusChip value="Đã duyệt" /></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Literata</TableCell>
                      <TableCell>Hero, câu chuyện, nội dung biên tập</TableCell>
                      <TableCell><StatusChip value="Reviewed" /></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Brand tokens</TableCell>
                      <TableCell>CSS variables và Tailwind utilities</TableCell>
                      <TableCell><StatusChip value="Hoàn thành" /></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
