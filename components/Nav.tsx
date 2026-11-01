"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu as MenuIcon, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import Logo from "./Logo";
import { NAV_LINKS } from "@/lib/nav";


export default function Nav() {
  const cart = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background,border-color,backdrop-filter] duration-500 ${
          scrolled ? "border-b border-gold/15 bg-ink/75 backdrop-blur-md" : "border-b border-transparent"
        }`}
      >
        <nav className="container-lux flex h-16 items-center justify-between gap-6 md:h-20" aria-label="Main">
          <a href="#top" className="group flex items-center gap-3" aria-label="AR Cafe — back to the top">
            <Logo alt="" eager className="h-11 w-11 transition-transform duration-700 group-hover:scale-105 md:h-14 md:w-14" />
            <span className="hidden font-display text-lg tracking-[0.42em] text-ivory sm:inline">AR CAFE</span>
          </a>

          <ul className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="group relative py-2 text-[0.68rem] font-medium uppercase tracking-[0.3em] text-ivory/80 transition-colors hover:text-gold">
                  {l.label}
                  <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-gold transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => cart.setOpen(true)}
              className="relative inline-flex h-11 items-center gap-2 border border-gold/40 px-4 text-[0.66rem] font-semibold uppercase tracking-[0.26em] text-ivory transition-colors hover:border-gold hover:text-gold"
              aria-label={`Your order, ${cart.count} item${cart.count === 1 ? "" : "s"}`}
            >
              <ShoppingBag size={16} strokeWidth={1.5} />
              <span className="hidden sm:inline">Order</span>
              {cart.count > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[0.65rem] tracking-normal text-ink">{cart.count}</span>
              )}
            </button>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center border border-gold/40 text-ivory lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-nav"
            >
              <MenuIcon size={18} strokeWidth={1.5} />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="grain fixed inset-0 z-[60] flex flex-col bg-ink"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="container-lux flex h-16 items-center justify-between">
              <Logo alt="AR Cafe" className="h-11 w-11" />
              <button type="button" onClick={() => setOpen(false)} className="inline-flex h-11 w-11 items-center justify-center border border-gold/40" aria-label="Close menu">
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>
            <ul className="container-lux mt-6 flex flex-1 flex-col justify-center gap-3 pb-16">
              {NAV_LINKS.map((l, i) => (
                <motion.li key={l.href} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                  <a href={l.href} onClick={() => setOpen(false)} className="flex items-baseline gap-4 py-1 font-display text-5xl text-ivory">
                    <span className="font-sans text-[0.65rem] tracking-[0.3em] text-gold">0{i + 1}</span>
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <p className="container-lux pb-8 text-[0.65rem] uppercase tracking-[0.4em] text-gold/70">Crafted for the craving.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
