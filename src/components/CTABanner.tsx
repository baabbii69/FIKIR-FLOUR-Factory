import Reveal from "./Reveal";
import Btn from "./Btn";
import Img from "./Img";

/** Photographic closing CTA. One per page, centered by design (manifesto moment). */
export default function CTABanner({
  image,
  alt,
  title,
  titleAccent,
  text,
  primary,
  primaryTo,
  secondary,
  secondaryTo,
}: {
  image: string;
  alt: string;
  title: string;
  titleAccent: string;
  text: string;
  primary: string;
  primaryTo: string;
  secondary?: string;
  secondaryTo?: string;
}) {
  return (
    <section className="relative flex min-h-[520px] items-center overflow-hidden bg-ink">
      <Img
        src={image}
        alt={alt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-ink/75" />
      <div className="relative mx-auto max-w-3xl px-5 py-24 text-center md:px-10">
        <Reveal>
          <h2 className="display-2 text-4xl !text-cream md:text-6xl">
            {title} <em className="pb-1 leading-[1.1] text-gold">{titleAccent}</em>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-cream/75">{text}</p>
        </Reveal>
        <Reveal delay={0.18}>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Btn to={primaryTo} arrow>
              {primary}
            </Btn>
            {secondary && secondaryTo && (
              <Btn to={secondaryTo} variant="outline-cream">
                {secondary}
              </Btn>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
