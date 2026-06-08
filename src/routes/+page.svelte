<script lang="ts">
	import { useI18n } from '$lib/i18n/store.svelte';
	import { messages } from '$lib/i18n/messages';
	import SEO from '$lib/components/SEO.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const i18n = useI18n();
	const en = messages.en.home;

	// Cool neutral fallback tones shown behind the gallery photography.
	const galleryTones = ['#e4e4e4', '#d4d4d4', '#bdbdbd', '#c8c8c8', '#ececec', '#dadada'];
</script>

<SEO title={i18n.t.meta.home.title} description={i18n.t.meta.home.description} />

<!-- ─── 01 Hero ─────────────────────────────────────── -->
<section class="hero">
	<div class="hero-inner">
		<h1 class="h1">
			{en.hero.ledeLine1}<br />
			{en.hero.ledeLine2}
		</h1>
		{#if i18n.locale === 'ja'}
			<p class="h-ja">
				{i18n.t.home.hero.ledeLine1}{i18n.t.home.hero.ledeLine2}
			</p>
		{/if}
	</div>
	<div class="scroll" aria-hidden="true">
		<span class="meta">{i18n.t.home.hero.scrollHint}</span>
		<span class="scroll-line"></span>
	</div>
</section>

<!-- ─── 02 Properties ──────────────────────────────── -->
<section class="section properties" id="houses">
	<header class="sec-head">
		<p class="eyebrow">{en.properties.eyebrow}</p>
		<h2 class="h2">{en.properties.heading}</h2>
		{#if i18n.locale === 'ja'}
			<p class="h-ja">{i18n.t.home.properties.heading}</p>
		{/if}
		<p class="body-sm sec-sub">
			{#each i18n.t.home.properties.sub.split('\n') as line, i (i)}
				{#if i > 0}<br />{/if}{line}
			{/each}
		</p>
	</header>

	<ul class="prop-list">
		{#each data.properties as p, i (p.id)}
			<li class="prop-row" class:reverse={i % 2 === 1}>
				<div class="prop-thumb" aria-hidden="true" style:background-image={`url(${p.images[0]})`}>
					<span class="meta">{String(i + 1).padStart(2, '0')}</span>
					<span class="meta">{p.slug.toUpperCase()}</span>
				</div>
				<div class="prop-body">
					<p class="meta">No. {String(i + 1).padStart(2, '0')}</p>
					<h3 class="h2">{p.name.en}</h3>
					{#if i18n.locale === 'ja'}
						<p class="h-ja">{p.name.ja}</p>
					{/if}
					<p class="meta">{p.location[i18n.locale]}</p>
					<p class="body-sm prop-desc">{p.description[i18n.locale]}</p>
					<a class="link" href={`/properties/${p.slug}`}>
						<span>{i18n.t.home.properties.viewDetails}</span>
						<span class="arrow" aria-hidden="true">→</span>
					</a>
				</div>
			</li>
		{/each}
	</ul>
</section>

<!-- ─── 03 Philosophy ──────────────────────────────── -->
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

<!-- ─── 04 Experience ──────────────────────────────── -->
<section class="section experience" id="experience">
	<header class="sec-head">
		<p class="eyebrow">{en.experience.eyebrow}</p>
		<h2 class="h2">{en.experience.heading}</h2>
		{#if i18n.locale === 'ja'}
			<p class="h-ja">{i18n.t.home.experience.heading}</p>
		{/if}
		<p class="body-sm sec-sub">
			{#each i18n.t.home.experience.sub.split('\n') as line, i (i)}
				{#if i > 0}<br />{/if}{line}
			{/each}
		</p>
	</header>

	<ul class="exp-list">
		{#each i18n.t.home.experience.items as item (item.index)}
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
</section>

<!-- ─── 05 Gallery ─────────────────────────────────── -->
<section class="section gallery" id="gallery">
	<header class="sec-head">
		<p class="eyebrow">{en.gallery.eyebrow}</p>
		<h2 class="h2">{en.gallery.heading}</h2>
		{#if i18n.locale === 'ja'}
			<p class="h-ja">{i18n.t.home.gallery.heading}</p>
		{/if}
	</header>

	<div class="gal-grid">
		{#each galleryTones as tone, i (i)}
			<div
				class="gal-cell gal-cell-{i + 1}"
				style:background-color={tone}
				style:background-image={`url(${i % 2 === 0 ? '/images/highlight.jpg' : '/images/hero.jpg'})`}
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
	<a class="btn" href="/reserve">
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
		padding: clamp(80px, 14vh, 160px) 0;
	}

	.sec-head {
		max-width: 720px;
		margin: 0 0 clamp(56px, 8vh, 96px);
		text-align: left;
		display: flex;
		flex-direction: column;
		gap: 8px;
		align-items: flex-start;
	}

	.sec-sub {
		margin-top: 20px;
	}

	/* ─── 01 Hero ────────────────────────────────────── */
	.hero {
		min-height: calc(100vh - clamp(128px, 14vh, 192px));
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		position: relative;
		padding: clamp(64px, 10vh, 128px) 0 96px;
	}

	.hero-inner {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 12px;
		text-align: left;
	}

	.scroll {
		position: absolute;
		bottom: 32px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 14px;
	}

	.scroll-line {
		width: 1px;
		height: 56px;
		background: var(--ink-soft);
		opacity: 0.4;
		animation: scrollPulse 2400ms ease-in-out infinite;
	}

	@keyframes scrollPulse {
		0% {
			transform: scaleY(0.2);
			transform-origin: top;
			opacity: 0.1;
		}
		50% {
			transform: scaleY(1);
			opacity: 0.5;
		}
		100% {
			transform: scaleY(0.2);
			transform-origin: bottom;
			opacity: 0.1;
		}
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
		aspect-ratio: 4 / 5;
		background-color: var(--bg-soft);
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		position: relative;
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		padding: 20px 24px;
		overflow: hidden;
	}

	.prop-thumb::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, transparent 55%, rgba(26, 26, 26, 0.05));
	}

	.prop-thumb > .meta {
		position: relative;
		z-index: 1;
		color: var(--white);
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

	/* ─── 03 Philosophy ──────────────────────────────── */
	.philosophy {
		max-width: 720px;
		text-align: left;
	}

	.philo-heading {
		margin-top: 24px;
	}

	.philo-body {
		display: flex;
		flex-direction: column;
		gap: 24px;
		margin: clamp(48px, 6vh, 72px) 0 0;
	}

	.philo-sig {
		margin-top: clamp(48px, 6vh, 72px);
	}

	/* ─── 04 Experience ──────────────────────────────── */
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

	.exp-row:last-child {
		border-bottom: 1px solid var(--rule);
	}

	/* exp-index is the only intentionally-large numeral on the page. */
	.exp-index {
		font-family: var(--display);
		font-weight: 300;
		font-size: clamp(32px, 4vw, 48px);
		letter-spacing: 0;
		color: var(--accent);
		line-height: 1;
	}

	.exp-body {
		display: flex;
		flex-direction: column;
		gap: 14px;
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

	.link .arrow {
		letter-spacing: 0;
		text-transform: none;
		transition: transform 400ms ease;
	}

	.link:hover {
		color: var(--accent);
	}

	.link:hover .arrow {
		transform: translateX(4px);
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

		.scroll {
			bottom: 16px;
		}
	}
</style>
