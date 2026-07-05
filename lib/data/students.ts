import { readWithMockFallback } from "./shared";

export async function getStudents() {
  return readWithMockFallback("danh sách học sinh", (repository) =>
    repository.listStudents(1000),
  );
}
