"use client";

import { CSSProperties, ReactNode } from "react";

export default function ProjectCard({
  icon,
  eyebrow,
  title,
  tagline,
  highlights,
  theme,
  accent,
  children,
}: {
  icon?: string;
  eyebrow: string;
  title: string;
  tagline: string;
  highlights?: ReactNode[];
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
      <header className="flex flex-col gap-2">
        {icon && !isRock && <span className="text-5xl">{icon}</span>}
        <span
          className="font-mono text-xs uppercase tracking-[0.25em] opacity-60"
          style={accent && !isRock ? { color: accent } : undefined}
        >
          {eyebrow}
        </span>
        <h3
          className={
            isRock
              ? "font-display text-4xl tracking-wide"
              : "font-mono text-3xl"
          }
        >
          {title}
        </h3>
        <p className="text-base opacity-70 max-w-prose">{tagline}</p>
        {highlights && highlights.length > 0 && (
          <ul className="mt-1 flex flex-col gap-1.5">
            {highlights.map((h, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm opacity-80"
              >
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: accent ?? "currentColor" }}
                />
                {h}
              </li>
            ))}
          </ul>
        )}
      </header>
      <div>{children}</div>
    </section>
  );
}
