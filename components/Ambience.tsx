"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ambience } from "@/content/brand";
import { asset } from "@/lib/site";
import Monogram from "./Monogram";
import { Reveal, SplitHeading } from "./Reveal";

// Editorial layout: each tile's grid placement and how fast it drifts against the scroll.
const LAYOUT = [
  { cls: "md:col-span-7 md:row-span-2 aspect-[4/5] md:aspect-auto", speed: -6 },
  { cls: "md:col-span-5 aspect-[4/3]", speed: 8 },
  { cls: "md:col-span-5 aspect-[4/3]", speed: 4 },
  { cls: "md:col-span-5 aspect-[4/3] md:aspect-[4/5]", speed: -4 },
  { cls: "md:col-span-7 aspect-[16/10] md:aspect-auto", speed: 6 },
];
import { hideBroken } from "@/lib/ui";

/** SECTION F — Our ambience. Photo slots are set in content/brand.ts → ambience. */
export default function Ambience() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-tile]").forEach((tile) => {
        const speed = Number(tile.dataset.speed || 0);
        gsap.fromTo(tile.querySelector("[data-inner]"), { yPercent: -speed, scale: 1.12 }, {
          yPercent: speed,
          scale: 1.12,
          ease: "none",
          scrollTrigger: { trigger: tile, start: "top bottom", end: "bottom top", scrub: true },
        });
        gsap.fromTo(tile, { clipPath: "inset(12% 0% 12% 0%)", opacity: 0.2 }, {
          clipPath: "inset(0% 0% 0% 0%)",
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: { trigger: tile, start: "top 92%", end: "top 55%", scrub: true },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="ambience" className="relative z-10 bg-ink py-28 md:py-36">
      <div className="container-lux">
        <div className="mb-14 grid gap-6 md:grid-cols-2 md:items-end">
          <div>
            <Reveal>
              <p className="eyebrow mb-5">Our ambience</p>
            </Reveal>
            <SplitHeading text="A room for slow mornings and late cravings." className="display-md text-ivory" />
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-md text-sm leading-relaxed text-mist md:justify-self-end">
              Step in from Revu Main Road and take a seat. Photographs of AR Cafe will fill these frames soon.
            </p>
          </Reveal>
        </div>

        <ul className="grid gap-4 md:auto-rows-[minmax(16rem,1fr)] md:grid-cols-12 md:gap-5">
          {ambience.map((a, i) => {
            const l = LAYOUT[i % LAYOUT.length];
            return (
              <li key={a.title} data-tile data-speed={l.speed} className={`group relative overflow-hidden bg-coal ${l.cls}`}>
                <div data-inner className="absolute inset-[-8%]">
                  {a.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={asset(a.image)} onError={hideBroken} alt={a.title} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-[1.6s] group-hover:scale-105" />
                  ) : (
                    <div className="grain relative h-full w-full bg-[radial-gradient(120%_90%_at_30%_20%,#26221c_0%,#141414_55%,#0b0b0b_100%)]">
                      <Monogram fill="#d6b477" className="absolute right-[12%] top-[40%] h-[34%] max-h-56 w-auto -translate-y-1/2 opacity-[0.07]" />
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-7">
                  <div>
                    <span className="text-[0.6rem] tracking-[0.3em] text-gold">0{i + 1}</span>
                    <p className="font-display text-3xl text-ivory md:text-4xl">{a.title}</p>
                  </div>
                  {!a.image && <span className="text-[0.58rem] uppercase tracking-[0.3em] text-mist/80">Photograph coming soon</span>}
                </div>
                <span className="pointer-events-none absolute inset-3 border border-gold/0 transition-colors duration-700 group-hover:border-gold/40" />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
