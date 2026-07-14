"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Stage = "idle" | "processing" | "done";

const PIPELINE_STEPS = [
  "doc_ir",
  "world mapping",
  "glossary + claims",
  "storyboard",
  "rendering (veo 3.1)",
];

export default function PaperBookDemo() {
  const [stage, setStage] = useState<Stage>("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isOverDropzone, setIsOverDropzone] = useState(false);
  const timers = useRef<number[]>([]);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const checkOverDropzone = (event: MouseEvent | TouchEvent | PointerEvent) => {
    const rect = dropZoneRef.current?.getBoundingClientRect();
    if (!rect) return;
    const p = "touches" in event && event.touches.length ? event.touches[0] : (event as MouseEvent);
    const over = p.clientX >= rect.left && p.clientX <= rect.right && p.clientY >= rect.top && p.clientY <= rect.bottom;
    setIsOverDropzone((prev) => (prev === over ? prev : over));
  };

  const runPipeline = () => {
    if (stage !== "idle") return;
    setStage("processing");
    setStepIndex(0);

    PIPELINE_STEPS.forEach((_, i) => {
      const t = window.setTimeout(() => setStepIndex(i), i * 500);
      timers.current.push(t);
    });

    const finalT = window.setTimeout(() => {
      setStage("done");
    }, PIPELINE_STEPS.length * 500 + 300);
    timers.current.push(finalT);
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setStage("idle");
    setStepIndex(0);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* top row: the paper thumbnail (idle), an arrow pointing down at the
          drop zone below, or the pipeline steps (processing) */}
      <div className="flex h-32 items-center gap-5">
        <AnimatePresence mode="popLayout">
          {stage === "idle" && (
            <motion.div
              key="paper"
              drag
              dragSnapToOrigin
              animate={
                isDragging
                  ? { y: 0, rotate: 0 }
                  : { y: [0, -4, 0], rotate: [0, -1.2, 1.2, 0] }
              }
              transition={
                isDragging
                  ? { duration: 0.1 }
                  : {
                      duration: 1.8,
                      repeat: Infinity,
                      repeatDelay: 0.6,
                      ease: "easeInOut",
                    }
              }
              onDragStart={() => setIsDragging(true)}
              onDrag={(e) => checkOverDropzone(e)}
              onDragEnd={(_, info) => {
                setIsDragging(false);
                setIsOverDropzone(false);
                if (info.offset.x > 60 || info.offset.y > 30) runPipeline();
              }}
              whileDrag={{ scale: 1.08, cursor: "grabbing", zIndex: 50 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              className="relative flex h-32 w-24 shrink-0 flex-col gap-1.5 rounded-sm border p-2 shadow-md"
              style={{
                background: "#fdfaf4",
                borderColor: "var(--geek-line)",
                color: "#2a2620",
                cursor: "grab",
                zIndex: 10,
              }}
            >
              <motion.span
                aria-hidden
                className="pointer-events-none absolute -inset-1 rounded-md border-2"
                style={{
                  borderColor: "var(--geek-accent)",
                  boxShadow: "0 0 18px var(--geek-accent)",
                }}
                animate={
                  isDragging
                    ? { opacity: 0, scale: 1 }
                    : { opacity: [0.2, 0.72, 0.2], scale: [1, 1.035, 1] }
                }
                transition={{
                  duration: 1.8,
                  repeat: isDragging ? 0 : Infinity,
                  repeatDelay: 0.6,
                  ease: "easeInOut",
                }}
              />
              <span
                className="h-1 w-full rounded-full"
                style={{ background: "var(--geek-accent)" }}
              />
              <span className="font-serif text-[9px] font-bold leading-tight">
                Attention is all your need
              </span>
              <span className="mt-auto flex flex-col gap-0.5 opacity-30">
                <span className="h-[3px] w-full rounded-full bg-current" />
                <span className="h-[3px] w-4/5 rounded-full bg-current" />
                <span className="h-[3px] w-full rounded-full bg-current" />
                <span className="h-[3px] w-3/5 rounded-full bg-current" />
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {stage === "idle" && (
          <div className="flex flex-1 items-center justify-center">
            <motion.svg
              viewBox="0 0 120 110"
              className="h-24 w-28"
              style={{ color: "var(--geek-accent)", transform: "scaleX(-1)" }}
              aria-hidden
              animate={{ opacity: [0.45, 1, 0.45] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <path
                d="M100 14 C58 14 34 18 30 46 C27 66 30 78 30 84"
                fill="none"
                stroke="currentColor"
                strokeWidth={5}
                strokeLinecap="round"
              />
              <path
                d="M18 70 L30 86 L42 70"
                fill="none"
                stroke="currentColor"
                strokeWidth={5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </div>
        )}

        {stage === "processing" && (
          <div className="flex h-full flex-col items-start justify-center gap-1.5 font-mono text-xs">
            {PIPELINE_STEPS.map((step, i) => (
              <span
                key={step}
                className="flex items-center gap-1.5"
                style={{
                  opacity: i <= stepIndex ? 1 : 0.25,
                  color: i === stepIndex ? "var(--geek-accent)" : undefined,
                }}
              >
                {i < stepIndex ? "✓" : i === stepIndex ? "▸" : "·"} {step}
              </span>
            ))}
          </div>
        )}

        {stage === "done" && (
          <span className="font-mono text-xs opacity-50">
            ✓ rendered — playing below
          </span>
        )}
      </div>

      {/* the screen — an upload dropzone before rendering, then a full,
          tall video player once the explainer is ready */}
      <div
        className="relative aspect-video w-full min-h-[280px] overflow-hidden rounded-xl border"
        style={{
          borderColor: "var(--geek-line)",
          background: stage === "done" ? "#050908" : "var(--geek-bg-raised)",
        }}
      >
        {stage !== "done" && (
          <motion.div
            ref={dropZoneRef}
            className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed text-center"
            animate={{
              scale: isOverDropzone ? 1.03 : 1,
              borderColor: isOverDropzone
                ? "var(--geek-accent)"
                : "color-mix(in srgb, var(--geek-accent) 45%, transparent)",
              background: isOverDropzone
                ? "color-mix(in srgb, var(--geek-accent) 20%, transparent)"
                : "color-mix(in srgb, var(--geek-accent) 8%, transparent)",
              boxShadow: isOverDropzone
                ? "0 0 0 8px color-mix(in srgb, var(--geek-accent) 22%, transparent)"
                : "0 0 0 0px transparent",
            }}
            transition={{ duration: 0.18 }}
          >
            <span
              className="font-mono text-lg font-semibold tracking-wide sm:text-xl"
              style={{ color: "var(--geek-accent)" }}
            >
              {isOverDropzone
                ? "release to drop ↓"
                : stage === "processing"
                  ? "generating your explainer…"
                  : "Drag above paper here"}
            </span>
          </motion.div>
        )}

        <AnimatePresence>
          {stage === "done" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0"
            >
              <video
                className="h-full w-full object-cover"
                src="/paperbook/explainer.mp4"
                poster="/paperbook/cover.jpg"
                controls
                autoPlay
                muted
                playsInline
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {stage !== "idle" && (
        <button
          onClick={reset}
          className="self-start font-mono text-xs underline opacity-60 hover:opacity-100"
        >
          reset demo
        </button>
      )}
    </div>
  );
}
