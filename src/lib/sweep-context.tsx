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

type SweepPhase = "idle" | "active";

interface SweepContextValue {
  phase: SweepPhase;
  progress: number; // 0..1
  trigger: () => void;
  reset: () => void;
}

const SweepContext = createContext<SweepContextValue | null>(null);

const DURATION_MS = 2600;

export function SweepProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<SweepPhase>("idle");
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  const reset = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setPhase("idle");
    setProgress(0);
  }, []);

  const trigger = useCallback(() => {
    if (phase === "active") return;
    setPhase("active");
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(1, elapsed / DURATION_MS);
      setProgress(p);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [phase]);

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

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
