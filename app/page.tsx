import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Compass,
  Globe2,
  GraduationCap,
  Quote,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { posts } from "@/lib/data";
import { PublicLayout } from "@/components/PublicSite";

export default function PublicHome() {
  const published = posts.filter((p) => p.published);
  const hero = published[0];
  return (
    <PublicLayout>
      <main>
        <section className="relative min-h-[650px] overflow-hidden bg-[#10233f] text-white">
          <Image
            src="/campus-hero.svg"
            alt="Khuôn viên Trường Ngôi Sao Hoàng Mai"
            fill
            priority
            className="object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b1b31] via-[#10233f]/80 to-transparent" />
          <div className="relative mx-auto flex min-h-[650px] max-w-[1380px] items-center px-5 py-20 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d6aa49]/50 bg-[#d6aa49]/10 px-4 py-2 text-xs font-black uppercase tracking-[.14em] text-[#f1cc76]">
                <Sparkles className="h-4 w-4" /> Từ Ngôi Sao Hoàng Mai đến thế
                giới
              </div>
              <h1 className="font-display mt-6 text-5xl font-bold leading-[1.08] sm:text-6xl lg:text-7xl">
                Hiểu mình sâu hơn.
                <br />
                <span className="text-[#e6bd62]">Đi xa vững vàng.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
                Phòng Hợp tác Quốc tế đồng hành cùng mỗi học sinh từ khám phá
                bản thân, xây dựng portfolio đến chinh phục đại học phù hợp trên
                toàn cầu.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/dang-ky-tu-van"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#d6aa49] px-6 py-3.5 text-sm font-black text-[#10233f] shadow-xl hover:bg-[#e6bd62]"
                >
                  Đăng ký tư vấn du học <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="#gioi-thieu"
                  className="rounded-xl border border-white/30 bg-white/5 px-6 py-3.5 text-sm font-black backdrop-blur hover:bg-white/10"
                >
                  Khám phá lộ trình
                </Link>
              </div>
              <div className="mt-10 flex flex-wrap gap-7 text-sm">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#d6aa49]" /> Tư vấn 1:1
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#d6aa49]" /> Lộ trình
                  cá nhân hóa
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#d6aa49]" /> Hồ sơ chân
                  thực
                </span>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-[#0b1b31]/85 backdrop-blur">
            <div className="mx-auto grid max-w-[1380px] grid-cols-2 divide-x divide-white/10 px-5 md:grid-cols-4 lg:px-8">
              {[
                ["120+", "Hồ sơ được đồng hành"],
                ["18", "Quốc gia & vùng lãnh thổ"],
                ["93%", "Có phương án phù hợp"],
                ["45+", "Đại học kết nối"],
              ].map((x) => (
                <div key={x[1]} className="px-4 py-5 text-center">
                  <p className="text-2xl font-black text-[#e6bd62]">{x[0]}</p>
                  <p className="mt-1 text-xs text-slate-400">{x[1]}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="gioi-thieu" className="bg-[#f7f5f0] py-20">
          <div className="mx-auto max-w-[1380px] px-5 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-black uppercase tracking-[.2em] text-[#941b2b]">
                Một hành trình có phương pháp
              </p>
              <h2 className="font-display mt-3 text-4xl font-bold text-[#10233f]">
                Từ tiềm năng đến hồ sơ có tiếng nói riêng
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                Không bắt đầu bằng bảng xếp hạng. Chúng tôi bắt đầu từ câu hỏi:
                em là ai, điều gì khiến em tò mò và em muốn tạo ra giá trị nào?
              </p>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {([
                [
                  Compass,
                  "01",
                  "Khám phá bản thân",
                  "Holland, năng lực, giá trị và định hướng nghề nghiệp.",
                ],
                [
                  BookOpen,
                  "02",
                  "Xây Portfolio",
                  "Học thuật, dự án, hoạt động và minh chứng được xác thực.",
                ],
                [
                  GraduationCap,
                  "03",
                  "Chọn trường chiến lược",
                  "Reach - Target - Safety dựa trên dữ liệu và mức độ phù hợp.",
                ],
                [
                  Globe2,
                  "04",
                  "Hoàn thiện & ứng tuyển",
                  "Essay, LOR, checklist và deadline được quản trị chặt chẽ.",
                ],
              ] as const).map(([I, n, t, d]) => (
                <div
                  key={String(n)}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="rounded-xl bg-red-50 p-3 text-[#941b2b]">
                      <I className="h-6 w-6" />
                    </div>
                    <span className="font-display text-3xl font-bold text-slate-200 group-hover:text-[#d6aa49]">
                      {n}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-black text-[#10233f]">
                    {t}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="tin-tuc" className="py-20">
          <div className="mx-auto max-w-[1380px] px-5 lg:px-8">
            <SectionTitle
              eyebrow="Đang diễn ra tại NSHM"
              title="Tin mới & sự kiện nổi bật"
              href={hero.slug}
            />
            <div className="mt-10 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
              <Link
                href={`/bai-viet/${hero.slug}`}
                className="group relative min-h-[430px] overflow-hidden rounded-3xl bg-[#10233f] text-white"
              >
                <Image
                  src="/campus-hero.svg"
                  alt="Tin nổi bật"
                  fill
                  className="object-cover opacity-60 transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1b31] via-[#10233f]/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7 lg:p-9">
                  <span className="rounded-full bg-[#d6aa49] px-3 py-1 text-xs font-black text-[#10233f]">
                    {hero.category}
                  </span>
                  <h3 className="font-display mt-4 max-w-2xl text-3xl font-bold leading-tight">
                    {hero.title}
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200">
                    {hero.excerpt}
                  </p>
                  <p className="mt-4 text-xs font-bold text-[#e6bd62]">
                    {hero.date} · {hero.readTime}
                  </p>
                </div>
              </Link>
              <div className="grid gap-4">
                {published.slice(5, 8).map((p, i) => (
                  <PostRow key={p.slug} post={p} index={i} />
                ))}
              </div>
            </div>
          </div>
        </section>
        <section id="hoc-bong" className="bg-[#10233f] py-20 text-white">
          <div className="mx-auto max-w-[1380px] px-5 lg:px-8">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[.2em] text-[#d6aa49]">
                  Cơ hội tài chính
                </p>
                <h2 className="font-display mt-3 text-4xl font-bold">
                  Học bổng đang mở
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                  Thông tin được chọn lọc, kiểm tra nguồn và cập nhật ngày gần
                  nhất.
                </p>
              </div>
              <Link
                href="/dang-ky-tu-van"
                className="inline-flex items-center gap-2 text-sm font-black text-[#d6aa49]"
              >
                Tìm học bổng phù hợp <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {published
                .filter((p) => p.category === "Học bổng")
                .slice(0, 3)
                .map((p, i) => (
                  <Link
                    key={p.slug}
                    href={`/bai-viet/${p.slug}`}
                    className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-[#d6aa49]/50 hover:bg-white/10"
                  >
                    <div className="flex items-center justify-between">
                      <div className="rounded-xl bg-[#d6aa49] p-3 text-[#10233f]">
                        <Award className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-400">
                        {p.date}
                      </span>
                    </div>
                    <h3 className="font-display mt-5 text-xl font-bold leading-7">
                      {p.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {p.excerpt}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1 text-xs font-black text-[#d6aa49]">
                      Xem điều kiện <ChevronRight className="h-3 w-3" />
                    </span>
                  </Link>
                ))}
            </div>
          </div>
        </section>
        <section id="tuyen-sinh" className="py-20">
          <div className="mx-auto max-w-[1380px] px-5 lg:px-8">
            <SectionTitle
              eyebrow="Cập nhật chính xác"
              title="Thông tin tuyển sinh đại học"
              href={published.find((p) => p.category === "Tuyển sinh")!.slug}
            />
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {published
                .filter((p) => p.category === "Tuyển sinh")
                .map((p, i) => (
                  <ArticleCard key={p.slug} p={p} index={i} />
                ))}
            </div>
          </div>
        </section>
        <section id="cau-chuyen" className="overflow-hidden bg-[#f7f5f0] py-20">
          <div className="mx-auto grid max-w-[1380px] gap-10 px-5 lg:grid-cols-2 lg:items-center lg:px-8">
            <div className="relative min-h-[480px] overflow-hidden rounded-3xl bg-[#941b2b]">
              <Image
                src="/campus-hero.svg"
                alt="Câu chuyện học sinh"
                fill
                className="object-cover opacity-35"
              />
              <div className="absolute inset-0 flex items-end p-8">
                <div className="max-w-md rounded-2xl bg-white/95 p-6 shadow-xl">
                  <Quote className="h-8 w-8 text-[#d6aa49]" />
                  <p className="font-display mt-3 text-xl font-bold leading-8 text-[#10233f]">
                    “Em không còn cố trở thành ứng viên hoàn hảo. Em học cách kể
                    thật rõ điều mình quan tâm và đã kiên trì làm.”
                  </p>
                  <p className="mt-4 text-sm font-black text-[#941b2b]">
                    Nguyễn Minh Khang · Boston, Class of 2030
                  </p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[.2em] text-[#941b2b]">
                Câu chuyện NSHM
              </p>
              <h2 className="font-display mt-3 text-4xl font-bold text-[#10233f]">
                Mỗi bộ hồ sơ là một hành trình trưởng thành
              </h2>
              <p className="mt-5 leading-7 text-slate-600">
                Điểm số mở ra cơ hội. Nhưng chính những lựa chọn, dự án và cách
                học sinh phản tư về trải nghiệm mới tạo nên dấu ấn lâu dài.
              </p>
              <div className="mt-8 space-y-4">
                {published
                  .filter((p) => p.category === "Câu chuyện")
                  .slice(0, 3)
                  .map((p) => (
                    <Link
                      key={p.slug}
                      href={`/bai-viet/${p.slug}`}
                      className="flex items-center gap-4 border-b border-slate-200 pb-4 group"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#10233f] text-xs font-black text-white">
                        NS
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-black text-[#10233f] group-hover:text-[#941b2b]">
                          {p.title}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {p.readTime}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-[#941b2b]" />
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </section>
        <section id="chuyen-di" className="py-20">
          <div className="mx-auto max-w-[1380px] px-5 lg:px-8">
            <SectionTitle
              eyebrow="Học qua trải nghiệm"
              title="Những hành trình mở rộng thế giới"
              href={published.find((p) => p.category === "Chuyến đi")!.slug}
            />
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {published
                .filter((p) => p.category === "Chuyến đi")
                .map((p, i) => (
                  <Link
                    key={p.slug}
                    href={`/bai-viet/${p.slug}`}
                    className="group overflow-hidden rounded-2xl bg-slate-100"
                  >
                    <div
                      className="relative h-52 overflow-hidden"
                      style={{ background: p.accent }}
                    >
                      <Image
                        src="/campus-hero.svg"
                        alt={p.title}
                        fill
                        className="object-cover opacity-45 transition duration-500 group-hover:scale-110"
                      />
                      <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-[#10233f]">
                        {p.date}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-xl font-bold leading-7 text-[#10233f] group-hover:text-[#941b2b]">
                        {p.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {p.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
        <section className="bg-[#941b2b] py-16 text-white">
          <div className="mx-auto flex max-w-[1100px] flex-col items-center px-5 text-center">
            <UsersRound className="h-9 w-9 text-[#d6aa49]" />
            <p className="mt-4 text-xs font-black uppercase tracking-[.2em] text-[#f1cc76]">
              Bắt đầu bằng một cuộc trò chuyện
            </p>
            <h2 className="font-display mt-3 text-4xl font-bold">
              Bạn đã sẵn sàng cho hành trình của riêng mình?
            </h2>
            <p className="mt-4 max-w-2xl leading-7 text-red-100">
              Đăng ký để chuyên viên của NSHM lắng nghe mục tiêu, rà soát dữ
              liệu ban đầu và cùng bạn xác định bước tiếp theo.
            </p>
            <Link
              href="/dang-ky-tu-van"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#d6aa49] px-7 py-3.5 text-sm font-black text-[#10233f]"
            >
              Đăng ký tư vấn du học <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}

function SectionTitle({
  eyebrow,
  title,
  href,
}: {
  eyebrow: string;
  title: string;
  href: string;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-xs font-black uppercase tracking-[.2em] text-[#941b2b]">
          {eyebrow}
        </p>
        <h2 className="font-display mt-3 text-4xl font-bold text-[#10233f]">
          {title}
        </h2>
      </div>
      <Link
        href={`/bai-viet/${href}`}
        className="inline-flex items-center gap-2 text-sm font-black text-[#941b2b]"
      >
        Xem tất cả <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
function PostRow({
  post,
  index,
}: {
  post: (typeof posts)[number];
  index: number;
}) {
  return (
    <Link
      href={`/bai-viet/${post.slug}`}
      className="group flex gap-4 rounded-2xl border border-slate-200 p-4 hover:border-[#d6aa49] hover:shadow-lg"
    >
      <div
        className="flex h-24 w-28 shrink-0 items-center justify-center rounded-xl text-white"
        style={{ background: post.accent }}
      >
        {index === 0 ? (
          <CalendarDays />
        ) : index === 1 ? (
          <UsersRound />
        ) : (
          <Globe2 />
        )}
      </div>
      <div className="min-w-0">
        <span className="text-[10px] font-black uppercase tracking-wider text-[#941b2b]">
          {post.category}
        </span>
        <h3 className="mt-1 line-clamp-2 font-display text-lg font-bold leading-6 text-[#10233f] group-hover:text-[#941b2b]">
          {post.title}
        </h3>
        <p className="mt-2 text-xs text-slate-400">
          {post.date} · {post.readTime}
        </p>
      </div>
    </Link>
  );
}
function ArticleCard({
  p,
  index,
}: {
  p: (typeof posts)[number];
  index: number;
}) {
  return (
    <Link
      href={`/bai-viet/${p.slug}`}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-xl"
    >
      <div
        className="relative h-44 overflow-hidden"
        style={{ background: p.accent }}
      >
        <Image
          src="/campus-hero.svg"
          alt={p.title}
          fill
          className="object-cover opacity-35 transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#941b2b]">
          {p.category}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl font-bold leading-7 text-[#10233f] group-hover:text-[#941b2b]">
          {p.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
          {p.excerpt}
        </p>
        <p className="mt-4 text-xs font-bold text-slate-400">
          {p.date} · {p.readTime}
        </p>
      </div>
    </Link>
  );
}
