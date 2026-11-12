import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

// One icon set (Hugeicons free, stroke-rounded) at one stroke weight.
export function Icon({ icon, size = 20, className }: { icon: IconSvgElement; size?: number; className?: string }) {
  return <HugeiconsIcon icon={icon} size={size} strokeWidth={1.5} className={className} aria-hidden="true" />;
}
