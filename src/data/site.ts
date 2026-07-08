export const CONTACT = {
  phone: "+251922802813",
  email: "joealex69420@gmail.com",
  addressLines: ["Adama Kebele 03, Sodere Road", "Behind Bekelcha Transport", "Adama, Ethiopia"],
  hours: [
    { days: "Monday to Friday", time: "07:00 - 17:00" },
    { days: "Saturday", time: "08:00 - 13:00" },
    { days: "Sunday", time: "Closed" },
  ],
};

export const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/products", label: "Products" },
  { to: "/factory", label: "Our Factory" },
  { to: "/contact", label: "Contact" },
];

export const STATS = [
  { value: 62, suffix: "+", label: "Years of milling" },
  { value: 2400, suffix: " MT", label: "Daily production" },
  { value: 38, suffix: "", label: "Export markets" },
  { value: 850, suffix: "+", label: "Clients worldwide" },
];

export type Product = {
  slug: string;
  name: string;
  category: "standard" | "specialty" | "whole" | "industrial" | "custom";
  categoryLabel: string;
  description: string;
  specs: { label: string; value: string }[];
  image: string;
  badge?: string;
};

export const PRODUCTS: Product[] = [
  {
    slug: "all-purpose",
    name: "All-Purpose Flour",
    category: "standard",
    categoryLabel: "Standard Range",
    description:
      "Our flagship multipurpose flour for breads, pastries, biscuits, pasta, and coatings. The benchmark for manufacturers who need reliability and versatility.",
    specs: [
      { label: "Protein", value: "10-12%" },
      { label: "Moisture", value: "≤14%" },
      { label: "Ash", value: "0.55%" },
    ],
    image:
      "https://images.unsplash.com/photo-1714842981153-ffeaf74e7a1a?q=80&w=1200&auto=format&fit=crop",
    badge: "Best seller",
  },
  {
    slug: "bread",
    name: "High-Gluten Bread Flour",
    category: "standard",
    categoryLabel: "Standard Range",
    description:
      "Milled from hard wheat for superior gluten development. Consistent volume, excellent crust formation, and reliable results on industrial dough lines.",
    specs: [
      { label: "Protein", value: "13-14.5%" },
      { label: "Moisture", value: "≤14%" },
      { label: "Ash", value: "0.60%" },
    ],
    image:
      "https://images.unsplash.com/photo-1549413468-cd78edb7e75c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    slug: "pastry",
    name: "Silken Pastry Flour",
    category: "standard",
    categoryLabel: "Standard Range",
    description:
      "Low-protein, finely ground flour for delicate pastry work: croissants, biscuits, wafers, and cakes that need tenderness and a fine crumb.",
    specs: [
      { label: "Protein", value: "8-9%" },
      { label: "Moisture", value: "≤13.5%" },
      { label: "Ash", value: "0.45%" },
    ],
    image:
      "https://images.unsplash.com/photo-1623334044303-241021148842?q=80&w=1200&auto=format&fit=crop",
  },
  {
    slug: "whole-wheat",
    name: "Stone-Ground Whole Wheat",
    category: "whole",
    categoryLabel: "Whole Grain",
    description:
      "Complete whole grain flour with bran, germ, and endosperm fully retained. Rich in fiber and minerals, in fine, medium, and coarse granulations.",
    specs: [
      { label: "Protein", value: "13-15%" },
      { label: "Moisture", value: "≤14.5%" },
      { label: "Fiber", value: "10-12%" },
    ],
    image:
      "https://images.unsplash.com/photo-1565181917578-a87c12e04ff7?q=80&w=1200&auto=format&fit=crop",
  },
  {
    slug: "spelt",
    name: "Spelt Flour",
    category: "specialty",
    categoryLabel: "Specialty",
    description:
      "An ancient grain prized for its nutty flavor and digestibility, milled carefully to preserve its heritage character. Excellent for artisan breads.",
    specs: [
      { label: "Protein", value: "12-14%" },
      { label: "Moisture", value: "≤14%" },
      { label: "Origin", value: "Heritage" },
    ],
    image:
      "https://images.unsplash.com/photo-1650387106190-c6a9013f3fc8?q=80&w=1200&auto=format&fit=crop",
  },
  {
    slug: "tipo-00",
    name: "Tipo 00 Artisan Flour",
    category: "specialty",
    categoryLabel: "Specialty",
    description:
      "Ultra-fine, double-milled flour with exceptional elasticity and a silky texture. The benchmark for Neapolitan pizza, fresh pasta, and gnocchi.",
    specs: [
      { label: "Protein", value: "11.5-12.5%" },
      { label: "Moisture", value: "≤14%" },
      { label: "Grade", value: "Tipo 00" },
    ],
    image:
      "https://images.unsplash.com/photo-1537734796389-e1fc293cf856?q=80&w=1200&auto=format&fit=crop",
  },
  {
    slug: "semolina",
    name: "Durum Semolina",
    category: "industrial",
    categoryLabel: "Industrial",
    description:
      "Premium golden semolina milled from durum wheat for pasta and couscous production. Superior color, high protein, consistent granulometry.",
    specs: [
      { label: "Protein", value: "13.5-15%" },
      { label: "Moisture", value: "≤14.5%" },
      { label: "Color", value: "Golden" },
    ],
    image:
      "https://images.unsplash.com/photo-1606091484089-089fa86fad4f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    slug: "fortified",
    name: "Fortified All-Purpose Flour",
    category: "industrial",
    categoryLabel: "Industrial",
    description:
      "Government-standard fortified flour with iron, folic acid, zinc, and B vitamins. Produced to meet national fortification mandates in export markets.",
    specs: [
      { label: "Protein", value: "10-12%" },
      { label: "Iron", value: "60 ppm" },
      { label: "Standard", value: "WHO/FAO" },
    ],
    image:
      "https://images.unsplash.com/photo-1586765501019-cbe3973ef8fa?q=80&w=1200&auto=format&fit=crop",
  },
  {
    slug: "custom",
    name: "Custom Flour Blends",
    category: "custom",
    categoryLabel: "Custom R&D",
    description:
      "Bespoke formulations developed by our R&D team: custom protein targets, unique grain blends, and performance specifications built for your product.",
    specs: [
      { label: "MOQ", value: "5 MT" },
      { label: "Lead time", value: "3-6 wks" },
      { label: "NDA", value: "Available" },
    ],
    image:
      "https://images.unsplash.com/photo-1717414245286-51496cc79325?q=80&w=1200&auto=format&fit=crop",
  },
];

export const PRODUCT_FILTERS = [
  { id: "all", label: "All Products" },
  { id: "standard", label: "Standard Range" },
  { id: "specialty", label: "Specialty" },
  { id: "whole", label: "Whole Grain" },
  { id: "industrial", label: "Industrial" },
  { id: "custom", label: "Custom R&D" },
];

export const TESTIMONIALS = [
  {
    quote:
      "FIKIR FOOD PROCESSING has been our primary supplier for eleven years. The consistency of their product is unmatched, and our bakers rely on it absolutely.",
    name: "Ermias Tilahun",
    role: "Head of Procurement, Shoa Bakeries Group",
  },
  {
    quote:
      "When we scaled to 40 tons per day, FIKIR FOOD PROCESSING was the only supplier who could guarantee both quality and delivery timelines.",
    name: "Sara Mekonnen",
    role: "Operations Director, Adisu Foods",
  },
  {
    quote:
      "Their technical team helped us reformulate our whole-wheat line. We saw a 12% improvement in shelf life and our customers noticed immediately.",
    name: "Kaleb Demeke",
    role: "R&D Manager, Hibret Bakeries S.C.",
  },
];

export const NEWS = [
  {
    date: "December 10, 2024",
    title: "FIKIR FOOD PROCESSING completes $42M capacity expansion project",
    excerpt:
      "Phase III adds 600 MT of daily milling capacity, bringing total output to 2,400 metric tons and creating 120 new jobs in Adama.",
    image:
      "https://images.unsplash.com/photo-1627052428109-576e839d100a?q=80&w=1600&auto=format&fit=crop",
  },
  {
    date: "November 3, 2024",
    title: "ISO 22000:2018 recertification achieved across all facilities",
    excerpt:
      "Following a comprehensive third-party audit, every production facility is recertified to the latest international food safety standard.",
    image:
      "https://images.unsplash.com/photo-1684259498900-afdea87b1a97?q=80&w=1200&auto=format&fit=crop",
  },
  {
    date: "October 18, 2024",
    title: "New ancient grain blend line launches for specialty markets",
    excerpt:
      "Responding to growing demand, our heritage grain flour range now includes spelt, einkorn, and emmer varieties.",
    image:
      "https://images.unsplash.com/photo-1564493031643-4be2c4347a17?q=80&w=1200&auto=format&fit=crop",
  },
];

export const TIMELINE = [
  {
    year: "1962",
    title: "Founded on the Awash River",
    text: "A small grain processing facility opens near Adama with 18 employees and a single stone mill.",
  },
  {
    year: "1978",
    title: "First industrial bakery contract",
    text: "A major supply agreement with Shoa Bakeries marks the shift from regional processor to industrial flour supplier.",
  },
  {
    year: "1995",
    title: "Modernisation and first ISO certification",
    text: "A $12M project installs automated milling lines and in-line quality systems, earning our first food safety certification.",
  },
  {
    year: "2008",
    title: "International export launch",
    text: "First shipments cross borders to Djibouti and Kenya. Within five years, exports reach 14 countries on three continents.",
  },
  {
    year: "2019",
    title: "R&D centre of excellence opens",
    text: "A dedicated 12,000 sq ft food science facility houses grain analysis labs, pilot milling lines, and a full test bakery.",
  },
  {
    year: "2024",
    title: "Phase III expansion complete",
    text: "A $42M expansion brings daily capacity to 2,400 MT, serving 850+ clients across 38 countries with 480 employees.",
  },
];

export const TEAM = [
  { name: "Abebe Girma", role: "Chief Executive Officer" },
  { name: "Dr. Tigist Assefa", role: "Chief Operations Officer" },
  { name: "Dawit Tadesse", role: "Head of Production & Engineering" },
  { name: "Dr. Mahlet Mengistu", role: "Director of R&D & Food Science" },
];

export const VALUES = [
  {
    icon: "seal",
    title: "Quality without compromise",
    text: "Every bag that leaves our facility has passed a 14-stage quality control process. We set the standard for ourselves and for the industry.",
  },
  {
    icon: "handshake",
    title: "Partnership first",
    text: "We work alongside your procurement and production teams as a genuine extension of your business, not just a vendor.",
  },
  {
    icon: "leaf",
    title: "Environmental responsibility",
    text: "Water usage down 31% and carbon emissions down 24% over the last decade. Our 2030 roadmap targets full renewable energy.",
  },
  {
    icon: "flask",
    title: "Continuous innovation",
    text: "28 food scientists and grain technologists develop new flour solutions, from specialty blends to fortified formulations.",
  },
];

export const CERTIFICATIONS = [
  { label: "Food Safety Management", name: "ISO 22000:2018", meta: "All facilities, recertified 2024" },
  { label: "Grade AA Food Safety", name: "BRC Global", meta: "Highest grade, held since 2009" },
  { label: "Verified Non-GMO", name: "Non-GMO Project", meta: "All wheat product lines" },
  { label: "Dual Certified", name: "Kosher & Halal", meta: "All product lines certified" },
];

export const PROCESS = [
  {
    step: "Grain intake",
    title: "Receiving and testing",
    text: "Every truck of wheat is sampled and tested before acceptance. In-line NIR analysers report protein, moisture, and falling number within minutes; only grain meeting specification enters storage.",
    points: [
      "Automated NIR protein and moisture analysis",
      "Falling number assessment for enzymatic activity",
      "Mycotoxin screening to EC regulation standards",
      "Segregated silo storage by variety and grade",
    ],
    image:
      "https://images.unsplash.com/photo-1556114846-f753bec8a9f5?q=80&w=1600&auto=format&fit=crop",
  },
  {
    step: "Cleaning",
    title: "Multi-stage grain cleaning",
    text: "A seven-stage cleaning system removes stones, sand, foreign seeds, dust, and light impurities. Magnetic separators capture metallic particles, delivering the cleanest possible grain to the mill.",
    points: [
      "Seven-stage mechanical cleaning line",
      "Magnetic separation of metallic particles",
      "Optical sorting of discolored kernels",
      "Aspiration channels for dust and chaff",
    ],
    image:
      "https://images.unsplash.com/photo-1652950741256-bb58335f468f?q=80&w=1600&auto=format&fit=crop",
  },
  {
    step: "Conditioning",
    title: "Tempering and conditioning",
    text: "Water is precisely added to bring grain to optimal milling moisture. Tempered grain rests 18 to 24 hours in conditioning bins so moisture penetrates each kernel evenly.",
    points: [
      "Precision water dosing to target moisture",
      "18 to 24 hour controlled resting period",
      "Even bran separation during milling",
      "Closed-loop water recovery systems",
    ],
    image:
      "https://images.unsplash.com/photo-1594020665090-970393850719?q=80&w=1600&auto=format&fit=crop",
  },
  {
    step: "Milling",
    title: "Roller milling",
    text: "Conditioned grain passes through corrugated and smooth roller mills that progressively break down the kernel. 14 roller stands and 28 sieve sections yield flour streams of precisely controlled quality.",
    points: [
      "14 roller stands, 28 sieve sections",
      "Progressive kernel reduction passes",
      "Stream separation by granulometry and ash",
      "Real-time process control monitoring",
    ],
    image:
      "https://images.unsplash.com/photo-1632959788203-904c5a3c1e6b?q=80&w=1600&auto=format&fit=crop",
  },
  {
    step: "Quality & pack",
    title: "Quality control and packaging",
    text: "Every flour stream is continuously sampled. In-line moisture and protein analysers feed real-time data; flour is blended to exact targets, then bagged or bulk-loaded and held in quarantine until lab release.",
    points: [
      "Continuous in-line sampling and analysis",
      "Precision blending to target specification",
      "Automated bagging and bulk loading",
      "Quarantine hold until laboratory release",
    ],
    image:
      "https://images.unsplash.com/photo-1627485937980-221c88ac04f9?q=80&w=1600&auto=format&fit=crop",
  },
];

export const FAQS = [
  {
    q: "What is the minimum order quantity?",
    a: "Standard MOQ for palletised product is 1 MT (one pallet). Bulk tanker deliveries start at 25 MT. Custom blends carry a 5 MT minimum per formulation.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes. We currently export to 38 countries with full documentation: phytosanitary certificates, certificates of origin, and dedicated export coordinators.",
  },
  {
    q: "Can you match a specification we already use?",
    a: "In most cases, yes. Send us your current spec sheet and our lab will produce a matched sample for your evaluation, usually within two weeks.",
  },
  {
    q: "How is product quality guaranteed?",
    a: "Every batch is tested against protein, moisture, and ash targets before release. A certificate of analysis accompanies each shipment.",
  },
  {
    q: "Do you offer private-label retail packaging?",
    a: "Yes. Retail packs from 1 kg to 5 kg can be produced under your own brand, with design support from our packaging team.",
  },
];

export const IMAGES = {
  // Hero left unchanged by request.
  heroWheat:
    "https://images.unsplash.com/photo-1592348665283-ab41f858f1b7?q=80&w=2070&auto=format&fit=crop",
  millInterior:
    "https://images.unsplash.com/photo-1667328925477-1cc446534413?q=80&w=1600&auto=format&fit=crop",
  factoryAbout:
    "https://images.unsplash.com/photo-1632959788203-904c5a3c1e6b?q=80&w=1600&auto=format&fit=crop",
  flourPour:
    "https://images.unsplash.com/photo-1549590143-d5855148a9d5?q=80&w=1600&auto=format&fit=crop",
  wheatAerial:
    "https://images.unsplash.com/photo-1529511582893-2d7e684dd128?q=80&w=1600&auto=format&fit=crop",
  milling:
    "https://images.unsplash.com/photo-1652950741256-bb58335f468f?q=80&w=1600&auto=format&fit=crop",
  wheatHarvest:
    "https://images.unsplash.com/photo-1635174815612-fd9636f70146?q=80&w=1600&auto=format&fit=crop",
  breadOven:
    "https://images.unsplash.com/photo-1567042661848-7161ce446f85?q=80&w=1600&auto=format&fit=crop",
};
