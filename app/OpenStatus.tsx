"use client";

import { useEffect, useState } from "react";
import { parseHours } from "./hours";

// Live "Open now / Closed now" sign, using the cafe's time in India.
export default function OpenStatus({ hours }: { hours: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => {
      const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      }).formatToParts(new Date());
      const h = Number(parts.find((p) => p.type === "hour")?.value);
      const m = Number(parts.find((p) => p.type === "minute")?.value);
      setNow(h * 60 + m);
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  const h = parseHours(hours);
  if (!h || now === null) return null;

  const isOpen = h.open < h.close ? now >= h.open && now < h.close : now >= h.open || now < h.close;

  return (
    <p
      className={
        "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold ring-1 " +
        (isOpen ? "bg-[#E7F4EC] text-[#14532D] ring-[#A7D7B8]" : "bg-[#FBECEC] text-[#7F1D1D] ring-[#F0BFBF]")
      }
    >
      <span className={"h-2.5 w-2.5 rounded-full " + (isOpen ? "bg-[#16A34A]" : "bg-[#DC2626]")} aria-hidden="true" />
      {isOpen ? `Open now, closes at ${h.closeLabel}` : `Closed now, opens at ${h.openLabel}`}
    </p>
  );
}
