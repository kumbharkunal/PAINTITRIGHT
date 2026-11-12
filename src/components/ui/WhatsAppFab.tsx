"use client";

import { useEffect, useState } from "react";
import { site, waLink } from "@/content/site";
import { SocialLogo } from "./SocialLogo";

// Floating WhatsApp: appears once the hero's CTA has scrolled away, steps aside whenever
// another WhatsApp button is on screen, and hides while the mobile menu is open (CSS).
export function WhatsAppFab() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target);
          else visible.delete(e.target);
        }
        setShow(visible.size === 0 && window.scrollY > window.innerHeight * 0.6);
      },
      { threshold: 0 },
    );
    const targets = document.querySelectorAll("[data-wa-cta]");
    targets.forEach((t) => io.observe(t));
    const onScroll = () => setShow(visible.size === 0 && window.scrollY > window.innerHeight * 0.6);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <a
      href={waLink(site.wa.book)}
      target="_blank"
      rel="noopener noreferrer"
      className="fab glass"
      data-show={show}
      aria-label="Chat with Paint It Right on WhatsApp"
      tabIndex={show ? 0 : -1}
      aria-hidden={show ? undefined : true}
    >
      <SocialLogo name="whatsapp" size={28} />
    </a>
  );
}
