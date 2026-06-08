<script lang="ts">
	import { useI18n } from '$lib/i18n/store.svelte';
	import { messages } from '$lib/i18n/messages';
	import SEO from '$lib/components/SEO.svelte';

	const i18n = useI18n();
	const en = messages.en.reserve;

	// Defaults: check-in tomorrow, check-out two days later (2-night stay).
	// Use local-time formatting; toISOString() returns UTC and skews dates near midnight in JST.
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
		d.setDate(d.getDate() + 1);
		return toLocalISO(d);
	});
</script>

<SEO title={i18n.t.meta.reserve.title} description={i18n.t.meta.reserve.description} />

<section class="intro">
	<p class="eyebrow">{en.eyebrow}</p>
	<h1 class="h1">
		{en.ledeLine1}<br />
		{en.ledeLine2}
	</h1>
	{#if i18n.locale === 'ja'}
		<p class="h-ja">{i18n.t.reserve.ledeLine1}{i18n.t.reserve.ledeLine2}</p>
	{/if}
	<p class="body-sm sub">
		{#each i18n.t.reserve.sub.split('\n') as line, i (i)}
			{#if i > 0}<br />{/if}{line}
		{/each}
	</p>
</section>

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
			{#each [1, 2, 3, 4, 5, 6] as n (n)}
				<option value={n}>{i18n.t.reserve.guestUnit(n)}</option>
			{/each}
		</select>
	</div>

	<button type="submit" class="btn">
		<span>{en.submit}</span>
		<span class="arrow" aria-hidden="true">→</span>
	</button>
</form>

<aside class="note">
	<p class="body-sm">
		{i18n.t.reserve.note}<br />
		<a class="inline-link" href="/contact">{i18n.t.reserve.contactLink}</a>
	</p>
</aside>

<style>
	.intro {
		max-width: 580px;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		text-align: left;
		gap: 8px;
		margin-bottom: clamp(56px, 8vh, 88px);
	}

	.intro .sub {
		margin-top: 24px;
	}

	.form {
		width: 100%;
		max-width: 480px;
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

	.note {
		margin-top: clamp(48px, 6vh, 72px);
		max-width: 480px;
		text-align: left;
	}

	@media (max-width: 540px) {
		.field {
			grid-template-columns: 96px 1fr;
			padding: 14px 0;
		}
	}
</style>
