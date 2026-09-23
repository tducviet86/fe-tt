import { afterEach, describe, expect, it, vi } from "vitest";
import { authenticatedResponse } from "./cookies";
import { POST as adminLogin } from "../../app/api/admin/auth/login/route";
import { POST as adminLogout } from "../../app/api/admin/auth/logout/route";
import { POST as customerLogout } from "../../app/api/auth/logout/route";
const tokens = { accessToken: "signed-admin-token", refreshToken: "refresh", expiresAt: "2030-01-01T00:00:00Z" };
const request = () => new Request("http://localhost:3001/api/admin/auth/login", { method: "POST", headers: { origin: "http://localhost:3001", "content-type": "application/json" }, body: JSON.stringify({ email: "admin@example.test", password: "secure-password" }) });
afterEach(() => vi.unstubAllGlobals());
describe("Admin and customer sessions", () => {
  it("customer login only sets customer cookies", () => { const r = authenticatedResponse(tokens); expect(r.cookies.get("customer_access_token")?.value).toBe(tokens.accessToken); expect(r.cookies.get("admin_access_token")).toBeUndefined(); expect(r.cookies.get("access_token")).toBeUndefined(); });
  it("admin login validates permission before issuing isolated cookies", async () => { const fetch = vi.fn().mockResolvedValueOnce(Response.json({ data: tokens })).mockResolvedValueOnce(Response.json({ data: { permissions: ["booking.read"] } })); vi.stubGlobal("fetch", fetch); const r = await adminLogin(request()); expect(r.status).toBe(200); expect(r.cookies.get("admin_access_token")?.value).toBe(tokens.accessToken); expect(r.cookies.get("admin_refresh_token")?.path).toBe("/api/admin/auth"); expect(r.cookies.get("customer_access_token")).toBeUndefined(); expect(r.cookies.get("access_token")?.maxAge).toBe(0); expect(fetch.mock.calls[1][0]).toContain("/admin/session"); });
  it("a customer cannot obtain admin cookies", async () => { vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(Response.json({ data: tokens })).mockResolvedValueOnce(Response.json({}, { status: 403 }))); const r = await adminLogin(request()); expect(r.status).toBe(403); expect(r.cookies.get("admin_access_token")).toBeUndefined(); });
  it("admin logout does not remove customer cookies", async () => { const r = await adminLogout(request()); expect(r.cookies.get("admin_access_token")?.maxAge).toBe(0); expect(r.cookies.get("customer_access_token")).toBeUndefined(); });
  it("customer logout does not remove admin cookies", async () => { const r = await customerLogout(); expect(r.cookies.get("customer_access_token")?.maxAge).toBe(0); expect(r.cookies.get("admin_access_token")).toBeUndefined(); });
  it("cross-origin admin login is rejected", async () => { const r = await adminLogin(new Request("http://localhost:3001/api/admin/auth/login", { method: "POST", headers: { origin: "https://other.example" } })); expect(r.status).toBe(403); });
});
