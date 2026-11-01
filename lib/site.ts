import rawSite from "../content/site.json";
import { parseHours } from "./hours";

/*
 * Typed access to content/site.json (edited from the admin page) plus small helpers.
 *
 * ─── WHATSAPP NUMBER ────────────────────────────────────────────────────────────
 * Orders go to the number in content/site.json → "cafe" → "phone".
 * Write it with the country code and digits only, no "+" or spaces: 91 then the
 * 10-digit mobile number, e.g. "91XXXXXXXXXX". Leave it "" and the checkout button
 * stays disabled with a notice, so no order can go to a wrong number.
 * ────────────────────────────────────────────────────────────────────────────────
 */

export type FoodType = "veg" | "nonveg" | "";
export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number | null; // null = no price set (shown as "Price at the counter")
  image: string;
  available: boolean;
  type: FoodType;
  category: string;
};
export type MenuSection = { id: string; title: string; note: string; items: MenuItem[] };

type RawItem = { name: string; description: string; price: string; image: string; available: boolean; type?: string };
type RawSite = {
  cafe: { name: string; tagline: string; intro: string; phone: string; address: string; hours: string; currency: string };
  heroImage: string;
  highlights: { title: string; text: string }[];
  menu: { title: string; note: string; items: RawItem[] }[];
};

const site = rawSite as unknown as RawSite;

export const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const cafe = site.cafe;
export const highlights = site.highlights;
export const heroImage = site.heroImage;
export const hours = parseHours(cafe.hours);

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const menu: MenuSection[] = site.menu
  .filter((s) => s.items.length > 0)
  .map((s) => ({
    id: slug(s.title),
    title: s.title,
    note: s.note,
    items: s.items.map((it) => {
      const n = parseFloat(String(it.price).replace(/[^0-9.]/g, ""));
      return {
        id: slug(s.title) + "--" + slug(it.name),
        name: it.name,
        description: it.description,
        price: Number.isFinite(n) && n > 0 ? n : null,
        image: it.image ? asset(it.image) : "",
        available: it.available !== false,
        type: it.type === "veg" || it.type === "nonveg" ? it.type : "",
        category: s.title,
      };
    }),
  }));

export const allItems = menu.flatMap((s) => s.items);

/** Resolves a site path ("uploads/x.jpg") or full URL to something the browser can load. */
export function asset(p: string) {
  if (!p) return "";
  return /^https?:\/\//.test(p) ? p : BASE + "/" + p.replace(/^\/+/, "");
}

/** Asks Unsplash for a different crop of the same photo (other hosts are returned as they are). */
export function resize(url: string, w: number, h: number) {
  if (!/images\.unsplash\.com/.test(url)) return url;
  const u = new URL(url);
  u.searchParams.set("w", String(w));
  u.searchParams.set("h", String(h));
  u.searchParams.set("fit", "crop");
  u.searchParams.set("q", "75");
  u.searchParams.set("auto", "format");
  return u.toString();
}

const symbol = /^(rs\.?|inr|₹)$/i.test(cafe.currency.trim()) ? "₹" : cafe.currency.trim() + " ";
export function money(n: number) {
  return symbol + (Number.isInteger(n) ? n.toString() : n.toFixed(2));
}

/** Digits only, with country code, 11–15 digits long. */
export const whatsappNumber = cafe.phone.replace(/\D/g, "");
export const whatsappReady = /^\d{11,15}$/.test(whatsappNumber);

export function whatsappLink(text?: string) {
  if (!whatsappReady) return "";
  return "https://wa.me/" + whatsappNumber + (text ? "?text=" + encodeURIComponent(text) : "");
}

export const phoneLink = whatsappReady ? "tel:+" + whatsappNumber : "";
export const phoneDisplay = whatsappReady
  ? "+" + whatsappNumber.slice(0, whatsappNumber.length - 10) + " " + whatsappNumber.slice(-10, -5) + " " + whatsappNumber.slice(-5)
  : "";

const fullAddress = `${cafe.name}, ${cafe.address}, Tamil Nadu, India`;
export const directionsUrl =
  "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(fullAddress);
export const mapsSearchUrl = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(fullAddress);
export const mapEmbedFor = (custom: string) =>
  custom || "https://www.google.com/maps?q=" + encodeURIComponent(`${cafe.address}, Tamil Nadu, India`) + "&output=embed";
