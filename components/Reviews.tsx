"use client";

import { SectionOrnament } from "./Ornament";
import { MapPin, MessageCircle, Star } from "lucide-react";
import { reviews } from "@/content/brand";
import { cafe, mapsSearchUrl, whatsappLink, whatsappReady } from "@/lib/site";
import { Reveal, SplitHeading } from "./Reveal";

/**
 * SECTION H — Customer experience. Shows only real reviews added in content/brand.ts → reviews.
 * Until there are some, it invites guests to share theirs (no made-up quotes or ratings).
 */
export default function Reviews() {
  const rated = reviews.filter((r) => typeof r.rating === "number");
  const avg = rated.length ? rated.reduce((a, r) => a + (r.rating || 0), 0) / rated.length : null;

  return (
    <section id="reviews" className="bg-classic relative z-10 overflow-hidden bg-ink py-28 md:py-36">
      <SectionOrnament inside />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(214,180,119,.12),transparent_60%)]" />
      <div className="container-lux relative">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="eyebrow mb-5">Guest experience</p>
          </Reveal>
          <SplitHeading text={reviews.length ? "In our guests' words." : "Your words belong here."} className="display-md text-ivory" />
          {avg !== null && (
            <Reveal delay={0.1} className="mt-6 flex items-center justify-center gap-3">
              <Stars value={avg} />
              <span className="text-sm text-mist">
                {avg.toFixed(1)} from {rated.length} review{rated.length > 1 ? "s" : ""} shared with us
              </span>
            </Reveal>
          )}
        </div>

        {reviews.length > 0 ? (
          <ul className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r, i) => (
              <Reveal as="li" key={i} delay={(i % 3) * 0.1} className="frame flex flex-col bg-coal p-8">
                <span className="font-display text-6xl leading-none text-gold/60" aria-hidden>
                  “
                </span>
                <blockquote className="mt-2 flex-1 font-display text-2xl leading-snug text-ivory">{r.quote}</blockquote>
                <div className="mt-6 flex items-center justify-between gap-3 border-t border-gold/15 pt-5">
                  <cite className="text-[0.7rem] not-italic uppercase tracking-[0.28em] text-mist">{r.name}</cite>
                  {typeof r.rating === "number" && <Stars value={r.rating} />}
                </div>
              </Reveal>
            ))}
          </ul>
        ) : (
          <Reveal delay={0.15} className="frame mx-auto mt-14 max-w-2xl bg-coal/70 px-6 py-12 text-center backdrop-blur sm:px-12">
            <p className="font-display text-2xl leading-snug text-ivory sm:text-3xl">
              We are just getting started. After your visit, tell us how it was — the kind words and the honest ones.
            </p>
            <p className="mt-4 text-sm text-mist">Guest reviews will appear here once guests share them with {cafe.name}.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {whatsappReady && (
                <a href={whatsappLink(`Hello ${cafe.name}! Here's my feedback: `)} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
                  <MessageCircle size={15} strokeWidth={1.5} /> Share on WhatsApp
                </a>
              )}
              <a href={mapsSearchUrl} target="_blank" rel="noopener noreferrer" className="btn btn-line">
                <MapPin size={15} strokeWidth={1.5} /> Find us on Google Maps
              </a>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <span className="flex gap-1" role="img" aria-label={`${value.toFixed(1)} out of 5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} size={14} strokeWidth={1.2} className={i < Math.round(value) ? "fill-gold text-gold" : "text-gold/40"} />
      ))}
    </span>
  );
}
