"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { ModeProvider, useMode } from "@/lib/mode-context";
import { SweepProvider, useSweep } from "@/lib/sweep-context";
import ModeToggle from "@/components/shared/ModeToggle";
import TransitionOverlay from "@/components/shared/TransitionOverlay";
import RobotSweepOverlay from "@/components/shared/RobotSweepOverlay";
import SweepItem from "@/components/shared/SweepItem";
import ContactIcons from "@/components/shared/ContactIcons";
import GeekView from "@/components/geek/GeekView";
import RockView from "@/components/rock/RockView";

function Shell() {
  const { mode } = useMode();
  const { phase, progress, reset } = useSweep();
  const isRock = mode === "rock";

  // Every mode switch opens the other side from its beginning, even when the
  // toggle was reached through the vacuum easter egg at the bottom of Geek.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    reset();
  }, [mode, reset]);

  const toggleReturning = phase === "done" || (phase === "sweeping" && progress >= 0.78);
  const toggleAway = phase === "sweeping" && progress < 0.78;
  const toggleDetached = !isRock && (phase === "sweeping" || phase === "done");

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
          <SweepItem at={0.7}>
            <div className="flex flex-col gap-1.5">
              <span
                className={
                  isRock
                    ? "font-display text-2xl tracking-wide"
                    : "font-mono text-sm opacity-70"
                }
              >
                {isRock ? "F.LI" : "fuyuan_li.io"}
              </span>
              <ContactIcons theme={isRock ? "rock" : "geek"} />
            </div>
          </SweepItem>
          <motion.div
            animate={{
              x: toggleAway ? 220 : 0,
              opacity: toggleAway ? 0 : 1,
              scale: toggleReturning ? [1, 1.12, 1] : 1,
              boxShadow: toggleReturning
                ? "0 0 0 4px var(--geek-accent-dim)"
                : "0 0 0 0px transparent",
            }}
            transition={{
              x: { duration: toggleReturning ? 0.9 : 0.2, ease: "easeOut" },
              opacity: { duration: 0.2 },
              scale: { duration: 0.55 },
              boxShadow: { duration: 0.55 },
            }}
            className={
              toggleDetached
                ? "fixed right-5 top-6 z-[95] rounded-full sm:right-8"
                : "rounded-full"
            }
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
