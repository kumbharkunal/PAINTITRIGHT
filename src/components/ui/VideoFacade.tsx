"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef, useState } from "react";
import { PlayIcon } from "@hugeicons/core-free-icons";
import { Icon } from "./Icon";

// Self-hosted thumbnail until the visitor presses play; only then does YouTube load
// (privacy-enhanced domain), and focus moves into the player.
export function VideoFacade({ id, title, duration, thumb, sizes, className = "" }: { id: string; title: string; duration: string; thumb: StaticImageData; sizes: string; className?: string }) {
  const [playing, setPlaying] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);

  if (playing) {
    return (
      <div className={`facade notch ${className}`}>
        <iframe
          ref={(el) => {
            frame.current = el;
            el?.focus();
          }}
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1&modestbranding=1`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          loading="eager"
        />
      </div>
    );
  }

  return (
    <button type="button" className={`facade notch text-left ${className}`} onClick={() => setPlaying(true)} data-cursor="Play" aria-label={`Play video: ${title} (${duration})`}>
      <Image src={thumb} alt="" fill sizes={sizes} quality={72} placeholder="blur" />
      <span className="facade-shade" aria-hidden="true" />
      <span className="play" aria-hidden="true">
        <Icon icon={PlayIcon} size={20} className="translate-x-px text-white" />
      </span>
      <span className="absolute bottom-4 left-[76px] right-4 block" aria-hidden="true">
        <span className="block text-[0.9375rem] font-semibold leading-snug">{title}</span>
        <span className="label steel tabular mt-1 block">{duration}</span>
      </span>
    </button>
  );
}
