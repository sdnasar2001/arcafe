import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import { CAFE } from "./cafe-info";

const serif = Playfair_Display({ subsets: ["latin"], weight: ["600", "700"] });

export const metadata: Metadata = {
  title: CAFE.name + " | Tea, Coffee, Tiffin and Bakery in Parangipettai",
  description:
    CAFE.name +
    " in Parangipettai - fresh tea and coffee, special teas, idli, dosa, vada, samosa, rice, pasta and bakery items.",
};

const menu = [
  {
    title: "Tea and Coffee",
    note: "Brewed fresh, all day",
    items: [
      ["Tea", "Strong, milky and just right"],
      ["Coffee", "Hot and freshly made"],
      ["Special teas", "Different tea varieties - ask what is brewing today"],
    ],
  },
  {
    title: "Tiffin",
    note: "South Indian favourites",
    items: [
      ["Idli", "Soft and fluffy, served hot"],
      ["Dosa", "Crisp and golden"],
      ["Vada", "Crunchy outside, soft inside"],
      ["Samosa", "Spiced and freshly fried"],
    ],
  },
  {
    title: "Meals",
    note: "Home-style cooking",
    items: [
      ["Rice", "Home-style rice dishes"],
      ["Pasta", "A quick and filling favourite"],
    ],
  },
  {
    title: "Bakery",
    note: "From our counter",
    items: [
      ["Bakery items", "Fresh bakes to enjoy with your tea"],
      ["Take-away", "Pack some for home or the road"],
    ],
  },
];

const highlights = [
  {
    title: "Made fresh",
    text: "Tiffin and rice dishes are cooked in our own kitchen.",
  },
  {
    title: "Home-style taste",
    text: "Simple, honest food that tastes like it was made at home.",
  },
  {
    title: "Your neighbourhood stop",
    text: "A friendly little cafe for a quick tea or a full breakfast.",
  },
];

function Cup() {
  return (
    <svg viewBox="0 0 320 320" aria-hidden="true" className="h-auto w-full max-w-sm">
      <circle cx="160" cy="170" r="150" fill="#f1e2cf" />
      <g fill="none" stroke="#c49a6c" strokeWidth="6" strokeLinecap="round" className="animate-pulse">
        <path d="M125 105c-14-18 14-28 0-48" />
        <path d="M160 100c-14-20 14-30 0-55" />
        <path d="M195 105c-14-18 14-28 0-48" />
      </g>
      <ellipse cx="160" cy="252" rx="118" ry="20" fill="#e3cdb2" />
      <path d="M244 150c42 0 42 58 0 60" fill="none" stroke="#7a4a2b" strokeWidth="13" />
      <path d="M78 130h164v44a82 82 0 0 1-164 0Z" fill="#ffffff" stroke="#7a4a2b" strokeWidth="5" />
      <ellipse cx="160" cy="130" rx="82" ry="14" fill="#6b3f22" />
      <path d="M100 175h120" stroke="#e8d3bb" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

export default function Home() {
  const hasPhone = CAFE.phone.trim().length > 0;
  const mapsUrl =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(CAFE.name + " " + CAFE.address);

  return (
    <main className="min-h-screen bg-[#faf6f0] font-sans text-stone-700 antialiased">
      {/* Navigation */}
      <header className="sticky top-0 z-20 border-b border-stone-200/70 bg-[#faf6f0]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="#top" className={serif.className + " text-2xl font-bold text-[#4a2c1a]"}>
            {CAFE.name}
          </a>
          <nav className="flex items-center gap-5 text-sm font-medium sm:gap-8">
            <a href="#menu" className="hover:text-[#4a2c1a]">Menu</a>
            <a href="#about" className="hidden hover:text-[#4a2c1a] sm:inline">About</a>
            <a href="#visit" className="rounded-full bg-[#4a2c1a] px-4 py-2 text-white hover:bg-[#3a2214]">
              Visit us
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
        <div>
          <p className="inline-block rounded-full bg-[#f1e2cf] px-4 py-1.5 text-sm font-semibold text-[#7a4a2b]">
            Vanakkam! Welcome to {CAFE.name}
          </p>
          <h1 className={serif.className + " mt-6 text-5xl font-bold leading-tight text-[#2b1a10] md:text-6xl"}>
            Fresh tea, hot tiffin and warm bakes
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-stone-600">
            Your friendly neighbourhood cafe in {CAFE.address}. Stop by for a cup of tea, a plate of
            idli or dosa, or something fresh from the bakery counter.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#menu"
              className="rounded-full bg-[#4a2c1a] px-7 py-3.5 text-center font-semibold text-white transition hover:bg-[#3a2214]"
            >
              See our menu
            </a>
            <a
              href={mapsUrl}
              className="rounded-full border-2 border-[#4a2c1a] px-7 py-3 text-center font-semibold text-[#4a2c1a] transition hover:bg-[#4a2c1a] hover:text-white"
            >
              Get directions
            </a>
          </div>
          <p className="mt-6 text-sm text-stone-500">{CAFE.hours}</p>
        </div>
        <div className="flex justify-center">
          <Cup />
        </div>
      </section>

      {/* Highlights */}
      <section id="about" className="bg-[#2b1a10] py-16 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-3">
          {highlights.map((h) => (
            <div key={h.title}>
              <h3 className={serif.className + " text-2xl font-semibold text-[#f1d2a9]"}>{h.title}</h3>
              <p className="mt-2 leading-relaxed text-stone-300">{h.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#a0663c]">What we serve</p>
            <h2 className={serif.className + " mt-2 text-4xl font-bold text-[#2b1a10] md:text-5xl"}>Our menu</h2>
            <p className="mx-auto mt-4 max-w-xl text-stone-600">
              Ask at the counter for prices and today&apos;s specials.
            </p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {menu.map((section) => (
              <div key={section.title} className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
                <div className="flex items-baseline justify-between gap-4 border-b border-dashed border-stone-300 pb-4">
                  <h3 className={serif.className + " text-2xl font-bold text-[#4a2c1a]"}>{section.title}</h3>
                  <span className="text-sm text-[#a0663c]">{section.note}</span>
                </div>
                <ul className="mt-5 space-y-4">
                  {section.items.map(([name, desc]) => (
                    <li key={name}>
                      <p className="font-semibold text-stone-800">{name}</p>
                      <p className="text-sm text-stone-500">{desc}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visit */}
      <section id="visit" className="px-4 pb-20 sm:px-6 md:pb-28">
        <div className="mx-auto max-w-4xl rounded-3xl bg-[#4a2c1a] px-6 py-14 text-center text-white md:px-14">
          <h2 className={serif.className + " text-4xl font-bold"}>Come say hello</h2>
          <div className="mx-auto mt-8 grid max-w-2xl gap-6 text-left sm:grid-cols-2">
            <div className="rounded-2xl bg-white/10 p-5">
              <p className="text-sm uppercase tracking-wider text-[#f1d2a9]">Find us</p>
              <p className="mt-1 text-lg font-semibold">{CAFE.address}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-5">
              <p className="text-sm uppercase tracking-wider text-[#f1d2a9]">Opening hours</p>
              <p className="mt-1 text-lg font-semibold">{CAFE.hours}</p>
            </div>
          </div>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={mapsUrl}
              className="rounded-full bg-[#f1d2a9] px-7 py-3.5 font-semibold text-[#2b1a10] transition hover:bg-white"
            >
              Get directions
            </a>
            {hasPhone && (
              <a
                href={"tel:+" + CAFE.phone}
                className="rounded-full border-2 border-white/40 px-7 py-3 font-semibold transition hover:bg-white/10"
              >
                Call +{CAFE.phone}
              </a>
            )}
            {hasPhone && (
              <a
                href={"https://wa.me/" + CAFE.phone}
                className="rounded-full border-2 border-white/40 px-7 py-3 font-semibold transition hover:bg-white/10"
              >
                WhatsApp us
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-3 px-4 py-8 text-sm text-stone-500 sm:flex-row sm:px-6">
          <p className={serif.className + " text-lg font-semibold text-[#4a2c1a]"}>{CAFE.name}</p>
          <p>{CAFE.address}</p>
        </div>
      </footer>
    </main>
  );
}
