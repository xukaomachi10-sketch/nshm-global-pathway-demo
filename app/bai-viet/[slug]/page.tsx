import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  Link2,
  Quote,
  Share2,
  Sparkles,
} from "lucide-react";
import { posts } from "@/lib/data";
import { PublicLayout } from "@/components/PublicSite";

export default async function Article({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug) || posts[0];
  const related = posts
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);
  return (
    <PublicLayout>
      <main>
        <section className="bg-[#23328C] text-white">
          <div className="mx-auto max-w-[1120px] px-5 py-14 lg:px-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm font-bold text-slate-300 hover:text-[#FFAD00]"
            >
              <ArrowLeft className="h-4 w-4" /> Về trang chủ
            </Link>
            <div className="mt-8 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#FFAD00] px-3 py-1 text-xs font-black text-[#23328C]">
                {post.category}
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-slate-200">
                Thông tin đã kiểm chứng
              </span>
            </div>
            <h1 className="font-display mt-5 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              {post.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
              {post.excerpt}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {post.date}
              </span>
              <span className="flex items-center gap-2">
                <Clock3 className="h-4 w-4" />
                {post.readTime}
              </span>
              <span>Phòng Hợp tác Quốc tế NSHM</span>
            </div>
          </div>
        </section>
        <div className="mx-auto max-w-[1120px] px-5 lg:px-8">
          <div className="relative -mt-1 h-[360px] overflow-hidden rounded-b-3xl bg-[#D21235] sm:h-[480px]">
            <Image
              src="/campus-hero.svg"
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="grid gap-10 py-14 lg:grid-cols-[1fr_240px]">
            <article className="max-w-3xl text-[17px] leading-8 text-slate-700">
              <p className="text-xl font-semibold leading-9 text-[#23328C]">
                Mỗi hành trình đại học bắt đầu từ những lựa chọn có căn cứ.
                Thông tin dưới đây được đội ngũ NSHM tổng hợp để học sinh và gia
                đình có một điểm khởi đầu rõ ràng.
              </p>
              <h2 className="font-display mt-10 text-3xl font-bold text-[#23328C]">
                Điều học sinh cần biết
              </h2>
              <p className="mt-4">
                Trong mùa tuyển sinh 2027, các trường tiếp tục đánh giá hồ sơ
                theo hướng toàn diện: kết quả học thuật, năng lực ngôn ngữ, mức
                độ phù hợp với ngành và cách học sinh thể hiện sự trưởng thành
                qua hoạt động, dự án và bài luận.
              </p>
              <p className="mt-5">
                Thay vì gom thật nhiều hoạt động, học sinh nên chọn một số trải
                nghiệm có ý nghĩa, lưu minh chứng đầy đủ và phản tư trung thực
                về vai trò, kết quả cũng như bài học của mình.
              </p>
              <div className="my-9 rounded-2xl border-l-4 border-[#FFAD00] bg-[#FFEBD6] p-6">
                <Quote className="h-7 w-7 text-[#D21235]" />
                <p className="font-display mt-3 text-2xl font-bold leading-9 text-[#23328C]">
                  Một danh sách trường tốt không phải danh sách có nhiều tên nổi
                  tiếng nhất, mà là danh sách có đủ lựa chọn phù hợp và phương
                  án an toàn.
                </p>
              </div>
              <h2 className="font-display mt-10 text-3xl font-bold text-[#23328C]">
                Checklist chuẩn bị
              </h2>
              <ul className="mt-5 space-y-3">
                {[
                  "Rà soát GPA, môn học thế mạnh và yêu cầu đầu vào theo ngành.",
                  "Lập kế hoạch IELTS/SAT và mốc thi lại nếu cần.",
                  "Cập nhật Portfolio với minh chứng Level A/B cho thành tích trọng yếu.",
                  "Xây University List theo Reach - Target - Safety, ghi rõ nguồn và ngày cập nhật.",
                  "Lên timeline Essay, LOR, tài chính và các deadline nội bộ trước hạn trường.",
                ].map((x) => (
                  <li key={x} className="flex gap-3">
                    <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-[#D21235]" />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10 rounded-3xl bg-[#23328C] p-7 text-white sm:p-9">
                <Sparkles className="h-7 w-7 text-[#FFAD00]" />
                <h3 className="font-display mt-4 text-3xl font-bold">
                  Bạn muốn biết lộ trình nào phù hợp với mình?
                </h3>
                <p className="mt-3 leading-7 text-slate-300">
                  Đăng ký một buổi tư vấn để chuyên viên cùng bạn đọc dữ liệu
                  hiện có, xác định điểm mạnh, điểm thiếu và bước đi tiếp theo.
                </p>
                <Link
                  href="/dang-ky-tu-van"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#FFAD00] px-5 py-3 text-sm font-black text-[#23328C]"
                >
                  Đăng ký tư vấn du học <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
            <aside>
              <div className="sticky top-24 space-y-6">
                <div className="rounded-2xl border border-slate-200 p-5">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Chia sẻ bài viết
                  </p>
                  <div className="mt-4 flex gap-2">
                    {[Share2, BriefcaseBusiness, Link2].map((Icon, i) => (
                      <button
                        key={i}
                        className="rounded-xl bg-slate-100 p-3 text-slate-500 hover:bg-[#D21235] hover:text-white"
                      >
                        <Icon className="h-4 w-4" />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl bg-[#FFEBD6] p-5">
                  <p className="text-sm font-black text-[#23328C]">
                    Nguồn thông tin
                  </p>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Website chính thức của trường đại học và tài liệu tuyển sinh
                    được Phòng HTQT rà soát ngày 28/06/2026.
                  </p>
                </div>
              </div>
            </aside>
          </div>
          {related.length > 0 && (
            <section className="border-t border-slate-200 py-14">
              <h2 className="font-display text-3xl font-bold text-[#23328C]">
                Có thể bạn quan tâm
              </h2>
              <div className="mt-7 grid gap-5 md:grid-cols-3">
                {related.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/bai-viet/${p.slug}`}
                    className="rounded-2xl border border-slate-200 p-5 hover:border-[#FFAD00] hover:shadow-lg"
                  >
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#D21235]">
                      {p.category}
                    </span>
                    <h3 className="font-display mt-2 text-xl font-bold leading-7 text-[#23328C]">
                      {p.title}
                    </h3>
                    <p className="mt-3 text-xs text-slate-400">
                      {p.date} · {p.readTime}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </PublicLayout>
  );
}
