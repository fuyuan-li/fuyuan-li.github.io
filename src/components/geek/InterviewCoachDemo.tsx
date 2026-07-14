"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Phase = "idle" | "processing" | "questions" | "interview" | "reportLoading" | "report";

// verbatim from the real product's loading copy
const PROCESS_STEPS = [
  "Reading your resume…",
  "Digesting the role & requirements…",
  "Matching you to the interview bar…",
  "Designing your CV deep-dive questions…",
  "Adding behavioral & follow-up probes…",
  "Polishing the final set…",
];

const QUESTIONS = [
  "How do you handle your boss constantly overcommitting Tesla to the public?",
  "Your resume says you led the SpaceX program — walk me through a failure and how you handled it.",
  "Walk me through the technical challenges of training the Fable5 model you contributed to.",
];

type Line = { from: "ai" | "user"; text: string };

const SCRIPT: Line[] = [
  { from: "ai", text: "How do you handle your boss constantly overcommitting Tesla to the public?" },
  { from: "user", text: "I deleted Twitter." },
  { from: "ai", text: "Did that solve the problem?" },
  { from: "user", text: "No — because I reinstalled X." },
  { from: "ai", text: "Your resume says you led the SpaceX program. Tell me about a failure and how you handled it." },
  { from: "user", text: "A big one: by 2026 we'd racked up 5 failed test flights out of 12." },
  { from: "ai", text: "How did you deal with that?" },
  { from: "user", text: "Oh — we IPO'd. Spread the risk to the shareholders." },
  { from: "ai", text: "Walk me through the technical challenges of training the Fable5 model you worked on." },
  { from: "user", text: "I distilled GPT-5, then distilled Gemini 3, and ended up beating both." },
];

const REPORT_STEPS = [
  "Scoring your answers…",
  'Checking if "I deleted Twitter" counts as conflict resolution…',
  "Calculating shareholder risk transfer…",
  "Finalizing your scorecard…",
];

const SCORES = [
  { label: "Technical Depth", value: 8, comment: "Distillation isn't a technical challenge. It's a vibe." },
  { label: "Problem Solving", value: 15, comment: "Reinstalling the app you just deleted isn't iteration." },
  { label: "Communication", value: 62, comment: "Clear. Just... not reassuring." },
  { label: "Structure (STAR)", value: 5, comment: "Situation: bad. Task: unclear. Action: deleted an app. Result: IPO." },
  { label: "Specificity", value: 71, comment: "Points for citing an actual number (5 of 12)." },
  { label: "Ownership", value: 3, comment: '"We spread the risk to shareholders" is not ownership.' },
];

const OVERALL = Math.round(SCORES.reduce((s, x) => s + x.value, 0) / SCORES.length);

function scoreColor(v: number) {
  if (v < 35) return "#dc2626";
  if (v < 70) return "#d97706";
  return "#059669";
}

function RadarChart({ accent }: { accent: string }) {
  const size = 220;
  const center = size / 2;
  const maxR = 78;
  const step = (Math.PI * 2) / SCORES.length;
  const pointAt = (i: number, r: number) => {
    const angle = -Math.PI / 2 + i * step;
    return [center + r * Math.cos(angle), center + r * Math.sin(angle)] as const;
  };
  const shape = SCORES.map((s, i) => pointAt(i, (s.value / 100) * maxR));

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-56 w-56 shrink-0">
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <polygon
          key={f}
          points={SCORES.map((_, i) => pointAt(i, maxR * f).join(",")).join(" ")}
          fill="none"
          stroke="var(--geek-line)"
        />
      ))}
      {SCORES.map((_, i) => {
        const [x, y] = pointAt(i, maxR);
        return <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="var(--geek-line)" />;
      })}
      <motion.polygon
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ transformOrigin: `${center}px ${center}px` }}
        points={shape.map((p) => p.join(",")).join(" ")}
        fill={`${accent}33`}
        stroke={accent}
        strokeWidth={2}
      />
      {SCORES.map((s, i) => {
        const [x, y] = pointAt(i, maxR + 22);
        return (
          <text
            key={i}
            x={x}
            y={y}
            fontSize="8.5"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="var(--geek-fg)"
            opacity={0.65}
            fontFamily="var(--font-mono)"
          >
            {s.label}
          </text>
        );
      })}
    </svg>
  );
}

function OverallRing({ value }: { value: number }) {
  const r = 40;
  const c = 2 * Math.PI * r;
  const color = scoreColor(value);
  return (
    <div className="relative h-28 w-28 shrink-0">
      <svg viewBox="0 0 100 100" className="h-28 w-28 -rotate-90">
        <circle cx={50} cy={50} r={r} fill="none" stroke="var(--geek-line)" strokeWidth={8} />
        <motion.circle
          cx={50}
          cy={50}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (value / 100) * c }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-2xl font-bold" style={{ color }}>
          {value}
        </span>
        <span className="font-mono text-[9px] opacity-50">/ 100</span>
      </div>
    </div>
  );
}

export default function InterviewCoachDemo() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [settledCount, setSettledCount] = useState(0);
  const [revealed, setRevealed] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const timers = useRef<number[]>([]);
  const charInterval = useRef<number | null>(null);

  const after = (ms: number, fn: () => void) => {
    const t = window.setTimeout(fn, ms);
    timers.current.push(t);
  };

  const clearAll = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (charInterval.current) window.clearInterval(charInterval.current);
  };

  const runProcessing = () => {
    if (phase !== "idle") return;
    setPhase("processing");
    setStepIndex(0);
    PROCESS_STEPS.forEach((_, i) => after(i * 450, () => setStepIndex(i)));
    after(PROCESS_STEPS.length * 450 + 500, () => setPhase("questions"));
  };

  const playLine = (index: number) => {
    if (index >= SCRIPT.length) return;
    setRevealed(0);
    const text = SCRIPT[index].text;
    let i = 0;
    charInterval.current = window.setInterval(() => {
      i += 1;
      setRevealed(i);
      if (i >= text.length) {
        if (charInterval.current) window.clearInterval(charInterval.current);
        after(700, () => {
          setSettledCount(index + 1);
          after(450, () => playLine(index + 1));
        });
      }
    }, 26);
  };

  const startInterview = () => {
    setPhase("interview");
    setSettledCount(0);
    setRevealed(0);
    after(400, () => playLine(0));
  };

  const runReport = () => {
    setPhase("reportLoading");
    setStepIndex(0);
    REPORT_STEPS.forEach((_, i) => after(i * 550, () => setStepIndex(i)));
    after(REPORT_STEPS.length * 550 + 600, () => setPhase("report"));
  };

  const reset = () => {
    clearAll();
    setPhase("idle");
    setStepIndex(0);
    setSettledCount(0);
    setRevealed(0);
  };

  const interviewDone = settledCount >= SCRIPT.length;
  const activeLine = phase === "interview" && !interviewDone ? SCRIPT[settledCount] : null;

  return (
    <div className="flex flex-col gap-5">
      {/* idle: drop the resume in */}
      {phase === "idle" && (
        <div className="flex h-40 items-center gap-5">
          <motion.div
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
            onDragEnd={(_, info) => {
              setIsDragging(false);
              if (info.offset.x > 60 || info.offset.y > 30) runProcessing();
            }}
            whileDrag={{ scale: 1.08, cursor: "grabbing", zIndex: 50 }}
            className="relative flex h-32 w-24 shrink-0 flex-col gap-1.5 rounded-sm border p-2 shadow-md"
            style={{ background: "#fdfaf4", borderColor: "var(--geek-line)", color: "#2a2620", cursor: "grab" }}
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
            <span className="h-1 w-full rounded-full" style={{ background: "var(--geek-accent)" }} />
            <span className="font-serif text-[9px] font-bold leading-tight">My Resume</span>
            <span className="mt-auto flex flex-col gap-0.5 opacity-30">
              <span className="h-[3px] w-full rounded-full bg-current" />
              <span className="h-[3px] w-4/5 rounded-full bg-current" />
              <span className="h-[3px] w-full rounded-full bg-current" />
              <span className="h-[3px] w-3/5 rounded-full bg-current" />
            </span>
          </motion.div>
          <div
            className="flex h-32 flex-1 items-center justify-center rounded-lg border-2 border-dashed text-center font-mono text-xs"
            style={{
              borderColor: "color-mix(in srgb, var(--geek-accent) 40%, transparent)",
              background: "color-mix(in srgb, var(--geek-accent) 6%, transparent)",
              color: "var(--geek-accent)",
            }}
          >
            ← drop your resume here
          </div>
        </div>
      )}

      {/* processing */}
      {phase === "processing" && (
        <div className="flex h-40 flex-col items-start justify-center gap-1.5 font-mono text-sm">
          {PROCESS_STEPS.map((step, i) => (
            <span
              key={step}
              className="flex items-center gap-2"
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

      {/* generated questions */}
      {phase === "questions" && (
        <div className="flex flex-col gap-3">
          <p className="font-mono text-xs opacity-50">your interview is ready. a preview of what&apos;s coming:</p>
          <ol className="flex flex-col gap-2">
            {QUESTIONS.map((q, i) => (
              <li key={q} className="flex gap-2 rounded-lg border p-3 text-sm" style={{ borderColor: "var(--geek-line)" }}>
                <span className="font-mono text-xs font-bold" style={{ color: "var(--geek-accent)" }}>
                  {i + 1}
                </span>
                {q}
              </li>
            ))}
          </ol>
          <button
            onClick={startInterview}
            className="self-start rounded-full border px-4 py-2 font-mono text-xs"
            style={{ borderColor: "var(--geek-accent)", color: "var(--geek-accent)" }}
          >
            ▸ start live mock with AI interviewer
          </button>
        </div>
      )}

      {/* live interview: streaming voice → stacked transcript */}
      {phase === "interview" && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <AnimatePresence initial={false}>
              {SCRIPT.slice(0, settledCount).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 34, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.32, ease: "easeOut" }}
                  className="flex"
                  style={{ justifyContent: line.from === "ai" ? "flex-start" : "flex-end" }}
                >
                  <div
                    className="max-w-[80%] rounded-xl px-3 py-1.5 text-sm leading-snug"
                    style={{
                      background: line.from === "ai" ? "var(--geek-bg-raised)" : "var(--geek-accent)",
                      color: line.from === "ai" ? "var(--geek-fg)" : "#fff",
                      border: line.from === "ai" ? "1px solid var(--geek-line)" : "none",
                    }}
                  >
                    {line.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* mic + live streaming transcript */}
          {activeLine && (
            <div className="flex flex-col items-center gap-2 py-2">
              <motion.span
                className="text-2xl"
                animate={{ scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 0.9, repeat: Infinity }}
              >
                🎙
              </motion.span>
              <motion.div
                className="max-w-[85%] rounded-xl px-3 py-1.5 text-center text-sm leading-snug"
                style={{
                  background: activeLine.from === "ai" ? "var(--geek-bg-raised)" : "var(--geek-accent)",
                  color: activeLine.from === "ai" ? "var(--geek-fg)" : "#fff",
                  border: activeLine.from === "ai" ? "1px solid var(--geek-line)" : "none",
                  minHeight: "2em",
                }}
              >
                {activeLine.text.slice(0, revealed)}
                <motion.span
                  aria-hidden
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                >
                  ▍
                </motion.span>
              </motion.div>
            </div>
          )}

          {interviewDone && (
            <button
              onClick={runReport}
              className="self-start rounded-full border px-4 py-2 font-mono text-xs"
              style={{ borderColor: "var(--geek-accent)", color: "var(--geek-accent)" }}
            >
              ▸ generate my report
            </button>
          )}
        </div>
      )}

      {/* report loading */}
      {phase === "reportLoading" && (
        <div className="flex h-40 flex-col items-start justify-center gap-1.5 font-mono text-sm">
          {REPORT_STEPS.map((step, i) => (
            <span
              key={step}
              className="flex items-center gap-2"
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

      {/* report */}
      {phase === "report" && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-6">
            <OverallRing value={OVERALL} />
            <RadarChart accent="var(--geek-accent)" />
          </div>
          <div className="flex flex-col gap-3">
            {SCORES.map((s) => (
              <div key={s.label}>
                <div className="mb-1 flex items-center justify-between font-mono text-xs">
                  <span className="opacity-70">{s.label}</span>
                  <span style={{ color: scoreColor(s.value) }}>{s.value}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: "var(--geek-line)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: scoreColor(s.value) }}
                    initial={{ width: 0 }}
                    animate={{ width: `${s.value}%` }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  />
                </div>
                <p className="mt-1 text-xs italic opacity-50">{s.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {phase !== "idle" && (
        <button onClick={reset} className="self-start font-mono text-xs underline opacity-60 hover:opacity-100">
          reset
        </button>
      )}
    </div>
  );
}
