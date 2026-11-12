// Static imports of every image slot. Each file lives at its final path in public/images
// (placeholders until the real images land). A static import gives width, height and a blur
// preview automatically, and a content-hashed URL, so replacing a file busts every cache.
import heroDesktop from "../../public/images/hero/hero-desktop.png";
import heroMobile from "../../public/images/hero/hero-mobile.png";
import after from "../../public/images/results/after.png";
import before from "../../public/images/results/before.png";
import craft from "../../public/images/why/craft.png";

import paintRespray from "../../public/images/services/paint-respray.png";
import scratchCorrection from "../../public/images/services/scratch-correction.png";
import paintRestoration from "../../public/images/services/paint-restoration.png";
import ppf from "../../public/images/services/ppf.png";
import ceramicCoating from "../../public/images/services/ceramic-coating.png";
import glassCoating from "../../public/images/services/glass-coating.png";
import detailingPolishing from "../../public/images/services/detailing-polishing.png";
import interiorDetailing from "../../public/images/services/interior-detailing.png";
import interiorPlasticCoating from "../../public/images/services/interior-plastic-coating.png";

import bmwX7Bumper from "../../public/images/work/bmw-x7-bumper.jpg";
import porscheMacan from "../../public/images/work/porsche-macan-piano-black.jpg";
import bmwZ4 from "../../public/images/work/bmw-z4-restoration.jpg";
import sClass from "../../public/images/work/mercedes-s-class-repaint-ppf.jpg";
import glc from "../../public/images/work/mercedes-glc-ppf.jpg";
import bmwX3 from "../../public/images/work/bmw-x3-ceramic.jpg";

import vB3 from "../../public/images/videos/B3-puSiGIO8.jpg";
import vIM from "../../public/images/videos/iMEVdAhjchc.jpg";
import vKC from "../../public/images/videos/kC4jSSr15SU.jpg";
import vKV from "../../public/images/videos/KV0DNZ7rh3E.jpg";
import vCN from "../../public/images/videos/Cn9_caqHqCw.jpg";
import v6I from "../../public/images/videos/6i_bBG_otTk.jpg";
import v0N from "../../public/images/videos/0NwTGu8gfBo.jpg";

export const IMG = {
  heroDesktop,
  heroMobile,
  after,
  before,
  craft,
  services: {
    "paint-respray": paintRespray,
    "scratch-correction": scratchCorrection,
    "paint-restoration": paintRestoration,
    ppf,
    "ceramic-coating": ceramicCoating,
    "glass-coating": glassCoating,
    "detailing-polishing": detailingPolishing,
    "interior-detailing": interiorDetailing,
    "interior-plastic-coating": interiorPlasticCoating,
  },
  work: {
    "bmw-x7-bumper": bmwX7Bumper,
    "porsche-macan-piano-black": porscheMacan,
    "bmw-z4-restoration": bmwZ4,
    "mercedes-s-class-repaint-ppf": sClass,
    "mercedes-glc-ppf": glc,
    "bmw-x3-ceramic": bmwX3,
  },
  videos: {
    "B3-puSiGIO8": vB3,
    iMEVdAhjchc: vIM,
    kC4jSSr15SU: vKC,
    KV0DNZ7rh3E: vKV,
    Cn9_caqHqCw: vCN,
    "6i_bBG_otTk": v6I,
    "0NwTGu8gfBo": v0N,
  },
} as const;

// Alt text for the service images (describes the picture, not the sales line)
export const SERVICE_ALT: Record<keyof typeof IMG.services, string> = {
  "paint-respray": "A spray gun laying a fresh coat on a car panel",
  "scratch-correction": "A machine polisher on a car panel, half corrected",
  "paint-restoration": "A car body in primer and masking, mid-restoration",
  ppf: "Clear protection film being squeegeed onto a bonnet",
  "ceramic-coating": "A coating applicator leaving a deeper gloss on the paint",
  "glass-coating": "Rain sheeting off a coated windscreen at night",
  "detailing-polishing": "A microfibre cloth on freshly polished paint",
  "interior-detailing": "A detailing brush working a leather seat seam",
  "interior-plastic-coating": "A dashboard trim, half coated, half faded",
};
