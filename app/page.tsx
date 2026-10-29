import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import rawSite from "../content/site.json";

// All content comes from content/site.json - edit it from the admin page (/admin/).

type Item = { name: string; description: string; price: string; image: string; available: boolean };
type Section = { title: string; note: string; items: Item[] };
type Site = {
  cafe: {
    name: string;
    tagline: string;
    intro: string;
    phone: string;
    address: string;
    hours: string;
    currency: string;
  };
  heroImage: string;
  highlights: { title: string; text: string }[];
  menu: Section[];
};

const site = rawSite as unknown as Site;
const CAFE = site.cafe;
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
const img = (p: string) => (/^https?:\/\//.test(p) ? p : BASE + "/" + p.replace(/^\/+/, ""));

const serif = Playfair_Display({ subsets: ["latin"], weight: ["600", "700"] });

export const metadata: Metadata = {
  title: CAFE.name + " | " + CAFE.address,
  description: CAFE.name + " - " + CAFE.intro,
};

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
  const sections = site.menu.filter((s) => s.items.length > 0);

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
            {CAFE.tagline}
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-stone-600">{CAFE.intro}</p>
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
          {CAFE.hours && <p className="mt-6 text-sm text-stone-500">{CAFE.hours}</p>}
        </div>
        <div className="flex justify-center">
          {site.heroImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={img(site.heroImage)}
              alt={CAFE.name}
              className="aspect-[4/3] w-full max-w-md rounded-[2rem] object-cover shadow-xl ring-8 ring-[#f1e2cf]"
            />
          ) : (
            <Cup />
          )}
        </div>
      </section>

      {/* Highlights */}
      {site.highlights.length > 0 && (
        <section id="about" className="bg-[#2b1a10] py-16 text-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-3">
            {site.highlights.map((h, i) => (
              <div key={i}>
                <h3 className={serif.className + " text-2xl font-semibold text-[#f1d2a9]"}>{h.title}</h3>
                <p className="mt-2 leading-relaxed text-stone-300">{h.text}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Menu */}
      <section id="menu" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#a0663c]">What we serve</p>
            <h2 className={serif.className + " mt-2 text-4xl font-bold text-[#2b1a10] md:text-5xl"}>Our menu</h2>
            <p className="mx-auto mt-4 max-w-xl text-stone-600">Ask at the counter for today&apos;s specials.</p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {sections.map((section, si) => (
              <div key={si} className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
                <div className="flex items-baseline justify-between gap-4 border-b border-dashed border-stone-300 pb-4">
                  <h3 className={serif.className + " text-2xl font-bold text-[#4a2c1a]"}>{section.title}</h3>
                  {section.note && <span className="text-right text-sm text-[#a0663c]">{section.note}</span>}
                </div>
                <ul className="mt-5 space-y-5">
                  {section.items.map((item, ii) => (
                    <li key={ii} className={"flex gap-4" + (item.available ? "" : " opacity-50")}>
                      {item.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={img(item.image)}
                          alt={item.name}
                          loading="lazy"
                          className="h-16 w-16 flex-none rounded-2xl object-cover"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-3">
                          <p className="font-semibold text-stone-800">{item.name}</p>
                          {item.price && (
                            <>
                              <span className="mb-1 flex-1 border-b border-dotted border-stone-300" />
                              <p className="whitespace-nowrap font-semibold text-[#7a4a2b]">
                                {CAFE.currency} {item.price}
                              </p>
                            </>
                          )}
                        </div>
                        {item.description && <p className="text-sm text-stone-500">{item.description}</p>}
                        {!item.available && (
                          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-red-700">
                            Not available today
                          </p>
                        )}
                      </div>
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
