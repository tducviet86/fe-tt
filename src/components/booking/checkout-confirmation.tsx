"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Unit } from "@/lib/api/units";
import { BackButton } from "@/components/navigation/back-button";

type Checkout = {
  quoteId: string;
  publicCode: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  total: string;
  deposit: string;
  currency: string;
};
type Profile = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  profileComplete: boolean;
};
export function CheckoutConfirmation({
  locale,
  unit,
  checkout,
}: {
  locale: "vi" | "en";
  unit: Unit;
  checkout: Checkout;
}) {
  const vi = locale === "vi",
    router = useRouter();
  const [profile, setProfile] = useState<Profile>(),
    [loading, setLoading] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    fetch("/api/auth/session", { cache: "no-store" })
      .then(async (response) => {
        if (response.status === 401)
          return router.replace(
            `/${locale}/${vi ? "dang-nhap" : "login"}?returnTo=${encodeURIComponent(location.pathname + location.search)}`,
          );
        const body = (await response.json()) as { data?: Profile };
        if (!body.data?.profileComplete)
          return router.replace(
            `/${locale}/${vi ? "tai-khoan/ho-so" : "account/profile"}?returnTo=${encodeURIComponent(location.pathname + location.search)}`,
          );
        setProfile(body.data);
      })
      .catch(() =>
        setError(
          vi
            ? "Không thể kiểm tra tài khoản."
            : "Unable to check your account.",
        ),
      );
  }, [locale, router, vi]);
  async function confirm() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          publicCode: checkout.publicCode,
          quoteId: checkout.quoteId,
          checkIn: checkout.checkIn,
          checkOut: checkout.checkOut,
          guestCount: checkout.guests,
          source: "WEBSITE",
        }),
      });
      const body = (await response.json()) as {
        data?: { bookingCode?: string };
        error?: { message?: string };
      };
      if (!response.ok || !body.data?.bookingCode) {
        setError(
          body.error?.message ??
            (vi ? "Không thể tạo đặt phòng." : "Unable to create booking."),
        );
        setLoading(false);
        return;
      }
      router.push(
        `/${locale}/${vi ? "thanh-toan/vnpay" : "payment/vnpay"}?bookingCode=${encodeURIComponent(body.data.bookingCode)}`,
      );
    } catch {
      setError(
        vi
          ? "Kết nối bị gián đoạn. Vui lòng thử lại."
          : "Connection interrupted. Please try again.",
      );
      setLoading(false);
    }
  }
  const name = vi ? unit.nameVi : unit.nameEn,
    image = unit.media[0]?.media.url;
  const money = (value: string) =>
    `${new Intl.NumberFormat(vi ? "vi-VN" : "en-US").format(Number(value))} ${checkout.currency}`;
  return (
    <main className="min-h-screen bg-[#f8f9fb] px-4 py-10 text-[#26384b]">
      <div className="mx-auto max-w-5xl">
        <BackButton label={vi ? "Quay lại căn hộ" : "Back to apartment"} />
        <p className="mt-8 text-xs font-bold tracking-[.18em] text-[#304f6e]">
          ABC APARTMENT
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
          {vi ? "Kiểm tra thông tin đặt phòng" : "Review your booking"}
        </h1>
        <p className="mt-3 text-sm text-muted">
          {vi
            ? "Vui lòng kiểm tra ngày ở và số tiền đặt cọc trước khi tiếp tục."
            : "Check your stay dates and deposit before continuing."}
        </p>
        <div className="customer-booking-steps">
          <span>01 · {vi ? "Chọn căn" : "Choose stay"}</span>
          <span className="active">
            02 · {vi ? "Kiểm tra thông tin" : "Review details"}
          </span>
          <span>03 · {vi ? "Thanh toán" : "Payment"}</span>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="overflow-hidden rounded-xl border border-black/10 bg-[#ffffff]">
            <div className="grid sm:grid-cols-[220px_1fr]">
              {image && (
                <div className="relative min-h-52">
                  <Image src={image} alt={name} fill className="object-cover" />
                </div>
              )}
              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-[#926b4f]">
                  {unit.property.name}
                </p>
                <h2 className="mt-2 font-display text-3xl font-semibold">
                  {name}
                </h2>
                <p className="mt-4 text-sm text-muted">
                  {unit.property.address}
                </p>
              </div>
            </div>
            <div className="grid gap-px border-t bg-black/10 sm:grid-cols-3">
              <Summary
                label={vi ? "Nhận phòng" : "Check-in"}
                value={`${checkout.checkIn} · 14:00`}
              />
              <Summary
                label={vi ? "Trả phòng" : "Check-out"}
                value={`${checkout.checkOut} · 11:00`}
              />
              <Summary
                label={vi ? "Lưu trú" : "Stay"}
                value={`${checkout.nights} ${vi ? "đêm" : "nights"} · ${checkout.guests} ${vi ? "khách" : "guests"}`}
              />
            </div>
          </section>
          <aside className="rounded-xl border border-black/10 bg-[#ffffff] p-6">
            <h2 className="font-display text-2xl font-semibold">
              {vi ? "Thông tin thanh toán" : "Payment summary"}
            </h2>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span>{vi ? "Tổng giá trị" : "Total"}</span>
                <b>{money(checkout.total)}</b>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span>{vi ? "Thanh toán VNPay" : "VNPay payment"}</span>
                <b className="text-[#926b4f]">{money(checkout.deposit)}</b>
              </div>
            </div>
            {profile && (
              <div className="mt-6 rounded-2xl bg-[#e9eef4] p-4 text-sm">
                <b>
                  {profile.lastName} {profile.firstName}
                </b>
                <p className="mt-1 text-muted">
                  {profile.phone} · {profile.email}
                </p>
              </div>
            )}
            {error && (
              <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}
            <button
              onClick={confirm}
              disabled={loading || !profile}
              className="mt-6 w-full rounded-xl bg-[#304f6e] px-5 py-3.5 font-bold text-white transition hover:bg-[#0e3026] disabled:opacity-45"
            >
              {loading
                ? vi
                  ? "Đang tạo đơn…"
                  : "Creating booking…"
                : vi
                  ? "Xác nhận đặt phòng"
                  : "Confirm booking"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="mt-3 w-full py-2 text-sm font-semibold text-muted hover:text-[#26384b]"
            >
              {vi ? "Quay lại chỉnh sửa" : "Go back and edit"}
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}
function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#ffffff] p-5">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
        {label}
      </p>
      <b className="mt-2 block text-sm">{value}</b>
    </div>
  );
}
