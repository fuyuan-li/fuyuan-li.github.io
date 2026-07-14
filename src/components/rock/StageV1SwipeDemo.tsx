"use client";

import Image from "next/image";
import { useState } from "react";
import {
  animate,
  motion,
  PanInfo,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { STAGE_SONGS } from "./stageV1Songs";

type Direction = "left" | "up" | "right";

const OUTCOMES: Record<Direction, { label: string; color: string }> = {
  left: { label: "Not Interest", color: "#f44336" },
  up: { label: "JOIN!", color: "#4caf50" },
  right: { label: "Add Waitlist", color: "#2196f3" },
};

const FLY_OUT: Record<
  Direction,
  { x: number; y: number; rotate: number }
> = {
  left: { x: -520, y: 24, rotate: -22 },
  right: { x: 520, y: 24, rotate: 22 },
  up: { x: 0, y: -480, rotate: 0 },
};

function ResultGroup({
  label,
  items,
  color,
  empty,
}: {
  label: string;
  items: string[];
  color: string;
  empty?: string;
}) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-widest opacity-50">
        {label}
      </p>
      <div className="mt-1.5 flex min-h-8 flex-wrap gap-1.5">
        {items.length === 0 && empty ? (
          <span className="text-xs opacity-35">{empty}</span>
        ) : null}
        {items.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="rounded-full px-2.5 py-1 text-xs text-white"
            style={{ background: color }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function StageV1SwipeDemo() {
  const [index, setIndex] = useState(0);
  const [setlist, setSetlist] = useState<string[]>([]);
  const [waitlist, setWaitlist] = useState<string[]>([]);
  const [passed, setPassed] = useState<string[]>([]);
  const [exitDir, setExitDir] = useState<Direction | null>(null);

  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const dragRotate = useTransform(dragX, [-180, 0, 180], [-16, 0, 16]);
  const passOpacity = useTransform(dragX, [-180, -65, 0], [1, 0.3, 0]);
  const waitOpacity = useTransform(dragX, [0, 65, 180], [0, 0.3, 1]);
  const joinOpacity = useTransform(dragY, [-180, -65, 0], [1, 0.3, 0]);

  const isComplete = index >= STAGE_SONGS.length;
  const song = STAGE_SONGS[index];
  const nextSong = STAGE_SONGS[index + 1];

  const decide = (direction: Direction) => {
    if (exitDir || !song) return;

    setExitDir(direction);
    if (direction === "up") {
      setSetlist((current) => [...current, song.title]);
    } else if (direction === "right") {
      setWaitlist((current) => [...current, song.title]);
    } else {
      setPassed((current) => [...current, song.title]);
    }
  };

  const resetDrag = () => {
    dragX.set(0);
    dragY.set(0);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const { x, y } = info.offset;
    if (Math.abs(y) > Math.abs(x) && y < -70) {
      decide("up");
    } else if (x > 90) {
      decide("right");
    } else if (x < -90) {
      decide("left");
    } else {
      animate(dragX, 0, { type: "spring", stiffness: 420, damping: 30 });
      animate(dragY, 0, { type: "spring", stiffness: 420, damping: 30 });
    }
  };

  const finishDecision = () => {
    if (!exitDir) return;
    resetDrag();
    setIndex((current) => current + 1);
    setExitDir(null);
  };

  const resetDeck = () => {
    resetDrag();
    setIndex(0);
    setSetlist([]);
    setWaitlist([]);
    setPassed([]);
    setExitDir(null);
  };

  const activeMotion = exitDir
    ? { ...FLY_OUT[exitDir], opacity: 0, scale: 0.92 }
    : { x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 };

  return (
    <div className="flex flex-col items-center gap-6">
      {isComplete ? (
        <div
          className="flex min-h-[430px] w-full max-w-[340px] flex-col items-center justify-center rounded-3xl border p-8 text-center"
          style={{ borderColor: "var(--rock-line)" }}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] opacity-45">
            deck cleared
          </span>
          <h4 className="mt-4 font-display text-5xl leading-none tracking-wide">
            {STAGE_SONGS.length} songs.
            <br />
            zero repeats.
          </h4>
          <p className="mt-5 max-w-xs text-sm leading-relaxed opacity-60">
            Everybody voted. Somehow, the group chat survived without 40 new
            messages.
          </p>
          <button
            type="button"
            onClick={resetDeck}
            className="mt-8 rounded-full px-5 py-2.5 font-mono text-xs uppercase tracking-[0.18em] text-black transition-transform hover:scale-105"
            style={{ background: "var(--rock-accent)" }}
          >
            reset deck ↻
          </button>
        </div>
      ) : (
        <>
          <div className="relative h-[450px] w-full max-w-[340px]">
            {nextSong ? (
              <div
                aria-hidden
                className="absolute inset-x-4 bottom-0 top-5 overflow-hidden rounded-3xl border opacity-45"
                style={{
                  borderColor: "var(--rock-line)",
                  transform: "scale(.94) translateY(12px)",
                }}
              >
                <Image
                  src={nextSong.cover}
                  alt=""
                  fill
                  sizes="320px"
                  className="object-cover"
                />
              </div>
            ) : null}

            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={activeMotion}
              transition={
                exitDir
                  ? { duration: 0.34, ease: [0.22, 1, 0.36, 1] }
                  : { type: "spring", stiffness: 320, damping: 26 }
              }
              onAnimationComplete={finishDecision}
              className="absolute inset-0"
            >
              <motion.div
                drag={exitDir ? false : true}
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.9}
                onDragEnd={handleDragEnd}
                style={{ x: dragX, y: dragY, rotate: dragRotate }}
                className="relative h-full cursor-grab overflow-hidden rounded-3xl border bg-[#111214] shadow-2xl active:cursor-grabbing"
              >
                <div className="relative h-[68%] overflow-hidden">
                  <Image
                    src={song.cover}
                    alt={`${song.album} album cover`}
                    fill
                    priority={index === 0}
                    sizes="340px"
                    className="pointer-events-none select-none object-cover"
                    draggable={false}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/35" />
                  <span className="absolute left-5 top-5 rounded-full border border-white/30 bg-black/35 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                    {String(index + 1).padStart(2, "0")} / {STAGE_SONGS.length}
                  </span>

                  <motion.span
                    style={{ opacity: passOpacity, color: OUTCOMES.left.color }}
                    className="absolute left-5 top-16 -rotate-12 rounded-md border-4 border-current bg-black/30 px-3 py-1 font-display text-4xl tracking-wider"
                  >
                    PASS
                  </motion.span>
                  <motion.span
                    style={{ opacity: waitOpacity, color: OUTCOMES.right.color }}
                    className="absolute right-4 top-16 rotate-12 rounded-md border-4 border-current bg-black/30 px-3 py-1 font-display text-3xl tracking-wider"
                  >
                    WAITLIST
                  </motion.span>
                  <motion.span
                    style={{ opacity: joinOpacity, color: OUTCOMES.up.color }}
                    className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-md border-4 border-current bg-black/30 px-4 py-1 font-display text-4xl tracking-wider"
                  >
                    JOIN!
                  </motion.span>
                </div>

                <div className="flex h-[32%] flex-col justify-between p-5">
                  <div>
                    <h4 className="font-display text-[clamp(1.85rem,8vw,2.25rem)] leading-none tracking-wide">
                      {song.title}
                    </h4>
                    <p className="mt-2 text-sm opacity-70">{song.artist}</p>
                    <p className="mt-1 truncate font-mono text-[9px] uppercase tracking-[0.14em] opacity-35">
                      {song.album}
                    </p>
                  </div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] opacity-35">
                    drag left · up · right
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>

          <div className="grid w-full max-w-[360px] grid-cols-3 gap-3">
        <button
          type="button"
          disabled={Boolean(exitDir)}
          onClick={() => decide("left")}
          className="group flex flex-col items-center gap-2 disabled:opacity-40"
        >
          <span
            className="flex h-14 w-14 items-center justify-center rounded-full border-2 text-3xl transition-transform group-hover:scale-105"
            style={{
              borderColor: OUTCOMES.left.color,
              color: OUTCOMES.left.color,
            }}
          >
            ×
          </span>
          <span className="font-mono text-[9px] uppercase tracking-wider opacity-60">
            Not Interest
          </span>
        </button>
        <button
          type="button"
          disabled={Boolean(exitDir)}
          onClick={() => decide("up")}
          className="group flex flex-col items-center gap-2 disabled:opacity-40"
        >
          <span
            className="flex h-16 w-16 items-center justify-center rounded-full text-3xl text-white shadow-lg transition-transform group-hover:scale-105"
            style={{ background: OUTCOMES.up.color }}
          >
            ↑
          </span>
          <span className="font-mono text-[9px] uppercase tracking-wider opacity-60">
            JOIN!
          </span>
        </button>
        <button
          type="button"
          disabled={Boolean(exitDir)}
          onClick={() => decide("right")}
          className="group flex flex-col items-center gap-2 disabled:opacity-40"
        >
          <span
            className="flex h-14 w-14 items-center justify-center rounded-full border-2 text-3xl transition-transform group-hover:scale-105"
            style={{
              borderColor: OUTCOMES.right.color,
              color: OUTCOMES.right.color,
            }}
          >
            +
          </span>
          <span className="font-mono text-[9px] uppercase tracking-wider opacity-60">
            Add Waitlist
          </span>
        </button>
          </div>
        </>
      )}

      <div
        aria-live="polite"
        className="grid w-full gap-4 rounded-2xl border p-4 sm:grid-cols-3"
        style={{ borderColor: "var(--rock-line)" }}
      >
        <ResultGroup
          label="tonight's setlist"
          items={setlist}
          color={OUTCOMES.up.color}
          empty="swipe up to JOIN"
        />
        <ResultGroup
          label="waitlist"
          items={waitlist}
          color={OUTCOMES.right.color}
          empty="swipe right to save"
        />
        <ResultGroup
          label="passed"
          items={passed}
          color={OUTCOMES.left.color}
          empty="swipe left to pass"
        />
      </div>
    </div>
  );
}
