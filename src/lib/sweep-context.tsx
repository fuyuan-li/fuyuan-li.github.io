"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type SweepPhase = "idle" | "cracking" | "sweeping" | "done";

interface SweepContextValue {
  phase: SweepPhase;
  progress: number; // 0..1
  trigger: () => void;
  reset: () => void;
}

const SweepContext = createContext<SweepContextValue | null>(null);

const CRACK_MS = 850;
const SWEEP_MS = 4200;

export function SweepProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<SweepPhase>("idle");
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const crackTimerRef = useRef<number | null>(null);

  const reset = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (crackTimerRef.current) window.clearTimeout(crackTimerRef.current);
    setPhase("idle");
    setProgress(0);
  }, []);

  const trigger = useCallback(() => {
    if (phase !== "idle") return;
    setPhase("cracking");
    crackTimerRef.current = window.setTimeout(() => {
      setPhase("sweeping");
      const start = performance.now();
      const tick = (now: number) => {
        const elapsed = now - start;
        const p = Math.min(1, elapsed / SWEEP_MS);
        setProgress(p);
        if (p < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setPhase("done");
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    }, CRACK_MS);
  }, [phase]);

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (crackTimerRef.current) window.clearTimeout(crackTimerRef.current);
    },
    []
  );

  const value = useMemo(
    () => ({ phase, progress, trigger, reset }),
    [phase, progress, trigger, reset]
  );

  return <SweepContext.Provider value={value}>{children}</SweepContext.Provider>;
}

export function useSweep() {
  const ctx = useContext(SweepContext);
  if (!ctx) throw new Error("useSweep must be used within SweepProvider");
  return ctx;
}
