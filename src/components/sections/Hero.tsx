import type { CSSProperties } from "react";
import { getImageProps } from "next/image";
import { preload } from "react-dom";
import { Call02Icon } from "@hugeicons/core-free-icons";
import { IMG } from "@/content/images";
import { site, telLink, waLink } from "@/content/site";
import { GhostButton, WhatsAppButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

// Marks the hero ready once its image has decoded, which starts the CSS First Pass.
// A timeout keeps the page honest if the image is slow or fails.
const READY = `(function(){var h=document.currentScript.parentElement,i=h.querySelector('.hero-gloss img'),d=0;function r(){if(d)return;d=1;h.setAttribute('data-ready','')}if(i&&i.complete&&i.naturalWidth)r();else if(i){i.addEventListener('load',r);i.addEventListener('error',r)}setTimeout(r,2600)})()`;

function HeroPicture({ desktop, mobile, img, alt, priority }: { desktop: string; mobile: string; img: Record<string, unknown>; alt: string; priority: boolean }) {
  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={desktop} sizes="100vw" />
      <source media="(max-width: 767px)" srcSet={mobile} sizes="100vw" />
      <img {...img} alt={alt} fetchPriority={priority ? "high" : "auto"} loading="eager" decoding={priority ? "sync" : "async"} />
    </picture>
  );
}

export function Hero() {
  const common = { alt: site.hero.imageAlt, sizes: "100vw", quality: 72 };
  const desktopProps = getImageProps({ ...common, src: IMG.heroDesktop }).props;
  const { srcSet: mobileSet, ...img } = getImageProps({ ...common, src: IMG.heroMobile }).props;
  const desktopSet = desktopProps.srcSet ?? "";

  // Preload only the LCP image, scoped by media so each device fetches exactly one.
  preload(desktopProps.src, { as: "image", imageSrcSet: desktopSet, imageSizes: "100vw", media: "(min-width: 768px)", fetchPriority: "high" });
  preload(img.src, { as: "image", imageSrcSet: mobileSet ?? "", imageSizes: "100vw", media: "(max-width: 767px)", fetchPriority: "high" });

  const imgProps = { ...img, srcSet: undefined, sizes: undefined } as Record<string, unknown>;

  return (
    <section id="top" className="hero" aria-labelledby="hero-title" suppressHydrationWarning>
      <div className="hero-media" data-hero-media>
        <div className="hero-layer hero-gloss">
          <HeroPicture desktop={desktopSet} mobile={mobileSet ?? ""} img={imgProps} alt={site.hero.imageAlt} priority />
        </div>
        <div className="hero-layer hero-primer" aria-hidden="true">
          <HeroPicture desktop={desktopSet} mobile={mobileSet ?? ""} img={imgProps} alt="" priority={false} />
        </div>
        <div className="hero-spray" aria-hidden="true" />
        <div className="hero-scrim" aria-hidden="true" />
        <div className="hero-grain grain" aria-hidden="true" />
      </div>
      <script dangerouslySetInnerHTML={{ __html: READY }} />

      <div className="hero-content wrap" data-hero-content>
        <h1 id="hero-title" className="display hero-title">
          <span className="line-mask">
            <span className="line" style={{ "--i": 0 } as CSSProperties}>
              {site.hero.lines[0]}
            </span>
          </span>
          <span className="line-mask">
            <span className="line" style={{ "--i": 1 } as CSSProperties}>
              {site.hero.lines[1]}{" "}
              <span className="nowrap">
                <span className="lean">{site.hero.lean}</span>
                <span className="hero-slashes" aria-hidden="true">
                  <i style={{ "--d": "0ms" } as CSSProperties} />
                  <i style={{ "--d": "80ms" } as CSSProperties} />
                </span>
              </span>
            </span>
          </span>
        </h1>

        <div className="mt-6 grid gap-7 lg:mt-9 lg:grid-cols-12 lg:items-end">
          <p className="hero-fade min-w-0 text-lead text-paper/85 measure lg:col-span-5" style={{ "--d": "520ms" } as CSSProperties}>
            {site.hero.sub}
          </p>
          <div className="hero-fade flex min-w-0 flex-col gap-3 sm:flex-row lg:col-span-7 lg:justify-end" style={{ "--d": "640ms" } as CSSProperties}>
            <WhatsAppButton href={waLink(site.wa.book)} magnetic className="w-full sm:w-auto">
              Book on WhatsApp
            </WhatsAppButton>
            <GhostButton href={telLink(0)} className="w-full sm:w-auto">
              <Icon icon={Call02Icon} size={18} />
              <span>
                Call <span className="tabular">{site.phones[0].display}</span>
              </span>
            </GhostButton>
          </div>
        </div>

        <p className="hero-fade label steel mt-8 hidden items-center gap-3 lg:flex" style={{ "--d": "760ms" } as CSSProperties}>
          <span className="marker" aria-hidden="true">
            <i />
            <i />
          </span>
          {site.tagline}
        </p>
      </div>
    </section>
  );
}
