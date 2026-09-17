"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { ArrowUpRight, Building2, CalendarDays, ChartNoAxesCombined, ChevronRight, CreditCard, LayoutDashboard, LogOut, Menu, ShieldCheck, Users, X, ClipboardList, History, CircleHelp } from "lucide-react";
import { adminApi } from "./admin-types";
const navigation = [
  { label: "Tổng quan", href: "/admin", icon: LayoutDashboard, permission: "report.read", group: "KHÔNG GIAN LÀM VIỆC" },
  { label: "Đặt phòng", href: "/admin/bookings", icon: ClipboardList, permission: "booking.read" },
  { label: "Lịch phòng", href: "/admin/calendar", icon: CalendarDays, permission: "availability.read" },
  { label: "Khách hàng", href: "/admin/customers", icon: Users, permission: "customer.read" },
  { label: "Căn hộ", href: "/admin/apartments", icon: Building2, permission: "unit.read", group: "QUẢN LÝ VẬN HÀNH" },
  { label: "Cơ sở lưu trú", href: "/admin/properties", icon: Building2, permission: "property.read" },
  { label: "Giá & doanh thu", href: "/admin/pricing", icon: ChartNoAxesCombined, permission: "pricing.read" },
  { label: "Thanh toán", href: "/admin/payments", icon: CreditCard, permission: "payment.read" },
  { label: "Nhân viên & phân quyền", href: "/admin/staff", icon: ShieldCheck, permission: "staff.manage", group: "HỆ THỐNG" },
  { label: "Nhật ký hoạt động", href: "/admin/audit", icon: History, permission: "staff.manage" },
];
type Session = { id: string; email: string; permissions: string[] };
const Access = createContext<Session>({ id: "", email: "", permissions: [] });
export const useAdmin = () => useContext(Access);
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => { const expired = () => router.replace("/admin/login"); window.addEventListener("admin-session-expired", expired); return () => window.removeEventListener("admin-session-expired", expired); }, [router]);
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  useEffect(() => { if (pathname === "/admin/login") return; let active = true; adminApi<Session>("session").then(s => { if (active) setSession(s); }).catch(e => { if (active) setError(e.message); }); return () => { active = false; }; }, [pathname]);
  if (pathname === "/admin/login") return <div className="admin-login">{children}</div>;
  const active = navigation.find(n => n.href === pathname);
  const allowed = !active || session?.permissions.includes(active.permission);
  async function logout() { const response = await fetch("/api/auth/logout", { method: "POST" }); if (response.ok) router.replace("/admin/login"); else setError("Đăng xuất chưa thành công. Vui lòng thử lại."); }
  return <Access.Provider value={session ?? { id: "", email: "", permissions: [] }}><div className="admin-app">
    {open && <button className="admin-scrim" aria-label="Đóng menu" onClick={() => setOpen(false)} />}
    <aside className={`admin-sidebar ${open ? "is-open" : ""}`}>
      <Link className="admin-brand" href="/admin"><span className="admin-brand-icon">tt<span>↗</span></span><span>TT Apartment<small>QUẢN TRỊ LƯU TRÚ</small></span></Link>
      <div className="admin-workspace"><span className="admin-workspace-icon"><Building2 size={18}/></span><div><b>TT Apartment</b><small>Đà Nẵng, Việt Nam</small></div><span className="admin-dot"/></div>
      <nav aria-label="Điều hướng quản trị">{navigation.filter(n => !session || session.permissions.includes(n.permission)).map(n => <div key={n.href}>{n.group && <p className="admin-nav-group">{n.group}</p>}<Link onClick={() => setOpen(false)} className={`admin-nav-link ${pathname === n.href ? "active" : ""}`} href={n.href}><n.icon size={19}/><span>{n.label}</span>{pathname === n.href && <ChevronRight size={15}/>}</Link></div>)}</nav>
      <div className="admin-sidebar-bottom"><div className="admin-help"><CircleHelp size={20}/><b>Một quy trình, trọn kỳ nghỉ.</b><p>Theo dõi từ đặt phòng đến khi khách trả phòng.</p><Link href="/admin/bookings">Quản lý booking <ArrowUpRight size={14}/></Link></div><Link href="/vi" className="admin-site-link">Xem website <ArrowUpRight size={16}/></Link></div>
    </aside>
    <div className="admin-main"><header className="admin-topbar"><div className="admin-breadcrumb"><button className="admin-mobile-menu" aria-label="Mở menu" onClick={() => setOpen(!open)}>{open ? <X size={20}/> : <Menu size={20}/>}</button><span>Không gian quản trị</span><ChevronRight size={14}/><b>{active?.label ?? "Vận hành"}</b></div><div className="admin-user"><span className="admin-live"><i/> Hệ thống quản trị</span><span className="admin-avatar">{session?.email.slice(0, 2).toUpperCase() || "TT"}</span><div><b>{session?.email ?? "Đang xác thực…"}</b><small>{session?.permissions.includes("staff.manage") ? "Quản trị viên" : "Nhân viên"}</small></div><button onClick={logout} aria-label="Đăng xuất" title="Đăng xuất"><LogOut size={17}/></button></div></header>
      <main className="admin-content">{error ? <div className="admin-error" role="alert">{error} <button onClick={() => location.reload()}>Thử lại</button><Link href="/admin/login">Đổi tài khoản</Link></div> : !session ? <div className="admin-loading">Đang xác thực quyền truy cập…</div> : !allowed ? <div className="admin-empty"><ShieldCheck/><h2>Bạn chưa có quyền truy cập mục này</h2><p>Chọn một mục trong menu hoặc liên hệ quản trị viên để được cấp quyền.</p></div> : children}</main>
      <footer className="admin-footer">© {new Date().getFullYear()} TT Apartment <span>Chăm chút từng kỳ nghỉ.</span></footer>
    </div>
  </div></Access.Provider>;
}
