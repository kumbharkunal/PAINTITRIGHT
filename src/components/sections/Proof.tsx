import { IMG } from "@/content/images";
import { site } from "@/content/site";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SocialLogo, type Social } from "@/components/ui/SocialLogo";
import { VideoFacade } from "@/components/ui/VideoFacade";

// No Google reviews exist yet (no Business Profile), so proof is the one real on-camera
// testimonial plus their channels. The multi-review block stays off (site.flags.reviews).
export function Proof() {
  const p = site.proof;
  const channels = (
    [
      { name: "instagram", url: site.socials.instagram.url, text: p.links.instagram, handle: site.socials.instagram.handle },
      { name: "youtube", url: site.socials.youtube.url, text: p.links.youtube, handle: site.socials.youtube.handle },
      { name: "facebook", url: site.socials.facebook.url, text: p.links.facebook, handle: site.socials.facebook.handle },
    ] as { name: Social; url: string; text: string; handle: string }[]
  ).filter((c) => c.url);

  return (
    <section id="proof" className="section border-t border-line" aria-labelledby="proof-title">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <SectionTitle id="proof-title">{p.title}</SectionTitle>
          <figure className="mt-10 lg:mt-14">
            <blockquote className="text-[clamp(1.375rem,1rem+1.6vw,2.25rem)] font-medium leading-[1.25] tracking-[-0.01em]" data-reveal="lines">
              <span className="text-signal" aria-hidden="true">“</span>
              {p.quote}
              <span className="text-signal" aria-hidden="true">”</span>
            </blockquote>
            <figcaption className="label steel mt-6 flex items-center gap-3">
              <span className="marker" aria-hidden="true">
                <i />
                <i />
              </span>
              {p.cite}
            </figcaption>
          </figure>

          <ul className="mt-12 grid gap-3 sm:grid-cols-3" data-reveal="fade">
            {channels.map((c) => (
              <li key={c.name}>
                <a href={c.url} target="_blank" rel="noopener noreferrer" className="notch flex min-h-[112px] flex-col justify-between gap-6 border border-line bg-booth-2 p-5 transition-colors hover:bg-graphite">
                  <SocialLogo name={c.name} size={26} />
                  <span>
                    <span className="block font-semibold">{c.text}</span>
                    <span className="steel block text-sm">{c.handle}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <VideoFacade id={p.video.id} title={p.video.title} duration={p.video.duration} thumb={IMG.videos[p.video.id]} sizes="(min-width: 1024px) 30vw, 90vw" className="mx-auto max-w-[400px]" />
        </div>
      </div>
    </section>
  );
}
