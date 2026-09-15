"use client";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { motion } from "motion/react";
import { X } from "lucide-react";
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export function DialogContent({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[#07150f]/55 backdrop-blur-sm data-[state=open]:animate-[fade_.2s_ease]" />
      <DialogPrimitive.Content
        className={`fixed left-1/2 top-1/2 z-50 w-[min(560px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 outline-none ${className}`}
      >
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="rounded-3xl bg-white p-6 shadow-floating"
        >
          <DialogPrimitive.Title className="pr-10 font-display text-3xl font-semibold">
            {title}
          </DialogPrimitive.Title>
          <DialogPrimitive.Close
            className="focus-ring absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-black/5"
            aria-label="Close"
          >
            <X size={18} />
          </DialogPrimitive.Close>
          {children}
        </motion.div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
