import { useState } from "react";
import { motion } from "motion/react";
import { Play } from "@phosphor-icons/react";
import type { VideoSource } from "../data/site";

/**
 * Clean, reusable video player. Shows a poster + play button (a lightweight
 * "facade" so heavy embeds only load on click), then plays a YouTube/Vimeo
 * embed or a self-hosted file. Drop it anywhere:
 *
 *   <VideoBlock source={{ type: "youtube", id: "abc123", poster: IMAGES.facMill1 }} />
 */
export default function VideoBlock({
  source,
  className = "",
  aspect = "16/9",
}: {
  source: VideoSource;
  className?: string;
  aspect?: "16/9" | "4/3" | "1/1";
}) {
  const [playing, setPlaying] = useState(false);
  const ratio = aspect === "4/3" ? "aspect-[4/3]" : aspect === "1/1" ? "aspect-square" : "aspect-video";
  const title = source.title ?? "Fikir Food Processing";

  return (
    <div className={`relative overflow-hidden bg-ink ${ratio} ${className}`}>
      {!playing ? (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play video: ${title}`}
          className="group absolute inset-0 h-full w-full"
        >
          {source.poster ? (
            <img src={source.poster} alt={title} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-ink" />
          )}
          <div className="absolute inset-0 bg-ink/30 transition-colors duration-300 group-hover:bg-ink/40" />
          <motion.span
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.06 }}
            className="absolute left-1/2 top-1/2 inline-flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gold text-ink shadow-xl md:h-20 md:w-20"
          >
            <Play size={26} weight="fill" className="ml-1" />
          </motion.span>
          {source.title && (
            <span className="absolute inset-x-0 bottom-0 p-5 text-left font-mono text-[11px] uppercase tracking-[0.18em] text-cream md:p-6">
              {source.title}
            </span>
          )}
        </button>
      ) : source.type === "file" ? (
        <video src={source.src} poster={source.poster} controls autoPlay playsInline className="h-full w-full object-cover">
          <track kind="captions" />
        </video>
      ) : (
        <iframe
          src={
            source.type === "youtube"
              ? `https://www.youtube-nocookie.com/embed/${source.id}?autoplay=1&rel=0`
              : `https://player.vimeo.com/video/${source.id}?autoplay=1`
          }
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      )}
    </div>
  );
}
