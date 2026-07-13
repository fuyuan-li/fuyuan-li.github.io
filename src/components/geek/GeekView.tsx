import ProjectCoverFlow, { CoverItem } from "./ProjectCoverFlow";
import PaperBookDemo from "./PaperBookDemo";
import WandDemo from "./WandDemo";
import SeenItDemo from "./SeenItDemo";
import DispatchEasterEgg from "./DispatchEasterEgg";
import SweepItem from "@/components/shared/SweepItem";
import { PROJECT_COLORS } from "@/lib/project-colors";

const ITEMS: CoverItem[] = [
  {
    id: "paperbook",
    icon: "🎬",
    eyebrow: "multimodal AI scientific explainer",
    title: "The PaperBook",
    tagline:
      "Research, a video story for everyone. Upload a paper — it's understood first, then reframed into a ~90s explainer anyone can follow.",
    highlights: [
      "DeepMind hackathon entry",
      "11-step pipeline: paper → analogy world → storyboard → Veo 3.1 render",
      "Core idea: map the paper onto a familiar everyday scene before explaining any of it",
      <>
        Production app:{" "}
        <a
          href="https://the-paper-book.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:opacity-70"
        >
          the-paper-book.vercel.app
        </a>
      </>,
      <>
        Related publication:{" "}
        <a
          href="https://openreview.net/forum?id=ADegFYAzfR"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:opacity-70"
        >
          Li, F. &quot;PaperBook: Scientific Papers to Coherent Explainer
          Videos via Parallel Clip Generation.&quot; ACM International
          Conference on Multimedia 2026, Demo &amp; Video Track (Under
          Review)
        </a>
      </>,
    ],
    accent: PROJECT_COLORS.paperbook,
    demo: <PaperBookDemo />,
  },
  {
    id: "wand",
    icon: "🪄",
    eyebrow: "Gemini Live Agent Challenge",
    title: "WAND",
    tagline:
      "A live agent that sees and hears you. No typing, no mouse — just point and talk.",
    highlights: [
      <>
        Winner of Best Multimodal Integration &amp; User Experience —{" "}
        <a
          href="https://devpost.com/software/wand-a-live-agent-that-sees-browses-and-clicks-with-you"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:opacity-70"
        >
          devpost.com/software/wand
        </a>
      </>,
      "A hands-free, voice-first live agent that sees your screen and acts in real time as you speak and point — no typing, no mouse.",
      <>
        How I built it:{" "}
        <a
          href="https://dev.to/lifuyuan/building-wand-a-voice-hand-pointer-live-agent-with-google-adk-and-gemini-live-2fp7"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:opacity-70"
        >
          dev.to/lifuyuan/building-wand
        </a>
      </>,
      "Designed for seniors, people with limited abilities, or anyone in a hands-busy moment — cooking, eating, holding a puppy 🐶",
    ],
    accent: PROJECT_COLORS.wand,
    demo: <WandDemo />,
  },
  {
    id: "seenit",
    icon: "🎯",
    eyebrow: "Seen It",
    title: "youtube-copilot",
    tagline:
      "In-video search + voice control for hands-busy tutorials. Recommends products without ever interrupting the video.",
    highlights: [
      '"Go back to where he loosens the bolt" — jumps straight to the moment',
      "Recommends products quietly, in the corner, then gets out of the way",
      "Built on Gemini Live + ADK tool-calling",
    ],
    accent: PROJECT_COLORS.seenit,
    demo: <SeenItDemo />,
  },
  {
    id: "dispatch",
    icon: "📡",
    eyebrow: "my worst-designed, most-used tool",
    title: "dispatch-cli",
    tagline:
      "How do I find time for all of the above? I remote-control my home computer from my phone — Claude, Gemini, Codex, whichever's free.",
    highlights: [
      "The tool that quietly makes the other four possible",
      "Tailscale-only — nothing routes through a third party",
      "Switch between Claude / Gemini / Codex mid-session, from a phone",
    ],
    accent: PROJECT_COLORS.dispatch,
    demo: <DispatchEasterEgg />,
  },
  {
    id: "interview",
    icon: "🎙️",
    eyebrow: "XPRIZE — Build with Gemini",
    title: "interview-coach",
    tagline:
      "Upload a resume, get a tailored mock interview and a scored breakdown. Runs on mock data with zero setup, or real Gemini with one key.",
    highlights: [
      "Reads your resume + the job description before writing a single question",
      "Runs fully on mock data — perfect for trying the UI with no setup",
      "Part of the Build with Gemini XPRIZE project",
    ],
    accent: PROJECT_COLORS.interview,
    demo: (
      <p className="font-mono text-sm opacity-50">
        interactive demo coming — for now, the repo speaks for itself.
      </p>
    ),
  },
];

export default function GeekView() {
  return (
    <div className="flex flex-col gap-10">
      <SweepItem at={0.15}>
        <header className="flex flex-col gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.3em] opacity-50">
            fuyuan li — geek_mode
          </span>
          <h1 className="font-mono text-3xl sm:text-4xl leading-tight">
            Machine Learning Engineer / Quant. AI hacker.
            <br />
            builds things that see, hear, and act.
          </h1>
        </header>
      </SweepItem>

      <SweepItem at={0.6}>
        <ProjectCoverFlow items={ITEMS} />
      </SweepItem>
    </div>
  );
}
