"use client";

import { LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Profile = { email: string; firstName: string; lastName: string };

export function AccountMenu({
  locale,
  dark = false,
}: {
  locale: "vi" | "en";
  dark?: boolean;
}) {
  const vi = locale === "vi",
    router = useRouter(),
    root = useRef<HTMLDivElement>(null);
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined),
    [open, setOpen] = useState(false);
  useEffect(() => {
    fetch("/api/auth/session", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return setProfile(null);
        const body = (await response.json()) as { data?: Profile };
        setProfile(body.data ?? null);
      })
      .catch(() => setProfile(null));
  }, []);
  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setProfile(null);
    setOpen(false);
    router.push(`/${locale}`);
    router.refresh();
  }
  if (profile === undefined)
    return <span className="h-9 w-24 animate-pulse rounded-full bg-black/5" />;
  if (!profile)
    return (
      <Link
        href={`/${locale}/${vi ? "dang-nhap" : "login"}`}
        className={`rounded-full border px-4 py-2 text-xs font-bold ${dark ? "border-white/20 hover:border-white/50" : "border-black/10 text-[#304f6e] hover:bg-black/5"}`}
      >
        {vi ? "Đăng nhập" : "Sign in"}
      </Link>
    );
  const name =
    [profile.lastName, profile.firstName].filter(Boolean).join(" ") ||
    profile.email;
  return (
    <div ref={root} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={`flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3 text-xs font-bold ${dark ? "border-white/20" : "border-black/10 text-[#304f6e]"}`}
      >
        <span
          className={`grid size-7 place-items-center rounded-full ${dark ? "bg-white text-[#304f6e]" : "bg-[#304f6e] text-white"}`}
        >
          {name.charAt(0).toUpperCase()}
        </span>
        <span className="hidden max-w-32 truncate sm:block">{name}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border border-black/10 bg-white py-2 text-[#26384b] shadow-xl">
          <div className="border-b border-black/8 px-4 py-3">
            <b className="block truncate text-sm">{name}</b>
            <span className="block truncate text-xs text-muted">
              {profile.email}
            </span>
          </div>
          <Link
            onClick={() => setOpen(false)}
            href={`/${locale}/${vi ? "tai-khoan/ho-so" : "account/profile"}`}
            className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-black/5"
          >
            <UserRound size={17} />
            {vi ? "Thông tin cá nhân" : "Profile"}
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-700 hover:bg-red-50"
          >
            <LogOut size={17} />
            {vi ? "Đăng xuất" : "Sign out"}
          </button>
        </div>
      )}
    </div>
  );
}
