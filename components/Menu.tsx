"use client";

import { SectionOrnament } from "./Ornament";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { menu, money, resize, type MenuItem } from "@/lib/site";
import AddToOrder, { FoodMark } from "./AddToOrder";
import Monogram from "./Monogram";
import { DishButton } from "./DishDetail";
import { Reveal, SplitHeading } from "./Reveal";

type Diet = "all" | "veg" | "nonveg";
const DIETS: { id: Diet; label: string; short: string }[] = [
  { id: "all", label: "All", short: "All" },
  { id: "veg", label: "Vegetarian", short: "Veg" },
  { id: "nonveg", label: "Non-vegetarian", short: "Non-veg" },
];
import { hideBroken } from "@/lib/ui";

/** SECTION D — the menu. Dishes, prices and photos come from content/site.json (admin page). */
export default function Menu() {
  const [diet, setDiet] = useState<Diet>("all");
  const [cat, setCat] = useState<string>("all");
  const [q, setQ] = useState("");

  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return menu
      .filter((s) => cat === "all" || s.id === cat)
      .map((s) => ({
        ...s,
        items: s.items.filter(
          (it) =>
            (diet === "all" || it.type === diet) &&
            (!needle || it.name.toLowerCase().includes(needle) || it.description.toLowerCase().includes(needle) || s.title.toLowerCase().includes(needle)),
        ),
      }))
      .filter((s) => s.items.length > 0);
  }, [diet, cat, q]);

  const count = groups.reduce((a, g) => a + g.items.length, 0);
  const hasNonVeg = menu.some((s) => s.items.some((i) => i.type === "nonveg"));

  return (
    <section id="menu" className="bg-classic relative z-10 bg-ink pb-28 pt-28 md:pt-36">
      <SectionOrnament />
      <div className="container-lux">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <Reveal>
              <p className="eyebrow mb-5">Our menu</p>
            </Reveal>
            <SplitHeading text="Every craving, considered." className="display-lg text-ivory" />
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-sm leading-relaxed text-mist">
              Choose your dishes, then send the order to us on WhatsApp. Prices are in rupees; items marked “price at the counter” are confirmed when we reply.
            </p>
          </Reveal>
        </div>

        {/* filters */}
        <div className="sticky top-16 z-20 -mx-4 mt-12 border-y border-gold/15 bg-ink/90 px-4 py-4 backdrop-blur-md md:top-20 md:mx-0 md:px-0">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-1 self-start border border-gold/25 p-1" role="group" aria-label="Food type">
              {DIETS.filter((d) => d.id !== "nonveg" || hasNonVeg).map((d) => (
                <button
                  key={d.id}
                  type="button"
                  aria-pressed={diet === d.id}
                  onClick={() => setDiet(d.id)}
                  className={`relative flex h-9 items-center gap-2 px-3 text-[0.64rem] font-semibold uppercase tracking-[0.22em] transition-colors sm:px-4 ${diet === d.id ? "text-ink" : "text-mist hover:text-ivory"}`}
                >
                  {diet === d.id && <motion.span layoutId="diet-pill" className="absolute inset-0 bg-gold" transition={{ type: "spring", stiffness: 380, damping: 34 }} />}
                  <span className="relative flex items-center gap-2">
                    {d.id !== "all" && <FoodMark type={d.id} className="h-3.5 w-3.5" />}
                    <span className="sm:hidden">{d.short}</span>
                    <span className="hidden sm:inline">{d.label}</span>
                  </span>
                </button>
              ))}
            </div>

            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
              <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="group" aria-label="Category">
                <button type="button" className="chip" aria-pressed={cat === "all"} onClick={() => setCat("all")}>
                  All
                </button>
                {menu.map((s) => (
                  <button key={s.id} type="button" className="chip" aria-pressed={cat === s.id} onClick={() => setCat(s.id)}>
                    {s.title}
                  </button>
                ))}
              </div>
              <label className="relative block sm:w-60">
                <span className="sr-only">Search the menu</span>
                <Search size={15} strokeWidth={1.5} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gold" />
                <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search dishes" className="field h-10 min-h-0 py-0 pl-9 pr-9 text-sm" />
                {q && (
                  <button type="button" onClick={() => setQ("")} className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center text-mist hover:text-gold" aria-label="Clear search">
                    <X size={14} />
                  </button>
                )}
              </label>
            </div>
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          {count} dishes shown
        </p>

        <div className="mt-12 space-y-20">
          <AnimatePresence mode="popLayout">
            {groups.map((g) => (
              <motion.div key={g.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                <div className="mb-8 flex items-baseline gap-5">
                  <h3 className="font-display text-4xl text-ivory md:text-5xl">{g.title}</h3>
                  <span className="h-px flex-1 bg-gradient-to-r from-gold/40 to-transparent" />
                  <span className="hidden text-[0.65rem] uppercase tracking-[0.3em] text-gold/80 sm:inline">{g.note}</span>
                </div>
                <motion.ul layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  <AnimatePresence mode="popLayout">
                    {g.items.map((it) => (
                      <Card key={it.id} item={it} />
                    ))}
                  </AnimatePresence>
                </motion.ul>
              </motion.div>
            ))}
          </AnimatePresence>
          {count === 0 && (
            <div className="frame mx-auto max-w-md p-10 text-center">
              <p className="font-display text-3xl text-ivory">Nothing matches yet.</p>
              <p className="mt-2 text-sm text-mist">Try another word, or clear the filters.</p>
              <button
                type="button"
                className="btn btn-line mt-6"
                onClick={() => {
                  setQ("");
                  setDiet("all");
                  setCat("all");
                }}
              >
                Show the full menu
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Card({ item }: { item: MenuItem }) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative flex flex-col border border-gold/15 bg-coal transition-[border-color,transform,box-shadow] duration-500 hover:-translate-y-1 hover:border-gold/60 hover:shadow-[0_30px_60px_-30px_rgba(214,180,119,.35)] ${item.available ? "" : "opacity-60"}`}
    >
      <DishButton item={item} className="relative aspect-[4/3] overflow-hidden bg-coal-2">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            onError={hideBroken}
            src={resize(item.image, 640, 480)}
            alt={item.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-110"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-[radial-gradient(circle_at_50%_40%,#2f4366,#1f2f4c)]">
            <Monogram className="h-14 w-auto opacity-25" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-coal via-transparent to-transparent" />
        <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_30%,rgba(241,223,182,.18)_50%,transparent_70%)] bg-[length:250%_100%] bg-[position:120%_0] transition-[background-position] duration-[1.2s] group-hover:bg-[position:-20%_0]" />
        <FoodMark type={item.type} className="absolute left-3 top-3" />
      </DishButton>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h4 className="font-display text-2xl leading-tight text-ivory">
            <DishButton item={item} className="transition-colors hover:text-gold">
              {item.name}
            </DishButton>
          </h4>
          <p className="shrink-0 pt-1 font-display text-2xl text-gold">{item.price !== null ? money(item.price) : ""}</p>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-mist">{item.description}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          {item.price === null && item.available ? <span className="text-[0.62rem] uppercase tracking-[0.2em] text-mist/80">Price at the counter</span> : <span />}
          <AddToOrder item={item} />
        </div>
      </div>
    </motion.li>
  );
}
