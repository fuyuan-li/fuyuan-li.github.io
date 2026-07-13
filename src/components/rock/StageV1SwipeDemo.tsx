"use client";

import { useState } from "react";
import { AnimatePresence, motion, PanInfo } from "framer-motion";

const SONGS = [
  { title: "Everlong", artist: "Foo Fighters" },
  { title: "Chop Suey!", artist: "System of a Down" },
  { title: "Sultans of Swing", artist: "Dire Straits" },
  { title: "Du Hast", artist: "Rammstein" },
  { title: "No One Knows", artist: "Queens of the Stone Age" },
];

// the real stagev1 gesture — react-tinder-card, 3-way: left/up/right
type Direction = "left" | "up" | "right";

const OUTCOMES: Record<
  Direction,
  { label: string; color: string; addsToSetlist: boolean }
> = {
  left: { label: "Not Interest", color: "#f44336", addsToSetlist: false },
  up: { label: "JOIN!", color: "#4caf50", addsToSetlist: true },
  right: { label: "Add Waitlist", color: "#2196f3", addsToSetlist: false },
};

export default function StageV1SwipeDemo() {
  const [index, setIndex] = useState(0);
  const [setlist, setSetlist] = useState<string[]>([]);
  const [waitlist, setWaitlist] = useState<string[]>([]);
  const [exitDir, setExitDir] = useState<Direction | null>(null);

  const song = SONGS[index % SONGS.length];

  const decide = (dir: Direction) => {
    setExitDir(dir);
    const outcome = OUTCOMES[dir];
    if (outcome.addsToSetlist) {
      setSetlist((s) => [...s, song.title]);
    } else if (dir === "right") {
      setWaitlist((s) => [...s, song.title]);
    }
    window.setTimeout(() => {
      setIndex((i) => i + 1);
      setExitDir(null);
    }, 220);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const { x, y } = info.offset;
    if (Math.abs(y) > Math.abs(x) && y < -70) {
      decide("up");
    } else if (x > 90) {
      decide("right");
    } else if (x < -90) {
      decide("left");
    }
  };

  const exitTransform: Record<Direction, { x: number; y: number; rotate: number }> = {
    left: { x: -260, y: 0, rotate: -18 },
    right: { x: 260, y: 0, rotate: 18 },
    up: { x: 0, y: -260, rotate: 0 },
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-48 w-56">
        <AnimatePresence>
          <motion.div
            key={index}
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            onDragEnd={handleDragEnd}
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, x: 0, y: 0, rotate: 0 }}
            exit={{
              x: exitDir ? exitTransform[exitDir].x : 0,
              y: exitDir ? exitTransform[exitDir].y : 0,
              rotate: exitDir ? exitTransform[exitDir].rotate : 0,
              opacity: 0,
            }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 flex cursor-grab flex-col items-center justify-center gap-2 rounded-xl border p-4 text-center active:cursor-grabbing"
            style={{
              borderColor: "var(--rock-line)",
              background: "var(--rock-bg-raised)",
              color: "var(--rock-fg)",
            }}
          >
            <span className="font-display text-3xl tracking-wide">
              {song.title}
            </span>
            <span className="text-sm opacity-70">{song.artist}</span>
            <span className="mt-2 text-[10px] font-mono opacity-40">
              drag left / up / right
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => decide("left")}
          className="rounded-full border px-3 py-1.5 text-[11px] font-semibold"
          style={{ borderColor: OUTCOMES.left.color, color: OUTCOMES.left.color }}
        >
          ← Not Interest
        </button>
        <button
          onClick={() => decide("up")}
          className="rounded-full px-3 py-1.5 text-[11px] font-semibold text-white"
          style={{ background: OUTCOMES.up.color }}
        >
          ↑ JOIN!
        </button>
        <button
          onClick={() => decide("right")}
          className="rounded-full border px-3 py-1.5 text-[11px] font-semibold"
          style={{ borderColor: OUTCOMES.right.color, color: OUTCOMES.right.color }}
        >
          Add Waitlist →
        </button>
      </div>

      <div className="w-full max-w-xs">
        <p className="font-mono text-[10px] uppercase tracking-widest opacity-50">
          tonight&apos;s setlist
        </p>
        <div className="mt-1 flex min-h-8 flex-wrap gap-1.5">
          {setlist.length === 0 && (
            <span className="text-xs opacity-40">swipe up to JOIN a song into the set</span>
          )}
          {setlist.map((s, i) => (
            <span
              key={s + i}
              className="rounded-full px-2.5 py-1 text-xs"
              style={{ background: "#4caf50", color: "#fff" }}
            >
              {s}
            </span>
          ))}
        </div>
        {waitlist.length > 0 && (
          <>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-widest opacity-50">
              waitlist
            </p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {waitlist.map((s, i) => (
                <span
                  key={s + i}
                  className="rounded-full px-2.5 py-1 text-xs"
                  style={{ background: "#2196f3", color: "#fff" }}
                >
                  {s}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
