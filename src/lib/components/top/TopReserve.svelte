<script lang="ts">
	// Reservation (2026-10 Top redesign; not in Figma). A band-surface
	// section with one left column, reusing the accommodation band's rhythm.
	// Band rather than rust on purpose: a rust CTA straight into the rust
	// footer turned the page end into one long rust block.
	import { useI18n } from '$lib/i18n/store.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { RESERVE_URL } from '$lib/site';
	import Lines from '$lib/components/Lines.svelte';

	const i18n = useI18n();
	const copy = $derived(i18n.t.home.reserveCta);
</script>

<section class="mk-reserve" id="reserve">
	<div class="reserve-col">
		<p class="mk-eyebrow reveal-text" lang="en" use:reveal>{copy.eyebrow}</p>
		<h2 class="mk-h reserve-heading reveal-text" use:reveal>{copy.heading}</h2>
		<p class="mk-body reserve-sub reveal-text" use:reveal><Lines text={copy.sub} /></p>
		<a class="mk-btn reserve-btn" href={RESERVE_URL} target="_blank" rel="noopener" lang="en"
			>{copy.cta}</a
		>
	</div>
</section>

<style>
	.mk-reserve {
		/* Figma 220:663 accommodation band rhythm (120 / 19.6 / 19.8 / 48.6),
		 * applied to a section the Figma doesn't design. */
		--reserve-pad-top: 120px;
		--reserve-pad-bottom: 97.6px;
		--reserve-head-gap: 19.6px;
		--reserve-sub-gap: 19.8px;
		--reserve-btn-gap: 48.6px;
		--reserve-col-w: calc(100% * 3 / 7); /* the accommodation text column; right side empty */
		--reserve-measure: 500px; /* the accommodation body measure, used below 1024 */
		--reserve-text-stagger: 0.08s;

		padding: var(--reserve-pad-top) var(--mk-inset) var(--reserve-pad-bottom);
		background: var(--mk-band);
		color: var(--mk-rust);
	}

	/* Flex column so the button is a block-level flex item: as an inline
	 * box it would sit on a line box and pick up the parent's strut. */
	.reserve-col {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		max-width: var(--reserve-col-w);
	}

	.reserve-heading {
		--reveal-d: var(--reserve-text-stagger);
		margin-top: var(--reserve-head-gap);
	}

	.reserve-sub {
		--reveal-d: calc(2 * var(--reserve-text-stagger));
		margin-top: var(--reserve-sub-gap);
	}

	/* Static on purpose — the action never waits on a reveal. */
	.reserve-btn {
		margin-top: var(--reserve-btn-gap);
	}

	/* ─── Tablet (768–1023) ──────────────────────────── */
	/* 3/7 of a tablet column (≈295px at 768) is narrower than the Japanese
	 * sub's nowrap second line (336px), so fall back to the accommodation
	 * body measure. */
	@media (max-width: 1023.98px) {
		.mk-reserve {
			--reserve-col-w: var(--reserve-measure);
		}
	}

	/* ─── SP (≤767) ──────────────────────────────────── */
	@media (max-width: 767.98px) {
		.mk-reserve {
			--reserve-pad-top: 80px;
			--reserve-pad-bottom: 80px;
			--reserve-btn-gap: 32px;
		}
	}
</style>
