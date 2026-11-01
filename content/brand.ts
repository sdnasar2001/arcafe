/**
 * AR CAFE — brand, story and page settings.
 *
 * Business details (name, address, phone / WhatsApp, hours) and the MENU live in
 * content/site.json, which you can edit on the admin page (/admin/).
 * Everything else that shapes the website lives here. Edit the text in quotes,
 * save, and push to GitHub — the site rebuilds by itself.
 *
 * Image paths: put photos in public/images/ and write them here as "images/your-photo.webp".
 * Full web addresses (https://...) also work.
 */

export const brand = {
  /** The brand line used across the site. */
  tagline: "Crafted for the craving.",
  heroLine: "Discover an extraordinary food experience.",

  colors: {
    navy: "#1C2B45", // page background (matches the logo)
    navyLight: "#223352", // alternate sections
    gold: "#D6B477",
    bronze: "#80633D",
    ivory: "#F5F0E6",
  },

  /** Instagram page address, e.g. "https://www.instagram.com/arcafe". Leave "" until the page exists. */
  instagram: "",

  /**
   * Google Maps embed address. Leave "" to show the map for the address in site.json.
   * For the exact pin: open Google Maps → find AR Cafe → Share → Embed a map → copy only the src="..." link.
   */
  mapEmbedUrl: "",
};

/** SECTION B — Our Story. Replace with the real story of AR Cafe in your own words. */
export const story = {
  heading: "More than just a cafe.",
  // The welcome text and the three highlights come from site.json (admin page).
  // Add more paragraphs here if you want them under the welcome text.
  paragraphs: [] as string[],
  /** Wide photo under the story. "" uses the front photo from the admin page, then a dish photo. */
  image: "",
};

/** SECTION C — Signature. Must match an item name in the menu exactly. */
export const signature = {
  itemName: "Special teas",
  eyebrow: "The signature",
  headline: "A cup worth crossing town for.",
};

/**
 * SECTION E — Anatomy of a cup. The floating ingredients in the 3D scene.
 * Change the names and notes to match what actually goes into your tea.
 */
export const ingredients = [
  { name: "Tea leaves", note: "Strong, dark leaf brewed to a deep amber." },
  { name: "Cardamom", note: "Bright and floral, cracked just before brewing." },
  { name: "Ginger", note: "A warm bite that lingers." },
  { name: "Cinnamon", note: "Sweet spice and soft warmth." },
  { name: "Star anise", note: "A quiet, aromatic finish." },
  { name: "Sugar", note: "Sweetened the way you ask." },
];

/**
 * SECTION F — Ambience. One slot per scene. Leave image "" until you have the photo;
 * the slot shows "Photograph coming soon" until then.
 * Suggested size: 1600 x 1200 pixels, saved as .webp, in public/images/ambience/.
 */
export const ambience = [
  { title: "Interior", image: "" },
  { title: "Seating", image: "" },
  { title: "In the kitchen", image: "" },
  { title: "At the table", image: "" },
  { title: "Exterior", image: "" },
];

/**
 * SECTION H — Customer reviews. Only add real reviews, with the guest's permission.
 * Example:  { quote: "Best tea on Revu Main Road.", name: "Guest name", rating: 5 },
 * rating is optional (1 to 5). With no reviews, the section invites guests to share theirs.
 */
export const reviews: { quote: string; name: string; rating?: number }[] = [];

/** Search keywords for Google. */
export const seo = {
  siteUrl: "https://sdnasar2001.github.io/arcafe",
  title: "AR Cafe | Cafe & Restaurant in Parangi Pettai, Revu Main Road",
  description:
    "AR Cafe, Revu Main Road, Parangi Pettai — fresh tea and coffee, South Indian tiffin and a bakery counter. Browse the menu and order on WhatsApp.",
  keywords: [
    "AR Cafe Parangi Pettai",
    "Cafe in Parangi Pettai",
    "Restaurant in Parangi Pettai",
    "AR Cafe Revu Main Road",
    "Parangipettai cafe",
    "tea and tiffin Parangipettai",
  ],
};
