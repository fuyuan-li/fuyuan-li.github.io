# UI Reference — what the real products actually look like

Read directly from each project's source (not guessed). This corrects several
things the first-pass demos got wrong — most notably the accent colors were
essentially made up rather than pulled from the real apps.

## PaperBook (`gemini_hackathon/paper-video-web-ui`)
- Real stack: Next.js + shadcn/ui, `border-2` (bold 2px borders throughout),
  `rounded-lg`, warm off-white background.
- **Real accent color: `oklch(0.68 0.18 30)`** — a warm coral/orange
  (~`#e8734a`), NOT teal. Background `oklch(0.98 0.005 85)` (warm white),
  foreground near-black-purple `oklch(0.15 0.05 280)`.
- Header: `Video` icon (lucide) + wordmark **"The PaperBook — Research, a
  video story for everyone"**, "My Videos" nav link.
- Upload flow: dashed drop zone, `Upload`/`FileText` icon in a circle,
  filename + size shown once selected, real numeric **progress bar with %**
  (not just a spinner), button copy: "Convert to Videos →" /
  "Converting to Videos..." (with spinner).
- Below the upload card: **3 numbered circles** (1/2/3) — "Upload a Paper" /
  "Understand, Then Explain" / "Get Explainer Video".
- Correction for our demo: swap accent from teal → coral/orange, add the
  numbered-steps row, use the real header copy.

## WAND (`adk_agent_hackathon/client/cursor/ui_overlay.py`)
- Real cursor is a native macOS overlay, two distinct visual elements:
  - **Fingertip dot**: solid, radius ~10px, color `rgb(255,224,77)` at 95%
    opacity — a **warm yellow dot**, not a generic accent-colored circle.
  - **Calibration ring**: radius ~48px, stroke `rgb(46,245,235)` (**cyan**)
    with a translucent cyan fill (14% alpha) — used for calibration/targeting,
    not the everyday cursor.
- Correction for our demo: the "pointer" in the WAND demo should render as a
  yellow dot (not a plain accent-colored ring), and the accent color for the
  WAND card should shift toward cyan/yellow, not violet.

## Seen It (`youtube-copilot/frontend`)
- Real stack: hand-rolled HTML/CSS (no framework), **Georgia serif** font
  throughout (deliberately editorial/cinematic, not a typical app sans-serif).
- Background: dark warm gradient — `radial-gradient` amber top-left + teal
  bottom-right over a `#14120f → #201b16 → #0e1418` diagonal base. Glass
  panels: `rgba(17,17,16,0.72)` + `backdrop-filter: blur(14px)`, 22px radius.
- Two-column layout: left = video player + controls, right = live transcript.
- Chat-bubble transcript, iMessage-style alternating sides:
  - user entries: right-aligned, **amber** `rgba(240,188,134,...)`
  - agent entries: left-aligned, **teal** `rgba(129,193,203,...)`
- Buttons are pills (`border-radius: 999px`); primary CTA ("Start") uses an
  amber→terracotta gradient (`#f0bc86 → #dd8c67`).
- Status chip with colored dot: grey idle / green `#7bd389` connected / red
  `#ff7b72` error, with a soft glow (`box-shadow`) when active.
- Correction for our demo: this is the most visually distinct of the five —
  worth giving it its own warm/editorial treatment (serif headline, amber vs.
  teal two-party chat bubbles) rather than reusing the generic mono/dark
  "device screen" box the other demos use.

## dispatch-cli (`dispatch-cli/static/index.html`)
- Real stack: hand-rolled HTML/CSS, **JetBrains Mono** (UI) + **Space Mono**
  (numerics/labels).
- Palette (CSS vars): `--bg:#0a0c0f`, `--surface:#111418`,
  `--border:#1e2530`, `--accent:#00d4aa` (**teal/mint**, not orange),
  `--accent2:#0099ff` (blue), `--text:#c8d0dc`, `--dim:#4a5568`,
  `--green:#39d353`, `--yellow:#e3b341`, `--red:#f85149`.
- Status dot pattern: red (disconnected) / green (connected) / pulsing
  yellow (running) — directly reusable for a "connection status" detail.
- ANSI-style colored terminal output classes (green/yellow/blue/cyan/red/dim)
  — matches the "log scrolling" idea already in our demo.
- Correction for our demo: this one was closest already (mono terminal
  aesthetic), but the accent should be **teal `#00d4aa`**, not orange — and
  orange should move to PaperBook instead (see swap above).

## interview-coach / "CVMock" (`xprize/interview-coach/web`)
- Real product name shown in-app: **CVMock** (blue "CV" + black "Mock"),
  logo = rounded-square blue (`#2563eb`) chat-bubble-with-checkmark icon,
  inline SVG.
- Real progress-step copy while generating questions (sequential messages,
  useful verbatim for a demo loader):
  1. "Reading your resume…"
  2. "Digesting the role & requirements…"
  3. "Matching you to the interview bar…"
  4. "Designing your CV deep-dive questions…"
  5. "Adding behavioral & follow-up probes…"
  6. "Polishing the final set…"
- Upload UI has two tabs: Resume (**Upload** / **Paste**) and Job (**Role** /
  **JD**).
- Correction for our demo: accent should be **blue `#2563eb`** (matching the
  CVMock brand), not pink. If we build out a real demo later, the step-by-step
  loading copy above should be used verbatim — it's a nice detail already
  written.

## StageV1 (github.com/fuyuan-li/stagev1 — cloned read-only to inspect)
- Real stack: Next.js + `react-tinder-card`, plain CSS modules, mostly
  default Vercel-blue (`#0070f3`) utilitarian styling — the actual visual
  design here is not the strong point; the **interaction pattern** is.
- **Swiping is 3-way, not 2-way**: this is the one clear functional
  correction to our demo.
  - **left** → "Not Interest" (red `#f44336`)
  - **up** → "JOIN!" (green `#4CAF50`) — navigates into the proposal detail
  - **right** → "Add Waitlist" (blue `#2196F3`)
- Each card shows: song name, a band-name badge (blue) or "Public" badge
  (green) top-right, and a **link preview** of the song link.
- Correction for our demo: switch from binary left/right swipe to the real
  three-way gesture (left/up/right) with the exact labels and colors above —
  this is a much more interesting and accurate interaction than a generic
  Tinder pass/like.

---

## Summary of corrections to make once we resume implementation
| Project | Was (wrong) | Should be (real) |
|---|---|---|
| PaperBook | teal accent | coral/orange `oklch(0.68 0.18 30)` (~`#e8734a`), add numbered 3-step row, real header copy |
| WAND | generic accent ring pointer | yellow dot (`#ffe04d`) cursor + cyan (`#2ef5eb`) calibration ring |
| Seen It | generic dark mono box | Georgia serif, warm amber/teal glass panels, amber-vs-teal chat bubbles |
| dispatch-cli | orange accent | teal/mint `#00d4aa`, JetBrains/Space Mono |
| interview-coach | pink accent, no demo | blue `#2563eb` (CVMock brand), real step-by-step loading copy |
| StageV1 | 2-way swipe (pass/add) | 3-way swipe: left=Not Interest(red)/up=JOIN(green)/right=Waitlist(blue) |

Not yet decided: how "宏大设计感" (grander visual presence) gets layered on
top of this — e.g. hero imagery, or a consistent pixel-art treatment. That's
a separate open discussion, see chat.
