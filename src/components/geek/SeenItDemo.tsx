"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const QUERIES = [
  { text: "go back to where he loosens the bolt", pct: 34 },
  { text: "skip to the part he tightens it back up", pct: 78 },
];

export default function SeenItDemo() {
  const [progress, setProgress] = useState(12);
  const [showRec, setShowRec] = useState(false);
  const [busy, setBusy] = useState(false);

  const jump = (pct: number) => {
    if (busy) return;
    setBusy(true);
    setProgress(pct);
    window.setTimeout(() => setShowRec(true), 500);
    window.setTimeout(() => setShowRec(false), 3000);
    window.setTimeout(() => setBusy(false), 3200);
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        className="relative h-32 w-full overflow-hidden rounded-lg border"
        style={{ borderColor: "var(--geek-line)", background: "#050908" }}
      >
        <div className="flex h-full items-center justify-center font-mono text-[10px] opacity-40">
          ▸ &quot;how to change a bike tire&quot;
        </div>

        <AnimatePresence>
          {showRec && (
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              className="absolute bottom-2 right-2 max-w-[65%] rounded-md px-2 py-1.5 font-mono text-[10px]"
              style={{
                background: "var(--geek-bg-raised)",
                color: "var(--geek-fg)",
                border: "1px solid var(--geek-line)",
              }}
            >
              also liked: this wrench, $9 →
            </motion.div>
          )}
        </AnimatePresence>

        {/* progress bar */}
        <div
          className="absolute bottom-0 left-0 h-1 w-full"
          style={{ background: "var(--geek-line)" }}
        >
          <motion.div
            className="h-full"
            style={{ background: "var(--geek-accent)" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full"
            style={{ background: "var(--geek-accent)" }}
            animate={{ left: `calc(${progress}% - 4px)` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {QUERIES.map((q) => (
          <button
            key={q.text}
            onClick={() => jump(q.pct)}
            disabled={busy}
            className="rounded-full border px-3 py-1.5 font-mono text-[11px] disabled:opacity-40"
            style={{ borderColor: "var(--geek-line)" }}
          >
            &quot;{q.text}&quot;
          </button>
        ))}
      </div>
      <p className="font-mono text-[10px] opacity-40">
        recommendation slides in quietly, then gets out of the way.
      </p>
    </div>
  );
}
