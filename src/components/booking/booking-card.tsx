"use client";
import * as Popover from "@radix-ui/react-popover";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  MoonStar,
  Users,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { StayLoader } from "@/components/ui/stay-loader";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { quoteSchema, type PriceQuote } from "@/lib/api/pricing";
const pad = (n: number) => String(n).padStart(2, "0"),
  iso = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
  parse = (s: string) => {
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y, m - 1, d);
  },
  format = (s: string, vi: boolean) =>
    s
      ? new Intl.DateTimeFormat(vi ? "vi-VN" : "en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(parse(s))
      : vi
        ? "Chọn ngày"
        : "Choose date";
export function BookingCard({
  locale,
  basePrice,
  currency,
  publicCode,
  maxGuests,
  initialCheckIn,
  initialCheckOut,
  initialGuests = 2,
}: {
  locale: "vi" | "en";
  basePrice: number;
  currency: string;
  publicCode: string;
  maxGuests: number;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
}) {
  const vi = locale === "vi",
    router = useRouter(),
    pathname = usePathname(),
    currentSearch = useSearchParams(),
    [quote, setQuote] = useState<PriceQuote>(),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(false),
    [accountCheck, setAccountCheck] = useState(false),
    [accountDialog, setAccountDialog] = useState<"login" | "profile" | null>(null),
    [guests, setGuests] = useState(Math.min(initialGuests, maxGuests)),
    [start, setStart] = useState(initialCheckIn ?? ""),
    [end, setEnd] = useState(initialCheckOut ?? "");
  const nights = useMemo(
    () =>
      start && end
        ? Math.round((parse(end).getTime() - parse(start).getTime()) / 86400000)
        : 0,
    [start, end],
  );
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const f = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/pricing/quote", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            publicCode,
            checkIn: start,
            checkOut: end,
            guests: Number(f.get("guests")),
          }),
        }),
        body: unknown = await response.json();
      if (!response.ok)
        throw new Error(
          vi
            ? "Không thể báo giá cho ngày đã chọn."
            : "Unable to quote the selected dates.",
        );
      const parsed = quoteSchema.safeParse((body as { data?: unknown }).data);
      if (!parsed.success)
        throw new Error(
          vi ? "Phản hồi báo giá không hợp lệ." : "Invalid pricing response.",
        );
      setQuote(parsed.data);
    } catch (e) {
      setQuote(undefined);
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }
  async function continueBooking() {
    if (!quote?.quoteId) return;
    setAccountCheck(true);
    setError("");
    try {
      const response = await fetch("/api/auth/session", { cache: "no-store" });
      if (response.status === 401) return setAccountDialog("login");
      const body = (await response.json()) as { data?: { profileComplete?: boolean } };
      if (!response.ok) throw new Error(vi ? "Không thể kiểm tra tài khoản." : "Unable to check your account.");
      if (!body.data?.profileComplete) return setAccountDialog("profile");
      const query = new URLSearchParams({ publicCode, quoteId: quote.quoteId, checkIn: start, checkOut: end, guests: String(guests), nights: String(quote.nights), total: quote.total, deposit: quote.requiredDeposit, currency: quote.currency });
      router.push(`/${locale}/${vi ? "xac-nhan-dat-phong" : "checkout"}?${query}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Request failed");
    } finally {
      setAccountCheck(false);
    }
  }
  return (
    <aside className="rounded-[30px] border border-black/10 bg-[#fffdf8] p-6 shadow-[0_24px_80px_rgba(25,43,35,.13)]">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#a35331]">
          {vi ? "Đặt trực tiếp" : "Book direct"}
        </p>
        <span className="rounded-full bg-[#e5eee8] px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-[#173f34]">
          {vi ? "Giá tốt nhất" : "Best rate"}
        </span>
      </div>
      <p className="mt-4">
        <b className="font-display text-4xl font-medium">
          {new Intl.NumberFormat(vi ? "vi-VN" : "en-US").format(basePrice)}
        </b>{" "}
        <span className="text-xs text-muted">
          {currency} / {vi ? "đêm" : "night"}
        </span>
      </p>
      <form onSubmit={submit}>
        <Popover.Root>
          <div className="relative mt-7 grid gap-3">
            <div className="absolute left-[27px] top-14 h-[74px] w-px border-l border-dashed border-[#d9784b]/50" />
            <Popover.Trigger asChild>
              <button
                type="button"
                className="group flex items-center gap-4 rounded-[18px] border border-black/10 bg-white p-3.5 text-left transition duration-300 hover:-translate-y-0.5 hover:border-[#d9784b] hover:shadow-[0_10px_30px_rgba(217,120,75,.12)]"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#f5e8dd] text-[#a35331]">
                  <CalendarDays size={16} />
                </span>
                <span className="min-w-0 grow">
                  <span className="block text-[9px] font-bold uppercase tracking-[.14em] text-muted">
                    {vi ? "Nhận phòng" : "Check in"} · 14:00
                  </span>
                  <b
                    className={`mt-1 block text-sm ${start ? "" : "text-muted"}`}
                  >
                    {format(start, vi)}
                  </b>
                </span>
              </button>
            </Popover.Trigger>
            <Popover.Trigger asChild>
              <button
                type="button"
                className="group flex items-center gap-4 rounded-[18px] border border-black/10 bg-white p-3.5 text-left transition duration-300 hover:-translate-y-0.5 hover:border-[#173f34] hover:shadow-[0_10px_30px_rgba(23,63,52,.1)]"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#e5eee8] text-[#173f34]">
                  <MoonStar size={16} />
                </span>
                <span className="min-w-0 grow">
                  <span className="block text-[9px] font-bold uppercase tracking-[.14em] text-muted">
                    {vi ? "Trả phòng" : "Check out"} · 11:00
                  </span>
                  <b
                    className={`mt-1 block text-sm ${end ? "" : "text-muted"}`}
                  >
                    {format(end, vi)}
                  </b>
                </span>
                {nights > 0 && (
                  <span className="rounded-full bg-[#173f34] px-2.5 py-1 text-[10px] font-bold text-white">
                    {nights} {vi ? "đêm" : "nights"}
                  </span>
                )}
              </button>
            </Popover.Trigger>
            <label className="flex items-center gap-4 rounded-[18px] border border-black/10 bg-white p-3.5 transition focus-within:border-[#d9784b]">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#eeeae0] text-[#173f34]">
                <Users size={16} />
              </span>
              <span className="grow">
                <span className="block text-[9px] font-bold uppercase tracking-[.14em] text-muted">
                  {vi ? "Khách lưu trú" : "Guests"}
                </span>
                <select
                  name="guests"
                  value={guests}
                  onChange={(event) => setGuests(Number(event.target.value))}
                  className="mt-1 w-full bg-transparent text-sm font-semibold outline-none"
                >
                  {Array.from({ length: maxGuests }, (_, index) => index + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} {vi ? "khách" : "guests"}
                    </option>
                  ))}
                </select>
              </span>
            </label>
          </div>
          <Popover.Portal>
            <Popover.Content
              align="end"
              sideOffset={12}
              collisionPadding={12}
              className="z-50 w-[min(380px,calc(100vw-24px))] overflow-hidden rounded-[28px] border border-black/8 bg-[#fffdf8] shadow-[0_30px_100px_rgba(20,36,30,.24)]"
              asChild
            >
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <StayCalendar
                  vi={vi}
                  publicCode={publicCode}
                  start={start}
                  end={end}
                  onChange={(a, b) => {
                    setStart(a);
                    setEnd(b);
                    setQuote(undefined);
                  }}
                />
              </motion.div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
        <button
          disabled={loading || !start || !end}
          className="focus-ring group mt-4 flex min-h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-[#d9784b] px-6 font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#bd6038] disabled:cursor-not-allowed disabled:opacity-45"
        >
          {loading ? (
            <StayLoader compact label={vi ? "Đang kiểm tra" : "Checking"} />
          ) : (
            <>
              <span>{vi ? "Kiểm tra giá" : "Check price"}</span>
              <ArrowRight
                size={17}
                className="transition group-hover:translate-x-1"
              />
            </>
          )}
        </button>
      </form>
      {error && (
        <p
          role="alert"
          className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}
      {quote && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 space-y-3 border-t pt-5 text-sm"
        >
          <Line
            label={`${quote.nights} ${vi ? "đêm" : "nights"}`}
            value={money(quote.subtotal, quote.currency, vi)}
          />
          <Line
            label={vi ? "Phí vệ sinh" : "Cleaning fee"}
            value={money(quote.cleaningFee, quote.currency, vi)}
          />
          <Line
            label={vi ? "Phí dịch vụ" : "Service fee"}
            value={money(quote.serviceFee, quote.currency, vi)}
          />
          <Line
            label={vi ? "Tổng" : "Total"}
            value={money(quote.total, quote.currency, vi)}
            strong
          />
          <Line
            label={vi ? "Đặt cọc cần thanh toán" : "Required deposit"}
            value={money(quote.requiredDeposit, quote.currency, vi)}
            strong
          />
          <button type="button" onClick={continueBooking} disabled={accountCheck || !quote.quoteId} className="focus-ring mt-5 flex min-h-14 w-full items-center justify-center rounded-full bg-[#173f34] px-5 font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#0f3027] disabled:opacity-45">
            {accountCheck ? <StayLoader compact label={vi ? "Đang kiểm tra tài khoản" : "Checking account"} /> : vi ? "Tiếp tục đặt phòng" : "Continue booking"}
          </button>
        </motion.div>
      )}
      <p className="mt-4 text-center text-[11px] text-muted">
        {vi ? "Bạn chưa bị tính phí ở bước này" : "You won’t be charged yet"}
      </p>
      <Dialog open={accountDialog !== null} onOpenChange={(open) => !open && setAccountDialog(null)}>
        <DialogContent title={accountDialog === "login" ? (vi ? "Bạn cần đăng nhập" : "Sign in required") : (vi ? "Hoàn thiện thông tin cá nhân" : "Complete your profile")}>
          <p className="mt-3 text-sm leading-6 text-muted">
            {accountDialog === "login" ? (vi ? "Đăng nhập hoặc tạo tài khoản để tiếp tục đặt căn hộ này." : "Sign in or create an account to continue this booking.") : (vi ? "Vui lòng cập nhật họ tên và số điện thoại trước khi đặt phòng." : "Please add your name and phone number before booking.")}
          </p>
          <button type="button" onClick={() => {
            const returnTo = `${pathname}${currentSearch.size ? `?${currentSearch}` : ""}`;
            router.push(accountDialog === "login" ? `/${locale}/${vi ? "dang-nhap" : "login"}?returnTo=${encodeURIComponent(returnTo)}` : `/${locale}/${vi ? "tai-khoan/ho-so" : "account/profile"}?returnTo=${encodeURIComponent(returnTo)}`);
          }} className="mt-6 w-full rounded-full bg-[#173f34] px-5 py-3.5 font-bold text-white">
            {accountDialog === "login" ? (vi ? "Đi tới đăng nhập" : "Go to sign in") : (vi ? "Cập nhật ngay" : "Update now")}
          </button>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
function StayCalendar({
  vi,
  publicCode,
  start,
  end,
  onChange,
}: {
  vi: boolean;
  publicCode: string;
  start: string;
  end: string;
  onChange: (a: string, b: string) => void;
}) {
  const now = new Date(),
    initialMonth = start ? parse(start) : now,
    first = new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1),
    [month, setMonth] = useState(first),
    [hover, setHover] = useState(""),
    [availability, setAvailability] = useState<{
      key: string;
      unavailable: Set<string>;
      error: boolean;
    }>({ key: "", unavailable: new Set(), error: false }),
    today = iso(now),
    year = month.getFullYear(),
    m = month.getMonth(),
    offset = new Date(year, m, 1).getDay(),
    days = new Date(year, m + 1, 0).getDate(),
    cells = [
      ...Array(offset).fill(null),
      ...Array.from({ length: days }, (_, i) => i + 1),
    ],
    rangeEnd = end || (start && hover > start ? hover : "");
  const calendarKey = `${publicCode}:${year}-${m}`,
    availabilityLoading = availability.key !== calendarKey,
    availabilityError = !availabilityLoading && availability.error,
    unavailable = availabilityLoading ? new Set<string>() : availability.unavailable;
  useEffect(() => {
    const controller = new AbortController();
    const from = iso(new Date(year, m, 1));
    const to = iso(new Date(year, m + 1, 1));
    fetch(`/api/availability/calendar?${new URLSearchParams({ publicCode, from, to })}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        const body = (await response.json()) as { data?: { unavailableNights?: string[] } };
        if (!response.ok) throw new Error("Availability request failed");
        setAvailability({
          key: calendarKey,
          unavailable: new Set(body.data?.unavailableNights ?? []),
          error: false,
        });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setAvailability({ key: calendarKey, unavailable: new Set(), error: true });
      });
    return () => controller.abort();
  }, [calendarKey, m, publicCode, year]);

  const selectingCheckout = Boolean(start && !end);
  const rangeHasUnavailableNight = (checkOut: string) => {
    for (let cursor = parse(start); iso(cursor) < checkOut; cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 1)) {
      if (unavailable.has(iso(cursor))) return true;
    }
    return false;
  };
  function pick(value: string) {
    if (value < today || availabilityLoading || availabilityError) return;
    if (unavailable.has(value) && !selectingCheckout) return;
    if (selectingCheckout && value > start && rangeHasUnavailableNight(value)) return;
    if (!start || end || value <= start) onChange(value, "");
    else onChange(start, value);
  }
  return (
    <div>
      <div className="flex items-center justify-between border-b border-black/8 px-4 py-4">
        <button
          type="button"
          onClick={() => setMonth(new Date(year, m - 1, 1))}
          className="grid size-10 place-items-center rounded-full transition hover:bg-black/5"
          aria-label={vi ? "Tháng trước" : "Previous month"}
        >
          <ChevronLeft size={18} />
        </button>
        <div className="text-center">
          <p className="text-[9px] font-bold uppercase tracking-[.18em] text-[#a35331]">
            {!start || end
              ? vi
                ? "Chọn ngày nhận phòng"
                : "Choose check-in"
              : vi
                ? "Chọn ngày trả phòng"
                : "Choose check-out"}
          </p>
          <b className="mt-1 block font-display text-xl">
            {new Intl.DateTimeFormat(vi ? "vi-VN" : "en-US", {
              month: "long",
              year: "numeric",
            }).format(month)}
          </b>
        </div>
        <div className="flex">
          <Popover.Close
            className="grid size-10 place-items-center rounded-full transition hover:bg-black/5"
            aria-label={vi ? "Đóng" : "Close"}
          >
            <X size={17} />
          </Popover.Close>
          <button
            type="button"
            onClick={() => setMonth(new Date(year, m + 1, 1))}
            className="grid size-10 place-items-center rounded-full transition hover:bg-black/5"
            aria-label={vi ? "Tháng sau" : "Next month"}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${year}-${m}`}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.2 }}
          className="p-5"
        >
          <div className="grid grid-cols-7 text-center text-[9px] font-bold uppercase tracking-wider text-muted">
            {(vi
              ? ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]
              : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
            ).map((d) => (
              <span key={d} className="py-2">
                {d}
              </span>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7">
            {cells.map((day, index) => {
              if (!day)
                return <span key={`e${index}`} className="aspect-square" />;
              const value = iso(new Date(year, m, day)),
                past = value < today,
                busy = unavailable.has(value),
                disabled = past || availabilityLoading || availabilityError || (busy && !selectingCheckout),
                edge = value === start || value === end,
                inRange = Boolean(
                  start && rangeEnd && value > start && value < rangeEnd,
                );
              return (
                <button
                  type="button"
                  key={value}
                  disabled={disabled}
                  onMouseEnter={() => setHover(value)}
                  onFocus={() => setHover(value)}
                  onClick={() => pick(value)}
                  className={`relative aspect-square text-sm transition duration-200 ${past ? "cursor-not-allowed text-black/20" : busy ? selectingCheckout ? "rounded-full text-black/35 line-through hover:bg-[#f1e8dc]" : "cursor-not-allowed rounded-full bg-black/5 text-black/25 line-through" : edge ? "z-10 rounded-full bg-[#d9784b] font-bold text-white shadow-[0_7px_18px_rgba(217,120,75,.35)]" : inRange ? "bg-[#e5eee8] text-[#173f34] first:rounded-l-full last:rounded-r-full" : "rounded-full hover:bg-[#f1e8dc]"}`}
                >
                  {day}
                  {value === today && (
                    <i
                      className={`absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full ${edge ? "bg-white" : "bg-[#d9784b]"}`}
                    />
                  )}
                </button>
              );
            })}
          </div>
          {(availabilityLoading || availabilityError) && (
            <p className={`mt-3 text-center text-xs ${availabilityError ? "text-red-700" : "text-muted"}`}>
              {availabilityLoading
                ? vi ? "Đang tải lịch trống…" : "Loading availability…"
                : vi ? "Không thể tải lịch trống. Vui lòng thử lại." : "Unable to load availability. Please try again."}
            </p>
          )}
          <div className="mt-5 flex items-center justify-between border-t border-black/8 pt-4">
            <button
              type="button"
              onClick={() => onChange("", "")}
              className="text-xs font-bold text-muted underline underline-offset-4"
            >
              {vi ? "Đặt lại" : "Reset"}
            </button>
            <Popover.Close
              disabled={!start || !end || availabilityLoading}
              className="rounded-full bg-[#173f34] px-5 py-2.5 text-xs font-bold text-white disabled:opacity-30"
            >
              {end
                ? vi
                  ? `${Math.round((parse(end).getTime() - parse(start).getTime()) / 86400000)} đêm`
                  : `${Math.round((parse(end).getTime() - parse(start).getTime()) / 86400000)} nights`
                : vi
                  ? "Chọn đủ ngày"
                  : "Select both dates"}
            </Popover.Close>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
function Line({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className={`flex justify-between gap-4 ${strong ? "font-bold" : ""}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
function money(value: string, currency: string, vi: boolean) {
  return `${new Intl.NumberFormat(vi ? "vi-VN" : "en-US").format(Number(value))} ${currency}`;
}
