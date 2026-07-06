import { SessionsWorkspace } from "@/components/internal/SessionsWorkspace";
import { getSessionsWorkspace } from "@/lib/data/sessions";

export const dynamic = "force-dynamic";

export default async function SessionsPage() {
  const result = await getSessionsWorkspace();
  return <SessionsWorkspace initialSessions={result.data.sessions} students={result.data.students} cases={result.data.cases} initialStatus={result.status} />;
}
