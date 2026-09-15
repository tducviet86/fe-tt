import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
const input = z.object({
  publicCode: z.string().min(1),
  quoteId: z.uuid(),
  checkIn: z.iso.date(),
  checkOut: z.iso.date(),
  guestCount: z.number().int().min(1).max(50),
  source: z.literal("WEBSITE"),
});
export async function POST(request: Request) {
  const token = (await cookies()).get("access_token")?.value;
  if (!token) return NextResponse.json({ success: false, error: { code: "UNAUTHENTICATED", message: "Login required" } }, { status: 401 });
  const parsed = input.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION",
          message: "Invalid booking request",
          details: parsed.error.flatten(),
        },
      },
      { status: 400 },
    );
  try {
    const response = await fetch(
      `${process.env.API_URL ?? "http://localhost:3000/api/v1"}/bookings`,
      {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify(parsed.data),
        cache: "no-store",
      },
    );
    return new NextResponse(await response.text(), {
      status: response.status,
      headers: { "content-type": "application/json" },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "BACKEND_UNAVAILABLE",
          message: "Booking service is temporarily unavailable",
        },
      },
      { status: 503 },
    );
  }
}
