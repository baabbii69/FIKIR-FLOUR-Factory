import { useState } from "react";
import type { FormEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  MapPin,
  Phone,
  EnvelopeSimple,
  Clock,
  CircleNotch,
  CheckCircle,
} from "@phosphor-icons/react";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import { usePageMeta } from "../lib/usePageMeta";
import { submitLead } from "../lib/leads";
import { CONTACT, IMAGES } from "../data/site";

export default function Contact() {
  usePageMeta(
    "Contact | FIKIR FOOD PROCESSING",
    "Become a distributor, place a wholesale order, or reach the Fikir Food Processing team in Adama, Ethiopia."
  );

  return (
    <>
      <PageHero
        image={IMAGES.fleet}
        alt="The Fikir delivery fleet at the plant in Adama"
        crumb="Contact"
        title="Let's"
        titleAccent="talk."
      />

      {/* Full-bleed split: ink details left, parchment form right. Inner content
          stays on the 1400px grid (700px per half) so nothing floats in space. */}
      <section className="grid lg:grid-cols-2">
        <div className="bg-ink">
          <div className="w-full max-w-[700px] px-5 py-16 md:px-10 md:py-20 lg:ml-auto lg:pr-14">
            <Reveal>
              <span className="eyebrow">Reach us directly</span>
              <h2 className="display-2 mt-5 text-3xl !text-cream md:text-4xl">
                One conversation is usually all it takes.
              </h2>
            </Reveal>

            <div className="mt-12 space-y-8">
              <Reveal delay={0.06}>
                <ContactRow icon={<MapPin size={22} weight="duotone" />} label="Visit">
                  {CONTACT.addressLines.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </ContactRow>
              </Reveal>
              <Reveal delay={0.1}>
                <ContactRow icon={<Phone size={22} weight="duotone" />} label="Call">
                  {CONTACT.phones.map((p) => (
                    <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="block transition-colors hover:text-gold">
                      {p}
                    </a>
                  ))}
                </ContactRow>
              </Reveal>
              <Reveal delay={0.14}>
                <ContactRow icon={<EnvelopeSimple size={22} weight="duotone" />} label="Write">
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="block transition-colors hover:text-gold"
                  >
                    {CONTACT.email}
                  </a>
                </ContactRow>
              </Reveal>
              <Reveal delay={0.18}>
                <ContactRow icon={<Clock size={22} weight="duotone" />} label="Hours">
                  {CONTACT.hours.map((h) => (
                    <span key={h.days} className="flex justify-between gap-6">
                      <span>{h.days}</span>
                      <span className="font-mono text-sm tabular-nums text-cream/60">
                        {h.time}
                      </span>
                    </span>
                  ))}
                </ContactRow>
              </Reveal>
            </div>

            <Reveal delay={0.22}>
              <div className="mt-12 border-t border-cream/15 pt-8">
                <p className="text-sm leading-relaxed text-cream/60">
                  Looking to stock Fikir products or become a distributor? Send us a message and our
                  team will get back to you.
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Form column */}
        <div className="bg-parchment">
          <div className="w-full max-w-[700px] px-5 py-16 md:px-10 md:py-20 lg:mr-auto lg:pl-14">
            <QuoteForm />
          </div>
        </div>
      </section>

      {/* Map */}
      <section aria-label="Map to the FIKIR FOOD PROCESSING factory" className="bg-cream">
        <div className="relative h-[420px] w-full">
          <iframe
            title="FIKIR FOOD PROCESSING location in Adama, Ethiopia"
            src="https://www.openstreetmap.org/export/embed.html?bbox=39.2189%2C8.4914%2C39.3189%2C8.5914&layer=mapnik&marker=8.5414%2C39.2689"
            className="h-full w-full border-0 grayscale-[35%]"
            loading="lazy"
          />
        </div>
      </section>
    </>
  );
}

function ContactRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-gold/15 text-gold">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/50">
          {label}
        </div>
        <div className="mt-2 space-y-1 text-[15px] leading-relaxed text-cream/85">{children}</div>
      </div>
    </div>
  );
}

/* ---------------- Quote form ---------------- */

const ENQUIRY_TYPES = [
  "Become a distributor",
  "Place a wholesale order",
  "Product question",
  "Partnership",
  "Something else",
];

type Errors = Partial<Record<"firstName" | "lastName" | "email" | "message" | "consent", string>>;

function QuoteForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const reduce = useReducedMotion();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const next: Errors = {};

    if (!String(data.get("firstName")).trim()) next.firstName = "First name is required.";
    if (!String(data.get("lastName")).trim()) next.lastName = "Last name is required.";
    const email = String(data.get("email")).trim();
    if (!email) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email address.";
    if (!String(data.get("message")).trim()) next.message = "Tell us a little about your needs.";
    if (!data.get("consent")) next.consent = "Please agree so we can respond to you.";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus("sending");
    try {
      await submitLead({
        subject: "New quote request from website",
        from_name: `${data.get("firstName")} ${data.get("lastName")}`.trim(),
        name: `${data.get("firstName")} ${data.get("lastName")}`.trim(),
        email,
        phone: String(data.get("phone") || ""),
        company: String(data.get("company") || ""),
        enquiry: String(data.get("enquiry") || ""),
        volume: String(data.get("volume") || ""),
        message: String(data.get("message") || ""),
        source: "Contact page form",
      });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex min-h-[480px] flex-col items-start justify-center"
      >
        <CheckCircle size={44} weight="duotone" className="text-gold-deep" />
        <h2 className="display-2 mt-6 text-3xl md:text-4xl">Message received.</h2>
        <p className="mt-4 max-w-[52ch] text-base leading-relaxed">
          Thank you. A member of our sales team will reply within one business day. If your
          enquiry is urgent, call us on {CONTACT.phone}.
        </p>
      </motion.div>
    );
  }

  return (
    <div>
      <Reveal>
        <h2 className="display-2 text-3xl md:text-4xl">Send us a message</h2>
        <p className="mt-4 max-w-[56ch] text-[15px] leading-relaxed">
          Want to stock Fikir products, become a distributor, or ask a question? Tell us a little
          about you and we'll get back to you.
        </p>
      </Reveal>

      <form onSubmit={handleSubmit} noValidate className="mt-10">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="First name" name="firstName" autoComplete="given-name" error={errors.firstName} />
          <Field label="Last name" name="lastName" autoComplete="family-name" error={errors.lastName} />
          <Field label="Work email" name="email" type="email" autoComplete="email" error={errors.email} />
          <Field label="Phone (optional)" name="phone" type="tel" autoComplete="tel" />
          <Field label="Company (optional)" name="company" autoComplete="organization" className="sm:col-span-2" />
          <SelectField label="Enquiry type" name="enquiry" options={ENQUIRY_TYPES} />
          <Field label="City / region (optional)" name="volume" placeholder="e.g. Adama, Oromia" />
          <TextareaField
            label="Your message"
            name="message"
            error={errors.message}
            className="sm:col-span-2"
            placeholder="Tell us how we can help, which products you're interested in, and where you are."
          />
        </div>

        <label className="mt-8 flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="consent"
            className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[#8b5e2a]"
          />
          <span className="text-sm leading-relaxed text-clay/90">
            I agree that FIKIR FOOD PROCESSING may contact me about this enquiry.
          </span>
        </label>
        {errors.consent && <p className="mt-2 text-sm text-[#9a2b1e]">{errors.consent}</p>}

        <button
          type="submit"
          disabled={status === "sending"}
          className="group mt-10 inline-flex items-center justify-center gap-2.5 bg-ink px-10 py-4 font-mono text-[11px] uppercase tracking-[0.18em] text-cream transition-all duration-300 hover:-translate-y-px hover:bg-gold-deep active:translate-y-0 active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
        >
          {status === "sending" ? (
            <>
              <CircleNotch size={14} weight="bold" className="animate-spin" />
              Sending
            </>
          ) : (
            "Send enquiry"
          )}
        </button>

        {status === "error" && (
          <p className="mt-4 text-sm text-[#9a2b1e]">
            Something went wrong sending your enquiry. Please email {CONTACT.email} or call{" "}
            {CONTACT.phone} and we'll help right away.
          </p>
        )}
      </form>
    </div>
  );
}

const inputCls = (error?: string) =>
  `w-full border bg-cream px-4 py-3.5 text-[15px] text-ink placeholder:text-clay/50 transition-colors duration-300 focus:outline-none focus:border-gold-deep ${
    error ? "border-[#9a2b1e]" : "border-linen"
  }`;

function Field({
  label,
  name,
  type = "text",
  error,
  className = "",
  ...rest
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
  className?: string;
  autoComplete?: string;
  placeholder?: string;
}) {
  const id = `f-${name}`;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-clay/80">
        {label}
      </label>
      <input id={id} name={name} type={type} className={inputCls(error)} aria-invalid={!!error} {...rest} />
      {error && <p className="mt-2 text-sm text-[#9a2b1e]">{error}</p>}
    </div>
  );
}

function SelectField({
  label,
  name,
  options,
  className = "",
}: {
  label: string;
  name: string;
  options: string[];
  className?: string;
}) {
  const id = `f-${name}`;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-clay/80">
        {label}
      </label>
      <select id={id} name={name} className={`${inputCls()} cursor-pointer appearance-none`}>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function TextareaField({
  label,
  name,
  error,
  className = "",
  placeholder,
}: {
  label: string;
  name: string;
  error?: string;
  className?: string;
  placeholder?: string;
}) {
  const id = `f-${name}`;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-clay/80">
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        rows={5}
        placeholder={placeholder}
        className={`${inputCls(error)} resize-y`}
        aria-invalid={!!error}
      />
      {error && <p className="mt-2 text-sm text-[#9a2b1e]">{error}</p>}
    </div>
  );
}
