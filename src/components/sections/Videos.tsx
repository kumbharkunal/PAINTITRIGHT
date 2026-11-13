import { IMG } from "@/content/images";
import { site } from "@/content/site";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SocialLogo } from "@/components/ui/SocialLogo";
import { VideoFacade } from "@/components/ui/VideoFacade";

// Phones and tablets: a native swipe rail (vertical swipes still scroll the page).
// Desktop: all six Shorts in one staggered row, so nothing hides off-screen.
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
        <a href={site.socials.youtube.url} target="_blank" rel="noopener noreferrer" className="link-draw inline-flex min-h-11 items-center gap-3 self-start font-semibold lg:self-auto" data-reveal="fade">
          <SocialLogo name="youtube" size={24} />
          {site.socials.youtube.handle}
        </a>
      </div>
      <ul
        className="rail mt-10 lg:mx-auto lg:mt-14 lg:grid lg:max-w-[1440px] lg:grid-cols-6 lg:gap-5 lg:overflow-visible lg:px-[var(--gutter)]"
        role="list"
        aria-label="Videos"
        data-reveal="rail"
      >
        {v.items.map((it, i) => (
          <li key={it.id} className={`w-[64vw] max-w-[300px] sm:w-[36vw] lg:w-auto lg:max-w-none ${i % 2 ? "lg:pt-16" : ""}`}>
            <VideoFacade id={it.id} title={it.title} duration={it.duration} thumb={IMG.videos[it.id]} sizes="(min-width: 1024px) 15vw, 64vw" />
          </li>
        ))}
        <li className="w-px flex-none lg:hidden" aria-hidden="true" />
      </ul>
    </section>
  );
}
