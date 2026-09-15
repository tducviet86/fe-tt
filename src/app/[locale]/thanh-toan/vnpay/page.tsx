import Link from "next/link";
import { CheckCircle2, CreditCard, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";
import { z } from "zod";
import { apiGet } from "@/lib/api/client";
import { isLocale } from "@/lib/i18n/config";

const bookingSchema = z.object({ bookingCode: z.string(), status: z.string(), checkIn: z.string(), checkOut: z.string(), guestCount: z.number(), currency: z.string(), total: z.coerce.string(), depositRequired: z.coerce.string(), paidAmount: z.coerce.string(), remainingAmount: z.coerce.string(), unit: z.object({ publicCode: z.string(), nameVi: z.string(), nameEn: z.string() }) });
export default async function Page({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ bookingCode?: string }> }) {
  const [{ locale }, query] = await Promise.all([params, searchParams]); if (!isLocale(locale) || !query.bookingCode) notFound();
  const vi = locale === "vi"; let booking: z.infer<typeof bookingSchema>; try { booking = await apiGet(`/bookings/${encodeURIComponent(query.bookingCode)}`, bookingSchema, { cache: "no-store" }); } catch { notFound(); }
  const money = (value: string) => `${new Intl.NumberFormat(vi ? "vi-VN" : "en-US").format(Number(value))} ${booking.currency}`;
  return <main className="grid min-h-screen place-items-center bg-[#f3efe5] px-4 py-12 text-[#14241e]"><section className="w-full max-w-2xl rounded-[32px] border border-black/10 bg-[#fffdf8] p-7 shadow-[0_24px_80px_rgba(25,43,35,.13)] sm:p-10">
    <div className="flex items-center justify-between gap-4"><span className="grid size-14 place-items-center rounded-full bg-[#e5eee8] text-[#173f34]"><CreditCard /></span><span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-800">{vi ? "Chờ kích hoạt VNPay" : "VNPay setup pending"}</span></div>
    <h1 className="mt-6 font-display text-5xl font-semibold">{vi ? "Thanh toán VNPay" : "VNPay payment"}</h1><p className="mt-3 text-sm leading-6 text-muted">{vi ? "Đơn đặt phòng đã được tạo. Cổng thanh toán sẽ hoạt động sau khi cấu hình thông tin VNPay." : "Your booking has been created. Payment will become available after VNPay credentials are configured."}</p>
    <div className="mt-7 rounded-2xl border border-black/8 bg-white p-5"><div className="flex items-center gap-2 text-[#173f34]"><CheckCircle2 size={18} /><b>{booking.bookingCode}</b></div><h2 className="mt-3 font-display text-2xl">{vi ? booking.unit.nameVi : booking.unit.nameEn}</h2><div className="mt-4 grid gap-3 text-sm sm:grid-cols-2"><p><span className="text-muted">{vi ? "Nhận phòng:" : "Check-in:"}</span> <b>{booking.checkIn.slice(0, 10)} · 14:00</b></p><p><span className="text-muted">{vi ? "Trả phòng:" : "Check-out:"}</span> <b>{booking.checkOut.slice(0, 10)} · 11:00</b></p><p><span className="text-muted">{vi ? "Số khách:" : "Guests:"}</span> <b>{booking.guestCount}</b></p><p><span className="text-muted">{vi ? "Đặt cọc VNPay:" : "VNPay deposit:"}</span> <b>{money(booking.depositRequired)}</b></p></div></div>
    <button disabled className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#173f34] px-5 py-4 font-bold text-white opacity-45"><ShieldCheck size={18} />{vi ? "Thanh toán qua VNPay — chưa kích hoạt" : "Pay with VNPay — not activated"}</button>
    <Link href={`/${locale}`} className="mt-5 block text-center text-sm font-bold text-[#a35331]">{vi ? "Về trang chủ" : "Back to home"}</Link>
  </section></main>;
}
