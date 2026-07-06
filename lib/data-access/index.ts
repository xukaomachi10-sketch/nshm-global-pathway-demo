import { getRequestedDataMode, type DataMode } from "./config";
import { MockInternalOperationsRepository } from "./mock-repository";
import type { InternalOperationsRepository } from "./repository";
import { SupabaseInternalOperationsRepository } from "./supabase-repository";
import { getPublicSupabaseConfig } from "@/lib/supabase/config";

export type DataAccessStatus = {
  requestedMode: DataMode;
  effectiveMode: DataMode;
  supabaseConfigured: boolean;
  fallbackReason?: string;
  technicalError?: string;
};

export function createInternalOperationsRepository(accessToken?: string): {
  repository: InternalOperationsRepository;
  status: DataAccessStatus;
} {
  const requestedMode = getRequestedDataMode();
  const config = getPublicSupabaseConfig();

  if (requestedMode === "supabase" && config) {
    return {
      repository: new SupabaseInternalOperationsRepository({
        ...config,
        accessToken,
      }),
      status: {
        requestedMode,
        effectiveMode: "supabase",
        supabaseConfigured: true,
      },
    };
  }

  return {
    repository: new MockInternalOperationsRepository(),
    status: {
      requestedMode,
      effectiveMode: "mock",
      supabaseConfigured: Boolean(config),
      fallbackReason:
        requestedMode === "supabase"
          ? "Supabase URL or publishable/anon key is missing. Mock fallback is active."
          : undefined,
    },
  };
}

async function getMockOverview() {
  const fallback = new MockInternalOperationsRepository();
  const [users, students, cases, sessions, tasks, scores, consents, logs] =
    await Promise.all([
      fallback.listUsers(100),
      fallback.listStudents(1000),
      fallback.listCounselingCases(1000),
      fallback.listCounselingSessions(1000),
      fallback.listInternalTasks(1000),
      fallback.listTestScores(1000),
      fallback.listConsents(1000),
      fallback.listActivityLogs(20),
    ]);

  return { users, students, cases, sessions, tasks, scores, consents, logs };
}

export async function getPilotOverview() {
  const selected = createInternalOperationsRepository();

  if (selected.status.effectiveMode === "mock") {
    return {
      status: selected.status,
      pilotScope: "mock_demo" as const,
      ...(await getMockOverview()),
    };
  }

  try {
    const students = await selected.repository.listStudents(1000);

    return {
      status: selected.status,
      pilotScope: "students_connection_only" as const,
      users: [],
      students,
      cases: [],
      sessions: [],
      tasks: [],
      scores: [],
      consents: [],
      logs: [],
    };
  } catch {
    return {
      status: {
        ...selected.status,
        effectiveMode: "mock" as const,
        fallbackReason:
          "Supabase students query failed. Mock fallback is active; check the fake-student RLS policy.",
      },
      pilotScope: "mock_fallback" as const,
      ...(await getMockOverview()),
    };
  }
}

export type { InternalOperationsRepository } from "./repository";
export { getRequestedDataMode } from "./config";
