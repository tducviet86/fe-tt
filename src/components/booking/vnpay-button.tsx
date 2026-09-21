"use client";
import {
  CreditCard,
  Landmark,
  LayoutGrid,
  LoaderCircle,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

type BankCode = "ALL" | "VNPAYQR" | "VNBANK" | "INTCARD";

export function VnpayButton({
  bookingCode,
  locale,
}: {
  bookingCode: string;
  locale: "vi" | "en";
}) {
  const vi = locale === "vi";
  const [loading, setLoading] = useState(false),
    [error, setError] = useState("");
  const [bankCode, setBankCode] = useState<BankCode>("ALL");
  const methods = [
    {
      code: "ALL" as const,
      icon: LayoutGrid,
      title: vi ? "Tất cả phương thức" : "All methods",
      note: vi ? "Chọn tại cổng VNPay" : "Choose on VNPay",
    },
    {
      code: "VNPAYQR" as const,
      icon: QrCode,
      title: "VNPAY-QR",
      note: vi ? "Quét mã bằng ứng dụng ngân hàng" : "Scan with a banking app",
    },
    {
      code: "VNBANK" as const,
      icon: Landmark,
      title: vi ? "Thẻ nội địa" : "Domestic card",
      note: vi ? "ATM và tài khoản ngân hàng" : "ATM and bank account",
    },
    {
      code: "INTCARD" as const,
      icon: CreditCard,
      title: vi ? "Thẻ quốc tế" : "International card",
      note: "Visa, Mastercard, JCB",
    },
  ];
  async function pay() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/payments/vnpay/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          bookingCode,
          locale: vi ? "vn" : "en",
          bankCode: bankCode === "ALL" ? undefined : bankCode,
        }),
      });
      const body = (await response.json()) as {
        data?: { paymentUrl?: string };
        error?: { message?: string };
      };
      if (!response.ok || !body.data?.paymentUrl)
        throw new Error(body.error?.message ?? "Unable to create payment URL");
      window.location.assign(body.data.paymentUrl);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Payment unavailable",
      );
      setLoading(false);
    }
  }
  return (
    <>
      <fieldset className="mt-6">
        <legend className="mb-3 text-sm font-bold">
          {vi ? "Chọn phương thức thanh toán" : "Choose a payment method"}
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {methods.map(({ code, icon: Icon, title, note }) => (
            <button
              key={code}
              type="button"
              disabled={loading}
              onClick={() => setBankCode(code)}
              className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${bankCode === code ? "border-[#173f34] bg-[#e8f0eb] ring-1 ring-[#173f34]" : "border-black/10 bg-white hover:border-[#173f34]/40"}`}
            >
              <span
                className={`grid size-10 shrink-0 place-items-center rounded-xl ${bankCode === code ? "bg-[#173f34] text-white" : "bg-[#f3efe5] text-[#173f34]"}`}
              >
                <Icon size={19} />
              </span>
              <span>
                <b className="block text-sm">{title}</b>
                <span className="text-xs text-muted">{note}</span>
              </span>
            </button>
          ))}
        </div>
      </fieldset>
      <button
        type="button"
        onClick={pay}
        disabled={loading}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#173f34] px-5 py-4 font-bold text-white shadow-[0_14px_35px_rgba(23,63,52,.25)] transition hover:-translate-y-0.5 hover:bg-[#0e3026] disabled:opacity-50"
      >
        {loading ? (
          <>
            <LoaderCircle size={18} className="animate-spin" />
            {vi ? "Đang kết nối VNPay…" : "Connecting to VNPay…"}
          </>
        ) : (
          <>
            <CreditCard size={18} />
            {vi ? "Tiếp tục thanh toán" : "Continue to payment"}
          </>
        )}
      </button>
      {error && (
        <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <p className="mt-3 flex items-center justify-center gap-2 text-xs text-muted">
        <ShieldCheck size={14} />
        {vi
          ? "Bạn sẽ được chuyển tới VNPay Sandbox"
          : "You will be redirected to VNPay Sandbox"}
      </p>
    </>
  );
}
