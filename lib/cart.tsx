"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { allItems, cafe, money, type MenuItem } from "./site";

type Lines = Record<string, number>; // item id → quantity
type Cart = {
  lines: { item: MenuItem; qty: number }[];
  count: number;
  subtotal: number;
  unpriced: number; // items in the order with no price set
  qty: (id: string) => number;
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  name: string;
  setName: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
};

const CartContext = createContext<Cart | null>(null);
const KEY = "arcafe-order-v1";
const byId = new Map(allItems.map((i) => [i.id, i]));

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Lines>({});
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [loaded, setLoaded] = useState(false);

  // Remember an unfinished order on this device (best effort; private windows may refuse).
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "{}");
      if (saved && typeof saved === "object") {
        const clean: Lines = {};
        for (const [id, q] of Object.entries(saved.lines || {})) {
          const it = byId.get(id);
          if (it && it.available && typeof q === "number" && q > 0) clean[id] = Math.min(99, Math.floor(q));
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring saved state once on mount
        setLines(clean);
        if (typeof saved.name === "string") setName(saved.name);
      }
    } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({ lines, name }));
    } catch {}
  }, [lines, name, loaded]);

  const add = useCallback((id: string) => setLines((l) => ({ ...l, [id]: Math.min(99, (l[id] || 0) + 1) })), []);
  const remove = useCallback(
    (id: string) =>
      setLines((l) => {
        const n = (l[id] || 0) - 1;
        const next = { ...l };
        if (n > 0) next[id] = n;
        else delete next[id];
        return next;
      }),
    [],
  );
  const clear = useCallback(() => setLines({}), []);

  const value = useMemo<Cart>(() => {
    const ls = Object.entries(lines)
      .map(([id, qty]) => ({ item: byId.get(id)!, qty }))
      .filter((l) => l.item);
    return {
      lines: ls,
      count: ls.reduce((a, l) => a + l.qty, 0),
      subtotal: ls.reduce((a, l) => a + (l.item.price ?? 0) * l.qty, 0),
      unpriced: ls.filter((l) => l.item.price === null).length,
      qty: (id) => lines[id] || 0,
      add,
      remove,
      clear,
      open,
      setOpen,
      name,
      setName,
      notes,
      setNotes,
    };
  }, [lines, add, remove, clear, open, name, notes]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart must be used inside <CartProvider>");
  return c;
}

/** The WhatsApp order message, in the format the cafe reads. */
export function orderMessage(cart: Pick<Cart, "lines" | "subtotal" | "unpriced" | "name" | "notes">) {
  const rows = cart.lines.map((l, i) => {
    const price = l.item.price === null ? "price at the counter" : money(l.item.price * l.qty);
    return `${i + 1}. ${l.item.name} x ${l.qty} — ${price}`;
  });
  const total =
    cart.unpriced > 0
      ? `Total: ${money(cart.subtotal)} + ${cart.unpriced} item${cart.unpriced > 1 ? "s" : ""} priced at the counter`
      : `Total: ${money(cart.subtotal)}`;
  return [
    `Hello ${cafe.name}!`,
    "",
    "I would like to place an order.",
    "",
    ...rows,
    "",
    total,
    "",
    `Customer Name: ${cart.name.trim() || "-"}`,
    `Special Instructions: ${cart.notes.trim() || "-"}`,
    "",
    "Please confirm my order.",
  ].join("\n");
}
