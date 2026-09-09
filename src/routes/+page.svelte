<script lang="ts">
	import { useI18n } from '$lib/i18n/store.svelte';
	import { messages } from '$lib/i18n/messages';
	import SEO from '$lib/components/SEO.svelte';
	import { RESERVE_URL } from '$lib/site';
	import { reveal } from '$lib/actions/reveal';
	import { HERO_IMAGE_START_EVENT } from '$lib/heroEvents';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const i18n = useI18n();
	const en = messages.en.home;

	// ─── Hero OP effect (studied from omaivillas.com) ──────
	// Words settle in from the left over the page's plain background while
	// still --ink-dark; the instant the hero photo starts revealing behind
	// them, they flip to white in step with it. HERO_IMAGE_START_EVENT lets
	// +layout.svelte's header sync its own entrance to that exact moment
	// without any direct coupling between the two components.
	const heroWordsEn = `${en.hero.ledeLine1} ${en.hero.ledeLine2}`.split(' ');
	const heroCharsJa = $derived(
		`${i18n.t.home.hero.ledeLine1}${i18n.t.home.hero.ledeLine2}`.split('')
	);

	let heroTitleEl = $state<HTMLElement | null>(null);
	let heroJaEl = $state<HTMLElement | null>(null);
	let heroMediaEl = $state<HTMLElement | null>(null);
	let heroScrollEl = $state<HTMLElement | null>(null);

	onMount(() => {
		if (!browser || !heroTitleEl || !heroMediaEl) return;
		const announceImageStart = () =>
			document.dispatchEvent(new CustomEvent(HERO_IMAGE_START_EVENT));

		const words = Array.from(heroTitleEl.querySelectorAll('.hero-word'));
		const jaChars = heroJaEl ? Array.from(heroJaEl.querySelectorAll('.hero-char')) : [];
		const allWords = [...words, ...jaChars];
		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		// No motion (reduced-motion, or nothing to stagger) — skip straight to
		// the header/scroll-hint sync signal so the rest of the page never
		// waits on an animation that isn't going to run.
		if (reduceMotion || !allWords.length) {
			announceImageStart();
			return;
		}

		let cancelled = false;
		import('gsap').then(({ gsap }) => {
			if (cancelled) return;

			gsap.set(heroMediaEl, { autoAlpha: 0, scale: 1.05 });
			gsap.set(allWords, { autoAlpha: 0, x: -20, color: 'var(--ink)' });
			if (heroScrollEl) gsap.set(heroScrollEl, { autoAlpha: 0 });

			const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
			// Phase 1 — words cascade in, left → right, still dark-on-page.
			tl.to(allWords, { x: 0, autoAlpha: 1, duration: 1, stagger: 0.05 });
			// Phase 2 — the photo reveals; words flip to white in the same
			// instant ("<"), so the color change reads as landing together
			// with the image rather than as a separate step.
			tl.to(heroMediaEl, {
				autoAlpha: 1,
				scale: 1,
				duration: 1.8,
				ease: 'power3.out',
				onStart: announceImageStart
			});
			// EN flips to full white; JA keeps its established 82%-white (a
			// touch dimmer, matching the existing display/translation
			// hierarchy) — same instant, same easing, separate targets.
			tl.to(
				words,
				{ color: 'var(--white)', duration: 0.8, stagger: 0.05, ease: 'power1.out' },
				'<'
			);
			if (jaChars.length) {
				tl.to(
					jaChars,
					{
						color: 'rgba(255, 255, 255, 0.82)',
						duration: 0.8,
						stagger: 0.03,
						ease: 'power1.out'
					},
					'<'
				);
			}
			if (heroScrollEl) {
				tl.to(heroScrollEl, { autoAlpha: 1, duration: 0.8, ease: 'power1.out' }, '<');
			}
		});

		return () => {
			cancelled = true;
		};
	});

	// Cool neutral fallback tones shown behind the gallery photography.
	const galleryTones = ['#e4e4e4', '#d4d4d4', '#bdbdbd', '#c8c8c8', '#ececec', '#dadada'];

	// Mood photography for the gallery grid (cycled across the six cells).
	const galleryImages = [
		'/images/mood_00.webp',
		'/images/mood_01.webp',
		'/images/mood_02.webp',
		'/images/mood_03.webp'
	];

	// Houses card top-row (SP overlay): "愛知県名古屋市" → "名古屋",
	// "岐阜県" → "岐阜" — city if there is one, else the prefecture name
	// with its administrative suffix dropped.
	function shortArea(location: string): string {
		const city = location.replace(/^.*?[都道府県]/, '').replace(/[市区町村]$/, '');
		return city || location.replace(/[都道府県]$/, '');
	}
</script>

<SEO
	title={i18n.t.meta.home.title}
	description={i18n.t.meta.home.description}
	jsonLd={{
		'@type': 'LodgingBusiness',
		name: 'MOKUSEKI',
		description: i18n.t.meta.home.description,
		address: { '@type': 'PostalAddress', addressRegion: 'Aichi', addressCountry: 'JP' }
	}}
/>

<!-- ─── 01 Hero ─────────────────────────────────────── -->
<section class="hero">
	<div class="hero-media" aria-hidden="true" bind:this={heroMediaEl}></div>
	<div class="hero-inner">
		<h1 class="h1" bind:this={heroTitleEl}>
			{#each heroWordsEn as word, i (i)}{#if i > 0}{' '}{/if}<span class="hero-word">{word}</span
				>{/each}
		</h1>
		{#if i18n.locale === 'ja'}
			<p class="h-ja" bind:this={heroJaEl}>
				{#each heroCharsJa as ch, i (i)}<span class="hero-char">{ch}</span>{/each}
			</p>
		{/if}
		<p class="meta hero-scroll" bind:this={heroScrollEl} aria-hidden="true">
			{i18n.t.home.hero.scrollHint}
		</p>
	</div>
</section>

<!-- ─── 02 Concept (Philosophy) ─────────────────────── -->
<section class="section philosophy" id="concept">
	<p class="eyebrow reveal-text" use:reveal>{en.philosophy.eyebrow}</p>
	<h2 class="h1 philo-heading reveal-text" use:reveal>
		{#each en.philosophy.heading.split('\n') as line, i (i)}
			{#if i > 0}<br />{/if}{line}
		{/each}
	</h2>
	{#if i18n.locale === 'ja'}
		<p class="h-ja philo-heading-ja reveal-text" use:reveal>
			{#each i18n.t.home.philosophy.heading.split('\n') as line, i (i)}
				{#if i > 0}<br />{/if}{line}
			{/each}
		</p>
	{/if}
	<div class="philo-body reveal-text" use:reveal>
		{#each i18n.t.home.philosophy.body.split('\n\n') as para (para)}
			<p class="body">{para}</p>
		{/each}
	</div>
	<p class="meta philo-sig reveal-text" use:reveal>— {i18n.t.home.philosophy.signature}</p>
</section>

<!-- ─── 03 Properties (Houses) ──────────────────────── -->
<!-- Bold pass: a wall of large photography (2-up grid), not an alternating
     photo+paragraph list — the whole card is the link, caption is a single
     name/location line, matching the density of the reference's villa
     cards. The longer atmospheric description still lives on each
     property's own detail page; nothing is lost, just deferred. -->
<section class="section properties" id="houses">
	<ul class="hg-list">
		{#each data.properties as p, i (p.id)}
			<li class="hg-card card-hover">
				<a class="hg-thumb" href={`/properties/${p.slug}`} aria-label={p.name.en}>
					<span
						class="hg-thumb-img card-hover-zoom reveal-img"
						use:reveal
						style:background-image={`url(${p.images[0]})`}
					></span>
				</a>
				<div class="hg-caption reveal-text" use:reveal>
					<h3 class="h2">{p.name.en}</h3>
					<p class="meta hg-meta">
						{#if i18n.locale === 'ja'}
							{shortArea(p.location.ja)} · {p.name.ja}
						{:else}
							{p.location.en}
						{/if}
					</p>
				</div>
			</li>
		{/each}
	</ul>
</section>

<!-- ─── 04 Area ────────────────────────────────────── -->
<!-- Bold pass: a full-bleed cinematic photo carries the section (like the
     hero), with the copy overlaid bottom-left instead of sitting in a
     centered text header above a small thumbnail. The historical/
     neighborhood copy (area.items) still follows below, just in a
     tighter, quieter list — the photo is the statement now. -->
<section class="area" id="area">
	<div class="area-hero reveal-img" use:reveal style:background-image="url(/images/mood_02.webp)">
		<div class="area-hero-overlay">
			<p class="eyebrow reveal-text" use:reveal>{en.area.eyebrow}</p>
			<h2 class="h1 reveal-text" use:reveal>{en.area.heading}</h2>
			{#if i18n.locale === 'ja'}
				<p class="h-ja reveal-text" use:reveal>{i18n.t.home.area.heading}</p>
			{/if}
			{#if i18n.t.home.area.sub}
				<p class="body-sm area-hero-sub reveal-text" use:reveal>
					{#each i18n.t.home.area.sub.split('\n') as line, i (i)}
						{#if i > 0}<br />{/if}{line}
					{/each}
				</p>
			{/if}
		</div>
	</div>

	<div class="section area-content">
		<ul class="exp-list">
			{#each i18n.t.home.area.items as item (item.index)}
				<li class="exp-row reveal-text" use:reveal>
					<span class="exp-index">{item.index}</span>
					<div class="exp-body">
						<h3 class="h2">{item.title}</h3>
						<p class="body-sm">
							{#each item.description.split('\n') as line, i (i)}
								{#if i > 0}<br />{/if}{line}
							{/each}
						</p>
					</div>
				</li>
			{/each}
		</ul>

		<!-- Placeholder — centered on Nagoya Castle as a stand-in landmark
		     until each house's real address is finalized. No API key needed
		     (the plain /maps?...&output=embed form), but it does load an
		     iframe from google.com — fine given no CSP restricts frame-src. -->
		<div class="area-map reveal-img" use:reveal>
			<iframe
				title="MOKUSEKI — Nagoya area map"
				src="https://www.google.com/maps?q=%E5%90%8D%E5%8F%A4%E5%B1%8B%E5%9F%8E&output=embed"
				loading="lazy"
				referrerpolicy="no-referrer-when-downgrade"
			></iframe>
		</div>
	</div>
</section>

<!-- ─── 05 Gallery ─────────────────────────────────── -->
<section class="section gallery" id="gallery">
	<header class="sec-head">
		<p class="eyebrow reveal-text" use:reveal>{en.gallery.eyebrow}</p>
		<h2 class="h1 reveal-text" use:reveal>{en.gallery.heading}</h2>
		{#if i18n.locale === 'ja'}
			<p class="h-ja reveal-text" use:reveal>{i18n.t.home.gallery.heading}</p>
		{/if}
	</header>

	<div class="gal-grid">
		{#each galleryTones as tone, i (i)}
			<div
				class="gal-cell gal-cell-{i + 1} reveal-img"
				use:reveal
				style:background-color={tone}
				style:background-image={`url(${galleryImages[i % galleryImages.length]})`}
				aria-hidden="true"
			></div>
		{/each}
	</div>
</section>

<!-- ─── 06 Reserve CTA ─────────────────────────────── -->
<!-- Bold pass: full-bleed dark (--ink), flowing straight into SiteFooter
     (already dark/.inverse) so the two read as one continuous block —
     the tonal drop the reference uses to close a light, airy page. -->
<section class="cta-dark inverse">
	<div class="cta-dark-inner">
		<p class="eyebrow reveal-text" use:reveal>{en.reserveCta.eyebrow}</p>
		<h2 class="h1 cta-heading reveal-text" use:reveal>{en.reserveCta.heading}</h2>
		{#if i18n.locale === 'ja'}
			<p class="h-ja cta-heading-ja reveal-text" use:reveal>{i18n.t.home.reserveCta.heading}</p>
		{/if}
		<p class="body-sm cta-sub reveal-text" use:reveal>
			{#each i18n.t.home.reserveCta.sub.split('\n') as line, i (i)}
				{#if i > 0}<br />{/if}{line}
			{/each}
		</p>
		<a class="btn" href={RESERVE_URL} target="_blank" rel="noopener">
			<span>{en.reserveCta.cta}</span>
			<span class="arrow" aria-hidden="true">→</span>
		</a>
	</div>
</section>

<style>
	/* ─── Shared section layout ─────────────────────── */
	.section {
		width: 100%;
		max-width: 1180px;
		margin: 0 auto;
		/* Top trimmed ~40px vs. bottom — representative's direction, the
		 * gap above Houses/Experience/Gallery/Reservation read as too
		 * much. Concept (.philosophy) keeps the original, larger value
		 * below (untouched — it follows straight after the hero). */
		padding: clamp(0px, 6vh, 80px) 0 clamp(80px, 14vh, 160px);
	}

	.philosophy {
		padding-top: clamp(85px, 14vh, 165px);
	}

	/* No header left in this section (removed) — the first house image
	 * should start right under Concept, not under empty top padding. */
	.properties {
		padding-top: 0;
	}

	.sec-head {
		max-width: 720px;
		/* -10px vs. the content below (was clamp(56px,8vh,96px)). */
		margin: 0 auto clamp(46px, 8vh, 86px);
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 8px;
		align-items: center;
	}

	/* JA sub-heading under a title (Houses/Experience/Gallery) — fixed 16px
	 * at every breakpoint (was following --fs-ja-sm, 16px desktop but 13px
	 * on SP). The hero's own JA line scales with its much larger EN
	 * headline instead — see .hero-inner .h-ja below. */
	.sec-head .h-ja {
		font-size: 16px;
	}

	.sec-sub {
		margin-top: 20px;
	}

	/* ─── 01 Hero — full-bleed, full-height, white text ── */
	.hero {
		/* Break out of main's horizontal padding to span the viewport.
		 * No negative margin-top anymore — the header now always has a
		 * background (no more transparent-over-hero state), so the hero
		 * sits below it like any other page, using .shell's padding-top
		 * reservation instead of cancelling it out. */
		margin-left: calc(-1 * var(--padding));
		margin-right: calc(-1 * var(--padding));
		min-height: 85svh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		position: relative;
		overflow: hidden;
		isolation: isolate;
		padding: clamp(96px, 16vh, 180px) var(--padding) clamp(72px, 12vh, 120px);
	}

	.hero-media {
		position: absolute;
		inset: 0;
		z-index: -1;
		background-image:
			linear-gradient(
				180deg,
				rgba(18, 18, 18, 0.4) 0%,
				rgba(18, 18, 18, 0.12) 38%,
				rgba(18, 18, 18, 0.55) 100%
			),
			url('/images/mood_03.webp');
		background-size: cover;
		background-position: center;
	}

	.hero-inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		text-align: center;
	}

	.hero :global(.h1) {
		color: var(--white);
		/* Bold pass: the hero statement should dominate the frame, not sit
		 * at the same scale as a body-copy section heading. */
		font-size: clamp(40px, 7vw, 92px);
		max-width: 18ch;
	}

	.hero :global(.h-ja) {
		color: rgba(255, 255, 255, 0.82);
		white-space: nowrap;
		/* Scales with the bigger EN headline above it (was a fixed 16px
		 * shared with every other section's sub-heading). */
		font-size: clamp(18px, 2.2vw, 30px);
	}

	/* Per-word/-char spans the OP effect (see onMount above) animates —
	 * inline-block so GSAP's x/color tweens have something to move.
	 * Without JS these are inert and the text just reads normally,
	 * already in its final white-on-photo state (see rules above). */
	.hero :global(.hero-word),
	.hero :global(.hero-char) {
		display: inline-block;
	}

	.hero-scroll {
		margin-top: 4px;
		color: rgba(255, 255, 255, 0.7);
	}

	/* ─── 02 Properties — bold pass: 2-up photo grid ──── */
	.hg-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: clamp(28px, 4vw, 56px) clamp(24px, 4vw, 56px);
	}

	.hg-thumb {
		display: block;
		position: relative;
		aspect-ratio: 4 / 5;
		background-color: var(--bg-soft);
		overflow: hidden;
	}

	/* Fills .hg-thumb; separate from the frame so .card-hover-zoom (base.css)
	 * can scale just the photo on hover without also scaling — and thereby
	 * exposing the edges of — the fixed-size frame clipping it. */
	.hg-thumb-img {
		position: absolute;
		inset: 0;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
	}

	.hg-caption {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 16px;
		margin-top: 20px;
	}

	.hg-meta {
		color: var(--ink-faint);
		text-align: right;
	}

	/* ─── 03 Philosophy ──────────────────────────────── */
	.philosophy {
		/* Widened from 720px so the bolder heading below has room to breathe
		 * without wrapping too tightly. */
		max-width: 860px;
		margin: 0 auto;
		text-align: center;
	}

	.philo-heading,
	.philo-heading-ja {
		/* Tightened 5px closer to the eyebrow above (was 24px). */
		margin-top: 19px;
	}

	.philo-heading {
		/* Bold pass — this is the site's second big statement after the
		 * hero; it read the same size as any other section heading before. */
		font-size: clamp(30px, 4.2vw, 56px);
	}

	.philo-heading-ja {
		font-size: clamp(18px, 2vw, 26px);
	}

	.philo-body {
		display: flex;
		flex-direction: column;
		gap: 24px;
		/* -8px vs. the title above (was clamp(48px,6vh,72px)). */
		margin: clamp(40px, 6vh, 64px) 0 0;
	}

	.philo-sig {
		margin-top: clamp(48px, 6vh, 72px);
	}

	/* ─── 04 Area — bold pass: full-bleed cinematic photo ─── */
	/* Full-bleed like .hero — breaks out of main's padding, no top gap
	 * after Houses (keeps the wall-of-photography momentum going). */
	.area-hero {
		margin-left: calc(-1 * var(--padding));
		margin-right: calc(-1 * var(--padding));
		height: clamp(480px, 80vh, 860px);
		position: relative;
		overflow: hidden;
		isolation: isolate;
		background-color: var(--bg-soft);
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		display: flex;
		align-items: flex-end;
	}

	.area-hero::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		background: linear-gradient(0deg, rgba(18, 18, 18, 0.6) 0%, rgba(18, 18, 18, 0) 45%);
	}

	.area-hero-overlay {
		max-width: 560px;
		padding: 0 var(--padding) clamp(48px, 8vh, 88px);
	}

	.area-hero-overlay :global(.h1),
	.area-hero-overlay :global(.eyebrow) {
		color: var(--white);
	}

	.area-hero-overlay :global(.h-ja) {
		color: rgba(255, 255, 255, 0.82);
	}

	.area-hero-sub {
		margin-top: 20px;
		color: rgba(255, 255, 255, 0.85);
	}

	.area-content {
		padding-top: clamp(56px, 9vh, 104px);
	}

	.exp-list {
		list-style: none;
		padding: 0;
		margin: 0 auto;
		max-width: 860px;
		display: flex;
		flex-direction: column;
	}

	.exp-row {
		display: grid;
		grid-template-columns: 112px 1fr;
		gap: 40px;
		padding: clamp(32px, 4vh, 48px) 0;
		border-top: 1px solid var(--rule);
		align-items: baseline;
	}

	.exp-row:first-child {
		border-top: none;
	}

	.exp-row:last-child {
		border-bottom: 1px solid var(--rule);
	}

	/* exp-index is the only intentionally-large numeral on the page. */
	.exp-index {
		font-family: var(--display);
		font-weight: 400;
		font-size: clamp(24px, 3vw, 34px);
		letter-spacing: 0;
		color: var(--accent);
		line-height: 1;
	}

	.exp-body {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.exp-body :global(.h2) {
		font-size: 18px;
	}

	.area-map {
		margin: clamp(48px, 8vh, 88px) auto 0;
		max-width: 860px;
		aspect-ratio: 16 / 9;
		background: var(--bg-soft);
	}

	.area-map iframe {
		display: block;
		width: 100%;
		height: 100%;
		border: 0;
		/* The free /maps?...&output=embed iframe has no style parameter (that
		 * needs the paid Maps JS API + a styled map ID) — grayscale via CSS
		 * filter instead. */
		filter: grayscale(1);
	}

	/* ─── 05 Gallery ─────────────────────────────────── */
	.gal-grid {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		grid-auto-rows: 10vw;
		gap: 16px;
		max-width: 1200px;
		margin: 0 auto;
	}

	.gal-cell {
		position: relative;
		overflow: hidden;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
	}

	.gal-cell::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, transparent 60%, rgba(26, 26, 26, 0.06));
	}

	.gal-cell-1 {
		grid-column: span 4;
		grid-row: span 3;
	}
	.gal-cell-2 {
		grid-column: span 2;
		grid-row: span 2;
	}
	.gal-cell-3 {
		grid-column: span 2;
		grid-row: span 1;
	}
	.gal-cell-4 {
		grid-column: span 3;
		grid-row: span 2;
	}
	.gal-cell-5 {
		grid-column: span 3;
		grid-row: span 2;
	}
	.gal-cell-6 {
		grid-column: span 6;
		grid-row: span 2;
	}

	/* ─── 06 CTA — bold pass: full-bleed dark, flows into the footer ── */
	.cta-dark {
		margin-left: calc(-1 * var(--padding));
		margin-right: calc(-1 * var(--padding));
		margin-top: clamp(56px, 9vh, 104px);
	}

	.cta-dark-inner {
		max-width: 620px;
		margin: 0 auto;
		padding: clamp(80px, 14vh, 160px) var(--padding) clamp(64px, 10vh, 104px);
		text-align: left;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 8px;
	}

	/* .btn is a dark-filled pill everywhere else on the site; on this
	 * already-dark section it would read as dark-on-dark, invisible.
	 * Scoped invert — .btn itself stays untouched for every other page. */
	.cta-dark :global(.btn) {
		background: var(--bg);
		color: var(--ink);
	}

	.cta-dark :global(.btn:hover) {
		background: var(--white);
	}

	.cta-heading {
		margin-top: 24px;
		font-size: clamp(28px, 3.6vw, 48px);
	}

	.cta-sub {
		margin: 24px 0 clamp(40px, 5vh, 56px);
	}

	/* ─── Responsive ─────────────────────────────────── */
	@media (max-width: 720px) {
		.hg-list {
			grid-template-columns: 1fr;
			gap: 40px;
		}
	}

	@media (max-width: 880px) {
		.gal-grid {
			grid-template-columns: repeat(4, 1fr);
			grid-auto-rows: 14vw;
		}

		.gal-cell-1 {
			grid-column: span 4;
			grid-row: span 2;
		}
		.gal-cell-2,
		.gal-cell-3,
		.gal-cell-4,
		.gal-cell-5 {
			grid-column: span 2;
			grid-row: span 2;
		}
		.gal-cell-6 {
			grid-column: span 4;
			grid-row: span 2;
		}
	}

	@media (max-width: 540px) {
		.hg-caption {
			margin-top: 12px;
		}

		.exp-row {
			grid-template-columns: 64px 1fr;
			gap: 24px;
		}

		.gal-grid {
			grid-template-columns: repeat(2, 1fr);
			grid-auto-rows: 32vw;
			gap: 12px;
		}

		.gal-cell-1,
		.gal-cell-2,
		.gal-cell-3,
		.gal-cell-4,
		.gal-cell-5,
		.gal-cell-6 {
			grid-column: span 2;
			grid-row: span 1;
		}

		.gal-cell-1 {
			grid-row: span 2;
		}
	}
</style>
