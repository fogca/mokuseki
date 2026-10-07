#!/usr/bin/env python3
"""Convert source photography to delivery-ready WebP + the OGP image.

Dev rule: never ship the original PNG masters — originals live in
assets_src/images/ (outside static/, so they never deploy), WebP goes
to static/images/. Re-run whenever originals change:

    python3 scripts/convert_images.py
"""

from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC_DIR = ROOT / "assets_src/images"
OUT_DIR = ROOT / "static/images"

MAX_W = 1920  # largest rendered size (hero, full-bleed)
QUALITY = 82

OGP_SOURCE = "mood_00.png"
OGP_SIZE = (1200, 630)

# Letterbox bars baked into a source (mood_02 has ~10px of black on every
# side) show as hairlines once object-fit: cover crops the photo. A border
# line counts as a bar when it is near-black AND flat, and an axis is only
# trimmed when BOTH its sides have one — a dark area on one edge (the hero's
# black post on the right) is part of the photo, not a letterbox.
BORDER_LUMA_MAX = 12
BORDER_STD_MAX = 6
BORDER_MAX_SHARE = 0.03  # never trim more than 3% of a side
BORDER_PAD = 3  # plus the soft anti-aliased lines just inside a bar


def _bar_depth(lines) -> int:
    depth = 0
    for line in lines:
        if line.mean() > BORDER_LUMA_MAX or line.std() > BORDER_STD_MAX:
            break
        depth += 1
    return depth


def trim_black_bars(im: Image.Image) -> Image.Image:
    luma = np.asarray(im.convert("L"), dtype=float)
    h, w = luma.shape
    cap_x, cap_y = int(w * BORDER_MAX_SHARE), int(h * BORDER_MAX_SHARE)

    def axis(start_lines, end_lines, cap):
        a, b = _bar_depth(start_lines), _bar_depth(end_lines)
        if not (a and b):
            return 0, 0
        return min(a + BORDER_PAD, cap), min(b + BORDER_PAD, cap)

    left, right = axis(luma.T, luma.T[::-1], cap_x)
    top, bottom = axis(luma, luma[::-1], cap_y)
    if not (left or right or top or bottom):
        return im
    return im.crop((left, top, w - right, h - bottom))


def to_webp(src: Path) -> None:
    im = trim_black_bars(Image.open(src))
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
