"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function ProjectTip({
  accent,
  children,
}: {
  accent: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 self-start rounded-full border px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em]"
        style={{
          borderColor: `color-mix(in srgb, ${accent} 30%, var(--geek-line))`,
          color: accent,
        }}
      >
        <span
          className="flex h-5 w-5 items-center justify-center rounded-full text-xs"
          style={{ background: `color-mix(in srgb, ${accent} 16%, transparent)` }}
          aria-hidden
        >
          💡
        </span>
        why this exists
        <span aria-hidden>{open ? "▲" : "▾"}</span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{ overflow: "hidden" }}
          >
            <aside
              className="rounded-xl border px-4 py-3.5 sm:px-5 sm:py-4"
              style={{
                borderColor: `color-mix(in srgb, ${accent} 30%, var(--geek-line))`,
                background: `color-mix(in srgb, ${accent} 7%, var(--geek-bg-raised))`,
              }}
            >
              <div className="flex flex-col gap-2 text-[15px] leading-[1.65] opacity-80">
                {children}
              </div>
            </aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
