import type { Metadata, Viewport } from "next";
import { Hubot_Sans, Mona_Sans } from "next/font/google";
import { site } from "@/content/site";
import { Nav } from "@/components/nav/Nav";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { MotionRuntime } from "@/components/motion/MotionRuntime";
import { WhatsAppFab } from "@/components/ui/WhatsAppFab";
import { Footer } from "@/components/sections/Footer";
import "./globals.css";

const hubot = Hubot_Sans({ subsets: ["latin"], axes: ["wdth"], variable: "--font-hubot", display: "swap" });
const mona = Mona_Sans({ subsets: ["latin"], variable: "--font-mona", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: "Paint It Right | Car painting, PPF and ceramic coating in Delhi",
  description: site.description,
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: site.name,
    title: "Paint It Right | Painted right. Protected right.",
    description: site.description,
    url: site.url,
  },
  twitter: { card: "summary_large_image" },
  robots: site.flags.noindex ? { index: false, follow: false } : { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#08090B",
  colorScheme: "dark",
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

// Runs before first paint: first visits get the full First Pass, repeat visits a short one,
// reduced motion and no-JS get none. Sets an attribute only; the hero animates in CSS.
const INTRO = `try{var d=document.documentElement;if(!matchMedia('(prefers-reduced-motion: reduce)').matches){var k='pir-intro';d.dataset.intro=localStorage.getItem(k)?'repeat':'first';localStorage.setItem(k,'1')}}catch(e){}`;

// Each section streams as its own Suspense boundary, and React's inline scripts move it into
// place on the first frame. Without JS those scripts never run, so the sections would stay
// hidden after the footer: show them, in order, and put the footer back at the end.
// (Same layer as Tailwind's preflight `[hidden]{display:none!important}`, higher specificity.)
const NOSCRIPT = `<style>@layer theme,base,components,utilities;@layer base{body{display:flex;flex-direction:column}body>div[hidden][id^="S:"]{display:block!important}body>footer{order:1}}</style>`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${hubot.variable} ${mona.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO }} />
        <noscript dangerouslySetInnerHTML={{ __html: NOSCRIPT }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <div className="progress" aria-hidden="true" />
        <MotionProvider>
          <Nav />
          <main id="main" data-inert-on-menu>
            {children}
          </main>
          <Footer />
          <WhatsAppFab />
        </MotionProvider>
        <MotionRuntime />
      </body>
    </html>
  );
}
