"use client";
import { useState } from "react";
import { Check, Pencil, Plus, ShieldCheck } from "lucide-react";
import { Staff, StaffData } from "./admin-types";
import {
  Badge,
  DataState,
  FormModal,
  Heading,
  Toolbar,
  useData,
} from "./admin-ui";
import { useAdmin } from "./admin-shell";
const groups: Record<string, string> = {
  booking: "Đặt phòng",
  customer: "Khách hàng",
  property: "Cơ sở lưu trú",
  unit: "Căn hộ",
  availability: "Lịch phòng",
  pricing: "Giá phòng",
  payment: "Thanh toán",
  seo: "SEO",
  content: "Nội dung",
  staff: "Nhân viên",
  report: "Báo cáo",
};
const verbs: Record<string, string> = {
  read: "Xem",
  create: "Tạo",
  update: "Cập nhật",
  cancel: "Hủy",
  checkin: "Nhận phòng",
  checkout: "Trả phòng",
  publish: "Xuất bản",
  confirm: "Xác nhận thu tiền",
  refund: "Hoàn tiền",
  manage: "Quản lý",
  "metadata.update": "Sửa metadata",
  "redirect.manage": "Quản lý chuyển hướng",
  "sitemap.read": "Xem sitemap",
  "audit.read": "Xem kiểm tra SEO",
  "blog.manage": "Quản lý bài viết",
  "landing.manage": "Quản lý landing page",
};
function permissionLabel(code: string) {
  const [group, ...rest] = code.split(".");
  return `${groups[group] ?? group} · ${verbs[rest.join(".")] ?? rest.join(".")}`;
}
export function StaffManager() {
  const query = useData<StaffData>("staff"),
    session = useAdmin();
  const [search, setSearch] = useState(""),
    [tab, setTab] = useState("staff"),
    [edit, setEdit] = useState<Staff | "new">(),
    [newRole, setNewRole] = useState(false),
    [selected, setSelected] = useState<string[]>([]);
  const roleOptions =
    query.data?.roles
      .filter(
        (r) =>
          r.code !== "ADMIN_OWNER" &&
          r.permissions.every((p) =>
            session.permissions.includes(p.permission.code),
          ),
      )
      .map((r) => ({ value: r.id, label: r.name })) ?? [];
  const person = edit === "new" ? undefined : edit;
  return (
    <>
      <Heading
        title="Nhân viên & phân quyền"
        description="Đúng người, đúng quyền. Mọi thay đổi được ghi nhận trong nhật ký hoạt động."
        action={
          <>
            <button
              className="admin-button secondary"
              onClick={() => {
                setSelected([]);
                setNewRole(true);
              }}
            >
              <ShieldCheck size={17} />
              Tạo vai trò
            </button>
            <button className="admin-button" onClick={() => setEdit("new")}>
              <Plus size={17} />
              Thêm nhân viên
            </button>
          </>
        }
      />
      <div className="admin-notice">
        <ShieldCheck size={19} />
        Quyền được kiểm tra tại máy chủ. Thay đổi vai trò hoặc khóa nhân viên sẽ
        thu hồi phiên đăng nhập hiện tại.
      </div>
      <section className="admin-panel">
        <div className="admin-tabs">
          <button
            className={tab === "staff" ? "active" : ""}
            onClick={() => setTab("staff")}
          >
            Nhân viên
          </button>
          <button
            className={tab === "roles" ? "active" : ""}
            onClick={() => setTab("roles")}
          >
            Ma trận phân quyền
          </button>
        </div>
        <DataState {...query}>
          {tab === "staff" ? (
            <>
              <Toolbar search={search} setSearch={setSearch} />
              <div className="admin-table-scroll">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nhân viên</th>
                      <th>Vai trò</th>
                      <th>Trạng thái</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {query.data?.users
                      .filter((u) =>
                        `${u.firstName} ${u.lastName} ${u.email}`
                          .toLowerCase()
                          .includes(search.toLowerCase()),
                      )
                      .map((u) => (
                        <tr key={u.id}>
                          <td>
                            <b>
                              {u.lastName} {u.firstName}
                              {u.id === session.id ? " (Bạn)" : ""}
                            </b>
                            <small>{u.email}</small>
                          </td>
                          <td>{u.roles.map((r) => r.role.name).join(", ")}</td>
                          <td>
                            <Badge value={u.status} />
                          </td>
                          <td>
                            {u.id !== session.id &&
                              !u.roles.some(
                                (r) => r.role.code === "ADMIN_OWNER",
                              ) && (
                                <button
                                  className="admin-icon-button"
                                  aria-label="Sửa quyền nhân viên"
                                  onClick={() => setEdit(u)}
                                >
                                  <Pencil size={17} />
                                </button>
                              )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="admin-table-scroll">
              <table className="admin-table admin-permission-table">
                <thead>
                  <tr>
                    <th>Quyền thao tác</th>
                    {query.data?.roles.map((r) => (
                      <th key={r.id}>
                        {r.name}
                        <small>{r.code}</small>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {query.data?.permissions.map((p) => (
                    <tr key={p.code}>
                      <td>{permissionLabel(p.code)}</td>
                      {query.data?.roles.map((r) => (
                        <td key={r.id}>
                          {r.permissions.some(
                            (x) => x.permission.code === p.code,
                          ) ? (
                            <Check size={18} aria-label="Được cấp quyền" />
                          ) : (
                            <span aria-label="Không có quyền">—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </DataState>
      </section>
      {edit && (
        <FormModal
          title={person ? "Cập nhật quyền nhân viên" : "Thêm nhân viên"}
          path={person ? `staff/${person.id}` : "staff"}
          method={person ? "PATCH" : "POST"}
          close={() => setEdit(undefined)}
          saved={query.reload}
          fields={
            person
              ? [
                  {
                    name: "roleId",
                    label: "Vai trò",
                    value: person.roles[0]?.role.id,
                    options: roleOptions,
                  },
                  {
                    name: "status",
                    label: "Trạng thái tài khoản",
                    value: person.status,
                    options: [
                      { value: "ACTIVE", label: "Hoạt động" },
                      { value: "DISABLED", label: "Khóa tài khoản" },
                    ],
                  },
                ]
              : [
                  { name: "lastName", label: "Họ" },
                  { name: "firstName", label: "Tên" },
                  { name: "email", label: "Email", type: "email" },
                  {
                    name: "password",
                    label: "Mật khẩu (ít nhất 12 ký tự)",
                    type: "password",
                    minLength: 12,
                  },
                  { name: "roleId", label: "Vai trò", options: roleOptions },
                ]
          }
        />
      )}
      {newRole && (
        <FormModal
          title="Tạo vai trò mới"
          path="roles"
          saved={query.reload}
          close={() => setNewRole(false)}
          fields={[
            { name: "name", label: "Tên vai trò" },
            {
              name: "code",
              label: "Mã vai trò (VD: RECEPTIONIST)",
              minLength: 3,
            },
          ]}
          transform={(d) => ({ ...d, permissions: selected })}
          extra={
            <div className="admin-permission-picker">
              <p>Chọn quyền cho vai trò · {selected.length} quyền</p>
              {Object.entries(groups).map(([key, name]) => (
                <fieldset key={key}>
                  <legend>{name}</legend>
                  {query.data?.permissions
                    .filter(
                      (p) =>
                        p.code.startsWith(key + ".") &&
                        session.permissions.includes(p.code),
                    )
                    .map((p) => (
                      <label key={p.code}>
                        <input
                          type="checkbox"
                          checked={selected.includes(p.code)}
                          onChange={(e) =>
                            setSelected((s) =>
                              e.target.checked
                                ? [...s, p.code]
                                : s.filter((c) => c !== p.code),
                            )
                          }
                        />
                        {permissionLabel(p.code)}
                      </label>
                    ))}
                </fieldset>
              ))}
            </div>
          }
        />
      )}
    </>
  );
}
