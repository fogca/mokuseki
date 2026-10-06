<script lang="ts">
	// Destinations (2026-10 Top redesign). The rust title card is Figma
	// 220:663; everything under it is an undesigned extension that stays on
	// the same rust: the approved Nagoya area items, then the area map.
	// Keeps id="area" so the menu's /#area link still lands here.
	import { useI18n } from '$lib/i18n/store.svelte';
	import { reveal } from '$lib/actions/reveal';
	import Lines from '$lib/components/Lines.svelte';

	const i18n = useI18n();
	const copy = $derived(i18n.t.home.destinations);
	const items = $derived(i18n.t.home.area.items);
	const isJa = $derived(i18n.locale === 'ja');

	// The descriptions carry the old list layout's manual '\n' breaks; the
	// new columns flow freely, so drop them. Japanese joins with no space,
	// English with one.
	function flow(text: string): string {
		return text.split('\n').join(isJa ? '' : ' ');
	}
</script>

<section class="mk-dest" id="area" data-header="dark">
	<div class="mk-dest-title">
		<!-- A single grid item: place-items then centres eyebrow + heading as
		     one block (two items would each be centred in half the card). -->
		<div class="mk-dest-title-in">
			<p class="mk-eyebrow reveal-text" lang="en" use:reveal>{copy.eyebrow}</p>
			{#if isJa}
				<!-- Figma's two lines (.mk-lines--always keeps them at every
				     width). Each line is its own reveal block, so the markup is
				     inline here rather than <Lines>, which can't carry per-line
				     reveals. -->
				<h2 class="mk-h mk-lines mk-lines--always dest-heading">
					{#each copy.heading as line, i (i)}
						<span class="mk-line dest-line reveal-text" style:--i={i} use:reveal>{line}</span>
					{/each}
				</h2>
			{:else}
				<!-- English is one balanced block, never force-broken. -->
				<h2 class="mk-h dest-heading reveal-text" use:reveal><Lines text={copy.heading} /></h2>
			{/if}
		</div>
	</div>

	<ol class="mk-dest-items">
		{#each items as item, i (item.index)}
			<li class="dest-item reveal-text" style:--i={i} use:reveal>
				<p class="mk-eyebrow dest-index" lang="en">{item.index}</p>
				<h3 class="mk-body dest-name">{item.title}</h3>
				<p class="mk-body dest-desc">{flow(item.description)}</p>
			</li>
		{/each}
	</ol>

	<!-- Placeholder — centered on Nagoya Castle as a stand-in landmark
	     until each house's real address is finalized. No API key needed
	     (the plain /maps?...&output=embed form), but it does load an
	     iframe from google.com — fine given no CSP restricts frame-src. -->
	<div class="mk-map reveal-img" use:reveal>
		<iframe
			title="MOKUSEKI — Nagoya area map"
			src="https://www.google.com/maps?q=%E5%90%8D%E5%8F%A4%E5%B1%8B%E5%9F%8E&output=embed"
			loading="lazy"
			referrerpolicy="no-referrer-when-downgrade"
		></iframe>
	</div>
</section>

<style>
	.mk-dest {
		/* Figma 220:663 — title card. The block is centred in the card and
		 * lifted 44.6px, which puts the eyebrow at 354 and the heading at 399
		 * of a 900-tall card (centre 427.7). */
		--dest-card-min-h: 640px;
		--dest-viewport-h: 100vh; /* 100svh where supported (see @supports below) */
		--dest-lift: 44.6px;
		--dest-head-gap: 30.6px; /* eyebrow bottom → heading top */
		/* Extension below the card (not in Figma). */
		--dest-pad-bottom: 160px;
		--dest-col-gap: 40px;
		--dest-name-gap: 16px;
		--dest-desc-gap: 8px;
		--dest-map-gap: 120px;
		--dest-map-ratio: var(--mk-wide-ratio); /* the Figma wide format, not an invented 16/7 */
		--dest-measure-tablet: 600px;
		/* Motion: heading lines, then the items, in sequence. */
		--dest-line-stagger: 0.12s;
		--dest-item-stagger: 0.1s;

		padding: 0 var(--mk-inset) var(--dest-pad-bottom);
		background: var(--mk-rust);
		color: var(--mk-cream);
	}

	/* A declaration containing var() is never dropped at parse time, so a
	 * plain "vh line, then svh line" fallback would not work here: an
	 * unsupported svh would make min-height compute to its initial value.
	 * The viewport unit is therefore chosen with @supports instead. */
	@supports (height: 100svh) {
		.mk-dest {
			--dest-viewport-h: 100svh;
		}
	}

	/* ─── Title card ─────────────────────────────────── */
	.mk-dest-title {
		min-height: max(var(--dest-card-min-h), var(--dest-viewport-h));
		display: grid;
		place-items: center;
		padding-bottom: var(--dest-lift);
		text-align: center;
	}

	.dest-heading {
		margin-top: var(--dest-head-gap);
	}

	.dest-line {
		--reveal-d: calc(var(--i) * var(--dest-line-stagger));
	}

	/* ─── Area items ─────────────────────────────────── */
	/* Titles and descriptions share the body size; colour alone tells them
	 * apart (cream / blush), per the type-size budget. */
	.mk-dest-items {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: var(--dest-col-gap);
		align-items: start;
	}

	.dest-item {
		--reveal-d: calc(var(--i) * var(--dest-item-stagger));
	}

	.dest-index {
		color: var(--mk-peach);
	}

	.dest-name {
		margin-top: var(--dest-name-gap);
		color: var(--mk-cream);
	}

	.dest-desc {
		margin-top: var(--dest-desc-gap);
		color: var(--mk-blush);
	}

	/* ─── Map ────────────────────────────────────────── */
	.mk-map {
		margin-top: var(--dest-map-gap);
		width: 100%;
		aspect-ratio: var(--dest-map-ratio);
		background: var(--mk-brown);
	}

	.mk-map iframe {
		display: block;
		width: 100%;
		height: 100%;
		border: 0;
		/* The free /maps?...&output=embed iframe has no style parameter (that
		 * needs the paid Maps JS API + a styled map ID) — so the tint is a CSS
		 * filter: grey, warmed slightly toward the rust ground. Filter only,
		 * never mix-blend-mode on the iframe. */
		filter: grayscale(1) sepia(0.25) contrast(0.92);
	}

	/* ─── Tablet (768–1023) ──────────────────────────── */
	@media (max-width: 1023.98px) {
		.mk-dest {
			--dest-map-ratio: 4 / 3;
		}

		.mk-dest-items {
			grid-template-columns: minmax(0, 1fr);
			max-width: var(--dest-measure-tablet);
		}
	}

	/* ─── SP (≤767) ──────────────────────────────────── */
	@media (max-width: 767.98px) {
		.mk-dest {
			--dest-card-min-h: 560px;
			--dest-head-gap: 20px;
			--dest-name-gap: 12px;
			--dest-desc-gap: 6px;
			--dest-map-gap: 64px;
			--dest-map-ratio: 1 / 1; /* pans rely on Google's cooperative gestures */
			--dest-pad-bottom: 96px;
		}

		/* Not a full screen on SP — the card would otherwise be one long
		 * empty rust scroll before the items. */
		.mk-dest-title {
			min-height: var(--dest-card-min-h);
		}

		/* The longer Figma line is 13 × 25.2 = 328px at 24px: it fits from
		 * 375 up, but would be clipped by .mk-top at 320–360. Keep the block
		 * lines and let one wrap (at a phrase, via auto-phrase) only when it
		 * truly can't fit. (0,4,0) beats base.css's nowrap at (0,3,0). */
		.dest-heading .dest-line {
			white-space: normal;
		}
	}
</style>
