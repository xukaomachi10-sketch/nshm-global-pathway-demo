"use client";

import { useActionState } from "react";
import { LockKeyhole, LogIn } from "lucide-react";
import { loginAction, type LoginState } from "@/app/login/actions";

const initialState: LoginState = {};

export function LoginForm({ mockMode }: { mockMode: boolean }) {
  const [state, action, pending] = useActionState(loginAction, initialState);
  return (
    <form action={action} className="mt-6 space-y-4">
      {!mockMode && (
        <>
          <label className="block text-sm font-bold text-slate-700">
            Email nhân sự
            <input name="email" type="email" autoComplete="email" className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3" />
          </label>
          <label className="block text-sm font-bold text-slate-700">
            Mật khẩu
            <input name="password" type="password" autoComplete="current-password" className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3" />
          </label>
        </>
      )}
      {state.error && <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{state.error}</p>}
      <button
        name="intent"
        value={mockMode ? "mock" : "login"}
        disabled={pending}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#D21235] font-bold text-white disabled:opacity-50"
      >
        {mockMode ? <LockKeyhole className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
        {pending ? "Đang mở phiên..." : mockMode ? "Mở portal dữ liệu mock" : "Đăng nhập"}
      </button>
    </form>
  );
}
