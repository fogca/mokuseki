<script lang="ts">
	import { page } from '$app/state';
	import { useI18n } from '$lib/i18n/store.svelte';

	const i18n = useI18n();
	const notFound = $derived(page.status === 404);
	const e = $derived(i18n.t.errorPage);
</script>

<svelte:head>
	<title>{notFound ? e.notFoundTitle : e.serverTitle}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="error">
	<p class="eyebrow">{page.status}</p>
	<h1 class="h1">{notFound ? e.notFoundTitle : e.serverTitle}</h1>
	<p class="body-sm body-text">{notFound ? e.notFoundBody : e.serverBody}</p>

	<a class="btn" href="/">
		<span>{e.back}</span>
		<span class="arrow" aria-hidden="true">→</span>
	</a>
</section>

<style>
	.error {
		max-width: 560px;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		text-align: left;
		gap: 12px;
		padding-top: clamp(64px, 16vh, 180px);
		padding-bottom: clamp(64px, 16vh, 180px);
	}

	.body-text {
		margin-top: 8px;
	}

	.error .btn {
		margin-top: 28px;
	}
</style>
