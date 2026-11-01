"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, MessageCircle } from "lucide-react";
import { brand } from "@/content/brand";
import { cafe, whatsappLink, whatsappReady } from "@/lib/site";
import { onIntroDone } from "@/lib/journey";

/** SECTION A — the first screen. The cup itself lives in the fixed 3D layer behind. */
export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = root.current!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const letters = el.querySelectorAll("[data-letter]");
    const fades = el.querySelectorAll("[data-fade]");
    const ctx = gsap.context(() => {
      if (reduced) return;
      gsap.set(letters, { yPercent: 115, opacity: 0 });
      gsap.set(fades, { y: 24, opacity: 0 });
      // Leaving the hero: the title drifts up and dissolves as the camera moves on.
      gsap.to("[data-hero-copy]", {
        yPercent: -18,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom 35%", scrub: true },
      });
    }, el);
    const stop = onIntroDone(() => {
      if (reduced) return;
      gsap.to(letters, { yPercent: 0, opacity: 1, duration: 1.4, stagger: 0.07, ease: "expo.out", delay: 0.15 });
      gsap.to(fades, { y: 0, opacity: 1, duration: 1.2, stagger: 0.14, ease: "power3.out", delay: 0.9 });
    });
    return () => {
      stop();
      ctx.revert();
    };
  }, []);

  const title = "AR CAFE";
  return (
    <section ref={root} id="top" className="relative z-10 flex min-h-[100svh] flex-col items-center px-4 pb-10 pt-28 text-center md:pt-32">
      <div data-hero-copy className="flex flex-col items-center">
        <p data-fade className="eyebrow mb-6 flex items-center gap-4">
          <span className="rule" /> {cafe.address} <span className="rule" />
        </p>
        <h1 className="display-xl pl-[0.14em]" aria-label={title}>
          {title.split("").map((ch, i) => (
            <span key={i} aria-hidden className="inline-block overflow-hidden align-bottom">
              <span data-letter className="gold-text inline-block">
                {ch === " " ? " " : ch}
              </span>
            </span>
          ))}
        </h1>
        <p data-fade className="mt-5 font-display text-xl uppercase tracking-[0.42em] text-ivory sm:text-2xl md:text-[1.75rem]">
          {brand.tagline}
        </p>
        <p data-fade className="mt-3 max-w-md text-sm text-mist sm:text-base">
          {brand.heroLine}
        </p>
        <div data-fade className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href="#menu" className="btn btn-gold">
            Explore menu
          </a>
          <a href="#visit" className="btn btn-line">
            Visit AR Cafe
          </a>
        </div>
        {whatsappReady && (
          <a
            data-fade
            href={whatsappLink(`Hello ${cafe.name}! I'd like to place an order.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="link-gold mt-5 inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.28em]"
          >
            <MessageCircle size={15} strokeWidth={1.5} /> Order on WhatsApp
          </a>
        )}
      </div>

      <a href="#story" data-fade className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.6rem] uppercase tracking-[0.4em] text-gold/80 md:flex">
        Scroll
        <ArrowDown size={14} strokeWidth={1.25} className="scroll-cue" />
      </a>
    </section>
  );
}
