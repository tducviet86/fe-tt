import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Bath, BedDouble, Check, MapPin, Maximize, Star, Users } from "lucide-react";
import type { Unit } from "@/lib/api/units";
import type { Locale } from "@/lib/i18n/config";
import { FavoriteButton } from "@/features/favorites/favorite-button";
export function ApartmentCard({
  unit,
  locale,
  featured = false,
  search = false,
  index = 0,
  searchDates,
}: {
  unit: Unit;
  locale: Locale;
  featured?: boolean;
  search?: boolean;
  index?: number;
  searchDates?: { checkIn?: string; checkOut?: string; guests: number };
}) {
  const vi = locale === "vi";
  const path = `/${locale}/${vi ? "du-an" : "properties"}/panoma/${vi ? unit.slugVi : unit.slugEn}`;
  const query = new URLSearchParams();
  if (searchDates?.checkIn) query.set("checkIn", searchDates.checkIn);
  if (searchDates?.checkOut) query.set("checkOut", searchDates.checkOut);
  if (searchDates?.guests) query.set("guests", String(searchDates.guests));
  const href = `${path}${query.size ? `?${query}` : ""}`;
  const image = unit.media[0]?.media.url;
  const rating = unit.reviews.length
    ? unit.reviews.reduce((sum, review) => sum + review.rating, 0) / unit.reviews.length
    : undefined;
  if (search)
    return (
      <article className="group relative grid overflow-hidden rounded-[22px] border border-black/8 bg-[#fffdf8] shadow-[0_12px_40px_rgba(32,48,40,.07)] transition duration-500 hover:-translate-y-0.5 hover:shadow-[0_20px_55px_rgba(32,48,40,.13)] md:grid-cols-[minmax(240px,36%)_1fr]">
        <div className="relative aspect-[16/10] overflow-hidden bg-[#dfe6e0] md:aspect-auto md:min-h-[248px]">
          {image ? (
            <Image
              src={image}
              alt={
                (vi ? unit.media[0].media.altVi : unit.media[0].media.altEn) ??
                (vi ? unit.nameVi : unit.nameEn)
              }
              fill
              sizes="(min-width:768px) 42vw,100vw"
              className="object-cover transition duration-1000 ease-out group-hover:scale-[1.055]"
            />
          ) : (
            <div className="grid h-full place-items-center text-sm text-muted">
              {vi ? "Đang cập nhật ảnh" : "Photography coming soon"}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c211a]/55 via-transparent to-transparent" />
          <span className="absolute left-4 top-4 rounded-full border border-white/40 bg-white/85 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.14em] backdrop-blur-md">
            {String(index + 1).padStart(2, "0")} ·{" "}
            {unit.viewType === "OCEAN"
              ? vi
                ? "Hướng biển"
                : "Ocean view"
              : vi
                ? "Nhịp phố"
                : "City living"}
          </span>
          <div className="absolute right-4 top-4">
            <FavoriteButton code={unit.publicCode} />
          </div>
        </div>
        <Link href={href} className="focus-ring flex min-w-0 flex-col p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[.16em] text-[#a35331]">
              <MapPin size={13} /> {unit.property.name} · Đà Nẵng
            </p>
            <span className="flex items-center gap-1.5 text-sm font-bold text-[#173d30]">
              <Star size={15} className="fill-[#d9784b] text-[#d9784b]" />
              {rating ? rating.toFixed(1) : vi ? "Mới" : "New"}
              <small className="font-normal text-muted">
                ({unit.reviews.length || (vi ? "chưa có" : "none")} {vi ? "đánh giá" : "reviews"})
              </small>
            </span>
          </div>
          <div className="mt-3 flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-2xl font-semibold leading-[1.05] tracking-[-.025em]">{vi ? unit.nameVi : unit.nameEn}</h3>
              <p className="mt-2 line-clamp-1 text-sm leading-5 text-muted">{vi ? unit.descriptionVi : unit.descriptionEn}</p>
            </div>
            <span className="grid size-10 shrink-0 place-items-center rounded-full border border-black/10 transition duration-300 group-hover:rotate-45 group-hover:bg-[#173d30] group-hover:text-white">
              <ArrowUpRight size={18} />
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-1.5 text-[11px] text-[#42564d] sm:grid-cols-4">
            <SearchFact icon={<BedDouble size={15} />} text={`${unit.bedroomCount} ${vi ? "phòng ngủ" : "bedrooms"}`} />
            <SearchFact icon={<Bath size={15} />} text={`${unit.bathroomCount} ${vi ? "phòng tắm" : "baths"}`} />
            <SearchFact icon={<Users size={15} />} text={`${unit.maxGuests} ${vi ? "khách" : "guests"}`} />
            <SearchFact icon={<Maximize size={15} />} text={`${unit.area} m²`} />
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {unit.amenities.slice(0, 3).map(({ amenity }) => (
              <span key={amenity.code} className="flex items-center gap-1 rounded-full bg-[#eef2ed] px-2.5 py-1 text-[10px] text-[#42564d]">
                <Check size={12} /> {vi ? amenity.nameVi : amenity.nameEn}
              </span>
            ))}
          </div>
          <div className="mt-auto flex items-end justify-between gap-4 border-t border-black/8 pt-3">
            <span className="rounded-full bg-[#e5eee8] px-2.5 py-1.5 text-[11px] font-bold text-[#173d30]">{vi ? "Trống trong kỳ đã chọn" : "Available for your dates"}</span>
            <div className="shrink-0 text-right">
              <span className="block text-[11px] text-muted">{vi ? "Mỗi đêm, từ" : "Per night, from"}</span>
              <p><b className="text-lg">{new Intl.NumberFormat(vi ? "vi-VN" : "en-US").format(unit.basePrice)}</b><small className="ml-1 text-muted">{unit.currency}</small></p>
            </div>
          </div>
        </Link>
      </article>
    );
  return (
    <article
      className={`group relative ${featured ? "lg:grid lg:grid-cols-[1.2fr_.8fr] lg:rounded-[32px] lg:bg-cream" : ""}`}
    >
      <div
        className={`relative overflow-hidden bg-[#e8ece9] ${featured ? "aspect-[4/3] rounded-[28px] lg:aspect-[16/11]" : "aspect-[4/3] rounded-[24px]"}`}
      >
        {image ? (
          <Image
            src={image}
            alt={
              (vi ? unit.media[0].media.altVi : unit.media[0].media.altEn) ??
              (vi ? unit.nameVi : unit.nameEn)
            }
            fill
            sizes={
              featured
                ? "(min-width:1024px) 58vw,100vw"
                : "(min-width:768px) 33vw,100vw"
            }
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.035]"
          />
        ) : (
          <div className="grid h-full place-items-center p-8 text-center text-sm text-muted">
            {vi
              ? "Ảnh căn hộ sẽ hiển thị sau khi được quản trị viên tải lên."
              : "Apartment photography will appear after media is published."}
          </div>
        )}
        <div className="absolute right-3 top-3">
          <FavoriteButton code={unit.publicCode} />
        </div>
        {unit.status === "TEMP_UNAVAILABLE" && (
          <span className="absolute bottom-3 left-3 rounded-full bg-white px-3 py-1.5 text-xs font-bold">
            {vi ? "Tạm hết lịch" : "Temporarily unavailable"}
          </span>
        )}
      </div>
      <Link
        href={href}
        className={`focus-ring block rounded-2xl ${featured ? "p-6 lg:flex lg:flex-col lg:justify-center lg:p-10" : "pt-4"}`}
      >
        <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-forest">
          <MapPin size={14} />
          {unit.property.name}
        </p>
        <h3
          className={`mt-2 font-display font-semibold leading-tight ${featured ? "text-4xl" : "text-2xl"}`}
        >
          {vi ? unit.nameVi : unit.nameEn}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
          {vi ? unit.descriptionVi : unit.descriptionEn}
        </p>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
          <span className="flex items-center gap-1.5">
            <BedDouble size={16} />
            {unit.bedroomCount} {vi ? "phòng ngủ" : "bedrooms"}
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={16} />
            {unit.maxGuests} {vi ? "khách" : "guests"}
          </span>
        </div>
        <div className="mt-6 flex items-end justify-between border-t border-black/8 pt-5">
          <span className="text-xs text-muted">{vi ? "Giá từ" : "From"}</span>
          <p>
            <b className="text-xl">
              {new Intl.NumberFormat(vi ? "vi-VN" : "en-US").format(
                unit.basePrice,
              )}{" "}
              {unit.currency}
            </b>
            <small className="text-muted"> / {vi ? "đêm" : "night"}</small>
          </p>
        </div>
      </Link>
    </article>
  );
}

function SearchFact({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="flex items-center gap-1.5 rounded-lg border border-black/8 bg-white px-2.5 py-2">
      <i className="text-[#a35331]">{icon}</i><b>{text}</b>
    </span>
  );
}
