"use client";

import { motion } from "framer-motion";
import { useSweep } from "@/lib/sweep-context";

export default function SweepItem({
  at,
  children,
  className,
}: {
  at: number;
  children: React.ReactNode;
  className?: string;
}) {
  const { phase, progress } = useSweep();
  const hidden = (phase === "sweeping" || phase === "done") && progress >= at;

  return (
    <div className={`relative ${className ?? ""}`}>
      <motion.div
        aria-hidden={hidden}
        inert={hidden}
        animate={{
          opacity: hidden ? 0 : 1,
          scale: hidden ? 0.96 : 1,
          filter: hidden ? "blur(3px)" : "blur(0px)",
        }}
        transition={{ duration: 0.22 }}
        style={{ pointerEvents: hidden ? "none" : "auto" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
