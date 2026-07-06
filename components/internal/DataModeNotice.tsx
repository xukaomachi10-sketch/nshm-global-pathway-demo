import { AlertTriangle, Database } from "lucide-react";
import { Badge } from "@/components/ui";
import type { DataAccessStatus } from "@/lib/data-access";

export function DataModeNotice({ status }: { status: DataAccessStatus }) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600">
      <Database className="h-4 w-4 text-[#23328C]" />
      <span className="font-bold">Nguồn dữ liệu</span>
      <Badge tone={status.effectiveMode === "supabase" ? "green" : "blue"}>
        {status.effectiveMode}
      </Badge>
      {status.fallbackReason && (
        <span className="inline-flex items-center gap-1.5 text-amber-700">
          <AlertTriangle className="h-3.5 w-3.5" />
          Dev: {status.fallbackReason}
        </span>
      )}
    </div>
  );
}

export function RouteSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-8 w-72 rounded-lg bg-slate-200" />
      <div className="h-20 rounded-2xl bg-white" />
      <div className="h-96 rounded-2xl bg-white" />
    </div>
  );
}
