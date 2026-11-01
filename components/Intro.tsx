"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { journey, markIntroDone } from "@/lib/journey";
import Monogram from "./Monogram";

/**
 * Opening sequence (also the loading screen): black → a champagne light crosses the screen →
 * the AR monogram draws itself → the curtain lifts and the cup rises into the scene.
 * Plays in full once per visit, shortened on reloads, and is skipped with reduced motion.
 */
export default function Intro() {
  const [gone, setGone] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const light = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let repeat = false;
    try {
      repeat = sessionStorage.getItem("arcafe-intro") === "1";
      sessionStorage.setItem("arcafe-intro", "1");
    } catch {}

    const html = document.documentElement;
    const finish = () => {
      html.style.overflow = "";
      setGone(true);
    };

    if (reduced) {
      journey.intro = 1;
      markIntroDone();
      finish();
      return;
    }

    html.style.overflow = "hidden";
    const k = repeat ? 0.4 : 1;
    const paths = el.querySelectorAll("[data-draw]");
    const tl = gsap.timeline({ onComplete: finish });
    tl.fromTo(light.current, { xPercent: -160, opacity: 0 }, { xPercent: 260, opacity: 1, duration: 1.6 * k, ease: "power2.inOut" }, 0.1 * k)
      .to(paths, { strokeDashoffset: 0, duration: 1.3 * k, stagger: 0.07 * k, ease: "power2.inOut" }, 0.35 * k)
      .to(paths, { fillOpacity: 1, strokeOpacity: 0, duration: 0.7 * k, ease: "power1.out" }, 1.45 * k)
      .fromTo(word.current, { opacity: 0, letterSpacing: "1.1em" }, { opacity: 1, letterSpacing: "0.6em", duration: 1 * k, ease: "power3.out" }, 1.5 * k)
      .add(() => {
        markIntroDone();
        gsap.to(journey, { intro: 1, duration: 2.8, ease: "power2.out" });
      }, 2.35 * k)
      .to(el, { opacity: 0, duration: 0.9 * k, ease: "power2.inOut" }, 2.35 * k);

    return () => {
      tl.kill();
      html.style.overflow = "";
    };
  }, []);

  if (gone) return null;
  return (
    <div ref={root} className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-ink" role="status" aria-label="Loading AR Cafe">
      <div
        ref={light}
        className="pointer-events-none absolute inset-y-0 left-0 w-[45vw] opacity-0"
        style={{ background: "linear-gradient(90deg, transparent, rgba(214,180,119,.0) 20%, rgba(241,223,182,.22) 50%, rgba(214,180,119,0) 80%, transparent)", filter: "blur(18px)" }}
      />
      <div className="relative flex flex-col items-center gap-7">
        <Monogram draw className="w-24 sm:w-32" />
        <p ref={word} className="pl-[0.6em] font-display text-sm tracking-[0.6em] text-gold opacity-0 sm:text-base">
          AR CAFE
        </p>
      </div>
    </div>
  );
}
