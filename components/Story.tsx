"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { brand, story } from "@/content/brand";
import { allItems, asset, cafe, heroImage, highlights, resize } from "@/lib/site";
import { Reveal, SplitHeading } from "./Reveal";
import { hideBroken } from "@/lib/ui";

/** SECTION B — Our story. Words come from site.json (welcome text, highlights) and content/brand.ts. */
export default function Story() {
  const band = useRef<HTMLDivElement>(null);
  const tea = allItems.find((i) => i.image && /tea/i.test(i.name)) ?? allItems.find((i) => i.image);
  const photo = story.image ? asset(story.image) : heroImage ? asset(heroImage) : tea ? resize(tea.image, 1800, 760) : "";

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !band.current) return;
    const ctx = gsap.context(() => {
      // The photograph opens like a curtain, then drifts slower than the page.
      gsap.fromTo("[data-band]", { clipPath: "inset(18% 22% 18% 22%)" }, {
        clipPath: "inset(0% 0% 0% 0%)",
        ease: "none",
        scrollTrigger: { trigger: band.current, start: "top 95%", end: "center 55%", scrub: true },
      });
      gsap.fromTo("[data-band-img]", { scale: 1.3, yPercent: -6 }, {
        scale: 1.02,
        yPercent: 6,
        ease: "none",
        scrollTrigger: { trigger: band.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    }, band);
    return () => ctx.revert();
  }, []);

  return (
    <section id="story" className="relative z-10">
      <div className="container-lux grid min-h-[100svh] items-center py-28 md:grid-cols-12">
        <div className="relative md:col-span-6 lg:col-span-5">
          {/* on phones the cup sits behind this text, so it gets a soft backing */}
          <div className="absolute -inset-6 -z-10 bg-ink/70 blur-2xl md:hidden" aria-hidden />
          <Reveal>
            <p className="eyebrow mb-6">Our story</p>
          </Reveal>
          <SplitHeading text={story.heading} className="display-lg text-ivory" />
          <Reveal delay={0.15}>
            <p className="mt-8 text-lg leading-relaxed text-ivory/85">{cafe.intro}</p>
          </Reveal>
          {story.paragraphs.map((p, i) => (
            <Reveal key={i} delay={0.2 + i * 0.05}>
              <p className="mt-5 leading-relaxed text-mist">{p}</p>
            </Reveal>
          ))}
          <ul className="mt-12 grid gap-px bg-gold/15 sm:grid-cols-3 md:grid-cols-1">
            {highlights.map((h, i) => (
              <Reveal as="li" key={h.title} delay={0.25 + i * 0.1} className="bg-ink p-5">
                <span className="font-display text-sm text-gold">0{i + 1}</span>
                <h3 className="mt-2 font-display text-2xl text-ivory">{h.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist">{h.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>

      {photo && (
        <div ref={band} className="bg-classic relative bg-ink pb-24">
          <div data-band className="relative mx-auto aspect-[4/5] w-full overflow-hidden sm:aspect-[21/9]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img data-band-img onError={hideBroken} src={photo} alt={`At ${cafe.name}`} loading="lazy" decoding="async" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />
            <p className="absolute inset-x-0 bottom-8 text-center font-display text-2xl italic text-ivory/90 sm:text-4xl">
              {brand.tagline}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
