import type { ImgHTMLAttributes } from "react";

/**
 * Derives the WebP sibling path for a raster image, or null for anything that
 * isn't a .jpg/.jpeg/.png (SVGs, data URIs, remote URLs are left untouched).
 * Every image under /public/media has a pre-generated .webp next to it.
 */
export function toWebp(src?: string): string | null {
  if (!src) return null;
  return /\.(jpe?g|png)$/i.test(src) ? src.replace(/\.(jpe?g|png)$/i, ".webp") : null;
}

/**
 * Drop-in replacement for <img> that serves WebP (≈50% smaller) with the
 * original as fallback. The <picture> wrapper is `display: contents`, so it
 * generates no box of its own — the inner <img> keeps its exact classes and
 * layout behaviour. If the .webp is missing the browser simply uses the <img>.
 */
export default function Img({ src, ...rest }: ImgHTMLAttributes<HTMLImageElement>) {
  const webp = toWebp(typeof src === "string" ? src : undefined);
  const img = <img src={src} {...rest} />;
  if (!webp) return img;
  return (
    <picture className="contents">
      <source srcSet={webp} type="image/webp" />
      {img}
    </picture>
  );
}
