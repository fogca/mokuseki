<script lang="ts">
	// "our amenity" (2026-10 Top redesign). Figma 220:663 gives only the
	// eyebrow and heading; the body and photos are an extension that absorbs
	// the old gallery. Both photos use the only two Figma formats, and the
	// wide one is right-aligned to mirror the concept image's left alignment.
	// The whole section speaks in the lighter Pro M voice (the Figma's Pro L
	// isn't in the FONTPLUS box) and in brown rather than rust.
	import { useI18n } from '$lib/i18n/store.svelte';
	import { reveal } from '$lib/actions/reveal';

	const i18n = useI18n();
	const copy = $derived(i18n.t.home.amenity);
</script>

<section class="mk-amenity" id="amenity">
	<p class="mk-eyebrow mk-eyebrow--thin reveal-text" lang="en" use:reveal>{copy.eyebrow}</p>
	<h2 class="mk-h mk-h--m amenity-heading reveal-text" use:reveal>{copy.heading}</h2>
	<p class="mk-body mk-body--m amenity-body reveal-text" use:reveal>
		{i18n.t.home.philosophy.body}
	</p>

	<figure class="amenity-fig amenity-fig--wide mk-reveal-mask" use:reveal>
		<img
			src="/images/mood_02.webp"
			width="1767"
			height="2359"
			alt={copy.imageAlts[0]}
			loading="lazy"
			decoding="async"
		/>
	</figure>
	<figure class="amenity-fig amenity-fig--card mk-reveal-mask" use:reveal>
		<img
			src="/images/mood_01.webp"
			width="1536"
			height="2048"
			alt={copy.imageAlts[1]}
			loading="lazy"
			decoding="async"
		/>
	</figure>
</section>

<style>
	.mk-amenity {
		/* Figma 220:663 — eyebrow 222 below the destinations card (2496 →
		 * 2718), heading 30 below the eyebrow (14.4 + 15.6). */
		--amenity-pad-top: 222px;
		--amenity-head-gap: 15.6px;
		/* Extension: the concept section's Figma rhythm (220:663), mirrored. */
		--amenity-body-gap: 9.8px;
		--amenity-fig-gap: 46.6px;
		--amenity-pad-bottom: 160px;
		--amenity-measure: 500px;
		--amenity-wide-w: calc(100% * 5 / 7); /* 5/7 of the column = 889 at 1440 */
		--amenity-wide-ratio: var(--mk-wide-ratio);
		--amenity-card-w: 468px;
		/* Motion: same text stagger as concept; the second photo trails. */
		--amenity-text-stagger: 0.08s;
		--amenity-card-delay: 0.15s;

		padding: var(--amenity-pad-top) var(--mk-inset) var(--amenity-pad-bottom);
		background: var(--mk-cream);
		color: var(--mk-brown);
	}

	.amenity-heading {
		--reveal-d: var(--amenity-text-stagger);
		margin-top: var(--amenity-head-gap);
	}

	.amenity-body {
		--reveal-d: calc(2 * var(--amenity-text-stagger));
		margin-top: var(--amenity-body-gap);
		max-width: var(--amenity-measure);
	}

	/* ─── Photos ─────────────────────────────────────── */
	/* overflow: hidden keeps the mask reveal's 1.08 zoom inside the frame.
	 * Blush shows while the lazy image decodes — on the img, so it opens
	 * with the mask reveal rather than standing in the frame before it. */
	.amenity-fig {
		overflow: hidden;
	}

	.amenity-fig img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		background: var(--mk-blush);
	}

	.amenity-fig--wide {
		margin-top: var(--amenity-fig-gap);
		margin-left: auto;
		width: var(--amenity-wide-w);
		aspect-ratio: var(--amenity-wide-ratio);
	}

	/* The bowl sits low in the portrait source; 66% keeps it in frame. */
	.amenity-fig--wide img {
		object-position: 50% 66%;
	}

	.amenity-fig--card {
		--reveal-d: var(--amenity-card-delay);
		margin-top: var(--mk-gap);
		width: var(--amenity-card-w);
		max-width: 100%;
		aspect-ratio: var(--mk-card-ratio);
	}

	.amenity-fig--card img {
		object-position: 50% 40%;
	}

	/* ─── Tablet (768–1023) ──────────────────────────── */
	/* Full column width, as the concept image does at this width — keeps
	 * the two sections mirrored. */
	@media (max-width: 1023.98px) {
		.mk-amenity {
			--amenity-wide-w: 100%;
		}
	}

	/* ─── SP (≤767) ──────────────────────────────────── */
	@media (max-width: 767.98px) {
		.mk-amenity {
			--amenity-pad-top: 96px;
			--amenity-pad-bottom: 96px;
			--amenity-head-gap: 12px;
			--amenity-body-gap: 12px;
			--amenity-fig-gap: 40px;
			--amenity-wide-ratio: var(--mk-card-ratio);
			--amenity-card-w: 260px;
		}

		/* Bleeds left to the screen edge — the mirror of the concept image,
		 * which bleeds right. */
		.amenity-fig--wide {
			margin-left: calc(-1 * var(--mk-inset));
			width: calc(100% + var(--mk-inset));
		}
	}
</style>
