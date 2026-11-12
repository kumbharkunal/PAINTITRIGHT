import { site, waLink } from "@/content/site";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { WhatsAppButton } from "@/components/ui/Button";
import { FaqList } from "./FaqList";

export function Faq() {
  const f = site.faq;
  return (
    <section id="faq" className="section border-t border-line" aria-labelledby="faq-title">
      <div className="wrap grid gap-10 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionTitle id="faq-title">{f.title}</SectionTitle>
            <p className="steel mt-6 max-w-xs" data-reveal="fade">
              Still unsure? Send us a photo of the car and your question.
            </p>
            <div className="mt-7" data-reveal="fade">
              <WhatsAppButton href={waLink(site.wa.question)}>Ask on WhatsApp</WhatsAppButton>
            </div>
          </div>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <FaqList items={f.items.map((it) => ({ q: it.q, a: it.a }))} />
        </div>
      </div>
    </section>
  );
}
