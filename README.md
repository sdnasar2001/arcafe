# AR CAFE — Crafted for the craving.

The website of AR Cafe, Revu Main Road, Parangi Pettai: a black-and-champagne-gold site with a
3D cup that travels with the page as you scroll, a full menu with vegetarian / non-vegetarian
filters, and an order basket that sends the order to the cafe on WhatsApp.

Built with Next.js, React, TypeScript, Tailwind CSS, Three.js + React Three Fiber, GSAP
ScrollTrigger, Framer Motion and Lucide icons. It is exported as a static site and hosted on
GitHub Pages.

---

## Where to change things

| What | Where |
|---|---|
| Dishes, prices, photos, veg / non-veg mark, available today | **Admin page** (`/admin/` on the live site) — or `content/site.json` |
| Cafe name, address, opening hours, **WhatsApp number** | Admin page — or `content/site.json` → `cafe` |
| Tagline, story text, signature dish, ingredients, ambience photos, reviews, Instagram, map, SEO | `content/brand.ts` |
| Logo files | `public/brand/` (made by `scripts/make-logos.py`) |

Every change pushed to the `main` branch rebuilds the site by itself (about 2 minutes).

### WhatsApp number (orders go here)

`content/site.json` → `"cafe"` → `"phone"`. Write the country code and number as digits only,
no `+` or spaces — `91` followed by the 10-digit mobile number. If it is left empty, the
"Checkout via WhatsApp" button is switched off and shows a notice instead, so no order can go
to a wrong number.

### Add or edit a dish

Easiest: open `/admin/` on the live site, sign in with your GitHub token, edit, Save.

By hand, in `content/site.json`, each dish looks like this:

```json
{
  "name": "Masala Dosa",
  "description": "Crisp dosa with potato masala",
  "price": "45",
  "image": "uploads/masala-dosa.webp",
  "type": "veg",
  "available": true
}
```

- `price` — numbers only. Leave `""` and the dish shows "Price at the counter".
- `type` — `"veg"` (green mark), `"nonveg"` (brown mark), or `""` (no mark; then it only shows under "All").
- `available` — `false` shows "Not available today" and the dish can't be ordered.
- Each group in `"menu"` (Tea and Coffee, Tiffin, …) becomes a category filter automatically.

### Replace photos

1. Save the photo as `.webp` (or `.jpg`), about 1600 px wide.
2. Put it in `public/images/` (or upload it from the admin page — it goes to `public/uploads/`).
3. Write its path without `public/`, e.g. `"images/interior.webp"`.

- Dish photos: the dish's `image` in `site.json`.
- Ambience (Interior, Seating, Kitchen, Table, Exterior): `content/brand.ts` → `ambience`.
  Until a photo is set, the slot shows "Photograph coming soon".
- Wide story photo: `content/brand.ts` → `story.image` (otherwise the admin page's front photo).
- The gallery uses the dish photos automatically.

### Reviews

`content/brand.ts` → `reviews`. Add only real reviews, with the guest's permission. Until there
are any, the section invites guests to share feedback on WhatsApp or Google Maps — no made-up
quotes or star ratings are shown.

### Instagram and the map

- `content/brand.ts` → `brand.instagram`: paste the page address. Until then the site says "Instagram — coming soon".
- `brand.mapEmbedUrl`: for the exact pin, Google Maps → AR Cafe → Share → Embed a map → copy only the `src="…"` link.

### Logos

**Main logo:** the navy-and-gold AR Cafe badge — `public/brand/ar-cafe-logo.png` (1024 px,
transparent), with smaller `.webp` copies used on the site, plus the browser-tab icons
`app/icon.png` and `app/apple-icon.png`. It appears in the opening sequence, the header, the
first screen, the footer and the share picture (`public/og.png`). To swap it, replace those
files with the same names and sizes.

`public/brand/` also holds an alternative logo family as vector SVGs with transparent backgrounds:

| File | Use |
|---|---|
| `ar-cafe-logo-primary.svg` | Main logo: monogram, AR CAFE, tagline |
| `ar-monogram.svg` | Standalone AR monogram |
| `ar-cafe-logo-horizontal.svg` | Signboards, letterheads, website header |
| `ar-cafe-social-square.svg` / `-black.svg` | Social profile picture (transparent / on black) |
| `ar-cafe-logo-white.svg`, `ar-monogram-white.svg` | One colour, white |
| `ar-cafe-logo-gold.svg`, `ar-monogram-gold.svg` | One colour, flat gold (#D6B477) — for printing, embroidery |

The text is converted to outlines, so the files print correctly without installing fonts.
To regenerate after changing the drawing: `python3 scripts/make-logos.py` (needs `pip install fonttools`).

---

## Run it on your computer

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in out/
```

## Deploy

GitHub Actions (`.github/workflows/deploy.yml`) builds and publishes every push to `main` to
GitHub Pages at https://sdnasar2001.github.io/arcafe/.

To publish this design from the `luxury-3d` branch: on GitHub open the branch → **Compare & pull
request** → **Merge**. To roll back, revert the merge commit.

---

## How the site is put together

```
app/            page, layout (SEO metadata), sitemap, robots, styles
components/     one file per section (Hero, Story, Signature, Anatomy, Menu, Ambience,
                Gallery, Reviews, Visit, Footer) + Nav, Cart, Intro, Experience
components/three/Scene.tsx   the 3D cup, steam, gold dust and floating ingredients
lib/            site data helpers, cart, scroll ↔ 3D link (journey.ts)
content/        site.json (admin page) and brand.ts (everything else)
public/brand/   logos      public/admin/   admin page
```

- The 3D scene is modelled in code (no model files to download) and loads after the page.
  On phones it renders at a lower resolution, without shadows and with fewer particles;
  it pauses once you scroll past the "anatomy of a cup" section.
- "Reduce motion" in the phone or computer settings turns off the opening sequence and
  the decorative motion.
- Without WebGL, a glowing monogram replaces the 3D scene.
- Structured data (Google) is built only from the facts in `site.json` and `brand.ts`.
