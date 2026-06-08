<script lang="ts">
	import { useI18n } from '$lib/i18n/store.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const i18n = useI18n();
	const r = $derived(data.reservation);

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
	const stayRange = $derived(
		`${dateFmt.format(new Date(r.checkIn))} – ${dateFmt.format(new Date(r.checkOut))}`
	);
</script>

<SEO title={i18n.t.meta.confirmed.title} description={i18n.t.meta.confirmed.description} />

<section class="confirmed">
	<p class="eyebrow">{i18n.t.confirmed.eyebrow}</p>
	<h1 class="h1">{i18n.t.confirmed.heading}</h1>

	<p class="body lede">
		{#each i18n.t.confirmed.lede.split('\n') as line, i (i)}
			{#if i > 0}<br />{/if}{line}
		{/each}
	</p>

	<div class="reference">
		<p class="meta">{i18n.t.confirmed.refLabel}</p>
		<p class="ref-code">{r.reference}</p>
	</div>

	<dl class="details">
		<div class="row">
			<dt class="meta">{i18n.t.confirmed.detailsHeading}</dt>
			<dd class="body-sm">
				{r.propertyName.en}{#if i18n.locale === 'ja'}
					／ {r.propertyName.ja}{/if}<br />
				{r.location[i18n.locale]}
			</dd>
		</div>
		<div class="row">
			<dt class="meta">{i18n.t.confirmed.stayLabel}</dt>
			<dd class="body-sm">
				{stayRange}<br />
				{i18n.t.results.summaryNights(r.nights)}・{i18n.t.reserve.guestUnit(r.guests)}
			</dd>
		</div>
		<div class="row">
			<dt class="meta">{i18n.t.confirmed.guestLabel}</dt>
			<dd class="body-sm">{i18n.t.booking.guestName(r.guest.lastName, r.guest.firstName)}</dd>
		</div>
		<div class="row total">
			<dt class="meta">{i18n.t.confirmed.totalLabel}</dt>
			<dd class="total-amount">{yen.format(r.total)}</dd>
		</div>
	</dl>

	<p class="body-sm email-note">{i18n.t.confirmed.emailNote(r.guest.email)}</p>
	<p class="meta mock-notice">{i18n.t.confirmed.mockNotice}</p>

	<a class="btn home" href="/">
		<span>{i18n.t.confirmed.backHome}</span>
		<span class="arrow" aria-hidden="true">→</span>
	</a>
</section>

<style>
	.confirmed {
		max-width: 560px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		text-align: left;
		gap: 16px;
		padding-top: clamp(56px, 12vh, 140px);
		padding-bottom: clamp(64px, 12vh, 140px);
	}

	.lede {
		margin-top: 8px;
	}

	.reference {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 8px;
		border-top: 1px solid var(--rule);
		border-bottom: 1px solid var(--rule);
		padding: 24px 0;
		margin-top: 16px;
	}

	.ref-code {
		font-family: var(--display);
		font-weight: 400;
		font-size: 28px;
		letter-spacing: 0;
		line-height: 1.1;
		color: var(--ink);
		margin: 0;
	}

	.details {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 20px;
		padding: 8px 0 4px;
	}

	.details .row {
		display: flex;
		align-items: baseline;
		gap: 24px;
	}

	.details dt {
		flex: 0 0 120px;
	}

	.details dd {
		flex: 1;
	}

	.details .total {
		border-top: 1px solid var(--rule);
		padding-top: 18px;
		margin-top: 4px;
	}

	.total-amount {
		font-family: var(--display);
		font-weight: 400;
		font-size: 22px;
		letter-spacing: 0;
		line-height: 1.2;
		color: var(--ink);
		margin: 0;
	}

	.email-note {
		margin-top: 12px;
	}

	.mock-notice {
		color: var(--ink-faint);
	}

	.home {
		margin-top: 24px;
	}

	@media (max-width: 540px) {
		.details .row {
			flex-direction: column;
			gap: 6px;
		}

		.details dt {
			flex-basis: auto;
		}
	}
</style>
