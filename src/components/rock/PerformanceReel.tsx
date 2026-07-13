"use client";

const clips = [
  {
    id: 1,
    title: "2023 May · @ Google NYC",
    song: "《阳光下的黑暗》",
    src: "/rock/google-nyc-2024.mp4",
  },
  {
    id: 2,
    title: "2023 Aug · @ Brooklyn Music Kitchen",
    song: "《刺猬》（原创）",
    src: "/rock/brooklyn-music-kitchen-2023.mp4",
  },
  {
    id: 3,
    title: "July 2025 · @ Cutting Room NYC",
    song: "《坏蛋》＋《云宫迅音》",
    src: "/rock/cutting-room-nyc-2025.mp4",
  },
  {
    id: 4,
    title: "July 2025 · @ Cutting Room NYC",
    song: "《红日》",
    src: "/rock/cutting-room-nyc-red-sun-2025.mp4",
  },
  {
    id: 5,
    title: "Aug 2022 · @ Funkadelic Recording Studio NYC",
    song: "《Always》（原创）",
    src: "/rock/funkadelic-nyc-2022.mp4",
  },
  {
    id: 6,
    title: "2024 Sep · @ Hutaoli Music Bar",
    song: "《单身旅记》",
    src: "/rock/hutaoli-music-bar-2024.mp4",
  },
  {
    id: 7,
    title: "2024 Aug · @ Racket NYC",
    song: "《在时间的答案里》",
    src: "/rock/racket-nyc-2024.mp4",
  },
  {
    id: 8,
    title: "2024 Aug · @ Racket NYC",
    song: "《红玫瑰》",
    src: "/rock/racket-nyc-red-rose-2024.mp4",
  },
];

export default function PerformanceReel() {
  return (
    <div className="flex flex-col gap-3">
      <div
        className="flex max-h-[72vh] flex-col gap-5 overflow-y-auto pr-1"
        style={{ scrollSnapType: "y mandatory" }}
      >
        {clips.map((clip) => (
          <article
            key={clip.id}
            className="w-full shrink-0 overflow-hidden rounded-xl border"
            style={{
              borderColor: "var(--rock-line)",
              background: "var(--rock-bg-raised)",
              color: "var(--rock-fg)",
              scrollSnapAlign: "start",
            }}
          >
            {clip.src ? (
              <video
                className="aspect-video w-full bg-black object-contain"
                src={clip.src}
                aria-label={`${clip.title} ${clip.song}`}
                autoPlay
                controls
                loop
                muted
                playsInline
                preload="metadata"
              />
            ) : (
              <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 font-mono text-xs">
                <span className="opacity-50">▶</span>
                <span className="opacity-60">{clip.title}</span>
                <span className="opacity-30">~15s</span>
              </div>
            )}

            {clip.song && (
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 py-3 sm:px-5">
                <h4 className="font-display text-xl tracking-wide sm:text-2xl">
                  {clip.title}
                </h4>
                <p className="text-sm opacity-65">{clip.song}</p>
              </div>
            )}
          </article>
        ))}
      </div>
      <p className="font-mono text-[10px] opacity-40">
        footage coming soon — drums, live.
      </p>
    </div>
  );
}
