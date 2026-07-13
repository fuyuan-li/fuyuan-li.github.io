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
        tagline="Built this so the band could pick a setlist without a 40-message group chat. Swipe right to add a song."
        theme="rock"
      >
        <StageV1SwipeDemo />
      </ProjectCard>
    </div>
  );
}
