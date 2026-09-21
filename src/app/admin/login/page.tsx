"use client";
import Link from "next/link";
import { useState } from "react";
import { LockKeyhole, ArrowRight, ShieldCheck } from "lucide-react";
import { adminApi } from "@/components/admin/admin-types";
import { Fields } from "@/components/admin/admin-ui";
export default function Login() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <div className="admin-login-card">
      <div className="admin-login-visual">
        <span>TT APARTMENT ↗</span>
        <div>
          <h2>
            Chăm chút từng
            <br />
            kỳ nghỉ.
          </h2>
          <p>
            Không gian làm việc dành cho đội ngũ TT Apartment.
            <br />
            Quản lý đặt phòng, chăm sóc khách hàng và vận hành mỗi ngày.
          </p>
        </div>
        <small>A BETTER STAY, EVERY DAY.</small>
      </div>
      <div className="admin-login-form">
        <ShieldCheck size={28} className="text-forest" />
        <h1>Chào mừng trở lại.</h1>
        <p>Đăng nhập bằng tài khoản quản trị hoặc nhân viên được cấp quyền.</p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (loading) return;
            setLoading(true);
            setError("");
            const f = new FormData(e.currentTarget);
            try {
              const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                  email: f.get("email"),
                  password: f.get("password"),
                }),
              });
              if (!response.ok)
                throw new Error(
                  response.status >= 500
                    ? "Máy chủ chưa sẵn sàng. Vui lòng thử lại."
                    : "Email hoặc mật khẩu không đúng.",
                );
              const session = await adminApi<{ permissions: string[] }>(
                "session",
              );
              const destinations = [
                ["report.read", "/admin"],
                ["booking.read", "/admin/bookings"],
                ["availability.read", "/admin/calendar"],
                ["customer.read", "/admin/customers"],
                ["unit.read", "/admin/apartments"],
                ["payment.read", "/admin/payments"],
                ["staff.manage", "/admin/staff"],
                ["property.read", "/admin/properties"],
              ];
              const destination = destinations.find(([p]) =>
                session.permissions.includes(p),
              );
              if (!destination)
                throw new Error(
                  "Tài khoản chưa được cấp quyền truy cập các chức năng quản trị.",
                );
              location.assign(destination[1]);
            } catch (e) {
              setError((e as Error).message);
              setLoading(false);
            }
          }}
        >
          <Fields
            fields={[
              { name: "email", label: "Địa chỉ email", type: "email" },
              {
                name: "password",
                label: "Mật khẩu",
                type: "password",
                minLength: 8,
              },
            ]}
          />
          {error && (
            <p role="alert" className="admin-error">
              {error}
            </p>
          )}
          <button className="admin-button" disabled={loading}>
            <LockKeyhole size={15} />
            {loading ? "Đang xác thực…" : "Đăng nhập quản trị"}
            <ArrowRight size={15} />
          </button>
        </form>
        <Link href="/vi">← Quay lại website</Link>
      </div>
    </div>
  );
}
