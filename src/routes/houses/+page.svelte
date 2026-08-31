<script lang="ts">
	import { useI18n } from '$lib/i18n/store.svelte';
	import { messages } from '$lib/i18n/messages';
	import SEO from '$lib/components/SEO.svelte';
	import { RESERVE_URL } from '$lib/site';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const i18n = useI18n();
	const en = messages.en.home;

	// Same helper as the home page's Houses card: "愛知県名古屋市" → "名古屋",
	// "岐阜県" → "岐阜" — city if there is one, else the prefecture name with
	// its administrative suffix dropped.
	function shortArea(location: string): string {
		const city = location.replace(/^.*?[都道府県]/, '').replace(/[市区町村]$/, '');
		return city || location.replace(/[都道府県]$/, '');
	}
</script>

<SEO title={i18n.t.meta.houses.title} description={i18n.t.meta.houses.description} />

<section class="section">
	<header class="sec-head">
		<p class="eyebrow">{en.properties.eyebrow}</p>
		<h1 class="h1">{en.properties.heading}</h1>
		{#if i18n.locale === 'ja'}
			<p class="h-ja">{i18n.t.home.properties.heading}</p>
		{/if}
	</header>

	<ul class="house-list">
		{#each data.properties as p, i (p.id)}
			<li class="house-card">
				<a
					class="house-thumb"
					href={`/properties/${p.slug}`}
					aria-label={p.name.en}
					style:background-image={`url(${p.images[0]})`}
				></a>
				<div class="house-overlay">
					<p class="meta house-no">No. {String(i + 1).padStart(2, '0')}</p>
					<p class="meta house-loc">
						{#if i18n.locale === 'ja'}
							{shortArea(p.location.ja)} / {p.name.ja}
						{:else}
							{p.location.en}
						{/if}
					</p>
					<h2 class="h2 house-title">{p.name.en}</h2>
					<p class="body-sm house-desc">
						{#if i18n.locale === 'ja'}
							{#each p.description.ja.split('。').filter(Boolean) as sentence, si (si)}
								{#if si > 0}<br />{/if}{sentence}。
							{/each}
						{:else}
							{p.description.en}
						{/if}
					</p>
					<a class="house-reserve" href={RESERVE_URL} target="_blank" rel="noopener">
						<span>{i18n.t.home.properties.reserveLabel}</span>
						<span aria-hidden="true">▶</span>
					</a>
				</div>
			</li>
		{/each}
	</ul>
</section>

<style>
	.section {
		width: 100%;
		max-width: 1180px;
		margin: 0 auto;
		padding: clamp(80px, 14vh, 160px) 0 clamp(80px, 14vh, 160px);
	}

	.sec-head {
		max-width: 720px;
		margin: 0 auto clamp(46px, 8vh, 86px);
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 8px;
		align-items: center;
	}

	.house-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.house-card {
		/* Break out of main's padding to go edge-to-edge, at every
		 * breakpoint — this page is a simple vertical stack of full-bleed
		 * photos, not the home page's side-by-side desktop layout. */
		position: relative;
		width: calc(100% + 2 * var(--padding));
		margin-inline: calc(-1 * var(--padding));
		height: clamp(520px, 90vh, 900px);
	}

	.house-thumb {
		display: block;
		width: 100%;
		height: 100%;
		background-color: var(--bg-soft);
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
	}

	.house-overlay {
		position: absolute;
		inset: 0;
		z-index: 1;
		display: grid;
		grid-template-columns: 1fr auto;
		grid-template-rows: auto 1fr auto auto auto;
		grid-template-areas:
			'no   loc'
			'.    .'
			'title title'
			'desc desc'
			'cta  cta';
		padding: 28px 0 40px 28px;
		background: linear-gradient(180deg, transparent 45%, rgba(0, 0, 0, 0.55) 100%);
		/* This overlay's box covers the whole card, which would otherwise
		 * catch every click before it reaches .house-thumb underneath.
		 * Ignore pointer events here; re-enable on .house-reserve so it
		 * stays independently clickable. */
		pointer-events: none;
	}

	.house-no {
		grid-area: no;
		color: var(--white);
	}

	.house-loc {
		grid-area: loc;
		justify-self: end;
		padding-right: 28px;
		color: var(--white);
	}

	.house-title {
		grid-area: title;
		color: var(--white);
	}

	.house-desc {
		grid-area: desc;
		margin-top: -4px;
		max-width: 46ch;
		color: rgba(255, 255, 255, 0.85);
	}

	.house-reserve {
		grid-area: cta;
		justify-self: start;
		pointer-events: auto;
		display: inline-flex;
		align-items: center;
		gap: 12px;
		margin-top: 20px;
		padding-bottom: 3px;
		border-bottom: 1px solid var(--white);
		text-decoration: none;
		font-family: var(--display);
		font-size: var(--fs-sm);
		text-transform: uppercase;
		letter-spacing: var(--ls-caps);
		color: var(--white);
		transition: opacity 300ms ease;
	}

	.house-reserve:hover {
		opacity: 0.7;
	}

	@media (max-width: 540px) {
		.section {
			padding-top: clamp(40px, 10vh, 80px);
		}

		.house-card {
			height: 130vw;
		}

		.house-overlay {
			padding: 20px 0 35px 20px;
		}

		.house-loc {
			padding-right: 20px;
			font-size: calc(var(--fs-sm) - 2px);
		}
	}
</style>
