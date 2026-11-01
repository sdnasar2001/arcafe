"use client";

import { SectionOrnament } from "./Ornament";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, X } from "lucide-react";
import { brand } from "@/content/brand";
import { allItems, resize } from "@/lib/site";
import { Reveal, SplitHeading } from "./Reveal";
import { hideBroken } from "@/lib/ui";

/** SECTION G — an Instagram-style grid of the menu's photographs, with a lightbox. */
export default function Gallery() {
  const shots = allItems.filter((i) => i.image).slice(0, 9);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((o) => (o === null ? o : (o + 1) % shots.length));
      if (e.key === "ArrowLeft") setOpen((o) => (o === null ? o : (o - 1 + shots.length) % shots.length));
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, shots.length]);

  if (shots.length === 0) return null;
  const current = open !== null ? shots[open] : null;

  return (
    <section id="gallery" className="bg-classic relative z-10 bg-coal py-28 md:py-36">
      <SectionOrnament />
      <div className="container-lux">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Reveal>
              <p className="eyebrow mb-5">Gallery</p>
            </Reveal>
            <SplitHeading text="From our counter to your feed." className="display-md text-ivory" />
          </div>
          <Reveal delay={0.1}>
            {brand.instagram ? (
              <a href={brand.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-line">
                <Camera size={15} strokeWidth={1.5} /> Follow on Instagram
              </a>
            ) : (
              <p className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-mist">
                <Camera size={14} strokeWidth={1.5} className="text-gold" /> Instagram — coming soon
              </p>
            )}
          </Reveal>
        </div>

        <ul className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3">
          {shots.map((s, i) => (
            <Reveal as="li" key={s.id} delay={(i % 3) * 0.08} y={40}>
              <button type="button" onClick={() => setOpen(i)} className="group relative block aspect-square w-full overflow-hidden bg-ink" aria-label={`View photo: ${s.name}`}>
                <motion.img
                  onError={hideBroken}
                  layoutId={`shot-${s.id}`}
                  src={resize(s.image, 600, 600)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-110"
                />
                <span className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/80 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="font-display text-2xl text-ivory">{s.name}</span>
                </span>
              </button>
            </Reveal>
          ))}
        </ul>
      </div>

      <AnimatePresence>
        {current && (
          <motion.div
            className="fixed inset-0 z-[80] grid place-items-center bg-ink/92 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
            aria-label={current.name}
          >
            <figure className="relative w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
              <motion.img layoutId={`shot-${current.id}`} src={resize(current.image, 1400, 1050)} alt={current.name} className="aspect-[4/3] w-full object-cover" />
              <figcaption className="mt-4 flex items-center justify-between">
                <span className="font-display text-3xl text-ivory">{current.name}</span>
                <span className="text-[0.65rem] uppercase tracking-[0.3em] text-gold">{current.category}</span>
              </figcaption>
              <button type="button" onClick={() => setOpen(null)} className="absolute -top-14 right-0 grid h-11 w-11 place-items-center border border-gold/40 text-ivory hover:bg-gold hover:text-ink" aria-label="Close photo" autoFocus>
                <X size={18} strokeWidth={1.5} />
              </button>
            </figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
