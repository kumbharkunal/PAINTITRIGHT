import { Img } from "@/components/ui/Img";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { IMG } from "@/content/images";
import { site } from "@/content/site";
import { Icon } from "@/components/ui/Icon";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { SocialLogo } from "@/components/ui/SocialLogo";

type Job = (typeof site.work.items)[number];

function Tile({ job, sizes, className = "" }: { job: Job; sizes: string; className?: string }) {
  return (
    <a href={job.reel} target="_blank" rel="noopener noreferrer" className={`tile ${className}`}>
      <div className="tile-media notch">
        <Img src={IMG.work[job.id]} alt={`${job.car}: ${job.story}`} sizes={sizes} />
      </div>
      <div className="tile-cap mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="label steel">{job.service}</p>
          <p className="text-title mt-1.5 font-semibold">{job.car}</p>
          <p className="steel mt-1 text-[0.9375rem]">{job.story}</p>
        </div>
        <span className="mt-1 inline-flex min-h-11 min-w-11 flex-none items-center justify-center rounded-full border border-line-strong" aria-hidden="true">
          <Icon icon={ArrowUpRight01Icon} size={18} />
        </span>
      </div>
      <span className="sr-only">Watch the reel on Instagram</span>
    </a>
  );
}

export function Work() {
  const w = site.work;
  const colA = w.items.filter((_, i) => i % 2 === 0);
  const colB = w.items.filter((_, i) => i % 2 === 1);
  return (
    <section id="work" className="section border-t border-line" aria-labelledby="work-title" data-scene="work">
      <div className="wrap lg:grid lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionTitle id="work-title">{w.title}</SectionTitle>
            <p className="steel text-lead mt-6 max-w-sm" data-reveal="fade">
              {w.intro}
            </p>
            <a href={site.socials.instagram.url} target="_blank" rel="noopener noreferrer" className="link-draw mt-6 inline-flex min-h-11 items-center gap-3 font-semibold" data-reveal="fade">
              <SocialLogo name="instagram" size={22} />
              {site.socials.instagram.handle}
            </a>
          </div>
        </div>

        {/* desktop: two offset columns drifting at different speeds */}
        <div className="hidden lg:col-span-8 lg:grid lg:grid-cols-2 lg:gap-10">
          <div className="space-y-16" data-drift="-40">
            {colA.map((job) => (
              <Tile key={job.id} job={job} sizes="(min-width: 1440px) 420px, 30vw" />
            ))}
          </div>
          <div className="space-y-16 pt-40" data-drift="40">
            {colB.map((job) => (
              <Tile key={job.id} job={job} sizes="(min-width: 1440px) 420px, 30vw" />
            ))}
          </div>
        </div>
      </div>

      {/* mobile + tablet: native scroll-snap rail. role="list" because Safari drops list semantics under list-style: none */}
      <ul className="rail mt-10 lg:hidden" role="list" aria-label="Recent work, swipe sideways">
        {w.items.map((job) => (
          <li key={job.id} className="w-[80vw] max-w-[420px] sm:w-[45vw]">
            <Tile job={job} sizes="(max-width: 767px) 80vw, 45vw" />
          </li>
        ))}
      </ul>
    </section>
  );
}
