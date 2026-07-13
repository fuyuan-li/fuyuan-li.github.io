"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useSweep } from "@/lib/sweep-context";

export default function RobotSweepOverlay() {
  const { phase, progress } = useSweep();
  const done = phase === "active" && progress >= 1;

  return (
    <AnimatePresence>
      {done && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-x-0 top-24 z-[70] flex flex-col items-end gap-1 px-5 sm:px-8 font-mono text-xs"
          style={{ color: "var(--geek-fg)" }}
        >
          <span className="mr-1 -mb-1">↗ only the switch survived</span>
          <span className="opacity-50">go ahead, flip it.</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
