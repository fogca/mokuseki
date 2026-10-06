<script lang="ts">
	// Copy that carries the Figma's own line breaks (2026-10 Top redesign).
	// Each line is a .mk-line span: inline (flowing) on SP, a block line from
	// 768px up — or at every width with `always` — see the forced-line policy
	// in base.css. Japanese lines join with no space when they flow; English
	// lines get a space (English is normally a single entry anyway).
	import { useI18n } from '$lib/i18n/store.svelte';

	let { text, always = false }: { text: string | string[]; always?: boolean } = $props();

	const i18n = useI18n();
	const lines = $derived(Array.isArray(text) ? text : text.split('\n'));
	const sep = $derived(i18n.locale === 'ja' ? '' : ' ');
</script>

<span class="mk-lines" class:mk-lines--always={always}
	>{#each lines as line, i (i)}{#if i > 0}{sep}{/if}<span class="mk-line">{line}</span>{/each}</span
>

<style>
	.mk-lines {
		display: block;
	}
</style>
