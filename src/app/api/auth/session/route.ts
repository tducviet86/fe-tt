import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const token = (await cookies()).get("customer_access_token")?.value;
  if (!token)
    return NextResponse.json(
      {
        success: false,
        error: { code: "UNAUTHENTICATED", message: "Login required" },
      },
      { status: 401 },
    );
  try {
    const upstream = await fetch(
      `${process.env.API_URL ?? "http://localhost:3000/api/v1"}/auth/me`,
      { headers: { authorization: `Bearer ${token}` }, cache: "no-store" },
    );
    return new NextResponse(await upstream.text(), {
      status: upstream.status,
      headers: { "content-type": "application/json" },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "BACKEND_UNAVAILABLE",
          message: "Account service unavailable",
        },
      },
      { status: 503 },
    );
  }
}
