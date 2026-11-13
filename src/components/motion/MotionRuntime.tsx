"use client";

import { useEffect } from "react";

// Loads GSAP, ScrollTrigger, SplitText and Lenis in one chunk on the visitor's first
// interaction (scroll, wheel, touch, pointer or key), or after a quiet fallback delay.
// The first viewport needs none of it (the hero animates in CSS), so this keeps the main
// thread free while the page becomes interactive.
const EVENTS = ["scroll", "wheel", "touchstart", "pointerdown", "pointermove", "keydown"] as const;
const FALLBACK_MS = 7000;

export function MotionRuntime() {
  useEffect(() => {
    let started = false;
    let cancelled = false;
    let stop: (() => void) | undefined;
    let timer = 0;
    const start = () => {
      if (started) return;
      started = true;
      detach();
      import("@/lib/runtime").then(
        (m) => {
          if (!cancelled) stop = m.startRuntime();
        },
        () => {
          // Download failed (patchy network). The page works without motion; try again
          // on a later interaction, at most every few seconds.
          if (cancelled) return;
          started = false;
          timer = window.setTimeout(attach, 3000);
        },
      );
    };
    const attach = () => EVENTS.forEach((e) => window.addEventListener(e, start, { passive: true, once: true }));
    const detach = () => {
      EVENTS.forEach((e) => window.removeEventListener(e, start));
      window.clearTimeout(timer);
    };
    attach();
    timer = window.setTimeout(start, FALLBACK_MS);
    // a visitor who arrives mid-page (back/forward, anchor) needs scenes right away
    if (window.scrollY > 40) start();
    return () => {
      cancelled = true;
      detach();
      stop?.();
    };
  }, []);
  return null;
}
