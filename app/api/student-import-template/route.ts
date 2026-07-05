import { STUDENT_CSV_TEMPLATE } from "@/lib/import/student-csv";

export function GET() {
  return new Response(STUDENT_CSV_TEMPLATE, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="student-import-template.csv"',
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
