/**
 * Detects when the browser is rendering without GPU acceleration (or the user
 * asked for reduced motion) so the app can swap its always-on, per-frame effects
 * — backdrop blur, the fixed grain overlay, Lenis momentum, marquee, Ken Burns —
 * for cheap equivalents. One-shot interaction/entrance/hover animations stay on
 * everywhere; only the continuous, repaint-heavy effects are traded away.
 *
 * The signal is the WebGL renderer string: with hardware acceleration off, Chrome
 * falls back to SwiftShader and Firefox to llvmpipe/Mesa (or WebGL is missing
 * entirely). That is the same condition that makes CPU rasterization slow, so it
 * is exactly what we want to key off of.
 */
function detectLowPower(): boolean {
  if (typeof window === "undefined") return false;

  // Manual override for testing on any browser: `?perf=lite` / `?perf=full`
  // (persisted), so the fast path can be verified without toggling GPU flags.
  try {
    const url = new URLSearchParams(window.location.search).get("perf");
    if (url === "lite" || url === "full") localStorage.setItem("perf", url);
    const forced = localStorage.getItem("perf");
    if (forced === "lite") return true;
    if (forced === "full") return false;
  } catch {
    /* storage blocked — fall through to detection */
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;

  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;

    // No WebGL at all is a strong signal the GPU pipeline is unavailable.
    if (!gl) return true;

    const dbg = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = dbg
      ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL))
      : "";

    return /swiftshader|llvmpipe|software|microsoft basic render|mesa offscreen|paravirtual/i.test(
      renderer
    );
  } catch {
    // A thrown context request usually means a blocked/absent GPU path.
    return true;
  }
}

/** Evaluated once on the client. Static — no reactivity needed. */
export const LOW_POWER = detectLowPower();

// Expose to CSS so purely presentational effects can be toggled without JS.
if (typeof document !== "undefined") {
  document.documentElement.dataset.perf = LOW_POWER ? "lite" : "full";
}
