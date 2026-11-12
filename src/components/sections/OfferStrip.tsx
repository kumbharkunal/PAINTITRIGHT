import { cacheLife } from "next/cache";
import { offerIsLive, site, waLink } from "@/content/site";
import { WhatsAppButton } from "@/components/ui/Button";

// Hides itself after site.offer.endsAt. The cached render refreshes hourly; the inline guard
// covers the hour in between, so an expired offer never shows.
const GUARD = `(function(){var s=document.currentScript.parentElement;if(Date.now()>Date.parse(s.getAttribute('data-ends')))s.hidden=true})()`;

export async function OfferStrip() {
  "use cache";
  cacheLife("hours");
  const o = site.offer;
  if (!offerIsLive()) return null;

  return (
    <aside className="offer bg-booth-2" aria-label={o.label} data-ends={o.endsAt} suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: GUARD }} />
      <div className="grain absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="offer-cut" aria-hidden="true" data-reveal="cut">
        <i />
        <i />
      </div>
      <div className="wrap relative py-7 pl-[calc(var(--gutter)+72px)] lg:py-8 lg:pl-[calc(var(--gutter)+120px)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div data-reveal="fade">
            <p className="label flex items-center gap-3">
              <span className="text-paper">{o.label}</span>
              <span className="steel">{o.note}</span>
            </p>
            <p className="display text-display-l mt-2">{o.title}</p>
            <p className="steel mt-2 max-w-xl text-[0.9375rem]">{o.detail}</p>
          </div>
          <WhatsAppButton href={waLink(site.wa.offer)} className="self-start lg:self-auto">
            {o.cta}
          </WhatsAppButton>
        </div>
      </div>
    </aside>
  );
}
