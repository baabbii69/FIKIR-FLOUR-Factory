import { Link } from "react-router-dom";
import { MapPin, Phone, EnvelopeSimple } from "@phosphor-icons/react";
import { CONTACT } from "../data/site";
import { useI18n } from "../i18n/I18nProvider";

const COMPANY_LINKS = [
  { to: "/about", label: "About Us", k: "footer.aboutUs" },
  { to: "/facility", label: "Facility & Quality", k: "footer.facilityQuality" },
  { to: "/careers", label: "Careers", k: "footer.careers" },
  { to: "/contact", label: "Become a Distributor", k: "footer.becomeDistributor" },
  { to: "/contact", label: "Contact", k: "footer.contactLink" },
];

const PRODUCT_LINKS = [
  { to: "/products?cat=flour", label: "Flour", k: "footer.linkFlour" },
  { to: "/products?cat=biscuits", label: "Unic Biscuits", k: "footer.linkBiscuits" },
  { to: "/products?cat=wafers", label: "Unic Wafers", k: "footer.linkWafers" },
  { to: "/products?cat=chips", label: "Unic Chips", k: "footer.linkChips" },
  { to: "/products", label: "All Products", k: "footer.linkAll" },
];

export default function Footer() {
  const { t } = useI18n();
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
                  {t("brand.sub", "Food Processing")}
                </span>
              </span>
            </Link>
            <p className="mt-6 max-w-xs text-[15px] leading-relaxed">
              {t(
                "footer.blurb",
                "An Ethiopian food manufacturer in Adama, producing fortified flour, biscuits, wafers, and chips for over 15 years."
              )}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {[t("footer.badge1", "Fortified up to B12"), t("footer.badge2", "Ethiopian Standards Mark")].map((c) => (
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
            <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold">{t("footer.company", "Company")}</h3>
            <ul className="mt-5 space-y-3">
              {COMPANY_LINKS.map((l) => (
                <li key={l.k}>
                  <Link to={l.to} className="text-[15px] transition-colors hover:text-cream">
                    {t(l.k, l.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Products">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold">{t("footer.products", "Products")}</h3>
            <ul className="mt-5 space-y-3">
              {PRODUCT_LINKS.map((l) => (
                <li key={l.k}>
                  <Link to={l.to} className="text-[15px] transition-colors hover:text-cream">
                    {t(l.k, l.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold">{t("footer.contact", "Contact")}</h3>
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
              <li className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 shrink-0 text-gold" />
                <span className="flex flex-col gap-1">
                  {CONTACT.phones.map((p) => (
                    <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="hover:text-cream">
                      {p}
                    </a>
                  ))}
                </span>
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
            © {new Date().getFullYear()} FIKIR FOOD PROCESSING. {t("footer.rights", "All rights reserved.")}
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-cream/40">
            {t("footer.tagline", "We produce quality; we deliver trust")}
          </p>
        </div>
      </div>
    </footer>
  );
}
