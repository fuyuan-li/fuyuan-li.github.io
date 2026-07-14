"use client";

import { memo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSweep } from "@/lib/sweep-context";

const CRACKS = [
  "M 61 59 L 48 44 L 39 25 L 22 10",
  "M 61 59 L 65 37 L 77 18 L 93 7",
  "M 61 59 L 81 54 L 96 42",
  "M 61 59 L 76 72 L 85 94",
  "M 61 59 L 54 78 L 39 96",
  "M 61 59 L 37 62 L 15 78 L 2 91",
  "M 48 44 L 30 43 L 12 31",
  "M 65 37 L 54 22 L 51 4",
  "M 76 72 L 98 77",
] as const;

const SHARDS = [
  { left: "13%", top: "18%", rotate: -18, delay: 0.08 },
  { left: "31%", top: "34%", rotate: 24, delay: 0.14 },
  { left: "68%", top: "16%", rotate: 35, delay: 0.1 },
  { left: "82%", top: "47%", rotate: -28, delay: 0.18 },
  { left: "55%", top: "72%", rotate: 18, delay: 0.12 },
  { left: "22%", top: "76%", rotate: -35, delay: 0.2 },
] as const;

const Vacuum = memo(function Vacuum() {
  return (
    <motion.div
      aria-hidden
      className="fixed z-[92] h-14 w-14"
      initial={{ left: "-7vw", top: "86vh", rotate: 0, opacity: 1 }}
      animate={{
        // 3 legs: bottom-left → right-mid → top-left → toggle (top-right)
        left: ["-7vw", "78vw", "5vw", "calc(100vw - 172px)"],
        top: ["86vh", "48vh", "10vh", "58px"],
        rotate: [0, 190, 340, 180],
        opacity: [1, 1, 1, 1],
      }}
      transition={{
        duration: 2.4,
        times: [0, 0.36, 0.7, 1],
        ease: "linear",
      }}
    >
      <span
        className="absolute inset-0 rounded-full border-2 border-[#2c3542] bg-[#111418] shadow-[0_0_22px_rgba(0,212,170,0.55)]"
      >
        <span className="absolute left-1/2 top-2 h-2.5 w-5 -translate-x-1/2 rounded-full border border-[#4a5568] bg-[#090b0d]" />
        <span className="absolute bottom-2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#00d4aa] shadow-[0_0_7px_#00d4aa]" />
      </span>
      <motion.span
        className="absolute -bottom-2 left-0 h-5 w-5 rounded-full border border-dashed border-[#00d4aa] opacity-70"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.45, repeat: Infinity, ease: "linear" }}
      />
      <motion.span
        className="absolute -bottom-2 right-0 h-5 w-5 rounded-full border border-dashed border-[#00d4aa] opacity-70"
        animate={{ rotate: -360 }}
        transition={{ duration: 0.45, repeat: Infinity, ease: "linear" }}
      />
      <span className="absolute left-1/2 top-1/2 -z-10 h-20 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00d4aa]/10 blur-xl" />
    </motion.div>
  );
});

export default function RobotSweepOverlay() {
  const { phase } = useSweep();

  return (
    <>
      <AnimatePresence>
        {phase === "cracking" ? (
          <motion.div
            key="cracked-screen"
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[90] overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
          >
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.72, 0.04, 0.16, 0] }}
              transition={{ duration: 0.6 }}
            />
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full drop-shadow-[0_0_4px_rgba(0,212,170,0.9)]"
            >
              {CRACKS.map((path, index) => (
                <motion.path
                  key={path}
                  d={path}
                  fill="none"
                  stroke={index % 2 ? "rgba(0,212,170,0.9)" : "rgba(255,255,255,0.95)"}
                  strokeWidth="0.24"
                  vectorEffect="non-scaling-stroke"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.32, delay: index * 0.025, ease: "easeOut" }}
                />
              ))}
            </svg>
            {SHARDS.map((shard) => (
              <motion.span
                key={`${shard.left}-${shard.top}`}
                className="absolute h-10 w-8 border border-white/50 bg-white/10 backdrop-blur-[1px]"
                style={{
                  left: shard.left,
                  top: shard.top,
                  clipPath: "polygon(50% 0, 100% 78%, 13% 100%)",
                }}
                initial={{ opacity: 0, y: 0, rotate: 0, scale: 0.5 }}
                animate={{ opacity: [0, 0.8, 0], y: 70, rotate: shard.rotate, scale: 1 }}
                transition={{ duration: 0.68, delay: shard.delay, ease: "easeIn" }}
              />
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {phase === "sweeping" ? <Vacuum /> : null}

      <AnimatePresence>
        {phase === "done" ? (
          <motion.div
            key="clean-message"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="pointer-events-none fixed right-5 top-24 z-[70] flex max-w-[280px] flex-col items-end gap-1 text-right font-mono text-[10px] sm:right-8 sm:text-xs"
            style={{ color: "var(--geek-fg)" }}
          >
            <motion.span
              className="text-lg leading-none"
              animate={{ x: [0, 6, 0], y: [0, -3, 0] }}
              transition={{ duration: 1.1, repeat: Infinity }}
            >
              ↗
            </motion.span>
            <span>contents are all cleared, only this toggle is available now</span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
