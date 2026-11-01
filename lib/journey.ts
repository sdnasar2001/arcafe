"use client";

import { useEffect, useState } from "react";

/**
 * One shared, mutable state object that links the page's scroll position to the 3D scene.
 * Scroll code writes to it; the scene reads it every frame (no React re-renders involved).
 *
 *  stage   0 = hero, 1 = our story, 2 = signature, 3 = anatomy of a cup (continuous values in between)
 *  intro   0 → 1 while the opening sequence plays
 *  explode 0 → 1 while the anatomy section is scrolled through
 *  fade    1 = scene visible, 0 = scene hidden (after the anatomy section)
 */
export const journey = {
  stage: 0,
  intro: 0,
  explode: 0,
  fade: 1,
  pointerX: 0,
  pointerY: 0,
};

export function useMedia(query: string, initial = false) {
  const [match, setMatch] = useState(initial);
  useEffect(() => {
    const m = window.matchMedia(query);
    const on = () => setMatch(m.matches);
    on();
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, [query]);
  return match;
}

export const useReducedMotion = () => useMedia("(prefers-reduced-motion: reduce)");
export const useIsMobile = () => useMedia("(max-width: 767px)");

/** Fires once the opening sequence has finished (or immediately if it already has). */
export function onIntroDone(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  if ((window as unknown as { __arIntroDone?: boolean }).__arIntroDone) {
    cb();
    return () => {};
  }
  window.addEventListener("ar:intro-done", cb, { once: true });
  return () => window.removeEventListener("ar:intro-done", cb);
}
export function markIntroDone() {
  (window as unknown as { __arIntroDone?: boolean }).__arIntroDone = true;
  window.dispatchEvent(new Event("ar:intro-done"));
}

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

// Handy for checking the scene from the browser console: window.__arJourney
if (typeof window !== "undefined") (window as unknown as { __arJourney?: typeof journey }).__arJourney = journey;
