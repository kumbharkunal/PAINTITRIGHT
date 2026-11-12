"use client";

import Image, { type StaticImageData } from "next/image";
import { useCallback, useEffect, useRef, type KeyboardEvent } from "react";

// Before/after with a divider leaning at the logo's slash angle. Drag anywhere (mouse or
// touch; vertical swipes still scroll), or use the keyboard on the handle. Position lives in
// a CSS variable, so dragging never re-renders React.
export function CompareSlider({ before, after, tag }: { before: StaticImageData; after: StaticImageData; tag?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const handle = useRef<HTMLDivElement>(null);
  const value = useRef(50);
  const touched = useRef(false);
  const raf = useRef(0);

  const paint = useCallback((v: number) => {
    const clamped = Math.min(100, Math.max(0, v));
    value.current = clamped;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      box.current?.style.setProperty("--v", clamped.toFixed(2));
      const h = handle.current;
      if (h) {
        h.setAttribute("aria-valuenow", String(Math.round(clamped)));
        h.setAttribute("aria-valuetext", `${Math.round(100 - clamped)}% after, ${Math.round(clamped)}% before`);
      }
    });
  }, []);

  // value from a pointer: the divider's centre crosses the frame over the 0..100 range
  const fromPointer = useCallback((clientX: number) => {
    const el = box.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (clientX - r.left) / r.width; // 0..1 across the frame
    paint(((x * 100 + 29.8) / 159.6) * 100);
  }, [paint]);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let dragging = false;
    let startX = 0, startY = 0, decided = false;
    const down = (e: PointerEvent) => {
      if (e.button !== 0) return;
      dragging = true; decided = e.pointerType === "mouse"; touched.current = true;
      startX = e.clientX; startY = e.clientY;
      if (decided) { el.setPointerCapture(e.pointerId); fromPointer(e.clientX); }
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      if (!decided) {
        // touch: commit to a horizontal drag only if the finger moves sideways first
        const dx = Math.abs(e.clientX - startX), dy = Math.abs(e.clientY - startY);
        if (dx < 6 && dy < 6) return;
        if (dy > dx) { dragging = false; return; }
        decided = true; el.setPointerCapture(e.pointerId);
      }
      fromPointer(e.clientX);
    };
    const up = (e: PointerEvent) => { dragging = false; if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId); };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, [fromPointer]);

  // one demo pass the first time it scrolls into view: 100 → 50
  useEffect(() => {
    const el = box.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    paint(100);
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      if (touched.current) return;
      const t0 = performance.now(), from = 100, to = 50, dur = 900;
      const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
      const step = (now: number) => {
        if (touched.current) return;
        const t = Math.min(1, (now - t0) / dur);
        paint(from + (to - from) * ease(t));
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, [paint]);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const big = e.shiftKey ? 10 : 5;
    const map: Record<string, number> = { ArrowLeft: -big, ArrowDown: -big, ArrowRight: big, ArrowUp: big, PageDown: -25, PageUp: 25 };
    if (e.key in map) { e.preventDefault(); touched.current = true; paint(value.current + map[e.key]); }
    else if (e.key === "Home") { e.preventDefault(); touched.current = true; paint(0); }
    else if (e.key === "End") { e.preventDefault(); touched.current = true; paint(100); }
  };

  return (
    <div ref={box} className="compare notch" data-cursor="Drag" data-reveal="clip">
      <Image src={after} alt="After: the same panel, polished to a deep, clear gloss" fill sizes="(min-width: 1024px) 55vw, 100vw" quality={72} placeholder="blur" />
      <div className="compare-before">
        <Image src={before} alt="Before: the panel with swirl marks, scratches and dull patches" fill sizes="(min-width: 1024px) 55vw, 100vw" quality={72} placeholder="blur" />
      </div>
      <div className="compare-line" aria-hidden="true" />
      <span className="compare-tag glass label left-4">Before</span>
      <span className="compare-tag glass label right-4">After</span>
      {tag ? <span className="label steel absolute bottom-3 right-4 opacity-80">{tag}</span> : null}
      <div
        ref={handle}
        className="compare-handle glass"
        role="slider"
        tabIndex={0}
        aria-label="Before and after comparison"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={50}
        aria-valuetext="50% after, 50% before"
        onKeyDown={onKey}
      >
        <span className="nav-dot scale-150" aria-hidden="true">
          <i />
          <i />
        </span>
      </div>
    </div>
  );
}
