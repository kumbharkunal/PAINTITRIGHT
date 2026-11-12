"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { SPRING } from "@/lib/motion";

type Features = Awaited<typeof import("./motion-features")>["default"];
let features: Promise<Features> | null = null;

/** Starts (or reuses) the download of Motion's layout/drag features. Safe to call often. */
export function loadMotionFeatures() {
  features ??= import("./motion-features").then((m) => m.default);
  return features;
}

// The features only matter once someone interacts (menu, accordions, nav slot), so they
// load on the first interaction instead of competing with hydration. Controls that need
// them sooner (the menu button) call loadMotionFeatures() themselves.
const firstInteraction = () =>
  new Promise<void>((resolve) => {
    const events = ["scroll", "wheel", "touchstart", "pointerdown", "pointermove", "keydown"] as const;
    const done = () => {
      events.forEach((e) => window.removeEventListener(e, done));
      window.clearTimeout(t);
      resolve();
    };
    events.forEach((e) => window.addEventListener(e, done, { passive: true, once: true }));
    const t = window.setTimeout(done, 7000);
  });

const loadFeatures = () => firstInteraction().then(loadMotionFeatures);

// Motion drives UI state only (nav, menu, accordions) and follows the visitor's
// reduced-motion setting.
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user" transition={SPRING}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
