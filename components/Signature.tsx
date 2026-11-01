"use client";

import { MessageCircle } from "lucide-react";
import { signature } from "@/content/brand";
import { allItems, cafe, money, resize, whatsappLink, whatsappReady } from "@/lib/site";
import AddToOrder, { FoodMark } from "./AddToOrder";
import { Reveal, SplitHeading } from "./Reveal";
import { hideBroken } from "@/lib/ui";

/** SECTION C — the signature dish. The 3D cup and its orbiting ingredients float on the left. */
export default function Signature() {
  const item = allItems.find((i) => i.name.toLowerCase() === signature.itemName.toLowerCase()) ?? allItems.find((i) => i.available);
  if (!item) return <section id="signature" className="relative z-10 min-h-[60vh]" />;
  const wa = whatsappLink(`Hello ${cafe.name}! I'd like to order: ${item.name} x 1`);

  return (
    <section id="signature" className="relative z-10">
      <div className="container-lux grid min-h-[110svh] items-center py-28 md:grid-cols-12">
        <div className="relative md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8">
          <div className="absolute -inset-6 -z-10 bg-ink/75 blur-2xl md:hidden" aria-hidden />
          <Reveal>
            <p className="eyebrow mb-6 flex items-center gap-4">
              <span className="rule" /> {signature.eyebrow}
            </p>
          </Reveal>
          <SplitHeading text={signature.headline} className="display-lg text-ivory" />

          <Reveal delay={0.1} className="frame mt-10 flex gap-5 bg-coal/80 p-4 backdrop-blur-sm sm:p-5">
            {item.image && (
              <div className="relative aspect-square w-28 shrink-0 overflow-hidden sm:w-36">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resize(item.image, 480, 480)} onError={hideBroken} alt={item.name} loading="lazy" decoding="async" className="h-full w-full scale-110 object-cover transition-transform duration-[1.6s] hover:scale-125" />
              </div>
            )}
            <div className="flex min-w-0 flex-col">
              <div className="flex items-center gap-3">
                <FoodMark type={item.type} />
                <h3 className="font-display text-3xl text-ivory">{item.name}</h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-mist">{item.description}</p>
              <p className="mt-auto pt-3 font-display text-3xl text-gold">{item.price !== null ? money(item.price) : <span className="text-base text-mist">Price at the counter</span>}</p>
            </div>
          </Reveal>

          <Reveal delay={0.2} className="mt-8 flex flex-wrap gap-3">
            <AddToOrder item={item} size="lg" />
            {whatsappReady && item.available && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
                <MessageCircle size={15} strokeWidth={1.5} /> Order via WhatsApp
              </a>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
