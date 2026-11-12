// Every business fact and every line of copy on the homepage lives here.
// Sources: research/client.md. Anything unverified is marked TODO(client) and is either
// left out of the page or worded so it states nothing we don't know.
// House style: no em or en dashes in anything a visitor can read.

export type ServiceGroup = "Paint" | "Protect" | "Detail";

export const site = {
  name: "Paint It Right",
  tagline: "Lifetime warranty for your car",
  url: "https://paintitright.vercel.app",
  description:
    "Car painting, dent and bumper repair, PPF and ceramic coating from one studio in Rajendra Place, New Delhi. Lifetime warranty on PPF and paint.",

  flags: {
    // keep the pitch out of search engines until the client approves the site
    noindex: true,
    // no real Google reviews yet (no Business Profile); the reviews block stays off
    reviews: false,
  },

  phones: [
    { display: "98101 78185", tel: "+919810178185" },
    { display: "98713 33206", tel: "+919871333206" },
    // TODO(client): 78600 00036 appears on reel end cards. Confirm which numbers are current.
  ],

  whatsapp: {
    number: "918448448030",
    display: "+91 84484 48030",
  },

  address: {
    line1: "130, Hog Market",
    line2: "Rajendra Place, New Delhi 110008",
    near: "A short walk from Rajendra Place metro station (Blue Line)",
    // Links by coordinates on purpose: the Maps listing at this address belongs to another
    // business. TODO(client): exact shop pin, ideally from their own Google Business Profile.
    // TODO(client): their WhatsApp profile says "130, Rajendra Market, New Delhi 110054"; ask them to fix it.
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=28.6446717%2C77.1772307",
  },

  // TODO(client): only Thursday (9:00 AM to 6:00 PM) is verified, from their WhatsApp profile.
  hours: [
    { day: "Monday", time: null },
    { day: "Tuesday", time: null },
    { day: "Wednesday", time: null },
    { day: "Thursday", time: "9:00 AM to 6:00 PM" },
    { day: "Friday", time: null },
    { day: "Saturday", time: null },
    { day: "Sunday", time: null },
  ] as { day: string; time: string | null }[],

  socials: {
    instagram: { url: "https://www.instagram.com/paintitright786/", handle: "@paintitright786" },
    youtube: { url: "https://www.youtube.com/@paintitright-n1x", handle: "@paintitright-n1x" },
    // A real profile, linked from their YouTube About. Leave url empty to hide it everywhere.
    facebook: { url: "https://www.facebook.com/profile.php?id=61593747489164", handle: "Paint It Right" },
  },

  nav: [
    { id: "services", label: "Services", desktop: true },
    { id: "results", label: "Results", desktop: false },
    { id: "process", label: "Process", desktop: true },
    { id: "work", label: "Work", desktop: true },
    { id: "videos", label: "Videos", desktop: false },
    { id: "faq", label: "FAQ", desktop: true },
    { id: "visit", label: "Visit", desktop: true },
  ],

  wa: {
    book: "Hi Paint It Right, I'd like to book a slot for my car. Car model: ",
    offer: "Hi Paint It Right, I saw the Diwali offer on your website (PPF + 3 free gifts). Please share the details for my car. Car model: ",
    inspect: "Hi Paint It Right, I'd like my car's paint inspected. Car model: ",
    visit: "Hi Paint It Right, I'd like to visit the studio. When is a good time? ",
    question: "Hi Paint It Right, I have a question: ",
  },

  hero: {
    lines: ["Painted right.", "Protected"],
    lean: "right.",
    sub: "Resprays, dent and bumper repair, PPF and ceramic coating, all from one studio in Rajendra Place, New Delhi. Lifetime warranty on PPF and paint.",
    imageAlt: "A deep red car under the studio's overhead lights",
  },

  offer: {
    enabled: true,
    // The client's post says only "Limited-Time Diwali Offer". This date just hides the
    // strip automatically and is never shown. TODO(client): real end date and eligible package.
    endsAt: "2026-11-30T23:59:59+05:30",
    label: "Diwali offer",
    title: "PPF + 3 free gifts",
    detail: "Complete car detailing, interior plastic coating and glass coating, free with your PPF.",
    note: "Limited-time offer",
    cta: "Claim on WhatsApp",
  },

  services: {
    title: "Paint. Protect. Detail.",
    intro: "One studio for the whole job, so the panel that gets painted is the panel that gets protected.",
    items: [
      {
        id: "paint-respray",
        group: "Paint" as ServiceGroup,
        name: "Car painting & full-body resprays",
        short: "Single panels to complete colour changes, matched to your car's paint.",
        points: [
          "Dents and damaged panels repaired before paint, like the Maybach GLS door we restored.",
          "Colour matching checked by the owner on every job.",
          "Trims and cladding painted gloss piano black, as on a Porsche Macan.",
        ],
      },
      {
        id: "scratch-correction",
        group: "Paint" as ServiceGroup,
        name: "Scratch repair & paint correction",
        short: "Swirls, holograms and light scratches cut out of the clear coat, not hidden under glaze.",
        points: [
          "Machine polishing in stages, from cutting to finishing.",
          "Deep scratches get a straight answer: polish, touch-up or repaint.",
          "Best done before PPF or ceramic, so nothing gets sealed in.",
        ],
      },
      {
        id: "paint-restoration",
        group: "Paint" as ServiceGroup,
        name: "Paint restoration",
        short: "Faded, oxidised or damaged paint brought back, panel by panel.",
        points: [
          "Bumpers restored instead of replaced, like the BMW X7 that came in cracked.",
          "Original parts kept wherever they can be saved.",
          "Full restorations too, like the BMW Z4.",
        ],
      },
      {
        id: "ppf",
        group: "Protect" as ServiceGroup,
        name: "Paint protection film (PPF)",
        short: "Clear film that takes the stone chips, scratches and bird droppings instead of your paint.",
        points: [
          "Fitted on cars like the Mercedes GLC 300, Toyota Vellfire and MG Majestor.",
          "Lifetime warranty on PPF. Ask us for the full terms.",
          "Pair it with a repaint or correction first, so the film seals in a clean finish.",
        ],
      },
      {
        id: "ceramic-coating",
        group: "Protect" as ServiceGroup,
        name: "Ceramic coating",
        short: "A hard, glossy layer that sheds Delhi dust and makes every wash quicker.",
        points: [
          "3M ceramic coating on the BMW M2 we finished recently.",
          "Deep gloss on freshly detailed paint, as on the BMW X3 and Toyota Camry.",
          "Water beads and runs off instead of drying into spots.",
        ],
      },
      {
        id: "glass-coating",
        group: "Protect" as ServiceGroup,
        name: "Glass coating",
        short: "Windscreen and window coating, so monsoon rain beads up and runs off.",
        points: [
          "A clearer view through heavy rain.",
          "Dust and bird droppings wipe off more easily.",
          "Works on the windscreen, side windows and mirrors.",
        ],
      },
      {
        id: "detailing-polishing",
        group: "Detail" as ServiceGroup,
        name: "Complete car detailing & polishing",
        short: "A full wash, decontamination and machine polish that resets the whole car.",
        points: [
          "Tar, iron fallout and road film lifted before any polishing.",
          "Machine polish for depth and gloss.",
          "The right preparation before any coating.",
        ],
      },
      {
        id: "interior-detailing",
        group: "Detail" as ServiceGroup,
        name: "Interior detailing",
        short: "Seats, carpets, roof lining and vents cleaned deep, including the dust Delhi pushes into every gap.",
        points: [
          "Leather and fabric cleaned to suit the material.",
          "Dashboards, door pads and vents detailed by hand.",
          "Ready for the daily commute again.",
        ],
      },
      {
        id: "interior-plastic-coating",
        group: "Detail" as ServiceGroup,
        name: "Interior plastic coating",
        short: "Dashboards and trims coated so they stop fading and cracking in 45°C summers.",
        points: [
          "Brings back an even finish on faded plastics.",
          "Easier to wipe clean.",
          "Pairs well with a full interior detail.",
        ],
      },
    ],
  },

  results: {
    title: "Same panel. Before and after.",
    lead: "Swirls and scratches cut out of the clear coat, then locked in with ceramic or PPF.",
    points: ["Swirls and holograms polished out, not filled in", "Depth and clarity back in the paint", "Protected so it stays that way"],
    cta: "Get your car inspected",
    // TODO(client): replace with a real before/after pair (Macan cladding or X7 bumper), then drop this tag
    tag: "Illustration",
  },

  process: {
    title: "Seven passes before your car goes home.",
    steps: [
      { title: "Inspection", text: "Every panel looked at under strong light, noting what Delhi has done to it: swirls, scratches, stone chips, a tired clear coat." },
      { title: "Wash & decontamination", text: "A full wash, then road tar, iron fallout and the fine dust that bonds to paint are lifted off, so nothing gets ground in." },
      { title: "Paint correction", text: "Machine polishing cuts swirls and light scratches out of the clear coat and brings the depth back." },
      { title: "Prep", text: "Edges and trims masked, every surface wiped clean, so film, coating or paint bonds properly." },
      { title: "PPF, coating or paint", text: "The chosen finish goes on: a fresh coat of paint, clear protection film, ceramic, or the right mix of them." },
      { title: "Cure", text: "Paint and coatings get the time they need to harden before the car faces sun, rain and dust again." },
      { title: "QC & handover", text: "A last check under the lights, then aftercare tips and your warranty details when you collect the car." },
    ],
  },

  work: {
    title: "Recent work.",
    intro: "Real cars from the studio. Tap a job to watch the reel.",
    items: [
      { id: "bmw-x7-bumper", car: "BMW X7", service: "Bumper restoration", story: "A cracked bumper, restored instead of replaced.", reel: "https://www.instagram.com/reel/DeY2FqdjMGf/" },
      { id: "porsche-macan-piano-black", car: "Porsche Macan", service: "Piano black finish", story: "Dull plastic cladding, now gloss piano black.", reel: "https://www.instagram.com/reel/DeS6JKIAQ-n/" },
      { id: "bmw-z4-restoration", car: "BMW Z4", service: "Repaint & restoration", story: "Smashed front and rear, repainted and brought back.", reel: "https://www.instagram.com/reel/DfB_eteih-I/" },
      { id: "mercedes-s-class-repaint-ppf", car: "Mercedes S-Class", service: "Repaint + PPF", story: "The repaint brought the look back. PPF locks it in.", reel: "https://www.instagram.com/reel/DceUAMwTnCT/" },
      { id: "mercedes-glc-ppf", car: "Mercedes GLC 300", service: "Paint protection film", story: "Clear film over the original paint.", reel: "https://www.instagram.com/reel/DfJ4iTFAtJT/" },
      { id: "bmw-x3-ceramic", car: "BMW X3", service: "Detailing + ceramic", story: "Detailed, then ceramic coated for a deep gloss.", reel: "https://www.instagram.com/reel/De1UfTSkUh_/" },
    ],
  },

  why: {
    title: "One studio. The whole job.",
    rows: [
      { label: "Paint + protect", title: "Fixed first, then protected.", text: "Dents, chips and faded panels are put right before any film or coating goes on. One team, one place, no running between a body shop and a detailer." },
      { label: "On the floor", title: "The owner works the job.", text: "Not from behind a desk. From colour matching to the final finish, every car is checked by him personally." },
      // TODO(client): define what "lifetime" covers before the site goes public
      { label: "Warranty", title: "Lifetime, on PPF and paint.", text: "It's written under our logo. Ask us for the full terms for your job before you book." },
      { label: "Cars", title: "Luxury cars are routine here.", text: "Mercedes-Benz, Maybach, BMW, Porsche, Toyota, Range Rover, MG, Audi." },
    ],
    imageAlt: "A spray gun laying down a coat of paint, mist catching the light",
  },

  proof: {
    title: "Every job goes on camera.",
    quote: "I got premium PPF on my MG Majestor from Paint It Right. Impressive craftsmanship on the PPF installation. Finish looks premium.",
    cite: "MG Majestor owner, on camera",
    video: { id: "B3-puSiGIO8", title: "MG Majestor PPF: customer review", duration: "0:58" },
    links: {
      instagram: "See the latest jobs",
      youtube: "Watch the Shorts",
      facebook: "Follow on Facebook",
    },
  },

  videos: {
    title: "Watch the work.",
    intro: "Short videos from the studio and the yard.",
    items: [
      { id: "iMEVdAhjchc", title: "Toyota Land Cruiser: full repaint", duration: "0:30" },
      { id: "kC4jSSr15SU", title: "Toyota Camry: damage to gloss", duration: "0:40" },
      { id: "KV0DNZ7rh3E", title: "Colour matching, checked by the owner", duration: "0:43" },
      { id: "Cn9_caqHqCw", title: "BMW M2: 3M ceramic coating", duration: "0:32" },
      { id: "6i_bBG_otTk", title: "Toyota Vellfire: PPF", duration: "0:45" },
      { id: "0NwTGu8gfBo", title: "Mercedes-Maybach: delivery day", duration: "0:52" },
    ],
  },

  faq: {
    title: "Before you book.",
    items: [
      {
        q: "PPF or ceramic coating: which does my car need?",
        a: "PPF is a clear film that physically takes stone chips and scratches. Ceramic is a hard, glossy coating that makes dust and water slide off and washing easier, but it won't stop a chip. Many owners put PPF on the front and ceramic over the rest. Tell us how and where you drive and we'll suggest the right mix.",
      },
      {
        // TODO(client): add the film and coating brands they use and the rated years
        q: "How long do PPF and ceramic coating last?",
        a: "It depends on the product and on how the car lives. A car parked in the open through Delhi summers ages faster than one under cover. We'll tell you the rated life of the exact film or coating before you book.",
      },
      {
        // TODO(client): typical durations per job
        q: "How long will my car be with you?",
        a: "It depends on the job: a detail is quicker than a full PPF wrap or a repaint. Paint and coatings also need time to harden. We'll give you a ready time when we inspect the car, and tell you when it's safe to wash.",
      },
      {
        q: "How do I look after it afterwards?",
        a: "Leave new film or coating alone for the first few days; we'll tell you the exact wait for your product. After that, hand wash rather than brush car washes, keep a pressure washer away from film edges, and wipe off bird droppings quickly, especially in summer.",
      },
      {
        // TODO(client): coverage, conditions, transferability
        q: "What does the lifetime warranty cover?",
        a: "Our lifetime warranty covers PPF and paintwork. Ask us for the full terms for your car and your job before you book, so you know exactly what's included.",
      },
      {
        q: "Can you match my car's paint exactly?",
        a: "Colour matching on every repaint is checked by the owner, from the first mix to the final coat. Metallic and pearl finishes take extra care, and we'll talk you through yours when we see the car.",
      },
      {
        q: "Can scratches be fixed without a respray?",
        a: "Often, yes. Light scratches and swirls usually polish out of the clear coat. Deeper ones that reach the colour coat may need a touch-up or a panel respray. We'll tell you which after a look.",
      },
    ],
  },

  visit: {
    title: "Visit the studio.",
    lead: "Bring the car in, or send us photos on WhatsApp first.",
  },

  footer: {
    line: "Protect your car. Trust the work.",
  },
} as const;

export const waLink = (text: string = site.wa.book) =>
  `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(text)}`;

export const telLink = (i = 0) => `tel:${site.phones[i].tel}`;

/** True while the offer should show. Called from the cached OfferStrip, which re-renders hourly. */
export function offerIsLive(now: number = Date.now()) {
  return site.offer.enabled && now <= Date.parse(site.offer.endsAt);
}
