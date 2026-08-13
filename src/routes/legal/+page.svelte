<script lang="ts">
	import { useI18n } from '$lib/i18n/store.svelte';
	import SEO from '$lib/components/SEO.svelte';

	const i18n = useI18n();
	const t = $derived(i18n.t.tokushoho);
</script>

<SEO title={i18n.t.meta.tokushoho.title} description={i18n.t.meta.tokushoho.description} />

<article class="legal">
	<header class="head">
		<p class="eyebrow">{t.eyebrow}</p>
		<h1 class="h1">{t.heading}</h1>
		<p class="meta draft">{t.note}</p>
	</header>

	<dl class="rows">
		{#each t.rows as row (row.label)}
			<div class="row">
				<dt class="meta">{row.label}</dt>
				<dd class="body-sm">{row.value}</dd>
			</div>
		{/each}
	</dl>
</article>

<style>
	.legal {
		max-width: 640px;
		padding-top: clamp(48px, 9vh, 120px);
		padding-bottom: clamp(64px, 12vh, 140px);
	}

	.head {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 8px;
		margin-bottom: clamp(36px, 6vh, 64px);
	}

	.draft {
		margin-top: 16px;
		color: var(--ink-faint);
	}

	.rows {
		display: flex;
		flex-direction: column;
	}

	.row {
		display: flex;
		gap: 24px;
		padding: 20px 0;
		border-top: 1px solid var(--rule);
	}

	.row:last-child {
		border-bottom: 1px solid var(--rule);
	}

	.row dt {
		flex: 0 0 180px;
	}

	.row dd {
		flex: 1;
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
