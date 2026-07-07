import Btn from "../components/Btn";
import { usePageMeta } from "../lib/usePageMeta";

export default function NotFound() {
  usePageMeta("Page not found | FIKIR FLOUR Factory");

  return (
    <section className="flex min-h-[100dvh] items-center bg-ink">
      <div className="mx-auto w-full max-w-[1400px] px-5 py-32 md:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold">Error 404</p>
        <h1 className="display-1 mt-6 max-w-3xl text-5xl !text-cream md:text-7xl">
          This page slipped through the{" "}
          <em className="inline-block pb-2 leading-[1.1] text-gold">sieve.</em>
        </h1>
        <p className="mt-6 max-w-md text-base leading-relaxed text-cream/65">
          The address you followed does not exist or has moved. Everything we make is still
          here.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Btn to="/" arrow>
            Back to home
          </Btn>
          <Btn to="/products" variant="outline-cream">
            Explore products
          </Btn>
        </div>
      </div>
    </section>
  );
}
