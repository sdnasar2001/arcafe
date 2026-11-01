"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { money, resize, type MenuItem } from "@/lib/site";
import { hideBroken } from "@/lib/ui";
import AddToOrder, { FoodMark } from "./AddToOrder";
import Monogram from "./Monogram";

// Tapping a dish (its photo or name) opens a card with a big photo, the description,
// the price and the quantity in the order. One card serves the whole page.
const OPEN = "arcafe:dish";

export function DishButton({ item, children, className = "" }: { item: MenuItem; children: ReactNode; className?: string }) {
  return (
    <button
      type="button"
      className={`block w-full text-left ${className}`}
      aria-haspopup="dialog"
      aria-label={`More about ${item.name}`}
      onClick={() => window.dispatchEvent(new CustomEvent<MenuItem>(OPEN, { detail: item }))}
    >
      {children}
    </button>
  );
}

export default function DishDetail() {
  const [item, setItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    const open = (e: Event) => setItem((e as CustomEvent<MenuItem>).detail);
    window.addEventListener(OPEN, open);
    return () => window.removeEventListener(OPEN, open);
  }, []);

  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setItem(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [item]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[78] grid place-items-end bg-ink/80 backdrop-blur-sm sm:place-items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setItem(null)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="dish-title"
            className="frame relative w-full max-w-xl bg-coal"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-coal-2">
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={resize(item.image, 960, 720)} onError={hideBroken} alt={item.name} className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center">
                  <Monogram className="h-20 w-auto opacity-25" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-coal via-transparent to-transparent" />
              <button
                type="button"
                autoFocus
                onClick={() => setItem(null)}
                className="absolute right-3 top-3 grid h-11 w-11 place-items-center border border-gold/40 bg-ink/60 text-ivory backdrop-blur hover:bg-gold hover:text-ink"
                aria-label="Close"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>
            <div className="p-6 sm:p-8">
              <p className="eyebrow">{item.category}</p>
              <div className="mt-3 flex items-start justify-between gap-4">
                <h3 id="dish-title" className="flex items-center gap-3 font-display text-4xl text-ivory">
                  <FoodMark type={item.type} />
                  {item.name}
                </h3>
                <p className="shrink-0 pt-1 font-display text-3xl text-gold">{item.price !== null ? money(item.price) : ""}</p>
              </div>
              <p className="mt-3 leading-relaxed text-mist">{item.description}</p>
              <div className="mt-6 flex items-center justify-between gap-4 border-t border-gold/15 pt-6">
                <span className="text-[0.62rem] uppercase tracking-[0.2em] text-mist/80">{item.price === null && item.available ? "Price at the counter" : ""}</span>
                <AddToOrder item={item} size="lg" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
