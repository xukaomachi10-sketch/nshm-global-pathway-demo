export type DataMode = "mock" | "supabase";

export function getRequestedDataMode(): DataMode {
  return process.env.NEXT_PUBLIC_DATA_MODE === "supabase"
    ? "supabase"
    : "mock";
}
