"use client";

import { CSSProperties, ReactNode } from "react";

export default function ProjectCard({
  icon,
  eyebrow,
  title,
  tagline,
  highlights,
  actions,
  theme,
  accent,
  children,
}: {
  icon?: string;
  eyebrow: string;
  title: string;
  tagline: ReactNode;
  highlights?: ReactNode[];
  actions?: ReactNode;
  theme: "geek" | "rock";
  accent?: string;
  children: ReactNode;
}) {
  const isRock = theme === "rock";

  const style: CSSProperties & Record<string, string> = {
    borderColor: isRock ? "var(--rock-line)" : "var(--geek-line)",
    background: isRock ? "var(--rock-bg-raised)" : "var(--geek-bg-raised)",
  };

  if (accent && !isRock) {
    style["--geek-accent"] = accent;
    style.borderTop = `4px solid ${accent}`;
  }

  return (
    <section
      className="rounded-2xl border p-6 sm:p-8 flex flex-col gap-6"
      style={style}
    >
      <header className="relative flex flex-col">
        {actions ? <div className="absolute right-0 top-0">{actions}</div> : null}
        {icon && !isRock && <span className="mb-3 text-5xl leading-none">{icon}</span>}
        <span
          className="font-mono text-[11px] font-medium uppercase leading-4 tracking-[0.25em] opacity-60"
          style={accent && !isRock ? { color: accent } : undefined}
        >
          {eyebrow}
        </span>
        <h3
          className={
            isRock
              ? "font-display mt-1.5 text-4xl leading-[1.15] tracking-wide"
              : "font-mono mt-1.5 text-3xl font-semibold leading-[1.15]"
          }
        >
          {title}
        </h3>
        <div className="mt-3 max-w-prose text-base leading-[1.55] opacity-70">
          {tagline}
        </div>
        {highlights && highlights.length > 0 && (
          <ul className="mt-4 flex flex-col gap-2.5">
            {highlights.map((h, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm leading-[1.6] opacity-80"
              >
                <span
                  className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: accent ?? "currentColor" }}
                />
                {h}
              </li>
            ))}
          </ul>
        )}
      </header>
      <div className="mt-1">{children}</div>
    </section>
  );
}
