"use client";

import { ChangeEvent, useMemo, useState, useTransition } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  LoaderCircle,
  RotateCcw,
  UploadCloud,
} from "lucide-react";
import { confirmStudentImportAction } from "@/app/portal/import-students/actions";
import { DataModeNotice } from "./DataModeNotice";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  PageHeader,
  StatCard,
} from "@/components/ui";
import type { DataAccessStatus } from "@/lib/data-access";
import {
  parseStudentCsv,
  validateStudentImportRows,
  type ParsedStudentCsvRow,
} from "@/lib/import/student-csv";
import type { StudentImportResult } from "@/lib/data/student-import";

export function StudentImportWorkspace({
  existingStudentCodes,
  initialStatus,
}: {
  existingStudentCodes: string[];
  initialStatus: DataAccessStatus;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<ParsedStudentCsvRow[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [status, setStatus] = useState(initialStatus);
  const [success, setSuccess] = useState<StudentImportResult | null>(null);
  const [submitError, setSubmitError] = useState("");
  const [reading, setReading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const validation = useMemo(
    () => validateStudentImportRows(rows, existingStudentCodes),
    [existingStudentCodes, rows],
  );
  const validRows = validation.filter((row) => !row.errors.length);
  const errorRows = validation.filter((row) => row.errors.length);
  const newRows = validRows.filter((row) => row.action === "new");
  const updatedRows = validRows.filter((row) => row.action === "update");

  const reset = () => {
    setFile(null);
    setRows([]);
    setParseErrors([]);
    setSubmitError("");
    setSuccess(null);
  };

  const selectFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    reset();
    if (!selected) return;
    if (!selected.name.toLowerCase().endsWith(".csv")) {
      setParseErrors(["V1 chỉ hỗ trợ tệp .csv. Hãy xuất Excel thành CSV trước khi tải lên."]);
      return;
    }
    if (selected.size > 2 * 1024 * 1024) {
      setParseErrors(["Tệp CSV phải nhỏ hơn hoặc bằng 2 MB."]);
      return;
    }
    setFile(selected);
    setReading(true);
    try {
      const parsed = parseStudentCsv(await selected.text());
      setRows(parsed.rows);
      setParseErrors(parsed.errors);
    } catch {
      setParseErrors(["Không thể đọc tệp CSV."]);
    } finally {
      setReading(false);
      event.target.value = "";
    }
  };

  const confirm = () => {
    if (!file || !validRows.length) return;
    setSubmitError("");
    startTransition(async () => {
      const response = await confirmStudentImportAction({
        fileName: file.name,
        fileSize: file.size,
        rows,
      });
      if (!response.ok) return setSubmitError(response.error);
      setSuccess(response.result);
      setStatus(response.result.status);
    });
  };

  return (
    <div className="space-y-6 animate-rise">
      <PageHeader
        eyebrow="Student Master · CSV Pilot"
        title="Import Student Master Data"
        description="Tải CSV, xem trước và sửa lỗi theo từng dòng trước khi xác nhận. Dòng lỗi sẽ luôn bị bỏ qua."
        actions={
          <a
            href="/api/student-import-template"
            download
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-[#23328C] hover:bg-slate-50"
          >
            <Download className="h-4 w-4" /> Tải CSV mẫu
          </a>
        }
      />
      <DataModeNotice status={status} />
      {status.effectiveMode === "mock" && (
        <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p><strong>Developer warning:</strong> Import đang chạy trong bộ nhớ mock và sẽ không ghi vào Supabase.</p>
        </div>
      )}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-900">
        <strong>Real student data import is disabled until authentication, RBAC, RLS and transaction checks pass.</strong> Pilot chỉ chấp nhận mã giả dạng <strong>FAKE-*</strong>.
      </div>

      {success ? (
        <Card className="p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-700">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-2xl font-black text-[#23328C]">Import hoàn tất</h2>
          <p className="mt-2 text-sm text-slate-500">Batch {success.batchId} · {success.importedStudents} học sinh đã được upsert.</p>
          <div className="mx-auto mt-6 grid max-w-3xl gap-3 sm:grid-cols-4">
            {[
              ["Tổng dòng", success.totalRows],
              ["Đã nhập", success.importedStudents],
              ["Tạo mới", success.newStudents],
              ["Cập nhật", success.updatedStudents],
            ].map(([label, value]) => <div key={String(label)} className="rounded-xl bg-slate-50 p-4"><p className="text-2xl font-black text-[#23328C]">{value}</p><p className="text-xs text-slate-500">{label}</p></div>)}
          </div>
          <Button className="mt-6" variant="secondary" onClick={reset}><RotateCcw className="h-4 w-4" /> Import tệp khác</Button>
        </Card>
      ) : (
        <>
          <Card className="p-6">
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#23328C]/20 bg-[#FBFAF7] px-6 py-10 text-center hover:border-[#D21235]/40">
              {reading ? <LoaderCircle className="h-9 w-9 animate-spin text-[#23328C]" /> : <UploadCloud className="h-9 w-9 text-[#D21235]" />}
              <span className="mt-3 font-black text-[#23328C]">{reading ? "Đang đọc CSV..." : "Chọn tệp CSV"}</span>
              <span className="mt-1 text-xs text-slate-500">Tối đa 2 MB và 1.000 dòng · không tải tệp Excel trực tiếp</span>
              <input type="file" accept=".csv,text/csv" className="sr-only" onChange={selectFile} disabled={reading || isPending} />
            </label>
            {file && <p className="mt-3 text-center text-sm font-semibold text-slate-600"><FileSpreadsheet className="mr-1 inline h-4 w-4" /> {file.name}</p>}
            {parseErrors.length > 0 && <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">{parseErrors.map((error) => <p key={error}>• {error}</p>)}</div>}
          </Card>

          {rows.length > 0 ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <StatCard label="Tổng dòng" value={validation.length} helper="Không tính dòng trống" icon={<FileSpreadsheet className="h-5 w-5" />} />
                <StatCard label="Hợp lệ" value={validRows.length} helper="Sẵn sàng import" icon={<CheckCircle2 className="h-5 w-5" />} accent="green" />
                <StatCard label="Có lỗi" value={errorRows.length} helper="Sẽ không import" icon={<AlertCircle className="h-5 w-5" />} accent="red" />
                <StatCard label="Tạo mới" value={newRows.length} helper="Chưa có student_code" icon={<UploadCloud className="h-5 w-5" />} accent="gold" />
                <StatCard label="Cập nhật" value={updatedRows.length} helper="Upsert theo student_code" icon={<RotateCcw className="h-5 w-5" />} />
              </div>
              <Card className="overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                  <div><h2 className="font-black text-[#23328C]">Xem trước & kiểm tra</h2><p className="text-xs text-slate-500">Hiển thị lỗi và cảnh báo theo số dòng trong CSV.</p></div>
                  <div className="flex gap-2"><Badge tone="green">{validRows.length} hợp lệ</Badge><Badge tone="red">{errorRows.length} lỗi</Badge></div>
                </div>
                <div className="max-h-[560px] overflow-auto">
                  <table className="w-full min-w-[1180px] text-left text-sm">
                    <thead className="sticky top-0 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500"><tr><th className="px-4 py-3">Dòng</th><th className="px-4 py-3">Mã học sinh</th><th className="px-4 py-3">Họ tên / lớp</th><th className="px-4 py-3">Khối / tốt nghiệp</th><th className="px-4 py-3">Thao tác</th><th className="px-5 py-3">Kết quả kiểm tra</th></tr></thead>
                    <tbody className="divide-y divide-slate-100">
                      {validation.map((row) => <tr key={row.rowNumber} className={row.errors.length ? "bg-red-50/50" : "hover:bg-[#FBFAF7]"}>
                        <td className="px-4 py-4 font-black text-slate-500">{row.rowNumber}</td>
                        <td className="px-4 py-4 font-black text-[#23328C]">{row.normalized.student_code || "—"}</td>
                        <td className="px-4 py-4"><p className="font-semibold text-slate-700">{row.normalized.full_name || "—"}</p><p className="text-xs text-slate-400">{row.normalized.class_name || "Chưa có lớp"}</p></td>
                        <td className="px-4 py-4">{row.normalized.grade_level ?? "—"} / {row.normalized.graduation_year ?? "—"}</td>
                        <td className="px-4 py-4"><Badge tone={row.action === "skipped" ? "red" : row.action === "update" ? "amber" : "green"}>{row.action === "new" ? "Tạo mới" : row.action === "update" ? "Cập nhật" : "Bỏ qua"}</Badge></td>
                        <td className="max-w-lg px-5 py-4">
                          {row.errors.map((message) => <p key={message} className="text-xs font-semibold text-red-700">• {message}</p>)}
                          {row.warnings.map((message) => <p key={message} className="text-xs text-amber-700">• {message}</p>)}
                          {!row.errors.length && !row.warnings.length && <span className="text-xs font-semibold text-green-700">Hợp lệ</span>}
                        </td>
                      </tr>)}
                    </tbody>
                  </table>
                </div>
              </Card>
              {submitError && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{submitError}</div>}
              <div className="flex flex-wrap justify-end gap-3">
                <Button variant="secondary" onClick={reset} disabled={isPending}>Hủy</Button>
                <Button onClick={confirm} disabled={isPending || !validRows.length}>{isPending ? <><LoaderCircle className="h-4 w-4 animate-spin" /> Đang import...</> : <>Xác nhận import {validRows.length} dòng</>}</Button>
              </div>
            </>
          ) : !reading && !parseErrors.length ? (
            <Card><EmptyState message="Chưa có CSV để xem trước" /></Card>
          ) : null}
        </>
      )}
    </div>
  );
}
