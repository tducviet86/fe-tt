import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock3, Users } from "lucide-react";
import { notFound } from "next/navigation";
import { SearchResults } from "@/components/search/search-results";
import { SearchAtmosphere } from "@/components/search/search-atmosphere";
import { getUnits } from "@/lib/api/units";
import { isLocale } from "@/lib/i18n/config";
export const metadata: Metadata = {
  title: "Phòng trống tại TT Apartment",
  robots: { index: false, follow: true },
};
export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  if (!isLocale(locale)) notFound();
  const vi = locale === "vi",
    checkIn = query.checkIn,
    checkOut = query.checkOut,
    guests = Math.max(1, Number(query.guests) || 2),
    valid = Boolean(checkIn && checkOut);
  const units = await getUnits({
    checkIn: valid ? checkIn : undefined,
    checkOut: valid ? checkOut : undefined,
    guests,
  });
  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f0e8]">
      <header className="sticky top-0 z-30 border-b border-black/8 bg-[#f4f0e8]/88 backdrop-blur-xl">
        <div className="container-site flex h-20 items-center justify-between">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-3 text-sm font-bold tracking-[.16em]"
          >
            <span className="grid size-9 place-items-center rounded-full bg-[#173d30] text-xs text-white">
              TT
            </span>
            TT APARTMENT
          </Link>
          <Link
            href={`/${locale}#booking`}
            className="group flex items-center gap-2 rounded-full border border-black/12 bg-white/60 px-4 py-2.5 text-sm font-semibold transition hover:bg-white"
          >
            <ArrowLeft
              size={16}
              className="transition group-hover:-translate-x-1"
            />
            {vi ? "Đổi ngày" : "Change dates"}
          </Link>
        </div>
      </header>
      <section className="relative border-b border-black/8">
        <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(#173d3020_1px,transparent_1px)] [background-size:18px_18px]" />
        <div className="container-site relative grid min-h-[440px] items-center gap-4 py-14 lg:grid-cols-[1.12fr_.88fr]">
          <div className="relative z-10">
            <p className="text-[11px] font-bold uppercase tracking-[.24em] text-[#a35331]">
              TT Apartment · Đà Nẵng
            </p>
            <h1 className="mt-5 max-w-3xl font-display text-[clamp(3.2rem,7vw,6.8rem)] font-semibold leading-[.86] tracking-[-.055em]">
              {vi ? (
                <>
                  Ở theo cách
                  <br />
                  <i className="font-normal text-[#a35331]">của riêng bạn.</i>
                </>
              ) : (
                <>
                  Stay your way,
                  <br />
                  <i className="font-normal text-[#a35331]">feel at home.</i>
                </>
              )}
            </h1>
            <p className="mt-6 max-w-lg text-sm leading-7 text-[#53635c] sm:text-base">
              {vi
                ? "Những căn hộ nhiều ánh sáng, riêng tư và vừa đủ gần biển — được chọn theo đúng kỳ lưu trú của bạn."
                : "Light-filled, private apartments close to the sea — matched to the exact dates of your stay."}
            </p>
          </div>
          <div className="relative hidden h-[340px] lg:block">
            <SearchAtmosphere />
            <span className="absolute bottom-8 right-5 max-w-[180px] border-l border-[#173d30]/25 pl-4 text-xs leading-5 text-[#53635c]">
              {vi
                ? "Một nơi để chậm lại, ngay giữa nhịp sống Đà Nẵng."
                : "A slower rhythm in the heart of Da Nang."}
            </span>
          </div>
        </div>
      </section>
      <div className="container-site relative z-10 -mt-7 pb-20">
        <div className="mb-16 grid overflow-hidden rounded-[24px] border border-black/8 bg-[#fffdf8] shadow-[0_22px_70px_rgba(30,46,39,.12)] sm:grid-cols-3">
          <div className="flex items-center gap-4 p-5 sm:p-6">
            <span className="grid size-10 place-items-center rounded-full bg-[#e9efe9] text-[#173d30]">
              <CalendarDays size={18} />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.16em] text-muted">
                {vi ? "Kỳ lưu trú" : "Your dates"}
              </p>
              <b className="mt-1 block text-sm">
                {checkIn && checkOut
                  ? `${checkIn} — ${checkOut}`
                  : vi
                    ? "Linh hoạt ngày"
                    : "Flexible dates"}
              </b>
            </div>
          </div>
          <div className="flex items-center gap-4 border-y border-black/8 p-5 sm:border-x sm:border-y-0 sm:p-6">
            <span className="grid size-10 place-items-center rounded-full bg-[#f5e8dc] text-[#a35331]">
              <Users size={18} />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.16em] text-muted">
                {vi ? "Khách lưu trú" : "Guests"}
              </p>
              <b className="mt-1 block text-sm">
                {guests} {vi ? "khách" : "guests"}
              </b>
            </div>
          </div>
          <div className="flex items-center gap-4 p-5 sm:p-6">
            <span className="grid size-10 place-items-center rounded-full bg-[#e9efe9] text-[#173d30]">
              <Clock3 size={18} />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.16em] text-muted">
                {vi ? "Nhận phòng" : "Check-in"}
              </p>
              <b className="mt-1 block text-sm">
                14:00 · {vi ? "Trả phòng 11:00" : "Check-out 11:00"}
              </b>
            </div>
          </div>
        </div>
        <SearchResults units={units} locale={locale} />
      </div>
    </main>
  );
}
