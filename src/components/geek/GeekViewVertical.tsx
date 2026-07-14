import ProjectCoverFlowVertical from "./ProjectCoverFlowVertical";
import { ITEMS } from "./GeekView";

export default function GeekViewVertical() {
  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-3">
        <span className="font-mono text-xs uppercase tracking-[0.3em] opacity-50">
          fuyuan li — geek_mode (vertical test)
        </span>
        <h1 className="font-mono text-3xl sm:text-4xl leading-tight">
          Machine Learning Engineer / Quant. AI hacker.
          <br />
          builds things that see, hear, and act.
        </h1>
      </header>

      <ProjectCoverFlowVertical items={ITEMS} />
    </div>
  );
}
