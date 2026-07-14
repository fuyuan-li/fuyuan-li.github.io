"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ProjectCard from "@/components/shared/ProjectCard";
import SketchIcon from "@/components/shared/SketchIcon";
import type { CoverItem } from "./ProjectCoverFlow";

export default function ProjectCoverFlowVertical({ items }: { items: CoverItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id} className="flex flex-col">
            <button
              type="button"
              onClick={() => setOpenId((o) => (o === item.id ? null : item.id))}
              className="flex items-center gap-4 rounded-2xl border p-4 text-left sm:p-5"
              style={{
                borderColor: "var(--geek-line)",
                background: isOpen
                  ? `linear-gradient(120deg, ${item.accent}18, var(--geek-bg-raised))`
                  : "var(--geek-bg-raised)",
                borderLeft: `4px solid ${item.accent}`,
              }}
            >
              <SketchIcon kind={item.sketch} color={item.accent} className="h-10 w-10 shrink-0" />
              <div className="flex min-w-0 flex-col">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-50">
                  {item.eyebrow}
                </span>
                <span className="font-mono text-lg font-semibold">{item.title}</span>
              </div>
              <span
                className="ml-auto shrink-0 font-mono text-xs"
                style={{ color: item.accent }}
              >
                {isOpen ? "close ▲" : "open ▾"}
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  style={{ overflow: "hidden" }}
                >
                  <div className="pt-3">
                    <ProjectCard
                      icon={item.icon}
                      eyebrow={item.eyebrow}
                      title={item.title}
                      tagline={item.tagline}
                      highlights={item.highlights}
                      theme="geek"
                      accent={item.accent}
                    >
                      {item.demo}
                    </ProjectCard>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
