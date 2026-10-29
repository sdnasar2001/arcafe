"use client";

import { useSyncExternalStore } from "react";

// A tiny shared order list: menu buttons add to it, the bottom bar sends it to WhatsApp.
type Line = { name: string; price: number | null; qty: number };
let lines: Line[] = [];
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const snapshot = () => lines;
const serverSnapshot = (): Line[] => [];

function change(name: string, price: number | null, delta: number) {
  const found = lines.find((l) => l.name === name);
  if (found) {
    const qty = found.qty + delta;
    lines = qty > 0 ? lines.map((l) => (l === found ? { ...l, qty } : l)) : lines.filter((l) => l !== found);
  } else if (delta > 0) {
    lines = [...lines, { name, price, qty: delta }];
  }
  emit();
}

function toPrice(p: string) {
  const n = parseFloat(String(p).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : null;
}

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F2B4D]";

export function AddToOrder({ name, price }: { name: string; price: string }) {
  const list = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const qty = list.find((l) => l.name === name)?.qty ?? 0;
  const p = toPrice(price);

  if (qty === 0) {
    return (
      <button
        type="button"
        onClick={() => change(name, p, 1)}
        className={"mt-2 inline-flex min-h-9 items-center rounded-full border border-[#C9A24A] bg-white/70 px-4 text-sm font-bold text-[#1F2B4D] transition-colors hover:bg-[#FBF3E6] " + focus}
      >
        + Add to order
      </button>
    );
  }
  return (
    <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#1F2B4D] p-1 text-white">
      <button type="button" onClick={() => change(name, p, -1)} aria-label={"Remove one " + name} className={"grid h-8 w-8 place-items-center rounded-full text-lg font-bold hover:bg-white/15 " + focus}>
        −
      </button>
      <span className="min-w-6 text-center text-sm font-bold" aria-live="polite">{qty}</span>
      <button type="button" onClick={() => change(name, p, 1)} aria-label={"Add one more " + name} className={"grid h-8 w-8 place-items-center rounded-full text-lg font-bold hover:bg-white/15 " + focus}>
        +
      </button>
    </div>
  );
}

export function OrderBar({ phone, currency, cafe }: { phone: string; currency: string; cafe: string }) {
  const list = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  if (!phone || list.length === 0) return null;

  const count = list.reduce((n, l) => n + l.qty, 0);
  const total = list.reduce((n, l) => n + (l.price ?? 0) * l.qty, 0);
  const unpriced = list.some((l) => l.price === null);

  const message = [
    `Hello ${cafe}! I'd like to order:`,
    "",
    ...list.map((l) => `${l.qty} x ${l.name}` + (l.price !== null ? ` (${currency} ${l.price * l.qty})` : "")),
    "",
    `Total: ${currency} ${total}` + (unpriced ? " + items to be priced at the counter" : ""),
    "",
    "Name: ",
    "Pickup time: ",
  ].join("\n");
  const href = "https://wa.me/" + phone + "?text=" + encodeURIComponent(message);

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 px-3 pb-3 sm:px-4 sm:pb-4">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#1F2B4D] px-5 py-3 text-white shadow-[0_12px_40px_-12px_rgba(31,43,77,0.6)]">
        <p className="font-semibold">
          {count} {count === 1 ? "item" : "items"}
          <span className="text-[#E9CF8A]">
            {" "}
            {currency} {total}
            {unpriced ? "+" : ""}
          </span>
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              lines = [];
              emit();
            }}
            className="rounded-full px-3 py-2 text-sm font-semibold text-white/80 hover:text-white focus-visible:outline-2 focus-visible:outline-white"
          >
            Clear
          </button>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#25D366] px-5 py-2.5 font-bold text-[#0B3D20] transition hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Send order on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
