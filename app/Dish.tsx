"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { addToOrder, useQtyInOrder } from "./Order";

// Tapping a dish (its name or photo) opens a card with a big photo, the description,
// the price and a quantity picker. One card serves the whole page.

export type Dish = { name: string; description: string; price: string; image: string; group: string; available: boolean };

const OPEN = "arcafe:dish";

// Larger version of a menu photo for the card (Unsplash links carry their size in the address).
const bigger = (src: string) =>
  /images\.unsplash\.com/.test(src) ? src.replace(/w=\d+/, "w=960").replace(/h=\d+/, "h=720") : src;

export function DishButton({ dish, children, className }: { dish: Dish; children: ReactNode; className?: string }) {
  return (
    <button
      type="button"
      className={"dish-btn" + (className ? " " + className : "")}
      aria-haspopup="dialog"
      aria-label={"More about " + dish.name}
      onClick={() => window.dispatchEvent(new CustomEvent(OPEN, { detail: dish }))}
    >
      {children}
    </button>
  );
}

export function DishCard({ currency, orderable }: { currency: string; orderable: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [dish, setDish] = useState<Dish | null>(null);
  const [qty, setQty] = useState(1);
  const inOrder = useQtyInOrder(dish?.name ?? "");

  useEffect(() => {
    const open = (e: Event) => {
      setDish((e as CustomEvent<Dish>).detail);
      setQty(1);
      ref.current?.showModal();
    };
    window.addEventListener(OPEN, open);
    return () => window.removeEventListener(OPEN, open);
  }, []);

  const close = () => ref.current?.close();
  const price = dish?.price ? parseFloat(dish.price.replace(/[^0-9.]/g, "")) : NaN;
  const hasPrice = Number.isFinite(price);

  return (
    <dialog
      ref={ref}
      className="dish"
      aria-labelledby="dish-title"
      onClick={(e) => {
        if (e.target === ref.current) close(); // tap outside the card
      }}
    >
      {dish && (
        <div className="dish__card">
          {dish.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="dish__photo" src={bigger(dish.image)} alt={dish.name} width={960} height={720} />
          ) : null}
          <div className="dish__body">
            <p className="dish__group">{dish.group}</p>
            <h2 id="dish-title" className="dish__title">
              {dish.name}
            </h2>
            {dish.description && <p className="dish__desc">{dish.description}</p>}
            <p className="dish__price">{hasPrice ? `${currency} ${dish.price}` : "Price at the counter"}</p>
            {inOrder > 0 && <p className="dish__inorder">Already in your order: {inOrder}</p>}

            {!dish.available ? (
              <p className="dish__off">Not available today</p>
            ) : orderable ? (
              <div className="dish__order">
                <div className="stepper" role="group" aria-label="Quantity">
                  <button type="button" className="stepper__btn" aria-label="One less" disabled={qty <= 1} onClick={() => setQty((q) => Math.max(1, q - 1))}>
                    −
                  </button>
                  <span className="stepper__qty" aria-live="polite">
                    {qty}
                  </span>
                  <button type="button" className="stepper__btn" aria-label="One more" onClick={() => setQty((q) => Math.min(20, q + 1))}>
                    +
                  </button>
                </div>
                <button
                  type="button"
                  className="btn btn--gold dish__add"
                  onClick={() => {
                    addToOrder(dish.name, dish.price, qty);
                    close();
                  }}
                >
                  <span>Add {qty} to order</span>
                  {hasPrice && (
                    <span className="dish__addprice">
                      {currency} {price * qty}
                    </span>
                  )}
                </button>
              </div>
            ) : null}
          </div>
          <button type="button" className="dish__close" onClick={close} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      )}
    </dialog>
  );
}
