<script lang="ts">
	import { useI18n } from '$lib/i18n/store.svelte';
	import { messages } from '$lib/i18n/messages';
	import SEO from '$lib/components/SEO.svelte';
	import { RESERVE_URL } from '$lib/site';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const i18n = useI18n();
	const en = messages.en.home;

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
	<div class="hero-media" aria-hidden="true"></div>
	<div class="hero-inner">
		<h1 class="h1">
			{en.hero.ledeLine1}
			{en.hero.ledeLine2}
		</h1>
		{#if i18n.locale === 'ja'}
			<p class="h-ja">
				{i18n.t.home.hero.ledeLine1}{i18n.t.home.hero.ledeLine2}
			</p>
		{/if}
	</div>
</section>

<!-- ─── 02 Concept (Philosophy) ─────────────────────── -->
<section class="section philosophy" id="concept">
	<p class="eyebrow">{en.philosophy.eyebrow}</p>
	<h2 class="h1 philo-heading">
		{#each en.philosophy.heading.split('\n') as line, i (i)}
			{#if i > 0}<br />{/if}{line}
		{/each}
	</h2>
	{#if i18n.locale === 'ja'}
		<p class="h-ja philo-heading-ja">
			{#each i18n.t.home.philosophy.heading.split('\n') as line, i (i)}
				{#if i > 0}<br />{/if}{line}
			{/each}
		</p>
	{/if}
	<div class="philo-body">
		{#each i18n.t.home.philosophy.body.split('\n\n') as para (para)}
			<p class="body">{para}</p>
		{/each}
	</div>
	<p class="meta philo-sig">— {i18n.t.home.philosophy.signature}</p>
</section>

<!-- ─── 03 Properties (Houses) ──────────────────────── -->
<section class="section properties" id="houses">
	<ul class="prop-list">
		{#each data.properties as p, i (p.id)}
			<li class="prop-row" class:reverse={i % 2 === 1}>
				<a
					class="prop-thumb"
					href={`/properties/${p.slug}`}
					aria-label={p.name.en}
					style:background-image={`url(${p.images[0]})`}
				></a>
				<div class="prop-body">
					<p class="meta prop-no">No. {String(i + 1).padStart(2, '0')}</p>
					<h3 class="h2 prop-title">{p.name.en}</h3>
					<p class="meta prop-loc">
						{#if i18n.locale === 'ja'}
							<span class="loc-full">{p.location.ja}・{p.name.ja}</span>
							<span class="loc-short">{shortArea(p.location.ja)} / {p.name.ja}</span>
						{:else}
							{p.location.en}
						{/if}
					</p>
					<p class="body-sm prop-desc">
						{#if i18n.locale === 'ja'}
							{#each p.description.ja.split('。').filter(Boolean) as sentence, i (i)}
								{#if i > 0}<br />{/if}{sentence}。
							{/each}
						{:else}
							{p.description.en}
						{/if}
					</p>
					<a class="link prop-link" href={`/properties/${p.slug}`}>
						<span>{i18n.t.home.properties.viewDetails}</span>
					</a>
				</div>
			</li>
		{/each}
	</ul>
</section>

<!-- ─── 04 Area ────────────────────────────────────── -->
<section class="section area" id="area">
	<header class="sec-head">
		<p class="eyebrow">{en.area.eyebrow}</p>
		<h2 class="h1">{en.area.heading}</h2>
		{#if i18n.locale === 'ja'}
			<p class="h-ja">{i18n.t.home.area.heading}</p>
		{/if}
		<p class="body-sm sec-sub">
			{#each i18n.t.home.area.sub.split('\n') as line, i (i)}
				{#if i > 0}<br />{/if}{line}
			{/each}
		</p>
	</header>

	<!-- Placeholder — swap for real neighborhood photography. -->
	<div
		class="area-thumb"
		aria-hidden="true"
		style:background-image="url(/images/mood_02.webp)"
	></div>

	<ul class="exp-list">
		{#each i18n.t.home.area.items as item (item.index)}
			<li class="exp-row">
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
	<div class="area-map">
		<iframe
			title="MOKUSEKI — Nagoya area map"
			src="https://www.google.com/maps?q=%E5%90%8D%E5%8F%A4%E5%B1%8B%E5%9F%8E&output=embed"
			loading="lazy"
			referrerpolicy="no-referrer-when-downgrade"
		></iframe>
	</div>
</section>

<!-- ─── 05 Gallery ─────────────────────────────────── -->
<section class="section gallery" id="gallery">
	<header class="sec-head">
		<p class="eyebrow">{en.gallery.eyebrow}</p>
		<h2 class="h1">{en.gallery.heading}</h2>
		{#if i18n.locale === 'ja'}
			<p class="h-ja">{i18n.t.home.gallery.heading}</p>
		{/if}
	</header>

	<div class="gal-grid">
		{#each galleryTones as tone, i (i)}
			<div
				class="gal-cell gal-cell-{i + 1}"
				style:background-color={tone}
				style:background-image={`url(${galleryImages[i % galleryImages.length]})`}
				aria-hidden="true"
			></div>
		{/each}
	</div>
</section>

<!-- ─── 06 Reserve CTA ─────────────────────────────── -->
<section class="section cta">
	<p class="eyebrow">{en.reserveCta.eyebrow}</p>
	<h2 class="h1 cta-heading">{en.reserveCta.heading}</h2>
	{#if i18n.locale === 'ja'}
		<p class="h-ja cta-heading-ja">{i18n.t.home.reserveCta.heading}</p>
	{/if}
	<p class="body-sm cta-sub">
		{#each i18n.t.home.reserveCta.sub.split('\n') as line, i (i)}
			{#if i > 0}<br />{/if}{line}
		{/each}
	</p>
	<a class="btn" href={RESERVE_URL} target="_blank" rel="noopener">
		<span>{en.reserveCta.cta}</span>
		<span class="arrow" aria-hidden="true">→</span>
	</a>
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

	/* JA sub-heading under a title (hero, Houses/Experience/Gallery) —
	 * fixed 16px at every breakpoint (was following --fs-ja-sm, 16px
	 * desktop but 13px on SP). */
	.sec-head .h-ja,
	.hero-inner .h-ja {
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
	}

	.hero :global(.h-ja) {
		color: rgba(255, 255, 255, 0.82);
		white-space: nowrap;
	}

	/* ─── 02 Properties ──────────────────────────────── */
	.prop-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: clamp(64px, 8vh, 104px);
	}

	.prop-row {
		display: grid;
		grid-template-columns: 1.05fr 1fr;
		gap: clamp(40px, 5vw, 88px);
		align-items: center;
	}

	.prop-row.reverse {
		grid-template-columns: 1fr 1.05fr;
	}

	.prop-row.reverse .prop-thumb {
		order: 2;
	}

	.prop-row.reverse .prop-body {
		order: 1;
	}

	.prop-thumb {
		display: block;
		aspect-ratio: 4 / 5;
		background-color: var(--bg-soft);
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		overflow: hidden;
	}

	.prop-body {
		display: flex;
		flex-direction: column;
		gap: 8px;
		max-width: 460px;
	}

	.prop-desc {
		margin-top: 12px;
	}

	/* Two location formats: full ("愛知県名古屋市・名古屋城") on desktop,
	 * short ("名古屋 / 名古屋城") on SP — swapped in the 540px block below. */
	.loc-short {
		display: none;
	}

	/* ─── 03 Philosophy ──────────────────────────────── */
	.philosophy {
		max-width: 720px;
		margin: 0 auto;
		text-align: center;
	}

	.philo-heading,
	.philo-heading-ja {
		/* Tightened 5px closer to the eyebrow above (was 24px). */
		margin-top: 19px;
	}

	.philo-heading-ja {
		font-size: 18px;
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

	/* ─── 04 Area ──────────────────────────────────────── */
	.area-thumb {
		width: 100vw;
		height: 120vw;
		margin-inline: calc(-1 * var(--padding));
		margin-bottom: clamp(48px, 8vh, 88px);
		background-color: var(--bg-soft);
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
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
		font-weight: 250;
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

	/* ─── 06 CTA ─────────────────────────────────────── */
	.cta {
		max-width: 620px;
		text-align: left;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 8px;
	}

	.cta-heading {
		margin-top: 24px;
	}

	.cta-sub {
		margin: 24px 0 clamp(40px, 5vh, 56px);
	}

	/* ─── Inline link (utility) ──────────────────────── */
	.link {
		display: inline-flex;
		align-items: center;
		gap: 16px;
		text-decoration: none;
		border-bottom: 1px solid var(--ink);
		padding-bottom: 8px;
		align-self: flex-start;
		margin-top: 16px;
		font-family: var(--display);
		font-size: var(--fs-sm);
		text-transform: uppercase;
		letter-spacing: var(--ls-en);
		line-height: var(--lh-en);
		color: var(--ink);
		transition: color 400ms ease;
	}

	.link:hover {
		color: var(--accent);
	}

	/* ─── Responsive ─────────────────────────────────── */
	@media (max-width: 880px) {
		.prop-row,
		.prop-row.reverse {
			grid-template-columns: 1fr;
			gap: 28px;
		}

		.prop-row.reverse .prop-thumb,
		.prop-row.reverse .prop-body {
			order: initial;
		}

		.prop-thumb {
			aspect-ratio: 3 / 2;
		}

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
		/* Houses cards go full-bleed: text overlays the photo instead of
		 * sitting beside it, rows sit edge-to-edge with a 2px hairline gap. */
		.prop-list {
			gap: 2px;
		}

		.prop-row,
		.prop-row.reverse {
			/* Break out of main's padding using the padding value itself
			 * (not calc(50% - 50vw)) — the vw-based trick can drift a few
			 * px on real devices depending on scrollbar/safe-area handling.
			 * This version is exact regardless of that. */
			position: relative;
			width: calc(100% + 2 * var(--padding));
			margin-inline: calc(-1 * var(--padding));
		}

		.prop-thumb {
			width: 100%;
			height: 130vw;
			aspect-ratio: auto;
		}

		.prop-body {
			/* Grid instead of the flex column used elsewhere — No./location
			 * sit on their own top row (No. left, location flush right),
			 * title/desc/link are pushed to the bottom by the flexible (1fr)
			 * empty row between them. grid-area placement means this doesn't
			 * depend on DOM order matching the visual order. */
			position: absolute;
			inset: 0;
			z-index: 1;
			display: grid;
			grid-template-columns: 1fr auto;
			grid-template-rows: auto 1fr auto auto auto;
			grid-template-areas:
				'no    loc'
				'.     .'
				'title title'
				'desc  desc'
				'link  link';
			max-width: none;
			padding: 20px 0 35px 20px;
			background: linear-gradient(180deg, transparent 45%, rgba(0, 0, 0, 0.55) 100%);
			/* This overlay's box covers the whole card (inset: 0), which
			 * would otherwise catch every click before it reaches
			 * .prop-thumb underneath. Ignore pointer events here so the
			 * image link works across its full area; re-enable them just
			 * on .prop-link so Discover stays independently clickable. */
			pointer-events: none;
		}

		.prop-no {
			grid-area: no;
		}

		.prop-loc {
			grid-area: loc;
			justify-self: end;
			padding-right: 20px;
			font-size: calc(var(--fs-sm) - 2px);
		}

		.loc-full {
			display: none;
		}

		.loc-short {
			display: inline;
		}

		.prop-title {
			grid-area: title;
		}

		.prop-desc {
			grid-area: desc;
		}

		.prop-link {
			grid-area: link;
			/* Grid items stretch to fill their area by default — without
			 * this the link (and its border-bottom underline) spans the
			 * full card width instead of hugging the label. */
			justify-self: start;
			/* .prop-body (its parent) ignores pointer events — opt this
			 * link back in so Discover stays clickable on its own. */
			pointer-events: auto;
		}

		.prop-body :global(.meta),
		.prop-body :global(.h2) {
			color: var(--white);
		}

		.prop-desc {
			color: rgba(255, 255, 255, 0.85);
			/* Pull 8px closer to the title above (grid row-gap is 8px by
			 * default here, inherited from .prop-body's flex gap). */
			margin-top: -8px;
		}

		.link {
			color: var(--white);
			border-bottom-color: var(--white);
			/* Bring the underline closer to the label than the desktop
			 * default (8px). */
			padding-bottom: 3px;
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
