import { PageHeader } from "@/components/customer/page-header";
import { HomeCatalog } from "@/components/commercial/home-experience";
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
    <main className="min-h-screen bg-[#f8f9fb] pb-16">
      <PageHeader locale={locale} />
      <div className="container-site">
        <section className="customer-title">
          <p>ABC APARTMENT / {vi ? "CĂN HỘ" : "APARTMENTS"}</p>
          <h1>
            {vi
              ? "Không gian cho mọi lịch trình."
              : "Space for every itinerary."}
          </h1>
          <p>
            {vi
              ? "Lọc theo nhu cầu, so sánh giá và lưu căn hộ bạn thích. Chọn ngày để kiểm tra tình trạng phòng."
              : "Filter by your needs, compare rates and save favourites. Choose dates to check availability."}
          </p>
        </section>
        <HomeCatalog locale={locale} units={units} />
      </div>
    </main>
  );
}
