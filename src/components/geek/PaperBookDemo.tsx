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
  const timers = useRef<number[]>([]);

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
              onDragEnd={(_, info) => {
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
          <div className="flex flex-1 flex-col items-center justify-center gap-1">
            <motion.span
              className="font-mono text-xs opacity-50"
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            >
              drag the paper down ↓
            </motion.span>
            <motion.span
              className="text-2xl"
              style={{ color: "var(--geek-accent)" }}
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            >
              ↓
            </motion.span>
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
          <div
            className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed text-center"
            style={{
              borderColor: "color-mix(in srgb, var(--geek-accent) 45%, transparent)",
              background: "color-mix(in srgb, var(--geek-accent) 8%, transparent)",
            }}
          >
            <span
              className="font-mono text-lg font-semibold tracking-wide sm:text-xl"
              style={{ color: "var(--geek-accent)" }}
            >
              try it here
            </span>
            <span className="font-mono text-xs opacity-50">
              {stage === "processing"
                ? "generating your explainer…"
                : "drop the paper above into this zone"}
            </span>
          </div>
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
