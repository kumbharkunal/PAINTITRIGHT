import { IMG } from "@/content/images";
import { site } from "@/content/site";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SocialLogo } from "@/components/ui/SocialLogo";
import { VideoFacade } from "@/components/ui/VideoFacade";

export function Videos() {
  const v = site.videos;
  return (
    <section id="videos" className="section border-t border-line" aria-labelledby="videos-title">
      <div className="wrap flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <SectionTitle id="videos-title">{v.title}</SectionTitle>
          <p className="steel text-lead mt-5 max-w-md" data-reveal="fade">
            {v.intro}
          </p>
        </div>
        <a href={site.socials.youtube.url} target="_blank" rel="noopener noreferrer" className="link-draw inline-flex items-center gap-3 self-start font-semibold lg:self-auto" data-reveal="fade">
          <SocialLogo name="youtube" size={24} />
          {site.socials.youtube.handle}
        </a>
      </div>
      <div className="rail mt-10 lg:mt-14 lg:[--rail-pad:var(--gutter)]" data-lenis-prevent tabIndex={0} aria-label="Videos, scroll sideways" data-reveal="rail">
        {v.items.map((it, i) => (
          <div key={it.id} className={i === 0 ? "w-[68vw] max-w-[360px] sm:w-[40vw] lg:w-[24vw]" : "w-[58vw] max-w-[300px] sm:w-[32vw] lg:w-[19vw] lg:pt-14"}>
            <VideoFacade id={it.id} title={it.title} duration={it.duration} thumb={IMG.videos[it.id]} sizes="(min-width: 1024px) 24vw, 68vw" />
          </div>
        ))}
        <div className="w-px flex-none" aria-hidden="true" />
      </div>
    </section>
  );
}
