import { getImageProps, type StaticImageData } from "next/image";
import type { CSSProperties } from "react";

// A plain <img> with Next's optimised srcset (AVIF/WebP) but no client-side component:
// next/image hydrates every instance, this renders static HTML. The blur preview sits
// behind the image as a CSS background, so nothing has to be removed when it loads.
export function Img({
  src,
  alt,
  sizes,
  quality = 72,
  className = "object-cover",
  eager = false,
}: {
  src: StaticImageData;
  alt: string;
  sizes: string;
  quality?: number;
  className?: string;
  eager?: boolean;
}) {
  const { props } = getImageProps({ src, alt, sizes, quality, fill: true });
  const style: CSSProperties = {
    ...props.style,
    ...(src.blurDataURL ? { backgroundImage: `url("${src.blurDataURL}")`, backgroundSize: "cover", backgroundPosition: "center" } : null),
  };
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} alt={alt} className={className} style={style} loading={eager ? "eager" : "lazy"} decoding="async" />;
}
