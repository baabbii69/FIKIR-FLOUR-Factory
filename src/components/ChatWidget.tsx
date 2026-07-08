import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChatCircleDots, X, PaperPlaneRight, CircleNotch } from "@phosphor-icons/react";
import { answer, isLeadIntent } from "../lib/chatBrain";
import { submitLead } from "../lib/leads";
import { CONTACT } from "../data/site";

type Msg = { id: number; from: "bot" | "user"; text: string; chips?: string[] };

/** Guided lead capture: collect the essentials, then submit to Web3Forms. */
type LeadStep = null | "name" | "contact" | "interest" | "sending";

const GREETING: Msg = {
  id: 0,
  from: "bot",
  text: "Hi! I'm the FIKIR FOOD PROCESSING assistant. Ask me about our flours, specs, shipping, or pricing, and I can connect you with our team.",
  chips: ["Our products", "Pricing & quote", "Shipping", "Talk to sales"],
};

const EASE = [0.16, 1, 0.3, 1] as const;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([GREETING]);
  const [draft, setDraft] = useState("");
  const [leadStep, setLeadStep] = useState<LeadStep>(null);
  const lead = useRef<{ name: string; contact: string; interest: string }>({
    name: "",
    contact: "",
    interest: "",
  });

  const reduce = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const idRef = useRef(1);
  const nextId = () => idRef.current++;

  // Keep the transcript pinned to the latest message.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [msgs, reduce]);

  // Focus the input when the panel opens; close on Escape.
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pushBot = (text: string, chips?: string[]) =>
    setMsgs((m) => [...m, { id: nextId(), from: "bot", text, chips }]);
  const pushUser = (text: string) => setMsgs((m) => [...m, { id: nextId(), from: "user", text }]);

  function beginLead() {
    setLeadStep("name");
    pushBot("Great, I'll take a few quick details. First, what's your name?");
  }

  async function finishLead() {
    setLeadStep("sending");
    pushBot("Sending your details to our team...");
    try {
      await submitLead({
        subject: "New lead from website chat",
        from_name: lead.current.name || "Website visitor",
        name: lead.current.name,
        contact: lead.current.contact,
        interest: lead.current.interest,
        source: "Website chat widget",
      });
      pushBot(
        `Thank you, ${lead.current.name || "there"}. Our team will reach out within one business day. Anything else I can help with?`,
        ["Our products", "Shipping"],
      );
    } catch {
      pushBot(
        `Sorry, I couldn't send that just now. You can reach us directly at ${CONTACT.phone} or ${CONTACT.email}.`,
        ["Try again", "Our products"],
      );
    } finally {
      lead.current = { name: "", contact: "", interest: "" };
      setLeadStep(null);
    }
  }

  function handleUser(raw: string) {
    const text = raw.trim();
    if (!text || leadStep === "sending") return;
    pushUser(text);

    // Inside the lead flow: advance the mini form.
    if (leadStep === "name") {
      lead.current.name = text;
      setLeadStep("contact");
      pushBot(`Thanks ${text}. What's the best email or phone number to reach you?`);
      return;
    }
    if (leadStep === "contact") {
      const valid = /@/.test(text) || (text.replace(/\D/g, "").length >= 7);
      if (!valid) {
        pushBot("That doesn't look quite right. Please share an email address or a phone number.");
        return;
      }
      lead.current.contact = text;
      setLeadStep("interest");
      pushBot("Which product and roughly what monthly volume are you interested in? Add any details you like.");
      return;
    }
    if (leadStep === "interest") {
      lead.current.interest = text;
      void finishLead();
      return;
    }

    // Normal conversation.
    if (/^try again$/i.test(text)) {
      beginLead();
      return;
    }
    if (isLeadIntent(text) || /talk to sales|pricing & quote|request a quote/i.test(text)) {
      beginLead();
      return;
    }
    const reply = answer(text);
    pushBot(reply.text, reply.chips);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleUser(draft);
    setDraft("");
  }

  const placeholder =
    leadStep === "name"
      ? "Type your name..."
      : leadStep === "contact"
        ? "Email or phone..."
        : leadStep === "interest"
          ? "Product and volume..."
          : "Ask about our flour...";

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open chat assistant"}
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gold text-ink shadow-[0_10px_40px_rgba(28,19,8,0.28)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:bg-gold-bright active:scale-95 md:bottom-8 md:right-8"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "x" : "chat"}
            initial={reduce ? false : { rotate: -30, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={reduce ? undefined : { rotate: 30, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {open ? <X size={24} weight="bold" /> : <ChatCircleDots size={26} weight="fill" />}
          </motion.span>
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Chat with FIKIR FOOD PROCESSING"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.32, ease: EASE }}
            className="fixed inset-x-4 bottom-24 z-40 flex max-h-[72dvh] flex-col overflow-hidden rounded-2xl border border-linen bg-cream shadow-[0_24px_80px_rgba(28,19,8,0.32)] sm:inset-x-auto sm:right-6 sm:w-[380px] md:bottom-28 md:right-8"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-cream/10 bg-ink px-4 py-3.5">
              <img src="/logo-mark-cream.png" alt="" className="h-8 w-auto" />
              <div className="leading-tight">
                <p className="font-display text-lg font-semibold text-cream">Fikir Assistant</p>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-gold">
                  Usually replies instantly
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="ml-auto inline-flex h-8 w-8 items-center justify-center text-cream/70 transition-colors hover:text-cream"
              >
                <X size={20} />
              </button>
            </div>

            {/* Transcript */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
              {msgs.map((m) => (
                <div key={m.id}>
                  <div
                    className={
                      m.from === "user"
                        ? "ml-auto max-w-[82%] whitespace-pre-line rounded-2xl rounded-br-sm bg-ink px-3.5 py-2.5 text-[14px] leading-relaxed text-cream"
                        : "mr-auto max-w-[85%] whitespace-pre-line rounded-2xl rounded-bl-sm bg-parchment px-3.5 py-2.5 text-[14px] leading-relaxed text-ink ring-1 ring-linen"
                    }
                  >
                    {m.text}
                  </div>
                  {m.chips && m.chips.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {m.chips.map((c) => (
                        <button
                          key={c}
                          onClick={() => handleUser(c)}
                          className="rounded-full border border-gold/50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-gold-deep transition-colors duration-200 hover:border-gold hover:bg-gold hover:text-ink"
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {leadStep === "sending" && (
                <div className="mr-auto inline-flex items-center gap-2 rounded-2xl rounded-bl-sm bg-parchment px-3.5 py-2.5 text-[14px] text-clay ring-1 ring-linen">
                  <CircleNotch size={15} weight="bold" className="animate-spin text-gold-deep" />
                  Sending...
                </div>
              )}
            </div>

            {/* Composer */}
            <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-linen bg-cream px-3 py-3">
              <input
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={placeholder}
                disabled={leadStep === "sending"}
                aria-label="Message"
                className="min-w-0 flex-1 rounded-full border border-linen bg-parchment px-4 py-2.5 text-[14px] text-ink placeholder:text-clay/50 focus:border-gold-deep focus:outline-none disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={leadStep === "sending" || !draft.trim()}
                aria-label="Send message"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-ink transition-colors duration-200 hover:bg-gold-bright disabled:opacity-40"
              >
                <PaperPlaneRight size={18} weight="fill" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
