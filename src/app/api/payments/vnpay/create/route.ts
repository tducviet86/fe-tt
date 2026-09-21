import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

const input = z.object({
  bookingCode: z.string().min(1),
  locale: z.enum(["vn", "en"]),
  bankCode: z.enum(["VNPAYQR", "VNBANK", "INTCARD"]).optional(),
});
export async function POST(request: Request) {
  const token = (await cookies()).get("access_token")?.value;
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
        error: { code: "VALIDATION", message: "Invalid payment request" },
      },
      { status: 400 },
    );
  try {
    const upstream = await fetch(
      `${process.env.API_URL ?? "http://localhost:3000/api/v1"}/payments/vnpay/create`,
      {
        method: "POST",
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
          message: "Payment service unavailable",
        },
      },
      { status: 503 },
    );
  }
}
