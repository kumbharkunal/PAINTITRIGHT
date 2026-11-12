"use client";

import { useEffect } from "react";

// Loads GSAP, ScrollTrigger, SplitText and Lenis in one chunk once the browser is idle,
// so none of it competes with the first paint (the hero animates in CSS).
export function MotionRuntime() {
  useEffect(() => {
    let cancelled = false;
    let stop: (() => void) | undefined;
    const run = () =>
      import("@/lib/runtime").then((m) => {
        if (!cancelled) stop = m.startRuntime();
      });
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    const id = w.requestIdleCallback ? w.requestIdleCallback(run, { timeout: 1500 }) : window.setTimeout(run, 400);
    return () => {
      cancelled = true;
      if (w.cancelIdleCallback) w.cancelIdleCallback(id);
      else window.clearTimeout(id);
      stop?.();
    };
  }, []);
  return null;
}
