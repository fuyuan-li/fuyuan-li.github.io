export type SketchKind = "film" | "wand" | "target" | "satellite" | "mic";

const COMMON = {
  fill: "none",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

// hand-drawn line icons — deliberately imperfect paths (uneven curves,
// slightly doubled strokes) to read as sketched rather than vector-perfect
function Film({ color }: { color: string }) {
  return (
    <>
      <path
        d="M14 21c-1.5-8.5-1-16.5 1-27 15-2.5 32-2.5 46 1 2 9 2 17.5-1 26.5-15 2.5-31 2.5-46-.5Z"
        stroke={color}
        strokeWidth={2.4}
        {...COMMON}
      />
      <path d="M20 6l6 12M34 4.5l6 12.5M48 4l6 13" stroke={color} strokeWidth={2.2} {...COMMON} />
      <path d="M14 21c-1.4-8.4-.9-16.3.9-27" stroke={color} strokeWidth={1} opacity={0.4} {...COMMON} />
    </>
  );
}

function Wand({ color }: { color: string }) {
  return (
    <>
      <path d="M16 60 54 19" stroke={color} strokeWidth={3} {...COMMON} />
      <path d="M17.5 61 55 20.5" stroke={color} strokeWidth={1} opacity={0.35} {...COMMON} />
      <path d="M58 8l1.5 5.5L65 15l-5.5 1.5L58 22l-1.5-5.5L51 15l5.5-1.5Z" stroke={color} strokeWidth={2} {...COMMON} />
      <path d="M11 44l1 3.6 3.6 1-3.6 1L11 53.2 10 49.6 6.4 48.6 10 47.6Z" stroke={color} strokeWidth={1.8} {...COMMON} />
      <path d="M45 5l.8 2.8L48.6 8.6 45.8 9.4 45 12.2 44.2 9.4 41.4 8.6 44.2 7.8Z" stroke={color} strokeWidth={1.6} {...COMMON} />
    </>
  );
}

function Target({ color }: { color: string }) {
  return (
    <>
      <path d="M39 8c-17 0-30.5 13.8-30.5 31S22 70 39 70s30.5-13.8 30.5-31" stroke={color} strokeWidth={2.2} {...COMMON} />
      <path d="M63 12 51 24" stroke={color} strokeWidth={2.2} {...COMMON} />
      <path d="M58 6l9.5 1-1 9.5" stroke={color} strokeWidth={2.2} {...COMMON} />
      <circle cx="39" cy="39" r="17.5" stroke={color} strokeWidth={2} {...COMMON} />
      <circle cx="39" cy="39" r="8.5" stroke={color} strokeWidth={2} {...COMMON} />
      <circle cx="39.5" cy="38.5" r="2.2" fill={color} stroke="none" />
    </>
  );
}

function Satellite({ color }: { color: string }) {
  return (
    <>
      <rect x="30" y="30" width="17" height="17" rx="2" transform="rotate(-8 38.5 38.5)" stroke={color} strokeWidth={2.2} {...COMMON} />
      <path d="M31 33 12 20M47 32l19-10" stroke={color} strokeWidth={2} {...COMMON} />
      <rect x="4" y="12" width="12" height="17" rx="1.5" transform="rotate(-20 10 20.5)" stroke={color} strokeWidth={2} {...COMMON} />
      <rect x="61" y="4" width="12" height="17" rx="1.5" transform="rotate(20 67 12.5)" stroke={color} strokeWidth={2} {...COMMON} />
      <path d="M40 47 30 66" stroke={color} strokeWidth={2.2} {...COMMON} />
      <path d="M23 55c3-4 8-6 12-4M18 62c5-6 13-9 19-6" stroke={color} strokeWidth={1.8} opacity={0.7} {...COMMON} />
    </>
  );
}

function Mic({ color }: { color: string }) {
  return (
    <>
      <path d="M39 6c6 0 10.5 4.7 10.5 10.5v18c0 5.8-4.5 10.5-10.5 10.5S28.5 40.3 28.5 34.5v-18C28.5 10.7 33 6 39 6Z" stroke={color} strokeWidth={2.3} {...COMMON} />
      <path d="M17 30c0 12.5 9.8 22.5 22 22.5S61 42.5 61 30" stroke={color} strokeWidth={2.2} {...COMMON} />
      <path d="M39 52.5V68M27 68h24" stroke={color} strokeWidth={2.2} {...COMMON} />
      <path d="M32 15c0-4 3-6.5 6.5-6.7" stroke={color} strokeWidth={1.4} opacity={0.5} {...COMMON} />
    </>
  );
}

const ICONS: Record<SketchKind, (p: { color: string }) => React.ReactNode> = {
  film: Film,
  wand: Wand,
  target: Target,
  satellite: Satellite,
  mic: Mic,
};

export default function SketchIcon({
  kind,
  color,
  className,
}: {
  kind: SketchKind;
  color: string;
  className?: string;
}) {
  const Icon = ICONS[kind];
  return (
    <svg
      viewBox="0 0 78 74"
      className={className}
      style={{ overflow: "visible" }}
      aria-hidden
    >
      <Icon color={color} />
    </svg>
  );
}
