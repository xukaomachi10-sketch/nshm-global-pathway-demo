import { NextResponse } from "next/server";
import { clearStaffSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  await clearStaffSession();
  return NextResponse.redirect(new URL("/login", request.url), 303);
}
