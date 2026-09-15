"use client";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
const key = "tt-apartment-intro-seen-v1";
export default function FirstVisitSplash() {
  const reduced = useReducedMotion(),
    [visible, setVisible] = useState(
      () => typeof window !== "undefined" && !localStorage.getItem(key),
    );
  useEffect(() => {
    if (!visible) return;
    localStorage.setItem(key, "1");
    const timer = window.setTimeout(
      () => setVisible(false),
      reduced ? 350 : 1900,
    );
    return () => window.clearTimeout(timer);
  }, [visible, reduced]);
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          transition={{
            duration: reduced ? 0.15 : 0.65,
            ease: [0.76, 0, 0.24, 1],
          }}
          className="fixed inset-0 z-[200] grid place-items-center bg-[#173f34] text-white"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.7, opacity: 0, rotate: -8 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto grid size-20 place-items-center rounded-full border border-white/25 font-display text-2xl"
            >
              TT
            </motion.div>
            <div className="mt-6 overflow-hidden">
              <motion.p
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{
                  delay: 0.28,
                  duration: 0.65,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-sm font-bold tracking-[.34em]"
              >
                TT APARTMENT
              </motion.p>
            </div>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                delay: 0.45,
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mx-auto mt-6 block h-px w-32 origin-left bg-[#efb282]"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55 }}
              transition={{ delay: 0.85 }}
              className="mt-4 text-[9px] uppercase tracking-[.28em]"
            >
              Da Nang · Vietnam
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
