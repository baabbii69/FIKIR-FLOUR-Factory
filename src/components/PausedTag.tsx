import { Clock } from "@phosphor-icons/react";
import { useI18n } from "../i18n/I18nProvider";

/**
 * Marks a product line whose production has stopped for a while.
 *
 * The alternative — hiding the range until it returns — costs the page, its
 * photos and whatever search ranking it has built, and all of that has to be
 * earned again from zero when production restarts. Saying "back soon" keeps the
 * range discoverable and tells a customer something true.
 *
 * `tone` matches the two surfaces it appears on: cream cards and the ink
 * sections behind them.
 */
export default function PausedTag({
  tone = "light",
  className = "",
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  const { t } = useI18n();
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] ${
        tone === "dark"
          ? "border-gold/40 bg-gold/10 text-gold"
          : "border-gold-deep/30 bg-gold-deep/10 text-gold-deep"
      } ${className}`}
    >
      <Clock size={11} weight="bold" />
      {t("prod.paused.badge", "Back soon")}
    </span>
  );
}
