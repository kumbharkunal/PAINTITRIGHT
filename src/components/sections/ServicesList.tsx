"use client";

import type { StaticImageData } from "next/image";
import { Img } from "@/components/ui/Img";
import { AnimatePresence, LayoutGroup, m } from "motion/react";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/ui/Icon";
import { SocialLogo } from "@/components/ui/SocialLogo";
import { waLink } from "@/content/site";
import { SPRING } from "@/lib/motion";

type Item = {
  id: string;
  group: "Paint" | "Protect" | "Detail";
  name: string;
  short: string;
  points: readonly string[];
  image: StaticImageData;
  alt: string;
};

const askText = (name: string) => `Hi Paint It Right, I'd like to know more about ${name.toLowerCase()} for my car. Car model: `;
const layoutChanged = () => window.dispatchEvent(new Event("pir:layout"));

export function ServicesList({ items }: { items: Item[] }) {
  const count = items.length;
  const groupStart = items.map((it, i) => i === 0 || items[i - 1].group !== it.group);
  const [active, setActive] = useState(0);
  const [stack, setStack] = useState<number[]>([0]);
  const [open, setOpen] = useState<number | null>(0);
  const [desktop, setDesktop] = useState(false);
  const [loaded, setLoaded] = useState<ReadonlySet<number>>(() => new Set([0, 1]));
  const rows = useRef<(HTMLButtonElement | null)[]>([]);
  const prune = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Newest layer sweeps in on top; once it has covered the rest, the others reset (hidden).
  const activate = useCallback((i: number) => {
    setActive(i);
    // images mount on demand (this one and its neighbours) and stay once loaded
    setLoaded((prev) => {
      const want = [i - 1, i, i + 1].filter((n) => n >= 0 && n < count);
      return want.every((n) => prev.has(n)) ? prev : new Set([...prev, ...want]);
    });
    setStack((s) => (s[s.length - 1] === i ? s : [...s.filter((x) => x !== i), i]));
    window.clearTimeout(prune.current);
    prune.current = window.setTimeout(() => setStack([i]), 820);
  }, [count]);

  // Desktop: the row crossing the middle of the viewport becomes active.
  useEffect(() => {
    if (!desktop) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) activate(Number((e.target as HTMLElement).dataset.index));
      },
      { rootMargin: "-49% 0px -49% 0px" },
    );
    rows.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, [desktop, activate]);

  useEffect(() => () => window.clearTimeout(prune.current), []);


  const current = items[active];

  return (
    <div className="mt-12 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-x-10">
      {/* Desktop: sticky frame with the diagonal pass between services */}
      <div className="hidden lg:col-span-5 lg:block">
        <div className="sticky top-28">
          <div className="svc-frame notch" data-cursor="View">
            {items.map((it, i) => (
              <div key={it.id} className="svc-layer" data-shown={stack.includes(i)} style={{ zIndex: stack.indexOf(i) + 1 }} aria-hidden={i !== active}>
                {loaded.has(i) ? (
                  <Img src={it.image} alt={i === active ? it.alt : ""} sizes="(min-width: 1440px) 560px, 40vw" />
                ) : null}
              </div>
            ))}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-3/5 bg-gradient-to-t from-booth via-booth/70 to-transparent" />
            <div key={current.id} className="svc-detail absolute inset-x-0 bottom-0 z-30 p-7" aria-live="polite">
              <p className="label steel">
                {current.group} <span className="num">· {String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
              </p>
              <h3 className="text-title mt-2 font-semibold">{current.name}</h3>
              <ul className="mt-3 space-y-1.5 text-[0.9375rem] text-paper/85">
                {current.points.map((p) => (
                  <li key={p} className="flex gap-2.5">
                    <span className="mt-[0.62em] h-px w-3 flex-none bg-signal" aria-hidden="true" />
                    {p}
                  </li>
                ))}
              </ul>
              <a href={waLink(askText(current.name))} target="_blank" rel="noopener noreferrer" className="link-draw mt-5 inline-flex items-center gap-2 font-semibold">
                <SocialLogo name="whatsapp" size={18} /> Ask about this <Icon icon={ArrowUpRight01Icon} size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* The list: the hero of the section. Desktop rows select; mobile rows expand. */}
      <LayoutGroup>
        <div className="lg:col-span-7">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <Fragment key={it.id}>
                {groupStart[i] ? (
                  <m.p layout="position" className="label steel flex items-center gap-3 pb-4 pt-10 first:pt-0">
                    <span className="marker" aria-hidden="true">
                      <i />
                      <i />
                    </span>
                    {it.group}
                  </m.p>
                ) : null}
                <m.div layout="position" transition={SPRING} onLayoutAnimationComplete={layoutChanged}>
                  <button
                    ref={(el) => {
                      rows.current[i] = el;
                    }}
                    type="button"
                    data-index={i}
                    data-active={desktop ? active === i : isOpen}
                    className="svc-row py-5 lg:py-6"
                    aria-expanded={desktop ? undefined : isOpen}
                    aria-controls={desktop ? undefined : `svc-panel-${it.id}`}
                    aria-current={desktop && active === i ? "true" : undefined}
                    onMouseEnter={desktop ? () => activate(i) : undefined}
                    onFocus={desktop ? () => activate(i) : undefined}
                    onClick={() => {
                      if (desktop) activate(i);
                      else setOpen((o) => (o === i ? null : i));
                    }}
                  >
                    <span className="svc-tick" aria-hidden="true">
                      <i />
                      <i />
                    </span>
                    <span className="flex items-start justify-between gap-4">
                      <span className="svc-name display text-display-l block">{it.name}</span>
                      <span className="faq-icon mt-1 lg:hidden" aria-hidden="true" />
                    </span>
                    <span className="steel mt-2 block max-w-xl text-[0.9375rem] lg:pl-7">{it.short}</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {!desktop && isOpen ? (
                      <m.div
                        key="panel"
                        id={`svc-panel-${it.id}`}
                        className="pb-8"
                        initial={{ opacity: 0, clipPath: "inset(0% 0% 100% 0%)" }}
                        animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
                        exit={{ opacity: 0, transition: { duration: 0.14 } }}
                      >
                        <div className="relative aspect-[4/5] overflow-hidden notch bg-graphite">
                          <Img src={it.image} alt={it.alt} sizes="(max-width: 1023px) 92vw, 1px" />
                        </div>
                        <ul className="mt-5 space-y-2 text-[0.9375rem] text-paper/85">
                          {it.points.map((p) => (
                            <li key={p} className="flex gap-2.5">
                              <span className="mt-[0.62em] h-px w-3 flex-none bg-signal" aria-hidden="true" />
                              {p}
                            </li>
                          ))}
                        </ul>
                        <a href={waLink(askText(it.name))} target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-5">
                          <SocialLogo name="whatsapp" size={18} /> Ask about this
                        </a>
                      </m.div>
                    ) : null}
                  </AnimatePresence>
                </m.div>
              </Fragment>
            );
          })}
        </div>
      </LayoutGroup>
    </div>
  );
}
