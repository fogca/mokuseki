#!/usr/bin/env python3
"""Convert source photography to delivery-ready WebP + the OGP image.

Dev rule: never ship the original PNG masters — originals live in
assets_src/images/ (outside static/, so they never deploy), WebP goes
to static/images/. Re-run whenever originals change:

    python3 scripts/convert_images.py
"""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC_DIR = ROOT / "assets_src/images"
OUT_DIR = ROOT / "static/images"

MAX_W = 1920  # largest rendered size (hero, full-bleed)
QUALITY = 82

OGP_SOURCE = "mood_00.png"
OGP_SIZE = (1200, 630)


def to_webp(src: Path) -> None:
    im = Image.open(src)
    if im.width > MAX_W:
        im = im.resize((MAX_W, round(im.height * MAX_W / im.width)), Image.LANCZOS)
    out = OUT_DIR / f"{src.stem}.webp"
    im.save(out, "WEBP", quality=QUALITY, method=6)
    print(f"✓ {out.name}  {out.stat().st_size // 1024} KB")


def make_ogp(src: Path) -> None:
    im = Image.open(src)
    tw, th = OGP_SIZE
    scale = max(tw / im.width, th / im.height)
    im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    left, top = (im.width - tw) // 2, (im.height - th) // 2
    im = im.crop((left, top, left + tw, top + th)).convert("RGB")
    out = OUT_DIR / "ogp.jpg"
    im.save(out, "JPEG", quality=85, optimize=True, progressive=True)
    print(f"✓ {out.name}  {out.stat().st_size // 1024} KB")


if __name__ == "__main__":
    for src in sorted(SRC_DIR.glob("*.png")):
        to_webp(src)
    make_ogp(SRC_DIR / OGP_SOURCE)
