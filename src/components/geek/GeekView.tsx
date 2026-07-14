import ProjectCoverFlow, { CoverItem } from "./ProjectCoverFlow";
import PaperBookDemo from "./PaperBookDemo";
import WandDemo from "./WandDemo";
import SeenItDemo from "./SeenItDemo";
import DispatchEasterEgg from "./DispatchEasterEgg";
import InterviewCoachDemo from "./InterviewCoachDemo";
import SweepItem from "@/components/shared/SweepItem";
import ProjectTip from "@/components/shared/ProjectTip";
import { PROJECT_COLORS } from "@/lib/project-colors";

export const ITEMS: CoverItem[] = [
  {
    id: "paperbook",
    icon: "🎬",
    sketch: "film",
    eyebrow: "multimodal AI scientific explainer",
    title: "The PaperBook",
    tagline: (
      <ProjectTip accent={PROJECT_COLORS.paperbook}>
        <p>
          Cliché warning: “If you can&apos;t explain something to a six-year-old,
          you don&apos;t really understand it.” Einstein or Feynman, according to
          internet rumors. I don&apos;t know who said it, but whoever it was missed
          one thing: six-year-olds do not want to read your paper.
        </p>
        <p>
          Honestly, neither do I sometimes. I wanted reading papers to be faster,
          visual, and actually fun — so PaperBook was born.
        </p>
        <p>
          Yes, I borrowed the name from children&apos;s picture books. In front
          of a dense research publication, aren&apos;t we all basically babies?
        </p>
      </ProjectTip>
    ),
    highlights: [
      "Core idea: map the paper onto a familiar everyday scene before explaining any of it",
      <span key="production-app">
        Production app:{" "}
        <a
          href="https://the-paper-book.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:opacity-70"
        >
          the-paper-book.vercel.app
        </a>
      </span>,
      <span key="related-publication">
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
      </span>,
    ],
    accent: PROJECT_COLORS.paperbook,
    demo: <PaperBookDemo />,
  },
  {
    id: "wand",
    icon: "🪄",
    sketch: "wand",
    eyebrow: "Gemini Live Agent Challenge",
    title: "WAND",
    tagline: (
      <ProjectTip accent={PROJECT_COLORS.wand}>
        <p>
          When was the last time you taught Grandma to use a keyboard and
          mouse? More importantly: did she remember it the next day?
        </p>
        <p>
          If you broke your wrist skiing tomorrow, what would hurt more —
          rehab, or being locked out of your computer?
        </p>
        <p>
          I wanted a browser you could simply point at and talk to. So I built
          WAND.
        </p>
      </ProjectTip>
    ),
    highlights: [
      "A hands-free, voice-first live agent that sees your screen and acts in real time as you speak and point — no typing, no mouse.",
      "Designed for seniors, people with limited abilities, or anyone in a hands-busy moment — cooking, eating, holding a puppy 🐶",
      <span key="devpost-winner">
        Winner of Best Multimodal Integration &amp; User Experience —{" "}
        <a
          href="https://devpost.com/software/wand-a-live-agent-that-sees-browses-and-clicks-with-you"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:opacity-70"
        >
          devpost.com/software/wand
        </a>
      </span>,
      <span key="how-i-built-it">
        How I built it:{" "}
        <a
          href="https://dev.to/lifuyuan/building-wand-a-voice-hand-pointer-live-agent-with-google-adk-and-gemini-live-2fp7"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:opacity-70"
        >
          dev.to/lifuyuan/building-wand
        </a>
      </span>,
    ],
    accent: PROJECT_COLORS.wand,
    demo: <WandDemo />,
  },
  {
    id: "seenit",
    icon: "🎯",
    sketch: "target",
    eyebrow: "A Live Multimodal Video Agent",
    title: "youtube-copilot",
    tagline: (
      <ProjectTip accent={PROJECT_COLORS.seenit}>
        <p>Ever scrubbed a video for one scene, five seconds at a time?</p>
        <p>Ever needed to control it with your hands full?</p>
        <p>Ever gotten tired of ads elbowing into what you&apos;re watching?</p>
        <p>
          I built in-video search, hands-free voice control, and recommendations
          that show up quietly — and know when to get out of the way.
        </p>
      </ProjectTip>
    ),
    highlights: [
      'In-video semantic search: “Go back to where he loosens the bolt” — jumps straight to the moment.',
      'Voice control: “Pause,” “rewind,” or, technically, “tell me a joke.”',
      "Search and voice interactions double as recommendation signals — quietly, without interrupting the video.",
      <span key="live-app">
        Live app:{" "}
        <a
          href="https://youtube-copilot-729166048428.us-central1.run.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:opacity-70"
        >
          youtube-copilot-729166048428.us-central1.run.app
        </a>
      </span>,
    ],
    accent: PROJECT_COLORS.seenit,
    demo: <SeenItDemo />,
  },
  {
    id: "interview",
    icon: "🎙️",
    sketch: "mic",
    eyebrow: "Your CV, Your mock, Your edge",
    title: "interview-coach",
    tagline: (
      <ProjectTip accent={PROJECT_COLORS.interview}>
        <p>
          Since AI got absurdly good, I&apos;ve found roughly a million AI mock
          interview sites. Exactly zero seemed to care about my resume or what
          I had actually done.
        </p>
        <p>
          Most also promise to teach system design — one of those topics where
          you might trust a textbook more than a black-box agent built by
          who-knows-who. Then it clicked: AI is much better suited to CV deep
          dives and behavioral interviews, where the hard part is context,
          judgment, communication, and self-awareness — not reciting
          architecture diagrams.
        </p>
        <p>
          So I built the missing one. Oh, and this time, it reads your resume
          before it asks a single question.
        </p>
      </ProjectTip>
    ),
    highlights: [
      "Reads your CV and asks questions grounded in your actual experience.",
      "A live, recorded session for replay, scoring, analysis, and targeted improvement areas.",
      <span key="available-at">
        Available at:{" "}
        <a
          href="https://cvmock.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:opacity-70"
        >
          cvmock.com
        </a>
      </span>,
    ],
    accent: PROJECT_COLORS.interview,
    demo: <InterviewCoachDemo />,
  },
  {
    id: "dispatch",
    icon: "📡",
    sketch: "satellite",
    eyebrow: "Worst designed, most used",
    title: "dispatch-cli",
    tagline: (
      <ProjectTip accent={PROJECT_COLORS.dispatch}>
        <p>
          So far, none of these projects is my day job — and you probably
          don&apos;t care which model I accidentally trained into the ground this
          week. So when did I build them? The glamorous way: between overtime
          and on-call pages.
        </p>
        <p>
          I wrote dispatch-cli so I could keep building from the subway, over
          lunch, or while walking the dog. It failed beautifully: the UI is my
          worst, and soon after, Claude, OpenAI, and Gemini all shipped official
          versions of the same idea.
        </p>
        <p>
          Fine. I still use mine. It switches across all three of my
          subscription accounts without touching API billing. Also, it can
          boss around my robot vacuum.
        </p>
      </ProjectTip>
    ),
    highlights: [
      "Your own private, remote version of Claude Code, Codex, and Gemini CLI.",
      "The tool that quietly makes every other hobby project faster to build.",
      "Switch between all your AI accounts mid-session. Hit a token limit? Seamlessly move to the next one.",
    ],
    accent: PROJECT_COLORS.dispatch,
    demo: <DispatchEasterEgg />,
  },
];

export default function GeekView() {
  return (
    <div className="flex flex-col gap-10">
      <SweepItem at={0.52}>
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

      <SweepItem at={0.16}>
        <ProjectCoverFlow items={ITEMS} />
      </SweepItem>
    </div>
  );
}
