"use client";

import { useEffect, useState } from "react";

// Sticky list of menu categories that highlights the one you are reading.
export default function MenuNav({ titles }: { titles: string[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerWidth >= 960 ? 160 : 210; // just below the sticky bars
      let current = 0;
      titles.forEach((_, i) => {
        const el = document.getElementById("cat-" + i);
        if (el && el.getBoundingClientRect().top <= line) current = i;
      });
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [titles]);

  return (
    <nav aria-label="Menu categories" className="catnav">
      <ul className="catnav__list">
        {titles.map((t, i) => (
          <li key={i}>
            <a href={"#cat-" + i} aria-current={active === i ? "true" : undefined} className="catnav__link">
              {t}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
