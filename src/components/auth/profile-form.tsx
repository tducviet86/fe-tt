"use client";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowLeft,
  CheckCircle2,
  CircleUserRound,
  RefreshCw,
  Save,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

type Profile = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  nationality: string;
  profileComplete: boolean;
};
export function ProfileForm({ locale }: { locale: "vi" | "en" }) {
  const vi = locale === "vi",
    router = useRouter(),
    params = useSearchParams();
  const [profile, setProfile] = useState<Profile>(),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [saving, setSaving] = useState(false);
  const rawReturnTo = params.get("returnTo") ?? `/${locale}`;
  const returnTo =
    rawReturnTo.startsWith("/") && !rawReturnTo.startsWith("//")
      ? rawReturnTo
      : `/${locale}`;
  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/session", { cache: "no-store" });
      if (response.status === 401) {
        router.replace(
          `/${locale}/${vi ? "dang-nhap" : "login"}?returnTo=${encodeURIComponent(returnTo)}`,
        );
        return;
      }
      const body = (await response.json()) as {
        data?: Profile;
        error?: { message?: string };
      };
      if (!response.ok || !body.data)
        throw new Error(body.error?.message ?? "Profile unavailable");
      setProfile(body.data);
    } catch {
      setError(
        vi
          ? "Không thể tải thông tin cá nhân. Hãy kiểm tra backend và cơ sở dữ liệu rồi thử lại."
          : "Unable to load your profile. Check the backend and database, then try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [locale, returnTo, router, vi]);
  useEffect(() => {
    fetch("/api/auth/session", { cache: "no-store" })
      .then(async (response) => {
        if (response.status === 401) {
          router.replace(
            `/${locale}/${vi ? "dang-nhap" : "login"}?returnTo=${encodeURIComponent(returnTo)}`,
          );
          return;
        }
        const body = (await response.json()) as {
          data?: Profile;
          error?: { message?: string };
        };
        if (!response.ok || !body.data)
          throw new Error(body.error?.message ?? "Profile unavailable");
        setProfile(body.data);
        setLoading(false);
      })
      .catch(() => {
        setError(
          vi
            ? "Không thể tải thông tin cá nhân. Hãy kiểm tra backend và cơ sở dữ liệu rồi thử lại."
            : "Unable to load your profile. Check the backend and database, then try again.",
        );
        setLoading(false);
      });
  }, [locale, returnTo, router, vi]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          firstName: form.get("firstName"),
          lastName: form.get("lastName"),
          phone: form.get("phone"),
          nationality: form.get("nationality"),
        }),
      });
      const body = (await response.json()) as { error?: { message?: string } };
      if (!response.ok) throw new Error(body.error?.message ?? "Save failed");
      router.replace(returnTo);
      router.refresh();
    } catch {
      setError(
        vi
          ? "Không thể lưu hồ sơ. Vui lòng kiểm tra lại thông tin."
          : "Unable to save your profile. Please check your details.",
      );
      setSaving(false);
    }
  }
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#071b15] px-4 py-10 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-20 size-[520px] rounded-full bg-[#d9784b]/20 blur-[120px]" />
        <div className="absolute -right-48 bottom-[-20%] size-[650px] rounded-full bg-[#50b88b]/20 blur-[140px]" />
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:36px_36px]" />
      </div>
      <div className="relative mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-3 text-sm font-bold tracking-[.16em]"
          >
            <span className="grid size-10 place-items-center rounded-full border border-white/25 bg-white/10">
              TT
            </span>{" "}
            TT APARTMENT
          </Link>
          <Link
            href={returnTo}
            className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-white/75 hover:bg-white/10"
          >
            <ArrowLeft size={15} />
            {vi ? "Quay lại" : "Back"}
          </Link>
        </div>
        <div className="mt-10 grid gap-7 lg:grid-cols-[320px_1fr]">
          <motion.aside
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-[30px] border border-white/15 bg-white/[.08] p-7 backdrop-blur-xl"
          >
            <span className="grid size-16 place-items-center rounded-2xl bg-[#efb282] text-[#173f34]">
              <CircleUserRound size={32} />
            </span>
            <p className="mt-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-[#efb282]">
              <Sparkles size={14} />
              {vi ? "Hồ sơ lưu trú" : "Stay profile"}
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight">
              {vi ? "Thông tin của bạn" : "Your details"}
            </h1>
            <p className="mt-4 text-sm leading-6 text-white/60">
              {vi
                ? "Thông tin chính xác giúp xác nhận booking nhanh hơn và hỗ trợ bạn tốt hơn trong suốt kỳ nghỉ."
                : "Accurate details help us confirm and support your stay faster."}
            </p>
            <div className="mt-8 space-y-3 text-sm text-white/70">
              <p className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#efb282]" />
                {vi ? "Thông tin được bảo mật" : "Protected information"}
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#efb282]" />
                {vi
                  ? "Dùng cho xác nhận lưu trú"
                  : "Used for stay confirmation"}
              </p>
            </div>
          </motion.aside>
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[34px] border border-white/20 bg-white/[.97] p-6 text-[#14241e] shadow-[0_40px_120px_rgba(0,0,0,.35)] sm:p-10"
          >
            <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#a35331]">
              TT Apartment · {vi ? "Tài khoản" : "Account"}
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
              {vi ? "Thông tin cá nhân" : "Personal details"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              {vi
                ? "Cập nhật thông tin dùng cho đặt phòng và liên hệ hỗ trợ."
                : "Update the details used for bookings and guest support."}
            </p>
            {loading && (
              <div className="mt-9 grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 5 }, (_, index) => (
                  <i
                    key={index}
                    className={`h-16 animate-pulse rounded-2xl bg-black/5 ${index === 4 ? "sm:col-span-2" : ""}`}
                  />
                ))}
              </div>
            )}
            {!loading && error && !profile && (
              <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5">
                <p className="text-sm leading-6 text-red-700">{error}</p>
                <button
                  type="button"
                  onClick={() => void loadProfile()}
                  className="mt-4 flex items-center gap-2 rounded-full bg-red-700 px-4 py-2.5 text-sm font-bold text-white"
                >
                  <RefreshCw size={15} />
                  {vi ? "Thử tải lại" : "Try again"}
                </button>
              </div>
            )}
            {profile && (
              <form
                onSubmit={submit}
                className="mt-8 grid gap-4 sm:grid-cols-2"
              >
                <ProfileInput
                  name="lastName"
                  label={vi ? "Họ" : "Last name"}
                  defaultValue={profile.lastName}
                />
                <ProfileInput
                  name="firstName"
                  label={vi ? "Tên" : "First name"}
                  defaultValue={profile.firstName}
                />
                <ProfileInput
                  name="phone"
                  label={vi ? "Số điện thoại" : "Phone"}
                  defaultValue={profile.phone}
                  type="tel"
                />
                <ProfileInput
                  name="nationality"
                  label={vi ? "Quốc tịch" : "Nationality"}
                  defaultValue={profile.nationality}
                  required={false}
                />
                <label className="block text-sm font-bold sm:col-span-2">
                  Email
                  <span className="mt-2 flex items-center gap-2 rounded-2xl border border-black/8 bg-black/[.035] px-4 py-3.5 font-normal text-muted">
                    <CheckCircle2 size={16} className="text-[#2c8c66]" />
                    {profile.email}
                  </span>
                </label>
                {error && (
                  <p
                    role="alert"
                    className="rounded-2xl bg-red-50 p-4 text-sm text-red-700 sm:col-span-2"
                  >
                    {error}
                  </p>
                )}
                <button
                  disabled={saving}
                  className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#173f34] px-6 font-bold text-white shadow-[0_14px_35px_rgba(23,63,52,.22)] transition hover:-translate-y-0.5 disabled:opacity-50 sm:col-span-2"
                >
                  <Save size={17} />
                  {saving
                    ? vi
                      ? "Đang lưu…"
                      : "Saving…"
                    : vi
                      ? "Lưu và tiếp tục"
                      : "Save and continue"}
                </button>
              </form>
            )}
          </motion.section>
        </div>
      </div>
    </main>
  );
}
function ProfileInput({
  name,
  label,
  defaultValue,
  type = "text",
  required = true,
}: {
  name: string;
  label: string;
  defaultValue: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-bold">
      {label}
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 font-normal outline-none transition focus:border-[#d9784b] focus:ring-4 focus:ring-[#d9784b]/10"
      />
    </label>
  );
}
