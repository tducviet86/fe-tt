"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, Plus, ChevronRight } from "lucide-react";
import {
  adminApi,
  Booking,
  Customer,
  Unit,
  labels,
  money,
  date,
} from "./admin-types";
import { useAdmin } from "./admin-shell";
import {
  Badge,
  DataState,
  Empty,
  ExportButton,
  Fields,
  FormModal,
  Heading,
  Modal,
  Toolbar,
  exportCsv,
  useData,
} from "./admin-ui";
const nextStates: Record<string, string[]> = {
  DRAFT: ["PENDING_PAYMENT", "CANCELLED_BY_STAFF"],
  PENDING_PAYMENT: ["CONFIRMED", "CANCELLED_BY_STAFF"],
  CONFIRMED: ["CHECKED_IN", "NO_SHOW", "CANCELLED_BY_STAFF"],
  CHECKED_IN: ["CHECKED_OUT"],
  CHECKED_OUT: ["COMPLETED"],
  PAYMENT_FAILED: ["PENDING_PAYMENT", "CANCELLED_BY_STAFF"],
};
export function BookingTable({
  rows,
  select,
}: {
  rows: Booking[];
  select?: (b: Booking) => void;
}) {
  return rows.length ? (
    <div className="admin-table-scroll">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Booking / Khách hàng</th>
            <th>Căn hộ</th>
            <th>Ngày lưu trú</th>
            <th>Trạng thái</th>
            <th>Tổng tiền</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((b) => (
            <tr key={b.id}>
              <td>
                <button
                  className="admin-text-button"
                  onClick={() => select?.(b)}
                  disabled={!select}
                >
                  {b.bookingCode}
                </button>
                <small>
                  {b.customer.lastName} {b.customer.firstName}
                </small>
              </td>
              <td>
                <b>{b.unit.nameVi}</b>
                <small>
                  {b.guestCount} khách ·{" "}
                  {Math.round(
                    (+new Date(b.checkOut) - +new Date(b.checkIn)) / 86400000,
                  )}{" "}
                  đêm
                </small>
              </td>
              <td>
                {date(b.checkIn)}
                <small>→ {date(b.checkOut)}</small>
              </td>
              <td>
                <Badge value={b.status} />
              </td>
              <td>
                <b>{money(b.total, b.currency)}</b>
                <small>Còn lại {money(b.remainingAmount, b.currency)}</small>
              </td>
              <td>
                {select ? (
                  <button
                    className="admin-icon-button"
                    aria-label={`Chi tiết ${b.bookingCode}`}
                    onClick={() => select(b)}
                  >
                    <ChevronRight size={17} />
                  </button>
                ) : (
                  <Link href="/admin/bookings" aria-label="Mở quản lý booking">
                    <ArrowRight size={17} />
                  </Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <Empty
      text="Chưa có booking"
      detail="Tạo booking mới hoặc thay đổi bộ lọc để xem kết quả."
    />
  );
}
function NewBooking({
  close,
  saved,
}: {
  close: () => void;
  saved: () => void;
}) {
  const customers = useData<Customer[]>("customers"),
    units = useData<Unit[]>("units");
  const [draft, setDraft] = useState<Record<string, unknown>>();
  const [quote, setQuote] = useState<{
    quoteId: string;
    total: string;
    requiredDeposit: string;
    currency: string;
    nights: number;
    subtotal: string;
    cleaningFee: string;
    serviceFee: string;
  }>();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  return (
    <Modal
      title="Tạo booking mới"
      close={() => {
        if (!busy) close();
      }}
    >
      <div className="admin-steps">
        <span className="current">1. Thông tin lưu trú</span>
        <ChevronRight size={15} />
        <span className={quote ? "current" : ""}>2. Kiểm tra & tạo</span>
      </div>
      <DataState
        loading={customers.loading || units.loading}
        error={customers.error || units.error}
        reload={() => {
          customers.reload();
          units.reload();
        }}
      >
        {!quote ? (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const data = Object.fromEntries(new FormData(e.currentTarget));
              const input = { ...data, guestCount: Number(data.guestCount) };
              setBusy(true);
              setError("");
              try {
                const q = await adminApi<NonNullable<typeof quote>>(
                  "quote",
                  "POST",
                  {
                    unitId: data.unitId,
                    checkIn: data.checkIn,
                    checkOut: data.checkOut,
                    guestCount: Number(data.guestCount),
                  },
                );
                setDraft(input);
                setQuote(q);
              } catch (e) {
                setError((e as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            <Fields
              fields={[
                {
                  name: "customerId",
                  label: "Khách hàng",
                  value: draft?.customerId as string,
                  options:
                    customers.data?.map((c) => ({
                      value: c.id,
                      label: `${c.lastName} ${c.firstName} · ${c.phone}`,
                    })) ?? [],
                },
                {
                  name: "unitId",
                  label: "Căn hộ",
                  value: draft?.unitId as string,
                  options:
                    units.data
                      ?.filter((u) => u.status === "PUBLISHED")
                      .map((u) => ({
                        value: u.id,
                        label: `${u.nameVi} · ${u.maxGuests} khách`,
                      })) ?? [],
                },
                {
                  name: "checkIn",
                  label: "Ngày nhận phòng",
                  type: "date",
                  value: draft?.checkIn as string,
                },
                {
                  name: "checkOut",
                  label: "Ngày trả phòng",
                  type: "date",
                  value: draft?.checkOut as string,
                },
                {
                  name: "guestCount",
                  label: "Số khách",
                  type: "number",
                  min: 1,
                  max: 100,
                  value: (draft?.guestCount as number) ?? 2,
                },
                {
                  name: "source",
                  label: "Nguồn đặt",
                  value: (draft?.source as string) ?? "PHONE",
                  options: [
                    "PHONE",
                    "WALK_IN",
                    "WEBSITE",
                    "FACEBOOK",
                    "ZALO",
                    "WHATSAPP",
                    "AIRBNB",
                    "BOOKING_COM",
                    "OTHER",
                  ].map((value) => ({ value, label: labels[value] ?? value })),
                },
              ]}
            />
            <p className="admin-form-note">
              Khách mới? Thêm hồ sơ tại{" "}
              <Link href="/admin/customers">Khách hàng</Link> trước khi đặt
              phòng.
            </p>
            {error && (
              <p role="alert" className="admin-error">
                {error}
              </p>
            )}
            <div className="admin-modal-actions">
              <button className="admin-button" disabled={busy}>
                {busy ? "Đang kiểm tra phòng…" : "Kiểm tra phòng & tính giá"}
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="admin-notice">
              <Check size={18} />
              Căn hộ còn trống cho kỳ nghỉ {quote.nights} đêm.
            </div>
            <dl className="admin-summary">
              <div>
                <dt>Tiền phòng</dt>
                <dd>{money(quote.subtotal, quote.currency)}</dd>
              </div>
              <div>
                <dt>Phí dọn dẹp</dt>
                <dd>{money(quote.cleaningFee, quote.currency)}</dd>
              </div>
              <div>
                <dt>Phí dịch vụ</dt>
                <dd>{money(quote.serviceFee, quote.currency)}</dd>
              </div>
              <div className="total">
                <dt>Tổng thanh toán</dt>
                <dd>{money(quote.total, quote.currency)}</dd>
              </div>
              <div>
                <dt>Tiền cọc yêu cầu</dt>
                <dd>{money(quote.requiredDeposit, quote.currency)}</dd>
              </div>
            </dl>
            <p className="admin-form-note">
              Booking được tạo ở trạng thái chờ thanh toán. Sau khi thu cọc, bạn
              có thể xác nhận và làm thủ tục nhận phòng.
            </p>
            {error && (
              <p role="alert" className="admin-error">
                {error}
              </p>
            )}
            <div className="admin-modal-actions">
              <button
                disabled={busy}
                className="admin-button secondary"
                onClick={() => setQuote(undefined)}
              >
                Quay lại
              </button>
              <button
                className="admin-button"
                disabled={busy}
                onClick={async () => {
                  if (busy) return;
                  setBusy(true);
                  try {
                    await adminApi("bookings", "POST", {
                      ...draft,
                      quoteId: quote.quoteId,
                    });
                    saved();
                    close();
                  } catch (e) {
                    setError((e as Error).message);
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                {busy ? "Đang tạo…" : "Xác nhận tạo booking"}
              </button>
            </div>
          </div>
        )}
      </DataState>
    </Modal>
  );
}
export function BookingManager() {
  const query = useData<Booking[]>("bookings"),
    { permissions } = useAdmin();
  const [search, setSearch] = useState(""),
    [status, setStatus] = useState("ALL"),
    [page, setPage] = useState(1),
    [creating, setCreating] = useState(false),
    [selected, setSelected] = useState<Booking>(),
    [action, setAction] = useState<string>(),
    [notice, setNotice] = useState("");
  const [paymentRequestId, setPaymentRequestId] = useState("");
  const rows = (query.data ?? []).filter(
    (b) =>
      (status === "ALL" || b.status === status) &&
      `${b.bookingCode} ${b.customer.firstName} ${b.customer.lastName} ${b.customer.phone} ${b.unit.nameVi}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const saved = () => {
    query.reload();
    setSelected(undefined);
    setNotice("Đã lưu thay đổi thành công.");
  };
  const canCreate = ["booking.create", "customer.read", "unit.read"].every(
    (p) => permissions.includes(p),
  );
  return (
    <>
      <Heading
        title="Quản lý đặt phòng"
        description="Mỗi booking, mỗi bước trong hành trình của khách."
        action={
          <>
            {query.data && (
              <ExportButton
                run={() =>
                  exportCsv("bookings", [
                    [
                      "Mã",
                      "Khách hàng",
                      "Căn hộ",
                      "Nhận phòng",
                      "Trả phòng",
                      "Trạng thái",
                      "Tổng tiền",
                      "Còn lại",
                      "Tiền tệ",
                    ],
                    ...rows.map((b) => [
                      b.bookingCode,
                      `${b.customer.lastName} ${b.customer.firstName}`,
                      b.unit.nameVi,
                      date(b.checkIn),
                      date(b.checkOut),
                      labels[b.status] ?? b.status,
                      b.total,
                      b.remainingAmount,
                      b.currency,
                    ]),
                  ])
                }
              />
            )}{" "}
            {canCreate && (
              <button
                className="admin-button"
                onClick={() => setCreating(true)}
              >
                <Plus size={17} />
                Tạo booking
              </button>
            )}
          </>
        }
      />
      <div className="admin-workflow">
        {[
          "Đặt phòng",
          "Thu tiền cọc",
          "Xác nhận",
          "Nhận phòng",
          "Trả phòng",
          "Hoàn tất",
        ].map((s, i) => (
          <span key={s}>
            <i>{i + 1}</i>
            {s}
            {i < 5 && <ChevronRight size={15} />}
          </span>
        ))}
      </div>
      {notice && (
        <p role="status" className="admin-notice">
          {notice}
        </p>
      )}
      <section className="admin-panel">
        <Toolbar
          search={search}
          setSearch={(v) => {
            setSearch(v);
            setPage(1);
          }}
        >
          <select
            aria-label="Lọc trạng thái"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="ALL">Tất cả trạng thái</option>
            {Object.keys(nextStates)
              .concat([
                "COMPLETED",
                "NO_SHOW",
                "CANCELLED_BY_STAFF",
                "CANCELLED_BY_ADMIN",
                "CANCELLED_BY_CUSTOMER",
              ])
              .map((s) => (
                <option key={s} value={s}>
                  {labels[s]}
                </option>
              ))}
          </select>
        </Toolbar>
        <DataState {...query}>
          <BookingTable
            rows={rows.slice((page - 1) * 10, page * 10)}
            select={setSelected}
          />
          <div className="admin-pagination">
            <span>{rows.length} booking · Tối đa 1.000 booking gần nhất</span>
            <div>
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Trước
              </button>
              <span>
                {page} / {Math.max(1, Math.ceil(rows.length / 10))}
              </span>
              <button
                disabled={page * 10 >= rows.length}
                onClick={() => setPage((p) => p + 1)}
              >
                Sau
              </button>
            </div>
          </div>
        </DataState>
      </section>
      {creating && (
        <NewBooking close={() => setCreating(false)} saved={saved} />
      )}
      {selected && !action && (
        <Modal
          title={selected.bookingCode}
          close={() => setSelected(undefined)}
        >
          <Badge value={selected.status} />
          <h3 className="admin-detail-title">
            {selected.customer.lastName} {selected.customer.firstName}
          </h3>
          <p className="admin-form-note">
            {selected.customer.phone} ·{" "}
            {selected.customer.email || "Chưa có email"}
          </p>
          <dl className="admin-summary">
            <div>
              <dt>Căn hộ</dt>
              <dd>{selected.unit.nameVi}</dd>
            </div>
            <div>
              <dt>Lưu trú</dt>
              <dd>
                {date(selected.checkIn)} → {date(selected.checkOut)}
              </dd>
            </div>
            <div>
              <dt>Tổng tiền</dt>
              <dd>{money(selected.total, selected.currency)}</dd>
            </div>
            <div>
              <dt>Đã thu / Cọc yêu cầu</dt>
              <dd>
                {money(selected.paidAmount, selected.currency)} /{" "}
                {money(selected.depositRequired, selected.currency)}
              </dd>
            </div>
            <div className="total">
              <dt>Còn phải thu</dt>
              <dd>{money(selected.remainingAmount, selected.currency)}</dd>
            </div>
          </dl>
          <div className="admin-action-grid">
            {permissions.includes("payment.confirm") &&
              Number(selected.remainingAmount) > 0 &&
              ["PENDING_PAYMENT", "CONFIRMED", "CHECKED_IN"].includes(
                selected.status,
              ) && (
                <button
                  className="admin-button"
                  onClick={() => {
                    setPaymentRequestId(crypto.randomUUID());
                    setAction("payment");
                  }}
                >
                  Ghi nhận thanh toán
                </button>
              )}
            {(nextStates[selected.status] ?? [])
              .filter((s) =>
                permissions.includes(
                  s.startsWith("CANCELLED")
                    ? "booking.cancel"
                    : s === "CHECKED_IN"
                      ? "booking.checkin"
                      : ["CHECKED_OUT", "COMPLETED"].includes(s)
                        ? "booking.checkout"
                        : "booking.update",
                ),
              )
              .map((s) => (
                <button
                  className="admin-button secondary"
                  key={s}
                  onClick={() => setAction(s)}
                >
                  {labels[s]}
                </button>
              ))}
          </div>
          <p className="admin-form-note">
            Hủy booking không tự động hoàn tiền. Tiền đã thu cần được đối soát
            và hoàn qua phương thức thanh toán tương ứng.
          </p>
        </Modal>
      )}
      {selected && action && (
        <FormModal
          title={
            action === "payment"
              ? "Ghi nhận tiền đã nhận"
              : `Chuyển trạng thái: ${labels[action]}`
          }
          path={`bookings/${selected.id}/${action === "payment" ? "payments" : "status"}`}
          method={action === "payment" ? "POST" : "PATCH"}
          fields={
            action === "payment"
              ? [
                  {
                    name: "amount",
                    label: "Số tiền đã nhận",
                    type: "number",
                    min: 0.01,
                    max: Number(selected.remainingAmount),
                    step: "0.01",
                    value: Number(selected.remainingAmount),
                  },
                  {
                    name: "method",
                    label: "Phương thức",
                    options: [
                      { value: "CASH", label: "Tiền mặt" },
                      { value: "BANK_TRANSFER", label: "Chuyển khoản" },
                    ],
                  },
                  {
                    name: "reference",
                    label: "Mã giao dịch / nội dung đối soát",
                    minLength: 3,
                  },
                ]
              : [{ name: "reason", label: "Ghi chú / lý do", minLength: 3 }]
          }
          transform={(data) =>
            action === "payment"
              ? { ...data, requestId: paymentRequestId }
              : { ...data, status: action }
          }
          close={() => setAction(undefined)}
          saved={saved}
        />
      )}
    </>
  );
}
