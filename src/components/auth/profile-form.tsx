"use client";
import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Profile = { email: string; firstName: string; lastName: string; phone: string; nationality: string };
export function ProfileForm({ locale }: { locale: "vi" | "en" }) {
  const vi = locale === "vi", router = useRouter(), params = useSearchParams();
  const [profile, setProfile] = useState<Profile>(), [error, setError] = useState(""), [saving, setSaving] = useState(false);
  const rawReturnTo = params.get("returnTo") ?? `/${locale}`;
  const returnTo = rawReturnTo.startsWith("/") && !rawReturnTo.startsWith("//") ? rawReturnTo : `/${locale}`;
  useEffect(() => { fetch("/api/auth/session", { cache: "no-store" }).then(async (response) => {
    if (response.status === 401) return router.replace(`/${locale}/${vi ? "dang-nhap" : "login"}?returnTo=${encodeURIComponent(returnTo)}`);
    const body = (await response.json()) as { data?: Profile }; if (body.data) setProfile(body.data);
  }).catch(() => setError(vi ? "Không thể tải hồ sơ." : "Unable to load profile.")); }, [locale, returnTo, router, vi]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError(""); const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/profile", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ firstName: form.get("firstName"), lastName: form.get("lastName"), phone: form.get("phone"), nationality: form.get("nationality") }) });
    if (!response.ok) { setError(vi ? "Vui lòng kiểm tra lại thông tin." : "Please check your details."); setSaving(false); return; }
    router.replace(returnTo); router.refresh();
  }
  return <main className="grid min-h-screen place-items-center bg-[#f3efe5] px-4 py-12 text-[#14241e]">
    <section className="w-full max-w-xl rounded-[30px] border border-black/10 bg-[#fffdf8] p-7 shadow-[0_24px_80px_rgba(25,43,35,.13)] sm:p-9">
      <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#a35331]">TT Apartment · {vi ? "Tài khoản" : "Account"}</p>
      <h1 className="mt-4 font-display text-4xl font-semibold">{vi ? "Thông tin cá nhân" : "Personal details"}</h1>
      <p className="mt-2 text-sm leading-6 text-muted">{vi ? "Hoàn thiện thông tin để chúng tôi xác nhận và hỗ trợ kỳ lưu trú." : "Complete your details so we can confirm and support your stay."}</p>
      {!profile ? <p className="mt-8 text-sm text-muted">{vi ? "Đang tải…" : "Loading…"}</p> : <form onSubmit={submit} className="mt-7 grid gap-4 sm:grid-cols-2">
        <ProfileInput name="lastName" label={vi ? "Họ" : "Last name"} defaultValue={profile.lastName} />
        <ProfileInput name="firstName" label={vi ? "Tên" : "First name"} defaultValue={profile.firstName} />
        <ProfileInput name="phone" label={vi ? "Số điện thoại" : "Phone"} defaultValue={profile.phone} />
        <ProfileInput name="nationality" label={vi ? "Quốc tịch (không bắt buộc)" : "Nationality (optional)"} defaultValue={profile.nationality} required={false} />
        <label className="block text-sm font-bold sm:col-span-2">Email<input value={profile.email} disabled className="mt-2 w-full rounded-xl border bg-black/5 px-4 py-3 font-normal text-muted" /></label>
        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700 sm:col-span-2">{error}</p>}
        <button disabled={saving} className="rounded-full bg-[#173f34] px-5 py-3.5 font-bold text-white disabled:opacity-50 sm:col-span-2">{saving ? (vi ? "Đang lưu…" : "Saving…") : (vi ? "Lưu và tiếp tục đặt phòng" : "Save and continue")}</button>
      </form>}
    </section>
  </main>;
}
function ProfileInput({ name, label, defaultValue, required = true }: { name: string; label: string; defaultValue: string; required?: boolean }) { return <label className="block text-sm font-bold">{label}<input name={name} defaultValue={defaultValue} required={required} className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 font-normal outline-none focus:border-[#173f34]" /></label>; }
