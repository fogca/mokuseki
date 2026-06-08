<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import LanguageToggle from '$lib/i18n/LanguageToggle.svelte';
	import Wordmark from '$lib/components/Wordmark.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';
	import SiteMenu from '$lib/components/SiteMenu.svelte';
	import { provideI18n } from '$lib/i18n/store.svelte';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';

	const i18n = provideI18n();
	let { children } = $props();

	let menuOpen = $state(false);
	const isTop = $derived($page.url.pathname === '/');

	$effect(() => {
		if (!browser) return;
		document.body.style.overflow = menuOpen ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />

	<!-- Baseline OGP (page-level <SEO /> overrides title / description / image). -->
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={i18n.t.meta.siteName} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@mokuseki" />

	<meta name="theme-color" content="#f6f6f6" />

	<!-- Re-inject the FONTPLUS loader on client navigation so 筑紫オールドゴシック
	     re-applies to newly rendered routes (matches app.html). -->
	<script
		src="https://webfont.fontplus.jp/accessor/script/fontplus.js?kqbwQX--jVA%3D&box=xwiPbvznvro%3D&aa=1&ab=2"
	></script>
</svelte:head>

<div class="shell" lang={i18n.locale}>
	<header class="brand">
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
		</div>

		<a href="/" class="wordmark" aria-label="MOKUSEKI">
			<Wordmark />
		</a>

		<div class="brand-right">
			<LanguageToggle />
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
	-->
	{#if isTop}
		<div class="reserve-dock">
			<a class="btn-sm reserve-floating" href="/reserve">
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
			gap: 12px;
		}

		.brand-left {
			gap: 14px;
		}

		.menu-label {
			display: none;
		}

		.reserve-dock {
			bottom: 16px;
		}
	}
</style>
