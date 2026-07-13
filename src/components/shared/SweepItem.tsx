"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
  const hidden = phase === "active" && progress >= at;
  const [sweeping, setSweeping] = useState(false);
  const wasHidden = useRef(false);

  useEffect(() => {
    if (hidden && !wasHidden.current) {
      wasHidden.current = true;
      setSweeping(true);
      const t = window.setTimeout(() => setSweeping(false), 480);
      return () => window.clearTimeout(t);
    }
    if (!hidden) wasHidden.current = false;
  }, [hidden]);

  return (
    <div className={`relative ${className ?? ""}`}>
      <motion.div
        animate={{ opacity: hidden ? 0 : 1, scale: hidden ? 0.9 : 1 }}
        transition={{ duration: 0.25, delay: hidden ? 0.32 : 0 }}
      >
        {children}
      </motion.div>
      <AnimatePresence>
        {sweeping && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-20 flex items-center text-2xl"
            initial={{ x: "-10%", opacity: 1 }}
            animate={{ x: "110%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
          >
            🤖
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
