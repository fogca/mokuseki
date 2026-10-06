<script lang="ts">
	// The accommodation band's house rail (2026-10 Top redesign, Figma
	// 220:663: the 468×290 cards at x 631 / 1105, the second running off the
	// right edge). No arrows — the cut-off card is the affordance; touch
	// scrolls natively with snap, a mouse drags via use:dragScroll.
	//
	// Assumes its parent box is padded by --mk-inset (every Top section is):
	// the rail bleeds back out to the viewport edge with matching negative
	// margins and re-pads its scroll content by the same amount.
	import { useI18n } from '$lib/i18n/store.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { dragScroll } from '$lib/actions/dragScroll';
	import type { Property } from '$lib/types/domain';

	let { properties }: { properties: Property[] } = $props();

	const i18n = useI18n();

	// Caption index: "01", "02", …
	const INDEX_DIGITS = 2;
	const indexOf = (i: number) => String(i + 1).padStart(INDEX_DIGITS, '0');
</script>

<!-- role="list": WebKit drops list semantics (and with them this label)
     from a list-style: none list unless the role is restated. -->
<ul class="rail" role="list" aria-label={i18n.t.footer.nav.houses} use:dragScroll>
	{#each properties as p, i (p.id)}
		<li class="card" style:--i={i}>
			<a class="card-link card-hover" href={`/properties/${p.slug}`}>
				<span class="thumb">
					<img
						class="reveal-img card-hover-zoom"
						src={p.images[0]}
						alt=""
						loading="lazy"
						decoding="async"
						use:reveal
					/>
				</span>
				<span class="caption">
					<!-- The space between the spans is for the link's accessible
					     name ("01 Nagoya Castle"); a flex container doesn't render it. -->
					<span class="mk-eyebrow cap-name" lang="en"
						><span>{indexOf(i)}</span> <span>{p.name.en}</span></span
					>
					{#if i18n.locale === 'ja'}
						<span class="mk-ja-label">{p.name.ja}</span>
					{:else}
						<span class="mk-eyebrow" lang="en">{p.location.en}</span>
					{/if}
				</span>
			</a>
		</li>
	{/each}
</ul>

<style>
	.rail {
		/* SP / tablet (<1024): full-bleed both sides, cards snap to the
		 * inset. Figma has no SP frame — 300×186 cards peek the next one by
		 * 64px at 390. */
		--rail-cap-gap: 10px;
		--rail-name-gap: 1em; /* index ↔ name inside the EN caption */
		--rail-label-gap: 2em; /* EN caption ↔ Japanese name / location */
		--rail-stagger: 0.08s;
		/* Room for the 1px + 3px-offset focus ring (base.css :focus-visible),
		 * which the scroller would otherwise clip above and below the card.
		 * Padded in, margined back out, so the geometry doesn't move. */
		--rail-focus-room: 4px;

		display: flex;
		gap: var(--mk-gap);
		overflow-x: auto;
		overscroll-behavior-x: contain;
		scrollbar-width: none;
		scroll-snap-type: x mandatory;
		scroll-padding-inline: var(--mk-inset);
		margin-inline: calc(-1 * var(--mk-inset));
		margin-block: calc(-1 * var(--rail-focus-room));
		padding-inline: var(--mk-inset);
		padding-block: var(--rail-focus-room);
	}

	.rail::-webkit-scrollbar {
		display: none;
	}

	/* While dragging, the links' own pointer cursor would mask the rail's
	 * grabbing one (.is-dragging is toggled by dragScroll, hence :global). */
	.rail:global(.is-dragging) .card-link {
		cursor: inherit;
	}

	.card {
		flex: 0 0 var(--mk-card-w);
		scroll-snap-align: start;
	}

	.card-link {
		display: block;
	}

	.thumb {
		display: block;
		aspect-ratio: var(--mk-card-ratio);
		overflow: hidden;
		background: var(--mk-blush);
	}

	.thumb img {
		--reveal-d: calc(var(--i, 0) * var(--rail-stagger));
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* Box tops, not baselines: Ango's and the Japanese face's ascents differ,
	 * so baseline alignment would grow the caption past 14.4 (12 × 1.2) and
	 * the PC band past Figma's 514. Left-packed, not space-between: a label
	 * pushed to the card's right edge would sit 6px from the next card's
	 * caption and read as one line with it. */
	.caption {
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
		column-gap: var(--rail-label-gap);
		margin-top: var(--rail-cap-gap);
	}

	.cap-name {
		display: flex;
		column-gap: var(--rail-name-gap);
	}

	/* PC (≥1024) — Figma 220:663: the rail starts at the 3/7 column line
	 * and bleeds off the right edge only; cards snap flush to its left.
	 * The left side keeps the same focus room as top and bottom (padded in,
	 * margined back out, and matched by the scroll padding), so the first
	 * card still sits on the column line (x 631.1 at 1440) and its focus
	 * ring is not clipped by the scroller. */
	@media (min-width: 1024px) {
		.rail {
			--rail-cap-gap: 12px; /* card 290 + 12 + 14.4 caption → band 514 */
			scroll-snap-type: x proximity;
			scroll-padding-inline: var(--rail-focus-room) 0;
			margin-inline: calc(-1 * var(--rail-focus-room)) calc(-1 * var(--mk-inset));
			padding-inline: var(--rail-focus-room) var(--mk-inset);
		}
	}
</style>
