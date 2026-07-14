"use client";

import Link from "next/link";
import { SweepProvider } from "@/lib/sweep-context";
import RobotSweepOverlay from "@/components/shared/RobotSweepOverlay";
import GeekViewVertical from "@/components/geek/GeekViewVertical";

export default function GeekVerticalTestPage() {
  return (
    <SweepProvider>
      <div
        className="min-h-screen"
        style={{ background: "var(--geek-bg)", color: "var(--geek-fg)" }}
      >
        <div className="mx-auto flex max-w-3xl flex-col gap-10 px-5 py-10 sm:px-8 sm:py-14">
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm opacity-70">fuyuan_li.io</span>
            <Link
              href="/"
              className="font-mono text-xs opacity-50 underline underline-offset-2 hover:opacity-100"
            >
              ← back to live site
            </Link>
          </div>
          <GeekViewVertical />
        </div>
      </div>
      <RobotSweepOverlay />
    </SweepProvider>
  );
}
