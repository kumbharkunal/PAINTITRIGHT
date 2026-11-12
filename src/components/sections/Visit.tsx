import type { CSSProperties } from "react";
import { Call02Icon, Clock01Icon, Location01Icon, Train01Icon } from "@hugeicons/core-free-icons";
import { MAP } from "@/content/map-data";
import { site, telLink, waLink } from "@/content/site";
import { Icon } from "@/components/ui/Icon";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { GhostButton, WhatsAppButton } from "@/components/ui/Button";
import { SocialLogo, type Social } from "@/components/ui/SocialLogo";

const SOCIAL_NAMES: Record<string, string> = { instagram: "Instagram", youtube: "YouTube", facebook: "Facebook" };

export function Visit() {
  const v = site.visit;
  const socials = (["instagram", "youtube", "facebook"] as const).filter((s) => site.socials[s].url);
  return (
    <section id="visit" className="section border-t border-line" aria-labelledby="visit-title">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <SectionTitle id="visit-title">{v.title}</SectionTitle>
          <p className="steel text-lead mt-5" data-reveal="fade">
            {v.lead}
          </p>

          <address className="mt-10 not-italic" data-reveal="fade">
            <p className="flex gap-3">
              <Icon icon={Location01Icon} size={20} className="mt-0.5 flex-none text-signal" />
              <span>
                <span className="block text-title font-semibold">{site.address.line1}</span>
                <span className="block">{site.address.line2}</span>
                <span className="steel mt-1.5 flex items-start gap-2 text-sm">
                  <Icon icon={Train01Icon} size={16} className="mt-0.5 flex-none" /> {site.address.near}
                </span>
              </span>
            </p>
          </address>

          <div className="mt-8 flex flex-col gap-3 xs:flex-row xs:flex-wrap" data-reveal="fade">
            <WhatsAppButton href={waLink(site.wa.visit)}>Book on WhatsApp</WhatsAppButton>
            {site.phones.map((p, i) => (
              <GhostButton key={p.tel} href={telLink(i)}>
                <Icon icon={Call02Icon} size={18} />
                <span className="tabular">{p.display}</span>
              </GhostButton>
            ))}
          </div>

          <div className="mt-10" data-reveal="fade">
            <p className="label steel flex items-center gap-2">
              <Icon icon={Clock01Icon} size={16} /> Hours
            </p>
            <dl className="mt-3 border-t border-line">
              {site.hours.map((h) => (
                <div key={h.day} className="flex justify-between gap-4 border-b border-line py-2.5 text-[0.9375rem]">
                  <dt>{h.day}</dt>
                  <dd className={`tabular ${h.time ? "" : "steel"}`}>{h.time ?? "Call to confirm"}</dd>
                </div>
              ))}
            </dl>
          </div>

          <ul className="mt-8 flex gap-3" aria-label="Paint It Right on social media">
            {socials.map((s) => (
              <li key={s}>
                <a href={site.socials[s].url} target="_blank" rel="noopener noreferrer" className="grid h-12 w-12 place-items-center rounded-full border border-line-strong transition-colors hover:bg-graphite-2" aria-label={SOCIAL_NAMES[s]}>
                  <SocialLogo name={s as Social} size={22} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-7">
          <a href={site.address.mapsUrl} target="_blank" rel="noopener noreferrer" className="map notch group" data-reveal="clip" data-cursor="Open" aria-label="Open the studio location in Google Maps">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/map/visit.svg" alt="" width={1200} height={900} loading="lazy" decoding="async" />
            {MAP.labels.map((l) => (
              <span key={l.text} className="map-label" style={{ left: `${l.x}%`, top: `${l.y}%`, "--a": `${l.angle}deg` } as CSSProperties} aria-hidden="true">
                {l.text}
              </span>
            ))}
            {MAP.station ? (
              <span className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full bg-booth/80 px-2 py-1 text-[0.6875rem] text-paper/80" style={{ left: `${MAP.station.x}%`, top: `${MAP.station.y}%` }} aria-hidden="true">
                <Icon icon={Train01Icon} size={13} /> {MAP.station.name}
              </span>
            ) : null}
            <span className="map-pin" aria-hidden="true" data-pin>
              <span className="map-ring" />
              <span className="map-pin-body glass rounded-full">
                <span className="nav-dot scale-125">
                  <i />
                  <i />
                </span>
              </span>
            </span>
            <span className="glass absolute bottom-4 left-4 flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors group-hover:bg-graphite-2">Open in Google Maps</span>
            <span className="absolute bottom-2 right-3 text-[0.625rem] text-steel/80">Map data © OpenStreetMap contributors</span>
          </a>
        </div>
      </div>
    </section>
  );
}
