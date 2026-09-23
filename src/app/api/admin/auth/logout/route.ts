import { NextResponse } from "next/server";
export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) return NextResponse.json({ success: false }, { status: 403 });
  const response = NextResponse.json({ success: true });
  response.cookies.set("admin_access_token", "", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
  response.cookies.set("admin_refresh_token", "", { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/api/admin/auth", maxAge: 0 });
  return response;
}
