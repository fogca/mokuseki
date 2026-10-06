<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import LanguageToggle from '$lib/i18n/LanguageToggle.svelte';
	import Wordmark from '$lib/components/Wordmark.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';
	import SiteMenu from '$lib/components/SiteMenu.svelte';
	import { provideI18n } from '$lib/i18n/store.svelte';
	import { RESERVE_URL } from '$lib/site';
	import { HERO_IMAGE_START_EVENT } from '$lib/heroEvents';
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

	afterNavigate((nav) => {
		// SvelteKit navigates client-side, so FONTPLUS never re-scans the new
		// DOM on its own. First load ('enter') -> reload(true): reset + fetch
		// all. Real navigations -> reload(false): fetch newly seen chars only.
		if (browser) whenFontplusReady((fp) => fp.reload(nav.type === 'enter'));
		// A new page brings its own dark/light sections — re-probe what's
		// under the header.
		queueHeaderTheme();
	});

	let menuOpen = $state(false);
	const isTop = $derived($page.url.pathname === '/');

	// ─── Header text color (the header has no background) ─────────────────
	// With no fill behind it, the header's text has to follow whatever it is
	// currently sitting on: white over the hero photo (the home page's
	// first view), ink over the light page. Sections that are dark (a photo,
	// or the --ink CTA/footer) opt in with data-header="dark"; the header
	// checks which tagged section covers its vertical center. Probing by
	// position, not by "scrollY === 0", means the white holds for as long as
	// the hero is still behind the header, not just at the very top.
	// Starts true on the home page so SSR/first paint is already white there
	// (no dark-to-white flash); every other route starts light.
	let overDark = $state($page.url.pathname === '/');
	let headerEl = $state<HTMLElement | null>(null);
	let themeRaf = 0;

	function updateHeaderTheme() {
		if (!headerEl) return;
		const probeY = headerEl.getBoundingClientRect().height / 2;
		overDark = Array.from(document.querySelectorAll('[data-header="dark"]')).some((el) => {
			const r = el.getBoundingClientRect();
			return r.top <= probeY && r.bottom > probeY;
		});
	}

	function queueHeaderTheme() {
		if (!browser) return;
		cancelAnimationFrame(themeRaf);
		themeRaf = requestAnimationFrame(updateHeaderTheme);
	}

	$effect(() => {
		if (!browser) return;
		window.addEventListener('scroll', queueHeaderTheme, { passive: true });
		window.addEventListener('resize', queueHeaderTheme);
		queueHeaderTheme();
		return () => {
			window.removeEventListener('scroll', queueHeaderTheme);
			window.removeEventListener('resize', queueHeaderTheme);
			cancelAnimationFrame(themeRaf);
		};
	});

	$effect(() => {
		if (!browser) return;
		document.body.style.overflow = menuOpen ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	});

	// Header entrance, synced to the hero's OP effect (see +page.svelte):
	// hidden on the home page until the hero photo starts revealing, then
	// fades/slides in at that exact instant (HERO_IMAGE_START_EVENT). Off
	// the home page — or if that event never arrives (safety timeout below)
	// — the header is just shown; it never gets stuck invisible.
	let headerRevealed = $state(true);

	$effect(() => {
		if (!browser) return;
		if (!isTop) {
			headerRevealed = true;
			return;
		}
		headerRevealed = false;
		const reveal = () => (headerRevealed = true);
		document.addEventListener(HERO_IMAGE_START_EVENT, reveal, { once: true });
		const fallback = window.setTimeout(reveal, 3500);
		return () => {
			document.removeEventListener(HERO_IMAGE_START_EVENT, reveal);
			window.clearTimeout(fallback);
		};
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

	<meta name="theme-color" content="#f6f6f6" />
</svelte:head>

<div class="shell" lang={i18n.locale}>
	<header
		class="brand"
		class:brand-hero-sync={isTop}
		class:is-revealed={headerRevealed}
		class:on-dark={overDark && !menuOpen}
		bind:this={headerEl}
	>
		<div class="brand-left">
			<button
				class="meta menu-btn"
				type="button"
				aria-expanded={menuOpen}
				onclick={() => (menuOpen = !menuOpen)}
			>
				<span class="menu-bars" class:open={menuOpen} aria-hidden="true">
					<span></span>
					<span></span>
				</span>
				<span class="menu-label">
					{menuOpen ? i18n.t.menu.close : i18n.t.menu.open}
				</span>
			</button>
			<!-- SP only — compact language switch (active locale only, tap to
			     flip); reordered to sit rightmost of the SP row (Reserve →
			     Menu → Language) via .brand-left { display: contents } and
			     flex `order` — see @media 540px below. Hidden on desktop
			     (the .brand-right instance below is used there instead). -->
			<div class="lang-sp"><LanguageToggle compact /></div>
		</div>

		<a href="/" class="wordmark" aria-label="MOKUSEKI">
			<Wordmark />
		</a>

		<div class="brand-right">
			<div class="lang-desktop"><LanguageToggle /></div>
			<!-- SP only — colored booking badge; reordered to sit right after
			     the (now left-aligned) wordmark, before Menu/Language. -->
			<a class="btn-sm reserve-chip" href={RESERVE_URL} target="_blank" rel="noopener">
				<span>Reserve</span>
			</a>
		</div>
	</header>

	<main class="main">
		{@render children()}
	</main>

	<!-- flushTop: the home page's CTA section is already dark/full-bleed
	     (see +page.svelte) and should read as one continuous block with
	     the footer below it — no gap gets the page's light background to
	     show through between them. -->
	<SiteFooter flushTop={isTop} />

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

	/* ─── Fixed header ───────────────────────────────── */
	/* No background of its own — the page (or the hero photo) shows through.
	 * Text color comes from --hdr-fg / --hdr-fg-soft so everything in the
	 * header (wordmark, Menu, language toggle) flips together; see the
	 * overDark logic in the script. */
	.brand {
		--hdr-fg: var(--ink);
		--hdr-fg-soft: var(--ink-faint);
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: var(--z-header);
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		padding: 20px clamp(24px, 5vw, 80px) 18px;
		background: transparent;
		color: var(--hdr-fg);
		transition: color 400ms ease;
	}

	/* Over a dark section (the hero photo, the dark CTA/footer): white. Not
	 * while the menu is open — that overlay is a light full-screen panel
	 * sitting under the header, where white text would vanish. */
	.brand.on-dark {
		--hdr-fg: var(--white);
		--hdr-fg-soft: rgba(255, 255, 255, 0.7);
	}

	/* Home-page-only entrance, synced to the hero's OP effect via
	 * headerRevealed (see script above) — hidden until the hero photo
	 * starts revealing, then fades/slides down into place. Off the home
	 * page .brand-hero-sync is never applied, so the header just shows. */
	.brand.brand-hero-sync {
		opacity: 0;
		transform: translateY(-16px);
		transition:
			opacity 900ms var(--ease-default),
			transform 900ms var(--ease-default),
			color 400ms ease;
	}

	.brand.brand-hero-sync.is-revealed {
		opacity: 1;
		transform: translateY(0);
	}

	@media (prefers-reduced-motion: reduce) {
		.brand.brand-hero-sync {
			opacity: 1;
			transform: none;
			transition: color 400ms ease;
		}
	}

	.brand-left {
		grid-column: 1;
		justify-self: start;
		display: inline-flex;
		align-items: center;
		gap: 24px;
	}

	.brand-right {
		grid-column: 3;
		justify-self: end;
		display: inline-flex;
		align-items: center;
		gap: 16px;
	}

	/* SP-only header elements — hidden by default, swapped in at the 540px
	 * breakpoint below (see also .lang-desktop / .reserve-chip there). */
	.lang-sp {
		display: none;
	}

	.reserve-chip {
		display: none;
	}

	.menu-btn {
		appearance: none;
		background: transparent;
		border: none;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding: 4px 0;
		color: var(--hdr-fg-soft);
		transition: color 300ms ease;
	}

	.menu-btn:hover {
		color: var(--hdr-fg);
	}

	.menu-bars {
		position: relative;
		display: inline-block;
		width: 16px;
		height: 6px; /* 2 × 1px bar + 4px gap */
	}

	.menu-bars span {
		position: absolute;
		left: 0;
		width: 100%;
		height: 1px;
		background: currentColor;
		top: 0;
		transition:
			top 300ms ease,
			transform 300ms ease;
	}

	.menu-bars span:last-child {
		top: 5px;
	}

	/* Morphs into an ✕ when the menu is open — both bars meet at the
	 * container's vertical center and rotate to cross. */
	.menu-bars.open span {
		top: 2.5px;
	}

	.menu-bars.open span:first-child {
		transform: rotate(45deg);
	}

	.menu-bars.open span:last-child {
		transform: rotate(-45deg);
	}

	.wordmark {
		grid-column: 2;
		color: var(--hdr-fg);
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		line-height: 0;
	}

	.wordmark :global(svg) {
		height: clamp(14px, 1.4vw, 18px);
		width: auto;
		display: block;
	}

	.main {
		display: flex;
		flex-direction: column;
	}

	@media (max-width: 540px) {
		.brand {
			/* Grid → flex row: logo left, everything else clustered right
			 * (Reserve, Menu, Language, in that order). */
			display: flex;
			align-items: center;
			gap: 10px;
			/* -8px total header height (was 20px/18px top/bottom). */
			padding-top: 16px;
			padding-bottom: 14px;
		}

		/* The header shrank (see .brand above) and the space reserved for
		 * it never followed, leaving a ~17px gap. Measured: .brand's actual
		 * height at this breakpoint is 56.2px; 57px rounds up a hair for
		 * safety. (Redefines the variable .shell reads — see its comment.) */
		.shell {
			--header-space: 57px;
		}

		/* .brand-left/.brand-right are just DOM grouping — display: contents
		 * lets their children become direct flex items of .brand so each
		 * can carry its own `order`, regardless of nesting. */
		.brand-left,
		.brand-right {
			display: contents;
		}

		.wordmark {
			order: 1;
			/* Pushes every later (order > 1) item to the right. */
			margin-right: auto;
		}

		.wordmark :global(svg) {
			height: 15px;
		}

		.lang-sp {
			order: 2;
			display: inline-flex;
		}

		.reserve-chip {
			order: 4;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			/* Full header height: stretch the flex item, then bleed past
			 * .brand's own padding with matching negative margins so the
			 * fill reaches the true top/bottom edge AND (being the last,
			 * rightmost item) the true right edge too. */
			align-self: stretch;
			margin-block: -16px -14px;
			margin-right: calc(-1 * clamp(24px, 5vw, 80px));
			padding: 0 19px;
			font-size: 12.5px;
		}

		.reserve-chip span {
			transform: translateY(2px);
		}

		.menu-btn {
			order: 3;
		}

		.menu-bars {
			width: 20px;
			height: 7px; /* 2 × 1px bar + 5px gap */
		}

		.menu-bars span:last-child {
			top: 6px;
		}

		.menu-bars.open span {
			top: 3px;
		}

		.menu-label {
			display: none;
		}

		.lang-desktop {
			display: none;
		}
	}
</style>
