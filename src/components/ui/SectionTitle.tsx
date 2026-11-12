import type { ReactNode } from "react";

/** Section heading: the logo's two slashes as the marker, lines revealed by SplitText. */
export function SectionTitle({ children, id, size = "xl", className = "" }: { children: ReactNode; id?: string; size?: "xl" | "l"; className?: string }) {
  return (
    <h2 id={id} className={`display ${size === "xl" ? "text-display-xl" : "text-display-l"} ${className}`} data-reveal="lines">
      <span className="marker" aria-hidden="true" data-reveal-marker>
        <i />
        <i />
      </span>
      {children}
    </h2>
  );
}
