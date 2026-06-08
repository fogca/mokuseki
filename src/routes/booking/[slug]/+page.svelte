<script lang="ts">
	import { enhance } from '$app/forms';
	import { useI18n } from '$lib/i18n/store.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import type { GuestDetails } from '$lib/types/domain';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	const i18n = useI18n();

	type Step = 'details' | 'review';
	let step = $state<Step>('details');
	let submitting = $state(false);

	// Seed from a failed submission so the guest never loses what they typed.
	// Read once at init; subsequent edits live in the fields' own state.
	// svelte-ignore state_referenced_locally
	const seed = form?.values;
	let lastName = $state(seed?.lastName ?? '');
	let firstName = $state(seed?.firstName ?? '');
	let email = $state(seed?.email ?? '');
	let phone = $state(seed?.phone ?? '');
	let notes = $state(seed?.notes ?? '');

	// Client-side mirror of the server validation, so the review step is only
	// reachable with a complete, well-formed party. Server re-validates anyway.
	const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	let clientErrors = $state<Partial<Record<keyof GuestDetails, 'required' | 'email'>>>({});

	function validate(): boolean {
		const e: Partial<Record<keyof GuestDetails, 'required' | 'email'>> = {};
		if (!lastName.trim()) e.lastName = 'required';
		if (!firstName.trim()) e.firstName = 'required';
		if (!email.trim()) e.email = 'required';
		else if (!EMAIL_RE.test(email.trim())) e.email = 'email';
		if (!phone.trim()) e.phone = 'required';
		clientErrors = e;
		return Object.keys(e).length === 0;
	}

	function toReview() {
		if (validate()) {
			step = 'review';
			if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	function errorText(field: keyof GuestDetails): string | null {
		const code = clientErrors[field];
		if (!code) return null;
		return code === 'email' ? i18n.t.booking.errors.email : i18n.t.booking.errors.required;
	}

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

	const p = $derived(data.property);
	const q = $derived(data.quote);
	const resultsHref = $derived(
		`/reserve/results?checkIn=${q.checkIn}&checkOut=${q.checkOut}&guests=${q.guests}`
	);
</script>

<SEO title={i18n.t.meta.booking.title} description={i18n.t.meta.booking.description} />

<div class="booking-grid">
	<!-- ─── Stay summary (sticky) ─────────────────────────── -->
	<aside class="stay">
		<p class="eyebrow">{i18n.t.booking.stayHeading}</p>
		<header class="house">
			<h2 class="h2">{p.name.en}</h2>
			{#if i18n.locale === 'ja'}
				<p class="h-ja">{p.name.ja}</p>
			{/if}
			<p class="meta">{p.location[i18n.locale]}</p>
		</header>

		<dl class="facts">
			<div class="row">
				<dt class="meta">{i18n.t.reserve.checkIn}</dt>
				<dd class="body-sm">{dateFmt.format(new Date(q.checkIn))}</dd>
			</div>
			<div class="row">
				<dt class="meta">{i18n.t.reserve.checkOut}</dt>
				<dd class="body-sm">{dateFmt.format(new Date(q.checkOut))}</dd>
			</div>
			<div class="row">
				<dt class="meta">{i18n.t.booking.nightsHeading}</dt>
				<dd class="body-sm">{i18n.t.results.summaryNights(q.nights)}</dd>
			</div>
			<div class="row">
				<dt class="meta">{i18n.t.reserve.guests}</dt>
				<dd class="body-sm">{i18n.t.reserve.guestUnit(q.guests)}</dd>
			</div>
		</dl>

		<dl class="price">
			<div class="row">
				<dt class="meta">{i18n.t.booking.subtotal}</dt>
				<dd class="body-sm">{yen.format(q.subtotal)}</dd>
			</div>
			<div class="row">
				<dt class="meta">{i18n.t.booking.taxes}</dt>
				<dd class="body-sm">{yen.format(q.taxes)}</dd>
			</div>
			<div class="row total">
				<dt class="meta">{i18n.t.booking.total}</dt>
				<dd class="total-amount">{yen.format(q.total)}</dd>
			</div>
		</dl>

		<a class="inline-link meta back" href={resultsHref}>{i18n.t.booking.backToResults}</a>
	</aside>

	<!-- ─── Guest details / review ───────────────────────── -->
	<section class="panel">
		<header class="panel-head">
			<p class="eyebrow">{i18n.t.booking.eyebrow}</p>
			<h1 class="h1">{i18n.t.booking.heading}</h1>
			<ol class="steps" aria-hidden="true">
				<li class="meta" class:active={step === 'details'}>{i18n.t.booking.steps.details}</li>
				<li class="meta" class:active={step === 'review'}>{i18n.t.booking.steps.review}</li>
			</ol>
		</header>

		<form
			method="POST"
			use:enhance={() => {
				submitting = true;
				return async ({ update }) => {
					await update();
					submitting = false;
				};
			}}
		>
			<!-- Details step. Kept mounted during review so values still submit. -->
			<fieldset class="fields" hidden={step === 'review'}>
				<p class="body-sm intro">{i18n.t.booking.guestIntro}</p>

				<div class="grid-2">
					<div class="field">
						<label class="meta" for="lastName">{i18n.t.booking.lastName}</label>
						<input
							id="lastName"
							name="lastName"
							type="text"
							autocomplete="family-name"
							bind:value={lastName}
						/>
						{#if errorText('lastName')}<p class="err meta">{errorText('lastName')}</p>{/if}
					</div>
					<div class="field">
						<label class="meta" for="firstName">{i18n.t.booking.firstName}</label>
						<input
							id="firstName"
							name="firstName"
							type="text"
							autocomplete="given-name"
							bind:value={firstName}
						/>
						{#if errorText('firstName')}<p class="err meta">{errorText('firstName')}</p>{/if}
					</div>
				</div>

				<div class="field">
					<label class="meta" for="email">{i18n.t.booking.email}</label>
					<input id="email" name="email" type="email" autocomplete="email" bind:value={email} />
					{#if errorText('email')}<p class="err meta">{errorText('email')}</p>{/if}
				</div>

				<div class="field">
					<label class="meta" for="phone">{i18n.t.booking.phone}</label>
					<input id="phone" name="phone" type="tel" autocomplete="tel" bind:value={phone} />
					{#if errorText('phone')}<p class="err meta">{errorText('phone')}</p>{/if}
				</div>

				<div class="field">
					<label class="meta" for="notes">
						{i18n.t.booking.notes}
						<span class="optional">{i18n.t.booking.notesOptional}</span>
					</label>
					<textarea
						id="notes"
						name="notes"
						rows="3"
						placeholder={i18n.t.booking.notesPlaceholder}
						bind:value={notes}
					></textarea>
				</div>

				<button type="button" class="btn next" onclick={toReview}>
					<span>{i18n.t.booking.reviewCta}</span>
					<span class="arrow" aria-hidden="true">→</span>
				</button>
			</fieldset>

			<!-- Review step. -->
			{#if step === 'review'}
				<div class="review">
					<h2 class="h3 review-head">{i18n.t.booking.reviewHeading}</h2>
					<p class="body-sm intro">{i18n.t.booking.reviewIntro}</p>

					<dl class="review-list">
						<div class="row">
							<dt class="meta">{i18n.t.booking.guestHeading}</dt>
							<dd class="body-sm">{i18n.t.booking.guestName(lastName.trim(), firstName.trim())}</dd>
						</div>
						<div class="row">
							<dt class="meta">{i18n.t.booking.email}</dt>
							<dd class="body-sm">{email.trim()}</dd>
						</div>
						<div class="row">
							<dt class="meta">{i18n.t.booking.phone}</dt>
							<dd class="body-sm">{phone.trim()}</dd>
						</div>
						{#if notes.trim()}
							<div class="row">
								<dt class="meta">{i18n.t.booking.notes}</dt>
								<dd class="body-sm">{notes.trim()}</dd>
							</div>
						{/if}
					</dl>

					{#if form?.errors}
						<p class="err meta server-err">{i18n.t.booking.errors.required}</p>
					{/if}

					<p class="meta mock-notice">{i18n.t.booking.mockNotice}</p>

					<div class="actions">
						<button type="submit" class="btn submit" disabled={submitting}>
							<span>{submitting ? i18n.t.booking.submitting : i18n.t.booking.submit}</span>
							<span class="arrow" aria-hidden="true">→</span>
						</button>
						<button type="button" class="text-btn meta" onclick={() => (step = 'details')}>
							{i18n.t.booking.editCta}
						</button>
					</div>
				</div>
			{/if}
		</form>
	</section>
</div>

<style>
	.booking-grid {
		display: grid;
		grid-template-columns: 320px 1fr;
		gap: 80px;
		padding-top: clamp(40px, 7vh, 96px);
		padding-bottom: clamp(64px, 10vh, 120px);
		align-items: start;
	}

	/* ─── Stay summary ───────────────────────────────────── */
	.stay {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 24px;
		position: sticky;
		top: 96px;
	}

	.stay .house {
		display: flex;
		flex-direction: column;
		gap: 7px;
	}

	.facts,
	.price {
		display: flex;
		flex-direction: column;
		gap: 14px;
		border-top: 1px solid var(--rule);
		padding-top: 20px;
	}

	.facts {
		border-bottom: 1px solid var(--rule);
		padding-bottom: 20px;
	}

	.row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 16px;
	}

	.row dd {
		text-align: right;
	}

	.price .total {
		margin-top: 6px;
		padding-top: 16px;
		border-top: 1px solid var(--rule);
		opacity: 1;
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

	.stay .back {
		margin-top: 4px;
		align-self: flex-start;
	}

	/* ─── Panel ──────────────────────────────────────────── */
	.panel {
		min-width: 0;
		max-width: 620px;
	}

	.panel-head {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 8px;
		margin-bottom: clamp(36px, 5vh, 56px);
	}

	.steps {
		display: flex;
		gap: 28px;
		margin-top: 12px;
	}

	.steps li {
		position: relative;
		color: var(--ink-faint);
		transition: color 300ms ease;
	}

	.steps li.active {
		color: var(--ink);
	}

	/* ─── Fields ─────────────────────────────────────────── */
	.fields {
		border: none;
		display: flex;
		flex-direction: column;
		gap: 28px;
	}

	/* Kept mounted (so values still submit) but visually removed during review.
	 * Overrides .fields' display:flex, which otherwise beats UA [hidden]. */
	.fields[hidden] {
		display: none;
	}

	.intro {
		margin: 0;
	}

	.grid-2 {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 28px;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.field label {
		display: flex;
		align-items: baseline;
		gap: 8px;
	}

	.optional {
		color: var(--ink-faint);
		font-size: 12px;
	}

	.field input,
	.field textarea {
		appearance: none;
		-webkit-appearance: none;
		background: transparent;
		border: none;
		border-bottom: 1px solid var(--rule);
		font-family: var(--display);
		font-size: var(--fs-body);
		font-weight: 300;
		letter-spacing: 0;
		line-height: var(--lh-en);
		color: var(--ink);
		padding: 8px 0;
		transition: border-color 300ms ease;
	}

	.field textarea {
		resize: vertical;
		font-family: var(--ja-body);
		line-height: var(--lh-ja);
	}

	.field input:focus,
	.field textarea:focus {
		outline: none;
		border-color: var(--accent);
	}

	.field input::placeholder,
	.field textarea::placeholder {
		color: var(--ink-faint);
	}

	.err {
		color: #9a3b32;
	}

	.next {
		margin-top: 12px;
		align-self: flex-start;
	}

	/* ─── Review ─────────────────────────────────────────── */
	.review {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 20px;
	}

	.review-head {
		margin-bottom: 0;
	}

	.review-list {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 16px;
		border-top: 1px solid var(--rule);
		border-bottom: 1px solid var(--rule);
		padding: 24px 0;
	}

	.review-list .row {
		justify-content: flex-start;
		gap: 24px;
	}

	.review-list dt {
		flex: 0 0 140px;
	}

	.review-list dd {
		text-align: left;
	}

	.mock-notice {
		color: var(--ink-faint);
	}

	.server-err {
		margin-top: 4px;
	}

	.actions {
		display: flex;
		align-items: center;
		gap: 28px;
		margin-top: 8px;
	}

	.submit[disabled] {
		opacity: 0.55;
		cursor: progress;
	}

	.text-btn {
		background: none;
		border: none;
		color: var(--ink-soft);
		cursor: pointer;
		border-bottom: 1px solid currentColor;
		padding: 0 0 1px;
		transition: color 300ms ease;
	}

	.text-btn:hover {
		color: var(--ink);
	}

	/* ─── Responsive ─────────────────────────────────────── */
	@media (max-width: 880px) {
		.booking-grid {
			grid-template-columns: 1fr;
			gap: 48px;
		}

		.stay {
			position: static;
			top: auto;
			order: 2;
		}

		.panel {
			order: 1;
			max-width: none;
		}
	}

	@media (max-width: 540px) {
		.grid-2 {
			grid-template-columns: 1fr;
			gap: 28px;
		}

		.actions {
			flex-direction: column;
			align-items: stretch;
			gap: 20px;
		}

		.review-list .row {
			flex-direction: column;
			gap: 6px;
		}

		.review-list dt {
			flex-basis: auto;
		}
	}
</style>
