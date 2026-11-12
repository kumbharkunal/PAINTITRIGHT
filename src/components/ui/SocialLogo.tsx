// Original full-colour brand marks from theSVG (public/icons). Rendered as <img> because
// their internal SVG ids would collide if inlined, and never recoloured.
const SIZES = {
  instagram: { w: 24, h: 24 },
  facebook: { w: 24, h: 24 },
  whatsapp: { w: 24, h: 24 },
  youtube: { w: 28, h: 20 },
} as const;

export type Social = keyof typeof SIZES;

export function SocialLogo({ name, size = 24, className }: { name: Social; size?: number; className?: string }) {
  const s = SIZES[name];
  const scale = size / Math.max(s.w, s.h);
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/icons/${name}.svg`} width={Math.round(s.w * scale)} height={Math.round(s.h * scale)} alt="" className={className} loading="lazy" decoding="async" />;
}
