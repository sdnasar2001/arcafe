import { brand, seo } from "@/content/brand";
import { CartProvider } from "@/lib/cart";
import { hhmm } from "@/lib/hours";
import { cafe, hours, whatsappNumber, whatsappReady } from "@/lib/site";
import Ambience from "@/components/Ambience";
import Anatomy from "@/components/Anatomy";
import Cart from "@/components/Cart";
import Chrome from "@/components/Chrome";
import DishDetail from "@/components/DishDetail";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Menu from "@/components/Menu";
import Nav from "@/components/Nav";
import Reviews from "@/components/Reviews";
import Signature from "@/components/Signature";
import Story from "@/components/Story";
import Visit from "@/components/Visit";

// Structured data for Google, built only from facts in content/site.json and content/brand.ts.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CafeOrCoffeeShop",
  name: cafe.name,
  slogan: brand.tagline,
  url: seo.siteUrl + "/",
  logo: seo.siteUrl + "/brand/ar-cafe-logo.png",
  image: seo.siteUrl + "/og.png",
  description: seo.description,
  servesCuisine: ["South Indian", "Tea", "Coffee", "Bakery"],
  hasMenu: seo.siteUrl + "/#menu",
  acceptsReservations: false,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Revu Main Road",
    addressLocality: "Parangipettai",
    addressRegion: "Tamil Nadu",
    addressCountry: "IN",
  },
  ...(whatsappReady ? { telephone: "+" + whatsappNumber } : {}),
  ...(brand.instagram ? { sameAs: [brand.instagram] } : {}),
  ...(hours
    ? {
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: hhmm(hours.open),
          closes: hhmm(hours.close),
        },
      }
    : {}),
};

export default function Home() {
  return (
    <CartProvider>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <noscript>
        <style>{`[aria-label="Loading AR Cafe"]{display:none!important}`}</style>
      </noscript>
      <a href="#menu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-gold focus:px-4 focus:py-2 focus:text-ink">
        Skip to the menu
      </a>
      <Intro />
      <Experience />
      <Chrome />
      <Nav />
      <main className="relative">
        <Hero />
        <Story />
        <Signature />
        <Anatomy />
        <Menu />
        <Ambience />
        <Gallery />
        <Reviews />
        <Visit />
      </main>
      <Footer />
      <DishDetail />
      <Cart />
    </CartProvider>
  );
}
