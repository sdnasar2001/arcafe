"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";

// The order lives here. Menu buttons add to it; it shows in a panel beside the menu on a
// computer, and in a bar at the foot of the screen (opening a full-screen order page) on a
// phone. Both are visible from the start, empty or not. Kept in this browser between visits.

type Line = { name: string; price: number | null; qty: number };
type Details = { name: string; when: string; how: string; note: string };
type State = { lines: Line[]; details: Details; added: { name: string; at: number } | null };

const KEY = "arcafe-order-v2";
const TIMES = ["As soon as possible", "In 15 minutes", "In 30 minutes", "In 1 hour"];
const HOW = ["Take away", "Eat at the cafe"];

let state: State = { lines: [], details: { name: "", when: TIMES[0], how: HOW[0], note: "" }, added: null };
let loaded = false;
const listeners = new Set<() => void>();
const SERVER: State = state;

function set(next: Partial<State>) {
  state = { ...state, ...next };
  try {
    localStorage.setItem(KEY, JSON.stringify({ lines: state.lines, details: { ...state.details, note: "" } }));
  } catch {}
  listeners.forEach((l) => l());
}
function subscribe(l: () => void) {
  if (!loaded) {
    loaded = true;
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "null");
      if (saved && Array.isArray(saved.lines)) {
        state = {
          ...state,
          lines: saved.lines.filter((x: Line) => x && typeof x.name === "string" && x.qty > 0),
          details: { ...state.details, ...(saved.details || {}) },
        };
        queueMicrotask(() => listeners.forEach((fn) => fn()));
      }
    } catch {}
  }
  listeners.add(l);
  return () => listeners.delete(l);
}
const useOrder = () => useSyncExternalStore(subscribe, () => state, () => SERVER);

function change(name: string, price: number | null, delta: number) {
  const found = state.lines.find((l) => l.name === name);
  let lines: Line[];
  if (found) {
    const qty = found.qty + delta;
    lines = qty > 0 ? state.lines.map((l) => (l === found ? { ...l, qty } : l)) : state.lines.filter((l) => l !== found);
  } else if (delta > 0) {
    lines = [...state.lines, { name, price, qty: delta }];
  } else return;
  set({ lines, added: delta > 0 ? { name, at: Date.now() } : state.added });
  // "Tea added" shows in the phone bar for a moment after each add
  if (delta > 0) {
    clearTimeout(flashTimer);
    flashTimer = setTimeout(() => set({ added: null }), 2200);
  }
}
let flashTimer: ReturnType<typeof setTimeout> | undefined;
const setDetails = (d: Partial<Details>) => set({ details: { ...state.details, ...d } });

function toPrice(p: string) {
  const n = parseFloat(String(p).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : null;
}
function totals(lines: Line[]) {
  return {
    count: lines.reduce((n, l) => n + l.qty, 0),
    total: lines.reduce((n, l) => n + (l.price ?? 0) * l.qty, 0),
    unpriced: lines.some((l) => l.price === null),
  };
}
const OPEN_EVENT = "arcafe:open-order";
const isPhone = () => window.matchMedia("(max-width: 60rem)").matches;

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
  const { lines } = useOrder();
  const qty = lines.find((l) => l.name === name)?.qty ?? 0;
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

// Header button: "Order" with the item count. Opens the order page on a phone,
// scrolls to the order panel on a computer.
export function OrderButton() {
  const { lines } = useOrder();
  const { count } = totals(lines);
  return (
    <a
      href="#order"
      className="btn btn--primary btn--small order-btn"
      onClick={(e) => {
        if (isPhone()) {
          e.preventDefault();
          window.dispatchEvent(new Event(OPEN_EVENT));
        }
      }}
    >
      Order
      {count > 0 && (
        <span className="order-btn__count" aria-label={count + " items in your order"}>
          {count}
        </span>
      )}
    </a>
  );
}

// Everything about the order: the items, the choices and the send button.
function OrderContents({ phone, currency, cafe, idBase }: { phone: string; currency: string; cafe: string; idBase: string }) {
  const { lines, details } = useOrder();
  const { count, total, unpriced } = totals(lines);
  const empty = lines.length === 0;

  const message = [
    `Hello ${cafe}! I'd like to order:`,
    "",
    ...lines.map((l) => `${l.qty} x ${l.name}` + (l.price !== null ? ` (${currency} ${l.price * l.qty})` : "")),
    "",
    `Total: ${currency} ${total}` + (unpriced ? " + items to be priced at the counter" : ""),
    "",
    `${details.how}, ${details.when.toLowerCase()}`,
    `Name: ${details.name.trim()}`,
    ...(details.note.trim() ? [`Note: ${details.note.trim()}`] : []),
  ].join("\n");
  const href = "https://wa.me/" + phone + "?text=" + encodeURIComponent(message);

  return (
    <>
      {empty ? (
        <div className="order__empty">
          <p className="order__empty-title">Your order is empty</p>
          <p>
            Tap <strong>+ Add</strong> on any item in the menu. It shows up here, and you send it to us on WhatsApp.
          </p>
        </div>
      ) : (
        <ul className="order__lines" aria-label="Items in your order">
          {lines.map((l) => (
            <li key={l.name}>
              <span className="order__name">{l.name}</span>
              <span className="order__price">{l.price !== null ? `${currency} ${l.price * l.qty}` : "Price at counter"}</span>
              <Stepper name={l.name} price={l.price} qty={l.qty} small />
            </li>
          ))}
        </ul>
      )}
      {!empty && (
        <p className="order__total">
          <span>
            {count} {count === 1 ? "item" : "items"}
          </span>
          <strong>
            {currency} {total}
            {unpriced ? " + counter prices" : ""}
          </strong>
        </p>
      )}
      <div className="order__form">
        <fieldset className="choice">
          <legend>How would you like it?</legend>
          {HOW.map((o) => (
            <label key={o} className="choice__opt">
              <input type="radio" name={idBase + "how"} value={o} checked={details.how === o} onChange={() => setDetails({ how: o })} />
              <span>{o}</span>
            </label>
          ))}
        </fieldset>
        <div className="field">
          <label htmlFor={idBase + "when"}>When</label>
          <select id={idBase + "when"} value={details.when} onChange={(e) => setDetails({ when: e.target.value })}>
            {TIMES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor={idBase + "name"}>Your name</label>
          <input id={idBase + "name"} name="name" autoComplete="name" value={details.name} onChange={(e) => setDetails({ name: e.target.value })} />
        </div>
        <div className="field field--wide">
          <label htmlFor={idBase + "note"}>Note (optional)</label>
          <input id={idBase + "note"} name="note" value={details.note} onChange={(e) => setDetails({ note: e.target.value })} />
        </div>
      </div>
      {empty ? (
        <button type="button" className="btn btn--whatsapp order__send" disabled>
          Send order on WhatsApp
        </button>
      ) : (
        <a href={href} target="_blank" rel="noopener noreferrer" className="btn btn--whatsapp order__send">
          Send order on WhatsApp
        </a>
      )}
      <p className="order__hint">{empty ? "Add an item to send your order." : "WhatsApp opens with your order written out. Just press send."}</p>
      {!empty && (
        <button type="button" className="order__clear" onClick={() => set({ lines: [] })}>
          Clear order
        </button>
      )}
    </>
  );
}

// Computer: the order panel beside the menu, always visible.
export function OrderPanel({ phone, currency, cafe }: { phone: string; currency: string; cafe: string }) {
  const ids = useId();
  if (!phone) return null;
  return (
    <aside className="order order--panel" id="order" aria-labelledby={ids + "title"}>
      <h2 className="order__title" id={ids + "title"}>
        Your order
      </h2>
      <OrderContents phone={phone} currency={currency} cafe={cafe} idBase={ids} />
    </aside>
  );
}

// Phone: a bar at the foot of the screen from the first moment, opening a full-screen order page.
export function OrderBar({ phone, currency, cafe }: { phone: string; currency: string; cafe: string }) {
  const { lines, added } = useOrder();
  const flash = added?.name ?? null;
  const [open, setOpen] = useState(false);
  const ids = useId();
  const barBtn = useRef<HTMLButtonElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, show);
    return () => window.removeEventListener(OPEN_EVENT, show);
  }, []);


  useEffect(() => {
    if (!open) return;
    document.documentElement.classList.add("order-open");
    titleRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const bar = barBtn.current;
    return () => {
      document.documentElement.classList.remove("order-open");
      window.removeEventListener("keydown", onKey);
      bar?.focus();
    };
  }, [open]);

  if (!phone) return null;
  const { count, total, unpriced } = totals(lines);

  return (
    <>
      <div className="orderbar">
        <div className="orderbar__inner">
          {flash ? (
            <p className="orderbar__flash" role="status">
              <span aria-hidden="true">✓</span> {flash} added
            </p>
          ) : count === 0 ? (
            <p className="orderbar__empty">
              <strong>Your order is empty.</strong> Tap + Add on any item to start.
            </p>
          ) : (
            <p className="orderbar__summary">
              {count} {count === 1 ? "item" : "items"}{" "}
              <span className="orderbar__total">
                {currency} {total}
                {unpriced ? "+" : ""}
              </span>
            </p>
          )}
          <button ref={barBtn} type="button" className="btn btn--gold orderbar__open" aria-haspopup="dialog" aria-controls={ids + "page"} onClick={() => setOpen(true)}>
            View order
          </button>
        </div>
      </div>
      {open && (
        <div className="orderpage" role="dialog" aria-modal="true" aria-labelledby={ids + "title"} id={ids + "page"}>
          <div className="orderpage__head">
            <h2 className="order__title" id={ids + "title"} ref={titleRef} tabIndex={-1}>
              Your order
            </h2>
            <button type="button" className="btn btn--line btn--small" onClick={() => setOpen(false)}>
              Back to menu
            </button>
          </div>
          <div className="order orderpage__body">
            <OrderContents phone={phone} currency={currency} cafe={cafe} idBase={ids} />
          </div>
        </div>
      )}
    </>
  );
}
