"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/lib/cart";
import type { MenuItem } from "@/lib/site";

/** "Add" button that turns into a − 2 + quantity stepper once the dish is in the order. */
export default function AddToOrder({ item, size = "md" }: { item: MenuItem; size?: "md" | "lg" }) {
  const cart = useCart();
  const q = cart.qty(item.id);
  const h = size === "lg" ? "h-12" : "h-10";

  if (!item.available) {
    return <span className="text-[0.65rem] uppercase tracking-[0.24em] text-mist/70">Not available today</span>;
  }

  return (
    <div className={`relative ${h} min-w-[8.5rem]`}>
      <AnimatePresence initial={false} mode="popLayout">
        {q === 0 ? (
          <motion.button
            key="add"
            type="button"
            onClick={() => cart.add(item.id)}
            className={`btn btn-line ${h} min-h-0 w-full px-4`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            aria-label={`Add ${item.name} to your order`}
          >
            <Plus size={14} strokeWidth={1.5} /> Add
          </motion.button>
        ) : (
          <motion.div
            key="qty"
            className={`flex ${h} w-full items-center justify-between border border-gold bg-gold/10`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
          >
            <button type="button" onClick={() => cart.remove(item.id)} className="grid h-full w-10 place-items-center text-gold hover:bg-gold hover:text-ink" aria-label={`One less ${item.name}`}>
              <Minus size={14} strokeWidth={1.5} />
            </button>
            <span className="font-display text-xl tabular-nums text-ivory" aria-live="polite" aria-label={`${q} ${item.name} in your order`}>
              {q}
            </span>
            <button type="button" onClick={() => cart.add(item.id)} className="grid h-full w-10 place-items-center text-gold hover:bg-gold hover:text-ink" aria-label={`One more ${item.name}`}>
              <Plus size={14} strokeWidth={1.5} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** FSSAI-style food mark: green square-dot for vegetarian, brown square-triangle for non-vegetarian. */
export function FoodMark({ type, className = "" }: { type: MenuItem["type"]; className?: string }) {
  if (!type) return null;
  const veg = type === "veg";
  return (
    <span
      className={`inline-grid h-4 w-4 shrink-0 place-items-center border-[1.5px] bg-ivory/95 ${veg ? "border-veg" : "border-nonveg"} ${className}`}
      role="img"
      aria-label={veg ? "Vegetarian" : "Non-vegetarian"}
      title={veg ? "Vegetarian" : "Non-vegetarian"}
    >
      {veg ? (
        <span className="h-2 w-2 rounded-full bg-veg" />
      ) : (
        <span className="h-0 w-0 border-x-[4.5px] border-b-[8px] border-x-transparent border-b-nonveg" />
      )}
    </span>
  );
}
