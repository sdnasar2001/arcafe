import type { Metadata } from "next";
import { Anek_Tamil, Mukta_Malar } from "next/font/google";
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

const display = Anek_Tamil({ subsets: ["latin", "tamil"], axes: ["wdth"] });
const body = Mukta_Malar({ subsets: ["latin", "tamil"], weight: ["400", "600", "700"] });

// Painted-signboard palette
const BOARDS = [
  { bg: "bg-[#0B5D5B]", text: "text-white", muted: "text-white/75", rule: "border-white/40", price: "text-[#F3B61F]" },
  { bg: "bg-[#F3B61F]", text: "text-[#1c1b1a]", muted: "text-[#1c1b1a]/75", rule: "border-[#1c1b1a]/40", price: "text-[#8f1a3e]" },
  { bg: "bg-[#B3204D]", text: "text-white", muted: "text-white/80", rule: "border-white/40", price: "text-[#FFD45C]" },
  { bg: "bg-white ring-2 ring-[#0B5D5B]", text: "text-[#1c1b1a]", muted: "text-stone-600", rule: "border-stone-400", price: "text-[#B3204D]" },
];

function Band() {
  return (
    <div className="flex h-2" aria-hidden="true">
      <span className="flex-1 bg-[#0B5D5B]" />
      <span className="flex-1 bg-[#F3B61F]" />
      <span className="flex-1 bg-[#B3204D]" />
    </div>
  );
}

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
    { from: "#8f1a3e", to: "#E0457B", rot: 0, dur: "3.4s", path: "M360 200 A160 54 0 1 1 40 200 A160 54 0 1 1 360 200" },
    { from: "#0B5D5B", to: "#18A39E", rot: 60, dur: "4.3s", path: "M40 200 A160 54 0 1 1 360 200 A160 54 0 1 1 40 200" },
    { from: "#C2410C", to: "#F08A3C", rot: 120, dur: "5.2s", path: "M200 146 A160 54 0 1 1 200 254 A160 54 0 1 1 200 146" },
  ];
  return (
    <svg viewBox="0 0 400 400" role="img" aria-label="AR Cafe logo" className="h-auto w-full max-w-sm">
      <defs>
        {orbits.map((o, i) => (
          <linearGradient key={i} id={"hero" + i} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={o.from} />
            <stop offset="1" stopColor={o.to} />
          </linearGradient>
        ))}
      </defs>
      <circle cx="200" cy="200" r="196" fill="#F3B61F" />
      <circle cx="200" cy="200" r="182" fill="none" stroke="#1c1b1a" strokeWidth="3" strokeLinecap="round" strokeDasharray="0.5 11" />
      {orbits.map((o, i) => (
        <g key={i} transform={`rotate(${o.rot} 200 200)`}>
          <ellipse cx="200" cy="200" rx="160" ry="54" fill="none" stroke={`url(#hero${i})`} strokeWidth="9" />
          <circle r="11" fill="#FFFFFF" stroke="#1c1b1a" strokeWidth="3" className="motion-reduce:hidden">
            <animateMotion dur={o.dur} repeatCount="indefinite" path={o.path} />
          </circle>
        </g>
      ))}
      <g transform="rotate(-28 200 200)">
        <ellipse cx="200" cy="200" rx="40" ry="54" fill="#3b2314" />
        <path d="M200 150 C184 178 216 222 200 250" fill="none" stroke="#F3B61F" strokeWidth="7" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export default function Home() {
  const hasPhone = CAFE.phone.trim().length > 0;
  const mapsUrl =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(CAFE.name + " " + CAFE.address);
  const sections = site.menu.filter((s) => s.items.length > 0);

  const dots = "bg-[radial-gradient(rgba(255,255,255,0.16)_1.5px,transparent_1.5px)] bg-[length:22px_22px]";
  const wide = display.className + " [font-stretch:125%]";

  return (
    <main className={body.className + " min-h-screen bg-white text-[#1c1b1a] antialiased"}>
      {/* Navigation */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur">
        <Band />
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <a href="#top" className={wide + " flex items-center gap-2.5 text-2xl font-extrabold text-[#0B5D5B]"}>
            <Logo size={40} id="hdr" />
            {CAFE.name}
          </a>
          <nav className="flex items-center gap-5 text-[15px] font-semibold sm:gap-8">
            <a href="#menu" className="rounded hover:text-[#B3204D] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B5D5B]">Menu</a>
            <a href="#about" className="hidden rounded hover:text-[#B3204D] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B5D5B] sm:inline">About</a>
            <a href="#visit" className="rounded-full bg-[#B3204D] px-4 py-2 text-white hover:bg-[#8f1a3e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B5D5B]">
              Visit us
            </a>
          </nav>
        </div>
      </header>

      {/* Hero: the painted signboard */}
      <section id="top" className="px-3 pt-3 sm:px-4 sm:pt-4">
        <div className={"mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#0B5D5B] text-white " + dots}>
          <div className="grid items-center gap-10 px-6 py-12 sm:px-10 md:grid-cols-[1.15fr_1fr] md:py-20 lg:px-16">
            <div>
              <p className={wide + " text-6xl font-extrabold leading-[0.9] sm:text-7xl lg:text-8xl"}>{CAFE.name}</p>
              <p className={display.className + " mt-3 text-3xl font-bold text-[#F3B61F] sm:text-4xl"}>ஏ.ஆர். கஃபே</p>
              <h1 className="mt-8 max-w-xl text-2xl font-semibold leading-snug sm:text-3xl">{CAFE.tagline}</h1>
              <p className="mt-4 max-w-lg text-lg leading-relaxed text-white/80">{CAFE.intro}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#menu" className="rounded-full bg-[#F3B61F] px-7 py-3.5 text-center font-bold text-[#1c1b1a] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                  See our menu
                </a>
                <a href={mapsUrl} className="rounded-full border-2 border-white/70 px-7 py-3 text-center font-bold transition hover:bg-white hover:text-[#0B5D5B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                  Get directions
                </a>
              </div>
              {CAFE.hours && <p className="mt-6 font-semibold text-[#F3B61F]">{CAFE.hours}</p>}
            </div>
            <div className="flex flex-col items-center gap-6">
              {site.heroImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img(site.heroImage)} alt={CAFE.name} className="aspect-square w-full max-w-sm rounded-full object-cover ring-[10px] ring-[#F3B61F]" />
              ) : (
                <HeroLogo />
              )}
              <div className="hidden items-center gap-4 rounded-2xl bg-white p-3 pr-5 text-[#1c1b1a] sm:inline-flex">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img("menu-qr.svg")} alt="QR code to open the AR Cafe menu" width={96} height={96} className="h-24 w-24" />
                <div>
                  <p className={display.className + " text-lg font-bold text-[#0B5D5B]"}>Menu on your phone</p>
                  <p className="max-w-[12rem] text-sm text-stone-600">Scan with your camera to open our menu.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      {site.highlights.length > 0 && (
        <section id="about" className="py-16 md:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-3">
            {site.highlights.map((h, i) => (
              <div key={i} className="flex gap-4">
                <span aria-hidden="true" className={"mt-1.5 grid h-9 w-9 flex-none place-items-center rounded-full " + ["bg-[#0B5D5B]", "bg-[#F3B61F]", "bg-[#B3204D]"][i % 3]}>
                  <span className="h-2 w-2 rounded-full bg-white" />
                </span>
                <div>
                  <h2 className={wide + " text-2xl font-bold"}>{h.title}</h2>
                  <p className="mt-1 text-lg leading-relaxed text-stone-600">{h.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Menu */}
      <section id="menu" className="scroll-mt-20 pb-20 md:pb-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-[#1c1b1a] pb-5">
            <div>
              <h2 className={wide + " text-5xl font-extrabold md:text-6xl"}>Our menu</h2>
              <p className={display.className + " mt-1 text-2xl font-bold text-[#B3204D]"}>மெனு</p>
            </div>
            <p className="max-w-xs text-lg text-stone-600">Ask at the counter for today&apos;s specials.</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 md:items-start">
            {sections.map((section, si) => {
              const b = BOARDS[si % BOARDS.length];
              return (
                <div key={si} className={"rounded-[1.75rem] p-7 sm:p-9 " + b.bg + " " + b.text}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className={wide + " text-3xl font-extrabold"}>{section.title}</h3>
                    {section.note && <span className={"text-base font-semibold " + b.muted}>{section.note}</span>}
                  </div>
                  <ul className="mt-6 space-y-5">
                    {section.items.map((item, ii) => (
                      <li key={ii} className={"flex gap-4" + (item.available ? "" : " opacity-60")}>
                        {item.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={img(item.image)} alt={item.name} loading="lazy" className="h-16 w-16 flex-none rounded-full object-cover ring-[3px] ring-white" />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline gap-3">
                            <p className="text-lg font-bold">{item.name}</p>
                            {item.price && (
                              <>
                                <span className={"mb-1.5 flex-1 border-b-2 border-dotted " + b.rule} />
                                <p className={wide + " whitespace-nowrap text-xl font-extrabold " + b.price}>
                                  {CAFE.currency} {item.price}
                                </p>
                              </>
                            )}
                          </div>
                          {item.description && <p className={b.muted}>{item.description}</p>}
                          {!item.available && <p className="mt-1 text-sm font-bold">Not available today</p>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Visit */}
      <section id="visit" className="scroll-mt-20 px-3 pb-3 sm:px-4 sm:pb-4">
        <div className={"mx-auto max-w-7xl rounded-[2rem] bg-[#B3204D] px-6 py-14 text-white sm:px-10 md:py-20 lg:px-16 " + dots}>
          <div className="grid gap-10 md:grid-cols-2 md:items-end">
            <div>
              <p className={display.className + " text-3xl font-bold text-[#FFD45C]"}>வாங்க!</p>
              <h2 className={wide + " mt-1 text-5xl font-extrabold md:text-6xl"}>Come say hello</h2>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a href={mapsUrl} className="rounded-full bg-[#F3B61F] px-7 py-3.5 text-center font-bold text-[#1c1b1a] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                  Get directions
                </a>
                {hasPhone && (
                  <a href={"tel:+" + CAFE.phone} className="rounded-full border-2 border-white/70 px-7 py-3 text-center font-bold transition hover:bg-white hover:text-[#B3204D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                    Call +{CAFE.phone}
                  </a>
                )}
                {hasPhone && (
                  <a href={"https://wa.me/" + CAFE.phone} className="rounded-full border-2 border-white/70 px-7 py-3 text-center font-bold transition hover:bg-white hover:text-[#B3204D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                    WhatsApp us
                  </a>
                )}
              </div>
            </div>
            <dl className="grid gap-6 text-xl sm:grid-cols-2">
              <div>
                <dt className="font-semibold text-white/75">Find us</dt>
                <dd className="mt-1 font-bold">{CAFE.address}</dd>
              </div>
              <div>
                <dt className="font-semibold text-white/75">Opening hours</dt>
                <dd className="mt-1 font-bold">{CAFE.hours}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-3 px-4 py-8 text-stone-600 sm:flex-row sm:items-center sm:px-6">
          <p className={wide + " flex items-center gap-2 text-xl font-extrabold text-[#0B5D5B]"}>
            <Logo size={30} id="ftr" />
            {CAFE.name}
          </p>
          <p>{CAFE.address}</p>
        </div>
        <Band />
      </footer>
    </main>
  );
}
