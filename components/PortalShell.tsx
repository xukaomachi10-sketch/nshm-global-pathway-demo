"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import {
  Bell,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  FileStack,
  FolderLock,
  Globe2,
  LayoutDashboard,
  Menu,
  Search,
  Settings2,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { Navbar, Sidebar } from "@/components/brand";

const items = [
  { href: "/portal", label: "Bàn làm việc", icon: LayoutDashboard },
  {
    href: "/portal/registrations",
    label: "Đăng ký tư vấn",
    icon: UsersRound,
    badge: "8",
  },
  {
    href: "/portal/students/NSHM260101",
    label: "Student 360",
    icon: UserRound,
  },
  {
    href: "/portal/evidence",
    label: "Evidence Vault",
    icon: FolderLock,
    badge: "3",
  },
  {
    href: "/portal/applications",
    label: "Application Pipeline",
    icon: BriefcaseBusiness,
  },
  {
    href: "/portal/documents",
    label: "Tài liệu & Essays",
    icon: FileStack,
    badge: "5",
  },
];

export default function PortalShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = (
    <>
      <div className="flex h-20 items-center gap-3 border-b border-white/10 px-4">
        <Image
          src="/nshm-mark.svg"
          alt="NSHM"
          width={42}
          height={42}
          className="shrink-0"
        />
        {!collapsed && (
          <div>
            <div className="text-sm font-black tracking-wide text-white">
              NSHM GLOBAL
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-[.17em] text-[#FFAD00]">
              Pathways Office
            </div>
            <div className="mt-0.5 text-[8px] font-semibold uppercase tracking-[.14em] text-white/45">
              Brilliance Within
            </div>
          </div>
        )}
      </div>
      <nav className="flex-1 space-y-1 px-3 py-5">
        {!collapsed && (
          <p className="mb-3 px-3 text-[10px] font-black uppercase tracking-[.18em] text-slate-500">
            Không gian làm việc
          </p>
        )}
        {items.map(({ href, label, icon: Icon, badge }) => {
          const active =
            href === "/portal" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? label : undefined}
              className={`flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-bold transition ${active ? "bg-[#D21235] text-white shadow-lg shadow-black/20" : "text-slate-300 hover:bg-white/7 hover:text-white"}`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && (
                <>
                  <span className="min-w-0 flex-1 truncate">{label}</span>
                  {badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] ${active ? "bg-white/15" : "bg-[#FFAD00] text-[#23328C]"}`}
                    >
                      {badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
        <div className="my-4 border-t border-white/10" />
        <Link
          href="/"
          className="flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-bold text-slate-300 hover:bg-white/7 hover:text-white"
        >
          <Globe2 className="h-5 w-5 shrink-0" />
          {!collapsed && "Website công khai"}
        </Link>
        <Link
          href="/cms"
          className="flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-bold text-slate-300 hover:bg-white/7 hover:text-white"
        >
          <Settings2 className="h-5 w-5 shrink-0" />
          {!collapsed && "CMS nội dung"}
        </Link>
      </nav>
      <div className="border-t border-white/10 p-3">
        <div
          className={`flex items-center gap-3 rounded-xl bg-white/5 p-3 ${collapsed ? "justify-center" : ""}`}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFAD00] text-xs font-black text-[#23328C]">
            HL
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-white">
                Nguyễn Hà Linh
              </p>
              <p className="truncate text-[10px] text-slate-400">
                Chuyên viên tư vấn
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#FBFAF7]">
      <Sidebar
        className={`fixed inset-y-0 left-0 z-40 hidden bg-[#23328C] transition-all duration-300 lg:flex lg:flex-col ${collapsed ? "w-20" : "w-64"}`}
      >
        {nav}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-24 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </Sidebar>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#23328C]/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <Sidebar
            onClick={(e) => e.stopPropagation()}
            className="flex h-full w-72 flex-col bg-[#23328C]"
          >
            {nav}
          </Sidebar>
          <button
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
      <div
        className={`transition-all duration-300 ${collapsed ? "lg:pl-20" : "lg:pl-64"}`}
      >
        <Navbar className="sticky top-0 z-30 flex h-16 items-center gap-3 px-4 lg:px-7">
          <button
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="relative hidden max-w-xl flex-1 md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              aria-label="Tìm kiếm toàn hệ thống"
              placeholder="Tìm học sinh, trường đại học, tài liệu..."
              className="h-10 w-full rounded-xl bg-slate-100 pl-10 pr-4 text-sm focus:bg-white focus:ring-2 focus:ring-[#D21235]/20"
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-500 xl:inline">
              Năm học 2026-2027
            </span>
            <button className="rounded-xl p-2.5 text-slate-500 hover:bg-slate-100">
              <CircleHelp className="h-5 w-5" />
            </button>
            <button className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#D21235] ring-2 ring-white" />
            </button>
            <div className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#23328C] text-xs font-black text-white">
              HL
            </div>
          </div>
        </Navbar>
        <main className="mx-auto max-w-[1600px] p-4 lg:p-7">{children}</main>
      </div>
    </div>
  );
}
