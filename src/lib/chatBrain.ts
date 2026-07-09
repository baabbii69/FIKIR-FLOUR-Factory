import { PRODUCTS, CERTIFICATE, CONTACT } from "../data/site";

export type BotReply = { text: string; chips?: string[] };

const q = (s: string) => s.toLowerCase();
const has = (t: string, keys: string[]) => keys.some((k) => t.includes(k));

const names = (cat: string) =>
  PRODUCTS.filter((p) => p.category === cat).map((p) => p.name.replace(/^Unic /, ""));

/** True when the message is really about buying / stocking / distributing. */
export function isLeadIntent(raw: string): boolean {
  const t = q(raw);
  // Note: "buy" is intentionally excluded so "where to buy" stays an info answer.
  return has(t, [
    "order",
    "distributor",
    "distribute",
    "wholesale",
    "agent",
    "supply",
    "quote",
    "become a",
    "talk to us",
    "partner",
  ]);
}

const DEFAULT_CHIPS = ["Our products", "Where to buy", "Fortification", "Talk to us"];

export function answer(raw: string): BotReply {
  const t = q(raw);

  if (has(t, ["hi", "hello", "hey", "selam", "good morning", "good afternoon"]) && t.length < 24)
    return {
      text: "Hello! I can tell you about our flour, biscuits, wafers, and chips, where to buy them, or how to become a distributor. What would you like?",
      chips: DEFAULT_CHIPS,
    };

  if (has(t, ["thank", "ameseginalehu"]))
    return { text: "You're welcome! Anything else?", chips: DEFAULT_CHIPS };

  // Flour
  if (has(t, ["flour", "wheat", "special", "3f", "1k", "corn", "grade"]))
    return {
      text:
        "We make " +
        names("flour").join(", ") +
        ". Our wheat flour is fortified up to Vitamin B12 and carries the Ethiopian Standards mark. Special comes in 5-50 kg; 3F and 1K in 25 and 50 kg.",
      chips: ["Fortification", "Where to buy", "Biscuits"],
    };

  // Biscuits
  if (has(t, ["biscuit", "high energy", "cappuccino", "glucose", "abounded", "zoo", "cookie"]))
    return {
      text: "Our Unic biscuits include " + names("biscuits").join(", ") + ", and more than twelve flavors in all.",
      chips: ["Wafers", "Chips", "Where to buy"],
    };

  // Wafers
  if (has(t, ["wafer"]))
    return { text: "Our Unic cream wafers come in " + names("wafers").join(", ") + ".", chips: ["Biscuits", "Chips", "Where to buy"] };

  // Chips
  if (has(t, ["chip", "crisp", "potato", "paprika", "tomato"]))
    return {
      text:
        "Our Unic potato chips come in " +
        names("chips").join(", ") +
        " (40g and 120g). 100% natural, made from the best Ethiopian potatoes, with no cholesterol.",
      chips: ["Biscuits", "Where to buy"],
    };

  // Product overview
  if (has(t, ["product", "make", "sell", "range", "offer", "what do you", "catalog"]))
    return {
      text: "We make four ranges:\n• Flour (fortified wheat + corn)\n• Unic Biscuits (12+ flavors)\n• Unic Wafers\n• Unic Chips\nWhich would you like to know about?",
      chips: ["Flour", "Biscuits", "Wafers", "Chips"],
    };

  // Fortification / cert / quality
  if (has(t, ["fortif", "vitamin", "b12", "cert", "quality", "standard", "safe", "test", "iron", "ies"]))
    return {
      text:
        "Our wheat flour is fortified up to Vitamin B12 and licensed under the " +
        CERTIFICATE.authority +
        " (" +
        CERTIFICATE.title +
        ", " +
        CERTIFICATE.standard +
        "). Every batch is laboratory-tested before release.",
      chips: ["Our products", "Where to buy"],
    };

  // Where to buy / distributor
  if (has(t, ["where", "buy", "find", "shop", "available", "stock", "distributor", "agent", "wholesale"]))
    return {
      text: "Our products are sold across all regions of Ethiopia through agents, wholesalers, and retailers. If you'd like to stock Fikir or become a distributor, I can take your details for our team.",
      chips: ["Become a distributor", "Contact details"],
    };

  // Contact / location / hours
  if (has(t, ["contact", "email", "phone", "call", "reach", "address", "location", "where are", "adama", "hour", "open"]))
    return {
      text:
        `You can reach us here:\n• Phone: ${CONTACT.phones.join(" / ")}\n• Email: ${CONTACT.email}\n• ${CONTACT.addressLines.join(
          ", ",
        )}`,
      chips: ["Become a distributor", "Our products"],
    };

  return {
    text: "I can help with our products, quality and fortification, where to buy, and becoming a distributor. What would you like?",
    chips: DEFAULT_CHIPS,
  };
}
