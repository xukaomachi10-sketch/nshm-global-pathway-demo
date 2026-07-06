import { TasksWorkspace } from "@/components/internal/TasksWorkspace";
import { getTasksWorkspace } from "@/lib/data/tasks";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const result = await getTasksWorkspace();
  return <TasksWorkspace initialTasks={result.data.tasks} students={result.data.students} cases={result.data.cases} initialStatus={result.status} />;
}
