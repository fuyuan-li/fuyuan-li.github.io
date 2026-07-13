"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { ModeProvider, useMode } from "@/lib/mode-context";
import { SweepProvider, useSweep } from "@/lib/sweep-context";
import ModeToggle from "@/components/shared/ModeToggle";
import TransitionOverlay from "@/components/shared/TransitionOverlay";
import RobotSweepOverlay from "@/components/shared/RobotSweepOverlay";
import SweepItem from "@/components/shared/SweepItem";
import GeekView from "@/components/geek/GeekView";
import RockView from "@/components/rock/RockView";

function Shell() {
  const { mode } = useMode();
  const { phase, reset } = useSweep();
  const isRock = mode === "rock";

  // switching mode always hands back a clean page in the other theme
  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const swept = phase === "active";

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        background: isRock ? "var(--rock-bg)" : "var(--geek-bg)",
        color: isRock ? "var(--rock-fg)" : "var(--geek-fg)",
      }}
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-10 px-5 py-10 sm:px-8 sm:py-14">
        <div className="flex items-center justify-between">
          <SweepItem at={0.05}>
            <span
              className={
                isRock
                  ? "font-display text-2xl tracking-wide"
                  : "font-mono text-sm opacity-70"
              }
            >
              {isRock ? "F.LI" : "fuyuan_li.io"}
            </span>
          </SweepItem>
          <motion.div
            animate={
              swept
                ? {
                    scale: [1, 1.15, 1],
                    boxShadow: "0 0 0 4px var(--geek-accent-dim)",
                  }
                : { scale: 1, boxShadow: "0 0 0 0px transparent" }
            }
            transition={{ duration: 0.6, delay: swept ? 1.9 : 0 }}
            className="rounded-full"
          >
            <ModeToggle />
          </motion.div>
        </div>

        {isRock ? <RockView /> : <GeekView />}
      </div>

      <TransitionOverlay />
      {!isRock && <RobotSweepOverlay />}
    </div>
  );
}

export default function PortfolioShell() {
  return (
    <ModeProvider>
      <SweepProvider>
        <Shell />
      </SweepProvider>
    </ModeProvider>
  );
}
