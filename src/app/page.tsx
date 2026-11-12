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

export default function Home() {
  return (
    <>
      <Hero />
      <OfferStrip />
      <Services />
      <BeforeAfter />
      <Process />
      <Work />
      <Why />
      <Proof />
      <Videos />
      <Faq />
      <Visit />
    </>
  );
}
