"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSweep } from "@/lib/sweep-context";

type TaskState = "idle" | "running" | "done";

const TASKS = [
  {
    id: "claude",
    label: "CLAUDE CODE",
    color: "#f85149",
    command:
      "Sneak some entirely unnecessary code into Gemma’s open-source model — then open a PR.",
  },
  {
    id: "codex",
    label: "CODEX",
    color: "#39d353",
    command:
      "Stop Claude from quietly deleting the skill Gemini just wrote to the C:\\ drive.",
  },
  {
    id: "gemini",
    label: "GEMINI CLI",
    color: "#e3b341",
    command:
      "Finish writing the skills — preferably before the other two agents rewrite them again.",
  },
] as const;

const ROBOT_COLOR = "#00d4aa";

export default function DispatchEasterEgg() {
  const [connected, setConnected] = useState(false);
  const [taskStates, setTaskStates] = useState<Record<string, TaskState>>({});
  const [robotWarning, setRobotWarning] = useState(false);
  const timers = useRef<number[]>([]);
  const { trigger, phase } = useSweep();

  useEffect(
    () => () => {
      timers.current.forEach(window.clearTimeout);
    },
    []
  );

  const runTask = (id: string) => {
    if (taskStates[id] && taskStates[id] !== "idle") return;
    setTaskStates((current) => ({ ...current, [id]: "running" }));
    timers.current.push(
      window.setTimeout(() => {
        setTaskStates((current) => ({ ...current, [id]: "done" }));
      }, 1250)
    );
  };

  const wakeRobot = () => {
    if (robotWarning || phase !== "idle") return;
    setRobotWarning(true);
    timers.current.push(window.setTimeout(trigger, 850));
  };

  return (
    <div
      className="relative min-h-[260px] overflow-visible rounded-xl border p-4 sm:min-h-[300px] sm:p-5"
      style={{
        background: "#0a0c0f",
        borderColor: "#1e2530",
        color: "#c8d0dc",
      }}
    >
      <AnimatePresence mode="wait">
        {!connected ? (
          <motion.div
            key="connect"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <button
              type="button"
              onClick={() => setConnected(true)}
              className="w-full max-w-80 rounded-md px-5 py-3 font-mono text-xs font-semibold tracking-[0.08em] transition-transform active:scale-[0.97]"
              style={{ background: ROBOT_COLOR, color: "#000" }}
            >
              connect
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="sessions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-2.5"
          >
            {TASKS.map((task, index) => {
              const status = taskStates[task.id] ?? "idle";
              return (
                <motion.button
                  key={task.id}
                  type="button"
                  onClick={() => runTask(task.id)}
                  disabled={status !== "idle"}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.11, duration: 0.3 }}
                  className="relative overflow-hidden rounded-md border px-3 py-3 text-left disabled:cursor-default sm:px-4"
                  style={{
                    borderColor: status === "idle" ? "#1e2530" : `${task.color}88`,
                    background: "#111418",
                  }}
                >
                  <span className="flex items-center gap-2.5">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{
                        background: task.color,
                        boxShadow: `0 0 8px ${task.color}aa`,
                      }}
                    />
                    <span
                      className="rounded-full border px-2 py-0.5 font-mono text-[9px] tracking-[0.08em]"
                      style={{
                        color: task.color,
                        borderColor: `${task.color}66`,
                        background: `${task.color}12`,
                      }}
                    >
                      {task.label}
                    </span>
                    <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.12em] text-[#4a5568]">
                      {status === "idle" ? "run" : status === "running" ? "working…" : "done ✓"}
                    </span>
                  </span>
                  <span className="mt-2 block font-mono text-[11px] leading-[1.55] text-[#c8d0dc]">
                    {task.command}
                  </span>
                  <span className="mt-2 block h-0.5 overflow-hidden rounded-full bg-[#1e2530]">
                    {status !== "idle" ? (
                      <motion.span
                        className="block h-full rounded-full"
                        style={{ background: task.color }}
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.15, ease: "easeInOut" }}
                      />
                    ) : null}
                  </span>
                </motion.button>
              );
            })}

            <motion.button
              type="button"
              onClick={wakeRobot}
              disabled={robotWarning || phase !== "idle"}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.33, duration: 0.3 }}
              className="rounded-md border px-3 py-3 text-left disabled:cursor-default sm:px-4"
              style={{ borderColor: "#1e2530", background: "#111418" }}
            >
              <span className="flex items-center gap-2.5">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{
                    background: ROBOT_COLOR,
                    boxShadow: `0 0 8px ${ROBOT_COLOR}aa`,
                  }}
                />
                <span
                  className="rounded-full border px-2 py-0.5 font-mono text-[9px] tracking-[0.08em]"
                  style={{
                    color: ROBOT_COLOR,
                    borderColor: `${ROBOT_COLOR}66`,
                    background: `${ROBOT_COLOR}12`,
                  }}
                >
                  ROBOT VACUUM
                </span>
              </span>
              <span className="mt-2 block font-mono text-[11px] leading-[1.55] text-[#c8d0dc]">
                Start the robot vacuum and clean absolutely everything.
              </span>
              <motion.span
                className="mt-2 block origin-left rounded border px-2 py-1.5 font-mono text-[9px] leading-[1.45]"
                style={{
                  color: robotWarning ? "#ff6b35" : "#7d8797",
                  borderColor: robotWarning ? "#ff6b35" : "#2a313d",
                  background: robotWarning ? "rgba(255, 107, 53, 0.12)" : "transparent",
                }}
                animate={
                  robotWarning
                    ? { scale: [1, 1.1, 1.06], x: [0, -3, 3, 0] }
                    : { scale: 1, x: 0 }
                }
                transition={{ duration: 0.55 }}
              >
                SYSTEM WARNING: Do not click. This control will connect to and
                start my completely fake robot vacuum.
              </motion.span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
