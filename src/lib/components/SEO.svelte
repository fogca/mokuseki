<script lang="ts">
	import { page } from '$app/stores';
	import { useI18n } from '$lib/i18n/store.svelte';

	type Props = {
		title: string;
		description: string;
		image?: string;
	};

	let { title, description, image = '/images/ogp.png' }: Props = $props();

	const i18n = useI18n();
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />

	<!-- Open Graph -->
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />
	<meta property="og:locale" content={i18n.t.meta.ogLocale} />
	<meta property="og:url" content={$page.url.href} />

	<!-- Twitter -->
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />

	<!-- Canonical -->
	<link rel="canonical" href={$page.url.href} />
</svelte:head>
