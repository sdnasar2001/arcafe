import type { Metadata } from "next";
import rawSite from "../content/site.json";
import MenuNav from "./MenuNav";
import OpenStatus from "./OpenStatus";
import Scroll3D from "./Scroll3D";
import { AddToOrder, OrderBar, OrderButton, OrderPanel } from "./Order";
import { parseHours, hhmm } from "./hours";

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
    special?: string;
  };
  heroImage: string;
  highlights: { title: string; text: string }[];
  menu: Section[];
};

const site = rawSite as unknown as Site;
const CAFE = site.cafe;
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
const img = (p: string) => (/^https?:\/\//.test(p) ? p : BASE + "/" + p.replace(/^\/+/, ""));

export const metadata: Metadata = {
  title: CAFE.name + " | " + CAFE.address,
  description: CAFE.name + " - " + CAFE.intro,
};

// Stand-in photographs from Hallmark's library (Wikimedia Commons, CC0) until the cafe's own photos replace them.
const COMMONS = "https://upload.wikimedia.org/wikipedia/commons/thumb/";
const thumbs = (path: string, file: string) => ({
  src: `${COMMONS}${path}/${file}/1280px-${file}`,
  srcSet: [960, 1280, 1920].map((w) => `${COMMONS}${path}/${file}/${w}px-${file} ${w}w`).join(", "),
});
const BENTO_PHOTO = {
  ...thumbs("0/0f", "Almond_croissant_-_Workshop_Coffee_Lab_2025-06-27.jpg"),
  credit: { name: "Andy Li", href: "https://commons.wikimedia.org/wiki/File:Almond_croissant_-_Workshop_Coffee_Lab_2025-06-27.jpg" },
};

const SLOT_SCRIPT = `window.hallmarkSlots = (m) => { for (const [k, v] of Object.entries(m)) { const s = document.querySelector(\`[data-slot="\${k}"]\`); if (!s) continue; const im = new Image(); im.src = typeof v === 'string' ? v : v.src; im.alt = (typeof v === 'object' && v.alt) || s.dataset.alt || ''; s.querySelectorAll(':scope > img').forEach((o) => o.remove()); s.prepend(im); } };
document.querySelectorAll('[data-slot] img').forEach((i) => { if (i.complete && !i.naturalWidth) i.remove(); else i.addEventListener('error', () => i.remove(), { once: true }); });`;

function Wordmark({ size }: { size: number }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={img("logo.svg")} width={size} height={size} alt="" />;
}

export default function Home() {
  const hasPhone = CAFE.phone.trim().length > 0;
  const mapsUrl =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(CAFE.name + " " + CAFE.address);
  const sections = site.menu.filter((s) => s.items.length > 0);
  const waHello = "https://wa.me/" + CAFE.phone + "?text=" + encodeURIComponent(`Hello ${CAFE.name}! I'd like to order:\n`);
  const special = (CAFE.special || "").trim();

  // The first sentence of the welcome text leads the hero; the rest opens the About section.
  const introParts = CAFE.intro.split(/(?<=\.)\s+/);
  const heroLine = introParts[0] || "";
  const aboutLine = introParts.slice(1).join(" ");

  // The admin page's "Front photo" now fills the About photo; the library stand-in shows until then.
  const credits = site.heroImage ? [] : [BENTO_PHOTO.credit];

  // One scroll step per menu group, for the 3D front section (tea, tiffin, bakery).
  const pick = (re: RegExp) => sections.findIndex((sec) => re.test(sec.title));
  const scrollSteps = [pick(/tea|coffee/i), pick(/tiffin/i), pick(/bakery/i)]
    .map((i, n) => (i >= 0 ? i : n))
    .filter((i, n, arr) => i < sections.length && arr.indexOf(i) === n)
    .map((i) => ({
      title: sections[i].title,
      note: sections[i].note,
      href: "#cat-" + i,
      items: sections[i].items.filter((it) => it.available).slice(0, 4).map((it) => ({ name: it.name, price: it.price, image: it.image ? img(it.image) : "" })),
    }));

  const hrs = parseHours(CAFE.hours);
  const siteUrl = "https://sdnasar2001.github.io" + BASE + "/";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    name: CAFE.name,
    url: siteUrl,
    image: siteUrl + "icon.svg",
    description: CAFE.intro,
    servesCuisine: ["South Indian", "Tea", "Coffee", "Bakery"],
    menu: siteUrl + "#menu",
    priceRange: "₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Revu Main Road",
      addressLocality: "Parangipettai",
      addressRegion: "Tamil Nadu",
      addressCountry: "IN",
    },
    ...(hasPhone ? { telephone: "+" + CAFE.phone } : {}),
    ...(hrs
      ? {
          openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            opens: hhmm(hrs.open),
            closes: hhmm(hrs.close),
          },
        }
      : {}),
  };

  return (
    <main>
      {/* Details for Google search results */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <header className="nav">
        <div className="container nav__inner">
          <a href="#top" className="wordmark" aria-label={CAFE.name + ", back to top"}>
            <Wordmark size={40} />
            <span className="wordmark__name">{CAFE.name}</span>
            <span className="wordmark__tamil" lang="ta">ஏ.ஆர். கஃபே</span>
          </a>
          <nav className="nav__links" aria-label="Main">
            <a href="#menu" className="nav__link">Menu</a>
            <a href="#about" className="nav__link nav__link--wide">About</a>
            <a href="#visit" className="nav__link nav__link--wide">Visit</a>
            {hasPhone ? <OrderButton /> : <a href="#visit" className="btn btn--primary btn--small">Visit us</a>}
          </nav>
        </div>
      </header>

      {/* Today's special (set from the admin page) */}
      {special && (
        <div className="container special">
          <p className="special__bar" role="status">
            <span className="special__tag">Today&apos;s special</span>
            <span className="special__text">{special}</span>
          </p>
        </div>
      )}

      {/* Front section: the AR Cafe logo in 3D, turning as you scroll */}
      <Scroll3D
        orderable={hasPhone}
        currency={CAFE.currency}
        steps={scrollSteps}
        intro={
          <>
            <h1>{CAFE.tagline}</h1>
            {heroLine && <p className="lead">{heroLine}</p>}
            <div className="hero__actions">
              <a href="#menu" className="btn btn--primary">{hasPhone ? "Start your order" : "See our menu"}</a>
              {hasPhone ? (
                <a href={waHello} className="btn btn--line" target="_blank" rel="noopener noreferrer">
                  Order on WhatsApp
                </a>
              ) : (
                <a href={mapsUrl} className="btn btn--line">Get directions</a>
              )}
            </div>
            {CAFE.hours && (
              <div className="hero__status">
                <OpenStatus hours={CAFE.hours} />
              </div>
            )}
          </>
        }
      />

      {/* Menu */}
      <section id="menu" className="menu">
        <div className="container">
          <div className="menu__head">
            <div>
              <h2>Our menu</h2>
              <p className="menu__tamil" lang="ta">மெனு</p>
            </div>
            <p className="menu__note">Ask at the counter for today&apos;s specials.</p>
          </div>
          {hasPhone && (
            <ol className="howto" aria-label="How ordering works">
              <li><strong>Add</strong> what you&apos;d like from the menu</li>
              <li><strong>Send</strong> the order to us on WhatsApp</li>
              <li><strong>Collect</strong> it fresh at the counter</li>
            </ol>
          )}
          <div className={"menu__layout" + (hasPhone ? " menu__layout--order" : "")}>
            <MenuNav titles={sections.map((sec) => sec.title)} />
            <div className="menu__list">
              {sections.map((section, si) => (
                <article key={si} id={"cat-" + si} className="cat">
                  <div className="cat__head">
                    <h3>{section.title}</h3>
                    {section.note && <p className="cat__note">{section.note}</p>}
                  </div>
                  <ul className="items">
                    {section.items.map((item, ii) => (
                      <li key={ii} className={"item" + (item.image ? "" : " item--noimg") + (item.available ? "" : " item--off")}>
                        {item.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={img(item.image)} alt="" loading="lazy" width={72} height={72} className="item__img" />
                        )}
                        <div>
                          <p className="item__name">{item.name}</p>
                          {item.description && <p className="item__desc">{item.description}</p>}
                          {!item.available && <p className="item__off">Not available today</p>}
                          {item.available && hasPhone && <AddToOrder name={item.name} price={item.price} />}
                        </div>
                        {item.price && (
                          <p className="item__price">
                            {CAFE.currency} {item.price}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
            <OrderPanel phone={hasPhone ? CAFE.phone : ""} currency={CAFE.currency} cafe={CAFE.name} />
          </div>
        </div>
      </section>

      {/* Visit */}
      <section id="visit" className="visit">
        <div className="container visit__grid">
          <div className="visit__head">
            <p className="visit__tamil" lang="ta">வாங்க!</p>
            <h2>Come say hello</h2>
            <div className="visit__actions">
              <a href={mapsUrl} className="btn btn--gold">Get directions</a>
              {hasPhone && (
                <a href={"tel:+" + CAFE.phone} className="btn btn--line-light">
                  Call +{CAFE.phone}
                </a>
              )}
              {hasPhone && (
                <a href={"https://wa.me/" + CAFE.phone} className="btn btn--line-light">
                  WhatsApp us
                </a>
              )}
            </div>
          </div>
          <dl className="visit__facts">
            <div>
              <dt>Find us</dt>
              <dd>{CAFE.address}</dd>
            </div>
            <div>
              <dt>Opening hours</dt>
              <dd>{CAFE.hours}</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* About */}
      {site.highlights.length > 0 && (
        <section id="about" className="about">
          <div className="container">
            <div className="about__head">
              <h2>Cooked in our own kitchen</h2>
              {aboutLine && <p className="lead">{aboutLine}</p>}
            </div>
            <div className="bento">
              <div className="bento__photo" data-slot="photo-1" data-alt="Your shop, or a tray of fresh puffs from the oven">
                {site.heroImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img(site.heroImage)} alt={CAFE.name} width={1280} height={960} loading="lazy" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={BENTO_PHOTO.src} srcSet={BENTO_PHOTO.srcSet} sizes="(max-width: 60rem) 100vw, 55vw" alt="A sugared almond croissant on a cafe table" width={1280} height={964} loading="lazy" />
                )}
              </div>
              {site.highlights.map((h, i) => (
                <div key={i} className="tile">
                  <h3>{h.title}</h3>
                  <p>{h.text}</p>
                </div>
              ))}
              <div className="tile tile--qr">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img("menu-qr.svg")} alt="QR code that opens the AR Cafe menu" width={104} height={104} />
                <div>
                  <h3>Menu on your phone</h3>
                  <p>Scan with your camera to open our menu.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer__mast">
            <Wordmark size={72} />
            <p className="footer__name">{CAFE.name}</p>
            <p className="footer__tamil" lang="ta">ஏ.ஆர். கஃபே</p>
          </div>
          <div className="footer__row">
            <ul className="footer__links">
              <li><a href="#menu">Menu</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#visit">Visit us</a></li>
            </ul>
            <p>{CAFE.address}</p>
          </div>
          {credits.length > 0 && (
          <p className="footer__credits" data-credits>
            Photographs:{" "}
            {credits.map((c, i) => (
              <span key={c.href}>
                {i > 0 && ", "}
                <a href={c.href}>{c.name}</a> (CC0, Wikimedia Commons)
              </span>
            ))}
          </p>
          )}
        </div>
      </footer>
      <div className="orderbar-space" aria-hidden="true" />
      <OrderBar phone={hasPhone ? CAFE.phone : ""} currency={CAFE.currency} cafe={CAFE.name} />
      <script dangerouslySetInnerHTML={{ __html: SLOT_SCRIPT }} />
    </main>
  );
}
