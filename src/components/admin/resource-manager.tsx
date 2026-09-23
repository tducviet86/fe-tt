"use client";
import { useState } from "react";
import { Building2, Pencil, Plus, Users } from "lucide-react";
import { Customer, Unit, Payment, labels, money, date } from "./admin-types";
import {
  Badge,
  DataState,
  Empty,
  ExportButton,
  FormModal,
  Heading,
  Modal,
  Toolbar,
  exportCsv,
  useData,
} from "./admin-ui";
import { UnitForm, PropertyForm, type Property } from "./catalog-forms";
import { UnitDetails, timestamp } from "./record-details";
import { useAdmin } from "./admin-shell";
export function CustomerManager() {
  const query = useData<Customer[]>("customers"),
    { permissions } = useAdmin();
  const [search, setSearch] = useState(""),
    [edit, setEdit] = useState<Customer | "new">();
  const rows = (query.data ?? []).filter((c) =>
    `${c.firstName} ${c.lastName} ${c.email} ${c.phone}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  const c = edit === "new" ? undefined : edit;
  return (
    <>
      <Heading
        title="Khách hàng"
        description="Ghi nhớ thông tin, chăm sóc tốt hơn mỗi lần quay lại."
        action={
          permissions.includes("customer.create") && (
            <button className="admin-button" onClick={() => setEdit("new")}>
              <Plus size={17} />
              Thêm khách hàng
            </button>
          )
        }
      />
      <section className="admin-panel">
        <Toolbar search={search} setSearch={setSearch} />
        <DataState {...query}>
          {rows.length ? (
            <div className="admin-table-scroll">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Khách hàng</th>
                    <th>Liên hệ</th>
                    <th>Quốc tịch / ngày tạo</th><th>Số booking</th>
                    <th>Ghi chú</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <div className="admin-cell-person">
                          <span className="admin-avatar">
                            <Users size={17} />
                          </span>
                          <b>
                            {c.lastName} {c.firstName}
                          </b>
                        </div>
                      </td>
                      <td>
                        {c.phone}
                        <small>{c.email || "Chưa có email"}</small>
                      </td>
                      <td>{c.nationality || "Chưa cập nhật"}<small>{timestamp(c.createdAt)}</small></td><td>{c._count?.bookings ?? 0} lượt đặt</td>
                      <td className="admin-wrap">{c.notes || "—"}</td>
                      <td>
                        {permissions.includes("customer.update") && (
                          <button
                            className="admin-icon-button"
                            aria-label="Sửa khách hàng"
                            onClick={() => setEdit(c)}
                          >
                            <Pencil size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty />
          )}
          <div className="admin-pagination">
            {rows.length} khách hàng · Hiển thị tối đa 1.000 hồ sơ gần nhất
          </div>
        </DataState>
      </section>
      {edit && (
        <FormModal
          title={c ? "Cập nhật khách hàng" : "Thêm khách hàng"}
          path={c ? `customers/${c.id}` : "customers"}
          method={c ? "PATCH" : "POST"}
          close={() => setEdit(undefined)}
          saved={query.reload}
          fields={[
            { name: "lastName", label: "Họ", value: c?.lastName, section: "Thông tin cá nhân" },
            { name: "firstName", label: "Tên", value: c?.firstName },
            {
              name: "phone",
              label: "Điện thoại",
              type: "tel",
              value: c?.phone,
              minLength: 5,
            },
            {
              name: "email",
              label: "Email",
              type: "email",
              required: false,
              value: c?.email,
            },
            { name: "nationality", label: "Quốc tịch", value: c?.nationality, required: false },
            {
              type: "textarea",
              name: "notes",
              label: "Ghi chú chăm sóc",
              required: false,
              value: c?.notes,
            },
          ]}
        />
      )}
    </>
  );
}
export function UnitManager({ pricing = false }: { pricing?: boolean }) {
  const query = useData<Unit[]>("units"), { permissions } = useAdmin();
  const [search, setSearch] = useState(""), [status, setStatus] = useState("ALL"), [edit, setEdit] = useState<Unit | "new">(), [detail, setDetail] = useState<Unit>();
  const canEdit = ["unit.update", "pricing.update", "unit.publish", "property.read"].every(p => permissions.includes(p));
  const rows = (query.data ?? []).filter(u => (status === "ALL" || u.status === status) && `${u.nameVi} ${u.nameEn} ${u.publicCode} ${u.property?.name}`.toLowerCase().includes(search.toLowerCase()));
  return <><Heading title={pricing ? "Giá & chính sách thanh toán" : "Danh mục căn hộ"} description={pricing ? "Giá cơ bản, phụ phí và tỷ lệ đặt cọc cho từng căn hộ." : "Quản lý thông tin, sức chứa, nội dung và trạng thái mở bán."} action={["unit.create", "pricing.update", "unit.publish", "property.read"].every(p => permissions.includes(p)) && <button className="admin-button" onClick={() => setEdit("new")}><Plus size={17}/>Thêm căn hộ</button>}/><div className="admin-mini-stats"><span>Tổng căn hộ <b>{query.data?.length ?? "—"}</b></span><span>Đang mở bán <b>{query.data?.filter(u => u.status === "PUBLISHED").length ?? "—"}</b></span><span>Tạm ngừng / chưa mở bán <b>{query.data?.filter(u => u.status !== "PUBLISHED").length ?? "—"}</b></span></div><section className="admin-panel"><Toolbar search={search} setSearch={setSearch}><select aria-label="Trạng thái căn hộ" value={status} onChange={e => setStatus(e.target.value)}><option value="ALL">Tất cả trạng thái</option>{["DRAFT", "PUBLISHED", "TEMP_UNAVAILABLE", "INACTIVE", "ARCHIVED"].map(value => <option key={value} value={value}>{labels[value]}</option>)}</select></Toolbar><DataState {...query}>{rows.length ? <div className="admin-table-scroll"><table className="admin-table"><thead><tr><th>Căn hộ / cơ sở</th><th>{pricing ? "Giá cơ bản" : "Không gian"}</th><th>{pricing ? "Phí dọn dẹp" : "Sức chứa"}</th><th>{pricing ? "Dịch vụ / cọc" : "Giá / đêm"}</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>{rows.map(u => <tr key={u.id}><td><button className="admin-text-button" onClick={() => setDetail(u)}>{u.nameVi}</button><small>{u.publicCode} · {u.property?.name}</small></td><td>{pricing ? money(u.basePrice, u.currency) : `${u.bedroomCount} PN · ${Number(u.bathroomCount)} phòng tắm`}<small>{pricing ? u.currency : `${u.bedCount} giường · ${Number(u.area)} m²`}</small></td><td>{pricing ? money(u.cleaningFee, u.currency) : `${u.maxGuests} khách`}</td><td>{pricing ? `${Number(u.serviceFeeRate) * 100}% / ${Number(u.depositRate) * 100}%` : money(u.basePrice, u.currency)}</td><td><Badge value={u.status}/></td><td><div className="admin-row-actions"><button className="admin-button secondary" onClick={() => setDetail(u)}>Chi tiết</button>{canEdit && <button className="admin-icon-button" aria-label={`Sửa ${u.nameVi}`} onClick={() => setEdit(u)}><Pencil size={16}/></button>}</div></td></tr>)}</tbody></table></div> : <Empty/>}<div className="admin-pagination">{rows.length} căn hộ · Giá hiển thị chưa bao gồm phụ phí</div></DataState></section>{edit && <UnitForm unit={edit === "new" ? undefined : edit} close={() => setEdit(undefined)} saved={query.reload}/>} {detail && <Modal title="Hồ sơ căn hộ" close={() => setDetail(undefined)}><UnitDetails unit={detail}/>{canEdit && <div className="admin-modal-actions"><button className="admin-button" onClick={() => { setEdit(detail); setDetail(undefined); }}>Chỉnh sửa căn hộ</button></div>}</Modal>}</>;
}
export function PaymentManager() {
  const query = useData<Payment[]>("payments");
  const [search, setSearch] = useState("");
  const rows = (query.data ?? []).filter((p) =>
    `${p.booking?.bookingCode} ${p.method} ${labels[p.status]}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  return (
    <>
      <Heading
        title="Thanh toán & đối soát"
        description="Theo dõi tiền cọc, thanh toán và lịch sử giao dịch. Ghi nhận tiền tại chi tiết booking."
        action={
          <ExportButton
            run={() =>
              exportCsv("thanh-toan", [
                [
                  "Booking",
                  "Ngày",
                  "Số tiền",
                  "Tiền tệ",
                  "Phương thức",
                  "Trạng thái",
                ],
                ...rows.map((p) => [
                  p.booking?.bookingCode ?? "",
                  date(p.createdAt),
                  p.amount,
                  p.currency,
                  p.method,
                  labels[p.status] ?? p.status,
                ]),
              ])
            }
          />
        }
      />
      <section className="admin-panel">
        <Toolbar search={search} setSearch={setSearch} />
        <DataState {...query}>
          {rows.length ? (
            <div className="admin-table-scroll">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Booking</th>
                    <th>Ngày ghi nhận</th>
                    <th>Phương thức</th>
                    <th>Loại</th>
                    <th>Số tiền</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <b>{p.booking?.bookingCode}</b>
                      </td>
                      <td>{date(p.createdAt)}</td>
                      <td>{labels[p.method] ?? p.method}</td>
                      <td>{labels[p.type] ?? p.type}</td>
                      <td>
                        <b>{money(p.amount, p.currency)}</b>
                      </td>
                      <td>
                        <Badge value={p.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty />
          )}
          <div className="admin-pagination">
            {rows.length} giao dịch · Tối đa 1.000 giao dịch gần nhất
          </div>
        </DataState>
      </section>
    </>
  );
}
export function PropertyManager() {
  const query = useData<Property[]>("properties");
  const { permissions } = useAdmin();
  const [edit, setEdit] = useState<Property | "new">();
  const canCreate = ["property.create", "property.publish"].every((p) =>
    permissions.includes(p),
  );
  const canEdit = ["property.update", "property.publish"].every((p) =>
    permissions.includes(p),
  );
  return (
    <>
      <Heading
        title="Cơ sở lưu trú"
        description="Thông tin các tòa nhà và quy định nhận, trả phòng."
        action={
          canCreate && (
            <button className="admin-button" onClick={() => setEdit("new")}>
              <Plus size={17} />
              Thêm cơ sở
            </button>
          )
        }
      />
      <DataState {...query}>
        <div className="admin-unit-grid">
          {query.data?.map((p) => (
            <section className="admin-panel admin-property" key={p.id}>
              <Building2 size={30} />
              <Badge value={p.status} />
              <h2>{p.name}</h2>
              <p>{p.address}</p>
              <dl className="admin-summary">
                <div>
                  <dt>Số căn hộ</dt>
                  <dd>{p._count.units}</dd>
                </div>
                <div>
                  <dt>Giờ nhận / trả phòng</dt>
                  <dd>
                    {p.checkInTime} / {p.checkOutTime}
                  </dd>
                </div>
              </dl>
              {canEdit && (
                <button
                  className="admin-button secondary"
                  onClick={() => setEdit(p)}
                >
                  <Pencil size={15} />
                  Chỉnh sửa
                </button>
              )}
            </section>
          ))}
        </div>
        {!query.data?.length && <Empty />}
      </DataState>
      {edit && (
        <PropertyForm
          property={edit === "new" ? undefined : edit}
          close={() => setEdit(undefined)}
          saved={query.reload}
        />
      )}
    </>
  );
}
type Audit = {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  actorUserId: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
};
export function AuditManager() {
  const query = useData<Audit[]>("audit"),
    [search, setSearch] = useState("");
  const rows = (query.data ?? []).filter((a) =>
    `${a.action} ${a.entityType} ${a.entityId} ${a.actorUserId}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  return (
    <>
      <Heading
        title="Nhật ký hoạt động"
        description="Dấu vết thao tác để kiểm tra và đối soát. Hiển thị 500 hoạt động gần nhất."
      />
      <section className="admin-panel">
        <Toolbar search={search} setSearch={setSearch} />
        <DataState {...query}>
          {rows.length ? (
            <div className="admin-table-scroll">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Thời gian</th>
                    <th>Thao tác</th>
                    <th>Đối tượng</th>
                    <th>Người thực hiện</th>
                    <th>Chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((a) => (
                    <tr key={a.id}>
                      <td>{new Date(a.createdAt).toLocaleString("vi-VN")}</td>
                      <td>
                        <b>{a.action}</b>
                      </td>
                      <td>
                        {a.entityType}
                        <small>{a.entityId}</small>
                      </td>
                      <td>{a.actorUserId || "Hệ thống"}</td>
                      <td className="admin-wrap">
                        {a.metadata ? JSON.stringify(a.metadata) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty />
          )}
        </DataState>
      </section>
    </>
  );
}
