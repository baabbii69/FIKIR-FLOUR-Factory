import { PRODUCTS, CERTIFICATE, CONTACT } from "../data/site";

export type BotReply = { text: string; chips?: string[] };
export type TFn = (key: string, en: string) => string;

const q = (s: string) => s.toLowerCase();
const has = (t: string, keys: string[]) => keys.some((k) => t.includes(k));

const localNames = (cat: string, t: TFn) =>
  PRODUCTS.filter((p) => p.category === cat).map((p) =>
    t(`prod.${p.slug}.name`, p.name).replace(/^Unic /, "")
  );

/** Lead intent in English or Amharic (excludes "where to buy"). */
export function isLeadIntent(raw: string): boolean {
  const t = q(raw);
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
    // Amharic
    "አከፋፋይ",
    "ማከፋፈል",
    "ትዕዛዝ",
    "ጅምላ",
    "ወኪል",
    "አጋር",
    "ያግኙን",
  ]);
}

export function answer(raw: string, t: TFn): BotReply {
  const s = q(raw);
  const DEFAULT_CHIPS = [
    t("chat.chip.products", "Our products"),
    t("chat.chip.buy", "Where to buy"),
    t("chat.chip.fortification", "Fortification"),
    t("chat.chip.distributor", "Become a distributor"),
  ];

  if (has(s, ["hi", "hello", "hey", "selam", "ሰላም", "ጤና"]) && s.length < 24)
    return {
      text: t(
        "chat.a.greet",
        "Hello! I can tell you about our flour, biscuits, wafers, and chips, where to buy them, or how to become a distributor. What would you like?"
      ),
      chips: DEFAULT_CHIPS,
    };

  if (has(s, ["thank", "ameseginalehu", "አመሰግናለሁ"]))
    return { text: t("chat.a.thanks", "You're welcome! Anything else?"), chips: DEFAULT_CHIPS };

  // Flour
  if (has(s, ["flour", "wheat", "special", "3f", "1k", "corn", "grade", "ዱቄት", "ስንዴ", "በቆሎ"]))
    return {
      text:
        t("chat.a.flourPre", "We make ") +
        localNames("flour", t).join(", ") +
        t(
          "chat.a.flourPost",
          ". Our wheat flour is fortified up to Vitamin B12 and carries the Ethiopian Standards mark. Special comes in 5-50 kg; 3F and 1K in 25 and 50 kg."
        ),
      chips: [t("chat.chip.fortification", "Fortification"), t("chat.chip.buy", "Where to buy")],
    };

  // Biscuits
  if (has(s, ["biscuit", "high energy", "cappuccino", "glucose", "abounded", "zoo", "cookie", "ብስኩት"]))
    return {
      text:
        t("chat.a.biscuitsPre", "Our Unic biscuits include ") +
        localNames("biscuits", t).join(", ") +
        t("chat.a.biscuitsPost", ", and more than twelve flavors in all."),
      chips: [t("chat.chip.wafers", "Wafers"), t("chat.chip.chips", "Chips"), t("chat.chip.buy", "Where to buy")],
    };

  // Wafers
  if (has(s, ["wafer", "ዌፈር"]))
    return {
      text: t("chat.a.wafersPre", "Our Unic cream wafers come in ") + localNames("wafers", t).join(", ") + ".",
      chips: [t("chat.chip.biscuits", "Biscuits"), t("chat.chip.chips", "Chips"), t("chat.chip.buy", "Where to buy")],
    };

  // Chips
  if (has(s, ["chip", "crisp", "potato", "paprika", "tomato", "ቺፕስ", "ድንች"]))
    return {
      text:
        t("chat.a.chipsPre", "Our Unic potato chips come in ") +
        localNames("chips", t).join(", ") +
        t("chat.a.chipsPost", " (40g and 120g). 100% natural, made from the best Ethiopian potatoes, with no cholesterol."),
      chips: [t("chat.chip.biscuits", "Biscuits"), t("chat.chip.buy", "Where to buy")],
    };

  // Product overview
  if (has(s, ["product", "make", "sell", "range", "offer", "what do you", "catalog", "ምርት", "ምርቶች"]))
    return {
      text: t(
        "chat.a.overview",
        "We make four ranges:\n• Flour (fortified wheat + corn)\n• Unic Biscuits (12+ flavors)\n• Unic Wafers\n• Unic Chips\nWhich would you like to know about?"
      ),
      chips: [
        t("chat.chip.flour", "Flour"),
        t("chat.chip.biscuits", "Biscuits"),
        t("chat.chip.wafers", "Wafers"),
        t("chat.chip.chips", "Chips"),
      ],
    };

  // Fortification / cert / quality
  if (has(s, ["fortif", "vitamin", "b12", "cert", "quality", "standard", "safe", "test", "iron", "ies", "ማጠናከር", "ጥራት", "ደረጃ", "ቫይታሚን"]))
    return {
      text:
        t("chat.a.certPre", "Our wheat flour is fortified up to Vitamin B12 and licensed under the ") +
        CERTIFICATE.authority +
        " (" +
        CERTIFICATE.title +
        ", " +
        CERTIFICATE.standard +
        t("chat.a.certPost", "). Every batch is laboratory-tested before release."),
      chips: [t("chat.chip.products", "Our products"), t("chat.chip.buy", "Where to buy")],
    };

  // Where to buy / distributor
  if (has(s, ["where", "buy", "find", "shop", "available", "stock", "distributor", "agent", "wholesale", "የት", "መግዛት", "መግዛ", "የመገኛ"]))
    return {
      text: t(
        "chat.a.buy",
        "Our products are sold across all regions of Ethiopia through agents, wholesalers, and retailers. If you'd like to stock Fikir or become a distributor, I can take your details for our team."
      ),
      chips: [t("chat.chip.distributor", "Become a distributor"), t("chat.chip.contact", "Contact details")],
    };

  // Contact / location / hours
  if (has(s, ["contact", "email", "phone", "call", "reach", "address", "location", "where are", "adama", "hour", "open", "ስልክ", "ኢሜይል", "አድራሻ", "አዳማ", "ደውል"]))
    return {
      text:
        t("chat.a.contact", "You can reach us here:") +
        `\n• ${CONTACT.phones.join(" / ")}\n• ${CONTACT.email}\n• ${CONTACT.addressLines.join(", ")}`,
      chips: [t("chat.chip.distributor", "Become a distributor"), t("chat.chip.products", "Our products")],
    };

  return {
    text: t(
      "chat.a.fallback",
      "I can help with our products, quality and fortification, where to buy, and becoming a distributor. What would you like?"
    ),
    chips: DEFAULT_CHIPS,
  };
}
