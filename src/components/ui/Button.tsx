import type { ReactNode } from "react";
import { SocialLogo } from "./SocialLogo";

type Common = { children: ReactNode; className?: string; magnetic?: boolean; cursor?: string };

/** Red primary pill with the original WhatsApp mark on a dark disc (green never touches red). */
export function WhatsAppButton({ href, children, className = "", magnetic = false, cta = true }: Common & { href: string; cta?: boolean }) {
  const a = (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`btn btn-primary ${className}`} data-wa-cta={cta ? "" : undefined}>
      <span>{children}</span>
      <span className="disc" aria-hidden="true">
        <SocialLogo name="whatsapp" size={20} />
      </span>
    </a>
  );
  return magnetic ? <span data-magnetic>{a}</span> : a;
}

export function GhostButton({ href, children, className = "", external = false }: Common & { href: string; external?: boolean }) {
  return (
    <a href={href} className={`btn btn-ghost ${className}`} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {children}
    </a>
  );
}
