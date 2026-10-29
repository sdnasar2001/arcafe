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

// AR Cafe logo: a coffee bean "nucleus" with three multicolour orbits.
function Logo({ size = 40, id = "lg", dark = false }: { size?: number; id?: string; dark?: boolean }) {
  const bean = dark ? ["#f1d2a9", "#c49a6c"] : ["#7a4a2b", "#2b1a10"];
  const bg = dark ? "#2b1a10" : "#faf6f0";
  const orbits = dark
    ? [["#EA580C", "#FBBF24"], ["#14B8A6", "#5EEAD4"], ["#DB2777", "#F9A8D4"]]
    : [["#C2410C", "#F59E0B"], ["#0F766E", "#2DD4BF"], ["#9D174D", "#EC4899"]];
  return (
    <svg width={size} height={size} viewBox="0 0 400 400" aria-hidden="true">
      <defs>
        {orbits.map((c, i) => (
          <linearGradient key={i} id={id + "o" + i} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={c[0]} />
            <stop offset="1" stopColor={c[1]} />
          </linearGradient>
        ))}
        <linearGradient id={id + "b"} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={bean[0]} />
          <stop offset="1" stopColor={bean[1]} />
        </linearGradient>
      </defs>
      {[0, 60, 120].map((r, i) => (
        <ellipse key={r} cx="200" cy="200" rx="170" ry="58" fill="none" stroke={`url(#${id}o${i})`} strokeWidth="16" transform={`rotate(${r} 200 200)`} />
      ))}
      <g transform="rotate(-28 200 200)">
        <ellipse cx="200" cy="200" rx="50" ry="68" fill={`url(#${id}b)`} />
        <path d="M200 138 C180 172 220 228 200 262" fill="none" stroke={bg} strokeWidth="10" strokeLinecap="round" />
      </g>
      <circle cx="370" cy="200" r="22" fill={orbits[0][1]} stroke={bg} strokeWidth="6" />
    </svg>
  );
}

// Large animated version for the hero (shown when no hero photo is set).
function HeroLogo() {
  const orbits = [
    { from: "#C2410C", to: "#F59E0B", rot: 0, dur: "3.4s", path: "M360 200 A160 54 0 1 1 40 200 A160 54 0 1 1 360 200" },
    { from: "#0F766E", to: "#2DD4BF", rot: 60, dur: "4.3s", path: "M40 200 A160 54 0 1 1 360 200 A160 54 0 1 1 40 200" },
    { from: "#9D174D", to: "#EC4899", rot: 120, dur: "5.2s", path: "M200 146 A160 54 0 1 1 200 254 A160 54 0 1 1 200 146" },
  ];
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      <svg viewBox="0 0 400 400" role="img" aria-label="AR Cafe logo" className="h-auto w-full">
        <defs>
          {orbits.map((o, i) => (
            <linearGradient key={i} id={"hero" + i} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor={o.from} />
              <stop offset="1" stopColor={o.to} />
            </linearGradient>
          ))}
          <linearGradient id="heroBean" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7a4a2b" />
            <stop offset="1" stopColor="#2b1a10" />
          </linearGradient>
        </defs>
        <circle cx="200" cy="200" r="196" fill="#f1e2cf" />
        <circle cx="200" cy="200" r="182" fill="none" stroke="#c49a6c" strokeWidth="2" strokeLinecap="round" strokeDasharray="0.5 9" />
        {orbits.map((o, i) => (
          <g key={i} transform={`rotate(${o.rot} 200 200)`}>
            <ellipse cx="200" cy="200" rx="160" ry="54" fill="none" stroke={`url(#hero${i})`} strokeWidth="7" />
            <circle r="10" fill={o.to} stroke="#faf6f0" strokeWidth="3">
              <animateMotion dur={o.dur} repeatCount="indefinite" path={o.path} />
            </circle>
          </g>
        ))}
        <g transform="rotate(-28 200 200)">
          <ellipse cx="200" cy="200" rx="38" ry="52" fill="url(#heroBean)" />
          <path d="M200 152 C185 178 215 222 200 248" fill="none" stroke="#faf6f0" strokeWidth="6" strokeLinecap="round" />
        </g>
      </svg>
      <p className="font-mono text-sm text-[#7a4a2b]">|AR&#10217; = |tea&#10217; + |coffee&#10217; + |bakery&#10217;</p>
    </div>
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
          <a href="#top" className={serif.className + " flex items-center gap-2.5 text-2xl font-bold text-[#4a2c1a]"}>
            <Logo size={40} id="hdr" />
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
          <div className="mt-8 hidden items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200 sm:inline-flex">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img("menu-qr.svg")} alt="QR code to open the AR Cafe menu" width={104} height={104} className="h-26 w-26" />
            <div>
              <p className={serif.className + " text-lg font-bold text-[#4a2c1a]"}>Menu on your phone</p>
              <p className="mt-1 max-w-[12rem] text-sm text-stone-500">Scan with your camera to open our menu.</p>
            </div>
          </div>
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
            <HeroLogo />
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
          <p className={serif.className + " flex items-center gap-2 text-lg font-semibold text-[#4a2c1a]"}>
            <Logo size={28} id="ftr" />
            {CAFE.name}
          </p>
          <p>{CAFE.address}</p>
        </div>
      </footer>
    </main>
  );
}
