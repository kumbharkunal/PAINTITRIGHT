"use client";

import { AnimatePresence, LayoutGroup, m } from "motion/react";
import { useId, useState } from "react";
import { SPRING } from "@/lib/motion";

const layoutChanged = () => window.dispatchEvent(new Event("pir:layout"));

// Accordion: the answer reveals with clip-path, the questions below glide on transforms
// (Motion layout), so nothing animates height.
export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<ReadonlySet<number>>(() => new Set([0]));
  const base = useId();
  const toggle = (i: number) =>
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });

  return (
    <LayoutGroup>
      <ul className="border-t border-line" data-reveal="fade">
        {items.map((it, i) => {
          const isOpen = open.has(i);
          const qid = `${base}-q-${i}`;
          const aid = `${base}-a-${i}`;
          return (
            <m.li key={it.q} layout="position" transition={SPRING} className="border-b border-line" onLayoutAnimationComplete={layoutChanged}>
              <h3>
                <button id={qid} type="button" className="faq-q" aria-expanded={isOpen} aria-controls={aid} onClick={() => toggle(i)}>
                  <span className="text-title font-semibold">{it.q}</span>
                  <span className="faq-icon" aria-hidden="true" />
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {isOpen ? (
                  <m.div
                    key="a"
                    id={aid}
                    role="region"
                    aria-labelledby={qid}
                    initial={{ opacity: 0, clipPath: "inset(0% 0% 100% 0%)" }}
                    animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
                    exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  >
                    <p className="steel max-w-2xl pb-7 pr-10">{it.a}</p>
                  </m.div>
                ) : null}
              </AnimatePresence>
            </m.li>
          );
        })}
      </ul>
    </LayoutGroup>
  );
}
