// The motion runtime: loaded on idle by <MotionRuntime/>, never part of the first paint.
// One RAF (GSAP's ticker drives Lenis), ScrollTrigger in sync, and every scene written once
// with desktop, mobile and reduced-motion branches (gsap.matchMedia). Sections stay server
// components; scenes find them by data attributes.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import Lenis from "lenis";
import { setLenis } from "./scroll";

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
CustomEase.create("pass", "0.65,0.05,0.36,1");
CustomEase.create("set", "0.2,0.9,0.1,1");
CustomEase.create("exit", "0.4,0,1,1");

const NOTCH_SLOPE = 0.617; // the R's notch, dx/dy
const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => gsap.utils.toArray<T>(root.querySelectorAll(sel));
const inView = (el: Element) => {
  const r = el.getBoundingClientRect();
  return r.top < window.innerHeight && r.bottom > 0;
};

export function startRuntime() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const undo: (() => void)[] = [];

  ScrollTrigger.config({ ignoreMobileResize: true });

  // ── one RAF: Lenis smooths the wheel; touch keeps native momentum (syncTouch off)
  if (!reduce) {
    const lenis = new Lenis({ autoRaf: false, lerp: 0.1, syncTouch: false, anchors: false });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    setLenis(lenis);
    if (document.documentElement.classList.contains("is-locked")) lenis.stop();
    undo.push(() => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
    });
  }

  const mm = gsap.matchMedia();
  mm.add(
    { desktop: "(min-width: 1024px)", mobile: "(max-width: 1023px)", reduce: "(prefers-reduced-motion: reduce)" },
    (ctx) => {
      const { desktop, reduce: rm } = ctx.conditions as { desktop: boolean; mobile: boolean; reduce: boolean };
      const stopReveals = reveals(rm);
      if (rm) return stopReveals;
      heroScroll(desktop);
      processScene(desktop);
      drift(desktop);
      finalPass();
      pinDrop();
      return stopReveals;
    },
  );
  undo.push(() => mm.revert());

  if (fine && !reduce) undo.push(magnetic());
  if (!CSS.supports("animation-timeline: scroll()")) undo.push(progressFallback());

  // keep trigger positions honest: fonts, late images, accordions
  let t = 0;
  const refresh = () => {
    window.clearTimeout(t);
    t = window.setTimeout(() => ScrollTrigger.refresh(), 140);
  };
  window.addEventListener("pir:layout", refresh);
  window.addEventListener("load", refresh);
  document.fonts?.ready.then(refresh);
  undo.push(() => {
    window.removeEventListener("pir:layout", refresh);
    window.removeEventListener("load", refresh);
  });

  return () => undo.reverse().forEach((f) => f());
}

// ───────────────────────── reveals (each kind has its own entrance) ─────────────────────────
// One-shot entrances fire from an IntersectionObserver, not ScrollTrigger positions: they
// play whenever the element really enters the viewport, however the layout moved after
// setup (images, accordions, fonts), so nothing can stay hidden.
function reveals(rm: boolean) {
  const observers: IntersectionObserver[] = [];
  const onEnter = (el: Element, play: () => void, margin = "0px 0px -10% 0px") => {
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          play();
        }
      },
      { rootMargin: margin },
    );
    io.observe(el);
    observers.push(io);
  };
  // reduced motion: a plain fade, nothing moves
  const fadeOnly = (el: Element) => {
    gsap.set(el, { opacity: 0 });
    onEnter(el, () => gsap.to(el, { opacity: 1, duration: 0.5, ease: "none" }));
  };

  // headings: masked lines rise (SplitText), the slash marker strikes
  $('[data-reveal="lines"]').forEach((el) => {
    if (inView(el)) return;
    if (rm) return fadeOnly(el);
    let played = false;
    let lines: Element[] = [];
    SplitText.create(el, {
      type: "lines",
      mask: "lines",
      autoSplit: true,
      aria: "auto",
      onSplit(self) {
        lines = self.lines;
        if (!played) gsap.set(lines, { yPercent: 110 });
      },
    });
    const marks = $("[data-reveal-marker] i", el);
    if (marks.length) gsap.set(marks, { scaleY: 0, transformOrigin: "50% 0%" });
    onEnter(el, () => {
      played = true;
      gsap.to(lines, { yPercent: 0, duration: 0.9, ease: "set", stagger: 0.07 });
      if (marks.length) gsap.to(marks, { scaleY: 1, duration: 0.32, ease: "set", stagger: 0.07, delay: 0.25 });
    });
  });

  // copy and small blocks: a short rise
  $('[data-reveal="fade"]').forEach((el) => {
    if (inView(el)) return;
    if (rm) return fadeOnly(el);
    gsap.set(el, { opacity: 0, y: 26 });
    onEnter(el, () => gsap.to(el, { opacity: 1, y: 0, duration: 0.85, ease: "set" }));
  });

  // media frames open upward along their notched outline, then hand back to CSS
  $('[data-reveal="clip"]').forEach((el) => {
    if (inView(el)) return;
    if (rm) return fadeOnly(el);
    const w = el.offsetWidth, h = el.offsetHeight;
    const n = window.innerWidth >= 1024 ? 24 : 14;
    const closed = `polygon(0px ${h}px, ${w - n}px ${h}px, ${w}px ${h}px, ${w}px ${h}px, 0px ${h}px)`;
    const shape = `polygon(0px 0px, ${w - n}px 0px, ${w}px ${n / NOTCH_SLOPE}px, ${w}px ${h}px, 0px ${h}px)`;
    gsap.set(el, { clipPath: closed });
    onEnter(el, () => gsap.to(el, { clipPath: shape, duration: 1.1, ease: "set", clearProps: "clipPath" }));
  });

  // the Why plate: rows print in, left to right, like a label printer
  $('[data-reveal="plate"]').forEach((plate) => {
    if (inView(plate)) return;
    if (rm) return fadeOnly(plate);
    const rows = $("[data-plate-row]", plate);
    gsap.set(plate, { opacity: 0, y: 30 });
    gsap.set(rows, { clipPath: "inset(0% 100% 0% 0%)" });
    onEnter(plate, () => {
      gsap.to(plate, { opacity: 1, y: 0, duration: 0.8, ease: "set" });
      gsap.to(rows, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.75, ease: "pass", stagger: 0.09, delay: 0.2, clearProps: "clipPath" });
    });
  });

  // rails (videos): cards rise from a bottom edge, staggered by importance
  $('[data-reveal="rail"]').forEach((rail) => {
    if (inView(rail)) return;
    if (rm) return fadeOnly(rail);
    const kids = Array.from(rail.children).filter((c) => (c as HTMLElement).offsetWidth > 2);
    gsap.set(kids, { y: 60, opacity: 0 });
    onEnter(rail, () => gsap.to(kids, { y: 0, opacity: 1, duration: 0.9, ease: "set", stagger: (i) => i * 0.06 + (i ? 0.05 : 0) }));
  });

  // the offer strip's slashes strike
  const cuts = $('[data-reveal="cut"] i');
  if (cuts.length && !rm && !inView(cuts[0])) {
    gsap.set(cuts, { scaleY: 0, transformOrigin: "50% 0%" });
    onEnter(cuts[0], () => gsap.to(cuts, { scaleY: 1, duration: 0.4, ease: "set", stagger: 0.08 }), "0px 0px -4% 0px");
  }

  return () => observers.forEach((io) => io.disconnect());
}

// ───────────────────────── hero: scroll parallax (the intro itself is CSS) ─────────────────────────
function heroScroll(desktop: boolean) {
  const hero = document.getElementById("top");
  const media = document.querySelector("[data-hero-media]");
  const content = document.querySelector("[data-hero-content]");
  if (!hero || !media || !content) return;
  const st = { trigger: hero, start: "top top", end: "bottom top", scrub: true } as const;
  gsap.to(media, { yPercent: desktop ? 9 : 5, scale: desktop ? 1.06 : 1.03, ease: "none", scrollTrigger: st });
  gsap.to(content, { yPercent: desktop ? -16 : -8, opacity: 0.25, ease: "none", scrollTrigger: st });
}

// ───────────────────────── process: seven passes, pinned and scrubbed ─────────────────────────
function processScene(desktop: boolean) {
  const sec = document.querySelector<HTMLElement>('[data-scene="process"]');
  const stage = sec?.querySelector("svg.process-stage");
  const pin = sec?.querySelector<HTMLElement>(".process-pin");
  if (!sec || !stage || !pin) return;

  sec.dataset.pinned = "true";
  const q = (p: string) => stage.querySelectorAll(`[data-p="${p}"]`);
  const steps = $("[data-step]", sec);
  const ticks = $("[data-tick] b", sec);
  const odo = sec.querySelector('[data-p="odo"]');

  // rewind the finished panel to "as it came in"
  gsap.set(q("jagged"), { opacity: 1 });
  gsap.set(q("polish-mask"), { x: -490 });
  gsap.set(q("newcoat"), { scaleX: 0, transformOrigin: "0% 50%" });
  gsap.set(q("film"), { x: -490 });
  gsap.set(q("reflect"), { scaleX: 0, opacity: 0, transformOrigin: "0% 50%" });
  gsap.set(q("stamp"), { opacity: 0, scale: 0.8, transformOrigin: "50% 50%" });
  gsap.set(q("markers"), { opacity: 1 });
  gsap.set(q("marker"), { scale: 0, transformOrigin: "50% 50%" });
  gsap.set(q("dust"), { opacity: 1 });
  gsap.set(q("polisher"), { opacity: 0, x: 40 });
  gsap.set(q("tape"), { opacity: 0, y: -50 });
  gsap.set(q("heat"), { opacity: 0 });
  gsap.set(steps, { autoAlpha: 0, y: 24 });
  gsap.set(steps[0], { autoAlpha: 1, y: 0 });
  gsap.set(ticks, { scaleY: 0, transformOrigin: "50% 100%" });
  gsap.set(ticks[0], { scaleY: 1 });

  const tl = gsap.timeline({
    defaults: { ease: "set", duration: 0.35 },
    scrollTrigger: {
      trigger: pin,
      start: "top top",
      end: () => `+=${window.innerHeight * (desktop ? 4.6 : 3.6)}`,
      pin: true,
      scrub: 0.6,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  const toStep = (k: number) => {
    const at = k - 0.4;
    tl.to(steps[k - 1], { autoAlpha: 0, y: -24, duration: 0.3 }, at)
      .fromTo(steps[k], { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.35 }, at + 0.08)
      .to(odo, { y: `-${k}em`, duration: 0.4, ease: "pass" }, at)
      .to(ticks[k], { scaleY: 1, duration: 0.3 }, at + 0.1);
  };

  // 1 inspection: defects get circled
  tl.to(q("marker"), { scale: 1, duration: 0.3, stagger: 0.08, ease: "back.out(1.6)" }, 0.05);
  // 2 wash & decon: specks lift away
  toStep(1);
  tl.to(stage.querySelectorAll('[data-p="speck"]'), { y: -36, opacity: 0, duration: 0.4, stagger: 0.02, ease: "exit" }, 0.75);
  // 3 correction: the polisher passes; scratches and swirls are gone behind it
  toStep(2);
  tl.to(q("polisher"), { opacity: 1, duration: 0.15 }, 1.6)
    .fromTo(q("polisher"), { x: 40 }, { x: 520, duration: 0.8, ease: "pass" }, 1.62)
    .to(q("polish-mask"), { x: 0, duration: 0.8, ease: "pass" }, 1.62)
    .to(q("jagged"), { opacity: 0, duration: 0.2 }, 2.3)
    .to(q("markers"), { opacity: 0, duration: 0.25 }, 2.2)
    .to(q("polisher"), { opacity: 0, duration: 0.15 }, 2.42);
  // 4 prep: tape goes on
  toStep(3);
  tl.to(q("tape"), { opacity: 1, y: 0, duration: 0.35, stagger: 0.06 }, 2.75);
  // 5 the finish: one pass of fresh paint, then the film
  toStep(4);
  tl.to(q("newcoat"), { scaleX: 1, duration: 0.6, ease: "pass" }, 3.65).to(q("film"), { x: 0, duration: 0.5, ease: "pass" }, 4.2);
  // 6 cure: heat runs through the layers, then settles
  toStep(5);
  tl.to(q("heat"), { opacity: 0.75, duration: 0.35 }, 4.7).to(q("heat"), { opacity: 0.12, duration: 0.45 }, 5.1);
  // 7 QC: tape off, a straight reflection, the pass
  toStep(6);
  tl.to(q("tape"), { opacity: 0, y: -50, duration: 0.3 }, 5.65)
    .to(q("heat"), { opacity: 0, duration: 0.3 }, 5.65)
    .to(q("reflect"), { scaleX: 1, opacity: 1, duration: 0.5, ease: "pass" }, 5.75)
    .to(q("stamp"), { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.8)" }, 6.15)
    .to({}, { duration: 0.6 }, 6.5); // hold the finished panel before the pin releases
}

// ───────────────────────── work columns, why image: gentle drift (desktop) ─────────────────────────
function drift(desktop: boolean) {
  if (!desktop) return;
  $("[data-drift]").forEach((col) => {
    const d = Number(col.dataset.drift) || 0;
    gsap.fromTo(col, { y: -d }, { y: d, ease: "none", scrollTrigger: { trigger: col.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
  });
  $("[data-parallax]").forEach((el) => {
    const p = Number(el.dataset.parallax) || 6;
    const img = el.querySelector("img");
    if (img) gsap.fromTo(img, { yPercent: -p, scale: 1.12 }, { yPercent: p, scale: 1.12, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
  });
}

// ───────────────────────── footer: the final coat (scrubbed pass over the wordmark) ─────────────────────────
function finalPass() {
  const wrap = document.querySelector<HTMLElement>("[data-final-pass]");
  const chrome = wrap?.querySelector("[data-chrome]");
  if (!wrap || !chrome) return;
  const k = (0.596 * wrap.offsetHeight * 100) / Math.max(1, wrap.offsetWidth); // slash lean as % of width
  gsap.fromTo(
    chrome,
    { clipPath: `polygon(0% 0%, ${-k}% 0%, 0% 100%, 0% 100%)` },
    { clipPath: `polygon(0% 0%, 100% 0%, ${100 + k}% 100%, 0% 100%)`, ease: "none", scrollTrigger: { trigger: wrap, start: "top 96%", end: "max", scrub: 0.6 } },
  );
}

// ───────────────────────── visit: the pin drops in ─────────────────────────
function pinDrop() {
  const pin = document.querySelector("[data-pin] .map-pin-body");
  if (!pin || inView(pin)) return;
  gsap.from(pin, { y: -36, opacity: 0, duration: 0.7, ease: "set", scrollTrigger: { trigger: pin, start: "top 80%", once: true } });
}

// ───────────────────────── magnetic CTAs (fine pointers only) ─────────────────────────
function magnetic() {
  const offs: (() => void)[] = [];
  $("[data-magnetic]").forEach((el) => {
    const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      xTo(gsap.utils.clamp(-10, 10, dx * 0.22));
      yTo(gsap.utils.clamp(-8, 8, dy * 0.3));
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    offs.push(() => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      gsap.set(el, { clearProps: "transform" });
    });
  });
  return () => offs.forEach((f) => f());
}

// ───────────────────────── progress line fallback (no scroll-driven animations) ─────────────────────────
function progressFallback() {
  const bar = document.querySelector(".progress");
  if (!bar) return () => {};
  const st = ScrollTrigger.create({ start: 0, end: "max", onUpdate: (self) => gsap.set(bar, { scaleX: self.progress }) });
  return () => st.kill();
}
