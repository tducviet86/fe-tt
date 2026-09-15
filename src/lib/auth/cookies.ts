import { NextResponse } from "next/server";

export type AuthTokens = { accessToken: string; refreshToken: string; expiresAt: string };

export function authenticatedResponse(tokens: AuthTokens) {
  const response = NextResponse.json({ success: true, data: { authenticated: true } });
  response.cookies.set("access_token", tokens.accessToken, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 15 * 60 });
  response.cookies.set("refresh_token", tokens.refreshToken, { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/api/auth", expires: new Date(tokens.expiresAt) });
  return response;
}
