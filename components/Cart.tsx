"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, MessageCircle, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { orderMessage, useCart } from "@/lib/cart";
import { cafe, money, resize, whatsappLink, whatsappReady } from "@/lib/site";
import { FoodMark } from "./AddToOrder";
import { useIsMobile } from "@/lib/journey";
import { hideBroken } from "@/lib/ui";

/** Floating order button + the order drawer that sends the order to WhatsApp. */
export default function Cart() {
  const cart = useCart();
  const [sent, setSent] = useState(false);
  const mobile = useIsMobile();
  const { open: isOpen, setOpen } = cart;
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    opener.current = document.activeElement as HTMLElement;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && panel.current) {
        // keep keyboard focus inside the drawer
        const f = panel.current.querySelectorAll<HTMLElement>("button, a[href], input, textarea");
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    setTimeout(() => panel.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus(), 50);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      opener.current?.focus?.();
    };
  }, [isOpen, setOpen]);

  const checkout = () => {
    if (!whatsappReady || cart.count === 0) return;
    window.open(whatsappLink(orderMessage(cart)), "_blank", "noopener,noreferrer");
    setSent(true);
  };

  return (
    <>
      <AnimatePresence>
        {cart.count > 0 && !cart.open && (
          <motion.button
            type="button"
            onClick={() => cart.setOpen(true)}
            className="fixed bottom-5 right-5 z-40 flex h-14 items-center gap-3 bg-gold pl-5 pr-6 text-ink shadow-[0_20px_50px_-15px_rgba(214,180,119,.6)]"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            aria-label={`View your order: ${cart.count} item${cart.count > 1 ? "s" : ""}`}
          >
            <span className="relative">
              <ShoppingBag size={20} strokeWidth={1.5} />
              <motion.span key={cart.count} initial={{ scale: 1.6 }} animate={{ scale: 1 }} className="absolute -right-2.5 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[0.62rem] font-semibold text-gold">
                {cart.count}
              </motion.span>
            </span>
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.22em]">
              View order{cart.subtotal > 0 ? ` · ${money(cart.subtotal)}` : ""}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cart.open && (
          <>
            <motion.div className="fixed inset-0 z-[75] bg-ink/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => cart.setOpen(false)} />
            <motion.div
              ref={panel}
              role="dialog"
              aria-modal="true"
              aria-labelledby="order-title"
              className="fixed inset-x-0 bottom-0 z-[76] flex max-h-[92svh] flex-col border-t border-gold/40 bg-coal sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[28rem] sm:border-l sm:border-t-0"
              initial={mobile ? { y: "100%" } : { x: "100%" }}
              animate={{ x: 0, y: 0 }}
              exit={mobile ? { y: "100%" } : { x: "100%" }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between border-b border-gold/15 px-6 py-5">
                <div>
                  <p className="eyebrow">Your order</p>
                  <h2 id="order-title" className="mt-1 font-display text-3xl text-ivory">
                    {cart.count > 0 ? `${cart.count} item${cart.count > 1 ? "s" : ""}` : "Nothing yet"}
                  </h2>
                </div>
                <button type="button" data-autofocus onClick={() => cart.setOpen(false)} className="grid h-11 w-11 place-items-center border border-gold/40 text-ivory hover:bg-gold hover:text-ink" aria-label="Close your order">
                  <X size={18} strokeWidth={1.5} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5">
                {cart.count === 0 ? (
                  <div className="py-10 text-center">
                    <p className="font-display text-2xl text-ivory">Your order is empty.</p>
                    <p className="mt-2 text-sm text-mist">Add dishes from the menu and they will appear here.</p>
                    <a href="#menu" onClick={() => cart.setOpen(false)} className="btn btn-line mt-6">
                      Browse the menu
                    </a>
                  </div>
                ) : (
                  <>
                    <ul className="divide-y divide-gold/10">
                      {cart.lines.map(({ item, qty }) => (
                        <li key={item.id} className="flex gap-4 py-4">
                          <div className="h-16 w-16 shrink-0 overflow-hidden bg-ink">
                            {item.image && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={resize(item.image, 160, 160)} onError={hideBroken} alt="" className="h-full w-full object-cover" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="flex items-center gap-2 font-display text-xl leading-tight text-ivory">
                                <FoodMark type={item.type} className="h-3.5 w-3.5" />
                                {item.name}
                              </p>
                              <p className="shrink-0 font-display text-xl text-gold">{item.price !== null ? money(item.price * qty) : ""}</p>
                            </div>
                            <p className="text-xs text-mist">{item.price !== null ? `${money(item.price)} each` : "Price at the counter"}</p>
                            <div className="mt-2 flex items-center gap-1">
                              <button type="button" onClick={() => cart.remove(item.id)} className="grid h-8 w-8 place-items-center border border-gold/30 text-gold hover:bg-gold hover:text-ink" aria-label={qty === 1 ? `Remove ${item.name}` : `One less ${item.name}`}>
                                {qty === 1 ? <Trash2 size={13} strokeWidth={1.5} /> : <Minus size={13} strokeWidth={1.5} />}
                              </button>
                              <span className="w-8 text-center tabular-nums">{qty}</span>
                              <button type="button" onClick={() => cart.add(item.id)} className="grid h-8 w-8 place-items-center border border-gold/30 text-gold hover:bg-gold hover:text-ink" aria-label={`One more ${item.name}`}>
                                <Plus size={13} strokeWidth={1.5} />
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 space-y-4">
                      <label className="block">
                        <span className="mb-1.5 block text-[0.65rem] uppercase tracking-[0.24em] text-mist">Your name (optional)</span>
                        <input className="field" value={cart.name} onChange={(e) => cart.setName(e.target.value)} autoComplete="name" maxLength={60} />
                      </label>
                      <label className="block">
                        <span className="mb-1.5 block text-[0.65rem] uppercase tracking-[0.24em] text-mist">Special instructions (optional)</span>
                        <textarea className="field min-h-24 resize-y" value={cart.notes} onChange={(e) => cart.setNotes(e.target.value)} maxLength={400} placeholder="Less sugar, extra hot, pick-up time…" />
                      </label>
                    </div>
                  </>
                )}
              </div>

              {cart.count > 0 && (
                <div className="border-t border-gold/15 bg-ink/60 px-6 py-5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[0.7rem] uppercase tracking-[0.28em] text-mist">Subtotal</span>
                    <span className="font-display text-3xl text-gold">{money(cart.subtotal)}</span>
                  </div>
                  {cart.unpriced > 0 && (
                    <p className="mt-1 text-right text-xs text-mist">
                      + {cart.unpriced} item{cart.unpriced > 1 ? "s" : ""} priced at the counter
                    </p>
                  )}

                  {whatsappReady ? (
                    <button type="button" onClick={checkout} className="btn btn-gold mt-5 w-full">
                      <MessageCircle size={16} strokeWidth={1.5} /> Checkout via WhatsApp
                    </button>
                  ) : (
                    <p className="mt-5 flex items-start gap-2 border border-gold/30 p-3 text-sm text-mist" role="alert">
                      <AlertCircle size={16} className="mt-0.5 shrink-0 text-gold" />
                      WhatsApp ordering opens once {cafe.name}&apos;s number is added. Please order at the counter for now.
                    </p>
                  )}

                  <AnimatePresence>
                    {sent && (
                      <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3 text-xs leading-relaxed text-mist" role="status">
                        WhatsApp opened with your order. Press <span className="text-ivory">send</span> there — your order is confirmed only when {cafe.name} replies.
                      </motion.p>
                    )}
                  </AnimatePresence>
                  <div className="mt-3 flex justify-between text-[0.65rem] uppercase tracking-[0.22em]">
                    <button type="button" onClick={() => cart.setOpen(false)} className="text-mist hover:text-gold">
                      Add more dishes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        cart.clear();
                        setSent(false);
                      }}
                      className="text-mist hover:text-gold"
                    >
                      Clear order
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
