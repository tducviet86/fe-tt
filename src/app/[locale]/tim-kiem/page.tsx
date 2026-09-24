import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/customer/page-header";
import { notFound } from "next/navigation";
import { SearchResults } from "@/components/search/search-results";
import { getUnits } from "@/lib/api/units";
import { isLocale } from "@/lib/i18n/config";
export const metadata: Metadata = {
  title: "Phòng trống tại ABC Apartment",
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
    <main className="min-h-screen bg-[#f8f9fb] pb-12">
      <PageHeader
        locale={locale}
        backHref={`/${locale}#booking`}
        backLabel={vi ? "Đổi ngày" : "Change dates"}
      />
      <div className="container-site">
        <section className="customer-title">
          <p>ABC APARTMENT / {vi ? "TÌM PHÒNG" : "SEARCH"}</p>
          <h1>
            {vi ? "Chọn căn hộ cho chuyến đi." : "Find your space in Da Nang."}
          </h1>
          <p>
            {vi
              ? "So sánh sức chứa, tiện ích và giá mỗi đêm. Xem chi tiết để kiểm tra tổng chi phí trước khi đặt."
              : "Compare capacity, amenities and nightly rates. Open a stay to review the total before booking."}
          </p>
        </section>
        <div className="customer-search-summary">
          <span>
            {checkIn && checkOut
              ? `${checkIn} → ${checkOut}`
              : vi
                ? "Chưa chọn ngày"
                : "Dates not selected"}
          </span>
          <span>
            {guests} {vi ? "khách" : "guests"}
          </span>
          <Link href={`/${locale}#booking`}>
            {vi ? "Chỉnh sửa tìm kiếm" : "Edit search"}
          </Link>
        </div>
        <SearchResults
          units={units}
          locale={locale}
          checkIn={valid ? checkIn : undefined}
          checkOut={valid ? checkOut : undefined}
          guests={guests}
        />
        <footer className="customer-footer">
          <b>ABC APARTMENT.</b>
          <span>Đà Nẵng · Việt Nam</span>
        </footer>
      </div>
    </main>
  );
}
