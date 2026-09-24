"use client";
import { useState } from "react";
import Link from "next/link";
import { ApartmentCard } from "@/components/apartment/apartment-card";
import type { Unit } from "@/lib/api/units";
import type { Locale } from "@/lib/i18n/config";
export function SearchResults({
  units,
  locale,
  checkIn,
  checkOut,
  guests = 2,
}: {
  units: Unit[];
  locale: Locale;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}) {
  const [sort, setSort] = useState("default");
  const vi = locale === "vi";
  const sorted = [...units].sort((a, b) =>
    sort === "price"
      ? a.basePrice - b.basePrice
      : sort === "space"
        ? b.area - a.area
        : 0,
  );
  return (
    <section>
      <div className="customer-results-toolbar">
        <div>
          <h2 aria-live="polite">
            {units.length} {vi ? "căn hộ phù hợp" : "matching apartments"}
          </h2>
          <p>
            {checkIn && checkOut
              ? vi
                ? "Lịch trống theo ngày bạn đã chọn."
                : "Availability for your dates."
              : vi
                ? "Chọn ngày để kiểm tra phòng trống."
                : "Choose dates to check availability."}
          </p>
        </div>
        <select
          aria-label={vi ? "Sắp xếp kết quả" : "Sort results"}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="default">
            {vi ? "Thứ tự mặc định" : "Default order"}
          </option>
          <option value="price">
            {vi ? "Giá tăng dần" : "Price: low to high"}
          </option>
          <option value="space">
            {vi ? "Diện tích lớn nhất" : "Most spacious"}
          </option>
        </select>
      </div>
      <div className="grid gap-5">
        {sorted.map((unit, index) => (
          <ApartmentCard
            key={unit.publicCode}
            unit={unit}
            locale={locale}
            search
            index={index}
            searchDates={{ checkIn, checkOut, guests }}
          />
        ))}
      </div>
      {!units.length && (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
          <h3 className="text-xl font-semibold">
            {vi ? "Chưa có căn phù hợp" : "No matching apartments"}
          </h3>
          <p className="my-4 text-sm text-muted">
            {vi
              ? "Thử ngày khác hoặc thay đổi số khách để tìm thêm lựa chọn."
              : "Try different dates or guest counts."}
          </p>
          <Link
            className="inline-flex rounded-lg bg-forest px-5 py-3 text-sm text-white"
            href={`/${locale}#booking`}
          >
            {vi ? "Đổi lịch tìm phòng" : "Change dates"}
          </Link>
        </div>
      )}
    </section>
  );
}
