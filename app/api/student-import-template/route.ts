import {
  REAL_STUDENT_CSV_TEMPLATE,
  STUDENT_CSV_TEMPLATE,
} from "@/lib/import/student-csv";

export function GET(request: Request) {
  const real = new URL(request.url).searchParams.get("mode") === "real";
  return new Response(real ? REAL_STUDENT_CSV_TEMPLATE : STUDENT_CSV_TEMPLATE, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${real ? "real-student-import-minimal-template" : "fake-student-import-template"}.csv"`,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
