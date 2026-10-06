<script lang="ts">
	// Accommodation band (2026-10 Top redesign, Figma 220:663: band 1082 →
	// 1596). The body is the approved brand statement (home.intro.body) —
	// Figma's body here was a placeholder copy of the concept text. DOM order
	// is text → button → rail at every width, so focus order matches the
	// visual order on PC (two columns) and SP (stacked) alike.
	import { useI18n } from '$lib/i18n/store.svelte';
	import { reveal } from '$lib/actions/reveal';
	import HouseRail from './HouseRail.svelte';
	import type { Property } from '$lib/types/domain';

	let { properties }: { properties: Property[] } = $props();

	const i18n = useI18n();
	const copy = $derived(i18n.t.home.accommodation);
</script>

<section class="mk-acc" id="houses">
	<div class="acc-text">
		<p class="mk-eyebrow reveal-text" lang="en" use:reveal>{copy.eyebrow}</p>
		<h2 class="mk-h acc-heading reveal-text" style:--i={1} use:reveal>{copy.heading}</h2>
		<p class="mk-body acc-body reveal-text" style:--i={2} use:reveal>
			{i18n.t.home.intro.body}
		</p>
	</div>

	<a class="mk-btn acc-btn" href="/houses" lang="en">{i18n.t.home.properties.viewDetails}</a>

	<div class="acc-rail">
		<HouseRail {properties} />
	</div>
</section>

<style>
	.mk-acc {
		/* SP / tablet (<1024): stacked text → button → rail. Not in Figma;
		 * keeps the PC band's order and the shared SP rhythm. */
		--acc-pad-top: 80px;
		--acc-pad-bottom: 80px;
		--acc-heading-gap: 12px;
		--acc-body-gap: 12px;
		--acc-btn-gap: 32px;
		--acc-rail-gap: 40px;
		--acc-measure: 500px; /* Figma body width */
		--acc-stagger: 0.08s;
		/* Keeps the body off the rail on narrow PCs; Figma 220:663 leaves
		 * ≈33px between the body box (598) and the rail (631). */
		--acc-text-gap: 33px;

		display: grid;
		grid-template-columns: minmax(0, 1fr);
		grid-template-areas:
			'text'
			'btn'
			'rail';
		padding: var(--acc-pad-top) var(--mk-inset) var(--acc-pad-bottom);
		background: var(--mk-band);
		color: var(--mk-rust);
	}

	.acc-text {
		grid-area: text;
	}

	.acc-text .reveal-text {
		--reveal-d: calc(var(--i, 0) * var(--acc-stagger));
	}

	.acc-heading {
		margin-top: var(--acc-heading-gap);
	}

	.acc-body {
		margin-top: var(--acc-body-gap);
		max-width: var(--acc-measure);
	}

	.acc-btn {
		grid-area: btn;
		/* A grid item would otherwise stretch across the whole column. */
		justify-self: start;
		margin-top: var(--acc-btn-gap);
	}

	.acc-rail {
		grid-area: rail;
		/* Never let the rail's card row widen its track. */
		min-width: 0;
		margin-top: var(--acc-rail-gap);
	}

	/* PC (≥1024) — Figma 220:663. Rail starts at the 3/7 column line (x 631
	 * at 1440) level with the eyebrow (y 1202); the rail column (card 290 +
	 * caption 26.4) sets the band height: 120 + 316.4 + 77.6 = 514, which
	 * lands DISCOVER on y 1458 by normal flow. */
	@media (min-width: 1024px) {
		.mk-acc {
			--acc-pad-top: 120px;
			--acc-pad-bottom: 77.6px;
			--acc-heading-gap: 19.6px;
			--acc-body-gap: 19.8px;
			--acc-btn-gap: 48.6px;
			--acc-rail-gap: 0px;

			grid-template-columns: calc(100% * 3 / 7) minmax(0, 1fr);
			grid-template-rows: auto 1fr;
			grid-template-areas:
				'text rail'
				'btn rail';
			align-items: start;
		}

		.acc-text {
			margin-right: var(--acc-text-gap);
		}
	}
</style>
