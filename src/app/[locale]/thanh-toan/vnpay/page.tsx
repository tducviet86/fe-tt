import { CalendarDays, CreditCard, UsersRound } from "lucide-react";
import { notFound } from "next/navigation";
import { z } from "zod";
import { apiGet } from "@/lib/api/client";
import { isLocale } from "@/lib/i18n/config";
import { VnpayButton } from "@/components/booking/vnpay-button";
import { BackButton } from "@/components/navigation/back-button";

const bookingSchema = z.object({
  bookingCode: z.string(),
  status: z.string(),
  checkIn: z.string(),
  checkOut: z.string(),
  guestCount: z.number(),
  currency: z.string(),
  total: z.coerce.string(),
  depositRequired: z.coerce.string(),
  paidAmount: z.coerce.string(),
  remainingAmount: z.coerce.string(),
  unit: z.object({
    publicCode: z.string(),
    nameVi: z.string(),
    nameEn: z.string(),
  }),
});
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ bookingCode?: string }>;
}) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  if (!isLocale(locale) || !query.bookingCode) notFound();
  const vi = locale === "vi";
  let booking: z.infer<typeof bookingSchema>;
  try {
    booking = await apiGet(
      `/bookings/${encodeURIComponent(query.bookingCode)}`,
      bookingSchema,
      { cache: "no-store" },
    );
  } catch {
    notFound();
  }
  const money = (value: string) =>
    `${new Intl.NumberFormat(vi ? "vi-VN" : "en-US").format(Number(value))} ${booking.currency}`;
  return (
    <main className="min-h-screen bg-[#f5f3ee] px-4 py-8 text-[#202522] sm:py-12">
      <div className="mx-auto max-w-4xl">
        <BackButton label={vi ? "Quay lại đơn đặt phòng" : "Back to booking"} />
        <div className="mt-6 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
          <header className="border-b border-black/8 px-6 py-5 sm:px-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-[#617068]">
                  {vi ? "Mã đặt phòng" : "Booking reference"} ·{" "}
                  {booking.bookingCode}
                </p>
                <h1 className="mt-1 text-2xl font-semibold">
                  {vi ? "Chọn cách thanh toán" : "Choose how to pay"}
                </h1>
              </div>
              <span className="rounded-lg bg-[#eef5f1] px-3 py-2 text-xs font-semibold text-[#304f6e]">
                VNPay Sandbox
              </span>
            </div>
          </header>
          <div className="grid lg:grid-cols-[320px_1fr]">
            <aside className="border-b border-black/8 bg-[#faf9f6] p-6 lg:border-b-0 lg:border-r sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#617068]">
                {vi ? "Thông tin lưu trú" : "Stay details"}
              </p>
              <h2 className="mt-3 text-xl font-semibold">
                {vi ? booking.unit.nameVi : booking.unit.nameEn}
              </h2>
              <div className="mt-6 space-y-5 text-sm">
                <div className="flex gap-3">
                  <CalendarDays className="mt-0.5 text-[#617068]" size={18} />
                  <div>
                    <p className="text-[#617068]">
                      {vi ? "Nhận và trả phòng" : "Check-in and check-out"}
                    </p>
                    <b>
                      {booking.checkIn.slice(0, 10)} →{" "}
                      {booking.checkOut.slice(0, 10)}
                    </b>
                  </div>
                </div>
                <div className="flex gap-3">
                  <UsersRound className="mt-0.5 text-[#617068]" size={18} />
                  <div>
                    <p className="text-[#617068]">
                      {vi ? "Số khách" : "Guests"}
                    </p>
                    <b>{booking.guestCount}</b>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CreditCard className="mt-0.5 text-[#617068]" size={18} />
                  <div>
                    <p className="text-[#617068]">
                      {vi ? "Thanh toán đặt cọc" : "Deposit due"}
                    </p>
                    <b className="text-base text-[#926b4f]">
                      {money(booking.depositRequired)}
                    </b>
                  </div>
                </div>
              </div>
            </aside>
            <section className="p-6 sm:p-8">
              <p className="text-sm leading-6 text-[#617068]">
                {vi
                  ? "Chọn một phương thức bên dưới. Bạn sẽ được chuyển sang cổng VNPay để hoàn tất giao dịch."
                  : "Choose a method below. You will continue to VNPay to complete the transaction."}
              </p>
              <VnpayButton bookingCode={booking.bookingCode} locale={locale} />
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
