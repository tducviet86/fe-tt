import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Check,
  Maximize,
  Users,
} from "lucide-react";
import { notFound } from "next/navigation";
import { DetailGallery } from "@/components/apartment/detail-gallery";
import { BookingCard } from "@/components/booking/booking-card";
import { getUnit } from "@/lib/api/units";
import { isLocale } from "@/lib/i18n/config";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; unitSlug: string }>;
}): Promise<Metadata> {
  const { locale, unitSlug } = await params,
    u = await getUnit(unitSlug);
  if (!u) return {};
  const title = locale === "vi" ? u.nameVi : u.nameEn,
    description = locale === "vi" ? u.descriptionVi : u.descriptionEn,
    image = u.media[0]?.media.url;
  return {
    title,
    description,
    openGraph: { title, description, images: image ? [image] : [] },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
    },
  };
}
export default async function UnitPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; unitSlug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const [{ locale, unitSlug }, query] = await Promise.all([
    params,
    searchParams,
  ]);
  if (!isLocale(locale)) notFound();
  const u = await getUnit(unitSlug);
  if (!u) notFound();
  const vi = locale === "vi",
    title = vi ? u.nameVi : u.nameEn;
  return (
    <main className="min-h-screen bg-[#f3efe5] text-[#14241e]">
      <header className="sticky top-0 z-40 border-b border-black/10 bg-[#f3efe5]/88 backdrop-blur-xl">
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
            href={`/${locale}/${vi ? "can-ho" : "apartments"}`}
            className="flex items-center gap-2 rounded-full border border-black/12 px-4 py-2.5 text-sm font-semibold"
          >
            <ArrowLeft size={16} />
            {vi ? "Tất cả căn" : "All stays"}
          </Link>
        </div>
      </header>
      <div className="container-site py-8 sm:py-12">
        <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#a35331]">
              TT Apartment · {u.publicCode}
            </p>
            <h1 className="mt-4 max-w-4xl font-display text-[clamp(3.4rem,7vw,7.4rem)] font-medium leading-[.84] tracking-[-.06em]">
              {title}
            </h1>
          </div>
          <p className="max-w-sm text-sm leading-6 text-[#637068]">
            {u.property.address}
          </p>
        </div>
        <DetailGallery photos={u.media} title={title} locale={locale} />
        <div className="grid gap-14 py-16 lg:grid-cols-[1fr_390px]">
          <article>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[22px] bg-black/10 sm:grid-cols-4">
              <Fact
                icon={<Users />}
                text={`${u.maxGuests} ${vi ? "khách" : "guests"}`}
              />
              <Fact
                icon={<BedDouble />}
                text={`${u.bedroomCount} ${vi ? "phòng ngủ" : "bedrooms"}`}
              />
              <Fact
                icon={<Bath />}
                text={`${u.bathroomCount} ${vi ? "phòng tắm" : "baths"}`}
              />
              <Fact icon={<Maximize />} text={`${u.area} m²`} />
            </div>
            <section className="border-b border-black/10 py-12">
              <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#a35331]">
                01 · {vi ? "Không gian" : "The space"}
              </p>
              <h2 className="mt-5 font-display text-4xl">
                {vi ? "Chậm lại, theo cách tự nhiên." : "Slow down, naturally."}
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5f6d65]">
                {vi ? u.descriptionVi : u.descriptionEn}
              </p>
            </section>
            <section className="py-12">
              <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#a35331]">
                02 · {vi ? "Tiện nghi" : "Amenities"}
              </p>
              <h2 className="mt-5 font-display text-4xl">
                {vi
                  ? "Mọi điều thiết yếu, đã sẵn sàng."
                  : "The essentials, already here."}
              </h2>
              <ul className="mt-8 grid gap-px overflow-hidden rounded-[22px] bg-black/10 sm:grid-cols-2">
                {u.amenities.length
                  ? u.amenities.map((a) => (
                      <li
                        key={a.amenity.code}
                        className="flex items-center gap-3 bg-[#faf7ef] px-5 py-4 text-sm"
                      >
                        <Check size={16} className="text-[#a35331]" />
                        {vi ? a.amenity.nameVi : a.amenity.nameEn}
                      </li>
                    ))
                  : [
                      "Wi-Fi",
                      "Kitchen",
                      "Air conditioning",
                      "Self check-in",
                    ].map((x) => (
                      <li
                        key={x}
                        className="flex items-center gap-3 bg-[#faf7ef] px-5 py-4 text-sm"
                      >
                        <Check size={16} className="text-[#a35331]" />
                        {x}
                      </li>
                    ))}
              </ul>
            </section>
          </article>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <BookingCard
              locale={locale}
              basePrice={u.basePrice}
              currency={u.currency}
              publicCode={u.publicCode}
              maxGuests={u.maxGuests}
              initialCheckIn={query.checkIn}
              initialCheckOut={query.checkOut}
              initialGuests={Math.max(1, Number(query.guests) || 2)}
            />
          </aside>
        </div>
      </div>
      <section className="bg-[#173f34] py-20 text-white">
        <div className="container-site">
          <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#efb282]">
            TT Apartment · Da Nang
          </p>
          <h2 className="mt-5 max-w-4xl font-display text-6xl leading-[.9] tracking-[-.04em]">
            {vi
              ? "Một nơi để trở về sau mỗi ngày khám phá."
              : "A place to return to after every adventure."}
          </h2>
        </div>
      </section>
    </main>
  );
}
function Fact({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex min-h-28 flex-col justify-between bg-[#faf7ef] p-5 text-sm">
      <span className="text-[#a35331]">{icon}</span>
      <b>{text}</b>
    </div>
  );
}
