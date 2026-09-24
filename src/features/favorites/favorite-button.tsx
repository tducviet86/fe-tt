"use client";
import { Heart } from "lucide-react";
import { useSyncExternalStore } from "react";
import { useToast } from "@/components/ui/toast-provider";
const key = "the-stay-favorites";
function snapshot() {
  try {
    return localStorage.getItem(key) ?? "[]";
  } catch {
    return "[]";
  }
}
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("favorites-changed", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("favorites-changed", callback);
  };
}
export function useFavorites(): string[] {
  const raw = useSyncExternalStore(subscribe, snapshot, () => "[]");
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value)
      ? value.filter((v): v is string => typeof v === "string")
      : [];
  } catch {
    return [];
  }
}
export function FavoriteButton({
  code,
  label = "Lưu căn",
}: {
  code: string;
  label?: string;
}) {
  const values = useFavorites(),
    saved = values.includes(code);
  const { notify } = useToast();
  function toggle() {
    try {
      localStorage.setItem(
        key,
        JSON.stringify(
          saved ? values.filter((v) => v !== code) : [...values, code],
        ),
      );
      window.dispatchEvent(new Event("favorites-changed"));
      notify(
        saved ? "Đã bỏ khỏi danh sách lưu" : "Đã thêm vào yêu thích",
        saved ? "info" : "success",
      );
    } catch {
      notify("Trình duyệt chưa cho phép lưu căn.", "error");
    }
  }
  return (
    <button
      type="button"
      onClick={toggle}
      className="focus-ring grid size-10 place-items-center rounded-full bg-white/92 text-ink shadow-sm active:scale-95"
      aria-label={label}
      aria-pressed={saved}
    >
      <Heart size={19} fill={saved ? "#263e56" : "none"} />
    </button>
  );
}
