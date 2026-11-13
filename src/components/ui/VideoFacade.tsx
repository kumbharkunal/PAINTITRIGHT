"use client";

import type { StaticImageData } from "next/image";
import { useState } from "react";
import { PlayIcon } from "@hugeicons/core-free-icons";
import { Icon } from "./Icon";
import { Img } from "./Img";

// Self-hosted thumbnail until the visitor presses play; only then does YouTube load
// (privacy-enhanced domain), and focus moves into the player. The title sits under the
// frame, so it stays readable in narrow columns.
export function VideoFacade({ id, title, duration, thumb, sizes, className = "" }: { id: string; title: string; duration: string; thumb: StaticImageData; sizes: string; className?: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <figure className={className}>
      <div className="facade notch">
        {playing ? (
          <iframe
            ref={(el) => el?.focus()}
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1&modestbranding=1`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            loading="eager"
          />
        ) : (
          <button type="button" className="facade-btn" onClick={() => setPlaying(true)} aria-label={`Play video: ${title} (${duration})`}>
            <Img src={thumb} alt="" sizes={sizes} />
            <span className="facade-shade" aria-hidden="true" />
            <span className="play" aria-hidden="true">
              <Icon icon={PlayIcon} size={20} className="translate-x-px text-white" />
            </span>
          </button>
        )}
      </div>
      <figcaption className="mt-3 flex items-start justify-between gap-3">
        <span className="text-[0.9375rem] font-semibold leading-snug">{title}</span>
        <span className="num steel mt-0.5 flex-none text-sm">{duration}</span>
      </figcaption>
    </figure>
  );
}
