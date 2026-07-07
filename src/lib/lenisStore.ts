import type Lenis from "lenis";

/** Shared handle to the active Lenis instance so router-level code can reset scroll. */
let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

export function getLenis() {
  return instance;
}
