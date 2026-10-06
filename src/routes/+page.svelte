<script lang="ts">
	// Top page (2026-10 redesign, Figma "II-ii" MKSK frames). The page is just
	// its sections in order; the cream / band / rust alternation and every
	// Figma value live in the section components under $lib/components/top/.
	// The OP lockup itself belongs to the header (SiteHeader), not this page.
	import { useI18n } from '$lib/i18n/store.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import TopHero from '$lib/components/top/TopHero.svelte';
	import TopConcept from '$lib/components/top/TopConcept.svelte';
	import TopAccommodation from '$lib/components/top/TopAccommodation.svelte';
	import TopDestinations from '$lib/components/top/TopDestinations.svelte';
	import TopAmenity from '$lib/components/top/TopAmenity.svelte';
	import TopReserve from '$lib/components/top/TopReserve.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const i18n = useI18n();
</script>

<SEO
	title={i18n.t.meta.home.title}
	description={i18n.t.meta.home.description}
	jsonLd={{
		'@type': 'LodgingBusiness',
		name: 'MOKUSEKI',
		description: i18n.t.meta.home.description,
		address: { '@type': 'PostalAddress', addressRegion: 'Aichi', addressCountry: 'JP' }
	}}
/>

<div class="mk-top">
	<TopHero />
	<TopConcept />
	<TopAccommodation properties={data.properties} />
	<TopDestinations />
	<TopAmenity />
	<TopReserve />
</div>

<style>
	.mk-top {
		/* Full-bleed: cancels main's side padding, and runs up under the
		 * fixed (background-less) header by exactly the space .shell
		 * reserves for it — the hero is the whole first view. */
		margin-inline: calc(-1 * var(--pad-l)) calc(-1 * var(--pad-r));
		margin-top: calc(-1 * var(--header-space));
		/* The container --mk-inset's cqi resolves against: the column inset
		 * follows the page width, never a percentage parent or the
		 * scrollbar-inclusive vw. */
		container-type: inline-size;
		/* clip, never hidden — hidden would make this a scroll container and
		 * break sticky/scroll behaviour inside (house rule). */
		overflow-x: clip;
		background: var(--mk-cream);
	}
</style>
