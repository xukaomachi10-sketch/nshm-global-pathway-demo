"use server";

import { redirect } from "next/navigation";
import {
  getEffectiveAuthMode,
  signInStaff,
  startMockStaffSession,
} from "@/lib/auth/session";

export type LoginState = { error?: string };

export async function loginAction(
  _state: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const intent = String(formData.get("intent") ?? "login");
  if (intent === "mock" && getEffectiveAuthMode() === "mock") {
    await startMockStaffSession();
    redirect("/portal");
  }
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Vui lòng nhập email và mật khẩu." };
  try {
    await signInStaff(email, password);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Không thể đăng nhập.",
    };
  }
  redirect("/portal");
}
