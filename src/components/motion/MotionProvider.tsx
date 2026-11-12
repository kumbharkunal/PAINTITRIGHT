"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { SPRING } from "@/lib/motion";

const loadFeatures = () => import("./motion-features").then((m) => m.default);

// Motion drives UI state only (nav, menu, accordions). Its feature bundle loads after
// hydration, and it follows the visitor's reduced-motion setting.
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user" transition={SPRING}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
