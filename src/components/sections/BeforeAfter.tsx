import { IMG } from "@/content/images";
import { site, waLink } from "@/content/site";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { WhatsAppButton } from "@/components/ui/Button";
import { CompareSlider } from "./CompareSlider";

export function BeforeAfter() {
  const r = site.results;
  return (
    <section id="results" className="section border-t border-line" aria-labelledby="results-title">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-10">
        <div className="lg:col-span-7">
          <CompareSlider before={IMG.before} after={IMG.after} tag={r.tag} />
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <SectionTitle id="results-title" size="l">
            {r.title}
          </SectionTitle>
          <p className="steel text-lead mt-6" data-reveal="fade">
            {r.lead}
          </p>
          <ul className="mt-8 border-t border-line" data-reveal="fade">
            {r.points.map((p) => (
              <li key={p} className="flex items-center gap-3 border-b border-line py-4">
                <span className="nav-dot" aria-hidden="true">
                  <i />
                  <i />
                </span>
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-9" data-reveal="fade">
            <WhatsAppButton href={waLink(site.wa.inspect)}>{r.cta}</WhatsAppButton>
          </div>
        </div>
      </div>
    </section>
  );
}
