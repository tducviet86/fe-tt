"use client";
import { motion } from "motion/react";
import { ApartmentCard } from "@/components/apartment/apartment-card";
import type { Unit } from "@/lib/api/units";
import type { Locale } from "@/lib/i18n/config";
export function SearchResults({
  units,
  locale,
}: {
  units: Unit[];
  locale: Locale;
}) {
  const vi = locale === "vi";
  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      {units.length ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.18 }}
            className="mb-8 flex flex-wrap items-end justify-between gap-4"
          >
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#a35331]">
                {vi ? "Bộ sưu tập lưu trú" : "The stay collection"}
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-.03em] sm:text-4xl">
                {units.length}{" "}
                {vi ? "không gian dành cho bạn" : "places, ready for you"}
              </h2>
            </div>
            <span className="flex items-center gap-2 rounded-full border border-[#173d30]/15 bg-[#e8f0eb] px-4 py-2 text-xs font-bold text-[#173d30]">
              <i className="size-2 animate-pulse rounded-full bg-[#2c8c66]" />
              {vi ? "Lịch trống vừa cập nhật" : "Availability just checked"}
            </span>
          </motion.div>
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.1 } },
            }}
            className="grid gap-6 md:grid-cols-2"
          >
            {units.map((unit, index) => (
              <motion.div
                key={unit.publicCode}
                variants={{
                  hidden: { opacity: 0, y: 36, rotateX: 4 },
                  show: {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                style={{ transformPerspective: 900 }}
              >
                <ApartmentCard
                  unit={unit}
                  locale={locale}
                  search
                  index={index}
                />
              </motion.div>
            ))}
          </motion.div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-[30px] border border-black/8 bg-[#fffdf8] p-12 text-center shadow-sm"
        >
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-[#f3e8dc] text-2xl">
            ⌁
          </div>
          <h2 className="mt-5 font-display text-3xl font-semibold">
            {vi ? "Chưa tìm thấy căn phù hợp" : "No matching stay just yet"}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-muted">
            {vi
              ? "Thử thay đổi ngày ở hoặc giảm số khách để khám phá thêm lựa chọn."
              : "Try different dates or fewer guests to discover more options."}
          </p>
        </motion.div>
      )}
    </motion.section>
  );
}
