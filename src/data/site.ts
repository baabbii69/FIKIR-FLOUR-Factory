// All real Fikir Food Processing content. Contact shown here is the company's
// public info; lead submissions still route to the owner's Telegram/email for
// testing (see src/lib/leads.ts) until the client signs off.

export const CONTACT = {
  phone: "+251911491816",
  phones: ["+251911491816", "+251911491815", "+251930171717"],
  email: "Info@fikirfoods.et",
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
  city: "Adama, Ethiopia",
};

export const NAV = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/about", label: "About Us" },
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
  { value: 600, suffix: "+", label: "Team members" },
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
  // Reserved for later (kept optional so the model is CMS-ready). The detail
  // page only renders these blocks when real data is present — we never invent
  // nutrition figures for a real product.
  nutrition?: NutritionRow[];
  ingredients?: string;
};

// `hidden` keeps a category (and its products) in the data but out of the UI —
// chips is paused for now and can be brought back by flipping this flag.
export const CATEGORIES: { id: Category; label: string; note: string; hidden?: boolean }[] = [
  { id: "flour", label: "Flour", note: "Fortified wheat & corn flour" },
  { id: "biscuits", label: "Biscuits", note: "Unic sweet & energy biscuits" },
  { id: "wafers", label: "Wafers", note: "Unic cream wafers" },
  { id: "chips", label: "Chips", note: "Unic potato chips", hidden: true },
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

export const VALUES = [
  {
    icon: "seal",
    title: "Quality",
    text: "Every batch is made from selected raw materials and released only after strict laboratory testing.",
  },
  {
    icon: "handshake",
    title: "Honesty",
    text: "We build long-term trust with customers and partners through fair dealing and consistent products.",
  },
  {
    icon: "smiley",
    title: "Customer satisfaction",
    text: "From village shops to wholesalers, we serve every customer with the same care and reliability.",
  },
  {
    icon: "flask",
    title: "Innovation",
    text: "Modern imported machinery and new recipes let us keep introducing products people love.",
  },
  {
    icon: "leaf",
    title: "Social responsibility",
    text: "We create jobs for 600+ Ethiopians and contribute to our community and country's development.",
  },
];

export const WHY_US = [
  { title: "Over 15 years of experience", text: "A trusted Ethiopian manufacturer producing at scale since 2004 E.C." },
  { title: "High, certified quality", text: "Fortified flour carrying the Ethiopian Standards Mark, tested every batch." },
  { title: "A wide range", text: "Flour, biscuits, wafers, and chips, all under one trusted name." },
  { title: "Fast, nationwide delivery", text: "Our own fleet reaches agents, wholesalers, and retailers across Ethiopia." },
];

// The real fortification certificate (Institute of Ethiopian Standards).
export const CERTIFICATE = {
  authority: "Institute of Ethiopian Standards (IES)",
  title: "Ethiopian Standards Mark License",
  product: "Fortified Wheat Flour",
  standard: "CES 309:2024",
  license: "IES-CSMA/ESM51/2018R",
  note: "Fortified up to Vitamin B12, verified and licensed under the National Fortified Food scheme.",
};

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
  hero: `${M}/hero-banner.jpg`,
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
 * Video — a single place to switch on a feature video when footage arrives.
 * Set FEATURE_VIDEO to a source and it appears on the Facility page; leave it
 * null and nothing renders. `poster` is a still shown before play (use a real
 * frame or any facility image). Self-hosted files go in /public/media.
 * ------------------------------------------------------------------------ */
export type VideoSource =
  | { type: "youtube"; id: string; poster?: string; title?: string }
  | { type: "vimeo"; id: string; poster?: string; title?: string }
  | { type: "file"; src: string; poster?: string; title?: string };

export const FEATURE_VIDEO: VideoSource | null = null;

/* How Fikir is made — the pinned horizontal journey on the homepage. */
export type ProcessStep = { n: string; title: string; text: string; img: string };

export const PROCESS: ProcessStep[] = [
  { n: "01", title: "Grain intake", text: "Clean, high-grade wheat and potatoes are selected and checked before anything enters production.", img: IMAGES.facFlourBags },
  { n: "02", title: "Milling & fortification", text: "Modern imported mills turn wheat into fine, consistent flour, fortified up to Vitamin B12 to national standard.", img: IMAGES.facMill1 },
  { n: "03", title: "Baking & frying", text: "On dedicated lines we bake the Unic biscuits and wafers and fry the chips, fresh every shift.", img: IMAGES.facProductionHall },
  { n: "04", title: "Laboratory testing", text: "Our in-house lab tests every batch against quality and fortification targets before it is released.", img: IMAGES.facQcLab },
  { n: "05", title: "Packing", text: "Products are sealed, boxed, and stacked in the warehouse, ready to ship.", img: IMAGES.facPacking1 },
  { n: "06", title: "Nationwide delivery", text: "Our own branded fleet carries Fikir to agents, wholesalers, and shops across every region of Ethiopia.", img: IMAGES.facTrucks },
];

export const GALLERY: GalleryItem[] = [
  // Facility
  { src: IMAGES.facExterior, group: "facility", caption: "The plant, Adama", span: "tall", featured: true },
  { src: IMAGES.facSilos1, group: "facility", caption: "Grain storage silos", featured: true },
  { src: IMAGES.facReception, group: "facility", caption: "Reception" },
  { src: IMAGES.facOffice1, group: "facility", caption: "Our offices" },
  { src: IMAGES.facLounge, group: "facility", caption: "Executive lounge" },
  { src: IMAGES.facTrucks, group: "facility", caption: "Our own delivery fleet", span: "wide", featured: true },
  { src: IMAGES.facSecurity1, group: "facility", caption: "Round-the-clock monitoring" },
  // Production
  { src: IMAGES.facMill1, group: "production", caption: "The flour mill", span: "wide", featured: true },
  { src: IMAGES.facMill3, group: "production", caption: "Milling line" },
  { src: IMAGES.facQcLab, group: "production", caption: "Quality-control laboratory", featured: true },
  { src: IMAGES.facPacking1, group: "production", caption: "Packing the Unic lines" },
  { src: IMAGES.facBiscuitWarehouse, group: "production", caption: "Finished biscuits, ready to ship", span: "tall" },
  { src: IMAGES.facProductionHall, group: "production", caption: "Production hall", span: "wide" },
  { src: IMAGES.facFlourBags, group: "production", caption: "Fortified flour, bagged" },
  // Products / range
  { src: IMAGES.proRange, group: "products", caption: "The Unic range", span: "wide", featured: true },
  { src: `${M}/pack-abounded-1.jpg`, group: "products", caption: "Abounded sandwich biscuits", span: "tall" },
  { src: IMAGES.proCrackers, group: "products", caption: "Unic Crackers" },
  { src: `${M}/pack-wafer-vanilla-2.jpg`, group: "products", caption: "Unic wafer, vanilla" },
  { src: IMAGES.chipsTomato, group: "products", caption: "Unic chips, tomato" },
  { src: IMAGES.chipsPaprika, group: "products", caption: "Unic chips, paprika" },
  // People / lifestyle
  { src: IMAGES.proWaferFace, group: "people", caption: "Made for tea time", span: "tall", featured: true },
  { src: IMAGES.proBiscuitBite, group: "people", caption: "An everyday treat" },
  { src: IMAGES.lifeMarket, group: "people", caption: "On shelves nationwide" },
  { src: IMAGES.stillTea, group: "people", caption: "Better with a cup" },
];
