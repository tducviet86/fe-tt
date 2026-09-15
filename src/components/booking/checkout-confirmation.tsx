"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Unit } from "@/lib/api/units";

type Checkout = { quoteId: string; publicCode: string; checkIn: string; checkOut: string; guests: number; nights: number; total: string; deposit: string; currency: string };
type Profile = { email: string; firstName: string; lastName: string; phone: string; profileComplete: boolean };
export function CheckoutConfirmation({ locale, unit, checkout }: { locale: "vi" | "en"; unit: Unit; checkout: Checkout }) {
  const vi = locale === "vi", router = useRouter();
  const [profile, setProfile] = useState<Profile>(), [loading, setLoading] = useState(false), [error, setError] = useState("");
  useEffect(() => { fetch("/api/auth/session", { cache: "no-store" }).then(async (response) => {
    if (response.status === 401) return router.replace(`/${locale}/${vi ? "dang-nhap" : "login"}?returnTo=${encodeURIComponent(location.pathname + location.search)}`);
    const body = (await response.json()) as { data?: Profile };
    if (!body.data?.profileComplete) return router.replace(`/${locale}/${vi ? "tai-khoan/ho-so" : "account/profile"}?returnTo=${encodeURIComponent(location.pathname + location.search)}`);
    setProfile(body.data);
  }).catch(() => setError(vi ? "Không thể kiểm tra tài khoản." : "Unable to check your account.")); }, [locale, router, vi]);
  async function confirm() {
    setLoading(true); setError("");
    const response = await fetch("/api/bookings", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ publicCode: checkout.publicCode, quoteId: checkout.quoteId, checkIn: checkout.checkIn, checkOut: checkout.checkOut, guestCount: checkout.guests, source: "WEBSITE" }) });
    const body = (await response.json()) as { data?: { bookingCode?: string }; error?: { message?: string } };
    if (!response.ok || !body.data?.bookingCode) { setError(body.error?.message ?? (vi ? "Không thể tạo đặt phòng." : "Unable to create booking.")); setLoading(false); return; }
    router.push(`/${locale}/${vi ? "thanh-toan/vnpay" : "payment/vnpay"}?bookingCode=${encodeURIComponent(body.data.bookingCode)}`);
  }
  const name = vi ? unit.nameVi : unit.nameEn, image = unit.media[0]?.media.url;
  const money = (value: string) => `${new Intl.NumberFormat(vi ? "vi-VN" : "en-US").format(Number(value))} ${checkout.currency}`;
  return <main className="min-h-screen bg-[#f3efe5] px-4 py-10 text-[#14241e]">
    <div className="mx-auto max-w-5xl"><p className="text-xs font-bold tracking-[.18em] text-[#173f34]">TT APARTMENT</p><h1 className="mt-5 font-display text-5xl font-semibold">{vi ? "Xác nhận đặt phòng" : "Review your booking"}</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="overflow-hidden rounded-[28px] border border-black/10 bg-[#fffdf8]">
          <div className="grid sm:grid-cols-[220px_1fr]">{image && <div className="relative min-h-52"><Image src={image} alt={name} fill className="object-cover" /></div>}<div className="p-6"><p className="text-xs font-bold uppercase tracking-wider text-[#a35331]">{unit.property.name}</p><h2 className="mt-2 font-display text-3xl font-semibold">{name}</h2><p className="mt-4 text-sm text-muted">{unit.property.address}</p></div></div>
          <div className="grid gap-px border-t bg-black/10 sm:grid-cols-3"><Summary label={vi ? "Nhận phòng" : "Check-in"} value={`${checkout.checkIn} · 14:00`} /><Summary label={vi ? "Trả phòng" : "Check-out"} value={`${checkout.checkOut} · 11:00`} /><Summary label={vi ? "Lưu trú" : "Stay"} value={`${checkout.nights} ${vi ? "đêm" : "nights"} · ${checkout.guests} ${vi ? "khách" : "guests"}`} /></div>
        </section>
        <aside className="rounded-[28px] border border-black/10 bg-[#fffdf8] p-6"><h2 className="font-display text-2xl font-semibold">{vi ? "Thông tin thanh toán" : "Payment summary"}</h2><div className="mt-5 space-y-3 text-sm"><div className="flex justify-between"><span>{vi ? "Tổng giá trị" : "Total"}</span><b>{money(checkout.total)}</b></div><div className="flex justify-between border-t pt-3"><span>{vi ? "Thanh toán VNPay" : "VNPay payment"}</span><b className="text-[#a35331]">{money(checkout.deposit)}</b></div></div>
          {profile && <div className="mt-6 rounded-2xl bg-[#eef2ed] p-4 text-sm"><b>{profile.lastName} {profile.firstName}</b><p className="mt-1 text-muted">{profile.phone} · {profile.email}</p></div>}
          {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button onClick={confirm} disabled={loading || !profile} className="mt-6 w-full rounded-full bg-[#173f34] px-5 py-4 font-bold text-white disabled:opacity-45">{loading ? (vi ? "Đang tạo đơn…" : "Creating booking…") : (vi ? "Xác nhận và đến VNPay" : "Confirm and continue to VNPay")}</button>
        </aside>
      </div>
    </div>
  </main>;
}
function Summary({ label, value }: { label: string; value: string }) { return <div className="bg-[#fffdf8] p-5"><p className="text-[10px] font-bold uppercase tracking-wider text-muted">{label}</p><b className="mt-2 block text-sm">{value}</b></div>; }
