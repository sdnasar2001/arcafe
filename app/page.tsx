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

// Champagne-gold palette

const FOIL = "bg-linear-to-r from-[#A87F2E] via-[#E9CF8A] to-[#A87F2E]";
const FOIL_TEXT = FOIL + " bg-clip-text text-transparent";
const WHITE = { bg: "bg-white/85 ring-1 ring-[#E2CDA8]", text: "text-[#1F2B4D]", muted: "text-[#5A6175]", rule: "border-[#D9C3A0]", price: "text-[#8A6420]", ring: "ring-[#E2CDA8]" };
const PEARL = { bg: "bg-[#FBF3E6]/90 ring-1 ring-[#E2CDA8]", text: "text-[#1F2B4D]", muted: "text-[#5A6175]", rule: "border-[#D9C3A0]", price: "text-[#8A6420]", ring: "ring-white" };
const BOARDS = [WHITE, PEARL, PEARL, WHITE];

function Band() {
  return <div className={"h-1 " + FOIL} aria-hidden="true" />;
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
    { from: "#9D174D", to: "#EC4899", rot: 0, dur: "3.4s", path: "M360 200 A160 54 0 1 1 40 200 A160 54 0 1 1 360 200" },
    { from: "#0F766E", to: "#2DD4BF", rot: 60, dur: "4.3s", path: "M40 200 A160 54 0 1 1 360 200 A160 54 0 1 1 40 200" },
    { from: "#C2410C", to: "#F59E0B", rot: 120, dur: "5.2s", path: "M200 146 A160 54 0 1 1 200 254 A160 54 0 1 1 200 146" },
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
        <linearGradient id="heroBean" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F2D98A" />
          <stop offset="1" stopColor="#9C7424" />
        </linearGradient>
      </defs>
      <circle cx="200" cy="200" r="196" fill="#FFFFFF" />
      <circle cx="200" cy="200" r="182" fill="none" stroke="#C9A24A" strokeWidth="3" strokeLinecap="round" strokeDasharray="0.5 11" />
      {orbits.map((o, i) => (
        <g key={i} transform={`rotate(${o.rot} 200 200)`}>
          <ellipse cx="200" cy="200" rx="160" ry="54" fill="none" stroke={`url(#hero${i})`} strokeWidth="9" />
          <circle r="11" fill="#FFFFFF" stroke="#1F2B4D" strokeWidth="3" className="motion-reduce:hidden">
            <animateMotion dur={o.dur} repeatCount="indefinite" path={o.path} />
          </circle>
        </g>
      ))}
      <g transform="rotate(-28 200 200)">
        <ellipse cx="200" cy="200" rx="40" ry="54" fill="url(#heroBean)" />
        <path d="M200 150 C184 178 216 222 200 250" fill="none" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" />
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

  const wide = display.className + " [font-stretch:125%]";
  const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F2B4D]";
  const btnGold = "rounded-full px-7 py-3.5 text-center font-bold text-[#1F2B4D] shadow-sm transition hover:brightness-105 " + FOIL + " " + focus;
  const btnLine = "rounded-full border-2 border-[#1F2B4D] px-7 py-3 text-center font-bold text-[#1F2B4D] transition hover:bg-[#1F2B4D] hover:text-white " + focus;
  const champagne = {
    background:
      "radial-gradient(900px 500px at 85% 0%, #FFF7EA 0%, rgba(255,247,234,0) 60%), radial-gradient(700px 400px at 10% 60%, rgba(255,250,242,0.7) 0%, rgba(255,250,242,0) 70%), linear-gradient(165deg, #CDB28B 0%, #E5D2B3 30%, #F3E7D5 60%, #FBF7F0 100%)",
  };

  return (
    <main style={champagne} className={body.className + " min-h-screen text-[#1F2B4D] antialiased"}>
      {/* Navigation */}
      <header className="sticky top-0 z-20 bg-white/75 backdrop-blur-md">
        <Band />
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <a href="#top" className={wide + " flex items-center gap-2.5 rounded text-2xl font-bold text-[#1F2B4D] " + focus}>
            <Logo size={40} id="hdr" />
            {CAFE.name}
          </a>
          <nav className="flex items-center gap-5 text-[15px] font-semibold sm:gap-8">
            <a href="#menu" className={"rounded hover:text-[#8A6420] " + focus}>Menu</a>
            <a href="#about" className={"hidden rounded hover:text-[#8A6420] sm:inline " + focus}>About</a>
            <a href="#visit" className={"rounded-full bg-[#1F2B4D] px-4 py-2 text-white hover:bg-[#2C3B66] " + focus}>Visit us</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="px-3 pt-4 sm:px-4 sm:pt-6">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-white/55 ring-1 ring-white/80 backdrop-blur-sm">
          <div className="grid items-center gap-10 px-6 py-12 sm:px-10 md:grid-cols-[1.15fr_1fr] md:py-20 lg:px-16">
            <div>
              <p className={wide + " text-6xl font-bold leading-[0.95] text-[#1F2B4D] sm:text-7xl lg:text-8xl"}>{CAFE.name}</p>
              <div className={"mt-4 h-[3px] w-28 rounded-full " + FOIL} aria-hidden="true" />
              <p className={display.className + " mt-4 text-3xl font-bold text-[#8A6420] sm:text-4xl"}>ஏ.ஆர். கஃபே</p>
              <h1 className="mt-8 max-w-xl text-2xl font-semibold leading-snug sm:text-3xl">{CAFE.tagline}</h1>
              <p className="mt-4 max-w-lg text-lg leading-relaxed text-[#4A5268]">{CAFE.intro}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#menu" className={btnGold}>See our menu</a>
                <a href={mapsUrl} className={btnLine}>Get directions</a>
              </div>
              {CAFE.hours && <p className="mt-6 font-semibold text-[#8A6420]">{CAFE.hours}</p>}
            </div>
            <div className="flex flex-col items-center gap-6">
              {site.heroImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img(site.heroImage)} alt={CAFE.name} className="aspect-square w-full max-w-sm rounded-full object-cover ring-8 ring-white shadow-[0_20px_60px_-20px_rgba(138,100,32,0.45)]" />
              ) : (
                <div className="w-full max-w-sm rounded-full shadow-[0_20px_60px_-20px_rgba(138,100,32,0.45)]">
                  <HeroLogo />
                </div>
              )}
              <div className="hidden items-center gap-4 rounded-2xl bg-white p-3 pr-5 ring-1 ring-[#E2CDA8] sm:inline-flex">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img("menu-qr.svg")} alt="QR code to open the AR Cafe menu" width={96} height={96} className="h-24 w-24" />
                <div>
                  <p className={display.className + " text-lg font-bold text-[#1F2B4D]"}>Menu on your phone</p>
                  <p className="max-w-[12rem] text-sm text-[#5A6175]">Scan with your camera to open our menu.</p>
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
                <span aria-hidden="true" className={"mt-1.5 grid h-9 w-9 flex-none place-items-center rounded-full " + FOIL}>
                  <span className="h-2 w-2 rounded-full bg-white" />
                </span>
                <div>
                  <h2 className={wide + " text-2xl font-bold"}>{h.title}</h2>
                  <p className="mt-1 text-lg leading-relaxed text-[#4A5268]">{h.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Menu */}
      <section id="menu" className="scroll-mt-20 pb-20 md:pb-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4 pb-5">
            <div>
              <h2 className={wide + " text-5xl font-bold md:text-6xl"}>Our menu</h2>
              <p className={display.className + " mt-1 text-2xl font-bold text-[#8A6420]"}>மெனு</p>
            </div>
            <p className="max-w-xs text-lg text-[#4A5268]">Ask at the counter for today&apos;s specials.</p>
          </div>
          <div className={"h-px " + FOIL} aria-hidden="true" />
          <div className="mt-10 grid gap-5 md:grid-cols-2 md:items-start">
            {sections.map((section, si) => {
              const b = BOARDS[si % BOARDS.length];
              return (
                <div key={si} className={"rounded-[1.75rem] p-7 shadow-[0_10px_40px_-24px_rgba(138,100,32,0.5)] backdrop-blur-sm sm:p-9 " + b.bg + " " + b.text}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className={wide + " text-3xl font-bold"}>{section.title}</h3>
                    {section.note && <span className="text-base font-semibold text-[#8A6420]">{section.note}</span>}
                  </div>
                  <ul className="mt-6 space-y-5">
                    {section.items.map((item, ii) => (
                      <li key={ii} className={"flex gap-4" + (item.available ? "" : " opacity-60")}>
                        {item.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={img(item.image)} alt={item.name} loading="lazy" className={"h-16 w-16 flex-none rounded-full object-cover ring-[3px] " + b.ring} />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline gap-3">
                            <p className="text-lg font-bold">{item.name}</p>
                            {item.price && (
                              <>
                                <span className={"mb-1.5 flex-1 border-b-2 border-dotted " + b.rule} />
                                <p className={wide + " whitespace-nowrap text-xl font-bold " + b.price}>
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
      <section id="visit" className="scroll-mt-20 px-3 pb-4 sm:px-4 sm:pb-6">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-[#1F2B4D] px-6 py-14 text-white sm:px-10 md:py-20 lg:px-16">
          <div className="grid gap-10 md:grid-cols-2 md:items-end">
            <div>
              <p className={display.className + " text-3xl font-bold text-[#E9CF8A]"}>வாங்க!</p>
              <h2 className={wide + " mt-1 pb-1 text-5xl font-bold md:text-6xl " + FOIL_TEXT}>Come say hello</h2>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a href={mapsUrl} className={"rounded-full px-7 py-3.5 text-center font-bold text-[#1F2B4D] transition hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white " + FOIL}>
                  Get directions
                </a>
                {hasPhone && (
                  <a href={"tel:+" + CAFE.phone} className="rounded-full border-2 border-[#E9CF8A] px-7 py-3 text-center font-bold text-[#F6E7C1] transition hover:bg-[#E9CF8A] hover:text-[#1F2B4D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                    Call +{CAFE.phone}
                  </a>
                )}
                {hasPhone && (
                  <a href={"https://wa.me/" + CAFE.phone} className="rounded-full border-2 border-[#E9CF8A] px-7 py-3 text-center font-bold text-[#F6E7C1] transition hover:bg-[#E9CF8A] hover:text-[#1F2B4D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                    WhatsApp us
                  </a>
                )}
              </div>
            </div>
            <dl className="grid gap-6 text-xl sm:grid-cols-2">
              <div>
                <dt className="font-semibold text-[#C9CFDD]">Find us</dt>
                <dd className="mt-1 font-bold">{CAFE.address}</dd>
              </div>
              <div>
                <dt className="font-semibold text-[#C9CFDD]">Opening hours</dt>
                <dd className="mt-1 font-bold">{CAFE.hours}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-3 px-4 py-8 text-[#4A5268] sm:flex-row sm:items-center sm:px-6">
          <p className={wide + " flex items-center gap-2 text-xl font-bold text-[#1F2B4D]"}>
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
