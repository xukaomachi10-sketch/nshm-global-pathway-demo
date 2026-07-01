"use client";

import { HTMLAttributes, ReactNode, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";

export function Card({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div
      {...props}
      className={`rounded-2xl border border-slate-200/80 bg-white card-shadow ${className}`}
    >
      {children}
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  className = "",
  onClick,
  type = "button",
  disabled = false,
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "gold";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const styles = {
    primary: "bg-[#941b2b] text-white hover:bg-[#781523] shadow-sm",
    secondary:
      "border border-slate-300 bg-white text-[#10233f] hover:bg-slate-50",
    ghost: "text-slate-600 hover:bg-slate-100",
    gold: "bg-[#d6aa49] text-[#10233f] hover:bg-[#c79a38]",
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Badge({
  children,
  tone = "slate",
}: {
  children: ReactNode;
  tone?: "red" | "green" | "amber" | "blue" | "slate" | "purple" | "gold";
}) {
  const colors = {
    red: "bg-red-50 text-red-700 ring-red-600/15",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
    amber: "bg-amber-50 text-amber-800 ring-amber-600/20",
    blue: "bg-blue-50 text-blue-700 ring-blue-600/15",
    slate: "bg-slate-100 text-slate-700 ring-slate-500/10",
    purple: "bg-purple-50 text-purple-700 ring-purple-600/15",
    gold: "bg-amber-100 text-amber-900 ring-amber-700/15",
  };
  return (
    <span
      className={`inline-flex whitespace-nowrap items-center rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${colors[tone]}`}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ value }: { value: string }) {
  let tone: "red" | "green" | "amber" | "blue" | "slate" | "purple" = "slate";
  if (/Cao|Quá hạn|Cần bổ sung|Cần chỉnh sửa|Từ chối/.test(value)) tone = "red";
  else if (/Hoàn thành|Đã duyệt|Đã xác thực|Đã nộp|Offer|Handoff/.test(value))
    tone = "green";
  else if (/Chờ|Đang|Trung bình|Cần sửa/.test(value)) tone = "amber";
  else if (/University|Sẵn sàng|Target|Reviewed/.test(value)) tone = "blue";
  else if (/Reach|Verified/.test(value)) tone = "purple";
  return <Badge tone={tone}>{value}</Badge>;
}

export function Progress({
  value,
  color = "#941b2b",
  small = false,
}: {
  value: number;
  color?: string;
  small?: boolean;
}) {
  return (
    <div
      className={`w-full overflow-hidden rounded-full bg-slate-100 ${small ? "h-1.5" : "h-2"}`}
    >
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${Math.min(100, value)}%`, background: color }}
      />
    </div>
  );
}

export function StatCard({
  label,
  value,
  helper,
  icon,
  accent = "navy",
}: {
  label: string;
  value: string | number;
  helper: string;
  icon: ReactNode;
  accent?: "navy" | "red" | "gold" | "green";
}) {
  const tones = {
    navy: "bg-[#10233f]",
    red: "bg-[#941b2b]",
    gold: "bg-[#d6aa49]",
    green: "bg-emerald-600",
  };
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-black tracking-tight text-[#10233f]">
            {value}
          </p>
          <p className="mt-1 text-xs text-slate-500">{helper}</p>
        </div>
        <div className={`rounded-xl p-3 text-white ${tones[accent]}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div>
        <p className="text-xs font-black uppercase tracking-[.18em] text-[#941b2b]">
          {eyebrow}
        </p>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-[#10233f] lg:text-3xl">
          {title}
        </h1>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function FilterBar({
  children,
  search,
  setSearch,
  placeholder = "Tìm kiếm...",
  onClear,
}: {
  children?: ReactNode;
  search: string;
  setSearch: (v: string) => void;
  placeholder?: string;
  onClear?: () => void;
}) {
  return (
    <Card className="p-3">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <label className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={placeholder}
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm focus:border-[#941b2b] focus:bg-white"
          />
        </label>
        {children}
        {onClear && (
          <Button variant="ghost" onClick={onClear}>
            <X className="h-4 w-4" /> Xóa lọc
          </Button>
        )}
      </div>
    </Card>
  );
}

export function Select({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  label?: string;
}) {
  return (
    <label className="relative">
      <span className="sr-only">{label || "Bộ lọc"}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 min-w-36 appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-9 text-sm font-semibold text-slate-700"
      >
        <option value="">{label || "Tất cả"}</option>
        {options.map((x) => (
          <option key={x} value={x}>
            {x}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </label>
  );
}

export function EmptyState({
  message = "Không có dữ liệu phù hợp",
}: {
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-slate-100 p-3 text-slate-400">
        <Search className="h-6 w-6" />
      </div>
      <p className="mt-3 text-sm font-bold text-slate-600">{message}</p>
      <p className="mt-1 text-xs text-slate-400">
        Hãy thử thay đổi bộ lọc hoặc từ khóa.
      </p>
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  width = "max-w-xl",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: string;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#10233f]/55 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className={`max-h-[90vh] w-full overflow-auto rounded-2xl bg-white shadow-2xl animate-rise ${width}`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
          <h2 className="text-lg font-black text-[#10233f]">{title}</h2>
          <button
            aria-label="Đóng"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function Toast({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed bottom-5 right-5 z-[60] flex max-w-sm items-center gap-3 rounded-2xl bg-[#10233f] px-4 py-3 text-sm font-semibold text-white shadow-2xl animate-rise">
      <span className="rounded-full bg-emerald-500 p-1">
        <Check className="h-3.5 w-3.5" />
      </span>
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 text-white/60">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function useToast() {
  const [message, setMessage] = useState("");
  const showToast = (v: string) => {
    setMessage(v);
    window.setTimeout(() => setMessage(""), 2800);
  };
  return {
    message,
    showToast,
    toast: message ? (
      <Toast message={message} onClose={() => setMessage("")} />
    ) : null,
  };
}
