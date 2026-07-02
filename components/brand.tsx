import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { HTMLAttributes, ReactNode } from "react";

export function PatternBackground({
  children,
  className = "",
  tone = "blue",
}: {
  children: ReactNode;
  className?: string;
  tone?: "blue" | "crimson" | "antique";
}) {
  const tones = {
    blue: "bg-brand-blue text-white",
    crimson: "bg-brand-crimson text-white",
    antique: "bg-brand-antique text-[#23328C]",
  };
  return (
    <div className={`soft-grid relative overflow-hidden ${tones[tone]} ${className}`}>
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkLabel = "Xem tất cả",
  inverted = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  inverted?: boolean;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p
          className={`text-xs font-black uppercase tracking-[.2em] ${inverted ? "text-[#FFAD00]" : "text-[#D21235]"}`}
        >
          {eyebrow}
        </p>
        <h2
          className={`font-display mt-3 text-3xl font-bold sm:text-4xl ${inverted ? "text-white" : "text-[#23328C]"}`}
        >
          {title}
        </h2>
        {description && (
          <p
            className={`mt-3 max-w-2xl text-sm leading-6 ${inverted ? "text-white/75" : "text-slate-600"}`}
          >
            {description}
          </p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className={`brand-focus inline-flex items-center gap-2 rounded-lg text-sm font-black ${inverted ? "text-[#FFAD00]" : "text-[#D21235]"}`}
        >
          {linkLabel} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

export function HeroSection({
  eyebrow,
  title,
  highlight,
  description,
  assurances,
  stats,
}: {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  assurances: string[];
  stats: Array<[string, string]>;
}) {
  return (
    <PatternBackground tone="crimson" className="min-h-[650px]">
      <Image
        src="/campus-hero.svg"
        alt="Khuôn viên Trường Ngôi Sao Hoàng Mai"
        fill
        priority
        className="object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-[#23328C]/45" />
      <div className="relative mx-auto flex min-h-[650px] max-w-[1380px] items-center px-5 py-24 lg:px-8">
        <div className="max-w-3xl pb-24 sm:pb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FFAD00]/50 bg-[#23328C]/45 px-4 py-2 text-xs font-black uppercase tracking-[.14em] text-[#FFEBD6]">
            <Sparkles className="h-4 w-4" /> {eyebrow}
          </div>
          <h1 className="font-display mt-6 text-5xl font-bold leading-[1.08] sm:text-6xl lg:text-7xl">
            {title}
            <br />
            <span className="text-[#FFAD00]">{highlight}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85">
            {description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/dang-ky-tu-van"
              className="brand-focus inline-flex items-center gap-2 rounded-xl bg-[#FFAD00] px-6 py-3.5 text-sm font-black text-[#23328C] shadow-xl transition hover:bg-[#FFEBD6]"
            >
              Đăng ký tư vấn du học <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#gioi-thieu"
              className="brand-focus rounded-xl border border-white/35 bg-[#23328C]/25 px-6 py-3.5 text-sm font-black transition hover:bg-[#23328C]/50"
            >
              Khám phá lộ trình
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-7 text-sm">
            {assurances.map((item) => (
              <span key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#FFAD00]" /> {item}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 border-t border-white/15 bg-[#23328C]/90">
        <div className="mx-auto grid max-w-[1380px] grid-cols-2 divide-x divide-white/10 px-5 md:grid-cols-4 lg:px-8">
          {stats.map(([value, label]) => (
            <div key={label} className="px-3 py-4 text-center sm:px-4 sm:py-5">
              <p className="text-2xl font-black text-[#FFAD00]">{value}</p>
              <p className="mt-1 text-[11px] text-white/65 sm:text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </PatternBackground>
  );
}

export function Sidebar({
  className = "",
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <aside
      {...props}
      className={`flex flex-col bg-[#23328C] text-white ${className}`}
    />
  );
}

export function Navbar({
  className = "",
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <header
      {...props}
      className={`border-b border-[#23328C]/10 bg-white/95 backdrop-blur ${className}`}
    />
  );
}

export function Table({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`overflow-x-auto rounded-2xl border border-[#23328C]/10 bg-white ${className}`}>
      <table className="w-full min-w-[680px] border-collapse text-left text-sm">
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children }: { children: ReactNode }) {
  return <thead className="bg-[#FFEBD6] text-[#23328C]">{children}</thead>;
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-[#23328C]/10">{children}</tbody>;
}

export function TableRow({ children }: { children: ReactNode }) {
  return <tr className="transition hover:bg-[#ADDDFF]/15">{children}</tr>;
}

export function TableHead({ children }: { children: ReactNode }) {
  return <th className="px-5 py-3 text-xs font-black uppercase tracking-wide">{children}</th>;
}

export function TableCell({ children }: { children: ReactNode }) {
  return <td className="px-5 py-4 text-slate-600">{children}</td>;
}
