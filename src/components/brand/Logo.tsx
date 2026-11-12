import { LOGO } from "./logo-data";

type Props = { className?: string; ink?: string; title?: string };

const box = (b: { x: number; y: number; w: number; h: number }) => `${b.x} ${b.y} ${b.w} ${b.h}`;

/** The R monogram with its two slashes (traced from the client's logo). */
export function LogoMark({ className, ink = "currentColor", title }: Props) {
  return (
    <svg viewBox={box(LOGO.boxes.mark)} className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} focusable="false">
      {title ? <title>{title}</title> : null}
      <path d={LOGO.r} fill={ink} />
      <path d={LOGO.slashRed} fill={LOGO.red} />
      <path d={LOGO.slashDark} fill={ink} />
    </svg>
  );
}

/** "PAINT IT RIGHT" wordmark (Poppins Bold outlines, letter positions fitted to the logo). */
export function Wordmark({ className, ink = "currentColor", title }: Props) {
  return (
    <svg viewBox={box(LOGO.boxes.word)} className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} focusable="false">
      {title ? <title>{title}</title> : null}
      <path d={LOGO.word} fill={ink} />
    </svg>
  );
}

/** "LIFETIME WARRANTY FOR YOUR CAR" (Poppins Medium outlines). */
export function TaglineMark({ className, ink = "currentColor" }: Props) {
  return (
    <svg viewBox={box(LOGO.boxes.tag)} className={className} aria-hidden="true" focusable="false">
      <path d={LOGO.tag} fill={ink} />
    </svg>
  );
}

export const WORDMARK_ASPECT = LOGO.boxes.word.w / LOGO.boxes.word.h;
