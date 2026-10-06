<script lang="ts">
	// Top hero (Figma 218:604 → 218:637): the rust ground, the photo and the
	// PC legal line — nothing else. The big MOKUSEKI lockup over it belongs to
	// the header (SiteHeader), so OP → resting → compact is one continuous
	// element; both components follow the same <html> OP attributes, set by
	// runOpening (src/lib/home/opening.ts), and never import each other.
	import { onMount } from 'svelte';
	import LegalLine from '$lib/components/LegalLine.svelte';
	import { useI18n } from '$lib/i18n/store.svelte';
	import { runOpening } from '$lib/home/opening';

	// Figma image 58 (828×549 — the only size in the file; see spec §10 Q1).
	const HERO_SRC = '/images/top_hero.webp';
	const HERO_W = 828;
	const HERO_H = 549;

	const i18n = useI18n();
	let photo = $state<HTMLImageElement>();

	onMount(() => (photo ? runOpening(photo) : undefined));
</script>

<svelte:head>
	<!-- The photo is the LCP; start it before the CSS/JS that reveals it. -->
	<link rel="preload" as="image" href={HERO_SRC} fetchpriority="high" />
</svelte:head>

<section class="mk-hero" data-header="dark">
	<h1 class="sr-only">MOKUSEKI — {i18n.t.footer.tagline}</h1>

	<div class="mk-hero-photo">
		<img
			bind:this={photo}
			src={HERO_SRC}
			width={HERO_W}
			height={HERO_H}
			alt=""
			decoding="async"
			fetchpriority="high"
		/>
	</div>

	<!-- PC only: a Figma-literal duplicate of the footer's legal links, so it
	     is decorative (hidden from assistive tech, out of the Tab order). -->
	<div class="mk-hero-legal">
		<LegalLine variant="hero" decorative />
	</div>
</section>

<style>
	.mk-hero {
		/* Figma 218:637: the photo is 1037 tall in the 900 frame, bottom-
		 * anchored (its top 137px sit above the viewport). */
		--photo-h: calc(100% * 1037 / 900);
		/* SP/tablet: the crop the diagonal lockup is placed on (spec §4.6). */
		--photo-pos-sp: 72% 50%;
		/* Figma 218:604: legal line top 873 of 900, 9px × 1.2 tall. */
		--legal-bottom: 16.2px;
		--hero-min-h: 560px;
		/* Spec §4.3 / §4.4 */
		--op-photo-zoom: 1.08;
		--op-fs-delay: 3s;
		--op-fs-dur: 0.6s;

		position: relative;
		height: 100svh;
		min-height: var(--hero-min-h);
		/* Rust, not the photo's #FCF6F4: it is OP1 exactly, and keeps the blush
		 * lockup legible while the photo decodes. */
		background: var(--mk-rust);
		overflow: clip;
		isolation: isolate;
	}

	/* No parallax: Figma moves the photo 1:1 with the page (−137 at rest →
	 * −863 at scrollY 726). The OP's fade and zoom run on this wrapper. */
	.mk-hero-photo {
		position: absolute;
		inset: auto 0 0 0;
		height: 100%;
	}

	.mk-hero-photo img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: var(--photo-pos-sp);
	}

	.mk-hero-legal {
		display: none;
		/* LegalLine reads its colour from here. */
		--legal-fg: var(--mk-legal-photo);
	}

	@media (min-width: 1024px) {
		.mk-hero-photo {
			height: var(--photo-h);
		}

		.mk-hero-photo img {
			object-position: 50% 50%;
		}

		/* LegalLine pads itself by --mk-chrome-l on PC, so the box runs from
		 * the viewport's left edge. */
		.mk-hero-legal {
			display: block;
			position: absolute;
			left: 0;
			right: 0;
			bottom: calc(var(--legal-bottom) + env(safe-area-inset-bottom, 0px));
		}
	}

	/* ─── Opening (html[data-op='play'], phases from opening.ts) ─────────── */

	/* Fast-forward: every OP duration becomes --op-fast, with no delays. */
	:global(html.op-fast) .mk-hero {
		--op-photo-fade: var(--op-fast);
		--op-photo-scale: var(--op-fast);
		--op-color: var(--op-fast);
		--op-chrome-in: var(--op-fast);
		--op-chrome-delay: 0s;
	}

	/* Until "image": plain rust (218:604) — the photo waits, slightly zoomed. */
	:global(html[data-op='play']:not([data-op-phase='image']):not([data-op-phase='done']))
		.mk-hero-photo {
		opacity: 0;
		transform: scale(var(--op-photo-zoom));
	}

	:global(html[data-op='play']) .mk-hero-photo {
		transition:
			opacity var(--op-photo-fade) var(--mk-ease-op-in),
			transform var(--op-photo-scale) var(--mk-ease-op-scale);
	}

	/* The legal line arrives with the menu icon, black at 30% on the rust,
	 * then turns brown at 30% as the photo comes in. */
	:global(html[data-op='play']:not([data-op-phase])) .mk-hero-legal {
		opacity: 0;
	}

	:global(html[data-op='play']:not([data-op-phase='image']):not([data-op-phase='done']))
		.mk-hero-legal {
		--legal-fg: var(--mk-legal-op);
	}

	:global(html[data-op='play']) .mk-hero-legal {
		transition: opacity var(--op-chrome-in) var(--mk-ease-op-in) var(--op-chrome-delay);
	}

	/* --legal-fg itself can't interpolate (an unregistered custom property),
	 * so the transition sits on the element whose `color` reads it. */
	:global(html[data-op='play']) .mk-hero-legal :global(.mk-legal) {
		transition: color var(--op-color) var(--mk-ease-inout);
	}

	/* Failsafe: if the app never hydrates, the server-rendered OP start state
	 * must not stay a blank rust screen. Hydration removes it (.is-hydrated),
	 * and by then opening.ts has either started the OP or settled it. */
	:global(html[data-op='play']:not([data-op-phase]):not(.is-hydrated)) .mk-hero-photo {
		animation: mk-op-fs-show var(--op-fs-dur) ease var(--op-fs-delay) forwards;
	}

	:global(html[data-op='play']:not([data-op-phase]):not(.is-hydrated)) .mk-hero-legal {
		animation:
			mk-op-fs-show var(--op-fs-dur) ease var(--op-fs-delay) forwards,
			mk-op-fs-legal var(--op-fs-dur) ease var(--op-fs-delay) forwards;
	}

	@keyframes mk-op-fs-show {
		to {
			opacity: 1;
			filter: none;
			transform: none;
		}
	}

	@keyframes mk-op-fs-legal {
		to {
			--legal-fg: var(--mk-legal-photo);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.mk-hero-photo,
		.mk-hero-legal,
		.mk-hero-legal :global(.mk-legal) {
			transition: none !important;
		}
	}
</style>
