"use client";

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
    title: "July 2025 · @ Cutting Room NYC",
    song: "《坏蛋》＋《云宫迅音》",
    src: "/rock/cutting-room-nyc-2025.mp4",
    poster: "/rock/posters/cutting-room-nyc-2025.jpg",
  },
  {
    id: 4,
    title: "July 2025 · @ Cutting Room NYC",
    song: "《红日》",
    src: "/rock/cutting-room-nyc-red-sun-2025.mp4",
    poster: "/rock/posters/cutting-room-nyc-red-sun-2025.jpg",
  },
  {
    id: 5,
    title: "Aug 2022 · @ Funkadelic Recording Studio NYC",
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

const LOOPED_CLIPS = [...clips, ...clips, ...clips];
const CARD_GAP = 24;

export default function PerformanceReel() {
  const count = clips.length;
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const frameRef = useRef<number | null>(null);
  const [centerLoopIndex, setCenterLoopIndex] = useState(count);

  const getCardLeft = useCallback(
    (track: HTMLDivElement, card: HTMLDivElement) =>
      card.offsetLeft -
      track.offsetLeft -
      (track.clientWidth - card.offsetWidth) / 2,
    [],
  );

  const positionAtLoopIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const track = trackRef.current;
      const card = cardRefs.current.get(index);
      if (!track || !card) return;
      track.scrollTo({ left: getCardLeft(track, card), behavior });
    },
    [getCardLeft],
  );

  const getNearestLoopIndex = useCallback(() => {
    const track = trackRef.current;
    if (!track) return count;

    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    let nearestIndex = count;
    let nearestDistance = Number.POSITIVE_INFINITY;

    cardRefs.current.forEach((card, index) => {
      const cardCenter =
        card.offsetLeft - track.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(cardCenter - trackCenter);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    return nearestIndex;
  }, [count]);

  const applyTransforms = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    const nearestIndex = getNearestLoopIndex();

    cardRefs.current.forEach((card) => {
      const cardCenter =
        card.offsetLeft - track.offsetLeft + card.offsetWidth / 2;
      const offset =
        (cardCenter - trackCenter) / (card.offsetWidth + CARD_GAP);
      const distance = Math.abs(offset);
      const scale = Math.max(0.58, 1 - distance * 0.2);
      const rotateY = Math.max(-48, Math.min(48, offset * -34));
      const opacity = Math.max(0.22, 1 - distance * 0.32);
      const pullTowardCenter = Math.max(
        -240,
        Math.min(240, offset * -150),
      );

      card.style.transform = `translateX(${pullTowardCenter}px) scale(${scale}) rotateY(${rotateY}deg)`;
      card.style.opacity = String(opacity);
      card.style.zIndex = String(Math.max(1, Math.round(20 - distance * 4)));
    });

    setCenterLoopIndex((current) =>
      current === nearestIndex ? current : nearestIndex,
    );
  }, [getNearestLoopIndex]);

  useEffect(() => {
    positionAtLoopIndex(count, "auto");
    applyTransforms();
    const settleTimer = window.setTimeout(() => {
      positionAtLoopIndex(count, "auto");
      applyTransforms();
    }, 80);

    return () => window.clearTimeout(settleTimer);
  }, [applyTransforms, count, positionAtLoopIndex]);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const handleScroll = () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      let nearestIndex = getNearestLoopIndex();

      if (nearestIndex < count) {
        nearestIndex += count;
        positionAtLoopIndex(nearestIndex, "auto");
      } else if (nearestIndex >= count * 2) {
        nearestIndex -= count;
        positionAtLoopIndex(nearestIndex, "auto");
      }

      applyTransforms();
    });
  };

  const activeIndex =
    ((centerLoopIndex % count) + count) % count;

  return (
    <div className="flex flex-col gap-4">
      <div style={{ perspective: "1600px" }}>
        <div
          ref={trackRef}
          onScroll={handleScroll}
          className="scrollbar-none flex h-[250px] items-center gap-6 overflow-x-auto overflow-y-hidden sm:h-[350px]"
          style={{
            scrollSnapType: "x mandatory",
            paddingInline: "calc(50% - min(64vw, 420px) / 2)",
          }}
        >
          {LOOPED_CLIPS.map((clip, loopIndex) => {
            const isCenter = loopIndex === centerLoopIndex;

            return (
              <div
                key={loopIndex}
                ref={(element) => {
                  if (element) cardRefs.current.set(loopIndex, element);
                  else cardRefs.current.delete(loopIndex);
                }}
                tabIndex={0}
                aria-label={`${clip.title} ${clip.song}`}
                aria-current={isCenter ? "true" : undefined}
                onClick={() => {
                  if (!isCenter) positionAtLoopIndex(loopIndex);
                }}
                onKeyDown={(event) => {
                  if ((event.key === "Enter" || event.key === " ") && !isCenter) {
                    event.preventDefault();
                    positionAtLoopIndex(loopIndex);
                  }
                }}
                className="relative w-[64vw] max-w-[420px] shrink-0 cursor-pointer overflow-hidden rounded-2xl border outline-none focus-visible:ring-2 focus-visible:ring-[var(--rock-accent)]"
                style={{
                  scrollSnapAlign: "center",
                  borderColor: isCenter
                    ? "var(--rock-accent)"
                    : "var(--rock-line)",
                  background: "var(--rock-bg-raised)",
                  color: "var(--rock-fg)",
                  transformStyle: "preserve-3d",
                  willChange: "transform, opacity",
                  boxShadow: isCenter
                    ? "0 34px 70px -26px rgba(255, 91, 60, 0.72)"
                    : "0 22px 42px -26px rgba(0, 0, 0, 0.9)",
                }}
              >
                <div className="relative aspect-video w-full overflow-hidden bg-black">
                  {isCenter ? (
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
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      className="h-full w-full object-cover"
                      src={clip.poster}
                      alt=""
                      loading="lazy"
                    />
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10" />
                </div>

                <div className="flex min-h-[68px] flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-3 sm:px-5">
                  <h4 className="font-display text-lg tracking-wide sm:text-2xl">
                    {clip.title}
                  </h4>
                  <p className="text-xs opacity-65 sm:text-sm">{clip.song}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.18em]">
        <span className="opacity-45">
          {String(activeIndex + 1).padStart(2, "0")} / {String(clips.length).padStart(2, "0")}
          <span className="ml-3 hidden sm:inline">cover flow · swipe sideways</span>
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous performance"
            onClick={() => positionAtLoopIndex(centerLoopIndex - 1)}
            className="flex h-8 w-10 items-center justify-center rounded-full border text-sm"
            style={{ borderColor: "var(--rock-line)" }}
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Next performance"
            onClick={() => positionAtLoopIndex(centerLoopIndex + 1)}
            className="flex h-8 w-10 items-center justify-center rounded-full border text-sm"
            style={{ borderColor: "var(--rock-line)" }}
          >
            →
          </button>
        </div>
      </div>

      <div className="flex justify-center gap-1.5">
        {clips.map((clip, index) => (
          <button
            key={clip.id}
            type="button"
            aria-label={`Go to ${clip.song}`}
            onClick={() => positionAtLoopIndex(count + index)}
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
