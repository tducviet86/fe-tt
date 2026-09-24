"use client";
import { useState } from "react";
import { DataState, FormModal, useData, type Field } from "./admin-ui";
import { labels, viewLabels, type Unit } from "./admin-types";
export type Property = { id: string; name: string; address: string; locationId: string; latitude: string; longitude: string; status: string; checkInTime: string; checkOutTime: string; descriptionVi: string; descriptionEn: string; _count: { units: number } };
export function UnitForm({ unit, close, saved }: { unit?: Unit; close: () => void; saved: () => void }) {
  const properties = useData<Property[]>("properties");
  const amenities = useData<{ id: string; nameVi: string; category: string }[]>("amenities");
  const [selected, setSelected] = useState(unit?.amenities?.map(a => a.amenityId) ?? []);
  const views = { ...viewLabels, ...(unit?.viewType && !viewLabels[unit.viewType] ? { [unit.viewType]: unit.viewType } : {}) };
  const fields: Field[] = [
    ...(!unit ? [{ name: "propertyId", label: "Cơ sở lưu trú", section: "01 · Thông tin căn hộ", options: properties.data?.filter(p => p.status === "ACTIVE").map(p => ({ value: p.id, label: p.name })) ?? [] }, { name: "publicCode", label: "Mã căn hộ", minLength: 2, section: "01 · Thông tin căn hộ" }] : []),
    { name: "nameVi", label: "Tên tiếng Việt", value: unit?.nameVi, section: "01 · Thông tin căn hộ" },
    { name: "nameEn", label: "Tên tiếng Anh", value: unit?.nameEn, section: "01 · Thông tin căn hộ" },
    { name: "status", label: "Trạng thái mở bán", value: unit?.status ?? "DRAFT", section: "01 · Thông tin căn hộ", options: ["DRAFT", "PUBLISHED", "TEMP_UNAVAILABLE", "INACTIVE", "ARCHIVED"].map(value => ({ value, label: labels[value] })) },
    { name: "viewType", label: "Hướng nhìn", value: unit ? (unit.viewType ?? "") : "CITY", required: false, section: "01 · Thông tin căn hộ", options: [{ value: "", label: "Chưa xác định" }, ...Object.entries(views).map(([value, label]) => ({ value, label }))] },
    ...[{ name: "bedroomCount", label: "Phòng ngủ", min: 0, max: 50, value: unit?.bedroomCount ?? 1 }, { name: "bathroomCount", label: "Phòng tắm", min: 1, max: 50, value: Number(unit?.bathroomCount ?? 1), step: "0.5" }, { name: "bedCount", label: "Số giường", min: 1, max: 100, value: unit?.bedCount ?? 1 }, { name: "maxGuests", label: "Sức chứa tối đa", min: 1, max: 100, value: unit?.maxGuests ?? 2 }, { name: "area", label: "Diện tích (m²)", min: 1, max: 10000, step: "0.01", value: Number(unit?.area ?? 40) }].map(f => ({ ...f, type: "number", section: "02 · Không gian & sức chứa" })),
    ...(!unit ? [{ name: "currency", label: "Tiền tệ", value: "VND", section: "03 · Giá & chính sách thanh toán", options: [{ value: "VND", label: "VND — Việt Nam đồng" }, { value: "USD", label: "USD — Đô la Mỹ" }] }] : []),
    { name: "basePrice", label: `Giá cơ bản / đêm (${unit?.currency ?? "VND / USD"})`, type: "number", min: 0, max: 9999999999, step: "0.01", value: unit ? Number(unit.basePrice) : undefined, section: "03 · Giá & chính sách thanh toán" },
    { name: "cleaningFee", label: "Phí dọn dẹp / kỳ nghỉ", type: "number", min: 0, max: 9999999999, step: "0.01", value: Number(unit?.cleaningFee ?? 0), section: "03 · Giá & chính sách thanh toán" },
    { name: "serviceFeeRate", label: "Phí dịch vụ (%)", type: "number", min: 0, max: 100, step: "0.01", value: Number(unit?.serviceFeeRate ?? 0.05) * 100, section: "03 · Giá & chính sách thanh toán" },
    { name: "depositRate", label: "Cọc yêu cầu (%)", type: "number", min: 0, max: 100, step: "0.01", value: Number(unit?.depositRate ?? 0.3) * 100, section: "03 · Giá & chính sách thanh toán" },
    { name: "descriptionVi", label: "Mô tả tiếng Việt", type: "textarea", value: unit?.descriptionVi, required: false, section: "04 · Nội dung giới thiệu" },
    { name: "descriptionEn", label: "Mô tả tiếng Anh", type: "textarea", value: unit?.descriptionEn, required: false, section: "04 · Nội dung giới thiệu" },
  ];
  return <DataState loading={properties.loading || amenities.loading} error={properties.error || amenities.error} reload={() => { properties.reload(); amenities.reload(); }}><FormModal title={unit ? `Chỉnh sửa · ${unit.publicCode}` : "Thêm căn hộ"} path={unit ? `units/${unit.id}` : "units"} method={unit ? "PATCH" : "POST"} close={close} saved={saved} fields={fields} transform={d => ({ ...d, serviceFeeRate: Number((Number(d.serviceFeeRate) / 100).toFixed(4)), depositRate: Number((Number(d.depositRate) / 100).toFixed(4)), amenityIds: selected })} extra={<fieldset className="admin-amenities"><legend>05 · Tiện ích</legend>{amenities.data?.length ? amenities.data.map(a => <label key={a.id}><input type="checkbox" checked={selected.includes(a.id)} onChange={e => setSelected(s => e.target.checked ? [...s, a.id] : s.filter(id => id !== a.id))}/>{a.nameVi}<small>{a.category}</small></label>) : <p>Chưa có tiện ích trong danh mục hệ thống.</p>}</fieldset>}/></DataState>;
}
export function PropertyForm({ property, close, saved }: { property?: Property; close: () => void; saved: () => void }) {
  const query = useData<{ id: string; nameVi: string }[]>("locations");
  return <DataState {...query}><FormModal title={property ? "Chỉnh sửa cơ sở lưu trú" : "Thêm cơ sở lưu trú"} path={property ? `properties/${property.id}` : "properties"} method={property ? "PATCH" : "POST"} close={close} saved={saved} fields={[
    { name: "name", label: "Tên cơ sở", value: property?.name, minLength: 2, section: "01 · Thông tin & vị trí" },
    { name: "locationId", label: "Khu vực", value: property?.locationId, section: "01 · Thông tin & vị trí", options: query.data?.map(l => ({ value: l.id, label: l.nameVi })) ?? [] },
    { name: "address", label: "Địa chỉ đầy đủ", value: property?.address, minLength: 5, wide: true, section: "01 · Thông tin & vị trí" },
    { name: "latitude", label: "Vĩ độ", type: "number", min: -90, max: 90, step: "0.000001", value: property ? Number(property.latitude) : 16.0544, section: "01 · Thông tin & vị trí" },
    { name: "longitude", label: "Kinh độ", type: "number", min: -180, max: 180, step: "0.000001", value: property ? Number(property.longitude) : 108.2022, section: "01 · Thông tin & vị trí" },
    { name: "status", label: "Trạng thái", value: property?.status ?? "DRAFT", section: "02 · Chính sách vận hành", options: ["DRAFT", "ACTIVE", "INACTIVE", "ARCHIVED"].map(value => ({ value, label: labels[value] })) },
    { name: "checkInTime", label: "Giờ nhận phòng", type: "time", value: property?.checkInTime ?? "14:00", section: "02 · Chính sách vận hành" },
    { name: "checkOutTime", label: "Giờ trả phòng", type: "time", value: property?.checkOutTime ?? "11:00", section: "02 · Chính sách vận hành" },
    { name: "descriptionVi", label: "Giới thiệu tiếng Việt", type: "textarea", required: false, value: property?.descriptionVi, section: "03 · Giới thiệu" },
    { name: "descriptionEn", label: "Giới thiệu tiếng Anh", type: "textarea", required: false, value: property?.descriptionEn, section: "03 · Giới thiệu" },
  ]}/></DataState>;
}
