"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { LockKeyhole } from "lucide-react";

export function CustomerAuthForm({ locale, mode }: { locale: "vi" | "en"; mode: "login" | "register" }) {
  const vi = locale === "vi", router = useRouter(), params = useSearchParams();
  const [loading, setLoading] = useState(false), [error, setError] = useState("");
  const rawReturnTo = params.get("returnTo") ?? `/${locale}`;
  const returnTo = rawReturnTo.startsWith("/") && !rawReturnTo.startsWith("//") ? rawReturnTo : `/${locale}`;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: form.get("email"), password: form.get("password") }) });
    if (!response.ok) { setError(vi ? "Thông tin không hợp lệ hoặc email đã được sử dụng." : "Invalid details or email already in use."); setLoading(false); return; }
    if (mode === "register") router.replace(`/${locale}/${vi ? "tai-khoan/ho-so" : "account/profile"}?returnTo=${encodeURIComponent(returnTo)}`);
    else {
      const session = await fetch("/api/auth/session", { cache: "no-store" });
      const body = (await session.json()) as { data?: { profileComplete?: boolean } };
      router.replace(body.data?.profileComplete ? returnTo : `/${locale}/${vi ? "tai-khoan/ho-so" : "account/profile"}?returnTo=${encodeURIComponent(returnTo)}`);
    }
    router.refresh();
  }
  const otherPath = mode === "login" ? (vi ? "dang-ky" : "register") : (vi ? "dang-nhap" : "login");
  return <main className="grid min-h-screen place-items-center bg-[#f3efe5] px-4 py-12 text-[#14241e]">
    <section className="w-full max-w-md rounded-[30px] border border-black/10 bg-[#fffdf8] p-7 shadow-[0_24px_80px_rgba(25,43,35,.13)] sm:p-9">
      <Link href={`/${locale}`} className="text-xs font-bold tracking-[.18em] text-[#173f34]">TT APARTMENT</Link>
      <span className="mt-8 grid size-12 place-items-center rounded-full bg-[#e5eee8] text-[#173f34]"><LockKeyhole /></span>
      <h1 className="mt-5 font-display text-4xl font-semibold">{mode === "login" ? (vi ? "Đăng nhập" : "Sign in") : (vi ? "Tạo tài khoản" : "Create account")}</h1>
      <p className="mt-2 text-sm leading-6 text-muted">{vi ? "Tiếp tục kỳ nghỉ của bạn tại TT Apartment." : "Continue your stay with TT Apartment."}</p>
      <form onSubmit={submit} className="mt-7 space-y-4">
        <AuthInput name="email" label="Email" type="email" autoComplete="email" />
        <AuthInput name="password" label={vi ? "Mật khẩu" : "Password"} type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} />
        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button disabled={loading} className="w-full rounded-full bg-[#173f34] px-5 py-3.5 font-bold text-white disabled:opacity-50">{loading ? (vi ? "Đang xử lý…" : "Please wait…") : mode === "login" ? (vi ? "Đăng nhập" : "Sign in") : (vi ? "Đăng ký" : "Register")}</button>
      </form>
      <p className="mt-5 text-center text-sm text-muted">{mode === "login" ? (vi ? "Chưa có tài khoản?" : "No account yet?") : (vi ? "Đã có tài khoản?" : "Already registered?")} <Link className="font-bold text-[#a35331]" href={`/${locale}/${otherPath}?returnTo=${encodeURIComponent(returnTo)}`}>{mode === "login" ? (vi ? "Đăng ký" : "Register") : (vi ? "Đăng nhập" : "Sign in")}</Link></p>
    </section>
  </main>;
}
function AuthInput({ name, label, type, autoComplete }: { name: string; label: string; type: string; autoComplete: string }) {
  return <label className="block text-sm font-bold">{label}<input name={name} type={type} autoComplete={autoComplete} minLength={type === "password" ? 8 : undefined} required className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 font-normal outline-none focus:border-[#173f34]" /></label>;
}
