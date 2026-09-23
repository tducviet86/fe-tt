import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

const input = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  phone: z.string().trim().min(8),
  nationality: z.string().trim().optional(),
});
export async function PATCH(request: Request) {
  const token = (await cookies()).get("customer_access_token")?.value;
  if (!token)
    return NextResponse.json(
      {
        success: false,
        error: { code: "UNAUTHENTICATED", message: "Login required" },
      },
      { status: 401 },
    );
  const parsed = input.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json(
      {
        success: false,
        error: { code: "VALIDATION", message: "Thông tin hồ sơ không hợp lệ" },
      },
      { status: 400 },
    );
  try {
    const upstream = await fetch(
      `${process.env.API_URL ?? "http://localhost:3000/api/v1"}/auth/profile`,
      {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(parsed.data),
        cache: "no-store",
      },
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
