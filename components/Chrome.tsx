"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";

/** Thin gold reading-progress line, a trailing cursor ring (mouse only) and a back-to-top button. */
export default function Chrome() {
  return (
    <>
      <ScrollProgress />
      <CursorRing />
      <BackToTop />
    </>
  );
}

function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        if (bar.current) bar.current.style.transform = `scaleX(${h > 0 ? window.scrollY / h : 0})`;
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-px" aria-hidden>
      <div ref={bar} className="h-full origin-left bg-gradient-to-r from-bronze via-gold to-gold-hi" style={{ transform: "scaleX(0)" }} />
    </div>
  );
}

function CursorRing() {
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const ok = window.matchMedia("(pointer: fine) and (hover: hover)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- capability check on mount
    setEnabled(ok);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const el = ring.current!;
    const pos = { x: -100, y: -100 };
    const cur = { x: -100, y: -100 };
    let big = false;
    let raf = 0;
    const move = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      const t = e.target as Element | null;
      big = !!t?.closest?.("a, button, [role=button], input, textarea, select, label");
    };
    const loop = () => {
      cur.x += (pos.x - cur.x) * 0.2;
      cur.y += (pos.y - cur.y) * 0.2;
      el.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0) translate(-50%, -50%) scale(${big ? 1.8 : 1})`;
      el.style.opacity = big ? "0.9" : "0.55";
      raf = requestAnimationFrame(loop);
    };
    const leave = () => (el.style.opacity = "0");
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div
      ref={ring}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[90] h-8 w-8 rounded-full border border-gold opacity-0 mix-blend-difference transition-[opacity,scale] duration-300"
      style={{ transition: "opacity .3s" }}
    />
  );
}

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 1.5);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <a
      href="#top"
      aria-label="Back to top"
      className={`fixed bottom-5 left-5 z-40 grid h-11 w-11 place-items-center border border-gold/40 bg-ink/70 text-gold backdrop-blur transition-all duration-500 hover:border-gold hover:bg-gold hover:text-ink ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
      tabIndex={show ? 0 : -1}
    >
      <ArrowUp size={16} strokeWidth={1.5} />
    </a>
  );
}
