"use client";
import * as Popover from "@radix-ui/react-popover";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Search,
  Users,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { StayLoader } from "@/components/ui/stay-loader";
const pad = (n: number) => String(n).padStart(2, "0");
const iso = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parse = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const fmt = (s: string, locale: string) =>
  s
    ? new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(parse(s))
    : "—";
export function HomeSearch({ locale }: { locale: "vi" | "en" }) {
  const vi = locale === "vi",
    router = useRouter(),
    today = iso(new Date());
  const [start, setStart] = useState(""),
    [end, setEnd] = useState(""),
    [guests, setGuests] = useState(2),
    [loading, setLoading] = useState(false);
  const nights = useMemo(
    () =>
      start && end
        ? Math.round((parse(end).getTime() - parse(start).getTime()) / 86400000)
        : 0,
    [start, end],
  );
  function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    router.push(
      `/${locale}/${vi ? "tim-kiem" : "search"}?location=tt-apartment&checkIn=${start}&checkOut=${end}&guests=${guests}`,
    );
  }
  return (
    <motion.form
      id="booking"
      onSubmit={submit}
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.65, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-20 grid rounded-[24px] border border-black/5 bg-white p-2 text-[#153128] shadow-[0_30px_90px_rgba(25,45,36,.18)] md:grid-cols-[1.65fr_.8fr_auto]"
    >
      <Popover.Root>
        <Popover.Trigger asChild>
          <button
            type="button"
            className="group flex min-h-[76px] items-center gap-4 rounded-[18px] px-5 text-left hover:bg-[#f5f2eb]"
          >
            <span className="grid size-11 place-items-center rounded-full bg-[#e7eee9] text-[#1d5843]">
              <CalendarDays size={19} />
            </span>
            <span className="min-w-0 grow">
              <b className="block text-[10px] uppercase tracking-[.18em] text-[#65746d]">
                {vi ? "Kỳ lưu trú" : "Your stay"}
              </b>
              <span className="mt-1 flex items-center gap-3 font-display text-lg sm:text-xl">
                <span>
                  {start ? fmt(start, locale) : vi ? "Nhận phòng" : "Check-in"}
                </span>
                <ArrowRight size={16} className="shrink-0 text-[#bf7141]" />
                <span>
                  {end ? fmt(end, locale) : vi ? "Trả phòng" : "Check-out"}
                </span>
              </span>
            </span>
            {nights > 0 && (
              <span className="hidden rounded-full bg-[#153128] px-3 py-1.5 text-xs font-bold text-white sm:block">
                {nights} {vi ? "đêm" : "nights"}
              </span>
            )}
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={12}
            collisionPadding={12}
            className="z-50 w-[min(920px,calc(100vw-24px))] overflow-hidden rounded-[30px] border border-black/8 bg-white shadow-[0_35px_110px_rgba(0,0,0,.25)]"
            asChild
          >
            <motion.div
              initial={{ opacity: 0, y: -14, scale: 0.975 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <RangeCalendar
                locale={locale}
                today={today}
                start={start}
                end={end}
                onChange={(a, b) => {
                  setStart(a);
                  setEnd(b);
                }}
              />
              <div className="flex flex-wrap items-center justify-between gap-4 border-t bg-[#fbfaf7] px-6 py-4">
                <div>
                  <b className="text-sm">
                    {nights > 0
                      ? vi
                        ? `${nights} đêm tại TT Apartment`
                        : `${nights} nights at TT Apartment`
                      : vi
                        ? "Chọn ngày nhận và trả phòng"
                        : "Select check-in and check-out"}
                  </b>
                  {start && (
                    <p className="mt-1 text-xs text-muted">
                      {fmt(start, locale)} {end && `— ${fmt(end, locale)}`}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStart("");
                      setEnd("");
                    }}
                    className="rounded-full px-4 py-2.5 text-sm font-bold text-muted"
                  >
                    {vi ? "Xóa" : "Clear"}
                  </button>
                  <Popover.Close
                    disabled={!start || !end}
                    className="rounded-full bg-[#153128] px-6 py-2.5 text-sm font-bold text-white disabled:opacity-35"
                  >
                    {vi ? "Áp dụng" : "Apply"}
                  </Popover.Close>
                </div>
              </div>
            </motion.div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      <Popover.Root>
        <Popover.Trigger asChild>
          <button
            type="button"
            className="flex min-h-[76px] items-center gap-4 border-t border-black/5 px-5 text-left md:border-l md:border-t-0"
          >
            <Users size={20} />
            <span className="grow">
              <b className="block text-[10px] uppercase tracking-[.18em] text-[#65746d]">
                {vi ? "Số khách" : "Guests"}
              </b>
              <span className="mt-1 block font-display text-xl">
                {guests} {vi ? "khách" : "guests"}
              </span>
            </span>
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="end"
            sideOffset={12}
            className="z-50 w-72 rounded-3xl bg-white p-5 shadow-2xl"
          >
            <p className="text-sm font-bold">
              {vi ? "Số khách lưu trú" : "Guests staying"}
            </p>
            <div className="mt-5 flex items-center justify-between">
              <span className="text-sm text-[#65746d]">
                {vi ? "Tối đa 6 khách" : "Up to 6 guests"}
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="grid size-9 place-items-center rounded-full border"
                >
                  <Minus size={15} />
                </button>
                <AnimatePresence mode="popLayout">
                  <motion.b
                    key={guests}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                  >
                    {guests}
                  </motion.b>
                </AnimatePresence>
                <button
                  type="button"
                  onClick={() => setGuests(Math.min(6, guests + 1))}
                  className="grid size-9 place-items-center rounded-full border"
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      <motion.button
        layout
        whileHover={{ scale: 1.025 }}
        whileTap={{ scale: 0.97 }}
        disabled={!start || !end || loading}
        className="m-1 flex min-h-[68px] min-w-48 items-center justify-center gap-2 overflow-hidden rounded-[18px] bg-[#bf7141] px-7 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-45"
      >
        {loading ? (
          <StayLoader compact label={vi ? "Đang tìm phòng" : "Finding stays"} />
        ) : (
          <>
            <Search size={18} />
            {vi ? "Xem phòng trống" : "View rooms"}
          </>
        )}
      </motion.button>
    </motion.form>
  );
}

function RangeCalendar({
  locale,
  today,
  start,
  end,
  onChange,
}: {
  locale: "vi" | "en";
  today: string;
  start: string;
  end: string;
  onChange: (start: string, end: string) => void;
}) {
  const base = new Date();
  base.setDate(1);
  const [month, setMonth] = useState(base),
    [hover, setHover] = useState("");
  const vi = locale === "vi";
  function pick(day: string) {
    if (day < today) return;
    if (!start || end) {
      onChange(day, "");
      return;
    }
    if (day <= start) {
      onChange(day, "");
      return;
    }
    onChange(start, day);
  }
  const next = new Date(month.getFullYear(), month.getMonth() + 1, 1);
  return (
    <div>
      <div className="flex items-center justify-between border-b px-5 py-4">
        <button
          type="button"
          onClick={() =>
            setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
          }
          className="grid size-11 place-items-center rounded-full hover:bg-black/5"
          aria-label={vi ? "Tháng trước" : "Previous month"}
        >
          <ChevronLeft />
        </button>
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#bf7141]">
            {vi ? "Chọn kỳ lưu trú" : "Select your stay"}
          </p>
          <b className="mt-1 block font-display text-2xl">
            {start && !end
              ? vi
                ? "Chọn ngày trả phòng"
                : "Choose check-out"
              : vi
                ? "Chọn ngày nhận phòng"
                : "Choose check-in"}
          </b>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onChange("", "")}
            className="hidden px-3 text-xs font-bold text-muted sm:block"
          >
            {vi ? "Đặt lại" : "Reset"}
          </button>
          <Popover.Close
            className="grid size-11 place-items-center rounded-full hover:bg-black/5"
            aria-label={vi ? "Đóng" : "Close"}
          >
            <X size={19} />
          </Popover.Close>
          <button
            type="button"
            onClick={() =>
              setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
            }
            className="grid size-11 place-items-center rounded-full hover:bg-black/5"
            aria-label={vi ? "Tháng sau" : "Next month"}
          >
            <ChevronRight />
          </button>
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${month.getFullYear()}-${month.getMonth()}`}
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -18 }}
          transition={{ duration: 0.2 }}
          className="grid gap-7 p-5 sm:grid-cols-2"
        >
          <Month
            date={month}
            locale={locale}
            today={today}
            start={start}
            end={end}
            hover={hover}
            onHover={setHover}
            onPick={pick}
          />
          <div className="hidden sm:block">
            <Month
              date={next}
              locale={locale}
              today={today}
              start={start}
              end={end}
              hover={hover}
              onHover={setHover}
              onPick={pick}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
function Month({
  date,
  locale,
  today,
  start,
  end,
  hover,
  onHover,
  onPick,
}: {
  date: Date;
  locale: "vi" | "en";
  today: string;
  start: string;
  end: string;
  hover: string;
  onHover: (v: string) => void;
  onPick: (v: string) => void;
}) {
  const vi = locale === "vi",
    year = date.getFullYear(),
    month = date.getMonth(),
    first = new Date(year, month, 1).getDay(),
    days = new Date(year, month + 1, 0).getDate(),
    cells = [
      ...Array(first).fill(null),
      ...Array.from({ length: days }, (_, i) => i + 1),
    ];
  const rangeEnd = end || (start && hover > start ? hover : "");
  return (
    <section>
      <h3 className="mb-4 text-center font-display text-2xl font-semibold">
        {vi
          ? `Tháng ${month + 1}`
          : new Intl.DateTimeFormat("en-US", { month: "long" }).format(
              date,
            )}{" "}
        <span className="text-muted">· {year}</span>
      </h3>
      <div className="grid grid-cols-7 text-center text-xs font-bold uppercase text-muted">
        {(vi
          ? ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]
          : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        ).map((x) => (
          <span key={x} className="py-2">
            {x}
          </span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7">
        {cells.map((day, i) => {
          if (!day) return <span key={`e${i}`} className="aspect-square" />;
          const value = iso(new Date(year, month, day)),
            past = value < today,
            edge = value === start || value === end,
            inRange = Boolean(
              start && rangeEnd && value > start && value < rangeEnd,
            ),
            preview = !end && inRange;
          return (
            <button
              key={value}
              type="button"
              disabled={past}
              onMouseEnter={() => onHover(value)}
              onFocus={() => onHover(value)}
              onClick={() => onPick(value)}
              aria-label={fmt(value, locale)}
              className={`relative aspect-square text-sm transition ${past ? "cursor-not-allowed text-black/20" : edge ? "z-10 rounded-xl bg-[#0d7890] font-bold text-white shadow-lg" : inRange ? `${preview ? "bg-[#e4f0f1]" : "bg-[#c9e0e4]"} text-[#153128]` : "hover:rounded-xl hover:bg-[#f1eee7]"}`}
            >
              <span>{day}</span>
              {value === today && (
                <span
                  className={`absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full ${edge ? "bg-white" : "bg-[#bf7141]"}`}
                />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
