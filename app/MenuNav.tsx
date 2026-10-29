"use client";

import { useEffect, useState } from "react";

// Sticky list of menu categories that highlights the one you are reading.
export default function MenuNav({ titles }: { titles: string[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerWidth >= 768 ? 140 : 200; // just below the sticky bars
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
    <nav
      aria-label="Menu categories"
      className="sticky top-[68px] z-10 -mx-4 min-w-0 bg-[#F3E7D5]/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 md:top-24 md:mx-0 md:rounded-2xl md:bg-white/70 md:p-3 md:ring-1 md:ring-[#E2CDA8]"
    >
      <ul className="flex gap-2 overflow-x-auto md:flex-col md:gap-1 md:overflow-visible">
        {titles.map((t, i) => (
          <li key={i} className="flex-none">
            <a
              href={"#cat-" + i}
              aria-current={active === i ? "true" : undefined}
              className={
                "block whitespace-nowrap rounded-full px-4 py-2 text-[15px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F2B4D] md:rounded-xl md:py-2.5 " +
                (active === i
                  ? "bg-[#1F2B4D] text-white"
                  : "bg-white/80 text-[#1F2B4D] ring-1 ring-[#E2CDA8] hover:bg-[#FBF3E6] md:bg-transparent md:ring-0")
              }
            >
              {t}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
