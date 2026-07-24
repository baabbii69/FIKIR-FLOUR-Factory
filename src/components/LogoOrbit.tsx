import { motion } from "motion/react";
import { LOW_POWER } from "../lib/perf";

/**
 * The brand mark with two arcs orbiting it in opposite directions — a nod to
 * the logo's own interlocking green + gold swooshes. Shared by the boot loader
 * and the page-transition curtain so both feel like the same brand moment.
 * On software renderers (LOW_POWER) the continuous rotation is dropped for a
 * static mark — the surrounding panel animation still plays.
 */
export default function LogoOrbit({
  size = 128,
  label = false,
}: {
  size?: number;
  label?: boolean;
}) {
  const spin = !LOW_POWER;
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative" style={{ width: size, height: size }}>
        {spin && (
          <>
            <motion.svg
              viewBox="0 0 100 100"
              className="absolute inset-0 h-full w-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
            >
              <circle
                cx="50"
                cy="50"
                r="47"
                fill="none"
                stroke="var(--color-green)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="62 235"
              />
            </motion.svg>
            <motion.svg
              viewBox="0 0 100 100"
              className="absolute inset-0 h-full w-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 4.6, repeat: Infinity, ease: "linear" }}
            >
              <circle
                cx="50"
                cy="50"
                r="39"
                fill="none"
                stroke="var(--color-gold-bright)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="40 205"
              />
            </motion.svg>
          </>
        )}
        <motion.img
          src="/logo-mark.png"
          alt=""
          draggable={false}
          className="absolute inset-[19%] h-[62%] w-[62%] object-contain"
          animate={spin ? { scale: [1, 0.92, 1] } : undefined}
          transition={spin ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" } : undefined}
        />
      </div>
      {label && (
        <span className="font-mono text-[11px] uppercase tracking-[0.42em] text-cream/55">
          Fikir
        </span>
      )}
    </div>
  );
}
