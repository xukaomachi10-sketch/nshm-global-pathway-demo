import {
  createInternalOperationsRepository,
  type DataAccessStatus,
  type InternalOperationsRepository,
} from "@/lib/data-access";
import { MockInternalOperationsRepository } from "@/lib/data-access/mock-repository";
import type { ActivityLog, Json } from "@/types/database";
import type { InsertOf } from "@/types/database";
import { getRepositoryAccessToken } from "@/lib/auth/session";

export type DataResult<T> = {
  data: T;
  status: DataAccessStatus;
};

function fallbackStatus(
  status: DataAccessStatus,
  subject: string,
): DataAccessStatus {
  return {
    ...status,
    effectiveMode: "mock",
    fallbackReason: `Không thể tải ${subject} từ Supabase. Dữ liệu mock đang được sử dụng.`,
  };
}

export async function readWithMockFallback<T>(
  subject: string,
  read: (repository: InternalOperationsRepository) => Promise<T>,
): Promise<DataResult<T>> {
  const selected = createInternalOperationsRepository(
    await getRepositoryAccessToken(),
  );
  try {
    return {
      data: await read(selected.repository),
      status: selected.status,
    };
  } catch {
    const mock = new MockInternalOperationsRepository();
    return {
      data: await read(mock),
      status: fallbackStatus(selected.status, subject),
    };
  }
}

export type MutationResult<T> = DataResult<T> & {
  activityLogged: boolean;
};

export async function mutateWithActivityLog<T>(options: {
  subject: string;
  mutate: (repository: InternalOperationsRepository) => Promise<T>;
  activity: (record: T) => InsertOf<"activity_logs">;
}): Promise<MutationResult<T>> {
  const selected = createInternalOperationsRepository(
    await getRepositoryAccessToken(),
  );
  let repository = selected.repository;
  let status = selected.status;
  let record: T;

  try {
    record = await options.mutate(repository);
  } catch {
    repository = new MockInternalOperationsRepository();
    status = fallbackStatus(selected.status, options.subject);
    record = await options.mutate(repository);
  }

  try {
    await repository.createActivityLog(options.activity(record));
    return { data: record, status, activityLogged: true };
  } catch {
    return {
      data: record,
      status: {
        ...status,
        fallbackReason: status.fallbackReason
          ? `${status.fallbackReason} Không thể ghi activity log.`
          : "Bản ghi đã được lưu nhưng activity log chưa được ghi.",
      },
      activityLogged: false,
    };
  }
}

export function asJson(value: unknown): Json {
  return value as Json;
}

export function activityBase(input: {
  actorId?: string | null;
  studentId?: string | null;
  caseId?: string | null;
  entityType: string;
  entityId: string;
  action: string;
  record: unknown;
}): InsertOf<"activity_logs"> {
  return {
    actor_id: input.actorId ?? null,
    student_id: input.studentId ?? null,
    counseling_case_id: input.caseId ?? null,
    entity_type: input.entityType,
    entity_id: input.entityId,
    action: input.action,
    confidentiality_level: "restricted",
    previous_data: null,
    new_data: asJson(input.record),
    metadata: { pilot: true, is_fake: true },
  } satisfies Omit<ActivityLog, "id" | "created_at">;
}
