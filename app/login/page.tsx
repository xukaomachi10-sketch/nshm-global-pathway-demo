import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { Card } from "@/components/ui";
import {
  getCurrentStaffSession,
  getEffectiveAuthMode,
} from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await getCurrentStaffSession()) redirect("/portal");
  const mockMode = getEffectiveAuthMode() === "mock";
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#23328C] p-5">
      <Card className="w-full max-w-md p-7 sm:p-9">
        <p className="text-xs font-black uppercase tracking-[.18em] text-[#D21235]">NSHM Global Pathways</p>
        <h1 className="mt-2 text-3xl font-black text-[#23328C]">Staff Login</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {mockMode
            ? "Môi trường này dùng dữ liệu mock. Phiên demo không truy cập Supabase."
            : "Đăng nhập bằng tài khoản Supabase Auth đã được liên kết với hồ sơ nhân sự đang hoạt động."}
        </p>
        <LoginForm mockMode={mockMode} />
        <p className="mt-5 text-xs leading-5 text-slate-400">Không có tài khoản học sinh hoặc phụ huynh trong giai đoạn này.</p>
      </Card>
    </main>
  );
}
