// All real Fikir Food Processing content. Contact shown here is the company's
// public info; lead submissions still route to the owner's Telegram/email for
// testing (see src/lib/leads.ts) until the client signs off.

export const CONTACT = {
  phone: "+251911491816",
  phones: ["+251911491816", "+251911491815", "+251930171717"],
  email: "contact@fikirfoods.et",
  addressLines: ["Garalugo, Railway Station Area", "Adama, Oromia", "Ethiopia"],
  hours: [
    { days: "Monday to Friday", time: "08:00 - 17:30" },
    { days: "Saturday", time: "08:00 - 13:00" },
    { days: "Sunday", time: "Closed" },
  ],
};

export const COMPANY = {
  name: "Fikir Food Processing",
  tagline: "We produce quality; we deliver trust.",
  // Second line used in the company profile; kept for pages that want variety.
  taglineAlt: "Quality you can taste. Consistency you can trust.",
  city: "Adama, Ethiopia",
  established: "2011",
  ceo: "Ato Fikru Garedew",
  // Registration details as recorded in the company profile.
  registration: "ORO/ADM/K03/1/0000278/2006",
  tin: "0003227892",
  website: "www.fikirfoods.et",
};

/* Milestones from the company profile. Kept short — the profile flags the
 * founding narrative as still to be supplied by the company. */
export const MILESTONES = [
  { year: "2011", title: "Founded in Adama", text: "Fikir Food Processing is established on the Adama corridor and enters the wheat flour market." },
  { year: "2019", title: "Unic biscuits launched", text: "The Unic brand launches and grows into our flagship consumer product, expanding from plain to apple-vanilla." },
  { year: "2020", title: "Wafers join the range", text: "Our cream wafer line launches, adding a second branded snack category alongside the biscuits." },
  { year: "Today", title: "Consolidating and building", text: "We hold our place in flour, biscuits, and wafers while preparing the next production line on land already secured." },
];

export const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/products", label: "Products" },
  { to: "/facility", label: "Facility" },
  { to: "/gallery", label: "Gallery" },
  { to: "/careers", label: "Careers" },
  { to: "/contact", label: "Contact" },
];

// Job openings. Edit this list to post/remove opportunities. Empty array =>
// the Careers page shows a "no current openings, send your CV" state.
export const OPENINGS = [
  {
    title: "Production Operators",
    type: "Full-time",
    location: "Adama plant",
    note: "Operate and monitor our flour, biscuit, wafer, and chips lines, keeping quality and safety high.",
  },
  {
    title: "Sales Representatives",
    type: "Full-time",
    location: "Nationwide",
    note: "Grow our distribution network with agents, wholesalers, and retailers across Ethiopia.",
  },
  {
    title: "Delivery Drivers",
    type: "Full-time",
    location: "Adama / regional",
    note: "Operate our own branded fleet, delivering fresh products to customers on time.",
  },
];

export const STATS = [
  { value: 15, suffix: "+", label: "Years of production" },
  // Workforce figure per the company profile (1,026 employees).
  { value: 1026, suffix: "", label: "Team members" },
  { value: 12, suffix: "+", label: "Biscuit flavors" },
  { value: 4, suffix: "", label: "Flour grades" },
];

export type Category = "flour" | "biscuits" | "wafers" | "chips";

export type NutritionRow = { label: string; value: string };

export type Product = {
  slug: string;
  name: string;
  category: Category;
  brand: "Fikir" | "Unic";
  image: string; // primary/card image. empty string => typographic placeholder card
  gallery?: string[]; // extra detail-page shots, shown after `image`
  blurb: string;
  meta?: string; // pack sizes (flour) or descriptor (snacks)
  badge?: string;
  /** Set when the product's category is paused. */
  paused?: boolean;
  // Reserved for later (kept optional so the model is CMS-ready). The detail
  // page only renders these blocks when real data is present — we never invent
  // nutrition figures for a real product.
  nutrition?: NutritionRow[];
  ingredients?: string;
};

// `paused` keeps a line on the site with a "temporarily unavailable" note
// rather than removing it — chips have stopped for now but are coming back.
// These are only fallbacks; the CMS is the source of truth.
export const CATEGORIES: { id: Category; label: string; note: string; paused?: boolean }[] = [
  { id: "flour", label: "Flour", note: "Fortified wheat & corn flour" },
  { id: "biscuits", label: "Biscuits", note: "Unic sweet & energy biscuits" },
  { id: "wafers", label: "Wafers", note: "Unic cream wafers" },
  { id: "chips", label: "Chips", note: "Unic potato chips", paused: true },
];

const M = "/media";
const P = "/media/products";

export const PRODUCTS: Product[] = [
  // ---- Flour ----
  {
    slug: "special",
    name: "Special Flour",
    category: "flour",
    brand: "Fikir",
    image: `${M}/pack-flour-special-3.jpg`,
    gallery: [`${M}/pack-flour-special-2.jpg`, `${M}/pack-flour-special-1.jpg`, `${M}/flour-special.jpg`],
    blurb:
      "Our export-grade wheat flour, milled to a fine, consistent standard and fortified up to Vitamin B12. The choice for bakeries that need reliable results at scale.",
    meta: "5 · 10 · 25 · 50 kg",
    badge: "Export grade",
  },
  {
    slug: "3f",
    name: "3F Flour",
    category: "flour",
    brand: "Fikir",
    image: `${M}/pack-flour-3f-1.jpg`,
    gallery: [`${M}/flour-3f.jpg`],
    blurb:
      "A dependable all-purpose wheat flour for everyday baking and injera, fortified to national standards and trusted across Ethiopian kitchens.",
    meta: "25 · 50 kg",
  },
  {
    slug: "1k",
    name: "1K Flour",
    category: "flour",
    brand: "Fikir",
    image: `${M}/flour-1k.jpg`,
    blurb:
      "Value wheat flour produced to international standard, fortified and packed for wholesalers, retailers, and high-volume kitchens.",
    meta: "25 · 50 kg",
  },
  {
    slug: "corn",
    name: "Corn Flour",
    category: "flour",
    brand: "Fikir",
    image: `${P}/p-corn.jpg`,
    blurb:
      "Finely milled corn flour for traditional and modern recipes, produced on the same modern lines and to the same quality standard as our wheat flour.",
    meta: "By request",
  },

  // ---- Biscuits (Unic) ----
  {
    slug: "high-energy",
    name: "Unic High Energy Biscuits",
    category: "biscuits",
    brand: "Unic",
    image: `${M}/pack-high-energy-1.jpg`,
    gallery: [`${M}/pack-high-energy-2.jpg`, `${M}/pack-high-energy-3.jpg`],
    blurb: "Our flagship glucose-rich biscuit, baked for everyday energy. A national favorite.",
    meta: "Sweet biscuit",
    badge: "Best seller",
  },
  {
    slug: "vanilla-sandwich",
    name: "Unic Vanilla Sandwich",
    category: "biscuits",
    brand: "Unic",
    image: `${M}/pack-vanilla-sandwich-1.jpg`,
    gallery: [`${M}/pack-vanilla-sandwich-2.jpg`],
    blurb: "Crisp biscuits filled with smooth vanilla cream.",
    meta: "Cream biscuit",
  },
  {
    slug: "apple-vanilla",
    name: "Unic Apple Vanilla",
    category: "biscuits",
    brand: "Unic",
    image: `${M}/pack-apple-vanilla-1.jpg`,
    blurb: "Cream sandwich biscuits with a bright apple-vanilla flavor.",
    meta: "Cream biscuit",
  },
  {
    slug: "banana",
    name: "Unic Banana",
    category: "biscuits",
    brand: "Unic",
    image: `${P}/b-banana.png`,
    blurb: "Banana-flavored cream biscuits that kids and grown-ups reach for.",
    meta: "Cream biscuit",
  },
  {
    slug: "cappuccino",
    name: "Unic Cappuccino",
    category: "biscuits",
    brand: "Unic",
    image: `${P}/b-cappuccino.png`,
    blurb: "Coffee-cream filled biscuits with a rich cappuccino note.",
    meta: "Cream biscuit",
  },
  {
    slug: "glucose",
    name: "Unic Glucose",
    category: "biscuits",
    brand: "Unic",
    image: `${P}/b-glucose.png`,
    blurb: "Light, crisp glucose biscuits, perfect with tea or milk.",
    meta: "Sweet biscuit",
  },
  {
    slug: "abounded",
    name: "Unic Abounded Sandwich",
    category: "biscuits",
    brand: "Unic",
    image: `${M}/pack-abounded-1.jpg`,
    gallery: [`${M}/pack-abounded-2.jpg`, `${M}/pack-abounded-3.jpg`, `${M}/pro-abounded.jpg`],
    blurb: "Round sandwich biscuits in a family box, a lunchbox and tea-time staple.",
    meta: "Boxed sandwich biscuit",
  },
  {
    slug: "zoo",
    name: "Unic Zoo Biscuits",
    category: "biscuits",
    brand: "Unic",
    image: `${P}/p-zoo.jpg`,
    blurb: "Fun animal-shaped biscuits made for little hands and big smiles.",
    meta: "Kids' biscuit",
  },
  {
    slug: "crackers",
    name: "Unic Crackers",
    category: "biscuits",
    brand: "Unic",
    image: `${M}/pack-crackers-1.jpg`,
    gallery: [`${M}/pack-crackers-2.jpg`],
    blurb: "Light, crisp savory crackers, made for snacking on their own or with a spread.",
    meta: "Savory biscuit",
  },

  // ---- Wafers (Unic) ----
  {
    slug: "wafer-chocolate",
    name: "Unic Wafer Chocolate",
    category: "wafers",
    brand: "Unic",
    image: `${M}/pack-wafer-chocolate-1.jpg`,
    blurb: "Crisp wafers layered with rich chocolate cream.",
    meta: "Cream wafer",
  },
  {
    slug: "wafer-vanilla",
    name: "Unic Wafer Vanilla",
    category: "wafers",
    brand: "Unic",
    image: `${M}/pack-wafer-vanilla-2.jpg`,
    gallery: [`${M}/pack-wafer-vanilla-1.jpg`, `${M}/pack-wafer-vanilla-3.jpg`],
    blurb: "Light wafers with smooth vanilla cream.",
    meta: "Cream wafer",
  },
  {
    slug: "wafer-mango",
    name: "Unic Wafer Mango",
    category: "wafers",
    brand: "Unic",
    image: `${M}/pack-wafer-mango-1.jpg`,
    gallery: [`${M}/pack-wafer-mango-2.jpg`, `${M}/pack-wafer-mango-3.jpg`, `${M}/pack-wafer-mango-4.jpg`],
    blurb: "Crisp wafers layered with sweet mango cream.",
    meta: "Cream wafer",
    badge: "New",
  },
  {
    slug: "wafer-orange",
    name: "Unic Wafer Orange",
    category: "wafers",
    brand: "Unic",
    image: `${P}/w-orange.png`,
    blurb: "Crisp wafers with a zesty orange cream filling.",
    meta: "Cream wafer",
  },

  // ---- Chips (Unic) ----
  {
    slug: "chips-tomato",
    name: "Unic Chips Tomato",
    category: "chips",
    brand: "Unic",
    image: `${M}/chips-tomato.jpg`,
    blurb: "Crunchy potato chips with a tangy tomato seasoning. 100% natural.",
    meta: "40g · 120g",
    badge: "New",
  },
  {
    slug: "chips-paprika",
    name: "Unic Chips Paprika",
    category: "chips",
    brand: "Unic",
    image: `${M}/chips-paprika.jpg`,
    blurb: "Bold paprika-spiced potato chips made from the best Ethiopian potatoes.",
    meta: "40g · 120g",
  },
  {
    slug: "chips-natural",
    name: "Unic Chips Natural",
    category: "chips",
    brand: "Unic",
    image: `${P}/p-natural.jpg`,
    blurb: "Lightly salted natural potato chips, no cholesterol, 100% natural.",
    meta: "40g · 120g",
  },
];

/* The six core values as set out in the company profile. */
export const VALUES = [
  {
    icon: "seal",
    title: "Quality first",
    text: "Quality is non-negotiable, even in a market that competes on volume and cost. Every batch is released only after strict laboratory testing.",
  },
  {
    icon: "handshake",
    title: "Integrity",
    text: "We do not compromise the integrity of our ingredients or the finished product in pursuit of efficiency.",
  },
  {
    icon: "trend",
    title: "Continuous improvement",
    text: "We improve continuously, reducing waste, upgrading skills, and modernising our processes year after year.",
  },
  {
    icon: "smiley",
    title: "Customer focus",
    text: "We earn loyalty by delivering the same taste and the same standard, batch after batch.",
  },
  {
    icon: "users",
    title: "Shared prosperity",
    text: "We grow in ways that create jobs, empower women, and strengthen Ethiopia's food security.",
  },
  {
    icon: "flask",
    title: "Innovation",
    text: "We innovate in products, flavours, and processes to stay ahead of changing tastes.",
  },
];

/* Why customers stay — drawn from the profile's competitive advantages,
 * framed for the customer rather than the investor. */
export const WHY_US = [
  {
    title: "A brand Ethiopians already trust",
    text: "Unic has earned its shelf recognition pack by pack over more than a decade. That trust is the hardest thing for any newcomer to copy.",
  },
  {
    title: "Quality-led in a cost-led market",
    text: "Where most competitors race to the bottom on price, we hold the standard on ingredients and finished product.",
  },
  {
    title: "We mill the flour we bake with",
    text: "Our biscuit lines run on our own flour, so we control quality and cost from the inside instead of hoping a supplier delivers.",
  },
  {
    title: "Fortified and certified",
    text: "Our wheat flour is fortified up to Vitamin B12 and carries the Institute of Ethiopian Standards mark, verified batch by batch.",
  },
  {
    title: "Fast, nationwide delivery",
    text: "Our own branded fleet reaches agents, wholesalers, and retailers in every region of the country.",
  },
  {
    title: "Room to grow with you",
    text: "Land next to the plant is already secured for our next production line, so rising demand does not outrun our capacity.",
  },
];

// The real fortification certificate (Institute of Ethiopian Standards).
// Verified against the licence document: renewed annually, current term runs
// 4 June 2026 to 3 June 2027 — `validUntil` needs updating on each renewal.
export const CERTIFICATE = {
  authority: "Institute of Ethiopian Standards (IES)",
  title: "Ethiopian Standards Mark License",
  product: "Fortified Wheat Flour",
  standard: "CES 309:2024",
  license: "IES-CSMA/ESM51/2018R",
  validUntil: "3 June 2027",
  note: "Fortified up to Vitamin B12, verified and licensed under the National Fortified Food scheme.",
};

// Second, independent conformity certificate for the same product.
export const CERTIFICATE_2 = {
  authority: "Bless Agrifood Laboratory Services",
  title: "Mark of Conformity",
  product: "Fortified Wheat Flour",
  standard: "CES 309:2024",
  license: "BPCU10215",
  validUntil: "13 April 2028",
  note: "Independently certified in collaboration with the Institute of Ethiopian Standards.",
};

/* --------------------------------------------------------------------------
 * Awards & recognition.
 *
 * Every entry below is transcribed from a physical certificate or trophy held
 * by the company. The awards are addressed to the founder in his capacity as
 * the company's representative, so the section is framed that way.
 *
 * Deliberately excluded, and why:
 *  - A 50,000 birr administrative tax penalty notice (Addis Ababa Revenues
 *    Bureau) — a confidential legal document, and the opposite of a credential.
 *  - Two staff training certificates — they name a private employee and prove
 *    an individual's training, not the company's compliance. The capability is
 *    stated as `STAFF_TRAINING` below instead, without naming anyone.
 *  - The EFDA Certificate of Competence — lapsed 18 June 2026; must not be
 *    advertised until the renewal is in hand.
 *  - Minor local acknowledgements (electric utility, police, sub-city offices,
 *    an insurer's loyalty award, a broadcaster's cooperation note) — listing
 *    them would dilute the genuinely strong entries.
 * ------------------------------------------------------------------------ */
export type AwardGroup = "tax" | "partners" | "press";

export type Award = {
  group: AwardGroup;
  year: string;
  issuer: string;
  text: string;
};

export const AWARDS: Award[] = [
  {
    group: "tax",
    year: "2017 E.C.",
    issuer: "Adama City Administration, Office of the Mayor",
    text: "For paying 30,636,554.86 birr in government revenue on time, and for the part the company played in the city's development that year.",
  },
  {
    group: "tax",
    year: "2017 E.C.",
    issuer: "Oromia Revenue Bureau",
    text: "Gold tier for tax performance in the budget year.",
  },
  {
    group: "tax",
    year: "2014 E.C.",
    issuer: "Adama City Revenue Office",
    text: "Named among the leading taxpayers in Adama for the budget year.",
  },
  {
    group: "partners",
    year: "Ongoing",
    issuer: "Cooperative Bank of Oromia · Bank of Abyssinia",
    text: "Both banks have given us a certificate of recognition for a long working relationship.",
  },
  {
    group: "partners",
    year: "Ongoing",
    issuer: "Ethiopian Red Cross Society",
    text: "A corporate member, supporting the Society's work in Oromia.",
  },
  {
    group: "press",
    year: "2015 E.C.",
    issuer: "Addis Zemen",
    text: "The national daily ran a full-page feature on our founder, titled 'A successful business life, built on a work ethic inherited from his father'.",
  },
];

/** Stated as a capability, without publishing an employee's personal certificate. */
export const STAFF_TRAINING =
  "Our milling and quality staff also hold external training certificates in fortification efficiency and in workplace health and safety.";

/* The documents themselves, shown in the rotating frame on the About page.
 * Scans are portrait and vary in shape, so the UI renders them contained
 * rather than cropped. Excluded for the reasons listed above AWARDS. */
export type CertShot = { src: string; caption: string };

export const CERT_SHOTS: CertShot[] = [
  { src: `${M}/cert-ies.jpg`, caption: "Ethiopian Standards Mark licence for fortified wheat flour" },
  { src: `${M}/cert-bless.jpg`, caption: "Mark of Conformity, Bless Agrifood Laboratory Services" },
  { src: `${M}/cert-adama-mayor.jpg`, caption: "Certificate of recognition, Adama City Administration" },
  { src: `${M}/cert-adama-revenue.jpg`, caption: "Leading taxpayer certificate, Adama City Revenue Office" },
  { src: `${M}/cert-oromia-revenue.jpg`, caption: "Tax performance certificate, Oromia Revenue Bureau" },
  { src: `${M}/cert-coopbank.jpg`, caption: "Certificate of recognition, Cooperative Bank of Oromia" },
  { src: `${M}/awards-trophies.jpg`, caption: "Trophies and plaques at the Adama head office" },
];

export const QUALITY_STEPS = [
  {
    step: "01",
    title: "Selected raw materials",
    text: "We source clean, high-grade wheat and potatoes, checking every intake before it enters production.",
  },
  {
    step: "02",
    title: "Modern manufacturing",
    text: "Imported, world-standard machinery mills, mixes, bakes, and packs with consistency at volume.",
  },
  {
    step: "03",
    title: "Strict laboratory testing",
    text: "Our lab tests each batch against quality and fortification targets before it is released.",
  },
  {
    step: "04",
    title: "Food safety requirements",
    text: "Every product meets national and international food-safety standards, batch after batch.",
  },
];

export const FAQS = [
  {
    q: "Where can I buy Fikir products?",
    a: "Our flour, biscuits, wafers, and chips are distributed across all regions of Ethiopia through agents, wholesalers, and retailers. Contact us and we'll point you to the nearest supplier.",
  },
  {
    q: "How do I become a distributor or agent?",
    a: "We're always expanding our distribution network. Send us your details through the contact form or call us, and our team will get back to you.",
  },
  {
    q: "Is your flour fortified?",
    a: "Yes. Our wheat flour is fortified up to Vitamin B12 and carries the Institute of Ethiopian Standards mark for fortified wheat flour (CES 309:2024).",
  },
  {
    q: "What pack sizes do you offer?",
    a: "Special flour comes in 5, 10, 25, and 50 kg; 3F and 1K in 25 and 50 kg. Biscuits, wafers, and chips are available in single packs and wholesale cartons.",
  },
  {
    q: "Do you export?",
    a: "We currently serve the Ethiopian market nationwide. Expanding to export markets is part of our growth plan, so please reach out to discuss opportunities.",
  },
];

// Placeholder testimonials — replace the quotes/names with real customer
// feedback when the client provides it. Kept generic and true-to-business.
export const TESTIMONIALS = [
  {
    quote:
      "We've stocked Fikir flour and Unic biscuits for years. The quality is consistent and our customers keep coming back.",
    name: "Wholesale partner",
    role: "Adama",
  },
  {
    quote:
      "Deliveries arrive on time with their own trucks, and the fortified flour is exactly what families ask for.",
    name: "Retail shop owner",
    role: "Oromia",
  },
  {
    quote:
      "Unic biscuits and chips move fast off our shelves. A trusted Ethiopian brand at a fair price.",
    name: "Distributor",
    role: "Ethiopia",
  },
];

export const IMAGES = {
  // Brand / hero
  hero: `${M}/hero-banner-v2.jpg`,
  building: `${M}/building.jpg`,
  silos: `${M}/silos.jpg`,
  flourPoster: `${M}/flour-poster.jpg`,
  signageHero: `${M}/signage-1.jpg`,
  signageAlt: `${M}/signage-2.jpg`,
  lifeBiscuit: `${M}/pro-seated.jpg`, // upgraded to studio shot 01
  lifeChipsGirl: `${M}/life-1.jpg`,
  lifeChipsHand: `${M}/life-chips.jpg`,
  lifeMarket: `${M}/life-market.jpg`,
  lifeAbounded: `${M}/life-abounded.jpg`,
  stillMilk: `${M}/still-milk.jpg`,
  stillTea: `${M}/still-tea.jpg`,
  // Studio shoot 01 (professional model + product, grey seamless)
  proRange: `${M}/pro-range.jpg`,
  proWaferFace: `${M}/pro-wafer-face.jpg`,
  proWaferHold: `${M}/pro-wafer-hold.jpg`,
  proWaferHand: `${M}/pro-wafer-hand.jpg`,
  proBiscuitPlay: `${M}/pro-biscuit-play.jpg`,
  proBiscuitBite: `${M}/pro-biscuit-bite.jpg`,
  proSeated: `${M}/pro-seated.jpg`,
  proAbounded: `${M}/pro-abounded.jpg`,
  proVanilla: `${M}/pro-vanilla.jpg`,
  proCrackers: `${M}/pro-crackers.jpg`,
  // Facility / distribution
  fleet: `${M}/fleet-2.jpg`,
  fleetAlt: `${M}/fleet-1.jpg`,
  warehouse: `${M}/warehouse-flour.jpg`,
  // Products
  chipsTomato: `${M}/chips-tomato.jpg`,
  chipsPaprika: `${M}/chips-paprika.jpg`,
  // Facility shoot 03 (real plant photography)
  facQcLab: `${M}/fac-qc-lab.jpg`,
  facMill1: `${M}/fac-mill-1.jpg`,
  facMill2: `${M}/fac-mill-2.jpg`,
  facMill3: `${M}/fac-mill-3.jpg`,
  facMill4: `${M}/fac-mill-4.jpg`,
  facFlourWarehouse: `${M}/fac-flour-warehouse.jpg`,
  facFlourBags: `${M}/fac-flour-bags.jpg`,
  facSilos1: `${M}/fac-silos-1.jpg`,
  facSilos2: `${M}/fac-silos-2.jpg`,
  facExterior: `${M}/fac-exterior.jpg`,
  facReception: `${M}/fac-reception.jpg`,
  facOffice1: `${M}/fac-office-1.jpg`,
  facOffice2: `${M}/fac-office-2.jpg`,
  facSecurity1: `${M}/fac-security-1.jpg`,
  facSecurity2: `${M}/fac-security-2.jpg`,
  facLounge: `${M}/fac-lounge.jpg`,
  facTrucks: `${M}/fac-trucks.jpg`,
  facBiscuitWarehouse: `${M}/fac-biscuit-warehouse.jpg`,
  facPacking1: `${M}/fac-packing-1.jpg`,
  facPacking2: `${M}/fac-packing-2.jpg`,
  facProductionHall: `${M}/fac-production-hall.jpg`,
  // Video stills 04 (extracted from the company film)
  ceo: `${M}/ceo.jpg`,
  ceoMeeting: `${M}/ceo-meeting.jpg`,
  distribution1: `${M}/distribution-1.jpg`,
  distribution2: `${M}/distribution-2.jpg`,
  factoryAerial: `${M}/factory-aerial.jpg`,
  grainIntake: `${M}/grain-intake.jpg`,
  certificates: `${M}/certificates.jpg`,
  awards: `${M}/awards-trophies.jpg`,
  teamGroup: `${M}/team-group.jpg`,
  wheatFarming: `${M}/wheat-farming.jpg`,
  biscuitLine: `${M}/biscuit-line.jpg`,
};

/* --------------------------------------------------------------------------
 * Gallery — photos from around the company and the range.
 * `span` is a layout hint for the bento/masonry gallery ("wide" = 2 cols,
 * "tall" = 2 rows). `featured` items surface in the homepage/facility teaser.
 * Seeded from current media; the batch-02/03 studio + factory photos get
 * curated in here during the asset pass.
 * ------------------------------------------------------------------------ */
export type GalleryGroup = "facility" | "production" | "products" | "people";

export type GalleryItem = {
  src: string;
  group: GalleryGroup;
  caption: string;
  span?: "wide" | "tall";
  featured?: boolean;
};

/* --------------------------------------------------------------------------
 * Video source shape, used by VideoBlock.
 *
 * The film itself is no longer configured here: both URLs live on the Home page
 * document in Sanity, so the client can swap in a YouTube or Vimeo link without
 * a developer. That also keeps ~70 MB of video out of every Plesk upload.
 * ------------------------------------------------------------------------ */
export type VideoSource =
  | { type: "youtube"; id: string; poster?: string; title?: string }
  | { type: "vimeo"; id: string; poster?: string; title?: string }
  | { type: "file"; src: string; poster?: string; title?: string };



/* How Fikir is made — the pinned horizontal journey on the homepage. */
export type ProcessStep = { n: string; title: string; text: string; img: string };

export const PROCESS: ProcessStep[] = [
  { n: "01", title: "Grain intake", text: "Clean, high-grade wheat is selected and checked before anything enters production.", img: IMAGES.grainIntake },
  { n: "02", title: "Milling & fortification", text: "Modern imported mills turn wheat into fine, consistent flour, fortified up to Vitamin B12 to national standard.", img: IMAGES.facMill1 },
  { n: "03", title: "Baking", text: "On dedicated lines we bake the Unic biscuits and wafers, fresh every shift.", img: IMAGES.biscuitLine },
  { n: "04", title: "Laboratory testing", text: "Our in-house lab tests every batch against quality and fortification targets before it is released.", img: IMAGES.facQcLab },
  { n: "05", title: "Packing", text: "Products are sealed, boxed, and stacked in the warehouse, ready to ship.", img: IMAGES.facPacking1 },
  { n: "06", title: "Nationwide delivery", text: "Our own branded fleet carries Fikir to agents, wholesalers, and shops across every region of Ethiopia.", img: IMAGES.distribution1 },
];

export const GALLERY: GalleryItem[] = [
  // Facility
  { src: IMAGES.factoryAerial, group: "facility", caption: "The plant from above, Adama", span: "wide", featured: true },
  { src: IMAGES.facExterior, group: "facility", caption: "The plant, Adama", span: "tall", featured: true },
  { src: IMAGES.facSilos1, group: "facility", caption: "Grain storage silos" },
  { src: IMAGES.facReception, group: "facility", caption: "Reception" },
  { src: IMAGES.certificates, group: "facility", caption: "Certifications & awards" },
  { src: IMAGES.facOffice1, group: "facility", caption: "Our offices" },
  { src: IMAGES.facLounge, group: "facility", caption: "Executive lounge" },
  { src: IMAGES.facTrucks, group: "facility", caption: "Our own delivery fleet", span: "wide", featured: true },
  { src: IMAGES.distribution2, group: "facility", caption: "Distributing nationwide" },
  { src: IMAGES.facSecurity1, group: "facility", caption: "Round-the-clock monitoring" },
  // Production
  { src: IMAGES.facMill1, group: "production", caption: "The flour mill", span: "wide", featured: true },
  { src: IMAGES.facMill3, group: "production", caption: "Milling line" },
  { src: IMAGES.wheatFarming, group: "production", caption: "Wheat harvest", span: "wide" },
  { src: IMAGES.facQcLab, group: "production", caption: "Quality-control laboratory", featured: true },
  { src: IMAGES.biscuitLine, group: "production", caption: "The biscuit line" },
  { src: IMAGES.facPacking1, group: "production", caption: "Packing the Unic lines" },
  { src: IMAGES.facBiscuitWarehouse, group: "production", caption: "Finished biscuits, ready to ship", span: "tall" },
  { src: IMAGES.facProductionHall, group: "production", caption: "Production hall", span: "wide" },
  { src: IMAGES.facFlourBags, group: "production", caption: "Fortified flour, bagged" },
  // Products / range
  { src: IMAGES.proRange, group: "products", caption: "The Unic range", span: "wide", featured: true },
  { src: `${M}/pack-abounded-1.jpg`, group: "products", caption: "Abounded sandwich biscuits", span: "tall" },
  { src: IMAGES.proCrackers, group: "products", caption: "Unic Crackers" },
  { src: `${M}/pack-wafer-vanilla-2.jpg`, group: "products", caption: "Unic wafer, vanilla" },
  { src: `${M}/pack-high-energy-1.jpg`, group: "products", caption: "Unic High Energy biscuits" },
  { src: `${M}/pack-wafer-mango-1.jpg`, group: "products", caption: "Unic Wafer Mango" },
  // People / lifestyle
  { src: IMAGES.teamGroup, group: "people", caption: "The Fikir team", span: "wide", featured: true },
  { src: IMAGES.ceoMeeting, group: "people", caption: "Leadership at work" },
  { src: IMAGES.proWaferFace, group: "people", caption: "Made for tea time", span: "tall" },
  { src: IMAGES.proBiscuitBite, group: "people", caption: "An everyday treat" },
  { src: IMAGES.lifeMarket, group: "people", caption: "On shelves nationwide" },
  { src: IMAGES.stillTea, group: "people", caption: "Better with a cup" },
];
