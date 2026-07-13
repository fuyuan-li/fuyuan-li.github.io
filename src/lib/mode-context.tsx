"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type Mode = "geek" | "rock";

type TransitionPhase = "idle" | "logging-off" | "logging-in";

interface ModeContextValue {
  mode: Mode;
  phase: TransitionPhase;
  requestToggle: () => void;
}

const ModeContext = createContext<ModeContextValue | null>(null);

// how long each half of the transition holds, in ms
const LOG_OFF_MS = 850;
const LOG_IN_MS = 750;

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("geek");
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const [isBusy, setIsBusy] = useState(false);

  const requestToggle = useCallback(() => {
    if (isBusy) return;
    setIsBusy(true);
    setPhase("logging-off");

    window.setTimeout(() => {
      setMode((m) => (m === "geek" ? "rock" : "geek"));
      setPhase("logging-in");

      window.setTimeout(() => {
        setPhase("idle");
        setIsBusy(false);
      }, LOG_IN_MS);
    }, LOG_OFF_MS);
  }, [isBusy]);

  const value = useMemo(
    () => ({ mode, phase, requestToggle }),
    [mode, phase, requestToggle]
  );

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error("useMode must be used within ModeProvider");
  return ctx;
}
