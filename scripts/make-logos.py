"""Builds the AR Cafe logo family as clean SVG vectors (text converted to outlines).

Run from the project folder after `npm install`:
    python3 scripts/make-logos.py

Writes to public/brand/ and app/icon.svg. Needs Python 3 with fontTools (pip install fonttools).
The wordmark uses Cormorant Garamond (SIL Open Font License), read from node_modules/@fontsource.
"""
import shutil
import subprocess
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "brand"
FONT_DIR = ROOT / "node_modules" / "@fontsource" / "cormorant-garamond" / "files"

GOLD = "#D6B477"
WHITE = "#F5F0E6"
BLACK = "#090909"

# ---------------------------------------------------------------------------
# The AR monogram, drawn on a 120 x 120 grid.
# The A's right side and the R's stem are one shared upright: a thin hairline
# diagonal (the A) leans against a heavy vertical (the R), the way a Didone
# typeface contrasts thin and thick strokes. Flat hairline serifs finish it.
# ---------------------------------------------------------------------------
MONOGRAM = " ".join([
    # shared stem (A's right side / R's upright)
    "M60 18 H68 V100 H60 Z",
    # A: hairline diagonal from the apex down to the left foot
    "M60 18 H64.4 L27.4 100 H23 Z",
    # A: hairline crossbar
    "M36.2 70.4 H60 V73.4 H34.9 Z",
    # R: bowl (heavier on the curve, light at top and bottom)
    "M68 18 H82 C96.5 18 103 26.5 103 38 C103 49.5 96.5 58 82 58 H68 V54.2 H81"
    " C91.6 54.2 95.6 48 95.6 38 C95.6 28 91.6 21.8 81 21.8 H68 Z",
    # R: heavy leg
    "M75.5 58 H84 L109 100 H100 Z",
    # serifs
    "M53 16.4 H68 V19 H53 Z",
    "M15 98.6 H33 V101.2 H15 Z",
    "M53 98.6 H75 V101.2 H53 Z",
    "M94 98.6 H113 V101.2 H94 Z",
])
MONO_BOX = (13, 14, 102, 90)  # x, y, w, h of the drawn glyph


def gold_defs(gid: str) -> str:
    # Champagne metal: light catches the upper-left, falls to bronze at the lower-right.
    return (
        f'<defs><linearGradient id="{gid}" x1="0" y1="0" x2="1" y2="1">'
        '<stop offset="0" stop-color="#F3E3BC"/>'
        '<stop offset=".38" stop-color="#D6B477"/>'
        '<stop offset=".7" stop-color="#B8955C"/>'
        '<stop offset="1" stop-color="#E2C68E"/>'
        "</linearGradient></defs>"
    )


def text_path(text: str, font: TTFont, size: float, tracking_em: float, x: float, baseline: float, align="center"):
    """Returns (svg path data, width) for `text` set in `font` at `size` with letter spacing."""
    glyphs = font.getGlyphSet()
    cmap = font.getBestCmap()
    upm = font["head"].unitsPerEm
    scale = size / upm
    hmtx = font["hmtx"]
    advances = []
    for ch in text:
        gname = cmap[ord(ch)]
        advances.append((gname, hmtx[gname][0] * scale))
    track = tracking_em * size
    width = sum(a for _, a in advances) + track * (len(text) - 1)
    cur = x - width / 2 if align == "center" else x
    parts = []
    for gname, adv in advances:
        pen = SVGPathPen(glyphs)
        tpen = TransformPen(pen, (scale, 0, 0, -scale, cur, baseline))
        glyphs[gname].draw(tpen)
        d = pen.getCommands()
        if d:
            parts.append(d)
        cur += adv + track
    return " ".join(parts), width


def monogram_group(x: float, y: float, h: float) -> str:
    s = h / MONO_BOX[3]
    tx = x - MONO_BOX[0] * s
    ty = y - MONO_BOX[1] * s
    return f'<path transform="translate({tx:.2f} {ty:.2f}) scale({s:.4f})" d="{MONOGRAM}"/>'


def svg(w, h, body, fill, title, gid="g"):
    defs = gold_defs(gid) if fill == "gradient" else ""
    paint = f"url(#{gid})" if fill == "gradient" else fill
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img" aria-label="{title}">'
        f"<title>{title}</title>{defs}<g fill=\"{paint}\">{body}</g></svg>\n"
    )


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    medium = TTFont(FONT_DIR / "cormorant-garamond-latin-500-normal.woff")
    semibold = TTFont(FONT_DIR / "cormorant-garamond-latin-600-normal.woff")

    # 1. Standalone monogram
    mono_body = monogram_group(10, 10, 100)
    mono_w = MONO_BOX[2] / MONO_BOX[3] * 100 + 20
    files = {}
    files["ar-monogram.svg"] = svg(round(mono_w), 120, mono_body, "gradient", "AR Cafe monogram")

    # 2. Primary logo: monogram, hairline rule, AR CAFE wordmark, tagline
    W = 420
    word, ww = text_path("AR CAFE", semibold, 50, 0.32, W / 2, 248)
    tag, tw = text_path("CRAFTED FOR THE CRAVING", medium, 13, 0.42, W / 2, 284)
    mono_h = 140
    mono_wd = MONO_BOX[2] / MONO_BOX[3] * mono_h
    body = monogram_group((W - mono_wd) / 2, 30, mono_h)
    body += f'<path d="{word}"/>'
    rule_w = 54
    body += f'<rect x="{W/2 - rule_w - 14:.1f}" y="261.4" width="{rule_w}" height="1"/>'
    body += f'<rect x="{W/2 + 14:.1f}" y="261.4" width="{rule_w}" height="1"/>'
    body += f'<rect x="{W/2 - 2.4:.1f}" y="259.5" width="4.8" height="4.8" transform="rotate(45 {W/2} 261.9)"/>'
    body += f'<path d="{tag}"/>'
    primary = body
    files["ar-cafe-logo-primary.svg"] = svg(W, 310, primary, "gradient", "AR Cafe, crafted for the craving")

    # 3. Horizontal logo: monogram, divider, two-line wordmark
    hw_word, hww = text_path("AR CAFE", semibold, 44, 0.3, 0, 0, align="left")
    hw_tag, htw = text_path("CRAFTED FOR THE CRAVING", medium, 11.5, 0.38, 0, 0, align="left")
    mono_h2 = 84
    mono_w2 = MONO_BOX[2] / MONO_BOX[3] * mono_h2
    text_x = 20 + mono_w2 + 30
    word2, ww2 = text_path("AR CAFE", semibold, 44, 0.3, text_x, 68, align="left")
    tag2, tw2 = text_path("CRAFTED FOR THE CRAVING", medium, 11.5, 0.38, text_x + 1, 94, align="left")
    HW = round(text_x + max(ww2, tw2) + 20)
    body = monogram_group(20, 18, mono_h2)
    body += f'<rect x="{20 + mono_w2 + 14:.1f}" y="22" width="1" height="76"/>'
    body += f'<path d="{word2}"/><path d="{tag2}"/>'
    files["ar-cafe-logo-horizontal.svg"] = svg(HW, 120, body, "gradient", "AR Cafe")

    # 4. Square social logo (transparent) and a black-backed version for profile pictures
    S = 512
    sw, _ = text_path("AR CAFE", semibold, 40, 0.34, S / 2, 404)
    mono_h3 = 210
    mono_w3 = MONO_BOX[2] / MONO_BOX[3] * mono_h3
    sq = monogram_group((S - mono_w3) / 2, 128, mono_h3)
    sq += f'<path d="{sw}"/>'
    ring = (
        f'<circle cx="256" cy="256" r="236" fill="none" stroke="currentColor" stroke-width="1.6"/>'
        f'<circle cx="256" cy="256" r="226" fill="none" stroke="currentColor" stroke-width=".8"/>'
    )
    # rings use the same paint as the glyphs
    sq_body = sq
    files["ar-cafe-social-square.svg"] = svg(S, S, sq_body, "gradient", "AR Cafe").replace(
        "</g></svg>", "</g>" + ring.replace("currentColor", "url(#g)") + "</svg>"
    )
    files["ar-cafe-social-square-black.svg"] = files["ar-cafe-social-square.svg"].replace(
        "</defs>", f'</defs><rect width="{S}" height="{S}" fill="{BLACK}"/>', 1
    )

    # 5 & 6. Monochrome versions of the primary logo and monogram
    files["ar-cafe-logo-white.svg"] = svg(W, 310, primary, WHITE, "AR Cafe")
    files["ar-cafe-logo-gold.svg"] = svg(W, 310, primary, GOLD, "AR Cafe")
    files["ar-monogram-white.svg"] = svg(round(mono_w), 120, mono_body, WHITE, "AR Cafe monogram")
    files["ar-monogram-gold.svg"] = svg(round(mono_w), 120, mono_body, GOLD, "AR Cafe monogram")

    for name, content in files.items():
        (OUT / name).write_text(content, encoding="utf-8")

    # Browser-tab icon: monogram on deep black, readable at 16 px
    icon = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">'
        f'<rect width="64" height="64" rx="12" fill="{BLACK}"/>'
        + gold_defs("g")
        + f'<g fill="url(#g)">{monogram_group(10.5, 12, 40)}</g></svg>\n'
    )
    (ROOT / "app" / "icon.svg").write_text(icon, encoding="utf-8")
    # Social share picture (1200 x 630): primary logo on deep black with a soft gold glow.
    og = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">'
        '<defs><radialGradient id="glow" cx=".5" cy=".45" r=".55"><stop offset="0" stop-color="#2a2318"/>'
        '<stop offset="1" stop-color="#090909"/></radialGradient></defs>'
        '<rect width="1200" height="630" fill="url(#glow)"/>'
        '<rect x="28" y="28" width="1144" height="574" fill="none" stroke="#80633D" stroke-width="1"/>'
        f'<g transform="translate({600 - W * 1.55 / 2:.1f} 78) scale(1.55)">'
        + files["ar-cafe-logo-primary.svg"].split("<title>AR Cafe, crafted for the craving</title>")[1].replace("</svg>\n", "")
        + "</g></svg>\n"
    )
    og_svg = OUT / "og-image.svg"
    og_svg.write_text(og, encoding="utf-8")
    if shutil.which("rsvg-convert"):
        subprocess.run(["rsvg-convert", "-w", "1200", "-h", "630", str(og_svg), "-o", str(ROOT / "public" / "og.png")], check=True)
    print("wrote", ", ".join(files), "+ og-image.svg, og.png, app/icon.svg")


if __name__ == "__main__":
    main()
