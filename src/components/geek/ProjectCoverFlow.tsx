"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ProjectCard from "@/components/shared/ProjectCard";
import SketchIcon, { SketchKind } from "@/components/shared/SketchIcon";

export interface CoverItem {
  id: string;
  icon: string;
  sketch: SketchKind;
  eyebrow: string;
  title: string;
  tagline: ReactNode;
  highlights: ReactNode[];
  accent: string;
  demo: ReactNode;
}

const CARD_WIDTH = 240;
const GAP = 24;
const STEP = CARD_WIDTH + GAP;

export default function ProjectCoverFlow({ items }: { items: CoverItem[] }) {
  const n = items.length;
  // triple the list so scrolling past either edge still shows real cards —
  // the middle copy (index n..2n-1) is the "true" set we silently recenter into
  const loop = [...items, ...items, ...items];

  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<number, HTMLButtonElement>>(new Map());
  const labelRefs = useRef<Map<number, HTMLSpanElement>>(new Map());
  const rafRef = useRef<number | null>(null);
  const [centerIndex, setCenterIndex] = useState(0); // real index 0..n-1, for the dots
  const [openId, setOpenId] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const openItem = items.find((i) => i.id === openId) ?? null;

  const applyTransforms = () => {
    const el = trackRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const nearestLi = Math.round(scrollLeft / STEP);

    cardRefs.current.forEach((card, li) => {
      const offset = (li * STEP - scrollLeft) / STEP;
      const abs = Math.abs(offset);
      const isCenter = li === nearestLi;
      const scale = Math.max(0.55, 1 - abs * 0.19);
      const rotateY = Math.max(-42, Math.min(42, offset * -30));
      const opacity = Math.max(0.15, 1 - abs * 0.4);
      card.style.transform = `scale(${scale}) rotateY(${rotateY}deg)`;
      card.style.opacity = String(isCenter ? 1 : opacity);
      card.style.zIndex = String(Math.round(10 - abs));

      const label = labelRefs.current.get(li);
      if (label) label.style.opacity = isCenter ? "1" : "0";
    });

    const realIndex = (((nearestLi % n) + n) % n);
    setCenterIndex((prev) => (prev === realIndex ? prev : realIndex));
  };

  // start centered in the middle copy
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollLeft = n * STEP;
    applyTransforms();
    // fonts / layout can settle a frame later — reapply once more
    const t = window.setTimeout(() => {
      el.scrollLeft = n * STEP;
      applyTransforms();
    }, 50);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);

  useEffect(() => {
    if (!openItem) return;
    const t = window.setTimeout(() => {
      panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 380);
    return () => window.clearTimeout(t);
  }, [openItem]);

  const wrapTimerRef = useRef<number | null>(null);
  // true while we're driving the scroll ourselves (dot/card click) — a free
  // drag by the user should close whatever demo panel is open, since we
  // don't know where they're headed until the gesture ends
  const programmaticScrollRef = useRef(false);
  const programmaticReleaseTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (wrapTimerRef.current) window.clearTimeout(wrapTimerRef.current);
      if (programmaticReleaseTimerRef.current) {
        window.clearTimeout(programmaticReleaseTimerRef.current);
      }
    };
  }, []);

  const handleScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    // update the visuals every frame — cheap, and never jumps scrollLeft,
    // so it can't fight a fast native scroll
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(applyTransforms);

    if (!programmaticScrollRef.current) {
      setOpenId((o) => (o ? null : o));
    }

    // only correct the loop-wrap once scrolling has actually settled —
    // doing it mid-flick (fast trackpad flings) fought the browser's own
    // momentum/snap and caused visible flicker
    if (wrapTimerRef.current) window.clearTimeout(wrapTimerRef.current);
    wrapTimerRef.current = window.setTimeout(() => {
      const cur = trackRef.current;
      if (!cur) return;
      let wrapped = false;
      if (cur.scrollLeft < n * STEP * 0.5) {
        cur.scrollLeft += n * STEP;
        wrapped = true;
      } else if (cur.scrollLeft > n * STEP * 1.5) {
        cur.scrollLeft -= n * STEP;
        wrapped = true;
      }
      applyTransforms();

      // A loop correction emits one more scroll event. Keep the guard alive
      // for that event, then release it after the corrected position settles.
      if (programmaticScrollRef.current && !wrapped) {
        programmaticScrollRef.current = false;
        if (programmaticReleaseTimerRef.current) {
          window.clearTimeout(programmaticReleaseTimerRef.current);
          programmaticReleaseTimerRef.current = null;
        }
      }
    }, 120);
  };

  const scrollToLoopIndex = (loopIndex: number) => {
    const track = trackRef.current;
    if (!track) return;

    programmaticScrollRef.current = true;
    if (programmaticReleaseTimerRef.current) {
      window.clearTimeout(programmaticReleaseTimerRef.current);
    }
    // Fallback for clicking the already-centered dot, which produces no
    // scroll event and therefore has no natural "settled" callback.
    programmaticReleaseTimerRef.current = window.setTimeout(() => {
      programmaticScrollRef.current = false;
      programmaticReleaseTimerRef.current = null;
    }, 1200);
    track.scrollTo({ left: loopIndex * STEP, behavior: "smooth" });
  };

  const currentNearestLi = () => {
    const el = trackRef.current;
    if (!el) return n;
    return Math.round(el.scrollLeft / STEP);
  };

  return (
    <div className="flex flex-col gap-8">
      <div style={{ perspective: "1600px" }}>
        <div
          ref={trackRef}
          onScroll={handleScroll}
          className="scrollbar-none flex h-96 items-center overflow-x-auto overflow-y-hidden"
          style={{
            scrollSnapType: "x mandatory",
            paddingInline: `calc(50% - ${CARD_WIDTH / 2}px)`,
            gap: `${GAP}px`,
          }}
        >
          {loop.map((item, li) => (
            <motion.button
              key={li}
              ref={(el) => {
                if (el) cardRefs.current.set(li, el);
                else cardRefs.current.delete(li);
              }}
              type="button"
              onClick={() => {
                const nearest = currentNearestLi();
                if (li === nearest) {
                  setOpenId((o) => (o === item.id ? null : item.id));
                } else {
                  scrollToLoopIndex(li);
                  setOpenId((o) => (o ? item.id : o));
                }
              }}
              className="relative flex h-80 w-60 shrink-0 flex-col items-center justify-center gap-3 overflow-hidden rounded-3xl border text-center"
              style={{
                scrollSnapAlign: "center",
                borderColor: "var(--geek-line)",
                background: `linear-gradient(160deg, ${item.accent}22, var(--geek-bg-raised))`,
                borderTop: `5px solid ${item.accent}`,
                transformStyle: "preserve-3d",
                cursor: "pointer",
                boxShadow: `0 40px 70px -25px ${item.accent}66, 0 18px 30px -12px rgba(0,0,0,0.22)`,
              }}
            >
              {/* glossy sheen */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.08) 35%, transparent 60%)",
                  mixBlendMode: "overlay",
                }}
              />
              <div
                className="pointer-events-none absolute -top-10 -left-10 h-32 w-32 rounded-full blur-2xl"
                style={{ background: `${item.accent}55` }}
              />

              <SketchIcon
                kind={item.sketch}
                color={item.accent}
                className="relative h-16 w-16 drop-shadow-sm"
              />
              <span className="relative font-mono text-[11px] uppercase tracking-wide opacity-50 px-4">
                {item.eyebrow}
              </span>
              <span className="relative font-mono text-xl font-semibold px-3">
                {item.title}
              </span>
              <span
                ref={(el) => {
                  if (el) labelRefs.current.set(li, el);
                  else labelRefs.current.delete(li);
                }}
                className="relative mt-1 font-mono text-xs transition-opacity"
                style={{ color: item.accent, opacity: 0 }}
              >
                {openId === item.id ? "close ▲" : "tap to open ▾"}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 font-mono text-xs opacity-40">
        <span>← scroll →</span>
      </div>

      <div className="flex justify-center gap-1.5">
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            aria-label={`go to ${item.title}`}
            onClick={() => {
              scrollToLoopIndex(n + i);
              // if a demo panel is already open, keep it in sync with the dots
              // instead of leaving it stuck on whatever was open before
              setOpenId((prev) => (prev ? item.id : prev));
            }}
            className="h-1.5 w-6 rounded-full transition-colors"
            style={{
              background: centerIndex === i ? item.accent : "var(--geek-line)",
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {openItem && (
          <motion.div
            ref={panelRef}
            key={openItem.id}
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: -90, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{ transformOrigin: "top center", perspective: "1000px", scrollMarginTop: "24px" }}
          >
            <ProjectCard
              icon={openItem.icon}
              eyebrow={openItem.eyebrow}
              title={openItem.title}
              tagline={openItem.tagline}
              highlights={openItem.highlights}
              theme="geek"
              accent={openItem.accent}
            >
              {openItem.demo}
            </ProjectCard>
            <button
              type="button"
              onClick={() => {
                setOpenId(null);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="mx-auto mt-4 flex items-center gap-1.5 font-mono text-xs opacity-50 hover:opacity-100"
            >
              ↑ back to the top
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
