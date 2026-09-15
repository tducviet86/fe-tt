"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Globe2,
  Heart,
  Menu,
  Palmtree,
  Search,
  Waves,
} from "lucide-react";
import { useRef } from "react";
import { HomeSearch } from "@/components/home-search";
import type { Unit } from "@/lib/api/units";
const FirstVisitSplash = dynamic(
  () => import("@/components/commercial/first-visit-splash"),
  { ssr: false },
);
export function HomeExperience({
  locale,
  units,
}: {
  locale: "vi" | "en";
  units: Unit[];
}) {
  const vi = locale === "vi";
  return (
    <div className="min-h-screen bg-white text-[#222]">
      <FirstVisitSplash />
      <header className="sticky top-0 z-40 border-b border-black/8 bg-white/92 backdrop-blur-xl">
        <div className="container-site flex h-20 items-center justify-between">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-3 text-[#173f34]"
          >
            <span className="grid size-10 place-items-center rounded-full bg-[#173f34] text-xs font-bold text-white">
              TT
            </span>
            <b className="hidden tracking-[.12em] sm:block">TT APARTMENT</b>
          </Link>
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 md:flex">
            <NavItem
              icon={<Globe2 />}
              label={vi ? "Khám phá" : "Khám phá"}
              active
            />
            <NavItem icon={<Building2 />} label={vi ? "Căn hộ" : "Stays"} />
            <NavItem icon={<Waves />} label={vi ? "Gần biển" : "By the sea"} />
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href={`/${vi ? "en" : "vi"}`}
              className="rounded-full px-3 py-2 text-xs font-bold hover:bg-black/5"
            >
              {vi ? "EN" : "VI"}
            </Link>
            <button
              className="grid size-10 place-items-center rounded-full bg-[#f3f3f3]"
              aria-label="Menu"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>
      <main>
        <section className="border-b border-black/8 bg-[#fafafa] px-3 pb-8 pt-6">
          <div className="mx-auto max-w-[1040px]">
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <HomeSearch locale={locale} />
            </motion.div>
          </div>
        </section>
        <section className="container-site py-12 sm:py-16">
          <RoomRail
            title={
              vi
                ? "Căn hộ được yêu thích tại Đà Nẵng"
                : "Guest favourites in Da Nang"
            }
            subtitle={
              vi
                ? "Những lựa chọn được xem nhiều nhất tuần này"
                : "The most viewed stays this week"
            }
            units={units.slice(0, 7)}
            locale={locale}
          />
          <RoomRail
            title={
              vi
                ? "Gần biển, vừa đủ riêng tư"
                : "Close to the sea, quietly yours"
            }
            subtitle={
              vi
                ? "Không gian nhẹ nhàng cho chuyến đi tiếp theo"
                : "Easy spaces for your next trip"
            }
            units={(units.length > 3 ? units.slice(3) : units).slice(0, 7)}
            locale={locale}
            delayed
          />
          <RoomRail
            title={vi ? "Phù hợp cho kỳ nghỉ dài" : "Made for longer stays"}
            subtitle={
              vi
                ? "Có bếp, Wi-Fi và không gian để sống như ở nhà"
                : "Kitchen, Wi-Fi and room to feel at home"
            }
            units={units.slice().reverse().slice(0, 7)}
            locale={locale}
            delayed
          />
        </section>
        <section className="mx-3 mb-3 overflow-hidden rounded-[28px] bg-[#173f34] px-6 py-14 text-white sm:px-12">
          <div className="container-site flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#efb282]">
                TT Apartment · Da Nang
              </p>
              <h2 className="mt-4 max-w-xl font-display text-4xl leading-none sm:text-5xl">
                {vi
                  ? "Một nơi vừa đủ cho những ngày ở Đà Nẵng."
                  : "Just enough space for your days in Da Nang."}
              </h2>
            </div>
            <a
              href="#booking"
              className="flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#173f34]"
            >
              <Search size={16} />
              {vi ? "Tìm căn" : "Find a stay"}
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
function NavItem({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <a
      href={active ? "#booking" : "#stays"}
      className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${active ? "bg-[#f1f1f1] text-black" : "text-black/50 hover:bg-black/5 hover:text-black"}`}
    >
      <span className="[&>svg]:size-18 [&>svg]:h-[18px] [&>svg]:w-[18px]">
        {icon}
      </span>
      {label}
    </a>
  );
}
function RoomRail({
  title,
  subtitle,
  units,
  locale,
  delayed = false,
}: {
  title: string;
  subtitle: string;
  units: Unit[];
  locale: "vi" | "en";
  delayed?: boolean;
}) {
  const rail = useRef<HTMLDivElement>(null),
    vi = locale === "vi";
  function move(direction: number) {
    rail.current?.scrollBy({ left: direction * 620, behavior: "smooth" });
  }
  return (
    <motion.section
      id={!delayed ? "stays" : undefined}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="mb-14 last:mb-0"
    >
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-[-.02em] sm:text-2xl">
            {title}
          </h2>
          <p className="mt-1 text-sm text-black/50">{subtitle}</p>
        </div>
        <div className="hidden gap-2 sm:flex">
          <button
            onClick={() => move(-1)}
            className="grid size-9 place-items-center rounded-full bg-[#f3f3f3] transition hover:bg-[#e9e9e9]"
            aria-label={vi ? "Trước" : "Previous"}
          >
            <ArrowLeft size={16} />
          </button>
          <button
            onClick={() => move(1)}
            className="grid size-9 place-items-center rounded-full bg-[#f3f3f3] transition hover:bg-[#e9e9e9]"
            aria-label={vi ? "Tiếp" : "Next"}
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
      {units.length ? (
        <div
          ref={rail}
          className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-3"
        >
          {units.map((unit, index) => (
            <RoomTile
              key={unit.publicCode}
              unit={unit}
              locale={locale}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="grid min-h-56 place-items-center rounded-[24px] bg-[#f6f6f6] text-sm text-black/45">
          {vi ? "Dữ liệu căn hộ đang được cập nhật" : "Stays are being updated"}
        </div>
      )}
    </motion.section>
  );
}
function RoomTile({
  unit,
  locale,
  index,
}: {
  unit: Unit;
  locale: "vi" | "en";
  index: number;
}) {
  const vi = locale === "vi",
    image = unit.media[0]?.media.url,
    href = `/${locale}/${vi ? "du-an" : "properties"}/panoma/${vi ? unit.slugVi : unit.slugEn}`;
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ delay: Math.min(index * 0.045, 0.22), duration: 0.45 }}
      className="w-[72vw] shrink-0 snap-start sm:w-[280px] lg:w-[260px]"
    >
      <Link href={href} className="group block">
        <div className="relative aspect-square overflow-hidden rounded-[22px] bg-[#eee]">
          {image ? (
            <Image
              src={image}
              alt={vi ? unit.nameVi : unit.nameEn}
              fill
              sizes="(min-width:640px) 280px,72vw"
              className="object-cover transition duration-700 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="grid h-full place-items-center bg-[#e8eee9] text-[#173f34]">
              <Palmtree size={28} />
            </div>
          )}
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-bold shadow-sm">
            {index < 2
              ? vi
                ? "Khách yêu thích"
                : "Guest favourite"
              : unit.viewType === "OCEAN"
                ? vi
                  ? "Gần biển"
                  : "Near beach"
                : vi
                  ? "Yên tĩnh"
                  : "Quiet stay"}
          </span>
          <span
            className="absolute right-3 top-3 text-white drop-shadow"
            aria-hidden="true"
          >
            <Heart size={23} />
          </span>
        </div>
        <h3 className="mt-3 line-clamp-1 text-[15px] font-semibold">
          {vi ? unit.nameVi : unit.nameEn}
        </h3>
        <p className="mt-1 text-sm text-black/55">
          <b className="font-medium text-black">
            {new Intl.NumberFormat(vi ? "vi-VN" : "en-US").format(
              unit.basePrice,
            )}
            đ
          </b>{" "}
          / {vi ? "đêm" : "night"} · ★ 4,9
        </p>
      </Link>
    </motion.article>
  );
}
