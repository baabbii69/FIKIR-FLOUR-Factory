import { Link } from "react-router-dom";
import { MapPin, Phone, EnvelopeSimple } from "@phosphor-icons/react";
import { CONTACT } from "../data/site";

const COMPANY_LINKS = [
  { to: "/about", label: "About Us" },
  { to: "/about#history", label: "Our History" },
  { to: "/about#team", label: "Leadership" },
  { to: "/factory", label: "Our Factory" },
  { to: "/contact", label: "Careers" },
];

const PRODUCT_LINKS = [
  { to: "/products", label: "All Products" },
  { to: "/products?cat=standard", label: "Standard Range" },
  { to: "/products?cat=specialty", label: "Specialty Flour" },
  { to: "/products?cat=whole", label: "Whole Grain" },
  { to: "/products?cat=custom", label: "Custom Blends" },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-cream/70">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.3fr]">
          <div>
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/logo-mark-cream.png"
                alt="FIKIR FOOD PROCESSING logo"
                className="h-12 w-auto"
              />
              <span className="flex flex-col leading-none">
                <span className="font-display text-2xl font-bold text-cream">Fikir</span>
                <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.28em] text-cream/60">
                  Food Processing
                </span>
              </span>
            </Link>
            <p className="mt-6 max-w-xs text-[15px] leading-relaxed">
              Milling premium flour for the world's food industry since 1962. Quality,
              consistency, and partnership, every day.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["ISO 22000", "Non-GMO", "Kosher", "Halal"].map((c) => (
                <span
                  key={c}
                  className="border border-cream/20 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-cream/60"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          <nav aria-label="Company">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold">Company</h3>
            <ul className="mt-5 space-y-3">
              {COMPANY_LINKS.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-[15px] transition-colors hover:text-cream">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Products">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold">Products</h3>
            <ul className="mt-5 space-y-3">
              {PRODUCT_LINKS.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-[15px] transition-colors hover:text-cream">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold">Contact</h3>
            <ul className="mt-5 space-y-4 text-[15px]">
              <li className="flex gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-gold" />
                <span>
                  {CONTACT.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="shrink-0 text-gold" />
                <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="hover:text-cream">
                  {CONTACT.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <EnvelopeSimple size={18} className="shrink-0 text-gold" />
                <a href={`mailto:${CONTACT.email}`} className="hover:text-cream">
                  {CONTACT.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-cream/10 pt-8 md:flex-row">
          <p className="text-center text-[13px] text-cream/50">
            © {new Date().getFullYear()} FIKIR FOOD PROCESSING. All rights reserved.
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-cream/40">
            From grain to greatness
          </p>
        </div>
      </div>
    </footer>
  );
}
