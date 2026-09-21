export type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  notes?: string;
  _count?: { bookings: number };
};
export type Unit = {
  id: string;
  nameVi: string;
  publicCode: string;
  status: string;
  basePrice: string;
  currency: string;
  maxGuests: number;
  bedroomCount: number;
  area: string;
  property?: { name: string };
};
export type Payment = {
  id: string;
  amount: string;
  currency: string;
  method: string;
  type: string;
  status: string;
  createdAt: string;
  booking?: { bookingCode: string };
};
export type Booking = {
  id: string;
  bookingCode: string;
  customer: Customer;
  unit: Unit;
  checkIn: string;
  checkOut: string;
  status: string;
  source: string;
  total: string;
  paidAmount: string;
  remainingAmount: string;
  depositRequired: string;
  currency: string;
  guestCount: number;
  payments: Payment[];
};
export type Role = {
  id: string;
  code: string;
  name: string;
  permissions: { permission: { code: string } }[];
};
export type Staff = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  roles: { role: Role }[];
};
export type StaffData = {
  users: Staff[];
  roles: Role[];
  permissions: { code: string }[];
};
export type Block = {
  id: string;
  unitId: string;
  startDate: string;
  endDate: string;
  state: string;
  reason: string;
};
export type CalendarData = {
  units: Unit[];
  bookings: (Pick<
    Booking,
    "id" | "bookingCode" | "checkIn" | "checkOut" | "status"
  > & { unitId: string })[];
  blocks: Block[];
  holds: { id: string; unitId: string; startDate: string; endDate: string }[];
};
export type Dashboard = {
  bookings: number;
  units: number;
  occupied: number;
  pending: number;
  revenue: { currency: string; _sum: { amount: string | null } }[];
  arrivals: Booking[];
  departures: Booking[];
  today: string;
};
export const labels: Record<string, string> = {
  DRAFT: "Bản nháp",
  PENDING_PAYMENT: "Chờ thanh toán",
  CONFIRMED: "Đã xác nhận",
  CHECKED_IN: "Đang lưu trú",
  CHECKED_OUT: "Đã trả phòng",
  COMPLETED: "Hoàn tất",
  CANCELLED_BY_CUSTOMER: "Khách hủy",
  CANCELLED_BY_STAFF: "Nhân viên hủy",
  CANCELLED_BY_ADMIN: "Quản trị hủy",
  PAYMENT_FAILED: "Thanh toán lỗi",
  NO_SHOW: "Không đến",
  PAID: "Đã thanh toán",
  PENDING: "Đang chờ",
  PROCESSING: "Đang xử lý",
  FAILED: "Thất bại",
  REFUNDED: "Đã hoàn tiền",
  PARTIALLY_REFUNDED: "Hoàn một phần",
  CANCELLED: "Đã hủy",
  PUBLISHED: "Đang mở bán",
  TEMP_UNAVAILABLE: "Tạm ngừng",
  INACTIVE: "Ngừng hoạt động",
  ARCHIVED: "Lưu trữ",
  ACTIVE: "Hoạt động",
  DISABLED: "Đã khóa",
  BLOCKED: "Khóa phòng",
  MAINTENANCE: "Bảo trì",
  HOLD: "Giữ chỗ",
  CASH: "Tiền mặt",
  BANK_TRANSFER: "Chuyển khoản",
  DEPOSIT: "Tiền cọc",
  BALANCE: "Còn lại",
  FULL: "Toàn bộ",
  REFUND: "Hoàn tiền",
  WEBSITE: "Website",
  PHONE: "Điện thoại",
  WALK_IN: "Trực tiếp",
  OTHER: "Khác",
  BOOKING_COM: "Booking.com",
};
export const money = (value: string | number, currency = "VND") =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "VND" ? 0 : 2,
  }).format(Number(value));
export const date = (value: string) =>
  new Date(value).toLocaleDateString("vi-VN", {
    timeZone: "UTC",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
export async function adminApi<T>(
  path: string,
  method = "GET",
  body?: unknown,
): Promise<T> {
  const response = await fetch(`/api/admin/${path}`, {
    method,
    headers: { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const result = await response.json();
  if (!response.ok) {
    if (response.status === 401 && !location.pathname.endsWith("/login"))
      window.dispatchEvent(new Event("admin-session-expired"));
    throw new Error(
      Array.isArray(result.error?.message)
        ? result.error.message.join(". ")
        : result.error?.message || "Thao tác không thành công.",
    );
  }
  return result.data as T;
}
