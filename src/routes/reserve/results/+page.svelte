<script lang="ts">
	import { useI18n } from '$lib/i18n/store.svelte';
	import { messages } from '$lib/i18n/messages';
	import SEO from '$lib/components/SEO.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const i18n = useI18n();
	const en = messages.en.results;

	const yen = $derived(
		new Intl.NumberFormat(i18n.locale === 'ja' ? 'ja-JP' : 'en-US', {
			style: 'currency',
			currency: 'JPY',
			maximumFractionDigits: 0
		})
	);

	const dateFmt = $derived(
		new Intl.DateTimeFormat(i18n.locale === 'ja' ? 'ja-JP' : 'en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		})
	);

	const editHref = $derived(
		`/reserve?checkIn=${data.criteria.checkIn}&checkOut=${data.criteria.checkOut}&guests=${data.criteria.guests}`
	);
</script>

<SEO title={i18n.t.meta.results.title} description={i18n.t.meta.results.description} />

<div class="results-grid">
	<section class="head">
		<p class="eyebrow">{en.eyebrow}</p>
		<h1 class="h1">{en.heading}</h1>
		{#if i18n.locale === 'ja'}
			<p class="h-ja">{i18n.t.results.heading}</p>
		{/if}

		<dl class="summary">
			<div class="cell">
				<dt class="meta">{i18n.t.reserve.checkIn}</dt>
				<dd class="body-sm">{dateFmt.format(new Date(data.criteria.checkIn))}</dd>
			</div>
			<div class="cell">
				<dt class="meta">{i18n.t.reserve.checkOut}</dt>
				<dd class="body-sm">{dateFmt.format(new Date(data.criteria.checkOut))}</dd>
			</div>
			<div class="cell">
				<dt class="meta">{i18n.t.reserve.guests}</dt>
				<dd class="body-sm">{i18n.t.reserve.guestUnit(data.criteria.guests)}</dd>
			</div>
			<div class="cell">
				<dt class="meta">{i18n.t.results.nightsHeading}</dt>
				<dd class="body-sm">{i18n.t.results.summaryNights(data.criteria.nights)}</dd>
			</div>
		</dl>

		<a class="inline-link meta" href={editHref}>← {i18n.t.results.edit}</a>
	</section>

	<div class="results-col">
		{#if data.results.length === 0}
			<div class="empty">
				<p class="body">
					{#each i18n.t.results.empty.split('\n') as line, i (i)}
						{#if i > 0}<br />{/if}{line}
					{/each}
				</p>
			</div>
		{:else}
			<ul class="cards">
				{#each data.results as result (result.property.id)}
					{@const p = result.property}
					{@const q = result.quote}
					<li class="card">
						<div class="thumb" aria-hidden="true" style:background-image={`url(${p.images[0]})`}>
							<span class="meta">{p.slug.toUpperCase()}</span>
						</div>

						<div class="body-col">
							<header class="meta-block">
								<h2 class="h2">{p.name.en}</h2>
								{#if i18n.locale === 'ja'}
									<p class="h-ja">{p.name.ja}</p>
								{/if}
								<p class="meta">{p.location[i18n.locale]}</p>
							</header>

							<p class="body-sm">{p.description[i18n.locale]}</p>

							<p class="meta caps">
								<span>{i18n.t.results.bedrooms(p.bedrooms)}</span>
								<span aria-hidden="true">・</span>
								<span>{i18n.t.results.guestsCap(p.maxGuests)}</span>
							</p>
						</div>

						<aside class="price">
							<p class="meta">{i18n.t.results.fromPrice}</p>
							<p class="price-amount">{yen.format(q.total)}</p>
							<p class="meta">
								{i18n.t.results.nightsLabel(q.nights)}・{i18n.t.results.taxIncluded}
							</p>
							<a
								class="select"
								href={`/booking/${p.slug}?checkIn=${q.checkIn}&checkOut=${q.checkOut}&guests=${q.guests}`}
							>
								<span>{i18n.t.results.select}</span>
								<span class="arrow" aria-hidden="true">→</span>
							</a>
						</aside>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>

<style>
	/* ─── 2-column grid: schedule sidebar (left) + results (right) ───── */
	.results-grid {
		display: grid;
		grid-template-columns: 320px 1fr;
		gap: 80px;
		padding-top: clamp(40px, 7vh, 96px);
		align-items: start;
	}

	.head {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		text-align: left;
		gap: 8px;
		position: sticky;
		top: 96px;
	}

	.summary {
		margin: 16px 0 0;
		display: grid;
		grid-template-columns: 1fr 1fr;
		row-gap: 16px;
		column-gap: 24px;
		border-top: 1px solid var(--rule);
		border-bottom: 1px solid var(--rule);
		padding: 20px 0;
		width: 100%;
	}

	.cell {
		display: flex;
		flex-direction: column;
		gap: 6px;
		text-align: left;
	}

	.inline-link {
		margin-top: 16px;
	}

	.empty {
		max-width: 580px;
		text-align: left;
		padding: clamp(48px, 8vh, 80px) 0;
	}

	.results-col {
		min-width: 0;
	}

	.cards {
		list-style: none;
		padding: 0;
		margin: 0;
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.card {
		display: grid;
		grid-template-columns: 200px 1fr 160px;
		gap: 32px;
		align-items: stretch;
		padding: 32px 0;
		border-top: 1px solid var(--rule);
	}

	.card:first-child {
		border-top: none;
		padding-top: 0;
	}

	.card:last-child {
		border-bottom: 1px solid var(--rule);
	}

	/* Title (.h2 / .h-ja) and concept (.body-sm) keep their existing faces;
	 * everything else inside the card (labels, capacity, price meta, select)
	 * uses TsukuGo Light for a softer informational tone. */
	.card :global(.meta),
	.card .select {
		font-family: var(--font-tsuku);
		font-weight: 300;
	}

	.thumb {
		aspect-ratio: 4 / 5;
		background-color: var(--bg-soft);
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		display: flex;
		align-items: flex-end;
		justify-content: flex-start;
		padding: 16px;
		position: relative;
		overflow: hidden;
	}

	.thumb::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, transparent 60%, rgba(26, 26, 26, 0.04));
	}

	.thumb > .meta {
		position: relative;
		z-index: 1;
		color: var(--white);
	}

	.body-col {
		display: flex;
		flex-direction: column;
		gap: 20px;
		padding-top: 8px;
	}

	.meta-block {
		display: flex;
		flex-direction: column;
		gap: 7px;
	}

	.caps {
		display: flex;
		gap: 10px;
		align-items: center;
	}

	.price {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		gap: 8px;
		text-align: right;
	}

	/* The only intentionally-large numeral on this page. */
	.price-amount {
		font-family: var(--display);
		font-weight: 400;
		font-size: 24px;
		letter-spacing: 0;
		line-height: 1.2;
		color: var(--ink);
		margin: 0;
	}

	.select {
		display: inline-flex;
		align-items: center;
		justify-content: flex-end;
		gap: 16px;
		font-family: var(--display);
		font-size: var(--fs-sm);
		font-weight: 400;
		letter-spacing: var(--ls-en);
		line-height: var(--lh-en);
		text-transform: uppercase;
		color: var(--ink);
		text-decoration: none;
		border-top: 1px solid var(--ink);
		padding: 16px 0 0;
		margin-top: 8px;
		transition: color 400ms ease;
	}

	.select .arrow {
		text-transform: none;
		letter-spacing: 0;
		transition: transform 400ms ease;
	}

	.select:hover {
		color: var(--accent);
	}

	.select:hover .arrow {
		transform: translateX(4px);
	}

	@media (max-width: 880px) {
		.results-grid {
			grid-template-columns: 1fr;
			gap: 40px;
		}

		.head {
			position: static;
			top: auto;
		}

		.card {
			grid-template-columns: 1fr;
			gap: 24px;
		}

		.thumb {
			aspect-ratio: 3 / 2;
		}

		.price {
			text-align: left;
			align-items: flex-start;
		}

		.select {
			justify-content: flex-start;
		}
	}

	@media (max-width: 540px) {
		.summary {
			grid-template-columns: 1fr 1fr;
			row-gap: 12px;
			column-gap: 16px;
			padding: 16px 0;
		}
	}
</style>
