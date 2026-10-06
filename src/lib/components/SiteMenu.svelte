<script lang="ts">
	import { tick } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { useI18n } from '$lib/i18n/store.svelte';
	import LanguageToggle from '$lib/i18n/LanguageToggle.svelte';
	import LegalLine from '$lib/components/LegalLine.svelte';
	import { propertyIndex } from '$lib/data/propertyIndex';
	import { RESERVE_URL } from '$lib/site';

	type Props = { open: boolean; onClose: () => void };
	let { open, onClose }: Props = $props();

	const i18n = useI18n();

	const links = $derived([
		{ href: '/', label: i18n.t.footer.nav.home, external: false },
		{ href: '/about', label: i18n.t.footer.nav.about, external: false },
		{ href: '/#concept', label: i18n.t.footer.nav.concept, external: false },
		{ href: '/#area', label: i18n.t.footer.nav.area, external: false },
		// Booking now lives entirely on an external platform (see $lib/site).
		{ href: RESERVE_URL, label: i18n.t.footer.nav.reserve, external: true },
		{ href: '/contact', label: i18n.t.footer.nav.contact, external: false }
	]);

	// Entrance stagger slots (--i) follow reading order at every width:
	// links, then the language row, then the houses label and houses, then
	// the SP legal foot (hidden on PC).
	const langSlot = $derived(links.length);
	const housesSlot = $derived(links.length + 1);
	const footSlot = $derived(housesSlot + 1 + propertyIndex.length);

	const INDEX_DIGITS = 2; // "01" … "04", as in HouseRail's captions
	const houseNumber = (i: number) => String(i + 1).padStart(INDEX_DIGITS, '0');

	let menuEl = $state<HTMLDivElement | null>(null);
	let wasOpen = false;

	// No role=dialog / Tab trap any more: +layout makes main and the footer
	// inert while open (ii), so Tab stays in the sheet plus the header —
	// where the close toggle lives. Focus enters on open and goes back to
	// the toggle on close.
	$effect(() => {
		const isOpen = open;
		if (isOpen && !wasOpen) {
			// After tick the container is no longer inert/hidden, so it's focusable.
			tick().then(() => {
				if (open) menuEl?.querySelector<HTMLElement>('.links a')?.focus({ preventScroll: true });
			});
		} else if (!isOpen && wasOpen) {
			returnFocus();
		}
		wasOpen = isOpen;
	});

	// Only pull focus back when it was in the sheet (or got dropped to <body>
	// as the sheet went inert) — a close fired from the header itself already
	// has focus where it belongs.
	function returnFocus() {
		const active = document.activeElement;
		const lost = !active || active === document.body || (menuEl?.contains(active) ?? false);
		if (!lost) return;
		document.querySelector<HTMLElement>('.Header .menu-btn')?.focus({ preventScroll: true });
	}

	// +layout also closes on navigation; this guard covers history
	// navigation (back/forward) independently of the link click handlers.
	afterNavigate(() => {
		if (open) onClose();
	});

	function handleKeydown(event: KeyboardEvent) {
		if (open && event.key === 'Escape') onClose();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<!--
	Sits BELOW the fixed header (z 30 < --z-header 50) so the menu icon and
	compact lockup never move when the sheet comes down over them.
-->
<div
	bind:this={menuEl}
	class="Menu"
	id="site-menu"
	class:is-open={open}
	inert={!open}
	aria-hidden={!open}
>
	<button class="scrim" type="button" tabindex="-1" aria-label={i18n.t.menu.close} onclick={onClose}
	></button>

	<nav class="sheet" aria-label="Site menu">
		<div class="col col-site">
			<ul class="links">
				{#each links as link, i (link.href)}
					<li class="item" style:--i={i}>
						<a
							class="mk-menu-link"
							href={link.href}
							onclick={onClose}
							target={link.external ? '_blank' : undefined}
							rel={link.external ? 'noopener' : undefined}
						>
							{link.label}
						</a>
					</li>
				{/each}
			</ul>

			<div class="lang item" style:--i={langSlot}>
				<LanguageToggle target />
			</div>
		</div>

		<div class="col col-houses">
			<p
				class="mk-eyebrow houses-label item"
				id="site-menu-houses"
				lang="en"
				style:--i={housesSlot}
			>
				{i18n.t.menu.housesHeading}
			</p>
			<ul class="houses" aria-labelledby="site-menu-houses">
				{#each propertyIndex as p, i (p.slug)}
					<li class="item" style:--i={housesSlot + 1 + i}>
						<a class="house card-hover" href={`/properties/${p.slug}`} onclick={onClose}>
							<!-- PC tiles only; display:none below 1024 keeps the lazy
							     image from loading on SP at all. -->
							<span class="thumb">
								<img class="card-hover-zoom" src={p.image} alt="" loading="lazy" decoding="async" />
							</span>
							<span class="cap">
								<span class="cap-en mk-eyebrow" lang="en">
									<span>{houseNumber(i)}</span>
									<span>{p.name.en}</span>
								</span>
								{#if i18n.locale === 'ja'}
									<span class="cap-ja mk-ja-label" lang="ja">{p.name.ja}</span>
								{/if}
							</span>
						</a>
					</li>
				{/each}
			</ul>
		</div>

		<!-- SP only: the hero's PC legal line is hidden below 1024, so the
		     menu (with the footer) carries the canonical legal links there. -->
		<div class="foot item" style:--i={footSlot}>
			<LegalLine variant="menu" />
		</div>
	</nav>
</div>

<style>
	.Menu {
		/* Motion (ii Menu): the sheet slides with silk easing, items rise in
		 * after it, the hide waits for the slide to finish. */
		--menu-slide: 0.8s;
		--menu-scrim-fade: 0.6s;
		--menu-item-fade: 0.5s;
		--menu-item-rise: 0.7s;
		--menu-item-lead: 0.35s;
		--menu-item-step: 0.06s;
		--menu-item-offset: 12px;
		--menu-fade-reduced: 0.2s;
		--menu-hover: 0.3s;

		/* SP / tablet geometry (spec §5.3) */
		--menu-sp-top-gap: 32px; /* below the 56px bar */
		--menu-sp-bottom: 20px;
		--menu-link-h-sp: 48px;
		--menu-row-h: 44px;
		--menu-lang-gap-sp: 16px;
		--menu-houses-gap: 40px;
		--menu-cap-gap: 12px; /* number → name → 和名, as in the pre-redesign menu */

		/* PC geometry — ii II_Menu (Figma 109:390) */
		--menu-pc-pad-top: 82px;
		--menu-pc-pad-r: 40px;
		--menu-pc-pad-b: 71px;
		--menu-link-gap: 14.6px; /* 53px pitch − 38.4px T8 line box (32 × 1.2) */
		--menu-lang-gap-pc: 24px;
		--menu-tiles-top: 16px;
		--menu-tiles-row-gap: 24px;
		--menu-cap-top: 12px;
		--menu-cap-label-gap: 2em; /* PC tiles: EN caption ↔ 和名 (as HouseRail) */

		/* Shared language label hit area (header uses the same 15/8). */
		--menu-lang-pad-y: 15px;
		--menu-lang-pad-x: 8px;

		position: fixed;
		inset: 0;
		z-index: 30; /* below the fixed header (--z-header 50) */
		visibility: hidden;
		transition: visibility 0s linear var(--menu-slide);
	}

	.Menu.is-open {
		visibility: visible;
		transition-delay: 0s;
	}

	/* Background-colour, not opacity: iOS 26 samples the colour of
	 * edge-fixed elements for the browser chrome even when they're
	 * transparent by opacity, so the closed scrim must have no colour. */
	.scrim {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		padding: 0;
		border: 0;
		appearance: none;
		background-color: transparent;
		cursor: default;
		transition: background-color var(--menu-scrim-fade) var(--mk-ease-out);
	}

	.is-open .scrim {
		background-color: var(--menu-scrim);
	}

	/* SP / tablet: a full-height column sheet (no SP menu frame exists in
	 * Figma — this follows the PC sheet's type and order, as ii does). The
	 * remap turns --bg/--ink into cream/rust on the Top; legacy routes keep
	 * their own palette with the same structure. */
	.sheet {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 100vh;
		height: 100dvh;
		display: flex;
		flex-direction: column;
		padding: calc(var(--mk-bar-h) + var(--menu-sp-top-gap) + env(safe-area-inset-top, 0px))
			var(--mk-chrome-r) calc(var(--menu-sp-bottom) + env(safe-area-inset-bottom, 0px))
			var(--mk-chrome-l);
		background: var(--bg);
		color: var(--ink);
		overflow-y: auto;
		overscroll-behavior: contain;
		transform: translateY(-100%);
		transition: transform var(--menu-slide) var(--mk-ease-silk);
	}

	.is-open .sheet {
		transform: none;
	}

	/* SP / tablet: the sheet scrolls when it's taller than the screen (the
	 * Japanese menu at 375 × 667, or with Safari's toolbars showing). A sticky
	 * band of the sheet's own colour over the bar keeps rows from scrolling
	 * up under the background-less icon and wordmark. The band itself takes
	 * over the sheet's top padding (its height + margin-bottom = the same
	 * 88px to the first link): a sticky box's top: 0 is measured from the
	 * scroller's padding edge, so with the padding kept it would stick 88px
	 * down — over the first link — instead of under the bar. */
	@media (max-width: 1023.98px) {
		.sheet {
			padding-top: 0;
			/* Focus scrolling stops below the band, not under it. */
			scroll-padding-top: calc(var(--mk-bar-h) + env(safe-area-inset-top, 0px));
		}

		.sheet::before {
			content: '';
			position: sticky;
			top: 0;
			z-index: 1;
			flex: none;
			height: calc(var(--mk-bar-h) + env(safe-area-inset-top, 0px));
			margin: 0 calc(-1 * var(--mk-chrome-r)) var(--menu-sp-top-gap) calc(-1 * var(--mk-chrome-l));
			background: var(--bg);
		}
	}

	/* Items enter staggered once the sheet is mostly down; on close they
	 * all leave together (no delay) so nothing lingers behind the slide. */
	.item {
		opacity: 0;
		transform: translateY(var(--menu-item-offset));
		transition:
			opacity var(--menu-item-fade) var(--mk-ease-out),
			transform var(--menu-item-rise) var(--mk-ease-out);
	}

	.is-open .item {
		opacity: 1;
		transform: none;
		transition-delay: calc(var(--menu-item-lead) + var(--i, 0) * var(--menu-item-step));
	}

	.col {
		display: flex;
		flex-direction: column;
	}

	.col-site {
		align-items: flex-start;
	}

	.links {
		display: flex;
		flex-direction: column;
	}

	/* flex li: the link is blockified, so no inline strut pads the pitch. */
	.links li {
		display: flex;
	}

	.links a {
		display: flex;
		align-items: center;
		min-height: var(--menu-link-h-sp);
		transition: color var(--menu-hover) ease;
	}

	.links a:hover,
	.house:hover {
		color: var(--accent);
	}

	/* The label's 15/8 padding is its tap target; the negative margin keeps
	 * its text on the links' left edge. */
	.lang {
		--lang-pad: var(--menu-lang-pad-y) var(--menu-lang-pad-x);
		display: flex;
		align-items: center;
		min-height: var(--menu-row-h);
		margin-top: var(--menu-lang-gap-sp);
		margin-left: calc(-1 * var(--menu-lang-pad-x));
	}

	.col-houses {
		margin-top: var(--menu-houses-gap);
	}

	/* SP: houses are text rows (index · name · 和名), full-width targets. */
	.house {
		display: flex;
		align-items: center;
		min-height: var(--menu-row-h);
		transition: color var(--menu-hover) ease;
	}

	.thumb {
		display: none;
	}

	.cap {
		display: flex;
		align-items: baseline;
		column-gap: var(--menu-cap-gap);
	}

	.cap-en {
		display: inline-flex;
		column-gap: var(--menu-cap-gap);
	}

	/* Pushed to the bottom by the auto margin. The padding is a minimum gap
	 * for short screens, where no free space is left for the auto margin and
	 * the legal line would otherwise sit right on the last house row. */
	.foot {
		--legal-fg: var(--ink);
		margin-top: auto;
		padding-top: var(--menu-houses-gap);
	}

	/* PC (ii II_Menu): a sheet 657/900 of the viewport tall. Column A holds
	 * the links at x 20; column B starts at exactly 50% — the column gap
	 * equals the right/left padding difference, so (W + l − r + gap) / 2 =
	 * W / 2 — giving a 680-wide tile grid (2 × 337 + 6) at 1440. */
	@media (min-width: 1024px) {
		.sheet {
			height: auto;
			min-height: calc(657 / 900 * 100vh);
			/* Short windows (e.g. 1280 × 600): scroll rather than cut off
			 * the tiles while the page itself is scroll-locked. */
			max-height: 100vh;
			max-height: 100dvh;
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			column-gap: max(0px, calc(var(--menu-pc-pad-r) - var(--mk-chrome-l)));
			align-items: start;
			align-content: start;
			padding: var(--menu-pc-pad-top) var(--menu-pc-pad-r) var(--menu-pc-pad-b) var(--mk-chrome-l);
		}

		.links {
			row-gap: var(--menu-link-gap);
		}

		.links a {
			min-height: 0;
		}

		/* 24px from the last link to the label's text; its own 15px top
		 * padding is part of that distance. */
		.lang {
			min-height: 0;
			margin-top: calc(var(--menu-lang-gap-pc) - var(--menu-lang-pad-y));
		}

		.col-houses {
			margin-top: 0;
		}

		.houses {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			column-gap: var(--mk-gap);
			row-gap: var(--menu-tiles-row-gap);
			margin-top: var(--menu-tiles-top);
		}

		.house {
			display: block;
			min-height: 0;
		}

		.thumb {
			display: block;
			aspect-ratio: var(--mk-card-ratio);
			overflow: hidden;
			/* Legacy routes: a neutral placeholder on their grey sheet. */
			background: var(--bg-soft);
		}

		.thumb img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		/* Left-packed with a wider gap before the 和名, not space-between: a
		 * label pushed to the tile's right edge sits 6px from the next tile's
		 * caption and reads as one line with it. */
		.cap {
			margin-top: var(--menu-cap-top);
			column-gap: var(--menu-cap-label-gap);
		}

		.foot {
			display: none;
		}
	}

	/* Top (MKSK): the palette's image placeholder colour. */
	:global(.shell[data-theme='mksk']) .thumb {
		background: var(--mk-blush);
	}

	/* Reduced motion: no slide, no stagger — the sheet just fades. */
	@media (prefers-reduced-motion: reduce) {
		.Menu {
			transition-delay: var(--menu-fade-reduced);
		}

		.scrim {
			transition-duration: var(--menu-fade-reduced);
		}

		.sheet {
			transform: none;
			opacity: 0;
			transition: opacity var(--menu-fade-reduced) linear;
		}

		.is-open .sheet {
			opacity: 1;
		}

		.item,
		.is-open .item {
			opacity: 1;
			transform: none;
			transition: none;
		}
	}
</style>
