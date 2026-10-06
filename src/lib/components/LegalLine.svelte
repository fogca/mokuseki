<script lang="ts">
	// The legal line (2026-10 Top redesign; Figma 218:604 bottom-left —
	// "Legal Company Cookies" / "©II All Rights Reserved, 2026" there are
	// the II site's placeholders, replaced with MOKUSEKI's real links).
	// Colour comes from --legal-fg, set by whichever parent places it
	// (hero / menu / footer). `decorative`: the hero copy duplicates the
	// footer's, so it's hidden from assistive tech and out of the Tab order.
	import { useI18n } from '$lib/i18n/store.svelte';

	type Variant = 'hero' | 'menu' | 'footer';
	let { variant, decorative = false }: { variant: Variant; decorative?: boolean } = $props();

	const i18n = useI18n();
	const links = $derived([
		{ href: '/privacy', label: i18n.t.footer.legal.privacy },
		{ href: '/terms', label: i18n.t.footer.legal.terms },
		{ href: '/legal', label: i18n.t.footer.legal.tokushoho }
	]);
</script>

<div class="mk-legal legal legal--{variant}" aria-hidden={decorative ? 'true' : undefined}>
	<ul class="links">
		{#each links as l (l.href)}
			<li><a href={l.href} tabindex={decorative ? -1 : undefined}>{l.label}</a></li>
		{/each}
	</ul>
	<p class="copy">{i18n.t.footer.copy}</p>
</div>

<style>
	.legal {
		/* Figma: the © starts at x=312 of the 1440 frame, links at x=20. */
		--legal-copy-x: 312px;
		color: var(--legal-fg, currentColor);
		position: relative;
	}

	.links {
		display: flex;
		flex-wrap: wrap;
		column-gap: 0.9em; /* ii LEGAL_LINKS spacing */
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.links a {
		color: inherit;
		text-decoration: none;
	}

	.links a:hover {
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.copy {
		margin: 0;
		white-space: pre;
	}

	/* PC hero / footer: one row — links from the left edge, © pinned at
	 * Figma's x=312 (the parent places this box flush with the viewport's
	 * left, padded by --mk-chrome-l). */
	@media (min-width: 1024px) {
		.legal--hero,
		.legal--footer {
			padding-left: var(--mk-chrome-l);
		}

		.legal--hero .copy,
		.legal--footer .copy {
			position: absolute;
			top: 0;
			left: var(--legal-copy-x);
		}
	}

	/* Below 1024 (and the menu at every width): links wrap in a row with
	 * 44px-tall tap targets, the © on its own line beneath. */
	@media (max-width: 1023.98px) {
		.legal--footer .links a,
		.legal--menu .links a {
			display: inline-block;
			padding: 17px 8px;
			margin-left: -8px;
		}
	}

	.legal--menu .links a {
		display: inline-block;
		padding: 17px 8px;
		margin-left: -8px;
	}
</style>
