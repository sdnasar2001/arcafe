import { brand } from "@/content/brand";
import { BASE, cafe, directionsUrl, whatsappLink, whatsappReady } from "@/lib/site";
import { NAV_LINKS } from "@/lib/nav";

/** SECTION J — footer. */
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-10 overflow-hidden border-t border-gold/20 bg-ink pt-20">
      <div className="container-lux grid gap-12 pb-16 md:grid-cols-12">
        <div className="md:col-span-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BASE + "/brand/ar-cafe-logo-horizontal.svg"} alt="AR Cafe" width={300} height={67} className="h-auto w-64" loading="lazy" />
          <p className="mt-6 font-display text-2xl italic text-ivory/80">{brand.tagline}</p>
        </div>

        <nav className="md:col-span-2" aria-label="Footer">
          <p className="eyebrow mb-5">Explore</p>
          <ul className="space-y-2 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-mist transition-colors hover:text-gold">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <p className="eyebrow mb-5">Visit</p>
          <p className="text-sm leading-relaxed text-mist">
            {cafe.address}
            <br />
            Tamil Nadu, India
          </p>
          <p className="mt-4 text-sm text-mist">
            <span className="text-ivory">Hours</span> · {cafe.hours || "To be announced"}
          </p>
          <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="link-gold mt-4 inline-block text-sm">
            Get directions
          </a>
        </div>

        <div className="md:col-span-2">
          <p className="eyebrow mb-5">Order & follow</p>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#menu" className="text-mist transition-colors hover:text-gold">
                Menu
              </a>
            </li>
            <li>
              {whatsappReady ? (
                <a href={whatsappLink(`Hello ${cafe.name}!`)} target="_blank" rel="noopener noreferrer" className="text-mist transition-colors hover:text-gold">
                  WhatsApp
                </a>
              ) : (
                <span className="text-mist/60">WhatsApp — soon</span>
              )}
            </li>
            <li>
              {brand.instagram ? (
                <a href={brand.instagram} target="_blank" rel="noopener noreferrer" className="text-mist transition-colors hover:text-gold">
                  Instagram
                </a>
              ) : (
                <span className="text-mist/60">Instagram — soon</span>
              )}
            </li>
          </ul>
        </div>
      </div>

      <p aria-hidden className="gold-text pointer-events-none select-none whitespace-nowrap text-center font-display text-[17vw] leading-[0.8] tracking-[0.08em] opacity-20">
        AR CAFE
      </p>

      <div className="border-t border-gold/10">
        <div className="container-lux flex flex-col items-center justify-between gap-2 py-6 text-[0.65rem] uppercase tracking-[0.25em] text-mist/70 sm:flex-row">
          <p>
            © {year} {cafe.name} · Parangi Pettai
          </p>
          <p>Crafted for the craving.</p>
        </div>
      </div>
    </footer>
  );
}
