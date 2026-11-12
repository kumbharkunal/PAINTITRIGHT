// A tiny shared handle on the page's scroller. The Lenis instance arrives later (the motion
// runtime loads on idle); until then, and always under reduced motion, native scrolling is used.
import type Lenis from "lenis";
import { prefersReducedMotion } from "./motion";

let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

/** Offset for in-page jumps: the floating nav plus breathing room. */
export function navOffset() {
  if (typeof window === "undefined") return 0;
  return window.matchMedia("(min-width: 1024px)").matches ? 96 : 80;
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const offset = -navOffset();
  if (lenis && !prefersReducedMotion()) {
    lenis.scrollTo(el, { offset, duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 4) });
  } else {
    const y = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top: y, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }
  // move focus for keyboard and screen-reader users without a second scroll
  const heading = el.querySelector<HTMLElement>("h2, h1");
  if (heading) {
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
  }
}

/** Stop/start page scrolling (mobile menu). Idempotent. */
export function lockScroll(locked: boolean) {
  const root = document.documentElement;
  if (locked) {
    lenis?.stop();
    root.classList.add("is-locked");
  } else {
    root.classList.remove("is-locked");
    lenis?.start();
  }
}
