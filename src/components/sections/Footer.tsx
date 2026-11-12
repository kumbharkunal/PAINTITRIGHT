import { LOGO } from "@/components/brand/logo-data";
import { site, telLink, waLink } from "@/content/site";
import { WhatsAppButton } from "@/components/ui/Button";
import { SocialLogo, type Social } from "@/components/ui/SocialLogo";

const B = LOGO.boxes.word;
const VB = `${B.x} ${B.y} ${B.w} ${B.h}`;

// The final coat: primer-grey wordmark underneath, chrome on top. The runtime clips the
// chrome copy with a diagonal pass as the footer scrolls in; without it, it's simply chrome.
function BigWordmark() {
  return (
    <div className="floor" aria-hidden="true">
      <div className="relative" data-final-pass>
        <svg viewBox={VB} className="block h-auto w-full" focusable="false">
          <path d={LOGO.word} fill="#2A2E34" />
        </svg>
        <svg viewBox={VB} className="absolute inset-0 block h-auto w-full" focusable="false" data-chrome>
          <defs>
            <linearGradient id="chrome" x1="0" y1={B.y} x2="0" y2={B.y + B.h} gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#FFFFFF" />
              <stop offset="0.48" stopColor="#C9CDD3" />
              <stop offset="0.52" stopColor="#9AA0A8" />
              <stop offset="1" stopColor="#F2F3F4" />
            </linearGradient>
          </defs>
          <path d={LOGO.word} fill="url(#chrome)" />
        </svg>
      </div>
      <svg viewBox={VB} className="floor-reflect block h-auto w-full" focusable="false">
        <path d={LOGO.word} fill="#9AA0A8" />
      </svg>
    </div>
  );
}

export function Footer() {
  const socials = (["instagram", "youtube", "facebook"] as const).filter((s) => site.socials[s].url);
  return (
    <footer className="relative overflow-hidden border-t border-line bg-booth-2 pt-20 lg:pt-28" data-inert-on-menu data-scene="footer">
      <div className="grain pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="wrap relative">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="display text-display-l max-w-md">{site.footer.line}</p>
            <div className="mt-8">
              <WhatsAppButton href={waLink(site.wa.book)} magnetic>
                Book on WhatsApp
              </WhatsAppButton>
            </div>
          </div>

          <nav className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7" aria-label="Footer">
            <div>
              <p className="label steel">Explore</p>
              <ul className="mt-4 space-y-2.5">
                {site.nav.map((n) => (
                  <li key={n.id}>
                    <a href={`#${n.id}`} className="link-draw">
                      {n.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="label steel">Contact</p>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <a href={waLink(site.wa.book)} target="_blank" rel="noopener noreferrer" className="link-draw tabular">
                    WhatsApp {site.whatsapp.display}
                  </a>
                </li>
                {site.phones.map((p, i) => (
                  <li key={p.tel}>
                    <a href={telLink(i)} className="link-draw tabular">
                      Call {p.display}
                    </a>
                  </li>
                ))}
                <li className="steel pt-1 text-sm">
                  {site.address.line1}
                  <br />
                  {site.address.line2}
                </li>
              </ul>
            </div>
            <div>
              <p className="label steel">Follow</p>
              <ul className="mt-4 space-y-3">
                {socials.map((s) => (
                  <li key={s}>
                    <a href={site.socials[s].url} target="_blank" rel="noopener noreferrer" className="link-draw inline-flex items-center gap-2.5">
                      <SocialLogo name={s as Social} size={18} />
                      {s === "youtube" ? "YouTube" : s[0].toUpperCase() + s.slice(1)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-20 lg:mt-28">
          <BigWordmark />
        </div>

        <div className="label steel flex flex-col gap-2 border-t border-line py-6 pb-[max(24px,env(safe-area-inset-bottom))] sm:flex-row sm:items-center sm:justify-between">
          <span>© <span className="num">2026</span> Paint It Right · {site.tagline}</span>
          <span>Map data © OpenStreetMap contributors</span>
        </div>
      </div>
    </footer>
  );
}
