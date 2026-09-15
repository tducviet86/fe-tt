import { NextResponse } from "next/server";
import { z } from "zod";
import { authenticatedResponse } from "@/lib/auth/cookies";

const input = z.object({ email: z.email(), password: z.string().min(8).max(128) });
const output = z.object({ success: z.literal(true), data: z.object({ accessToken: z.string(), refreshToken: z.string(), expiresAt: z.string() }) });

export async function POST(request: Request) {
  const parsed = input.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ success: false, error: { code: "VALIDATION", message: "Thông tin đăng ký không hợp lệ" } }, { status: 400 });
  try {
    const upstream = await fetch(`${process.env.API_URL ?? "http://localhost:3000/api/v1"}/auth/register`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(parsed.data), cache: "no-store" });
    const body: unknown = await upstream.json();
    if (!upstream.ok) return NextResponse.json(body, { status: upstream.status });
    const result = output.safeParse(body);
    if (!result.success) return NextResponse.json({ success: false, error: { code: "INVALID_AUTH_RESPONSE", message: "Invalid authentication response" } }, { status: 502 });
    return authenticatedResponse(result.data.data);
  } catch {
    return NextResponse.json({ success: false, error: { code: "BACKEND_UNAVAILABLE", message: "Authentication service unavailable" } }, { status: 503 });
  }
}
