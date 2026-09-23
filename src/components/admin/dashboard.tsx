"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarCheck,
  CalendarDays,
  CreditCard,
  Hotel,
  Plus,
  Wallet,
} from "lucide-react";
import { Dashboard, money, date } from "./admin-types";
import { DataState, Heading, useData } from "./admin-ui";
import { BookingTable } from "./booking-manager";
import { useAdmin } from "./admin-shell";
export function AdminDashboard() {
  const query = useData<Dashboard>("dashboard");
  const [tab, setTab] = useState("arrivals");
  const { permissions } = useAdmin();
  const d = query.data;
  const occupancy = d?.units ? Math.round((d.occupied / d.units) * 100) : 0;
  return (
    <>
      <Heading
        eyebrow="ABC APARTMENT / TỔNG QUAN"
        title="Tổng quan vận hành"
        description="Theo dõi công suất, thanh toán và lịch đón khách trong ngày."
        action={
          <>
            {d && (
              <span className="admin-date">
                <CalendarDays size={16} />
                {date(d.today)}
              </span>
            )}
            {permissions.includes("booking.read") && (
              <Link className="admin-button" href="/admin/bookings">
                <Plus size={17} />
                Quản lý booking
              </Link>
            )}
          </>
        }
      />
      <DataState {...query}>
        {d && (
          <>
            <section className="admin-operations-strip"><div><CalendarDays size={21}/><span><b>Lịch vận hành hôm nay</b><small>{date(d.today)} · Giờ Việt Nam</small></span></div><div><strong>{d.arrivals.length}</strong><span>Nhận phòng</span></div><div><strong>{d.departures.length}</strong><span>Trả phòng</span></div><div><strong>{d.units - d.occupied}</strong><span>Căn chưa được đặt</span></div>{permissions.includes("availability.read") && <Link href="/admin/calendar">Mở lịch phòng <ArrowRight size={15}/></Link>}</section>
            <div className="admin-stats">
              {[
                {
                  label: "Booking trong tháng",
                  value: d.bookings,
                  detail: "Theo ngày tạo booking",
                  icon: CalendarCheck,
                  color: "green",
                },
                {
                  label: "Công suất hôm nay",
                  value: `${occupancy}%`,
                  detail: `${d.occupied} / ${d.units} căn hộ đang được đặt`,
                  icon: Hotel,
                  color: "blue",
                },
                {
                  label: "Thực thu trong tháng",
                  value: d.revenue.length
                    ? d.revenue
                        .map((r) => money(r._sum.amount ?? 0, r.currency))
                        .join(" · ")
                    : money(0),
                  detail: "Giao dịch đã thu, chưa trừ hoàn tiền",
                  icon: Wallet,
                  color: "orange",
                },
                {
                  label: "Chờ thanh toán",
                  value: d.pending,
                  detail: "Booking cần theo dõi tiền cọc",
                  icon: CreditCard,
                  color: "purple",
                },
              ].map((s) => (
                <article className="admin-stat" key={s.label}>
                  <div>
                    <span>{s.label}</span>
                    <i className={s.color}>
                      <s.icon size={20} />
                    </i>
                  </div>
                  <strong>{s.value}</strong>
                  <small>{s.detail}</small>
                </article>
              ))}
            </div>
            <div className="admin-dashboard-bottom">
              <section className="admin-panel">
                <div className="admin-panel-heading">
                  <div>
                    <h2>Lịch đón & tiễn khách</h2>
                    <p>Những booking cần bạn chăm sóc hôm nay.</p>
                  </div>
                  <Link href="/admin/bookings" aria-label="Tất cả booking">
                    <ArrowUpRight size={20} />
                  </Link>
                </div>
                <div className="admin-tabs">
                  <button
                    className={tab === "arrivals" ? "active" : ""}
                    onClick={() => setTab("arrivals")}
                  >
                    Nhận phòng <b>{d.arrivals.length}</b>
                  </button>
                  <button
                    className={tab === "departures" ? "active" : ""}
                    onClick={() => setTab("departures")}
                  >
                    Trả phòng <b>{d.departures.length}</b>
                  </button>
                </div>
                <BookingTable
                  rows={tab === "arrivals" ? d.arrivals : d.departures}
                />
              </section>
              <section className="admin-panel admin-checklist">
                <span className="admin-overline">VẬN HÀNH MỖI NGÀY</span>
                <h2>Công việc cần xử lý</h2>
                {[
                  {
                    n: "01",
                    title: "Kiểm tra tiền cọc",
                    desc: `${d.pending} booking đang chờ thanh toán`,
                    href: "/admin/bookings",
                    p: "booking.read",
                  },
                  {
                    n: "02",
                    title: "Chuẩn bị phòng",
                    desc: "Kiểm tra lịch trống và bảo trì",
                    href: "/admin/calendar",
                    p: "availability.read",
                  },
                  {
                    n: "03",
                    title: "Đối soát thu chi",
                    desc: "Kiểm tra giao dịch đã ghi nhận",
                    href: "/admin/payments",
                    p: "payment.read",
                  },
                ]
                  .filter((a) => permissions.includes(a.p))
                  .map((a) => (
                    <Link key={a.n} href={a.href}>
                      <span>{a.n}</span>
                      <div>
                        <b>{a.title}</b>
                        <small>{a.desc}</small>
                      </div>
                      <ArrowRight size={16} />
                    </Link>
                  ))}
              </section>
            </div>
          </>
        )}
      </DataState>
    </>
  );
}
