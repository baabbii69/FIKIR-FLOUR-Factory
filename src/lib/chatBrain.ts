import { PRODUCTS, FAQS, CERTIFICATIONS, CONTACT } from "../data/site";

export type BotReply = { text: string; chips?: string[] };

const q = (s: string) => s.toLowerCase();

/** Distinctive keywords per product for reliable matching. */
const PRODUCT_KEYWORDS: Record<string, string[]> = {
  "all-purpose": ["all-purpose", "all purpose", "multipurpose", "multi purpose"],
  bread: ["bread", "high-gluten", "high gluten"],
  pastry: ["pastry", "cake", "croissant", "biscuit"],
  "whole-wheat": ["whole wheat", "whole-wheat", "wholemeal", "wholewheat", "whole grain"],
  spelt: ["spelt", "ancient grain"],
  "tipo-00": ["tipo", "00", "pizza", "neapolitan"],
  semolina: ["semolina", "durum", "couscous"],
  fortified: ["fortified", "iron", "folic", "vitamin", "fortification"],
  custom: ["custom", "bespoke", "formulation", "r&d", "rnd"],
};

const includesAny = (text: string, keys: string[]) => keys.some((k) => text.includes(k));

/** True when the message is really asking to buy / get pricing / reach sales. */
export function isLeadIntent(raw: string): boolean {
  const t = q(raw);
  if (includesAny(t, ["minimum", "moq"])) return false; // that's an info question
  return includesAny(t, [
    "quote",
    "price",
    "pricing",
    "cost",
    "buy",
    "purchase",
    "sample",
    "talk to sales",
    "contact sales",
    "sales team",
    "request a quote",
    "get a quote",
    "place an order",
    "order now",
  ]);
}

function productReply(slug: string): BotReply {
  const p = PRODUCTS.find((pr) => pr.slug === slug)!;
  const specs = p.specs.map((s) => `${s.label} ${s.value}`).join(" · ");
  return {
    text: `${p.name}\n${p.description}\n\nKey specs: ${specs}.`,
    chips: ["Request a quote", "See other products", "Shipping"],
  };
}

const DEFAULT_CHIPS = ["Our products", "Pricing & quote", "Shipping", "Talk to sales"];

/** Rule-based answer over the site's own data. No LLM, instant, always accurate. */
export function answer(raw: string): BotReply {
  const t = q(raw);

  // Greetings
  if (includesAny(t, ["hi", "hello", "hey", "selam", "good morning", "good afternoon"]) && t.length < 24)
    return {
      text: "Hello! I can help with our flour products, specifications, pricing, shipping, and certifications. What are you looking for?",
      chips: DEFAULT_CHIPS,
    };

  if (includesAny(t, ["thank", "thanks", "ameseginalehu"]))
    return { text: "You're welcome. Anything else I can help with?", chips: DEFAULT_CHIPS };

  // Specific product
  for (const slug of Object.keys(PRODUCT_KEYWORDS)) {
    if (includesAny(t, PRODUCT_KEYWORDS[slug])) return productReply(slug);
  }

  // Product list
  if (includesAny(t, ["product", "flour", "range", "types", "what do you", "sell", "offer", "catalog"]))
    return {
      text:
        "We mill nine flour lines:\n" +
        PRODUCTS.map((p) => `• ${p.name}`).join("\n") +
        "\n\nWhich one would you like details on?",
      chips: ["All-Purpose Flour", "Bread Flour", "Whole Wheat", "Custom blends"],
    };

  // Minimum order
  if (includesAny(t, ["minimum", "moq", "smallest order", "min order"]))
    return { text: FAQS[0].a, chips: ["Request a quote", "Shipping", "Our products"] };

  // Shipping / export
  if (includesAny(t, ["ship", "export", "deliver", "countr", "international", "abroad", "logistics"]))
    return {
      text:
        "We export to 38 countries with full documentation: phytosanitary certificates, certificates of origin, and dedicated export coordinators. Bulk tanker, big bags, palletised sacks, and retail packs are all available.",
      chips: ["Request a quote", "Minimum order", "Talk to sales"],
    };

  // Certifications / quality
  if (includesAny(t, ["cert", "iso", "halal", "kosher", "gmo", "quality", "safety", "standard"]))
    return {
      text:
        "We hold " +
        CERTIFICATIONS.map((c) => c.name).join(", ") +
        ". Every batch is tested against protein, moisture, and ash targets, and ships with a certificate of analysis.",
      chips: ["Our products", "Request a quote"],
    };

  // Spec-match question
  if (includesAny(t, ["protein", "moisture", "ash", "spec", "gluten"]))
    return {
      text: "Each flour has its own protein, moisture, and ash targets. Which product should I pull the specs for?",
      chips: ["All-Purpose Flour", "Bread Flour", "Whole Wheat", "Durum Semolina"],
    };

  // Contact / location / hours / visit
  if (
    includesAny(t, [
      "contact",
      "email",
      "phone",
      "call",
      "reach",
      "address",
      "location",
      "where",
      "visit",
      "factory",
      "hour",
      "open",
      "directions",
    ])
  )
    return {
      text:
        `You can reach us here:\n• Phone: ${CONTACT.phone}\n• Email: ${CONTACT.email}\n• ${CONTACT.addressLines.join(
          ", ",
        )}\n\nHours: ${CONTACT.hours.map((h) => `${h.days} ${h.time}`).join(" · ")}.`,
      chips: ["Request a quote", "Our products"],
    };

  // Fallback
  return {
    text: "I can help with our products, specifications, pricing, shipping, and certifications, or connect you with our sales team. What would you like?",
    chips: DEFAULT_CHIPS,
  };
}
