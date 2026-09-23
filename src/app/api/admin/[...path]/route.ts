import { cookies } from "next/headers";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
async function forward(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const allowed = new Set([
    "session",
    "dashboard",
    "bookings",
    "quote",
    "customers",
    "units",
    "amenities",
    "properties",
    "locations",
    "calendar",
    "blocks",
    "payments",
    "staff",
    "roles",
    "audit",
  ]);
  if (
    !allowed.has(path[0]) ||
    path.some((segment) => !/^[a-zA-Z0-9-]+$/.test(segment))
  )
    return NextResponse.json(
      { error: { message: "Không tìm thấy chức năng." } },
      { status: 404 },
    );
  if (
    request.method !== "GET" &&
    request.headers.get("origin") !== new URL(request.url).origin
  )
    return NextResponse.json(
      { error: { message: "Yêu cầu không hợp lệ." } },
      { status: 403 },
    );
  const token = (await cookies()).get("admin_access_token")?.value;
  if (!token)
    return NextResponse.json(
      { error: { message: "Vui lòng đăng nhập lại." } },
      { status: 401 },
    );
  try {
    const upstream = await fetch(
      `${process.env.API_URL ?? "http://localhost:3000/api/v1"}/admin/${path.join("/")}`,
      {
        method: request.method,
        headers: {
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: ["POST", "PATCH"].includes(request.method)
          ? await request.text()
          : undefined,
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
      },
    );
    return new NextResponse(await upstream.text(), {
      status: upstream.status,
      headers: {
        "content-type": "application/json",
        "cache-control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { error: { message: "Không kết nối được máy chủ. Vui lòng thử lại." } },
      { status: 503 },
    );
  }
}
export { forward as GET, forward as POST, forward as PATCH, forward as DELETE };
