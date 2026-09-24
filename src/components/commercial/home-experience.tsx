"use client";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  SlidersHorizontal,
  Building2,
  BedDouble,
  Users,
  Maximize,
  MapPin,
  Menu,
  X,
  CalendarCheck,
  ReceiptText,
  HeartHandshake,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { HomeSearch } from "@/components/home-search";
import { AccountMenu } from "@/components/auth/account-menu";
import {
  FavoriteButton,
  useFavorites,
} from "@/features/favorites/favorite-button";
import type { Unit } from "@/lib/api/units";
import "./guest-home.css";
export function HomeExperience({
  locale,
  children,
}: {
  locale: "vi" | "en";
  children: ReactNode;
}) {
  const vi = locale === "vi";
  const [open, setOpen] = useState(false);
  const nav = [
    ["#stays", vi ? "Chọn căn hộ" : "Apartments"],
    ["#why", vi ? "Vì sao chọn ABC" : "Why ABC"],
    ["#how", vi ? "Cách đặt phòng" : "How to book"],
  ];
  return (
    <div className="guest-home">
      <div className="guest-announcement">
        {vi
          ? "Đà Nẵng, Việt Nam · Căn hộ cho kỳ nghỉ theo cách của bạn"
          : "Da Nang, Vietnam · A stay on your terms"}
      </div>
      <header className="guest-header">
        <div className="guest-wrap guest-header-inner">
          <Link href={`/${locale}`} className="guest-brand">
            <span>
              ABC<span className="guest-brand-dot">.</span>
            </span>
            <small>
              APARTMENT
              <br />
              DA NANG
            </small>
          </Link>
          <nav className="guest-desktop-nav">
            {nav.map(([href, label]) => (
              <a key={href} href={href}>
                {label}
              </a>
            ))}
          </nav>
          <div className="guest-account">
            <AccountMenu locale={locale} />
            <Link href={`/${vi ? "en" : "vi"}`} className="guest-language">
              {vi ? "EN" : "VI"}
            </Link>
            <button
              className="guest-menu"
              aria-label={vi ? "Menu điều hướng" : "Navigation menu"}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="guest-mobile-nav">
            {nav.map(([href, label]) => (
              <a onClick={() => setOpen(false)} key={href} href={href}>
                {label}
                <ArrowUpRight size={16} />
              </a>
            ))}
          </nav>
        )}
      </header>
      <main>
        <section className="guest-wrap guest-hero">
          <div className="guest-hero-copy">
            <p className="guest-eyebrow">
              <span /> STAY LOCAL. LIVE MORE.
            </p>
            <h1>
              {vi ? (
                <>
                  Một chốn riêng.
                  <br />
                  Cả Đà Nẵng
                  <br />
                  <em>để khám phá.</em>
                </>
              ) : (
                <>
                  Your own space.
                  <br />A whole city
                  <br />
                  <em>to discover.</em>
                </>
              )}
            </h1>
            <p className="guest-lead">
              {vi
                ? "Chọn căn hộ vừa với chuyến đi, xem giá theo ngày và đặt trực tiếp. Ít thời gian tìm kiếm, nhiều thời gian tận hưởng."
                : "Find a space that fits, check pricing for your dates and book directly. Less searching, more enjoying."}
            </p>
            <a className="guest-primary" href="#booking">
              {vi ? "Tìm căn hộ cho tôi" : "Find my stay"}
              <ArrowUpRight size={20} />
            </a>
            <div className="guest-hero-note">
              <Check size={16} />
              {vi
                ? "Xem tổng chi phí trước khi đặt"
                : "Review the total before booking"}
            </div>
          </div>
          <div className="guest-hero-art">
            <Image
              src="/tt-apartment-hero.png"
              alt={
                vi
                  ? "Hình minh họa không gian ABC Apartment"
                  : "Illustration of ABC Apartment"
              }
              fill
              preload
              sizes="(min-width: 900px) 50vw, 100vw"
              className="guest-hero-image"
            />
            <div className="guest-art-label">
              <MapPin size={17} />
              <span>
                Đà Nẵng, Việt Nam
                <small>
                  {vi
                    ? "Nhịp phố. Hơi thở biển."
                    : "City rhythm. Coastal calm."}
                </small>
              </span>
            </div>
            <span className="guest-art-caption">
              {vi ? "Hình ảnh minh họa" : "Illustrative image"}
            </span>
          </div>
        </section>
        <section className="guest-wrap guest-search-area">
          <div className="guest-section-kicker">
            <span>01 / {vi ? "BẮT ĐẦU CHUYẾN ĐI" : "PLAN YOUR STAY"}</span>
            <p>
              {vi
                ? "Chọn ngày để kiểm tra phòng trống và giá."
                : "Choose dates to check availability and pricing."}
            </p>
          </div>
          <HomeSearch locale={locale} />
        </section>
        <section id="why" className="guest-wrap guest-benefits">
          {(vi
            ? [
                [
                  ReceiptText,
                  "Biết rõ trước khi đặt",
                  "Xem sức chứa, diện tích, giá và phụ phí để chọn đúng ngân sách.",
                ],
                [
                  Building2,
                  "Không gian vừa nhu cầu",
                  "Từ chuyến đi hai người đến kỳ nghỉ cùng gia đình. Lọc theo nhu cầu của bạn.",
                ],
                [
                  CalendarCheck,
                  "Chủ động lịch lưu trú",
                  "Kiểm tra phòng theo ngày nhận, trả và số khách trong cùng một bước.",
                ],
              ]
            : [
                [
                  ReceiptText,
                  "Clarity before you book",
                  "Compare capacity, space, rates and fees to find your fit.",
                ],
                [
                  Building2,
                  "Room for your plans",
                  "From a trip for two to a family holiday. Filter for your needs.",
                ],
                [
                  CalendarCheck,
                  "Plan on your terms",
                  "Check dates and guest capacity in one place.",
                ],
              ]
          ).map(([Icon, title, copy]) => {
            const I = Icon as typeof Building2;
            return (
              <article key={String(title)}>
                <I size={25} />
                <h3>{String(title)}</h3>
                <p>{String(copy)}</p>
              </article>
            );
          })}
        </section>
        <section id="stays" className="guest-catalog-section">
          <div className="guest-wrap">
            <div className="guest-section-head">
              <div>
                <p className="guest-eyebrow">
                  02 / {vi ? "TÌM KHÔNG GIAN CỦA BẠN" : "FIND YOUR SPACE"}
                </p>
                <h2>
                  {vi
                    ? "Đi cùng ai, cũng có chỗ."
                    : "A space for your kind of trip."}
                </h2>
              </div>
              <p>
                {vi
                  ? "So sánh thông tin thực. Lưu căn bạn thích. Chọn ngày để biết giá chính xác."
                  : "Compare the details. Save your favourites. Choose dates for an exact quote."}
              </p>
            </div>
            {children}
          </div>
        </section>
        <section id="how" className="guest-wrap guest-how">
          <div>
            <p className="guest-eyebrow">
              03 / {vi ? "ĐẶT PHÒNG DỄ DÀNG" : "BOOK WITH CLARITY"}
            </p>
            <h2>
              {vi ? (
                <>
                  Từ một lựa chọn.
                  <br />
                  Đến một kỳ nghỉ.
                </>
              ) : (
                <>
                  From finding a space.
                  <br />
                  To feeling at home.
                </>
              )}
            </h2>
            <a href="#booking" className="guest-text-link">
              {vi ? "Bắt đầu tìm phòng" : "Start searching"}
              <ArrowRight size={18} />
            </a>
          </div>
          <div className="guest-steps">
            {(vi
              ? [
                  [
                    "Chọn ngày & số khách",
                    "Tìm những căn còn trống cho đúng lịch trình.",
                  ],
                  [
                    "Xem căn & tổng chi phí",
                    "Kiểm tra hình ảnh, tiện ích, tiền cọc và chính sách trước khi đặt.",
                  ],
                  [
                    "Đặt phòng & theo dõi xác nhận",
                    "Hoàn tất thông tin và thanh toán theo hướng dẫn. Giữ mã booking để tra cứu.",
                  ],
                ]
              : [
                  [
                    "Choose dates & guests",
                    "Find available apartments for your itinerary.",
                  ],
                  [
                    "Review your stay & costs",
                    "Check photos, amenities, deposit and policies before booking.",
                  ],
                  [
                    "Book & follow confirmation",
                    "Complete your details and payment instructions. Keep your booking reference.",
                  ],
                ]
            ).map(([title, copy], i) => (
              <article key={title}>
                <span>0{i + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="guest-wrap guest-faq">
          <h2>{vi ? "Trước khi bạn đặt" : "Before you book"}</h2>
          {(vi
            ? [
                [
                  "Giá hiển thị đã là tổng tiền chưa?",
                  "Giá trên danh sách là giá cơ bản mỗi đêm. Chọn ngày và số khách để xem báo giá cùng phụ phí, tiền cọc và tổng thanh toán.",
                ],
                [
                  "Làm sao biết căn hộ còn trống?",
                  "Dùng mục tìm phòng với ngày nhận, ngày trả và số khách. Hệ thống kiểm tra lại tình trạng phòng khi tạo booking.",
                ],
                [
                  "Tôi có thể lưu lại căn hộ yêu thích không?",
                  "Nhấn biểu tượng trái tim trên căn hộ. Danh sách được lưu trên trình duyệt này để bạn quay lại so sánh.",
                ],
              ]
            : [
                [
                  "Is the listed price the total?",
                  "The list shows a base nightly rate. Choose dates and guests to see fees, deposit and total payment.",
                ],
                [
                  "How do I check availability?",
                  "Search with check-in, check-out and guest count. Availability is checked again when your booking is created.",
                ],
                [
                  "Can I save an apartment?",
                  "Select the heart on an apartment. Your favourites are stored in this browser for your next visit.",
                ],
              ]
          ).map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <span>+</span>
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </section>
        <section className="guest-wrap guest-closing">
          <HeartHandshake size={34} />
          <h2>
            {vi
              ? "Lịch trình của bạn. Không gian của bạn."
              : "Your itinerary. Your space."}
          </h2>
          <a href="#booking" className="guest-primary">
            {vi ? "Khám phá phòng trống" : "Find available stays"}
            <ArrowUpRight size={19} />
          </a>
        </section>
      </main>
      <footer className="guest-footer guest-wrap">
        <b>ABC APARTMENT.</b>
        <span>Đà Nẵng · Việt Nam</span>
        <a href="#how">{vi ? "Hướng dẫn đặt phòng" : "Booking guide"}</a>
      </footer>
    </div>
  );
}
export function HomeCatalog({
  units,
  locale,
}: {
  units: Unit[];
  locale: "vi" | "en";
}) {
  const vi = locale === "vi";
  const saved = useFavorites();
  const [filter, setFilter] = useState("all"),
    [sort, setSort] = useState("default");
  const visible = units
    .filter(
      (u) =>
        filter === "all" ||
        (filter === "saved"
          ? saved.includes(u.publicCode)
          : filter === "couple"
            ? u.maxGuests >= 2 && u.bedroomCount <= 1
            : filter === "family"
              ? u.maxGuests >= 4
              : u.viewType === "OCEAN"),
    )
    .sort((a, b) =>
      sort === "asc"
        ? a.basePrice - b.basePrice
        : sort === "space"
          ? b.area - a.area
          : 0,
    );
  return (
    <>
      <div className="guest-filters">
        <div role="group" aria-label={vi ? "Lọc căn hộ" : "Filter apartments"}>
          {[
            ["all", vi ? "Tất cả" : "All stays"],
            ["couple", vi ? "Đi hai người" : "For two"],
            ["family", vi ? "Cùng gia đình" : "For families"],
            ["ocean", vi ? "Hướng biển" : "Ocean view"],
            ["saved", vi ? "Đã lưu" : "Saved"],
          ].map(([id, label]) => (
            <button
              aria-pressed={filter === id}
              className={filter === id ? "active" : ""}
              onClick={() => setFilter(id)}
              key={id}
            >
              {label}
            </button>
          ))}
        </div>
        <label>
          <SlidersHorizontal size={16} />
          <select
            aria-label={vi ? "Sắp xếp căn hộ" : "Sort apartments"}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="default">
              {vi ? "Thứ tự mặc định" : "Default order"}
            </option>
            <option value="asc">
              {vi ? "Giá tăng dần" : "Price: low to high"}
            </option>
            <option value="space">
              {vi ? "Diện tích lớn nhất" : "Most spacious"}
            </option>
          </select>
        </label>
      </div>
      <p className="guest-result-count" aria-live="polite">
        {visible.length}{" "}
        {vi
          ? "căn hộ · Giá cơ bản mỗi đêm, chưa gồm phụ phí"
          : "apartments · Base nightly prices, fees excluded"}
      </p>
      <div className="guest-room-grid">
        {visible.map((u) => {
          const name = vi ? u.nameVi : u.nameEn;
          const href = `/${locale}/${vi ? "du-an" : "properties"}/panoma/${vi ? u.slugVi : u.slugEn}`;
          return (
            <article className="guest-room" key={u.publicCode}>
              <div className="guest-room-photo">
                <Link href={href} aria-label={name}>
                  {u.media[0]?.media.url ? (
                    <Image
                      fill
                      src={u.media[0].media.url}
                      alt={name}
                      sizes="(min-width:1000px) 33vw,(min-width:640px) 50vw,100vw"
                    />
                  ) : (
                    <div className="guest-photo-empty">
                      <Building2 size={42} />
                      <span>
                        {vi ? "Ảnh đang cập nhật" : "Photos coming soon"}
                      </span>
                    </div>
                  )}
                </Link>
                <span className="guest-room-tag">
                  {u.viewType === "OCEAN"
                    ? vi
                      ? "Hướng biển"
                      : "Ocean view"
                    : `${u.bedroomCount} ${vi ? "phòng ngủ" : "bedrooms"}`}
                </span>
                <div className="guest-favourite">
                  <FavoriteButton
                    code={u.publicCode}
                    label={vi ? `Lưu ${name}` : `Save ${name}`}
                  />
                </div>
              </div>
              <div className="guest-room-body">
                <p className="guest-room-location">
                  <MapPin size={13} />
                  {u.property.name}
                </p>
                <Link href={href}>
                  <h3>{name}</h3>
                </Link>
                <div className="guest-room-facts">
                  <span>
                    <Users size={15} />
                    {u.maxGuests} {vi ? "khách" : "guests"}
                  </span>
                  <span>
                    <BedDouble size={15} />
                    {u.bedCount} {vi ? "giường" : "beds"}
                  </span>
                  <span>
                    <Maximize size={14} />
                    {u.area} m²
                  </span>
                </div>
                <div className="guest-room-bottom">
                  <p>
                    <small>{vi ? "Mỗi đêm từ" : "From / night"}</small>
                    <b>
                      {new Intl.NumberFormat(vi ? "vi-VN" : "en-US", {
                        style: "currency",
                        currency: u.currency,
                        maximumFractionDigits: 0,
                      }).format(u.basePrice)}
                    </b>
                  </p>
                  <Link
                    href={href}
                    aria-label={`${vi ? "Xem" : "View"} ${name}`}
                  >
                    <ArrowUpRight size={22} />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      {!visible.length && (
        <div className="guest-empty">
          <Building2 size={30} />
          <h3>
            {vi ? "Chưa tìm thấy căn hộ phù hợp" : "No matching apartments"}
          </h3>
          <p>
            {vi
              ? "Thử đổi bộ lọc hoặc quay lại sau khi danh mục được cập nhật."
              : "Try another filter or check back when the catalogue is updated."}
          </p>
          <button className="guest-primary" onClick={() => setFilter("all")}>
            {vi ? "Xem tất cả" : "Show all"}
          </button>
        </div>
      )}
    </>
  );
}
