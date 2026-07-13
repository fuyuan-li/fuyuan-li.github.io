"use client";

import { useMode } from "@/lib/mode-context";

export default function ModeToggle() {
  const { mode, phase, requestToggle } = useMode();
  const isRock = mode === "rock";
  const busy = phase !== "idle";

  return (
    <button
      type="button"
      onClick={requestToggle}
      disabled={busy}
      aria-label={
        isRock ? "Switch to geek mode" : "Switch to rockstar mode"
      }
      aria-pressed={isRock}
      className="group relative flex items-center gap-3 rounded-full border px-3 py-2 font-mono text-xs tracking-wide transition-colors disabled:cursor-wait"
      style={{
        borderColor: isRock ? "var(--rock-line)" : "var(--geek-line)",
        background: isRock ? "var(--rock-bg-raised)" : "var(--geek-bg-raised)",
        color: isRock ? "var(--rock-fg)" : "var(--geek-fg)",
      }}
    >
      <span className="hidden sm:inline opacity-70">geek</span>
      <span
        className="relative h-6 w-12 rounded-full transition-colors duration-300"
        style={{
          background: isRock ? "var(--rock-accent)" : "var(--geek-accent-dim)",
        }}
      >
        <span
          className="absolute top-0.5 h-5 w-5 rounded-full shadow-md transition-all duration-300 ease-out flex items-center justify-center text-[10px]"
          style={{
            left: isRock ? "calc(100% - 22px)" : "2px",
            background: isRock ? "var(--rock-fg)" : "var(--geek-accent)",
            color: isRock ? "var(--rock-bg)" : "var(--geek-bg)",
          }}
        >
          {isRock ? "♪" : ">_"}
        </span>
      </span>
      <span className="hidden sm:inline opacity-70">rock</span>
    </button>
  );
}
