"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const CLEAN_QUERY = "crystal shoes";
const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

type ResultId = "sneaker" | "crystal" | "speedboots";

const RESULTS: {
  id: ResultId;
  tag?: string;
  domain: string;
  name: string;
  price: string;
  rating: string;
  emoji?: string;
  img?: string;
}[] = [
  {
    id: "sneaker",
    tag: "Ad",
    domain: "shoebarn.example.com",
    name: "Classic Court Sneaker — White",
    price: "$89.99",
    rating: "★★★★☆ 4.6k",
    emoji: "👟",
  },
  {
    id: "crystal",
    domain: "crystalcouture.example.com",
    name: "Crystal Glass Slipper Heel",
    price: "$128.00",
    rating: "★★★★★ 2.1k",
    img: "/wand/crystal-shoes.png",
  },
  {
    id: "speedboots",
    tag: "Marketplace",
    domain: "gamemall.example.com",
    name: "Speed Boots +50% ATK (Lv. 1)",
    price: "$500.00",
    rating: "★★★★☆ 890",
    img: "/wand/speed-boots.png",
  },
];

const CART_LABEL: Record<ResultId, string> = {
  sneaker: "a sponsored sneaker (wrong one)",
  crystal: "the crystal shoes",
  speedboots: "someone's $500 game boots (very wrong)",
};

type Smudge = { id: number; x: number; y: number; r: number; s: number };

export default function WandDemo() {
  const [wandOn, setWandOn] = useState(false);
  const [started, setStarted] = useState(false);

  const [query, setQuery] = useState("");
  const [typed, setTyped] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [cart, setCart] = useState<ResultId | null>(null);

  const [showKeyboard, setShowKeyboard] = useState(false);
  const [voiceBubble, setVoiceBubble] = useState<string | null>(null);
  const [bubblePos, setBubblePos] = useState<{ x: number; y: number } | null>(null);
  const [dropText, setDropText] = useState<{ x: number; y: number } | null>(null);
  const [cursorAt, setCursorAt] = useState<{ x: number; y: number } | null>(null);
  const [clickRipple, setClickRipple] = useState<{ x: number; y: number } | null>(null);
  const [searchFlash, setSearchFlash] = useState(false);
  const [status, setStatus] = useState<string>("");

  const [retryCount, setRetryCount] = useState(0);
  const [smudges, setSmudges] = useState<Smudge[]>([]);
  const smudgeId = useRef(0);
  const screenRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<HTMLButtonElement>(null);
  const resultRefs = useRef<Map<ResultId, HTMLButtonElement>>(new Map());
  const timers = useRef<number[]>([]);

  const dirty = started && !wandOn; // greasy fingers are the default state once WAND is off

  const addSmudge = (clientX: number, clientY: number) => {
    const rect = screenRef.current?.getBoundingClientRect();
    if (!rect) return;
    smudgeId.current += 1;
    setSmudges((s) => [
      ...s,
      {
        id: smudgeId.current,
        x: clientX - rect.left,
        y: clientY - rect.top,
        r: Math.random() * 60 - 30,
        s: 0.7 + Math.random() * 0.6,
      },
    ]);
  };

  const clearAllTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  // slow, legible autoplay, broken into small readable beats — every step
  // also lands in `status` so nothing is a blink-and-miss
  const runWandScript = () => {
    const cursorTarget = { current: null as { x: number; y: number } | null };

    const rectIn = (el: HTMLElement | null | undefined) => {
      const rect = el?.getBoundingClientRect();
      const screenRect = screenRef.current?.getBoundingClientRect();
      if (!rect || !screenRect) return null;
      return {
        x: rect.left - screenRect.left + rect.width / 2,
        y: rect.top - screenRect.top + rect.height / 2,
      };
    };

    // centered enough that the bubble's full width clears the screen's
    // overflow-hidden edges — a fixed left-ish x clipped it off-screen
    const micAnchor = () => {
      const width = screenRef.current?.getBoundingClientRect().width ?? 260;
      return { x: Math.max(110, width / 2), y: 20 };
    };

    const seq: [number, () => void][] = [
      // 1. listening
      [300, () => setStatus("🎙 listening…")],
      // 2. hear the query, bubble appears near the mic
      [1200, () => {
        setBubblePos(micAnchor());
        setVoiceBubble(`🎙 heard: "${CLEAN_QUERY}"`);
        setStatus(`heard "${CLEAN_QUERY}"`);
      }],
      // 3. bubble slides over to the search bar
      [2100, () => {
        const pos = rectIn(searchBarRef.current);
        if (pos) setBubblePos(pos);
      }],
      // 4. the bubble's text drops out of it and falls into the search bar
      [2950, () => {
        const pos = rectIn(searchBarRef.current);
        setVoiceBubble(null);
        setDropText(pos);
        setStatus('"crystal shoes" — dropping in…');
      }],
      // 5. text lands, search bar now actually shows it
      [3300, () => {
        setDropText(null);
        setQuery(CLEAN_QUERY);
        setStatus('typed "crystal shoes"');
      }],
      // 6. the search button flashes — this is the "click"
      [3650, () => {
        setSearchFlash(true);
        setStatus("tapping search…");
      }],
      [3950, () => setSearchFlash(false)],
      // 7. a short "searching" beat before results land
      [4050, () => setStatus("searching…")],
      [4550, () => {
        setShowResults(true);
        setStatus("here's what came up");
      }],
      // 8. point at the crystal shoes and hold
      [5300, () => {
        const pos = rectIn(resultRefs.current.get("crystal"));
        if (pos) {
          cursorTarget.current = pos;
          setCursorAt(pos);
          setStatus("pointing at the crystal shoes");
        }
      }],
      // 9. "click this", held a beat
      [6700, () => {
        setBubblePos(
          cursorTarget.current
            ? { x: cursorTarget.current.x, y: cursorTarget.current.y - 26 }
            : null
        );
        setVoiceBubble(`🎙 "click this"`);
        setStatus('"click this"');
      }],
      // 10. the click itself
      [7700, () => {
        setClickRipple(cursorTarget.current);
        setVoiceBubble(null);
      }],
      // 11. add to cart, everything settles, then the final line appears
      [8300, () => {
        setCart("crystal");
        setClickRipple(null);
        setCursorAt(null);
        setStatus("added to cart — done, hands never touched the screen");
      }],
    ];
    seq.forEach(([ms, fn]) => {
      const t = window.setTimeout(fn, ms);
      timers.current.push(t);
    });
  };

  const start = (wandOverride?: boolean) => {
    setStarted(true);
    setQuery("");
    setTyped("");
    setShowResults(false);
    setShowKeyboard(false);
    setCart(null);
    setRetryCount(0);
    setSmudges([]);
    setVoiceBubble(null);
    setBubblePos(null);
    setDropText(null);
    setCursorAt(null);
    setClickRipple(null);
    setSearchFlash(false);
    clearAllTimers();
    if (wandOverride ?? wandOn) {
      runWandScript();
    } else {
      setStatus("🖐 hands are full — try to search & buy anyway");
    }
  };

  const reset = () => {
    clearAllTimers();
    setStarted(false);
    setQuery("");
    setTyped("");
    setShowResults(false);
    setShowKeyboard(false);
    setCart(null);
    setRetryCount(0);
    setSmudges([]);
    setStatus("");
  };

  const canSubmit = typed === CLEAN_QUERY;

  const submitSearch = () => {
    if (showResults || !canSubmit) return;
    setQuery(typed);
    setShowResults(true);
    setShowKeyboard(false);
    setStatus("here's what came up");
  };

  const handleTapInput = () => {
    if (showResults || wandOn) return;
    setShowKeyboard(true);
    setStatus('🖐 greasy — try typing "crystal shoes"');
  };

  const handleKeyTap = (key: string, e: React.MouseEvent) => {
    if (showResults) return;
    // every tap leaves a mark — the keyboard only ever shows up in the greasy,
    // WAND-off scenario, so grease accumulates on every press, hit or miss
    addSmudge(e.clientX, e.clientY);

    if (key === "retry") {
      setTyped("");
      setRetryCount((c) => c + 1);
      setStatus("🖐 wiped it on your shirt — try again");
      return;
    }
    if (key === "⌫") {
      setTyped((t) => t.slice(0, -1));
      return;
    }

    const letter = key === "space" ? " " : key;
    setTyped((t) => {
      const slipped = Math.random() < 0.45;
      const wrong = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
      return t + (slipped ? wrong : letter);
    });
    setStatus("🖐 greasy fingers — hard to type straight");
  };

  const handleResultClick = (id: ResultId, e: React.MouseEvent) => {
    if (cart) return;
    if (dirty) {
      addSmudge(e.clientX, e.clientY);
      setCart("sneaker"); // greasy fingers always fumble onto the sponsored decoy
      setStatus("🖐 slipped — tapped the wrong result");
    } else {
      setCart(id);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* the scenario — always visible, never ambiguous */}
      <div className="flex items-center gap-3 rounded-lg border p-3" style={{ borderColor: "var(--geek-line)" }}>
        <span className="font-mono text-xs opacity-70">
          🍗 picture this: fingers greasy from fried chicken. try to buy the crystal shoes anyway.
        </span>
      </div>

      {!started && (
        <button
          onClick={() => start()}
          className="self-start rounded-full border px-4 py-2 font-mono text-xs"
          style={{ borderColor: "var(--geek-accent)", color: "var(--geek-accent)" }}
        >
          try buying crystal shoes with greasy hands ▸
        </button>
      )}

      {started && (
        <>
          {/* persistent status line — always says what's happening right now */}
          {status && (
            <div
              className="rounded-lg px-3 py-2 font-mono text-xs"
              style={{
                background: dirty ? "rgba(180,83,9,0.08)" : "color-mix(in srgb, var(--geek-accent) 10%, transparent)",
                color: dirty ? "#92400e" : "var(--geek-accent)",
              }}
            >
              {status}
            </div>
          )}

          <div
            ref={screenRef}
            className="relative overflow-hidden rounded-xl border"
            style={{ borderColor: "var(--geek-line)", background: "#f6f7f8" }}
          >
            {/* fake browser chrome */}
            <div className="flex items-center gap-1.5 border-b bg-white px-3 py-2" style={{ borderColor: "var(--geek-line)" }}>
              <span className="h-2 w-2 rounded-full bg-red-300" />
              <span className="h-2 w-2 rounded-full bg-yellow-300" />
              <span className="h-2 w-2 rounded-full bg-green-300" />
              <span className="ml-2 flex-1 truncate rounded-full bg-gray-100 px-3 py-1 font-mono text-[10px] text-gray-500">
                🔒 search.example.com/?q=
                {encodeURIComponent((query || typed) || "")}
              </span>
            </div>

            <div className="p-4">
              {/* a bit of "homepage" furniture so the screen never looks empty/broken */}
              {!showResults && (
                <div className="mb-4 flex items-center gap-2 font-mono text-xs opacity-30">
                  <span>🔍 SearchEngine</span>
                  <span className="rounded-full border px-2 py-0.5" style={{ borderColor: "var(--geek-line)" }}>Shopping</span>
                  <span className="rounded-full border px-2 py-0.5" style={{ borderColor: "var(--geek-line)" }}>Images</span>
                </div>
              )}

              {/* search bar */}
              <div className="relative flex items-center gap-2">
                <motion.button
                  ref={searchBarRef}
                  onClick={handleTapInput}
                  disabled={showResults}
                  className="flex-1 truncate rounded-full border bg-white px-4 py-2 text-left font-sans text-sm disabled:opacity-70"
                  animate={
                    !showKeyboard && !showResults && !wandOn
                      ? {
                          borderColor: "var(--geek-accent)",
                          boxShadow: [
                            "0 0 0 0px color-mix(in srgb, var(--geek-accent) 45%, transparent)",
                            "0 0 0 5px color-mix(in srgb, var(--geek-accent) 0%, transparent)",
                          ],
                        }
                      : {
                          borderColor: showKeyboard ? "var(--geek-accent)" : "var(--geek-line)",
                          boxShadow: "0 0 0 0px transparent",
                        }
                  }
                  transition={
                    !showKeyboard && !showResults && !wandOn
                      ? { boxShadow: { duration: 1.2, repeat: Infinity }, borderColor: { duration: 0.2 } }
                      : { duration: 0.2 }
                  }
                >
                  {(query || typed) || (
                    <span className="text-gray-400">tap to search…</span>
                  )}
                </motion.button>
                <motion.button
                  onClick={submitSearch}
                  disabled={showResults || wandOn || !canSubmit}
                  className="rounded-full px-4 py-2 font-mono text-xs text-white disabled:opacity-40"
                  animate={
                    searchFlash
                      ? { scale: [1, 1.15, 1], boxShadow: "0 0 0 6px color-mix(in srgb, var(--geek-accent) 35%, transparent)" }
                      : { scale: 1, boxShadow: "0 0 0 0px transparent" }
                  }
                  transition={{ duration: 0.3 }}
                  style={{ background: "var(--geek-accent)" }}
                >
                  search
                </motion.button>
              </div>
              {!showResults && !wandOn && (
                <motion.div
                  className="mt-2 font-mono text-[10px] opacity-50"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  👆 tap the search bar and type &quot;crystal shoes&quot; — good luck, greasy fingers
                </motion.div>
              )}

              {/* a real, tappable mobile-style keyboard */}
              <AnimatePresence>
                {showKeyboard && !showResults && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 overflow-hidden rounded-lg border bg-gray-100 p-2"
                    style={{ borderColor: "var(--geek-line)" }}
                  >
                    {["qwertyuiop", "asdfghjkl", "zxcvbnm"].map((row, i) => (
                      <div key={row} className="mb-1 flex justify-center gap-1">
                        {i === 2 && <div className="w-4" />}
                        {row.split("").map((k) => (
                          <button
                            key={k}
                            onClick={(e) => handleKeyTap(k, e)}
                            className="flex h-8 flex-1 max-w-8 items-center justify-center rounded-md bg-white font-mono text-xs uppercase shadow-sm active:scale-90"
                          >
                            {k}
                          </button>
                        ))}
                        {i === 2 && (
                          <button
                            onClick={(e) => handleKeyTap("⌫", e)}
                            className="flex h-8 w-10 items-center justify-center rounded-md bg-white text-xs shadow-sm active:scale-90"
                          >
                            ⌫
                          </button>
                        )}
                      </div>
                    ))}
                    <div className="mb-1 flex justify-center gap-1">
                      <button
                        onClick={(e) => handleKeyTap("space", e)}
                        className="h-8 flex-1 rounded-md bg-white font-mono text-[10px] shadow-sm active:scale-90"
                      >
                        space
                      </button>
                      <button
                        onClick={(e) => handleKeyTap("retry", e)}
                        className="flex h-8 items-center justify-center gap-1 rounded-md bg-white px-3 font-mono text-[10px] shadow-sm active:scale-90"
                      >
                        ↺ retry
                      </button>
                    </div>
                    <div className="font-mono text-[10px] opacity-50 px-1 mb-1">
                      typed: {typed || "…"}
                    </div>
                    <button
                      onClick={submitSearch}
                      disabled={!canSubmit}
                      className="mt-1 w-full rounded-md py-2 text-center font-mono text-xs text-white active:scale-95 disabled:opacity-40"
                      style={{ background: "var(--geek-accent)" }}
                    >
                      {canSubmit ? "search 🔍" : `need exactly "${CLEAN_QUERY}"`}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* results */}
              <AnimatePresence>
                {showResults && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 flex flex-col gap-3"
                  >
                    {RESULTS.map((r) => (
                      <button
                        key={r.id}
                        ref={(el) => {
                          if (el) resultRefs.current.set(r.id, el);
                          else resultRefs.current.delete(r.id);
                        }}
                        onClick={(e) => handleResultClick(r.id, e)}
                        disabled={!!cart}
                        className="flex items-center gap-3 rounded-lg border bg-white p-2.5 text-left disabled:opacity-60"
                        style={{
                          borderColor:
                            cart === r.id ? "var(--geek-accent)" : "var(--geek-line)",
                        }}
                      >
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-gray-50 text-3xl">
                          {r.img ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={r.img} alt={r.name} className="h-full w-full object-contain" />
                          ) : (
                            r.emoji
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 font-mono text-[9px] text-gray-400">
                            {r.tag && (
                              <span className="rounded bg-gray-100 px-1 py-0.5">
                                {r.tag}
                              </span>
                            )}
                            {r.domain}
                          </div>
                          <div className="truncate text-sm font-medium text-gray-800">
                            {r.name}
                          </div>
                          <div className="font-mono text-[10px] text-gray-500">
                            {r.price} · {r.rating}
                          </div>
                        </div>
                        {cart === r.id && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 15 }}
                            className="text-lg"
                          >
                            🛒
                          </motion.span>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* voice bubble — slides between the mic, the search bar, and the cursor */}
            <AnimatePresence>
              {voiceBubble && bubblePos && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1, left: bubblePos.x, top: bubblePos.y }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 260, damping: 28 }}
                  className="pointer-events-none absolute z-30 -translate-x-1/2 whitespace-nowrap rounded-lg px-3 py-1.5 font-mono text-[11px] text-white shadow"
                  style={{ background: "var(--geek-accent)" }}
                >
                  {voiceBubble}
                </motion.div>
              )}
            </AnimatePresence>

            {/* the text physically falling out of the bubble into the search bar */}
            <AnimatePresence>
              {dropText && (
                <motion.div
                  initial={{ opacity: 1, scale: 1, left: dropText.x, top: dropText.y - 4 }}
                  animate={{ opacity: 0, scale: 0.7, top: dropText.y + 14 }}
                  transition={{ duration: 0.35, ease: "easeIn" }}
                  className="pointer-events-none absolute z-30 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 font-mono text-xs text-white"
                  style={{ background: "var(--geek-accent)" }}
                >
                  &quot;{CLEAN_QUERY}&quot;
                </motion.div>
              )}
            </AnimatePresence>

            {/* WAND cursor — yellow dot */}
            <AnimatePresence>
              {cursorAt && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, left: cursorAt.x, top: cursorAt.y }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.3, ease: "easeInOut" }}
                  className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="h-4 w-4 rounded-full" style={{ background: "#ffe04d", opacity: 0.95 }} />
                  <span className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] italic opacity-50">
                    controlled by finger motion
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {clickRipple && (
                <motion.div
                  initial={{ opacity: 0.6, scale: 0.3 }}
                  animate={{ opacity: 0, scale: 1.8 }}
                  transition={{ duration: 0.6 }}
                  className="pointer-events-none absolute z-10 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{ left: clickRipple.x, top: clickRipple.y, background: "#ffe04d" }}
                />
              )}
            </AnimatePresence>

            {/* grease smudges */}
            {smudges.map((s) => (
              <div
                key={s.id}
                className="pointer-events-none absolute z-30 rounded-full"
                style={{
                  left: s.x - 26,
                  top: s.y - 26,
                  width: 52,
                  height: 52,
                  transform: `rotate(${s.r}deg) scale(${s.s})`,
                  background:
                    "radial-gradient(circle, rgba(120,90,40,0.4) 0%, rgba(120,90,40,0.2) 45%, transparent 75%)",
                  filter: "blur(1.5px)",
                }}
              />
            ))}

            {/* success stamp — greys the screen and slams down a rubber-stamp
                style confirmation once WAND finishes the task correctly */}
            <AnimatePresence>
              {cart === "crystal" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center"
                  style={{ background: "rgba(10,10,10,0.4)" }}
                >
                  <motion.div
                    initial={{ scale: 2.4, opacity: 0, rotate: -10 }}
                    animate={{ scale: 1, opacity: 1, rotate: -10 }}
                    transition={{ delay: 0.35, type: "spring", stiffness: 320, damping: 14 }}
                    className="rounded-lg border-4 px-5 py-3 text-center font-mono uppercase leading-tight"
                    style={{
                      borderColor: "var(--geek-accent)",
                      color: "var(--geek-accent)",
                      background: "rgba(255,255,255,0.92)",
                    }}
                  >
                    <span className="block text-lg font-bold tracking-wide">
                      challenge complete!
                    </span>
                    <span className="block text-[10px] tracking-[0.14em] opacity-70">
                      (with WAND)
                    </span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {cart && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 380, damping: 22 }}
                className="relative flex items-center gap-3 overflow-hidden rounded-lg border p-3 font-mono text-xs"
                style={{
                  borderColor: cart === "crystal" ? "var(--geek-accent)" : "var(--geek-line)",
                  background: cart === "crystal" ? "color-mix(in srgb, var(--geek-accent) 10%, transparent)" : undefined,
                  color: cart === "crystal" ? "var(--geek-accent)" : undefined,
                }}
              >
                {cart === "crystal" && (
                  <motion.span
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.4, 0] }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    style={{ background: "var(--geek-accent)" }}
                  />
                )}
                {cart === "crystal" && (
                  <motion.span
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 12, delay: 0.15 }}
                    className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm text-white"
                    style={{ background: "var(--geek-accent)" }}
                  >
                    ✓
                  </motion.span>
                )}
                <span className="relative">
                  {wandOn ? (
                    <>hands-free — a voice-first agent shopped correctly while your hands stayed free.</>
                  ) : (
                    <>❌ grabbed {CART_LABEL[cart]} instead of the crystal shoes. greasy fingers strike again.</>
                  )}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {dirty && (cart || retryCount >= 2) && (
              <motion.button
                initial={{ opacity: 0, y: -6, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  boxShadow: [
                    "0 0 0 0px color-mix(in srgb, var(--geek-accent) 40%, transparent)",
                    "0 0 0 8px color-mix(in srgb, var(--geek-accent) 0%, transparent)",
                  ],
                }}
                transition={{ boxShadow: { duration: 1.4, repeat: Infinity }, default: { duration: 0.3 } }}
                onClick={() => {
                  setWandOn(true);
                  start(true);
                }}
                className="self-center rounded-full px-5 py-2.5 font-mono text-sm font-semibold text-white"
                style={{ background: "var(--geek-accent)" }}
              >
                Try WAND →
              </motion.button>
            )}
          </AnimatePresence>

          <button
            onClick={reset}
            className="self-start font-mono text-xs underline opacity-60 hover:opacity-100"
          >
            reset
          </button>
        </>
      )}
    </div>
  );
}
