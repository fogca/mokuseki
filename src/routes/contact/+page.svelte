<script lang="ts">
	import { useI18n } from '$lib/i18n/store.svelte';
	import SEO from '$lib/components/SEO.svelte';

	const i18n = useI18n();
	const c = $derived(i18n.t.contact);
</script>

<SEO title={i18n.t.meta.contact.title} description={i18n.t.meta.contact.description} />

<section class="contact">
	<header class="head">
		<p class="eyebrow">{c.eyebrow}</p>
		<h1 class="h1">{c.heading}</h1>
		<p class="body-sm lead">
			{#each c.lead.split('\n') as line, i (i)}
				{#if i > 0}<br />{/if}{line}
			{/each}
		</p>
	</header>

	<dl class="details">
		<div class="row">
			<dt class="meta">{c.emailLabel}</dt>
			<dd class="body-sm"><a class="inline-link" href={`mailto:${c.email}`}>{c.email}</a></dd>
		</div>
		<div class="row">
			<dt class="meta">{c.telLabel}</dt>
			<dd class="body-sm">{c.tel}</dd>
		</div>
		<div class="row">
			<dt class="meta">{c.addressLabel}</dt>
			<dd class="body-sm">
				{#each c.address.split('\n') as line, i (i)}
					{#if i > 0}<br />{/if}{line}
				{/each}
			</dd>
		</div>
		<div class="row">
			<dt class="meta">{c.hoursLabel}</dt>
			<dd class="body-sm">{c.hours}</dd>
		</div>
	</dl>

	<p class="body-sm note">{c.note}</p>
</section>

<style>
	.contact {
		max-width: 560px;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		text-align: left;
		gap: 8px;
		padding-top: clamp(48px, 9vh, 120px);
		padding-bottom: clamp(64px, 12vh, 140px);
	}

	.head {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 8px;
	}

	.lead {
		margin-top: 16px;
	}

	.details {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 20px;
		border-top: 1px solid var(--rule);
		border-bottom: 1px solid var(--rule);
		padding: 28px 0;
		margin-top: 36px;
	}

	.row {
		display: flex;
		align-items: baseline;
		gap: 24px;
	}

	.row dt {
		flex: 0 0 96px;
	}

	.note {
		margin-top: 28px;
		max-width: 44ch;
	}

	@media (max-width: 540px) {
		.row {
			flex-direction: column;
			gap: 6px;
		}

		.row dt {
			flex-basis: auto;
		}
	}
</style>
