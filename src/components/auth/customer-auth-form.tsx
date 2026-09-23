"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export function CustomerAuthForm({
  locale,
  mode,
}: {
  locale: "vi" | "en";
  mode: "login" | "register";
}) {
  const vi = locale === "vi",
    router = useRouter(),
    params = useSearchParams(),
    registering = mode === "register";
  const [loading, setLoading] = useState(false),
    [error, setError] = useState(""),
    [showPassword, setShowPassword] = useState(false);
  const rawReturnTo = params.get("returnTo") ?? `/${locale}`;
  const returnTo =
    rawReturnTo.startsWith("/") && !rawReturnTo.startsWith("//")
      ? rawReturnTo
      : `/${locale}`;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    if (registering && form.get("password") !== form.get("confirmPassword")) {
      setError(vi ? "Mật khẩu xác nhận chưa khớp." : "Passwords do not match.");
      setLoading(false);
      return;
    }
    const payload = registering
      ? {
          email: form.get("email"),
          password: form.get("password"),
          firstName: form.get("firstName"),
          lastName: form.get("lastName"),
          phone: form.get("phone"),
          nationality: form.get("nationality"),
        }
      : { email: form.get("email"), password: form.get("password") };
    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await response.json()) as { error?: { message?: string } };
      if (!response.ok) {
        setError(
          body.error?.message ??
            (vi
              ? "Thông tin không hợp lệ hoặc email đã được sử dụng."
              : "Invalid details or email already in use."),
        );
        setLoading(false);
        return;
      }
      if (registering) router.replace(returnTo);
      else {
        const session = await fetch("/api/auth/session", { cache: "no-store" });
        const sessionBody = (await session.json()) as {
          data?: { profileComplete?: boolean };
        };
        router.replace(
          sessionBody.data?.profileComplete
            ? returnTo
            : `/${locale}/${vi ? "tai-khoan/ho-so" : "account/profile"}?returnTo=${encodeURIComponent(returnTo)}`,
        );
      }
      router.refresh();
    } catch {
      setError(
        vi
          ? "Không thể kết nối máy chủ. Vui lòng thử lại."
          : "Unable to connect. Please try again.",
      );
      setLoading(false);
    }
  }
  const otherPath =
    mode === "login"
      ? vi
        ? "dang-ky"
        : "register"
      : vi
        ? "dang-nhap"
        : "login";
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#071b15] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 size-[520px] rounded-full bg-[#d9784b]/25 blur-[110px]" />
        <div className="absolute -bottom-48 right-[-8%] size-[620px] rounded-full bg-[#50b88b]/20 blur-[130px]" />
        <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:34px_34px]" />
        {[12, 28, 47, 66, 82].map((left, index) => (
          <motion.i
            key={left}
            className="absolute size-1.5 rounded-full bg-[#f6c69e] shadow-[0_0_18px_5px_rgba(246,198,158,.55)]"
            style={{ left: `${left}%`, top: `${18 + (index % 3) * 27}%` }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.7, 1.4, 0.7],
              y: [0, -14, 0],
            }}
            transition={{
              duration: 2.5 + index * 0.4,
              repeat: Infinity,
              delay: index * 0.25,
            }}
          />
        ))}
      </div>
      <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-4 py-10 lg:grid-cols-[.9fr_1.1fr] lg:px-10">
        <motion.section
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden px-8 lg:block"
        >
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-3 text-sm font-bold tracking-[.18em]"
          >
            <span className="grid size-11 place-items-center rounded-full border border-white/25 bg-white/10">
              ABC
            </span>{" "}
            ABC APARTMENT
          </Link>
          <p className="mt-20 flex items-center gap-2 text-xs font-bold uppercase tracking-[.24em] text-[#efb282]">
            <Sparkles size={15} />{" "}
            {vi ? "Kỳ nghỉ bắt đầu từ đây" : "Your stay starts here"}
          </p>
          <h1 className="mt-5 max-w-xl font-display text-[clamp(3.8rem,6vw,6.8rem)] leading-[.85] tracking-[-.055em]">
            {registering ? (
              vi ? (
                <>
                  Chạm vào
                  <br />
                  <i className="font-normal text-[#efb282]">một kỳ nghỉ.</i>
                </>
              ) : (
                <>
                  Unlock your
                  <br />
                  <i className="font-normal text-[#efb282]">next escape.</i>
                </>
              )
            ) : vi ? (
              <>
                Trở lại nơi
                <br />
                <i className="font-normal text-[#efb282]">thuộc về bạn.</i>
              </>
            ) : (
              <>
                Welcome back
                <br />
                <i className="font-normal text-[#efb282]">to your stay.</i>
              </>
            )}
          </h1>
          <div className="mt-10 grid gap-4 text-sm text-white/65">
            {[
              vi ? "Giá trực tiếp minh bạch" : "Transparent direct rates",
              vi ? "Lịch trống cập nhật tức thì" : "Live availability",
              vi ? "Thông tin được bảo mật" : "Your details stay protected",
            ].map((text) => (
              <span key={text} className="flex items-center gap-3">
                <i className="grid size-7 place-items-center rounded-full bg-white/10 text-[#efb282]">
                  <Check size={14} />
                </i>
                {text}
              </span>
            ))}
          </div>
        </motion.section>
        <motion.section
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className={`mx-auto w-full rounded-[34px] border border-white/20 bg-white/[.96] p-6 text-[#14241e] shadow-[0_40px_120px_rgba(0,0,0,.38)] backdrop-blur-2xl sm:p-9 ${registering ? "max-w-2xl" : "max-w-lg"}`}
        >
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#a35331]">
                ABC Apartment ·{" "}
                {registering
                  ? vi
                    ? "Thành viên mới"
                    : "New member"
                  : vi
                    ? "Chào mừng trở lại"
                    : "Welcome back"}
              </p>
              <h2 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
                {registering
                  ? vi
                    ? "Tạo tài khoản"
                    : "Create account"
                  : vi
                    ? "Đăng nhập"
                    : "Sign in"}
              </h2>
            </div>
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#e5eee8] text-[#173f34]">
              <KeyRound />
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-muted">
            {registering
              ? vi
                ? "Một lần khai báo để đặt phòng nhanh hơn trong những lần sau."
                : "Tell us about you once for faster future bookings."
              : vi
                ? "Tiếp tục hành trình và quản lý kỳ lưu trú của bạn."
                : "Continue your journey and manage your stay."}
          </p>
          <form
            onSubmit={submit}
            className={`mt-7 grid gap-4 ${registering ? "sm:grid-cols-2" : ""}`}
          >
            {registering && (
              <>
                <AuthInput
                  name="lastName"
                  label={vi ? "Họ" : "Last name"}
                  autoComplete="family-name"
                />
                <AuthInput
                  name="firstName"
                  label={vi ? "Tên" : "First name"}
                  autoComplete="given-name"
                />
              </>
            )}
            <AuthInput
              name="email"
              label="Email"
              type="email"
              autoComplete="email"
              wide={registering}
            />
            {registering && (
              <>
                <AuthInput
                  name="phone"
                  label={vi ? "Số điện thoại" : "Phone"}
                  type="tel"
                  autoComplete="tel"
                  placeholder="+84 90 123 4567"
                />
                <AuthInput
                  name="nationality"
                  label={vi ? "Quốc tịch" : "Nationality"}
                  autoComplete="country-name"
                  required={false}
                />
              </>
            )}
            <PasswordInput
              name="password"
              label={vi ? "Mật khẩu" : "Password"}
              show={showPassword}
              toggle={() => setShowPassword((v) => !v)}
              autoComplete={registering ? "new-password" : "current-password"}
              wide={registering}
            />
            {registering && (
              <PasswordInput
                name="confirmPassword"
                label={vi ? "Xác nhận mật khẩu" : "Confirm password"}
                show={showPassword}
                toggle={() => setShowPassword((v) => !v)}
                autoComplete="new-password"
                wide
              />
            )}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                role="alert"
                className={`rounded-2xl bg-red-50 p-3.5 text-sm text-red-700 ${registering ? "sm:col-span-2" : ""}`}
              >
                {error}
              </motion.p>
            )}
            <button
              disabled={loading}
              className={`group flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#173f34] px-6 font-bold text-white shadow-[0_14px_35px_rgba(23,63,52,.25)] transition hover:-translate-y-0.5 hover:bg-[#0e3026] disabled:opacity-50 ${registering ? "sm:col-span-2" : ""}`}
            >
              {loading
                ? vi
                  ? "Đang xử lý…"
                  : "Please wait…"
                : registering
                  ? vi
                    ? "Tạo tài khoản và tiếp tục"
                    : "Create account and continue"
                  : vi
                    ? "Đăng nhập"
                    : "Sign in"}
              <ArrowRight
                size={17}
                className="transition group-hover:translate-x-1"
              />
            </button>
          </form>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted">
            <ShieldCheck size={15} />
            {vi
              ? "Dữ liệu được bảo vệ an toàn"
              : "Your information is protected"}
          </div>
          <p className="mt-5 text-center text-sm text-muted">
            {mode === "login"
              ? vi
                ? "Chưa có tài khoản?"
                : "No account yet?"
              : vi
                ? "Đã có tài khoản?"
                : "Already registered?"}{" "}
            <Link
              className="font-bold text-[#a35331] underline-offset-4 hover:underline"
              href={`/${locale}/${otherPath}?returnTo=${encodeURIComponent(returnTo)}`}
            >
              {mode === "login"
                ? vi
                  ? "Đăng ký ngay"
                  : "Register now"
                : vi
                  ? "Đăng nhập"
                  : "Sign in"}
            </Link>
          </p>
        </motion.section>
      </div>
    </main>
  );
}
function AuthInput({
  name,
  label,
  type = "text",
  autoComplete,
  placeholder,
  required = true,
  wide = false,
}: {
  name: string;
  label: string;
  type?: string;
  autoComplete: string;
  placeholder?: string;
  required?: boolean;
  wide?: boolean;
}) {
  return (
    <label className={`block text-sm font-bold ${wide ? "sm:col-span-2" : ""}`}>
      {label}
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 font-normal outline-none transition placeholder:text-black/25 focus:border-[#d9784b] focus:ring-4 focus:ring-[#d9784b]/10"
      />
    </label>
  );
}
function PasswordInput({
  name,
  label,
  show,
  toggle,
  autoComplete,
  wide = false,
}: {
  name: string;
  label: string;
  show: boolean;
  toggle: () => void;
  autoComplete: string;
  wide?: boolean;
}) {
  return (
    <label className={`block text-sm font-bold ${wide ? "sm:col-span-2" : ""}`}>
      {label}
      <span className="relative mt-2 block">
        <input
          name={name}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          minLength={8}
          required
          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 pr-12 font-normal outline-none transition focus:border-[#d9784b] focus:ring-4 focus:ring-[#d9784b]/10"
        />
        <button
          type="button"
          onClick={toggle}
          className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-black/5"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </span>
    </label>
  );
}
