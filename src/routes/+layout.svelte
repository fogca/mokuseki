<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import SiteHeader from '$lib/components/SiteHeader.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';
	import SiteMenu from '$lib/components/SiteMenu.svelte';
	import { provideI18n } from '$lib/i18n/store.svelte';
	import { settle as settleOpening } from '$lib/home/opening';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import type { LayoutData } from './$types';

	let { children, data }: { children: import('svelte').Snippet; data: LayoutData } = $props();
	// Initial value only, by design — after hydration the store itself is the
	// source of truth and setLocale() keeps the cookie in sync.
	// svelte-ignore state_referenced_locally
	const i18n = provideI18n(data.locale);

	// Browser chrome colour. A <meta> can't read CSS tokens, so these mirror
	// base.css by hand: --mk-rust on the Top (its hero and footer are rust),
	// the legacy light page elsewhere.
	const THEME_COLOR_TOP = '#932A00'; // = --mk-rust
	const THEME_COLOR_DEFAULT = '#f6f6f6';
	/** Same 4s as base.css's reveal failsafe: hydrating later than this means
	 *  the failsafe has already shown the content — keep it shown. */
	const REVEAL_ALL_AFTER_MS = 4000;

	// FONTPLUS loads via the deferred <script> in app.html, so the global may
	// not exist yet when navigation callbacks fire. Poll briefly, then run.
	type FontplusApi = { reload: (init?: boolean) => void };
	function whenFontplusReady(cb: (fp: FontplusApi) => void, timeoutMs = 6000) {
		const startedAt = performance.now();
		const poll = () => {
			const fp = (window as unknown as { FONTPLUS?: FontplusApi }).FONTPLUS;
			if (fp && typeof fp.reload === 'function') {
				cb(fp);
				return;
			}
			if (performance.now() - startedAt > timeoutMs) return; // give up silently
			setTimeout(poll, 60);
		};
		poll();
	}

	let menuOpen = $state(false);
	// An error rendered at "/" is not the Top: it keeps the legacy palette
	// and the compact header, or its text would be rust on the rust body.
	const isTop = $derived($page.url.pathname === '/' && !$page.error);

	afterNavigate((nav) => {
		// SvelteKit navigates client-side, so FONTPLUS never re-scans the new
		// DOM on its own. First load ('enter') -> reload(true): reset + fetch
		// all. Real navigations -> reload(false): fetch newly seen chars only.
		if (browser) whenFontplusReady((fp) => fp.reload(nav.type === 'enter'));
		// Any navigation (a menu link, back/forward) lands on the new page
		// with the sheet closed.
		menuOpen = false;
	});

	// A locale switch re-renders the page in the other language without a
	// navigation, so FONTPLUS has the same blind spot: fetch the newly seen
	// glyphs. The first run is the initial locale, already covered above.
	let localeSeen = false;
	$effect(() => {
		void i18n.locale;
		if (!localeSeen) {
			localeSeen = true;
			return;
		}
		whenFontplusReady((fp) => fp.reload(false));
	});

	$effect(() => {
		if (!browser) return;
		document.body.style.overflow = menuOpen ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	});

	// Hydration flags for base.css and the Top's OP CSS: .is-hydrated ends
	// the no-JS failsafes; .reveal-all keeps content the reveal failsafe has
	// already shown from being hidden again by a late hydration.
	onMount(() => {
		const root = document.documentElement;
		root.classList.add('is-hydrated');
		if (performance.now() > REVEAL_ALL_AFTER_MS) root.classList.add('reveal-all');
		// Children mount first, so the Top's hero has already started the OP
		// by now. No hero although the pre-paint script chose to play (a first
		// load of "/" that rendered the error page): settle, or the header
		// would keep the OP's hidden start state with nothing to end it.
		if (root.dataset.op === 'play' && !document.querySelector('.mk-hero')) settleOpening();
	});

	// PWA wiring -- injectRegister:'auto' (vite.config.ts) only patches a
	// static index.html, which doesn't exist here (this app is SSR'd fresh
	// per request, not prerendered), so neither the manifest <link> nor the
	// service worker registration ever reaches a real page without doing
	// both by hand, client-side only: virtual:pwa-info's `pwaInfo` is
	// `undefined` during SSR by the plugin's own design (see its type
	// declaration), so this can't run at the top level or in a $derived --
	// it has to wait for onMount. (Same fix as the sibling OTIF project,
	// where this was traced to two bugs: this missing wiring, and a
	// navigateFallback that broke offline navigation outright -- avoided
	// here from the start via workbox.navigateFallback: undefined above.)
	let webManifestLink = $state('');
	onMount(() => {
		if (!browser) return;
		import('virtual:pwa-info').then(({ pwaInfo }) => {
			if (pwaInfo) webManifestLink = pwaInfo.webManifest.linkTag;
		});
		// registerType:'autoUpdate' means updates apply silently on the next
		// load -- no "new version available" prompt UI to wire up, so the
		// plain vanilla register is enough (not the Svelte-store-returning
		// virtual:pwa-register/svelte, which exists for building that prompt).
		import('virtual:pwa-register').then(({ registerSW }) => {
			registerSW({ immediate: true });
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
	<!-- Empty until onMount resolves virtual:pwa-info (SSR-safe: see PWA wiring above). -->
	{@html webManifestLink}

	<!-- Baseline OGP (page-level <SEO /> overrides title / description / image). -->
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={i18n.t.meta.siteName} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@mokuseki" />

	<meta name="theme-color" content={isTop ? THEME_COLOR_TOP : THEME_COLOR_DEFAULT} />
</svelte:head>

<!-- data-theme: the Top's MKSK palette, bound reactively here (not on <html>)
     so a client navigation swaps it with the page — no palette flash. -->
<div class="shell" lang={i18n.locale} data-theme={isTop ? 'mksk' : undefined}>
	<SiteHeader {isTop} bind:menuOpen onToggleMenu={() => (menuOpen = !menuOpen)} />

	<!-- inert while the menu is open: the sheet is modal without a dialog
	     role — Tab stays in the sheet plus the header's close toggle (ii). -->
	<main class="main" inert={menuOpen}>
		{@render children()}
	</main>

	<!-- flushTop: the Top ends in a full-bleed section that should run
	     straight into the footer, with no page background between them. -->
	<SiteFooter flushTop={isTop} inert={menuOpen} />

	<SiteMenu open={menuOpen} onClose={() => (menuOpen = false)} />
</div>

<style>
	.shell {
		/* Space reserved above the page content for the fixed header. A
		 * variable (inherited by every page) so a page that wants its first
		 * section to run UNDER the transparent header — the home hero — can
		 * pull itself up by exactly this much instead of hard-coding a
		 * second copy of the number. */
		--header-space: clamp(72px, 9vh, 100px);
		min-height: 100vh;
		display: grid;
		grid-template-rows: auto 1fr auto;
		padding-top: var(--header-space);
	}

	.main {
		display: flex;
		flex-direction: column;
	}

	@media (max-width: 540px) {
		/* The SP header's height (unchanged by the 2026-10 redesign — see
		 * SiteHeader: 56px bar), rounded up a hair. Redefines the variable
		 * .shell reads — see its comment. */
		.shell {
			--header-space: 57px;
		}
	}
</style>
