<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import LanguageToggle from '$lib/i18n/LanguageToggle.svelte';
	import Wordmark from '$lib/components/Wordmark.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';
	import SiteMenu from '$lib/components/SiteMenu.svelte';
	import { provideI18n } from '$lib/i18n/store.svelte';
	import { RESERVE_URL } from '$lib/site';
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
	});

	let menuOpen = $state(false);
	const isTop = $derived($page.url.pathname === '/');

	// On the home page, the header floats transparent over the full-screen
	// hero (white text) until the hero scrolls past, then turns solid.
	let overHero = $state(false);

	$effect(() => {
		if (!browser) return;
		document.body.style.overflow = menuOpen ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	});

	$effect(() => {
		if (!browser) return;
		if ($page.url.pathname !== '/') {
			overHero = false;
			return;
		}
		const update = () => {
			overHero = window.scrollY < window.innerHeight - 120;
		};
		update();
		window.addEventListener('scroll', update, { passive: true });
		window.addEventListener('resize', update);
		return () => {
			window.removeEventListener('scroll', update);
			window.removeEventListener('resize', update);
		};
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />

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
	<header class="brand" class:over-hero={overHero && !menuOpen}>
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

	<SiteFooter />

	<!--
		Floating reservation dock (top page only). The outer .reserve-dock
		owns the horizontal padding (--padding) so the inner button can use
		width: 100% and still keep left/right margins from the viewport.
		Booking now lives entirely on an external platform (see $lib/site),
		so this no longer gates on the (now-unused-for-this-purpose)
		bookingOpen flag — it always shows and opens that platform.
	-->
	{#if isTop}
		<div class="reserve-dock">
			<a class="btn-sm reserve-floating" href={RESERVE_URL} target="_blank" rel="noopener">
				<span>{i18n.t.nav.reserve}</span>
			</a>
		</div>
	{/if}

	<SiteMenu open={menuOpen} onClose={() => (menuOpen = false)} />
</div>

<style>
	.shell {
		min-height: 100vh;
		display: grid;
		grid-template-rows: auto 1fr auto;
		padding-top: clamp(72px, 9vh, 100px);
	}

	/* ─── Fixed header ───────────────────────────────── */
	.brand {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: var(--z-header);
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		padding: 20px clamp(24px, 5vw, 80px) 18px;
		background: var(--bg);
		transition:
			background 400ms ease,
			color 400ms ease;
	}

	/* Transparent header with white controls while over the home hero. */
	.brand.over-hero {
		background: transparent;
	}

	.brand.over-hero .menu-btn {
		color: rgba(255, 255, 255, 0.85);
	}

	.brand.over-hero .wordmark {
		color: var(--white);
	}

	.brand.over-hero :global(.toggle button) {
		color: rgba(255, 255, 255, 0.6);
	}

	.brand.over-hero :global(.toggle button.active),
	.brand.over-hero :global(.toggle button:hover) {
		color: var(--white);
	}

	.brand.over-hero :global(.toggle .sep) {
		color: rgba(255, 255, 255, 0.5);
	}

	.brand.over-hero :global(.toggle-compact) {
		color: rgba(255, 255, 255, 0.7);
	}

	.brand.over-hero :global(.toggle-compact:hover) {
		color: var(--white);
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
		color: var(--ink-faint);
		transition: color 300ms ease;
	}

	.menu-btn:hover {
		color: var(--ink);
	}

	.menu-bars {
		display: inline-flex;
		flex-direction: column;
		gap: 4px;
	}

	.menu-bars span {
		width: 16px;
		height: 1px;
		background: currentColor;
		display: block;
	}

	.wordmark {
		grid-column: 2;
		color: var(--ink);
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

	/* ─── Floating reserve dock ──────────────────────── */
	.reserve-dock {
		position: fixed;
		bottom: 20px;
		left: 0;
		right: 0;
		padding-left: var(--padding);
		padding-right: var(--padding);
		z-index: var(--z-floating);
		pointer-events: none;
	}

	.reserve-floating {
		pointer-events: auto;
		display: flex;
		justify-content: center;
		width: 100%;
		box-shadow: 0 4px 16px rgba(26, 26, 26, 0.15);
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

		.reserve-chip {
			order: 2;
			display: inline-flex;
			align-items: center;
			padding: 8px 14px;
			font-size: 11px;
		}

		.menu-btn {
			order: 3;
		}

		.menu-label {
			display: none;
		}

		.lang-sp {
			order: 4;
			display: inline-flex;
		}

		.lang-desktop {
			display: none;
		}

		/* Redundant with the header's .reserve-chip on SP — hide the
		 * floating bottom dock there; desktop keeps it as its only
		 * persistent reserve CTA. */
		.reserve-dock {
			display: none;
		}
	}
</style>
