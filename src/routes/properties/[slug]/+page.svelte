<script lang="ts">
	import { useI18n } from '$lib/i18n/store.svelte';
	import { messages } from '$lib/i18n/messages';
	import SEO from '$lib/components/SEO.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const i18n = useI18n();
	const en = messages.en.property;

	// Defaults: check-in tomorrow, check-out two nights later.
	// Local-time formatting avoids the UTC skew of toISOString() in JST.
	function toLocalISO(d: Date): string {
		const y = d.getFullYear();
		const m = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');
		return `${y}-${m}-${day}`;
	}
	function addDays(days: number): string {
		const d = new Date();
		d.setDate(d.getDate() + days);
		return toLocalISO(d);
	}
	const today = addDays(0);
	let checkIn = $state(addDays(1));
	let checkOut = $state(addDays(3));
	let guests = $state(2);

	const minCheckOut = $derived.by(() => {
		if (!checkIn) return today;
		const d = new Date(checkIn);
		d.setDate(d.getDate() + data.property.minNights);
		return toLocalISO(d);
	});

	const yen = $derived(
		new Intl.NumberFormat(i18n.locale === 'ja' ? 'ja-JP' : 'en-US', {
			style: 'currency',
			currency: 'JPY',
			maximumFractionDigits: 0
		})
	);

	const guestOptions = $derived(Array.from({ length: data.property.maxGuests }, (_, i) => i + 1));
</script>

<SEO
	title={i18n.t.meta.property.title(data.property.name[i18n.locale])}
	description={i18n.t.meta.property.description(
		data.property.name[i18n.locale],
		data.property.location[i18n.locale]
	)}
/>

<!-- ─── Hero ────────────────────────────────────────── -->
<section class="hero">
	<a class="meta back" href="/#houses">← Houses</a>
	<h1 class="h1">{data.property.name.en}</h1>
	{#if i18n.locale === 'ja'}
		<p class="h-ja">{data.property.name.ja}</p>
	{/if}
	<p class="meta location">{data.property.location[i18n.locale]}</p>

	<div class="hero-figure" aria-hidden="true">
		<div
			class="hero-tone"
			style:background-color={data.property.galleryTones[0]}
			style:background-image={`url(${data.property.images[0]})`}
		></div>
	</div>

	<p class="body-sm hero-desc">{data.property.description[i18n.locale]}</p>
</section>

<!-- ─── Overview + Facts ───────────────────────────── -->
<section class="section">
	<header class="sec-head">
		<p class="eyebrow">{en.overview.eyebrow}</p>
		<h2 class="h2">{en.overview.heading}</h2>
		{#if i18n.locale === 'ja'}
			<p class="h-ja">{i18n.t.property.overview.heading}</p>
		{/if}
	</header>

	<div class="overview-grid">
		<div class="overview-figure" aria-hidden="true">
			<div
				class="tone"
				style:background-color={data.property.galleryTones[1]}
				style:background-image={`url(${data.property.images[1] ?? data.property.images[0]})`}
			></div>
		</div>

		<div class="overview-body">
			<p class="body">{data.property.spaces[i18n.locale]}</p>

			<dl class="facts">
				<div class="fact">
					<dt class="meta">{i18n.t.property.factLabels.bedrooms}</dt>
					<dd>
						<span class="fact-val">{data.property.bedrooms}</span>
						{#if i18n.locale === 'en'}<span class="meta unit"
								>{data.property.bedrooms === 1 ? 'bedroom' : 'bedrooms'}</span
							>{/if}
					</dd>
				</div>
				<div class="fact">
					<dt class="meta">{i18n.t.property.factLabels.maxGuests}</dt>
					<dd>
						<span class="fact-val">{data.property.maxGuests}</span>
						<span class="meta unit"
							>{i18n.locale === 'ja'
								? '名'
								: data.property.maxGuests === 1
									? 'guest'
									: 'guests'}</span
						>
					</dd>
				</div>
				<div class="fact">
					<dt class="meta">{i18n.t.property.factLabels.minStay}</dt>
					<dd>
						<span class="fact-val">{i18n.t.property.minStayValue(data.property.minNights)}</span>
					</dd>
				</div>
				<div class="fact">
					<dt class="meta">{i18n.t.property.factLabels.checkIn}</dt>
					<dd>
						<span class="fact-val">{i18n.t.property.checkInTime}</span>
					</dd>
				</div>
				<div class="fact">
					<dt class="meta">{i18n.t.property.factLabels.checkOut}</dt>
					<dd>
						<span class="fact-val">{i18n.t.property.checkOutTime}</span>
					</dd>
				</div>
				<div class="fact rate">
					<dt class="meta">{i18n.t.property.rateFrom}</dt>
					<dd>
						<span class="fact-val">{yen.format(data.property.nightlyRate)}</span>
						<span class="meta unit">{i18n.t.property.perNight}</span>
					</dd>
				</div>
			</dl>
		</div>
	</div>
</section>

<!-- ─── Spaces / Features ──────────────────────────── -->
<section class="section">
	<header class="sec-head">
		<p class="eyebrow">{en.spaces.eyebrow}</p>
		<h2 class="h2">{en.spaces.heading}</h2>
		{#if i18n.locale === 'ja'}
			<p class="h-ja">{i18n.t.property.spaces.heading}</p>
		{/if}
	</header>

	<ul class="row-list">
		{#each data.property.features as feature, i (i)}
			<li class="row">
				<span class="meta row-index">{String(i + 1).padStart(2, '0')}</span>
				<span class="body-sm">{feature[i18n.locale]}</span>
			</li>
		{/each}
	</ul>
</section>

<!-- ─── Around ─────────────────────────────────────── -->
<section class="section">
	<header class="sec-head">
		<p class="eyebrow">{en.around.eyebrow}</p>
		<h2 class="h2">{en.around.heading}</h2>
		{#if i18n.locale === 'ja'}
			<p class="h-ja">{i18n.t.property.around.heading}</p>
		{/if}
	</header>

	<ul class="row-list">
		{#each data.property.around as item, i (i)}
			<li class="row">
				<span class="meta row-index">{String(i + 1).padStart(2, '0')}</span>
				<span class="body-sm">{item[i18n.locale]}</span>
			</li>
		{/each}
	</ul>
</section>

<!-- ─── Gallery ────────────────────────────────────── -->
<section class="section">
	<header class="sec-head">
		<p class="eyebrow">{en.gallery.eyebrow}</p>
		<h2 class="h2">{en.gallery.heading}</h2>
		{#if i18n.locale === 'ja'}
			<p class="h-ja">{i18n.t.property.gallery.heading}</p>
		{/if}
	</header>

	<div class="gal-grid">
		{#each data.property.galleryTones as tone, i (i)}
			<div
				class="gal-cell gal-cell-{i + 1}"
				style:background-color={tone}
				style:background-image={`url(${data.property.images[i % data.property.images.length]})`}
				aria-hidden="true"
			></div>
		{/each}
	</div>
</section>

<!-- ─── Reserve form ───────────────────────────────── -->
<section class="section reserve">
	<header class="sec-head">
		<p class="eyebrow">{en.reserve.eyebrow}</p>
		<h2 class="h2">{en.reserve.heading}</h2>
		{#if i18n.locale === 'ja'}
			<p class="h-ja">{i18n.t.property.reserve.heading}</p>
		{/if}
		<p class="body-sm head-intro">
			{#each i18n.t.property.reserve.body.split('\n') as line, i (i)}
				{#if i > 0}<br />{/if}{line}
			{/each}
		</p>
	</header>

	<form class="form" method="GET" action="/reserve/results">
		<div class="field">
			<label class="meta" for="checkIn">{i18n.t.reserve.checkIn}</label>
			<input id="checkIn" name="checkIn" type="date" bind:value={checkIn} min={today} required />
		</div>
		<div class="divider" aria-hidden="true"></div>
		<div class="field">
			<label class="meta" for="checkOut">{i18n.t.reserve.checkOut}</label>
			<input
				id="checkOut"
				name="checkOut"
				type="date"
				bind:value={checkOut}
				min={minCheckOut}
				required
			/>
		</div>
		<div class="divider" aria-hidden="true"></div>
		<div class="field">
			<label class="meta" for="guests">{i18n.t.reserve.guests}</label>
			<select id="guests" name="guests" bind:value={guests} required>
				{#each guestOptions as n (n)}
					<option value={n}>{i18n.t.reserve.guestUnit(n)}</option>
				{/each}
			</select>
		</div>

		<button type="submit" class="btn">
			<span>{i18n.t.property.reserve.cta}</span>
			<span class="arrow" aria-hidden="true">→</span>
		</button>
	</form>
</section>

<style>
	.section {
		width: 100%;
		max-width: 1180px;
		margin: 0 auto;
		padding: clamp(80px, 14vh, 160px) 0;
	}

	.sec-head {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		text-align: left;
		gap: 8px;
		margin: 0 0 clamp(48px, 7vh, 80px);
		max-width: 720px;
	}

	.head-intro {
		margin-top: 24px;
	}

	/* ─── Hero ────────────────────────────────────────── */
	.hero {
		width: 100%;
		max-width: 1180px;
		margin: 0 auto;
		padding: clamp(32px, 5vh, 64px) 0 clamp(64px, 10vh, 128px);
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		text-align: left;
		gap: 8px;
	}

	.back {
		text-decoration: none;
		margin-bottom: 24px;
		transition: color 300ms ease;
	}

	.back:hover {
		color: var(--ink);
	}

	.location {
		margin-top: 8px;
	}

	.hero-figure {
		width: 100%;
		margin: clamp(32px, 5vh, 48px) 0 24px;
	}

	.hero-tone {
		width: 100%;
		aspect-ratio: 21 / 9;
		background-color: var(--bg-soft);
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		position: relative;
	}

	.hero-tone::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, transparent 65%, rgba(26, 26, 26, 0.08));
	}

	.hero-desc {
		max-width: 36ch;
	}

	/* ─── Overview ───────────────────────────────────── */
	.overview-grid {
		display: grid;
		grid-template-columns: 1fr 1.1fr;
		gap: clamp(40px, 5vw, 80px);
		align-items: start;
	}

	.overview-figure {
		position: sticky;
		top: 48px;
	}

	.tone {
		width: 100%;
		aspect-ratio: 4 / 5;
		background-color: var(--bg-soft);
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		position: relative;
	}

	.tone::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, transparent 60%, rgba(26, 26, 26, 0.06));
	}

	.overview-body {
		display: flex;
		flex-direction: column;
		gap: 32px;
	}

	.facts {
		margin: 0;
		display: grid;
		grid-template-columns: 1fr 1fr;
		row-gap: 16px;
		column-gap: 32px;
		border-top: 1px solid var(--rule);
		padding-top: 24px;
	}

	.fact {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.fact.rate {
		grid-column: 1 / -1;
		border-top: 1px solid var(--rule);
		padding-top: 20px;
		margin-top: 8px;
	}

	.fact dd {
		margin: 0;
		display: flex;
		align-items: baseline;
		gap: 7px;
		flex-wrap: wrap;
	}

	.fact-val {
		font-family: var(--display);
		font-size: var(--fs-h2);
		line-height: var(--lh-en);
		letter-spacing: var(--ls-en);
		color: var(--ink);
	}

	.unit {
		text-transform: none;
		color: var(--ink-faint);
	}

	/* ─── Row lists (features / around) ──────────────── */
	.row-list {
		list-style: none;
		padding: 0;
		margin: 0 auto;
		max-width: 720px;
		display: flex;
		flex-direction: column;
	}

	.row {
		display: grid;
		grid-template-columns: 64px 1fr;
		gap: 24px;
		padding: 20px 0;
		border-top: 1px solid var(--rule);
		align-items: baseline;
	}

	.row:last-child {
		border-bottom: 1px solid var(--rule);
	}

	/* ─── Gallery ────────────────────────────────────── */
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
		grid-row: span 2;
	}
	.gal-cell-2 {
		grid-column: span 2;
		grid-row: span 2;
	}
	.gal-cell-3 {
		grid-column: span 3;
		grid-row: span 2;
	}
	.gal-cell-4 {
		grid-column: span 3;
		grid-row: span 2;
	}
	.gal-cell-5 {
		grid-column: span 6;
		grid-row: span 2;
	}

	/* ─── Reserve form ───────────────────────────────── */
	.reserve {
		max-width: 720px;
	}

	.form {
		width: 100%;
		max-width: 480px;
		margin-inline: auto;
		border-top: 1px solid var(--rule);
		border-bottom: 1px solid var(--rule);
		padding: 20px 0;
		display: flex;
		flex-direction: column;
	}

	.field {
		display: grid;
		grid-template-columns: 120px 1fr;
		align-items: center;
		padding: 16px 4px;
	}

	.field input,
	.field select {
		appearance: none;
		-webkit-appearance: none;
		background: transparent;
		border: none;
		font-family: var(--display);
		font-size: var(--fs-body);
		font-weight: 300;
		letter-spacing: 0;
		line-height: var(--lh-en);
		color: var(--ink);
		padding: 4px 0;
		text-align: right;
		cursor: pointer;
	}

	.field input:focus,
	.field select:focus {
		outline: none;
		color: var(--accent);
	}

	.field input::-webkit-calendar-picker-indicator {
		opacity: 0.4;
		cursor: pointer;
		filter: grayscale(1);
	}

	.divider {
		height: 1px;
		background: var(--rule);
		opacity: 0.18;
		margin: 0 4px;
	}

	.form .btn {
		margin-top: 40px;
		align-self: flex-start;
	}

	/* ─── Responsive ─────────────────────────────────── */
	@media (max-width: 880px) {
		.overview-grid {
			grid-template-columns: 1fr;
			gap: 32px;
		}

		.overview-figure {
			position: static;
		}

		.tone {
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
		.gal-cell-4 {
			grid-column: span 2;
			grid-row: span 2;
		}
		.gal-cell-5 {
			grid-column: span 4;
			grid-row: span 2;
		}
	}

	@media (max-width: 540px) {
		.facts {
			grid-template-columns: 1fr;
		}

		.fact.rate {
			grid-column: 1;
		}

		.field {
			grid-template-columns: 96px 1fr;
			padding: 14px 0;
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
		.gal-cell-5 {
			grid-column: span 2;
			grid-row: span 1;
		}

		.gal-cell-1 {
			grid-row: span 2;
		}
	}
</style>
