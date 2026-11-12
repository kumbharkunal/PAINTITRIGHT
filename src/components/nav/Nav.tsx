"use client";

import { AnimatePresence, m, type PanInfo } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { Call02Icon } from "@hugeicons/core-free-icons";
import { site, telLink, waLink } from "@/content/site";
import { LogoMark, Wordmark } from "@/components/brand/Logo";
import { Icon } from "@/components/ui/Icon";
import { SocialLogo, type Social } from "@/components/ui/SocialLogo";
import { lockScroll, scrollToId } from "@/lib/scroll";
import { loadMotionFeatures } from "@/components/motion/MotionProvider";
import { SPRING, SPRING_FAST } from "@/lib/motion";

const DESKTOP = site.nav.filter((n) => n.desktop);
const WATCH = ["top", ...site.nav.map((n) => n.id), "why", "proof"];
const PILL_H = 52;
// a wave, not a metronome: early links arrive close together, later ones ease off
const LINK_DELAY = [0, 0.028, 0.05, 0.068, 0.083, 0.095, 0.105, 0.114];
const SOCIALS = (["instagram", "youtube", "facebook"] as const).filter((s) => site.socials[s].url);

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function Nav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [compact, setCompact] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [sheetH, setSheetH] = useState(560);
  const [canDrag, setCanDrag] = useState(true);
  const navRef = useRef<HTMLElement>(null);
  const wmRef = useRef<HTMLSpanElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);
  const pointerIn = useRef(false);
  const returnFocus = useRef(true);
  const wasOpen = useRef(false);

  // which section is in the middle of the viewport
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    WATCH.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // compact after 80px; hide on a fast scroll down, return on any scroll up
  useEffect(() => {
    let lastY = window.scrollY;
    let lastT = performance.now();
    let queued = false;
    const tick = () => {
      queued = false;
      const y = window.scrollY;
      const t = performance.now();
      const dy = y - lastY;
      const v = dy / Math.max(1, t - lastT);
      lastY = y;
      lastT = t;
      setCompact(y > 80);
      if (dy < -2 || y < 240) setHidden(false);
      else if (v > 0.8 && y > 640 && !pointerIn.current && !navRef.current?.contains(document.activeElement)) setHidden(true);
    };
    const onScroll = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(tick);
      }
    };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // measure the wordmark (compaction distance) and the sheet (morph distance)
  useIsoLayoutEffect(() => {
    const measure = () => {
      if (wmRef.current) navRef.current?.style.setProperty("--wm-w", `${wmRef.current.offsetWidth + 10}px`);
      const s = sheetRef.current;
      if (s) {
        setSheetH(s.offsetHeight);
        setCanDrag(s.scrollHeight <= s.clientHeight + 1);
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (sheetRef.current) ro.observe(sheetRef.current);
    if (wmRef.current) ro.observe(wmRef.current);
    return () => ro.disconnect();
  }, []);

  const close = useCallback((restoreFocus: boolean) => {
    returnFocus.current = restoreFocus;
    setOpen(false);
  }, []);

  // lock + inert while open; restore without a jump
  useEffect(() => {
    const root = document.documentElement;
    const others = document.querySelectorAll<HTMLElement>("[data-inert-on-menu], .fab");
    if (open) {
      wasOpen.current = true;
      root.dataset.menu = "open";
      lockScroll(true);
      others.forEach((el) => (el.inert = true));
      const id = window.setTimeout(() => firstLink.current?.focus({ preventScroll: true }), 60);
      return () => window.clearTimeout(id);
    }
    if (!wasOpen.current) return; // nothing to undo on first mount
    wasOpen.current = false;
    delete root.dataset.menu;
    lockScroll(false);
    others.forEach((el) => (el.inert = false));
    if (returnFocus.current) btnRef.current?.focus({ preventScroll: true });
  }, [open]);

  // Escape, focus trap, and closing if the window grows to desktop
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close(true);
        btnRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const nodes = [btnRef.current, ...Array.from(sheetRef.current?.querySelectorAll<HTMLElement>("a[href], button") ?? [])].filter(Boolean) as HTMLElement[];
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const mq = window.matchMedia("(min-width: 1024px)");
    const onMq = () => mq.matches && close(false);
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open, close]);

  const go = (e: MouseEvent<HTMLAnchorElement>, id: string, fromSheet = false) => {
    e.preventDefault();
    if (fromSheet) {
      close(false);
      // after the lock releases (next frames), glide to the section
      requestAnimationFrame(() => requestAnimationFrame(() => scrollToId(id)));
    } else scrollToId(id);
    history.replaceState(null, "", `#${id}`);
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y < -56 || info.velocity.y < -420) close(true);
  };

  const indicator = hovered ?? (DESKTOP.some((l) => l.id === active) ? active : null);
  const closedClip = `inset(0px 0px ${Math.max(0, sheetH - PILL_H)}px 0px round 26px)`;
  const openClip = "inset(0px 0px 0px 0px round 28px)";

  return (
    <header
      ref={navRef}
      className="nav"
      data-hidden={hidden && !open}
      data-compact={compact && !open}
      style={{ "--wm-w": "124px" } as CSSProperties}
      onPointerEnter={() => (pointerIn.current = true)}
      onPointerLeave={() => (pointerIn.current = false)}
    >
      <div className="nav-pill w-full lg:w-auto">
        <m.span className="nav-bg glass" animate={{ opacity: open ? 0 : 1 }} transition={{ duration: open ? 0.12 : 0.24, delay: open ? 0.02 : 0.18 }} aria-hidden="true" />

        <a href="#top" onClick={(e) => go(e, "top")} className="nav-left nav-compactable flex h-11 items-center gap-2.5 rounded-full pl-3.5 pr-2 lg:pl-4" aria-label="Paint It Right, back to top">
          <LogoMark className="h-7 w-auto text-paper" />
          <span ref={wmRef} className="nav-wm nav-compactable inline-flex">
            <Wordmark className="h-[11px] w-auto text-paper lg:h-3" />
          </span>
        </a>

        {/* desktop links with a sliding slot (Motion layoutId) */}
        <nav aria-label="Primary" className="nav-right nav-compactable mx-3 hidden items-center lg:flex">
          <ul className="flex items-center">
            {DESKTOP.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  className="nav-link"
                  aria-current={active === l.id ? "true" : undefined}
                  onClick={(e) => go(e, l.id)}
                  onMouseEnter={() => setHovered(l.id)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(l.id)}
                  onBlur={() => setHovered(null)}
                >
                  {indicator === l.id ? <m.span layoutId="nav-slot" className="nav-slot" transition={SPRING} /> : null}
                  {active === l.id ? (
                    <span className="nav-dot" aria-hidden="true">
                      <i />
                      <i />
                    </span>
                  ) : null}
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav-right nav-compactable ml-auto hidden pr-1.5 lg:block">
          <span data-magnetic>
            <a href={waLink(site.wa.book)} target="_blank" rel="noopener noreferrer" className="btn btn-primary !min-h-11 !py-1 !pl-5 text-sm">
              <span>Book on WhatsApp</span>
              <span className="disc !h-8 !w-8" aria-hidden="true">
                <SocialLogo name="whatsapp" size={18} />
              </span>
            </a>
          </span>
        </div>

        <button
          ref={btnRef}
          type="button"
          className="menu-btn ml-auto mr-1 lg:hidden"
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onPointerDown={() => void loadMotionFeatures()}
          onClick={() => {
            if (open) close(true);
            else loadMotionFeatures().then(() => requestAnimationFrame(() => setOpen(true)));
          }}
        >
          <i />
          <i />
        </button>
      </div>

      {/* mobile sheet: grows out of the pill (clip-path inset), never scales the glass */}
      <AnimatePresence>
        {open ? (
          <m.div
            key="backdrop"
            className="sheet-backdrop lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.24 }}
            onClick={() => close(true)}
            aria-hidden="true"
          />
        ) : null}
      </AnimatePresence>
      <m.div
        ref={sheetRef}
        id="site-menu"
        className="sheet glass-dense lg:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        data-open={open}
        initial={false}
        style={{ visibility: "hidden", clipPath: closedClip }}
        animate={open ? { clipPath: openClip, visibility: "visible" } : { clipPath: closedClip, transitionEnd: { visibility: "hidden" } }}
        transition={SPRING}
        drag={open && canDrag ? "y" : false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.28, bottom: 0.04 }}
        dragSnapToOrigin
        onDragEnd={onDragEnd}
      >
        <div className="px-5 pb-6 pt-[72px]">
          <nav aria-label="Menu">
            <ul>
              {site.nav.map((l, i) => (
                <m.li
                  key={l.id}
                  initial={false}
                  animate={open ? { opacity: 1, y: 0, transition: { ...SPRING_FAST, delay: 0.06 + (LINK_DELAY[i] ?? 0.12) } } : { opacity: 0, y: 12, transition: { duration: 0.12 } }}
                >
                  <a ref={i === 0 ? firstLink : undefined} href={`#${l.id}`} onClick={(e) => go(e, l.id, true)} tabIndex={open ? 0 : -1} className="display flex min-h-[54px] items-center justify-between border-b border-line text-[1.75rem] tracking-tight">
                    <span>{l.label}</span>
                    {active === l.id ? (
                      <span className="nav-dot scale-125" aria-hidden="true">
                        <i />
                        <i />
                      </span>
                    ) : null}
                  </a>
                </m.li>
              ))}
            </ul>
          </nav>
          <m.div
            className="mt-6 grid gap-3"
            initial={false}
            animate={open ? { opacity: 1, y: 0, transition: { ...SPRING_FAST, delay: 0.2 } } : { opacity: 0, y: 12, transition: { duration: 0.12 } }}
          >
            <a href={waLink(site.wa.book)} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full !justify-between" tabIndex={open ? 0 : -1}>
              <span>Book on WhatsApp</span>
              <span className="disc" aria-hidden="true">
                <SocialLogo name="whatsapp" size={20} />
              </span>
            </a>
            <div className="grid grid-cols-2 gap-3">
              {site.phones.map((p, i) => (
                <a key={p.tel} href={telLink(i)} className="btn btn-ghost !px-3 text-sm" tabIndex={open ? 0 : -1}>
                  <Icon icon={Call02Icon} size={16} />
                  <span className="tabular">{p.display}</span>
                </a>
              ))}
            </div>
            <div className="mt-1 flex items-center justify-between">
              <ul className="flex gap-2">
                {SOCIALS.map((s) => (
                  <li key={s}>
                    <a href={site.socials[s].url} target="_blank" rel="noopener noreferrer" className="grid h-11 w-11 place-items-center rounded-full border border-line" aria-label={s === "youtube" ? "YouTube" : s[0].toUpperCase() + s.slice(1)} tabIndex={open ? 0 : -1}>
                      <SocialLogo name={s as Social} size={20} />
                    </a>
                  </li>
                ))}
              </ul>
              <span className="label steel text-right">Hog Market, Rajendra Place</span>
            </div>
          </m.div>
        </div>
      </m.div>
    </header>
  );
}
