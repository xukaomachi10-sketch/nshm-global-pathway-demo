import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getRequestedDataMode } from "@/lib/data-access/config";
import { getPublicSupabaseConfig } from "@/lib/supabase/config";
import type { StaffProfile, StaffRole } from "@/types/database";

const ACCESS_COOKIE = "nshm_staff_access";
const MOCK_COOKIE = "nshm_mock_staff";

export type StaffSession = {
  staff: StaffProfile;
  accessToken?: string;
  mode: "mock" | "supabase";
};

export function getEffectiveAuthMode(): "mock" | "supabase" {
  return getRequestedDataMode() === "supabase" && getPublicSupabaseConfig()
    ? "supabase"
    : "mock";
}

const mockStaff: StaffProfile = {
  id: "00000000-0000-4000-8000-000000000099",
  auth_user_id: "00000000-0000-4000-8000-000000000099",
  full_name: "Nhân sự Demo",
  email: "fake.staff@example.invalid",
  role: "ICCO_HEAD",
  is_active: true,
  created_at: "2026-07-01T00:00:00.000Z",
  updated_at: "2026-07-01T00:00:00.000Z",
};

async function fetchStaffProfile(accessToken: string) {
  const config = getPublicSupabaseConfig();
  if (!config) return null;
  const endpoint = new URL("/rest/v1/staff_profiles", config.url);
  endpoint.searchParams.set("select", "*");
  endpoint.searchParams.set("is_active", "eq.true");
  endpoint.searchParams.set("limit", "1");
  const response = await fetch(endpoint, {
    cache: "no-store",
    headers: {
      apikey: config.apiKey,
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });
  if (!response.ok) return null;
  const rows = (await response.json()) as StaffProfile[];
  return rows[0] ?? null;
}

export async function getCurrentStaffSession(): Promise<StaffSession | null> {
  const cookieStore = await cookies();
  if (getEffectiveAuthMode() === "mock") {
    return cookieStore.get(MOCK_COOKIE)?.value === "active"
      ? { staff: mockStaff, mode: "mock" }
      : null;
  }
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;
  if (!accessToken) return null;
  const staff = await fetchStaffProfile(accessToken);
  return staff ? { staff, accessToken, mode: "supabase" } : null;
}

export async function requireStaffSession(): Promise<StaffSession> {
  const session = await getCurrentStaffSession();
  if (!session) redirect("/login");
  return session;
}

export async function requireStaffRole(
  roles: StaffRole[],
): Promise<StaffSession> {
  const session = await requireStaffSession();
  if (!roles.includes(session.staff.role)) redirect("/portal?access=denied");
  return session;
}

export async function getRepositoryAccessToken() {
  return (await getCurrentStaffSession())?.accessToken;
}

export async function signInStaff(email: string, password: string) {
  const config = getPublicSupabaseConfig();
  if (!config || getEffectiveAuthMode() !== "supabase") {
    throw new Error("Supabase staff login is not configured in this environment.");
  }
  const endpoint = new URL("/auth/v1/token", config.url);
  endpoint.searchParams.set("grant_type", "password");
  const response = await fetch(endpoint, {
    method: "POST",
    cache: "no-store",
    headers: {
      apikey: config.apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error("Email hoặc mật khẩu không đúng.");
  const auth = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
  };
  if (!auth.access_token) throw new Error("Supabase không trả về phiên đăng nhập.");
  const staff = await fetchStaffProfile(auth.access_token);
  if (!staff?.is_active) throw new Error("Tài khoản chưa có hồ sơ nhân sự đang hoạt động.");

  const cookieStore = await cookies();
  cookieStore.set(ACCESS_COOKIE, auth.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.min(auth.expires_in ?? 3600, 3600),
  });
  return staff;
}

export async function startMockStaffSession() {
  const cookieStore = await cookies();
  cookieStore.set(MOCK_COOKIE, "active", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 8 * 60 * 60,
  });
}

export async function clearStaffSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_COOKIE);
  cookieStore.delete(MOCK_COOKIE);
}
