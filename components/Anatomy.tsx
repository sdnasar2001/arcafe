"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ingredients } from "@/content/brand";
import { journey } from "@/lib/journey";

/**
 * SECTION E — Anatomy of a cup. The section is tall and its content stays pinned while you
 * scroll: the cup lifts from the saucer and turns, and each ingredient floats out to its label.
 */
export default function Anatomy() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = root.current!;
    const labels = Array.from(el.querySelectorAll<HTMLElement>("[data-ing]"));
    const bar = el.querySelector<HTMLElement>("[data-bar]");
    const apply = (p: number) => {
      journey.explode = p;
      labels.forEach((l) => {
        const i = Number(l.dataset.ing);
        const on = Math.min(1, Math.max(0, (p - 0.18 - (i % 3) * 0.1 - (i >= 3 ? 0.05 : 0)) / 0.12));
        l.style.opacity = String(on);
        l.style.transform = `translateY(${(1 - on) * 14}px)`;
      });
      if (bar) bar.style.transform = `scaleX(${p})`;
    };
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (s) => apply(s.progress),
      onRefresh: (s) => apply(s.progress),
    });
    return () => st.kill();
  }, []);

  const left = ingredients.slice(0, 3);
  const right = ingredients.slice(3, 6);

  return (
    <section ref={root} id="anatomy" className="relative z-10 h-[260vh] md:h-[300vh]" aria-labelledby="anatomy-title">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        <div className="container-lux pt-24 text-center md:pt-28">
          <p className="eyebrow">The interactive cup</p>
          <h2 id="anatomy-title" className="display-md mt-4 text-ivory">
            The anatomy of a <em className="gold-text font-display">perfect</em> cup
          </h2>
        </div>

        {/* desktop: labels sit beside the ingredients floating in the 3D scene */}
        <div className="pointer-events-none absolute inset-0 hidden md:block">
          {left.map((ing, i) => (
            <Label key={ing.name} i={i} name={ing.name} note={ing.note} side="left" />
          ))}
          {right.map((ing, i) => (
            <Label key={ing.name} i={i + 3} name={ing.name} note={ing.note} side="right" />
          ))}
        </div>

        {/* phones: the ingredients ring the cup, labels list beneath */}
        <ul className="container-lux mt-auto grid grid-cols-2 gap-x-4 gap-y-3 pb-24 md:hidden">
          {ingredients.slice(0, 6).map((ing, i) => (
            <li key={ing.name} data-ing={i} className="border-l border-gold/40 bg-ink/60 py-1 pl-3 opacity-0 backdrop-blur-sm">
              <p className="font-display text-xl text-ivory">{ing.name}</p>
              <p className="text-xs leading-snug text-mist">{ing.note}</p>
            </li>
          ))}
        </ul>

        <div className="absolute inset-x-0 bottom-8 hidden flex-col items-center gap-3 md:flex">
          <p className="text-[0.6rem] uppercase tracking-[0.4em] text-mist">Keep scrolling to open the cup</p>
          <div className="h-px w-40 bg-gold/20">
            <div data-bar className="h-full origin-left bg-gold" style={{ transform: "scaleX(0)" }} />
          </div>
          <p className="text-[0.6rem] tracking-[0.2em] text-mist/70">Ingredients vary with the tea of the day.</p>
        </div>
      </div>
    </section>
  );
}

const ROWS = ["31%", "50%", "69%"];
function Label({ i, name, note, side }: { i: number; name: string; note: string; side: "left" | "right" }) {
  const row = ROWS[i % 3];
  return (
    <div
      data-ing={i}
      className={`absolute w-[18vw] max-w-64 -translate-y-1/2 opacity-0 ${side === "left" ? "left-[4vw] text-right" : "right-[4vw] text-left"}`}
      style={{ top: row }}
    >
      <div className={`flex items-center gap-3 ${side === "left" ? "flex-row-reverse" : ""}`}>
        <span className="h-px flex-1 bg-gradient-to-r from-gold/0 via-gold/60 to-gold/0" />
        <span className="font-sans text-[0.6rem] tracking-[0.3em] text-gold">0{i + 1}</span>
      </div>
      <p className="mt-2 font-display text-3xl text-ivory">{name}</p>
      <p className="mt-1 text-sm leading-snug text-mist">{note}</p>
    </div>
  );
}
