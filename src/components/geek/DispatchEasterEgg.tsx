"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSweep } from "@/lib/sweep-context";

const ACTIONS = [
  { label: "ship a feature to PaperBook", log: ["ssh home-desktop", "cd ~/gemini_hackathon", "git commit -am 'wip: new world template'", "deploying... ✓"] },
  { label: "keep hacking on WAND", log: ["ssh home-desktop", "cd ~/adk_agent_hackathon", "restarting live agent...", "wand: online ✓"] },
  { label: "fix a Seen It bug", log: ["ssh home-desktop", "cd ~/youtube-copilot", "pytest -k jump_to_moment", "3 passed ✓"] },
];

export default function DispatchEasterEgg() {
  const [runningLog, setRunningLog] = useState<string[] | null>(null);
  const { trigger } = useSweep();

  const runAction = (log: string[]) => {
    setRunningLog([]);
    log.forEach((line, i) => {
      window.setTimeout(() => {
        setRunningLog((prev) => (prev ? [...prev, line] : [line]));
      }, i * 350);
    });
    window.setTimeout(() => setRunningLog(null), log.length * 350 + 1400);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {ACTIONS.map((a) => (
          <button
            key={a.label}
            onClick={() => runAction(a.log)}
            className="rounded-full border px-3 py-1.5 font-mono text-[11px]"
            style={{ borderColor: "var(--geek-line)" }}
          >
            {a.label}
          </button>
        ))}
        <button
          onClick={trigger}
          className="rounded-full border px-3 py-1.5 font-mono text-[11px]"
          style={{ borderColor: "var(--geek-accent)", color: "var(--geek-accent)" }}
        >
          start the robot vacuum
        </button>
      </div>
      <p className="font-mono text-[10px] opacity-40">
        don&apos;t click that last one. you will really connect to my robot vacuum.
      </p>

      <div
        className="min-h-[88px] rounded-lg border p-2 font-mono text-[10px]"
        style={{ borderColor: "var(--geek-line)", background: "#050908" }}
      >
        <AnimatePresence>
          {runningLog?.map((line, i) => (
            <motion.div
              key={line + i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ color: "var(--geek-accent)" }}
            >
              $ {line}
            </motion.div>
          ))}
        </AnimatePresence>
        {!runningLog && (
          <span className="opacity-30">idle — waiting for a command from the couch</span>
        )}
      </div>
    </div>
  );
}
