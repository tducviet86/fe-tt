"use client";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
export function SiteHeader({ locale }: { locale: "vi" | "en" }) {
  const [open, setOpen] = useState(false),
    vi = locale === "vi";
  const nav = [
    ["#projects", vi ? "Căn hộ" : "Apartments"],
    ["#amenities", vi ? "Tiện ích" : "Amenities"],
    ["#location", vi ? "Vị trí" : "Location"],
  ];
  return (
    <>
      <div className="bg-[#d9784b] px-4 py-2 text-center text-[10px] font-bold uppercase tracking-[.14em] text-[#14241e]">
        {vi
          ? "Đặt trực tiếp · Giá minh bạch · Hỗ trợ tại Đà Nẵng"
          : "Book direct · Clear pricing · Local support"}
      </div>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#173f34]/92 text-white backdrop-blur-xl">
        <div className="container-site flex h-[72px] items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-full border border-white/25 text-xs font-bold">
              TT
            </span>
            <span>
              <b className="block text-[13px] tracking-[.18em]">TT APARTMENT</b>
              <small className="block text-[8px] tracking-[.2em] text-white/45">
                DA NANG
              </small>
            </span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {nav.map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="text-[12px] font-medium text-white/65 transition hover:text-[#efb282]"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href={`/${vi ? "en" : "vi"}`}
              className="px-3 py-2 text-xs font-bold"
            >
              {vi ? "EN" : "VI"}
            </Link>
            <a
              href="#booking"
              className="hidden rounded-full bg-[#f4efe4] px-5 py-3 text-xs font-bold text-[#173f34] sm:block"
            >
              {vi ? "Tìm phòng" : "Find a stay"}
            </a>
            <button
              onClick={() => setOpen(!open)}
              className="p-2 md:hidden"
              aria-label="Menu"
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="border-t border-white/10 bg-[#173f34] px-5 py-3 md:hidden">
            {nav.map(([href, label]) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="block border-b border-white/10 py-3 text-sm font-medium"
              >
                {label}
              </a>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}
