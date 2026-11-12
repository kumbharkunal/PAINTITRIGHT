// Motion tokens shared by CSS (globals.css mirrors these), GSAP and Motion.
// Fast, interruptible, no bounce. See DESIGN.md › Motion.

export const DUR = {
  press: 0.12,
  hover: 0.18,
  ui: 0.24,
  reveal: 0.8,
  pass: 1.0,
  swap: 0.7,
} as const;

// cubic-bezier control points
export const EASE = {
  pass: [0.65, 0.05, 0.36, 1] as const,
  set: [0.2, 0.9, 0.1, 1] as const,
  exit: [0.4, 0, 1, 1] as const,
};

// Motion transitions
export const SPRING = { type: "spring", visualDuration: 0.42, bounce: 0 } as const;
export const SPRING_FAST = { type: "spring", visualDuration: 0.28, bounce: 0 } as const;

// the logo's slash lean (DESIGN.md › The slash system)
export const SLASH_DEG = 30.75;
export const SLASH_TAN = 0.596;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
