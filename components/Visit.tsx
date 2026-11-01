"use client";

import { SectionOrnament } from "./Ornament";
import { useEffect, useState } from "react";
import { Clock, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import { brand } from "@/content/brand";
import { cafe, directionsUrl, hours, mapEmbedFor, phoneDisplay, phoneLink, whatsappLink, whatsappReady } from "@/lib/site";
import { Reveal, SplitHeading } from "./Reveal";

/** Open / closed right now, by India time (the cafe's clock), from the hours in site.json. */
export function useOpenNow() {
  const [open, setOpen] = useState<boolean | null>(null);
  useEffect(() => {
    const h = hours;
    if (!h) return;
    const check = () => {
      const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
      const m = Number(parts.find((p) => p.type === "hour")?.value) * 60 + Number(parts.find((p) => p.type === "minute")?.value);
      setOpen(h.close > h.open ? m >= h.open && m < h.close : m >= h.open || m < h.close);
    };
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, []);
  return open;
}

/** SECTION I — Location and contact. */
export default function Visit() {
  const open = useOpenNow();
  const [mapOn, setMapOn] = useState(false);

  return (
    <section id="visit" className="bg-classic relative z-10 bg-coal py-28 md:py-36">
      <SectionOrnament />
      <div className="container-lux grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="eyebrow mb-5">Visit AR Cafe</p>
          </Reveal>
          <SplitHeading text="Find your seat on Revu Main Road." className="display-md text-ivory" />

          <Reveal delay={0.1}>
            <address className="mt-10 not-italic">
              <p className="font-display text-3xl tracking-[0.2em] text-gold">AR CAFE</p>
              <p className="mt-3 text-lg leading-relaxed text-ivory/90">
                Revu Main Road
                <br />
                Parangi Pettai
                <br />
                Tamil Nadu, India
              </p>
            </address>
          </Reveal>

          <Reveal delay={0.15} className="mt-8 space-y-4 border-t border-gold/15 pt-8 text-sm">
            <p className="flex items-start gap-3">
              <Clock size={16} strokeWidth={1.5} className="mt-0.5 shrink-0 text-gold" />
              <span>
                <span className="text-ivory">{cafe.hours || "Opening hours — to be announced"}</span>
                {open !== null && (
                  <span className={`ml-3 inline-flex items-center gap-1.5 text-[0.65rem] uppercase tracking-[0.2em] ${open ? "text-[#7cc48f]" : "text-mist"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${open ? "bg-[#7cc48f]" : "bg-mist"}`} /> {open ? "Open now" : "Closed now"}
                  </span>
                )}
              </span>
            </p>
            <p className="flex items-start gap-3">
              <Phone size={16} strokeWidth={1.5} className="mt-0.5 shrink-0 text-gold" />
              {phoneLink ? (
                <a href={phoneLink} className="link-gold">
                  {phoneDisplay}
                </a>
              ) : (
                <span className="text-mist">Phone number — to be announced</span>
              )}
            </p>
            <p className="flex items-start gap-3">
              <MapPin size={16} strokeWidth={1.5} className="mt-0.5 shrink-0 text-gold" />
              <span className="text-mist">{cafe.address}, Tamil Nadu</span>
            </p>
          </Reveal>

          <Reveal delay={0.2} className="mt-10 flex flex-wrap gap-3">
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
              <Navigation size={15} strokeWidth={1.5} /> Get directions
            </a>
            {whatsappReady && (
              <a href={whatsappLink(`Hello ${cafe.name}!`)} target="_blank" rel="noopener noreferrer" className="btn btn-line">
                <MessageCircle size={15} strokeWidth={1.5} /> WhatsApp us
              </a>
            )}
          </Reveal>
        </div>

        <Reveal delay={0.1} className="lg:col-span-7">
          <div className="frame relative aspect-[4/3] w-full overflow-hidden bg-ink lg:aspect-auto lg:h-full lg:min-h-[32rem]">
            {mapOn ? (
              <iframe
                title={`Map showing ${cafe.name}, ${cafe.address}`}
                src={mapEmbedFor(brand.mapEmbedUrl)}
                className="absolute inset-0 h-full w-full border-0 [filter:grayscale(1)_invert(.92)_contrast(.85)_sepia(.25)]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : (
              // The map loads only when asked for: keeps the page fast and Google out until needed.
              <button type="button" onClick={() => setMapOn(true)} className="group absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_45%,#2a3d5f,#18253d_70%)]">
                <span aria-hidden className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(#d6b477_1px,transparent_1px),linear-gradient(90deg,#d6b477_1px,transparent_1px)] [background-size:48px_48px]" />
                <span className="relative flex flex-col items-center gap-4">
                  <span className="grid h-16 w-16 place-items-center rounded-full border border-gold/50 text-gold transition-transform duration-500 group-hover:scale-110">
                    <MapPin size={22} strokeWidth={1.3} />
                  </span>
                  <span className="text-[0.68rem] uppercase tracking-[0.32em] text-ivory">Show the map</span>
                </span>
              </button>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
