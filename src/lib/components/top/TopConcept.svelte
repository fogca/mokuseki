<script lang="ts">
	// Stay concept (2026-10 Top redesign, Figma 220:663). Replaces the old
	// "Brand intro" and "Concept" sections. Keeps id="concept" so the menu's
	// /#concept link still lands here.
	import { useI18n } from '$lib/i18n/store.svelte';
	import { reveal } from '$lib/actions/reveal';
	import Lines from '$lib/components/Lines.svelte';

	const i18n = useI18n();
	const copy = $derived(i18n.t.home.concept);
</script>

<section class="mk-concept" id="concept">
	<p class="mk-eyebrow reveal-text" lang="en" use:reveal>{copy.eyebrow}</p>
	<h2 class="mk-h concept-heading reveal-text" style:--i={1} use:reveal>{copy.heading}</h2>
	<!-- Japanese keeps Figma's four lines from 768px up (.mk-lines). -->
	<p class="mk-body concept-body reveal-text" style:--i={2} use:reveal>
		<Lines text={copy.lines} />
	</p>
	<figure class="concept-figure mk-reveal-mask" use:reveal>
		<img
			src="/images/top_concept.webp"
			srcset="/images/top_concept.webp 1122w"
			sizes="(min-width: 1024px) 889px, 100vw"
			width="1122"
			height="808"
			alt={copy.imageAlt}
			loading="lazy"
			decoding="async"
		/>
	</figure>
</section>

<style>
	.mk-concept {
		/* SP (≤767). Not in Figma; the shared SP rhythm. The figure bleeds
		 * off the right edge at the card ratio (370×229 at 390). */
		--concept-pad-top: 96px;
		--concept-pad-bottom: 96px;
		--concept-heading-gap: 12px;
		--concept-body-gap: 12px;
		--concept-figure-gap: 40px;
		--concept-measure: 500px; /* Figma body width */
		--concept-focus: 50% 72%; /* Figma image 61 crop */
		--concept-stagger: 0.08s;

		padding: var(--concept-pad-top) var(--mk-inset) var(--concept-pad-bottom);
		background: var(--mk-cream);
		color: var(--mk-rust);
	}

	.mk-concept .reveal-text {
		--reveal-d: calc(var(--i, 0) * var(--concept-stagger));
	}

	.concept-heading {
		margin-top: var(--concept-heading-gap);
	}

	.concept-body {
		margin-top: var(--concept-body-gap);
		/* English is one flowing entry; Japanese lines are nowrap blocks
		 * from 768px and unaffected. */
		max-width: var(--concept-measure);
	}

	.concept-figure {
		margin-top: var(--concept-figure-gap);
		margin-right: calc(-1 * var(--mk-inset));
		width: calc(100% + var(--mk-inset));
		aspect-ratio: var(--mk-card-ratio);
		overflow: hidden;
	}

	/* Blush shows while the lazy image decodes — on the img, so it opens
	 * with the mask reveal rather than standing in the frame before it. */
	.concept-figure img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: var(--concept-focus);
		background: var(--mk-blush);
	}

	/* Tablet and up — Figma 220:663. At 1440 (scrollY 726): eyebrow 301,
	 * heading 331, body 392, figure 541–922; section 908 tall (174 → 1082). */
	@media (min-width: 768px) {
		.mk-concept {
			--concept-pad-top: 127px;
			--concept-pad-bottom: 160px;
			--concept-heading-gap: 15.6px;
			--concept-body-gap: 9.8px;
			--concept-figure-gap: 46.6px;
		}

		.concept-figure {
			margin-right: 0;
			width: 100%;
			aspect-ratio: var(--mk-wide-ratio);
		}
	}

	/* PC: the wide image is 5/7 of the column (888.6 at 1440; Figma 889),
	 * left-aligned. */
	@media (min-width: 1024px) {
		.concept-figure {
			width: calc(100% * 5 / 7);
		}
	}
</style>
