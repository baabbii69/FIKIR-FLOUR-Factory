import type { Loc, Heading, SiteContent } from "./types";
import type { Lang } from "../../i18n/I18nProvider";

/**
 * Turns the structured CMS page documents back into the flat `t()` key space
 * the components already use.
 *
 * The alternative was rewriting all 286 `t("key", "English")` call sites to
 * read structured content. This maps the same values onto the existing keys
 * instead, so editing the About page in Sanity changes the site with no code
 * change and no component churn.
 *
 * Anything not listed here simply falls through to the built-in dictionaries,
 * which is the correct behaviour for interface strings that stay in code.
 */

type Dict = Record<string, string>;

const put = (out: Dict, key: string, loc: Loc | undefined, lang: Lang) => {
  const v = loc?.[lang] ?? (lang === "en" ? loc?.en : undefined);
  if (v) out[key] = v;
};

/** Recombine lead + accent into the `*starred*` form the Accent component parses. */
const put2 = (out: Dict, key: string, h: Heading | undefined, lang: Lang) => {
  const lead = h?.lead?.[lang] ?? (lang === "en" ? h?.lead?.en : undefined);
  const accent = h?.accent?.[lang] ?? (lang === "en" ? h?.accent?.en : undefined);
  if (!lead) return;
  out[key] = accent ? `${lead} *${accent}*` : lead;
};

/** Two separate keys, as PageHero and CTABanner take them. */
const putPair = (out: Dict, leadKey: string, accentKey: string, h: Heading | undefined, lang: Lang) => {
  put(out, leadKey, h?.lead, lang);
  put(out, accentKey, h?.accent, lang);
};

export function flattenToKeys(c: SiteContent | null | undefined, lang: Lang): Dict {
  const o: Dict = {};
  if (!c) return o;

  /* ------------------------------- home ------------------------------- */
  const h = c.home;
  if (h) {
    put(o, "home.hero.eyebrow", h.heroEyebrow, lang);
    put2(o, "home.hero.title", h.heroHeading, lang);
    put(o, "home.hero.sub", h.heroSub, lang);
    h.marquee?.forEach((m, i) => put(o, `home.mq.${i + 1}`, m, lang));
    put(o, "home.who.eyebrow", h.whoWeAreEyebrow, lang);
    put(o, "home.who.body", h.whoWeAreBody, lang);
    h.process?.forEach((p, i) => {
      put(o, `proc.${i}.title`, p.title, lang);
      put(o, `proc.${i}.text`, p.text, lang);
    });
    put(o, "film.eyebrow", h.film?.eyebrow, lang);
    put2(o, "film.title", h.film?.heading, lang);
    put(o, "film.body", h.film?.body, lang);
    putPair(o, "home.cta.titleLead", "home.cta.titleAccent", h.cta?.heading, lang);
    put(o, "home.cta.text", h.cta?.text, lang);
  }

  /* ------------------------------- about ------------------------------ */
  const a = c.about;
  if (a) {
    putPair(o, "about.hero.title", "about.hero.accent", a.hero?.heading, lang);
    put2(o, "about.who.title", a.whoWeAreHeading, lang);
    a.whoWeAreBody?.forEach((p, i) => put(o, `about.who.p${i + 1}`, p, lang));
    put(o, "about.plantCaption", a.plantCaption, lang);
    put(o, "about.statEmployed", a.employedLabel, lang);
    put(o, "about.vision.text", a.vision, lang);
    put(o, "about.mission.text", a.mission, lang);
    put2(o, "about.founder.title", a.founder?.heading, lang);
    a.founder?.body?.forEach((p, i) => put(o, `about.founder.p${i + 1}`, p, lang));
    a.milestones?.forEach((m, i) => {
      put(o, `ms.${i}.year`, m.year, lang);
      put(o, `ms.${i}.title`, m.title, lang);
    });
    put(o, "about.values.title", a.valuesHeading, lang);
    put2(o, "about.people.title", a.people?.heading, lang);
    put(o, "about.people.body", a.people?.body, lang);
    put(o, "about.people.capTeam", a.people?.teamCaption, lang);
    put(o, "about.people.capMeeting", a.people?.meetingCaption, lang);
    put(o, "about.people.quote", a.people?.quote, lang);
    put2(o, "about.awards.title", a.awards?.heading, lang);
    put(o, "about.awards.body", a.awards?.body, lang);
    put(o, "about.awards.g1", a.awards?.groupTax, lang);
    put(o, "about.awards.g2", a.awards?.groupPartners, lang);
    put(o, "about.awards.g3", a.awards?.groupPress, lang);
    put(o, "about.awards.training", a.awards?.trainingNote, lang);
    a.whyUs?.forEach((w, i) => {
      put(o, `why.${i}.title`, w.title, lang);
      put(o, `why.${i}.text`, w.text, lang);
    });
    putPair(o, "about.cta.title", "about.cta.accent", a.cta?.heading, lang);
    put(o, "about.cta.text", a.cta?.text, lang);
  }

  /* ------------------------------ products ---------------------------- */
  const p = c.products;
  if (p) {
    putPair(o, "prod.hero.title", "prod.hero.accent", p.hero?.heading, lang);
    p.faqs?.forEach((f, i) => {
      put(o, `faq.${i}.q`, f.q, lang);
      put(o, `faq.${i}.a`, f.a, lang);
    });
    putPair(o, "prod.cta.title", "prod.cta.accent", p.cta?.heading, lang);
    put(o, "prod.cta.text", p.cta?.text, lang);
  }

  /* ------------------------------ facility ---------------------------- */
  const f = c.facility;
  if (f) {
    putPair(o, "fac.hero.title", "fac.hero.accent", f.hero?.heading, lang);
    put2(o, "fac.overview.title", f.overviewHeading, lang);
    f.overviewBody?.forEach((b, i) => put(o, `fac.overview.p${i + 1}`, b, lang));
    f.qualitySteps?.forEach((q, i) => {
      put(o, `qc.${i}.title`, q.title, lang);
      put(o, `qc.${i}.text`, q.text, lang);
    });
    putPair(o, "fac.cta.title", "fac.cta.accent", f.cta?.heading, lang);
    put(o, "fac.cta.text", f.cta?.text, lang);
  }

  /* ------------------------------- gallery ---------------------------- */
  const g = c.gallery;
  if (g) {
    putPair(o, "gal.hero.title", "gal.hero.accent", g.hero?.heading, lang);
    putPair(o, "gal.cta.title", "gal.cta.accent", g.cta?.heading, lang);
    put(o, "gal.cta.text", g.cta?.text, lang);
  }

  /* ------------------------------- careers ---------------------------- */
  const cr = c.careers;
  if (cr) {
    putPair(o, "car.hero.title", "car.hero.accent", cr.hero?.heading, lang);
    put2(o, "car.intro.title", cr.introHeading, lang);
    put(o, "car.intro.body", cr.introBody, lang);
    put(o, "car.values.title", cr.valuesHeading, lang);
    putPair(o, "car.cta.title", "car.cta.accent", cr.cta?.heading, lang);
    put(o, "car.cta.text", cr.cta?.text, lang);
  }

  /* ------------------------------- contact ---------------------------- */
  const ct = c.contact;
  if (ct) {
    putPair(o, "con.hero.title", "con.hero.accent", ct.hero?.heading, lang);
    put(o, "con.form.title", ct.formHeading, lang);
    put(o, "con.form.sub", ct.formIntro, lang);
  }

  /* --------------------------- collections ---------------------------- */
  c.categories?.forEach((cat) => {
    put(o, `cat.${cat.key}.label`, cat.label, lang);
    put(o, `cat.${cat.key}.note`, cat.note, lang);
  });
  c.productList?.forEach((pr) => {
    put(o, `prod.${pr.slug}.name`, pr.name, lang);
    put(o, `prod.${pr.slug}.blurb`, pr.blurb, lang);
    put(o, `prod.${pr.slug}.meta`, pr.meta, lang);
  });
  c.galleryItems?.forEach((it, i) => put(o, `gal.cap.${i}`, it.caption, lang));
  c.values?.forEach((v, i) => {
    put(o, `value.${i}.title`, v.title, lang);
    put(o, `value.${i}.text`, v.text, lang);
  });
  c.testimonials?.forEach((t, i) => {
    put(o, `tst.${i}.quote`, t.quote, lang);
    put(o, `tst.${i}.name`, t.name, lang);
    put(o, `tst.${i}.role`, t.role, lang);
  });
  c.openings?.forEach((j, i) => {
    put(o, `open.${i}.title`, j.title, lang);
    put(o, `open.${i}.type`, j.employmentType, lang);
    put(o, `open.${i}.location`, j.location, lang);
    put(o, `open.${i}.note`, j.note, lang);
  });
  c.awards?.forEach((aw, i) => {
    put(o, `award.${i}.year`, aw.year, lang);
    put(o, `award.${i}.issuer`, aw.issuer, lang);
    put(o, `award.${i}.text`, aw.text, lang);
  });
  c.certShots?.forEach((s, i) => put(o, `cert.shot.${i}`, s.caption, lang));

  /* ------------------------------ settings ---------------------------- */
  const st = c.settings;
  if (st) {
    put(o, "about.ceoRole", st.ceoRole, lang);
    st.stats?.forEach((s, i) => put(o, `stats.${i}`, s.label, lang));
    const cert = st.certificates?.[0];
    put(o, "cert.authority", cert?.authority, lang);
    put(o, "cert.title", cert?.title, lang);
    put(o, "cert.product", cert?.product, lang);
    put(o, "cert.note", cert?.note, lang);
    st.hours?.forEach((hr, i) => put(o, `con.hours.${i}.days`, hr.days, lang));
  }

  return o;
}
