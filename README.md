# Mokuseki

モクセキ — ホテルブランドサイト・SvelteKit scaffold（表記ルール: 漢字「木積」はNG・日本語表記はカタカナ「モクセキ」）

東海エリアの小規模ブティックホテル（3〜4室）のリブランディングに伴うWebプロジェクト。
民泊からホテルへの転換にあたり、ブランドサイト・ダイレクト予約導線を構築する。

## Stack

- SvelteKit 2.x + Svelte 5 (Runes mode)
- TypeScript
- Vite
- Cloudflare Pages (`@sveltejs/adapter-cloudflare`)
- PWA (`@vite-pwa/sveltekit`)
- GSAP + Lenis

## Dev

```bash
npm install
npm run dev
```

## Deploy target

Cloudflare Pages

## Status

Scaffold only — brand design and content integration pending.

# mokuseki

## Pre-launch state (2026-07-07)

- Booking flow is **gated**: `/reserve`, `/reserve/results`, `/booking/*` redirect to `/contact`
  unless `BOOKING_OPEN=true` is set (Cloudflare Pages env var). Dev stays open.
- `robots.txt` is `Disallow: /` — flip to the LAUNCH block inside that file on launch day
  (+ Search Console registration).
- `src/lib/site.ts` — set `SITE_ORIGIN` once the production domain is fixed.
- Image originals live in `assets_src/images/`; run `python3 scripts/convert_images.py`
  to regenerate the delivered WebP + OGP.
- FontPlus: register the production domain (and localhost) in the FontPlus マイページ
  or 筑紫オールドゴシック will not load.
