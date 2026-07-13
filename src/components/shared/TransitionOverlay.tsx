"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMode } from "@/lib/mode-context";

const COPY = {
  "logging-off": {
    geek: { label: "logging off geek_mode", sub: "saving unsaved commits..." },
    rock: { label: "logging off rockstar_mode", sub: "coiling the cables..." },
  },
  "logging-in": {
    geek: { label: "logging in geek_mode", sub: "mounting /home/fuyuan..." },
    rock: {
      label: "logging in rockstar_mode",
      sub: "tuning up, 1-2-1-2...",
    },
  },
} as const;

export default function TransitionOverlay() {
  const { mode, phase } = useMode();

  if (phase === "idle") return null;

  const copy = COPY[phase][mode];
  const bg = mode === "rock" ? "var(--rock-bg)" : "var(--geek-bg)";
  const fg = mode === "rock" ? "var(--rock-fg)" : "var(--geek-fg)";
  const accent = mode === "rock" ? "var(--rock-accent)" : "var(--geek-accent)";

  return (
    <AnimatePresence>
      <motion.div
        key={phase}
        initial={{ clipPath: "inset(0 0 100% 0)" }}
        animate={{ clipPath: "inset(0 0 0% 0)" }}
        exit={{ clipPath: "inset(100% 0 0 0)" }}
        transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center font-mono"
        style={{ background: bg, color: fg }}
      >
        {/* scanline sweep */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 h-24 opacity-30"
          style={{
            background: `linear-gradient(180deg, transparent, ${accent}, transparent)`,
          }}
          initial={{ top: "-10%" }}
          animate={{ top: "110%" }}
          transition={{ duration: 0.9, ease: "linear", repeat: Infinity }}
        />

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.2 }}
          className="relative z-10 flex flex-col items-center gap-3 px-6 text-center"
        >
          <span className="text-xs uppercase tracking-[0.3em] opacity-60">
            system
          </span>
          <span className="text-lg sm:text-2xl">
            {copy.label}
            <motion.span
              aria-hidden
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
            >
              _
            </motion.span>
          </span>
          <span className="text-xs opacity-50">{copy.sub}</span>

          <div
            className="mt-2 h-1 w-48 overflow-hidden rounded-full"
            style={{ background: mode === "rock" ? "var(--rock-line)" : "var(--geek-line)" }}
          >
            <motion.div
              className="h-full"
              style={{ background: accent }}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: phase === "logging-off" ? 0.75 : 0.65, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
