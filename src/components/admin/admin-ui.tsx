"use client";
import { useEffect, useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Inbox, Search, X, ArrowDownToLine } from "lucide-react";
import { adminApi, labels } from "./admin-types";
export function Badge({ value }: { value: string }) {
  return (
    <span className={`admin-badge badge-${value.toLowerCase()}`}>
      {labels[value] ?? value}
    </span>
  );
}
export function Empty({
  text = "Chưa có dữ liệu phù hợp",
  detail = "Dữ liệu mới sẽ xuất hiện tại đây khi được tạo.",
}: {
  text?: string;
  detail?: string;
}) {
  return (
    <div className="admin-empty">
      <Inbox size={34} />
      <h3>{text}</h3>
      <p>{detail}</p>
    </div>
  );
}
export function useData<T>(path: string) {
  const [data, setData] = useState<T>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);
  useEffect(() => {
    let active = true;
    adminApi<T>(path)
      .then((d) => {
        if (active) {
          setData(d);
          setError("");
        }
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [path, version]);
  return {
    data,
    error,
    loading,
    reload: () => {
      setLoading(true);
      setVersion((v) => v + 1);
    },
  };
}
export function DataState({
  loading,
  error,
  reload,
  children,
}: {
  loading: boolean;
  error: string;
  reload: () => void;
  children: ReactNode;
}) {
  return loading ? (
    <div className="admin-loading">
      <span />
      Đang tải dữ liệu…
    </div>
  ) : error ? (
    <div className="admin-error" role="alert">
      {error}
      <button onClick={reload}>Thử lại</button>
    </div>
  ) : (
    children
  );
}
export function Heading({
  eyebrow = "QUẢN LÝ VẬN HÀNH",
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="admin-heading">
      <div>
        <p>{eyebrow}</p>
        <h1>{title}</h1>
        <span>{description}</span>
      </div>
      <div className="admin-heading-actions">{action}</div>
    </div>
  );
}
export function Modal({
  title,
  children,
  close,
}: {
  title: string;
  children: ReactNode;
  close: () => void;
}) {
  return (
    <Dialog.Root
      open
      onOpenChange={(v) => {
        if (!v) close();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="admin-modal-overlay" />
        <Dialog.Content className="admin-modal" aria-describedby={undefined}>
          <div className="admin-modal-heading">
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Close aria-label="Đóng">
              <X size={20} />
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
export type Field = {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  value?: string | number;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: string;
  minLength?: number;
  section?: string;
  help?: string;
  wide?: boolean;
};
export function Fields({ fields }: { fields: Field[] }) {
  const sections = [...new Set(fields.map(f => f.section ?? "Thông tin"))];
  return <div className="admin-form-sections">{sections.map(section => <fieldset key={section}><legend>{section}</legend><div className="admin-fields">{fields.filter(f => (f.section ?? "Thông tin") === section).map(f => <label key={f.name} className={f.wide || f.type === "textarea" ? "wide" : ""}>{f.label}{f.required !== false && <span> *</span>}{f.options ? <select name={f.name} required={f.required !== false} defaultValue={f.value ?? ""}>{!f.options.some(o => o.value === "") && <option value="" disabled>Chọn {f.label.toLowerCase()}</option>}{f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select> : f.type === "textarea" ? <textarea name={f.name} required={f.required !== false} defaultValue={f.value} rows={4} maxLength={20000}/> : <input name={f.name} type={f.type ?? "text"} required={f.required !== false} defaultValue={f.value} min={f.min} max={f.max} step={f.step} minLength={f.minLength} autoComplete={f.type === "password" ? "current-password" : f.type === "email" ? "email" : undefined}/>} {f.help && <small>{f.help}</small>}</label>)}</div></fieldset>)}</div>;
}
export function FormModal({
  title,
  fields,
  path,
  method = "POST",
  close,
  saved,
  extra,
  transform,
}: {
  title: string;
  fields: Field[];
  path: string;
  method?: string;
  close: () => void;
  saved: () => void;
  extra?: ReactNode;
  transform?: (data: Record<string, unknown>) => unknown;
}) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <Modal
      title={title}
      close={() => {
        if (!busy) close();
      }}
    >
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (busy) return;
          setBusy(true);
          setError("");
          const form = new FormData(e.currentTarget);
          const data: Record<string, unknown> = {};
          for (const f of fields) {
            const value = form.get(f.name);
            if (value !== "")
              data[f.name] = f.type === "number" ? Number(value) : value;
            else if (f.required === false)
              data[f.name] = f.type === "email" ? null : "";
          }
          try {
            await adminApi(path, method, transform ? transform(data) : data);
            saved();
            close();
          } catch (e) {
            setError((e as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <Fields fields={fields} />
        {extra}
        {error && (
          <p className="admin-error" role="alert">
            {error}
          </p>
        )}
        <div className="admin-modal-actions">
          <button
            type="button"
            className="admin-button secondary"
            disabled={busy}
            onClick={close}
          >
            Hủy
          </button>
          <button className="admin-button" disabled={busy}>
            {busy ? "Đang lưu…" : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
export function Toolbar({
  search,
  setSearch,
  children,
}: {
  search: string;
  setSearch: (value: string) => void;
  children?: ReactNode;
}) {
  return (
    <div className="admin-toolbar">
      <label className="admin-search">
        <Search size={17} />
        <input
          aria-label="Tìm kiếm"
          placeholder="Tìm kiếm…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </label>
      {children}
    </div>
  );
}
export function exportCsv(name: string, rows: (string | number)[][]) {
  const csv =
    "\uFEFF" +
    rows
      .map((row) =>
        row
          .map(
            (v) =>
              '"' +
              String(v)
                .replace(/^[=+@\-\t\r]/, "'$&")
                .replaceAll('"', '""') +
              '"',
          )
          .join(","),
      )
      .join("\r\n");
  const url = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8;" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = name + ".csv";
  a.click();
  URL.revokeObjectURL(url);
}
export function ExportButton({ run }: { run: () => void }) {
  return (
    <button className="admin-button secondary" onClick={run}>
      <ArrowDownToLine size={16} />
      Xuất CSV
    </button>
  );
}
