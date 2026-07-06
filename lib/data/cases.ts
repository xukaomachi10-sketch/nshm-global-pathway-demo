import { readWithMockFallback } from "./shared";

export async function getCounselingCases() {
  return readWithMockFallback("hồ sơ tư vấn", (repository) =>
    repository.listCounselingCases(1000),
  );
}

export async function getStudentCounselingWorkspace() {
  return readWithMockFallback("danh sách tư vấn học sinh", async (repository) => {
    const [students, cases] = await Promise.all([
      repository.listStudents(1000),
      repository.listCounselingCases(1000),
    ]);
    return { students, cases };
  });
}
