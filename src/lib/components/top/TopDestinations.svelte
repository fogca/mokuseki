<script lang="ts">
	// Destinations (2026-10 Top redesign). A sticky slide stack on the
	// omaivillas.com Destinations model (scroll maths in stickySlides.ts):
	// the rust title card of Figma 220:663 is the first, solid slide, then one
	// full-bleed photo per Nagoya area with its text at the bottom right.
	// Backgrounds and texts are two separate stacks so every text sits above
	// every background, whichever is fading.
	import { onMount } from 'svelte';
	import { useI18n } from '$lib/i18n/store.svelte';
	import Lines from '$lib/components/Lines.svelte';
	import { activeSlide, slideText, stageProgress } from '$lib/home/stickySlides';

	const i18n = useI18n();
	const copy = $derived(i18n.t.home.destinations);
	const items = $derived(i18n.t.home.area.items);
	const isJa = $derived(i18n.locale === 'ja');

	// PLACEHOLDERS until the per-area photos arrive — one per area item, in
	// order (名古屋城 / 亀島 / 大須・栄). Swap the paths only.
	const AREA_PHOTOS = ['/images/mood_00.webp', '/images/mood_01.webp', '/images/mood_03.webp'];

	let section: HTMLElement;
	let stage: HTMLElement;
	let progress = $state(0);
	let still = $state(false); // prefers-reduced-motion

	// The title card + one slide per area.
	const count = $derived(items.length + 1);
	const active = $derived(activeSlide(progress, count));

	// Reduced motion: no scrub and no drift — the active slide's text simply
	// shows, crossfading with its background.
	function textVars(index: number) {
		if (still) return { opacity: index === active ? 1 : 0, y: 0 };
		return slideText(progress, index, count);
	}
	const titleText = $derived(textVars(0));

	// The descriptions carry the old list layout's manual '\n' breaks; the
	// slide block flows freely, so drop them. Japanese joins with no space,
	// English with one.
	function flow(text: string): string {
		return text.split('\n').join(isJa ? '' : ' ');
	}

	onMount(() => {
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
		let raf = 0;
		const update = () => {
			raf = 0;
			still = reduce.matches;
			progress = stageProgress(section, stage);
		};
		const queue = () => {
			if (!raf) raf = requestAnimationFrame(update);
		};
		update();
		window.addEventListener('scroll', queue, { passive: true });
		window.addEventListener('resize', queue);
		reduce.addEventListener('change', queue);
		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener('scroll', queue);
			window.removeEventListener('resize', queue);
			reduce.removeEventListener('change', queue);
		};
	});
</script>

<section
	class="mk-dest"
	data-header="dark"
	style:--dest-count={count}
	bind:this={section}
	aria-labelledby="dest-heading"
>
	<!-- The menu's /#area target. Not the section top: there the title is
	     still faded out — this lands mid-way through the title's share. -->
	<span class="dest-anchor" id="area" aria-hidden="true"></span>

	<div class="stage" bind:this={stage}>
		<div class="bgs">
			<div class="bg bg--solid" class:is-active={active === 0}></div>
			{#each items as item, i (item.index)}
				<div class="bg bg--photo" class:is-active={active === i + 1}>
					<img src={AREA_PHOTOS[i]} alt="" loading="lazy" decoding="async" />
				</div>
			{/each}
		</div>

		<div class="texts">
			<div class="text text--title" style:--o={titleText.opacity} style:--y="{titleText.y}px">
				<!-- A single grid item: place-items then centres eyebrow + heading
				     as one block. -->
				<div class="title-in">
					<p class="mk-eyebrow" lang="en">{copy.eyebrow}</p>
					{#if isJa}
						<!-- Figma's two lines (.mk-lines--always keeps them at every width). -->
						<h2 class="mk-h mk-lines mk-lines--always dest-heading" id="dest-heading">
							{#each copy.heading as line, i (i)}
								<span class="mk-line">{line}</span>
							{/each}
						</h2>
					{:else}
						<!-- English is one balanced block, never force-broken. -->
						<h2 class="mk-h dest-heading" id="dest-heading"><Lines text={copy.heading} /></h2>
					{/if}
				</div>
			</div>

			{#each items as item, i (item.index)}
				{@const t = textVars(i + 1)}
				<div class="text text--area" style:--o={t.opacity} style:--y="{t.y}px">
					<div class="area-in">
						<p class="mk-eyebrow" lang="en">{item.index}</p>
						<h3 class="mk-h area-name">{item.title}</h3>
						<p class="mk-body area-desc">{flow(item.description)}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.mk-dest {
		/* Scroll distance each slide holds the pinned stage (Omai: 350vh over
		 * 3 slides ≈ 117vh; a little shorter here for 4). */
		--dest-step: 110vh;
		--dest-viewport-h: 100vh; /* 100svh where supported (see @supports below) */
		/* Background crossfade — Omai's GSAP tween: 0.3s, power1.out. */
		--dest-fade: 0.3s;
		--dest-fade-ease: cubic-bezier(0.25, 0.46, 0.45, 0.94);
		/* Omai eases each scrubbed text update over 0.1s; same here, so wheel
		 * steps don't read as jumps. */
		--dest-text-lag: 0.1s;
		/* Where /#area lands: mid-way through the title's share. */
		--dest-anchor-share: 0.6;
		/* Figma 220:663 — title card. The block is centred in the card and
		 * lifted 44.6px, which puts the eyebrow at 354 and the heading at 399
		 * of a 900-tall card. */
		--dest-lift: 44.6px;
		--dest-head-gap: 30.6px; /* eyebrow bottom → heading top */
		/* Area text block (Omai: bottom right, a third wide, ~80px up). */
		--dest-area-w: 400px;
		--dest-area-bottom: 80px;
		--dest-name-gap: 16px;
		--dest-desc-gap: 12px;
		/* Bottom shade under the area text (see .bg--photo::after). */
		--dest-shade-max: 60%;
		--dest-shade-mid: 40%;
		--dest-shade-mid-at: 30%;
		--dest-shade-end: 60%;

		position: relative;
		height: calc(var(--dest-viewport-h) + var(--dest-count) * var(--dest-step));
		background: var(--mk-rust);
		color: var(--mk-cream);
	}

	/* A declaration containing var() is never dropped at parse time, so a
	 * plain "vh line, then svh line" fallback would not work here: an
	 * unsupported svh would make the height compute to its initial value.
	 * The viewport unit is therefore chosen with @supports instead. */
	@supports (height: 100svh) {
		.mk-dest {
			--dest-viewport-h: 100svh;
		}
	}

	.dest-anchor {
		position: absolute;
		top: calc(var(--dest-step) * var(--dest-anchor-share));
		left: 0;
	}

	.stage {
		position: sticky;
		top: 0;
		height: var(--dest-viewport-h);
		overflow: hidden;
	}

	.bgs,
	.texts,
	.bg,
	.text {
		position: absolute;
		inset: 0;
	}

	/* ─── Backgrounds ────────────────────────────────── */
	/* Each layer sits on rust, so a crossfade's midpoint (and a photo that
	 * hasn't loaded yet) never shows anything but the section's own ground. */
	.bg {
		background: var(--mk-rust);
		opacity: 0;
		transition: opacity var(--dest-fade) var(--dest-fade-ease);
	}

	.bg.is-active {
		opacity: 1;
	}

	.bg--photo img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* Omai's flat 20% scrim, in the brown of this palette, plus a shade
	 * rising from the bottom behind the text block: the flat scrim alone
	 * leaves cream body text at ~2.2:1 on a pale wall or tatami. */
	.bg--photo::after {
		content: '';
		position: absolute;
		inset: 0;
		background:
			linear-gradient(
				to top,
				color-mix(in srgb, var(--mk-brown) var(--dest-shade-max), transparent) 0%,
				color-mix(in srgb, var(--mk-brown) var(--dest-shade-mid), transparent)
					var(--dest-shade-mid-at),
				transparent var(--dest-shade-end)
			),
			var(--mk-photo-scrim);
	}

	/* ─── Texts ──────────────────────────────────────── */
	.texts {
		pointer-events: none;
	}

	.text {
		opacity: var(--o, 0);
		transform: translateY(var(--y, 0px));
		transition:
			opacity var(--dest-text-lag) linear,
			transform var(--dest-text-lag) linear;
	}

	.text--title {
		display: grid;
		place-items: center;
		padding: 0 var(--mk-inset) var(--dest-lift);
		text-align: center;
	}

	.dest-heading {
		margin-top: var(--dest-head-gap);
	}

	.text--area {
		display: flex;
		justify-content: flex-end;
		align-items: flex-end;
		padding: 0 var(--mk-inset) var(--dest-area-bottom);
	}

	.area-in {
		width: min(100%, var(--dest-area-w));
	}

	.area-name {
		margin-top: var(--dest-name-gap);
	}

	.area-desc {
		margin-top: var(--dest-desc-gap);
	}

	/* ─── Reduced motion ─────────────────────────────── */
	/* Texts switch with their backgrounds (textVars), on the same fade. */
	@media (prefers-reduced-motion: reduce) {
		.text {
			transition: opacity var(--dest-fade) var(--dest-fade-ease);
		}
	}

	/* ─── No JS: the slides as plain stacked panels ──── */
	:global(html:not(.js)) .mk-dest {
		height: auto;
	}

	:global(html:not(.js)) .stage {
		position: relative;
		height: auto;
		overflow: visible;
	}

	:global(html:not(.js)) .bgs {
		display: none;
	}

	:global(html:not(.js)) .texts {
		position: static;
	}

	:global(html:not(.js)) .text {
		position: relative;
		min-height: var(--dest-viewport-h);
		opacity: 1;
		transform: none;
	}

	/* JS but never hydrated: show the title after the reveal failsafe's 4s
	 * (base.css keyframes) rather than an empty rust screen. */
	:global(html.js:not(.is-hydrated)) .text--title {
		animation: mk-reveal-failsafe 0s 4s forwards;
	}

	/* ─── SP (≤767) ──────────────────────────────────── */
	@media (max-width: 767.98px) {
		.mk-dest {
			--dest-head-gap: 20px;
			--dest-area-bottom: 56px;
			--dest-name-gap: 12px;
			--dest-desc-gap: 8px;
		}

		/* Full width at the inset, from the left — a right-hand third is too
		 * narrow on a phone. */
		.text--area {
			justify-content: flex-start;
		}

		/* The longer Figma line is 13 × 25.2 = 328px at 24px: it fits from
		 * 375 up, but would be clipped at 320–360. Keep the block lines and
		 * let one wrap (at a phrase) only when it truly can't fit. (0,4,0)
		 * beats base.css's nowrap at (0,3,0). */
		.dest-heading .mk-line {
			white-space: normal;
		}
	}
</style>
