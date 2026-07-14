const CONTACTS = [
  {
    label: "Email",
    href: "mailto:david.li071611@gmail.com",
    icon: (
      <path d="M2.5 5.5A1.5 1.5 0 0 1 4 4h12a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 16 16H4a1.5 1.5 0 0 1-1.5-1.5v-9Zm1.6.2 5.9 4.6 5.9-4.6" />
    ),
  },
  {
    label: "Phone",
    href: "tel:+12027010927",
    icon: (
      <path d="M6.6 3.5 4 4.3c-.5 3 .9 7.2 3.4 9.7 2.5 2.5 6.7 3.9 9.7 3.4l.8-2.6-3.4-2-1.4 1.2c-1.5-.7-3-2.2-3.7-3.7l1.2-1.4-2-3.4Z" />
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/david-li-112620b1/",
    icon: (
      <>
        <rect x="3" y="8" width="3" height="9" />
        <circle cx="4.5" cy="4.5" r="1.6" />
        <path d="M9 8h3v1.6c.7-1.1 1.9-1.8 3.3-1.8 2.4 0 3.7 1.6 3.7 4.4V17h-3v-4.3c0-1.2-.5-2-1.6-2-.9 0-1.5.6-1.7 1.2-.1.2-.1.5-.1.8V17H9V8Z" />
      </>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com/fuyuan-li",
    icon: (
      <path d="M10 2.2c-4.4 0-8 3.6-8 8 0 3.5 2.3 6.5 5.5 7.6.4.1.5-.2.5-.4v-1.5c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.3 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8a7.5 7.5 0 0 1 4 0c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.5.8 1.2.8 2.1 0 3.1-1.9 3.7-3.6 4 .3.3.6.8.6 1.6v2.4c0 .2.1.5.5.4A8 8 0 0 0 18 10.2c0-4.4-3.6-8-8-8Z" />
    ),
  },
];

export default function ContactIcons({ theme }: { theme: "geek" | "rock" }) {
  const color = theme === "rock" ? "var(--rock-fg)" : "var(--geek-fg)";
  return (
    <div className="flex items-center gap-3">
      {CONTACTS.map((c) => (
        <a
          key={c.label}
          href={c.href}
          target={c.href.startsWith("http") ? "_blank" : undefined}
          rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
          aria-label={c.label}
          className="opacity-50 transition-opacity hover:opacity-100"
          style={{ color }}
        >
          <svg viewBox="0 0 20 20" width={15} height={15} fill="currentColor" aria-hidden>
            {c.icon}
          </svg>
        </a>
      ))}
    </div>
  );
}
