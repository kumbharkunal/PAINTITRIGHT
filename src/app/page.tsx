import { Suspense } from "react";
import { Hero } from "@/components/sections/Hero";
import { OfferStrip } from "@/components/sections/OfferStrip";
import { Services } from "@/components/sections/Services";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { Process } from "@/components/sections/Process";
import { Work } from "@/components/sections/Work";
import { Why } from "@/components/sections/Why";
import { Proof } from "@/components/sections/Proof";
import { Videos } from "@/components/sections/Videos";
import { Faq } from "@/components/sections/Faq";
import { Visit } from "@/components/sections/Visit";

// Each section sits in its own Suspense boundary. Everything is server-rendered into the
// static HTML; the boundaries only let React hydrate the page in small, interruptible
// pieces instead of one long task.
export default function Home() {
  return (
    <>
      <Hero />
      <Suspense>
        <OfferStrip />
      </Suspense>
      <Suspense>
        <Services />
      </Suspense>
      <Suspense>
        <BeforeAfter />
      </Suspense>
      <Suspense>
        <Process />
      </Suspense>
      <Suspense>
        <Work />
      </Suspense>
      <Suspense>
        <Why />
      </Suspense>
      <Suspense>
        <Proof />
      </Suspense>
      <Suspense>
        <Videos />
      </Suspense>
      <Suspense>
        <Faq />
      </Suspense>
      <Suspense>
        <Visit />
      </Suspense>
    </>
  );
}
