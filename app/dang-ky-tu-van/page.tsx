"use client";

import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Clock3,
  LockKeyhole,
  Send,
  ShieldCheck,
} from "lucide-react";
import { students } from "@/lib/data";
import { PublicLayout } from "@/components/PublicSite";
import { Button, Progress } from "@/components/ui";
import { FormEvent, useState } from "react";

export default function RegistrationForm() {
  const [step, setStep] = useState(1);
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [done, setDone] = useState(false);
  const existing = students.find(
    (s) => s.id.toLowerCase() === studentId.toLowerCase().trim(),
  );
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (step < 3) setStep(step + 1);
    else setDone(true);
  };
  return (
    <PublicLayout>
      <main className="bg-[#f7f5f0] py-12 lg:py-16">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-[#941b2b]"
          >
            <ArrowLeft className="h-4 w-4" /> Về trang chủ
          </Link>
          <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
            <div className="rounded-3xl bg-[#10233f] p-7 text-white soft-grid lg:p-9">
              <p className="text-xs font-black uppercase tracking-[.2em] text-[#d6aa49]">
                International Counseling Office
              </p>
              <h1 className="font-display mt-4 text-4xl font-bold leading-tight">
                Bắt đầu hành trình bằng một cuộc trò chuyện
              </h1>
              <p className="mt-5 leading-7 text-slate-300">
                Hãy chia sẻ mục tiêu ban đầu. Chuyên viên sẽ liên hệ trong tối
                đa 2 ngày làm việc để xác nhận nhu cầu và sắp xếp buổi tư vấn.
              </p>
              <div className="mt-8 space-y-5">
                {([
                  [
                    ShieldCheck,
                    "Thông tin được bảo mật",
                    "Chỉ người có quyền mới truy cập hồ sơ.",
                  ],
                  [
                    Clock3,
                    "Phản hồi trong 2 ngày",
                    "Bạn sẽ nhận xác nhận qua email hoặc điện thoại.",
                  ],
                  [
                    CheckCircle2,
                    "Không cần hồ sơ hoàn chỉnh",
                    "Chúng ta sẽ cùng xác định dữ liệu cần bổ sung.",
                  ],
                ] as const).map(([I, t, d]) => (
                  <div key={String(t)} className="flex gap-3">
                    <div className="rounded-xl bg-white/10 p-2.5 text-[#d6aa49]">
                      <I className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-black">{String(t)}</p>
                      <p className="mt-1 text-sm text-slate-400">{String(d)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5">
                <LockKeyhole className="h-5 w-5 text-[#d6aa49]" />
                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Dữ liệu dùng duy nhất cho hoạt động tư vấn và quản lý hồ sơ
                  theo phạm vi bạn đồng thuận.
                </p>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl lg:p-8">
              {done ? (
                <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
                  <div className="rounded-full bg-emerald-50 p-5 text-emerald-600">
                    <CheckCircle2 className="h-12 w-12" />
                  </div>
                  <h2 className="font-display mt-6 text-3xl font-bold text-[#10233f]">
                    Đăng ký đã được ghi nhận
                  </h2>
                  <p className="mt-3 max-w-md leading-7 text-slate-500">
                    Mã đăng ký{" "}
                    <strong className="text-[#941b2b]">REG-2607-013</strong>.
                    Phòng HTQT sẽ liên hệ với bạn trong 2 ngày làm việc.
                  </p>
                  <div className="mt-6 rounded-xl bg-slate-50 px-5 py-4 text-sm text-slate-600">
                    {existing
                      ? `Đăng ký đã được liên kết với hồ sơ ${existing.id}, không tạo hồ sơ trùng.`
                      : "Hệ thống sẽ tạo hồ sơ sau khi chuyên viên xác minh Mã HS."}
                  </div>
                  <Link
                    href="/"
                    className="mt-8 rounded-xl bg-[#941b2b] px-6 py-3 text-sm font-black text-white"
                  >
                    Quay về trang chủ
                  </Link>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider text-[#941b2b]">
                        Bước {step}/3
                      </p>
                      <h2 className="font-display mt-1 text-2xl font-bold text-[#10233f]">
                        {step === 1
                          ? "Thông tin học sinh"
                          : step === 2
                            ? "Nhu cầu tư vấn"
                            : "Xác nhận đăng ký"}
                      </h2>
                    </div>
                    <span className="text-sm font-black text-slate-400">
                      {step * 33}%
                    </span>
                  </div>
                  <div className="mt-4">
                    <Progress value={step * 33} />
                  </div>
                  <form onSubmit={submit} className="mt-7">
                    {step === 1 && (
                      <div className="space-y-5">
                        <Field label="Mã học sinh NSHM" required>
                          <input
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            placeholder="Ví dụ: NSHM260101"
                            className="input uppercase"
                            required
                          />
                        </Field>
                        {existing && (
                          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                            <div className="flex gap-3">
                              <AlertCircle className="h-5 w-5 shrink-0 text-amber-700" />
                              <div>
                                <p className="text-sm font-black text-amber-950">
                                  Đã tìm thấy hồ sơ học sinh
                                </p>
                                <p className="mt-1 text-xs leading-5 text-amber-800">
                                  {existing.name} · {existing.className}. Đăng
                                  ký này sẽ được liên kết với hồ sơ hiện có để
                                  tránh trùng dữ liệu.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        <Field label="Họ và tên" required>
                          <input
                            value={existing?.name || name}
                            disabled={!!existing}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nhập họ và tên học sinh"
                            className="input disabled:bg-slate-100"
                            required
                          />
                        </Field>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field label="Lớp">
                            <select className="input">
                              <option>
                                {existing?.className || "Chọn lớp"}
                              </option>
                              <option>10A1</option>
                              <option>11A2</option>
                              <option>12A3</option>
                            </select>
                          </Field>
                          <Field label="Năm tốt nghiệp">
                            <select className="input">
                              <option>2027</option>
                              <option>2028</option>
                              <option>2029</option>
                            </select>
                          </Field>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field label="Email">
                            <input
                              type="email"
                              className="input"
                              placeholder="email@nshm.edu.vn"
                            />
                          </Field>
                          <Field label="Số điện thoại CMHS" required>
                            <input
                              className="input"
                              placeholder="09xx xxx xxx"
                              required
                            />
                          </Field>
                        </div>
                      </div>
                    )}
                    {step === 2 && (
                      <div className="space-y-5">
                        <Field label="Quốc gia quan tâm" required>
                          <select className="input">
                            <option>Hoa Kỳ</option>
                            <option>Canada</option>
                            <option>Vương quốc Anh</option>
                            <option>Úc</option>
                            <option>Singapore</option>
                            <option>Chưa xác định</option>
                          </select>
                        </Field>
                        <Field label="Ngành học quan tâm">
                          <input
                            className="input"
                            placeholder="Ví dụ: Khoa học dữ liệu, Kinh tế..."
                          />
                        </Field>
                        <Field label="Bạn muốn được hỗ trợ về">
                          <div className="mt-2 grid gap-2 sm:grid-cols-2">
                            {[
                              "Chọn ngành & trường",
                              "Xây University List",
                              "Portfolio & hoạt động",
                              "Essay & LOR",
                              "Học bổng & tài chính",
                              "Lộ trình tổng thể",
                            ].map((x, i) => (
                              <label
                                key={x}
                                className="flex items-center gap-2 rounded-xl border border-slate-200 p-3 text-sm font-semibold hover:border-[#941b2b]"
                              >
                                <input
                                  type="checkbox"
                                  defaultChecked={i === 0 || i === 5}
                                />
                                {x}
                              </label>
                            ))}
                          </div>
                        </Field>
                        <Field label="Điều bạn đang băn khoăn nhất">
                          <textarea
                            className="input min-h-28 py-3"
                            placeholder="Chia sẻ ngắn để chuyên viên chuẩn bị tốt hơn..."
                          />
                        </Field>
                      </div>
                    )}
                    {step === 3 && (
                      <div className="space-y-5">
                        <div className="rounded-2xl bg-slate-50 p-5">
                          <h3 className="font-black text-[#10233f]">
                            Thông tin đăng ký
                          </h3>
                          <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                            <div>
                              <dt className="text-xs text-slate-400">
                                Học sinh
                              </dt>
                              <dd className="mt-1 font-bold">
                                {existing?.name || name || "Nguyễn Minh Anh"}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-xs text-slate-400">Mã HS</dt>
                              <dd className="mt-1 font-bold">
                                {studentId || "NSHM260101"}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-xs text-slate-400">
                                Quan tâm
                              </dt>
                              <dd className="mt-1 font-bold">
                                Hoa Kỳ · Khoa học dữ liệu
                              </dd>
                            </div>
                            <div>
                              <dt className="text-xs text-slate-400">
                                Mức ưu tiên
                              </dt>
                              <dd className="mt-1 font-bold">
                                Tư vấn thường quy
                              </dd>
                            </div>
                          </dl>
                        </div>
                        <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4">
                          <input type="checkbox" required className="mt-1" />
                          <span className="text-sm leading-6 text-slate-600">
                            Tôi xác nhận thông tin là chính xác và đồng ý để nhà
                            trường sử dụng dữ liệu này cho mục đích tư vấn, điều
                            phối lịch và quản lý hồ sơ.
                          </span>
                        </label>
                        <p className="text-xs leading-5 text-slate-400">
                          Bạn có thể yêu cầu cập nhật hoặc rút lại đồng thuận
                          theo chính sách bảo mật của nhà trường.
                        </p>
                      </div>
                    )}
                    <div className="mt-8 flex justify-between">
                      {step > 1 ? (
                        <button
                          type="button"
                          onClick={() => setStep(step - 1)}
                          className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100"
                        >
                          Quay lại
                        </button>
                      ) : (
                        <span />
                      )}
                      <Button
                        type="submit"
                        disabled={
                          step === 1 && (!studentId || (!name && !existing))
                        }
                      >
                        {step < 3 ? (
                          <>
                            Tiếp tục <ChevronRight className="h-4 w-4" />
                          </>
                        ) : (
                          <>
                            Gửi đăng ký <Send className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <style jsx global>{`
        .input {
          margin-top: 0.5rem;
          height: 2.75rem;
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid #e2e8f0;
          padding: 0 0.85rem;
          font-size: 0.875rem;
        }
        .input:focus {
          border-color: #941b2b;
          box-shadow: 0 0 0 3px rgba(148, 27, 43, 0.08);
          outline: none;
        }
      `}</style>
    </PublicLayout>
  );
}
function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-black text-slate-700">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </span>
      {children}
    </label>
  );
}
