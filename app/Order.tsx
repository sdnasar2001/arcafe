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

export function AddToOrder({ name, price }: { name: string; price: string }) {
  const list = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const qty = list.find((l) => l.name === name)?.qty ?? 0;
  const p = toPrice(price);

  if (qty === 0) {
    return (
      <button type="button" onClick={() => change(name, p, 1)} className="add">
        + Add to order
      </button>
    );
  }
  return (
    <div className="stepper">
      <button type="button" onClick={() => change(name, p, -1)} aria-label={"Remove one " + name} className="stepper__btn">
        −
      </button>
      <span className="stepper__qty" aria-live="polite">{qty}</span>
      <button type="button" onClick={() => change(name, p, 1)} aria-label={"Add one more " + name} className="stepper__btn">
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
    <div className="orderbar">
      <div className="orderbar__inner">
        <p>
          {count} {count === 1 ? "item" : "items"}{" "}
          <span className="orderbar__total">
            {currency} {total}
            {unpriced ? "+" : ""}
          </span>
        </p>
        <div className="orderbar__actions">
          <button
            type="button"
            onClick={() => {
              lines = [];
              emit();
            }}
            className="orderbar__clear"
          >
            Clear
          </button>
          <a href={href} target="_blank" rel="noopener noreferrer" className="btn btn--whatsapp">
            Send order on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
