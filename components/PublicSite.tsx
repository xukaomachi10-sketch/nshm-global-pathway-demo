"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  AtSign,
  Mail,
  MapPin,
  Menu,
  Phone,
  Play,
  Search,
  Share2,
  X,
} from "lucide-react";
import { ReactNode, useState } from "react";

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="relative z-30 bg-[#D21235] text-white shadow-[0_8px_24px_rgba(35,50,140,.14)]">
      <div className="bg-[#23328C]">
        <div className="mx-auto flex h-7 max-w-[1380px] items-center justify-between px-4 text-[9px] font-semibold uppercase tracking-[.18em] text-white/80 lg:px-8">
          <span className="sm:hidden">Đức · Trí · Thể · Nhân · Hòa</span>
          <span className="hidden sm:inline">
            Đạo đức · Trí tuệ · Thể chất · Nhân cách · Hòa hợp
          </span>
          <span className="hidden text-[#FFAD00] sm:inline">Brilliance Within</span>
        </div>
      </div>
      <div className="mx-auto flex h-20 max-w-[1380px] items-center px-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/nshm-mark.svg" alt="NSHM" width={46} height={46} />
          <div>
            <p className="text-sm font-black tracking-wide">
              NGÔI SAO HOÀNG MAI
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#FFEBD6]">
              International Counseling Office
            </p>
          </div>
        </Link>
        <nav className="ml-auto hidden items-center gap-7 lg:flex">
          {[
            ["Giới thiệu", "/#gioi-thieu"],
            ["Tin tức", "/#tin-tuc"],
            ["Học bổng", "/#hoc-bong"],
            ["Tuyển sinh", "/#tuyen-sinh"],
            ["Câu chuyện", "/#cau-chuyen"],
            ["Chuyến đi", "/#chuyen-di"],
            ["Demo", "/demo"],
          ].map((x) => (
            <Link
              key={x[0]}
              href={x[1]}
              className="text-sm font-semibold text-white/90 hover:text-[#FFEBD6]"
            >
              {x[0]}
            </Link>
          ))}
          <button
            aria-label="Tìm kiếm"
            className="rounded-full p-2 hover:bg-white/10"
          >
            <Search className="h-4 w-4" />
          </button>
          <Link
            href="/dang-ky-tu-van"
            className="rounded-xl bg-[#FFEBD6] px-4 py-2.5 text-sm font-extrabold text-[#D21235] ring-1 ring-white/30 transition hover:bg-white"
          >
            Đăng ký tư vấn du học
          </Link>
        </nav>
        <button
          onClick={() => setOpen(!open)}
          className="ml-auto rounded-lg p-2 lg:hidden"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-white/10 px-4 py-4 lg:hidden">
          {[
            ["Tin tức", "/#tin-tuc"],
            ["Học bổng", "/#hoc-bong"],
            ["Tuyển sinh", "/#tuyen-sinh"],
            ["Câu chuyện", "/#cau-chuyen"],
            ["Chuyến đi", "/#chuyen-di"],
            ["Demo sản phẩm", "/demo"],
          ].map((x) => (
            <Link
              onClick={() => setOpen(false)}
              key={x[0]}
              href={x[1]}
              className="block border-b border-white/5 py-3 text-sm font-bold"
            >
              {x[0]}
            </Link>
          ))}
          <Link
            onClick={() => setOpen(false)}
            href="/dang-ky-tu-van"
            className="mt-4 block rounded-xl bg-[#FFEBD6] px-4 py-3 text-center text-sm font-extrabold text-[#D21235]"
          >
            Đăng ký tư vấn du học
          </Link>
        </nav>
      )}
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="bg-[#23328C] text-slate-300">
      <div className="mx-auto grid max-w-[1380px] gap-10 px-5 py-14 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/nshm-mark.svg" alt="NSHM" width={48} height={48} />
            <div>
              <p className="text-sm font-black text-white">
                NSHM GLOBAL PATHWAYS
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#FFAD00]">
                Brilliance Within · Tỏa sáng từ nội tại
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-400">
            Đồng hành cùng học sinh khám phá bản thân, lựa chọn lộ trình và bước
            ra thế giới bằng một hồ sơ chân thực.
          </p>
        </div>
        <div>
          <p className="font-black text-white">Khám phá</p>
          <div className="mt-4 space-y-2 text-sm">
            <Link className="block hover:text-white" href="/#hoc-bong">
              Học bổng mới nhất
            </Link>
            <Link className="block hover:text-white" href="/#tuyen-sinh">
              Thông tin tuyển sinh
            </Link>
            <Link className="block hover:text-white" href="/#cau-chuyen">
              Câu chuyện học sinh
            </Link>
            <Link className="block hover:text-white" href="/portal">
              Cổng chuyên viên
            </Link>
            <Link className="block hover:text-white" href="/demo">
              Danh mục demo
            </Link>
          </div>
        </div>
        <div>
          <p className="font-black text-white">Liên hệ</p>
          <div className="mt-4 space-y-3 text-sm">
            <p className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#FFAD00]" /> Khu
              đô thị Kim Văn - Kim Lũ, Hoàng Mai, Hà Nội
            </p>
            <p className="flex gap-2">
              <Phone className="h-4 w-4 text-[#FFAD00]" /> 024 3555 2244
            </p>
            <p className="flex gap-2">
              <Mail className="h-4 w-4 text-[#FFAD00]" />{" "}
              globalpathways@nshm.edu.vn
            </p>
          </div>
        </div>
        <div>
          <p className="font-black text-white">Kết nối với NSHM</p>
          <div className="mt-4 flex gap-2">
            {[Share2, AtSign, Play].map((I, i) => (
              <button
                key={i}
                className="rounded-xl bg-white/7 p-3 hover:bg-[#D21235]"
              >
                <I className="h-4 w-4" />
              </button>
            ))}
          </div>
          <Link
            href="/dang-ky-tu-van"
            className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#FFAD00]"
          >
            Bắt đầu hành trình <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1380px] flex-col gap-2 px-5 py-5 text-xs text-slate-500 sm:flex-row sm:justify-between lg:px-8">
          <p>© 2026 Trường Ngôi Sao Hoàng Mai. All rights reserved.</p>
          <p>Chính sách bảo mật · Điều khoản sử dụng</p>
        </div>
      </div>
    </footer>
  );
}

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      {children}
      <PublicFooter />
    </div>
  );
}
