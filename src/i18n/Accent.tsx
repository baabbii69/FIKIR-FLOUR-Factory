/**
 * Renders a title string, wrapping any *starred* segment in the gold display
 * accent. Works for both English fallbacks and Amharic translations, so the
 * highlight survives translation. tone="dark" for dark backgrounds (bright
 * gold), "light" for light backgrounds (deep gold).
 */
export function Accent({ text, tone = "light" }: { text: string; tone?: "light" | "dark" }) {
  const cls = tone === "dark" ? "text-gold" : "text-gold-deep";
  const parts = text.split(/\*(.+?)\*/g);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <em key={i} className={`pb-1 italic leading-[1.1] ${cls}`}>
            {p}
          </em>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}
