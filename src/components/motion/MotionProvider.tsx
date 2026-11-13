"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { SPRING } from "@/lib/motion";

type Features = Awaited<typeof import("./motion-features")>["default"];
let features: Promise<Features> | null = null;
let markReady: (f: Features) => void = () => {};
// Settles on the first successful download, whichever caller triggered it.
const ready = new Promise<Features>((resolve) => (markReady = resolve));

/** Starts (or reuses) the download of Motion's layout/drag features. Safe to call often.
 *  A failed download (patchy network) is forgotten, so the next call tries again. */
export function loadMotionFeatures() {
  features ??= import("./motion-features").then(
    (m) => {
      markReady(m.default);
      return m.default;
    },
    (error: unknown) => {
      features = null;
      throw error;
    },
  );
  return features;
}

// Keeps trying in the background after a failure; a tap on the menu also retries straight away.
function fetchFeatures(attempt = 0) {
  loadMotionFeatures().catch(() => {
    if (attempt < 4) window.setTimeout(() => fetchFeatures(attempt + 1), 1500 * (attempt + 1));
  });
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

// LazyMotion asks for its features once, so it gets the promise of the first success rather
// than one download that might fail.
const loadFeatures = () => {
  void firstInteraction().then(() => fetchFeatures());
  return ready;
};

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
