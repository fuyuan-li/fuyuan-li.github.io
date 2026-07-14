import ProjectCard from "@/components/shared/ProjectCard";
import PerformanceReel from "./PerformanceReel";
import StageV1SwipeDemo from "./StageV1SwipeDemo";

export default function RockView() {
  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-3">
        <span className="font-mono text-xs uppercase tracking-[0.3em] opacity-60">
          fuyuan li — rockstar_mode
        </span>
        <h1 className="font-display text-4xl sm:text-6xl leading-none tracking-wide">
          drummer off the clock.
        </h1>
        <p className="max-w-xl text-sm opacity-80">
          same person, different room. still building tools — just for the
          band this time.
        </p>
      </header>

      <ProjectCard eyebrow="live" title="on stage" tagline="a few seconds from a few shows." theme="rock">
        <PerformanceReel />
      </ProjectCard>

      <ProjectCard
        eyebrow="stagev1"
        title="setlist, swiped"
        tagline="I mostly hit drums. Occasionally, I hit a keyboard too — the computer kind. Usually when the band needs something. StageV1 turns rehearsal song-picking from a 40-message group chat into a Tinder-ish swipe: pass, waitlist, or join. Everyone gets a vote; the group chat gets the night off."
        actions={
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em]">
            <span
              className="rounded-full px-2.5 py-1"
              style={{
                background: "var(--rock-accent)",
                color: "var(--rock-bg)",
              }}
            >
              demo
            </span>
            <a
              href="https://github.com/fuyuan-li/stagev1"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border px-2.5 py-1 opacity-70 transition-opacity hover:opacity-100"
              style={{ borderColor: "var(--rock-line)" }}
            >
              GitHub ↗
            </a>
          </div>
        }
        theme="rock"
      >
        <StageV1SwipeDemo />
      </ProjectCard>
    </div>
  );
}
