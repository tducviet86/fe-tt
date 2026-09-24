import Link from "next/link";
import { CheckCircle2, ShieldAlert, XCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";

type Verification = {
  validSignature: boolean;
  success: boolean;
  bookingCode: string;
  responseCode: string;
  transactionNo: string;
};
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ locale }, incoming] = await Promise.all([params, searchParams]);
  if (!isLocale(locale)) notFound();
  const vi = locale === "vi";
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(incoming))
    if (key.startsWith("vnp_") && typeof value === "string")
      query.set(key, value);
  let verification: Verification | undefined;
  try {
    const response = await fetch(
      `${process.env.API_URL ?? "http://localhost:3000/api/v1"}/payments/vnpay/verify-return?${query}`,
      { cache: "no-store" },
    );
    const body = (await response.json()) as { data?: Verification };
    verification = body.data;
  } catch {
    verification = undefined;
  }
  const valid = verification?.validSignature === true,
    paid = verification?.success === true;
  return (
    <main className="grid min-h-screen place-items-center bg-[#263b50] px-4 py-12 text-[#26384b]">
      <section className="w-full max-w-xl rounded-xl border border-white/20 bg-[#ffffff] p-8 text-center shadow-[0_40px_120px_rgba(0,0,0,.4)] sm:p-11">
        <span
          className={`mx-auto grid size-20 place-items-center rounded-full ${paid ? "bg-emerald-100 text-emerald-700" : valid ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}
        >
          {paid ? (
            <CheckCircle2 size={38} />
          ) : valid ? (
            <ShieldAlert size={38} />
          ) : (
            <XCircle size={38} />
          )}
        </span>
        <p className="mt-6 text-[10px] font-bold uppercase tracking-[.22em] text-[#926b4f]">
          VNPay Sandbox
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold">
          {paid
            ? vi
              ? "Thanh toán thành công"
              : "Payment successful"
            : valid
              ? vi
                ? "Giao dịch chưa thành công"
                : "Payment was not completed"
              : vi
                ? "Không thể xác thực giao dịch"
                : "Unable to verify payment"}
        </h1>
        <p className="mt-4 text-sm leading-6 text-muted">
          {paid
            ? vi
              ? "VNPay đã ghi nhận giao dịch. Trạng thái booking sẽ được cập nhật qua IPN."
              : "VNPay recorded the transaction. Booking status will be updated through IPN."
            : vi
              ? `Mã phản hồi: ${verification?.responseCode || "—"}. Bạn có thể quay lại và thử thanh toán lần nữa.`
              : `Response code: ${verification?.responseCode || "—"}. You can return and try again.`}
        </p>
        {verification?.bookingCode && (
          <div className="mt-6 rounded-2xl bg-[#e9eef4] p-4 text-sm">
            <span className="text-muted">Booking</span>
            <b className="ml-2">{verification.bookingCode}</b>
            {verification.transactionNo && (
              <p className="mt-1 text-xs text-muted">
                VNPay: {verification.transactionNo}
              </p>
            )}
          </div>
        )}
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <Link
            href={`/${locale}`}
            className="rounded-full border border-black/10 px-5 py-3.5 font-bold"
          >
            {vi ? "Về trang chủ" : "Back home"}
          </Link>
          {verification?.bookingCode && (
            <Link
              href={`/${locale}/${vi ? "thanh-toan/vnpay" : "payment/vnpay"}?bookingCode=${encodeURIComponent(verification.bookingCode)}`}
              className="rounded-full bg-[#304f6e] px-5 py-3.5 font-bold text-white"
            >
              {paid
                ? vi
                  ? "Xem đơn"
                  : "View booking"
                : vi
                  ? "Thử lại"
                  : "Try again"}
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
