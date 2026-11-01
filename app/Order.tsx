"use client";

import { useEffect, useId, useState, useSyncExternalStore } from "react";

// The order: menu buttons add to it, the nav button shows its count, and the bottom
// bar turns it into a WhatsApp message. Kept in this browser so a reload keeps the basket.
type Line = { name: string; price: number | null; qty: number };
const KEY = "arcafe-order-v1";
let lines: Line[] = [];
let loaded = false;
const listeners = new Set<() => void>();
const save = () => {
  try {
    localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {}
};
const emit = () => {
  save();
  listeners.forEach((l) => l());
};
const subscribe = (l: () => void) => {
  if (!loaded) {
    loaded = true;
    try {
      const raw = localStorage.getItem(KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) lines = parsed.filter((x) => x && typeof x.name === "string" && x.qty > 0);
    } catch {}
    queueMicrotask(() => listeners.forEach((fn) => fn()));
  }
  listeners.add(l);
  return () => listeners.delete(l);
};
const snapshot = () => lines;
const serverSnapshot = (): Line[] => [];
const useOrder = () => useSyncExternalStore(subscribe, snapshot, serverSnapshot);

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

function Stepper({ name, price, qty, small }: { name: string; price: number | null; qty: number; small?: boolean }) {
  return (
    <div className={"stepper" + (small ? " stepper--small" : "")}>
      <button type="button" onClick={() => change(name, price, -1)} aria-label={"Remove one " + name} className="stepper__btn">
        −
      </button>
      <span className="stepper__qty" aria-live="polite">
        {qty}
      </span>
      <button type="button" onClick={() => change(name, price, 1)} aria-label={"Add one more " + name} className="stepper__btn">
        +
      </button>
    </div>
  );
}

export function AddToOrder({ name, price, small }: { name: string; price: string; small?: boolean }) {
  const list = useOrder();
  const qty = list.find((l) => l.name === name)?.qty ?? 0;
  const p = toPrice(price);
  if (qty === 0) {
    return (
      <button type="button" onClick={() => change(name, p, 1)} className={"add" + (small ? " add--small" : "")} aria-label={"Add " + name + " to your order"}>
        + Add
      </button>
    );
  }
  return <Stepper name={name} price={p} qty={qty} small={small} />;
}

// Nav button: "Order" with the number of items in the basket.
export function OrderButton() {
  const list = useOrder();
  const count = list.reduce((n, l) => n + l.qty, 0);
  return (
    <a href={count ? "#order" : "#menu"} className="btn btn--primary btn--small order-btn" data-count={count || undefined}>
      Order
      {count > 0 && (
        <span className="order-btn__count" aria-label={count + " items in your order"}>
          {count}
        </span>
      )}
    </a>
  );
}

const TIMES = ["As soon as possible", "In 15 minutes", "In 30 minutes", "In 1 hour"];

export function OrderBar({ phone, currency, cafe }: { phone: string; currency: string; cafe: string }) {
  const list = useOrder();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [when, setWhen] = useState(TIMES[0]);
  const [how, setHow] = useState("Take away");
  const [note, setNote] = useState("");
  const ids = useId();

  // "#order" in the address (from the nav button) opens the basket.
  useEffect(() => {
    const check = () => {
      if (window.location.hash === "#order") setOpen(true);
    };
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, []);

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
    `${how}, ${when.toLowerCase()}`,
    `Name: ${name.trim()}`,
    ...(note.trim() ? [`Note: ${note.trim()}`] : []),
  ].join("\n");
  const href = "https://wa.me/" + phone + "?text=" + encodeURIComponent(message);

  return (
    <div className="orderbar" id="order">
      <div className={"orderbar__inner" + (open ? " is-open" : "")}>
        {open && (
          <div className="sheet" id={ids + "sheet"}>
            <div className="sheet__head">
              <h2 className="sheet__title">Your order</h2>
              <button type="button" className="orderbar__clear" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
            <ul className="sheet__lines">
              {list.map((l) => (
                <li key={l.name}>
                  <span className="sheet__name">{l.name}</span>
                  <span className="sheet__price">{l.price !== null ? `${currency} ${l.price * l.qty}` : "Price at counter"}</span>
                  <Stepper name={l.name} price={l.price} qty={l.qty} small />
                </li>
              ))}
            </ul>
            <div className="sheet__form">
              <fieldset className="choice">
                <legend>How</legend>
                {["Take away", "Eat at the cafe"].map((o) => (
                  <label key={o} className="choice__opt">
                    <input type="radio" name={ids + "how"} value={o} checked={how === o} onChange={() => setHow(o)} />
                    <span>{o}</span>
                  </label>
                ))}
              </fieldset>
              <div className="field">
                <label htmlFor={ids + "when"}>When</label>
                <select id={ids + "when"} value={when} onChange={(e) => setWhen(e.target.value)}>
                  {TIMES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor={ids + "name"}>Your name</label>
                <input id={ids + "name"} name="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor={ids + "note"}>Note (optional)</label>
                <input id={ids + "note"} name="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Less sugar, extra chutney…" />
              </div>
            </div>
          </div>
        )}
        <div className="orderbar__row">
          <button type="button" className="orderbar__summary" aria-expanded={open} aria-controls={ids + "sheet"} onClick={() => setOpen(!open)}>
            {count} {count === 1 ? "item" : "items"}
            <span className="orderbar__total">
              {currency} {total}
              {unpriced ? "+" : ""}
            </span>
            <span className="orderbar__toggle">{open ? "Hide" : "Review"}</span>
          </button>
          <div className="orderbar__actions">
            <button
              type="button"
              onClick={() => {
                lines = [];
                emit();
                setOpen(false);
              }}
              className="orderbar__clear"
            >
              Clear
            </button>
            <a href={href} target="_blank" rel="noopener noreferrer" className="btn btn--whatsapp">
              Send on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
