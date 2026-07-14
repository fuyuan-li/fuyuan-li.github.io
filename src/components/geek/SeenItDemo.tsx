"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SERIF = 'Georgia, "Times New Roman", serif';

// seconds into our stitched clip
const BREAD_MOMENT = 10;
const MIX_MOMENT = 67;

type Bubble = { from: "user" | "agent"; text: string } | null;

type Product = {
  id: string;
  name: string;
  price: string;
  img: string;
};

const WAVE_1: Product[] = [
  { id: "knife", name: "Mercer Culinary M23210 Millennia", price: "$16.15", img: "/seenit/knife.jpg" },
  { id: "board", name: "Amazon Basics Wooden Chopping Boards, 3-pc", price: "$22.40", img: "/seenit/board.jpg" },
  { id: "cake", name: "Wagokoroll Castella Roll Cake, Strawberry", price: "$19.99", img: "/seenit/cake.jpg" },
];

const WAVE_2: Product[] = [
  { id: "quinoa", name: "365 by Whole Foods Market, Organic White Quinoa", price: "$4.69", img: "/seenit/quinoa.jpg" },
  { id: "lunchbox", name: "Wooden Lunch Box for Kids/Adult, Japanese", price: "$17.99", img: "/seenit/lunchbox.jpg" },
  { id: "bowl", name: "4.7 Qt Extra Large Mixing Bowl, Clear", price: "$25.99", img: "/seenit/bowl.jpg" },
];

export default function SeenItDemo() {
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  // tracks which moments have been jumped to, in the order the user asked —
  // recommendations for a moment appear only once that moment's jump has
  // happened, and earlier-requested moments' recs lead the list
  const [jumpOrder, setJumpOrder] = useState<("bread" | "mix")[]>([]);
  const [bubble, setBubble] = useState<Bubble>(null);
  const [busy, setBusy] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timers = useRef<number[]>([]);

  const after = (ms: number, fn: () => void) => {
    const t = window.setTimeout(fn, ms);
    timers.current.push(t);
  };

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const say = (from: "user" | "agent", text: string, onSettled?: () => void) => {
    setBubble({ from, text: "" });
    // the "speaking" moment — mic rises, then the transcript settles
    after(650, () => {
      setBubble({ from, text });
      onSettled?.();
    });
  };

  const runAction = (fn: () => void) => {
    if (busy) return;
    setBusy(true);
    fn();
  };

  const start = () => {
    setStarted(true);
    videoRef.current?.play().catch(() => {});
    setPlaying(true);
  };

  const askPause = () =>
    runAction(() => {
      say("user", "Can you pause the video?", () => {
        after(500, () => {
          videoRef.current?.pause();
          setPlaying(false);
          setBubble({ from: "agent", text: "Sure thing, I've paused it for you." });
          setBusy(false);
        });
      });
    });

  const askResume = () =>
    runAction(() => {
      say("user", "Can you resume?", () => {
        after(500, () => {
          videoRef.current?.play().catch(() => {});
          setPlaying(true);
          setBubble({ from: "agent", text: "Playing it again." });
          setBusy(false);
        });
      });
    });

  const askJumpBread = () =>
    runAction(() => {
      say("user", "Can you jump to the moment she cuts the bread?", () => {
        after(500, () => {
          const v = videoRef.current;
          if (v) {
            v.currentTime = BREAD_MOMENT;
            v.play().catch(() => {});
          }
          setPlaying(true);
          setJumpOrder((o) => (o.includes("bread") ? o : [...o, "bread"]));
          setBubble({ from: "agent", text: "Done! Let me know when you're ready to play it again." });
          setBusy(false);
        });
      });
    });

  const askJumpMix = () =>
    runAction(() => {
      say("user", "And can you jump to the moment she mixes the rice and canola?", () => {
        after(500, () => {
          const v = videoRef.current;
          if (v) {
            v.currentTime = MIX_MOMENT;
            v.play().catch(() => {});
          }
          setPlaying(true);
          setJumpOrder((o) => (o.includes("mix") ? o : [...o, "mix"]));
          setBubble({ from: "agent", text: "Got it, jumped to that part for you." });
          setBusy(false);
        });
      });
    });

  const reset = () => {
    clearTimers();
    setStarted(false);
    setPlaying(false);
    setJumpOrder([]);
    setBubble(null);
    setBusy(false);
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      v.pause();
    }
  };

  const products = jumpOrder.flatMap((k) => (k === "bread" ? WAVE_1 : WAVE_2));

  return (
    <div
      className="flex flex-col gap-4 rounded-xl p-4"
      style={{
        background:
          "radial-gradient(circle at 12% 8%, rgba(240,188,134,0.16), transparent 40%), radial-gradient(circle at 90% 95%, rgba(95,168,163,0.18), transparent 38%), linear-gradient(160deg, #16130f 0%, #1c1712 55%, #0f1614 100%)",
      }}
    >
      {/* fake YouTube chrome */}
      <div className="flex items-center gap-2">
        <span
          className="h-6 w-6 shrink-0 rounded-full"
          style={{ background: "linear-gradient(135deg,#dd8c67,#5fa8a3)" }}
        />
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold" style={{ fontFamily: SERIF, color: "#f2eadf" }}>
            6am mornings routines in korea&apos;s countryside
          </p>
          <p className="text-[10px] opacity-50" style={{ color: "#cabfb1" }}>
            냥숲nyangsoop
          </p>
        </div>
      </div>

      {/* video */}
      <div className="relative overflow-hidden rounded-lg" style={{ border: "1px solid rgba(255,248,240,0.1)" }}>
        <video
          ref={videoRef}
          src="/seenit/screen.mp4"
          poster="/seenit/poster.jpg"
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
        />

        {!started && (
          <button
            onClick={start}
            className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors hover:bg-black/40"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full text-2xl" style={{ background: "rgba(255,255,255,0.9)" }}>
              ▶
            </span>
          </button>
        )}

        <AnimatePresence>
          {bubble && (
            <motion.div
              key={bubble.from + bubble.text}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-2 flex max-w-[80%] items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs leading-snug shadow"
              style={{
                fontFamily: SERIF,
                right: bubble.from === "user" ? 8 : undefined,
                left: bubble.from === "agent" ? 8 : undefined,
                background: bubble.from === "user" ? "rgba(240,188,134,0.9)" : "rgba(95,168,163,0.9)",
                color: "#17120d",
              }}
            >
              {bubble.text === "" ? (
                <motion.span
                  initial={{ scale: 0, y: 6, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  className="text-sm"
                >
                  🎤
                </motion.span>
              ) : (
                bubble.text
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* query chips */}
      {started && (
        <>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={askPause}
              disabled={!playing || busy}
              className="rounded-full px-3 py-1.5 text-xs font-semibold disabled:opacity-30"
              style={{ fontFamily: SERIF, background: "rgba(240,188,134,0.14)", color: "#f0d9c2", border: "1px solid rgba(240,188,134,0.2)" }}
            >
              🎤 &quot;Can you pause the video?&quot;
            </button>
            <button
              onClick={askResume}
              disabled={playing || busy}
              className="rounded-full px-3 py-1.5 text-xs font-semibold disabled:opacity-30"
              style={{ fontFamily: SERIF, background: "rgba(240,188,134,0.14)", color: "#f0d9c2", border: "1px solid rgba(240,188,134,0.2)" }}
            >
              🎤 &quot;Can you resume?&quot;
            </button>
            <button
              onClick={askJumpBread}
              disabled={busy}
              className="rounded-full px-3 py-1.5 text-xs font-semibold disabled:opacity-30"
              style={{ fontFamily: SERIF, background: "rgba(240,188,134,0.14)", color: "#f0d9c2", border: "1px solid rgba(240,188,134,0.2)" }}
            >
              🎤 &quot;...jump to where she cuts the bread?&quot;
            </button>
            <button
              onClick={askJumpMix}
              disabled={busy}
              className="rounded-full px-3 py-1.5 text-xs font-semibold disabled:opacity-30"
              style={{ fontFamily: SERIF, background: "rgba(240,188,134,0.14)", color: "#f0d9c2", border: "1px solid rgba(240,188,134,0.2)" }}
            >
              🎤 &quot;...jump to the rice and canola?&quot;
            </button>
          </div>
          <p className="text-[10px] italic opacity-40" style={{ fontFamily: SERIF, color: "#cabfb1" }}>
            the real thing listens to your actual voice — these buttons stand in for speech in this demo.
          </p>
        </>
      )}

      {/* recommendations — real products from the actual recording, appearing quietly */}
      <div>
        <p
          className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em]"
          style={{ fontFamily: SERIF, color: "#d6b898" }}
        >
          you may like {products.length > 0 && <span className="opacity-50">· {products.length} items</span>}
        </p>
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          <AnimatePresence>
            {products.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="w-28 shrink-0 rounded-lg p-2"
                style={{ background: "rgba(255,248,240,0.05)", border: "1px solid rgba(255,248,240,0.08)" }}
              >
                <div className="mb-1.5 h-16 w-full overflow-hidden rounded-md bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img} alt={p.name} className="h-full w-full object-cover" />
                </div>
                <p className="line-clamp-2 text-[10px] leading-tight" style={{ fontFamily: SERIF, color: "#f2eadf" }}>
                  {p.name}
                </p>
                <p className="mt-1 text-[11px] font-bold" style={{ color: "#f0bc86" }}>
                  {p.price}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
          {products.length === 0 && (
            <p className="py-4 text-[11px] italic opacity-40" style={{ fontFamily: SERIF, color: "#cabfb1" }}>
              jump to a moment and suggested products will quietly show up here — never a popup.
            </p>
          )}
        </div>
      </div>

      {started && (
        <button
          onClick={reset}
          className="self-start text-xs underline opacity-50 hover:opacity-90"
          style={{ fontFamily: SERIF, color: "#cabfb1" }}
        >
          reset
        </button>
      )}
    </div>
  );
}
