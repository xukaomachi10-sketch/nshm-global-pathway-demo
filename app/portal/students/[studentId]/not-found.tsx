import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";
import { Card } from "@/components/ui";

export default function StudentNotFound() {
  return (
    <div className="space-y-5 animate-rise">
      <Link
        href="/portal/students"
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#D21235]"
      >
        <ArrowLeft className="h-4 w-4" /> Quay lại danh sách học sinh
      </Link>
      <Card className="p-10 text-center">
        <SearchX className="mx-auto h-11 w-11 text-slate-400" />
        <h1 className="mt-4 text-xl font-black text-[#23328C]">
          Không tìm thấy hồ sơ học sinh
        </h1>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
          Hồ sơ không tồn tại, đã nằm ngoài phạm vi RLS của tài khoản, hoặc đường
          dẫn không sử dụng UUID nội bộ của học sinh.
        </p>
      </Card>
    </div>
  );
}
