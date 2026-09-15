"use client";
import * as Toast from "@radix-ui/react-toast";
import { CheckCircle2, Info, XCircle } from "lucide-react";
import { createContext, useCallback, useContext, useState } from "react";
type Kind = "success" | "info" | "error";
type Item = { id: number; title: string; kind: Kind };
const Context = createContext<{ notify: (title: string, kind?: Kind) => void }>(
  { notify: () => {} },
);
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const notify = useCallback(
    (title: string, kind: Kind = "success") =>
      setItems((v) => [...v, { id: Date.now(), title, kind }]),
    [],
  );
  return (
    <Context.Provider value={{ notify }}>
      <Toast.Provider swipeDirection="right">
        {children}
        {items.map((item) => (
          <Toast.Root
            key={item.id}
            defaultOpen
            duration={3200}
            onOpenChange={(open) =>
              !open && setItems((v) => v.filter((x) => x.id !== item.id))
            }
            className="flex items-center gap-3 rounded-2xl bg-ink px-4 py-3 text-white shadow-floating"
          >
            <span
              className={
                item.kind === "error" ? "text-red-300" : "text-emerald-300"
              }
            >
              {item.kind === "success" ? (
                <CheckCircle2 />
              ) : item.kind === "error" ? (
                <XCircle />
              ) : (
                <Info />
              )}
            </span>
            <Toast.Title className="text-sm font-semibold">
              {item.title}
            </Toast.Title>
          </Toast.Root>
        ))}
        <Toast.Viewport className="fixed bottom-6 right-6 z-[100] grid w-[min(380px,calc(100vw-32px))] gap-2" />
      </Toast.Provider>
    </Context.Provider>
  );
}
export const useToast = () => useContext(Context);
