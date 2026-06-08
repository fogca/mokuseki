<script lang="ts">
	import { useI18n } from '$lib/i18n/store.svelte';
	import SEO from '$lib/components/SEO.svelte';

	const i18n = useI18n();
	const t = $derived(i18n.t.terms);
	const legal = $derived(i18n.t.legal);
</script>

<SEO title={i18n.t.meta.terms.title} description={i18n.t.meta.terms.description} />

<article class="legal">
	<header class="head">
		<p class="eyebrow">{t.eyebrow}</p>
		<h1 class="h1">{t.heading}</h1>
		<p class="body-sm intro">{t.intro}</p>
		<p class="meta draft">{legal.draftNotice}</p>
	</header>

	<div class="sections">
		{#each t.sections as section (section.heading)}
			<section class="block">
				<h2 class="h3">{section.heading}</h2>
				<p class="body-sm">{section.body}</p>
			</section>
		{/each}
	</div>

	<p class="meta effective">{legal.effectiveLabel}: {legal.effective}</p>
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

	.intro {
		margin-top: 16px;
		max-width: 52ch;
	}

	.draft {
		margin-top: 16px;
		color: var(--ink-faint);
	}

	.sections {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.block {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 28px 0;
		border-top: 1px solid var(--rule);
	}

	.block:last-child {
		border-bottom: 1px solid var(--rule);
	}

	.block .body-sm {
		max-width: 56ch;
	}

	.effective {
		margin-top: 32px;
		color: var(--ink-faint);
	}
</style>
