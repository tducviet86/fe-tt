import { NextResponse } from "next/server";
import { z } from "zod";
const input = z.object({ email: z.email(), password: z.string().min(8) });
export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) return NextResponse.json({ error: { message: "Yêu cầu không hợp lệ." } }, { status: 403 });
  const parsed = input.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: { message: "Kiểm tra email và mật khẩu." } }, { status: 400 });
  const base = process.env.API_URL ?? "http://localhost:3000/api/v1";
  try {
    const upstream = await fetch(`${base}/auth/login`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(parsed.data), cache: "no-store", signal: AbortSignal.timeout(15000) });
    if (!upstream.ok) return NextResponse.json({ error: { message: "Email hoặc mật khẩu không đúng." } }, { status: upstream.status });
    const result = await upstream.json();
    const tokens = z.object({ accessToken: z.string(), refreshToken: z.string(), expiresAt: z.string() }).parse(result.data);
    const session = await fetch(`${base}/admin/session`, { headers: { authorization: `Bearer ${tokens.accessToken}` }, cache: "no-store", signal: AbortSignal.timeout(15000) });
    if (!session.ok) return NextResponse.json({ error: { message: "Tài khoản chưa được cấp quyền quản trị." } }, { status: 403 });
    const response = NextResponse.json({ success: true, data: { authenticated: true } });
    response.cookies.set("admin_access_token", tokens.accessToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 900 });
    response.cookies.set("admin_refresh_token", tokens.refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/api/admin/auth", expires: new Date(tokens.expiresAt) });
    // Retire the old shared cookies, without changing the customer's new session.
    response.cookies.set("access_token", "", { path: "/", maxAge: 0 });
    response.cookies.set("refresh_token", "", { path: "/api/auth", maxAge: 0 });
    return response;
  } catch { return NextResponse.json({ error: { message: "Không kết nối được dịch vụ đăng nhập." } }, { status: 503 }); }
}
