import { IMG, SERVICE_ALT } from "@/content/images";
import { site } from "@/content/site";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ServicesList } from "./ServicesList";

export function Services() {
  const s = site.services;
  const items = s.items.map((it) => ({ ...it, image: IMG.services[it.id], alt: SERVICE_ALT[it.id] }));
  return (
    <section id="services" className="section" aria-labelledby="services-title">
      <div className="wrap">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <SectionTitle id="services-title" className="lg:col-span-7">
            {s.title}
          </SectionTitle>
          <p className="steel measure text-lead lg:col-span-4 lg:col-start-9" data-reveal="fade">
            {s.intro}
          </p>
        </div>
        <ServicesList items={items} />
      </div>
    </section>
  );
}
