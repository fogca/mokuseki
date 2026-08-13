<script lang="ts">
	import { page } from '$app/stores';
	import { SITE_ORIGIN } from '$lib/site';
	import { useI18n } from '$lib/i18n/store.svelte';

	type Props = {
		title: string;
		description: string;
		image?: string;
		// Transactional pages (results / booking / confirmation) should not
		// be indexed.
		noindex?: boolean;
		// Optional schema.org structured data, rendered as JSON-LD.
		jsonLd?: Record<string, unknown>;
	};

	let { title, description, image = '/images/ogp.jpg', noindex = false, jsonLd }: Props = $props();

	const i18n = useI18n();

	const origin = $derived(SITE_ORIGIN ?? $page.url.origin);
	// Canonical: pathname only — query strings (search criteria, notices)
	// must not produce distinct canonical URLs.
	const canonical = $derived(`${origin}${$page.url.pathname}`);
	// OG/Twitter images must be absolute URLs.
	const imageAbs = $derived(new URL(image, origin).href);

	const jsonLdText = $derived(
		jsonLd ? JSON.stringify({ '@context': 'https://schema.org', ...jsonLd }) : null
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	{#if noindex}
		<meta name="robots" content="noindex" />
	{/if}

	<!-- Open Graph -->
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={imageAbs} />
	<meta property="og:locale" content={i18n.t.meta.ogLocale} />
	<meta property="og:url" content={canonical} />

	<!-- Twitter -->
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageAbs} />

	<!-- Canonical -->
	<link rel="canonical" href={canonical} />

	{#if jsonLdText}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- serialized JSON, no user input -->
		{@html `<script type="application/ld+json">${jsonLdText}${'</'}script>`}
	{/if}
</svelte:head>
