"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const clips = [
  {
    id: 1,
    title: "2023 May · @ Google NYC",
    song: "《阳光下的黑暗》",
    src: "/rock/google-nyc-2024.mp4",
    poster: "/rock/posters/google-nyc-2024.jpg",
  },
  {
    id: 2,
    title: "2023 Aug · @ Brooklyn Music Kitchen",
    song: "《刺猬》（原创）",
    src: "/rock/brooklyn-music-kitchen-2023.mp4",
    poster: "/rock/posters/brooklyn-music-kitchen-2023.jpg",
  },
  {
    id: 3,
    title: "2025 Jul · @ Cutting Room NYC",
    song: "《坏蛋》＋《云宫迅音》",
    src: "/rock/cutting-room-nyc-2025.mp4",
    poster: "/rock/posters/cutting-room-nyc-2025.jpg",
  },
  {
    id: 4,
    title: "2025 Jul · @ Cutting Room NYC",
    song: "《红日》",
    src: "/rock/cutting-room-nyc-red-sun-2025.mp4",
    poster: "/rock/posters/cutting-room-nyc-red-sun-2025.jpg",
  },
  {
    id: 5,
    title: "2022 Aug · @ Funkadelic Recording Studio NYC",
    song: "《Always》（原创）",
    src: "/rock/funkadelic-nyc-2022.mp4",
    poster: "/rock/posters/funkadelic-nyc-2022.jpg",
  },
  {
    id: 6,
    title: "2024 Sep · @ Hutaoli Music Bar",
    song: "《单身旅记》",
    src: "/rock/hutaoli-music-bar-2024.mp4",
    poster: "/rock/posters/hutaoli-music-bar-2024.jpg",
  },
  {
    id: 7,
    title: "2024 Aug · @ Racket NYC",
    song: "《在时间的答案里》",
    src: "/rock/racket-nyc-2024.mp4",
    poster: "/rock/posters/racket-nyc-2024.jpg",
  },
  {
    id: 8,
    title: "2024 Aug · @ Racket NYC",
    song: "《红玫瑰》",
    src: "/rock/racket-nyc-red-rose-2024.mp4",
    poster: "/rock/posters/racket-nyc-red-rose-2024.jpg",
  },
];

export default function PerformanceReel() {
  const count = clips.length;
  const loopedClips = [...clips, ...clips, ...clips];
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const frameRef = useRef<number | null>(null);
  const wrapTimerRef = useRef<number | null>(null);
  const [centerLoopIndex, setCenterLoopIndex] = useState(count);

  const scrollToLoopIndex = useCallback(
    (loopIndex: number, behavior: ScrollBehavior = "smooth") => {
      const track = trackRef.current;
      const card = cardRefs.current.get(loopIndex);
      if (!track || !card) return;
      track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior });
    },
    [],
  );

  const getNearestLoopIndex = useCallback(() => {
    const track = trackRef.current;
    if (!track) return count;

    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    let nearestIndex = count;
    let nearestDistance = Number.POSITIVE_INFINITY;

    cardRefs.current.forEach((card, loopIndex) => {
      const cardCenter =
        card.offsetLeft - track.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(cardCenter - trackCenter);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = loopIndex;
      }
    });

    return nearestIndex;
  }, [count]);

  useEffect(() => {
    scrollToLoopIndex(count, "auto");
  }, [count, scrollToLoopIndex]);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      if (wrapTimerRef.current !== null) {
        window.clearTimeout(wrapTimerRef.current);
      }
    };
  }, []);

  const handleScroll = () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const nearestIndex = getNearestLoopIndex();
      setCenterLoopIndex(nearestIndex);

      if (wrapTimerRef.current !== null) {
        window.clearTimeout(wrapTimerRef.current);
      }
      wrapTimerRef.current = window.setTimeout(() => {
        if (nearestIndex < count) {
          const wrappedIndex = nearestIndex + count;
          scrollToLoopIndex(wrappedIndex, "auto");
          setCenterLoopIndex(wrappedIndex);
        } else if (nearestIndex >= count * 2) {
          const wrappedIndex = nearestIndex - count;
          scrollToLoopIndex(wrappedIndex, "auto");
          setCenterLoopIndex(wrappedIndex);
        }
      }, 140);
    });
  };

  const activeIndex = ((centerLoopIndex % count) + count) % count;
  const showPrevious = () => scrollToLoopIndex(centerLoopIndex - 1);
  const showNext = () => scrollToLoopIndex(centerLoopIndex + 1);

  return (
    <div
      className="flex flex-col gap-4 outline-none"
      tabIndex={0}
      aria-label="Horizontally scrollable performance gallery."
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") showPrevious();
        if (event.key === "ArrowRight") showNext();
      }}
    >
      <div className="relative mx-auto w-full max-w-[760px]">
        <div
          ref={trackRef}
          onScroll={handleScroll}
          className="scrollbar-none flex w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain"
        >
          {loopedClips.map((clip, loopIndex) => {
            const isActive = loopIndex === centerLoopIndex;

            return (
              <div
                key={loopIndex}
                ref={(element) => {
                  if (element) cardRefs.current.set(loopIndex, element);
                  else cardRefs.current.delete(loopIndex);
                }}
                className="w-full shrink-0 snap-center"
                aria-hidden={loopIndex < count || loopIndex >= count * 2}
              >
                <article
                  className="overflow-hidden rounded-2xl border"
                  style={{
                    borderColor: "var(--rock-accent)",
                    background: "var(--rock-bg-raised)",
                    boxShadow:
                      "0 34px 70px -30px rgba(255, 91, 60, 0.68)",
                  }}
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-black">
                    {isActive ? (
                      <video
                        key={clip.src}
                        className="h-full w-full object-cover"
                        src={clip.src}
                        poster={clip.poster}
                        aria-label={`${clip.title} ${clip.song}`}
                        autoPlay
                        controls
                        loop
                        muted
                        playsInline
                        preload="metadata"
                      />
                    ) : (
                      <Image
                        src={clip.poster}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, 760px"
                        className="object-cover"
                      />
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/15 via-transparent to-white/10" />
                  </div>

                  <div className="flex min-h-[76px] flex-wrap items-center justify-between gap-x-5 gap-y-1 px-5 py-3 sm:px-6">
                    <h4 className="font-display text-xl tracking-wide sm:text-2xl">
                      {clip.title}
                    </h4>
                    <p className="text-xs opacity-65 sm:text-sm">
                      {clip.song}
                    </p>
                  </div>
                </article>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          aria-label="Previous performance"
          onClick={showPrevious}
          className="absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border bg-black/70 text-2xl text-white shadow-xl backdrop-blur-sm transition-transform hover:scale-105 sm:left-4"
          style={{ borderColor: "var(--rock-line)" }}
        >
          ←
        </button>
        <button
          type="button"
          aria-label="Next performance"
          onClick={showNext}
          className="absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border bg-black/70 text-2xl text-white shadow-xl backdrop-blur-sm transition-transform hover:scale-105 sm:right-4"
          style={{ borderColor: "var(--rock-line)" }}
        >
          →
        </button>
      </div>

      <div className="flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.18em]">
        <span className="opacity-45">
          {String(activeIndex + 1).padStart(2, "0")} / {String(clips.length).padStart(2, "0")}
          <span className="ml-3 hidden sm:inline">← scroll →</span>
        </span>
        <span className="opacity-45">one stage at a time</span>
      </div>

      <div className="flex justify-center gap-1.5">
        {clips.map((clip, index) => (
          <button
            key={clip.id}
            type="button"
            aria-label={`Go to ${clip.song}`}
            onClick={() => scrollToLoopIndex(count + index)}
            className="h-1.5 w-6 rounded-full transition-colors"
            style={{
              background:
                activeIndex === index
                  ? "var(--rock-accent)"
                  : "var(--rock-line)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
