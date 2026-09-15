import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SearchResults } from "@/components/search/search-results";
import type { Unit } from "@/lib/api/units";
export function CatalogPage({
  units,
  locale,
}: {
  units: Unit[];
  locale: "vi" | "en";
}) {
  const vi = locale === "vi";
  return (
    <main className="min-h-screen bg-[#f3efe5] text-[#14241e]">
      <header className="border-b border-black/10">
        <div className="container-site flex h-20 items-center justify-between">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-3 text-sm font-bold tracking-[.18em]"
          >
            <span className="grid size-9 place-items-center rounded-full bg-[#173f34] text-xs text-white">
              TT
            </span>
            TT APARTMENT
          </Link>
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 text-sm font-semibold"
          >
            <ArrowLeft size={16} />
            {vi ? "Trang chủ" : "Home"}
          </Link>
        </div>
      </header>
      <section className="border-b border-black/10 py-20 sm:py-28">
        <div className="container-site grid gap-8 lg:grid-cols-[.65fr_1.35fr]">
          <p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#a35331]">
            TT Apartment · Collection
          </p>
          <div>
            <h1 className="font-display text-[clamp(4rem,8vw,8rem)] font-medium leading-[.82] tracking-[-.06em]">
              {vi ? (
                <>
                  Phòng để ở.
                  <br />
                  <i className="font-normal">Không gian để sống.</i>
                </>
              ) : (
                <>
                  Rooms to stay.
                  <br />
                  <i className="font-normal">Space to live.</i>
                </>
              )}
            </h1>
            <p className="mt-7 max-w-xl leading-7 text-[#5f6c65]">
              {vi
                ? "Khám phá toàn bộ căn hộ TT Apartment tại Đà Nẵng — từ studio gọn nhẹ đến không gian rộng cho cả gia đình."
                : "Explore every TT Apartment stay in Da Nang, from compact studios to generous spaces for the whole family."}
            </p>
          </div>
        </div>
      </section>
      <div className="container-site py-16">
        <SearchResults units={units} locale={locale} />
      </div>
    </main>
  );
}
