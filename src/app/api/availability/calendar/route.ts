import { NextResponse } from "next/server";
import { z } from "zod";

const input = z.object({
  publicCode: z.string().min(1),
  from: z.iso.date(),
  to: z.iso.date(),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = input.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION", message: "Invalid availability request" } },
      { status: 400 },
    );
  }
  try {
    const query = new URLSearchParams(parsed.data);
    const response = await fetch(
      `${process.env.API_URL ?? "http://localhost:3000/api/v1"}/availability/calendar?${query}`,
      { cache: "no-store" },
    );
    return new NextResponse(await response.text(), {
      status: response.status,
      headers: { "content-type": "application/json" },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "BACKEND_UNAVAILABLE", message: "Availability service is temporarily unavailable" } },
      { status: 503 },
    );
  }
}
