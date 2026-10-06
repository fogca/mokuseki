<script lang="ts">
	// Site header (2026-10 Top redesign, Figma "II-ii" MKSK 218:604 / 218:637 /
	// 220:663). Zero-height and background-less on every route; every part is
	// absolutely placed, so it never blocks the page beyond what it draws.
	//
	// The lockup IS the Top's opening logo: on the Top the wordmark and the
	// tagline start big (the OP / resting frame) and FLIP into the small
	// centred lockup once the page scrolls (220:663) — one continuous element,
	// no overlay copy. Both layouts live in CSS: the visible parts sit at the
	// big geometry, invisible "slots" at the compact one, and measure() only
	// writes the difference as --tx / --ty / --k (august Header.svelte).
	// Off the Top the lockup is simply compact (no tagline, no FLIP).
	//
	// GUARD: never give .lk-mark, .lk-tag or the slots a base transform or
	// margin — box() reads their untransformed left/top/width, and the compact
	// transform is computed from exactly those.
	import { onMount, tick } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import Wordmark from '$lib/components/Wordmark.svelte';
	import LanguageToggle from '$lib/i18n/LanguageToggle.svelte';
	import { useI18n } from '$lib/i18n/store.svelte';
	import { RESERVE_URL } from '$lib/site';

	type Props = {
		isTop: boolean;
		menuOpen?: boolean;
		onToggleMenu?: () => void;
	};
	let { isTop, menuOpen = $bindable(false), onToggleMenu }: Props = $props();

	/** Scroll distance (px) past which the Top's lockup goes compact. */
	const COMPACT_AFTER_PX = 8;
	/** Scroll movement (px) that counts as a direction change for tuck-away. */
	const TUCK_DELTA_PX = 8;
	/** Frames between measuring and enabling transitions: the measured state
	 *  must be painted first, or it would animate in from the stale one. */
	const ARM_FRAMES = 3;

	const i18n = useI18n();
	const tagline = $derived(i18n.t.home.op.tagline);

	let headerEl = $state<HTMLElement>();
	let markEl = $state<HTMLElement>();
	let markSlotEl = $state<HTMLElement>();
	let tagEl = $state<HTMLElement>();
	let tagInEl = $state<HTMLElement>();
	let tagSlotEl = $state<HTMLElement>();
	let tagSlotInEl = $state<HTMLElement>();
	let probeEl = $state<HTMLElement>();

	let scrolled = $state(false);
	let focusInside = $state(false);
	let tucked = $state(false);
	/** Transitions are on only once the current geometry has been measured
	 *  for the current route (a route change swaps the base geometry). */
	let ready = $state(false);
	let readyFor = $state<boolean | null>(null);
	// Starts dark on the Top so SSR / first paint is already blush over the
	// hero (no flash); after that the probe decides.
	// svelte-ignore state_referenced_locally
	let onDark = $state(isTop);

	const compact = $derived(isTop ? scrolled || menuOpen || focusInside : true);
	// Tuck-away is the Top's only (this phase) and never hides a header that
	// is in use — the menu is open, or focus is inside it.
	const hidden = $derived(isTop && tucked && !menuOpen && !focusInside);

	// ─── FLIP measurement ────────────────────────────────────────────────

	/** Untransformed box of an absolutely positioned element, in the lockup's
	 *  px. Computed styles rather than offset* (integer-rounded) or
	 *  getBoundingClientRect (includes the transform). */
	function box(el: HTMLElement) {
		const cs = getComputedStyle(el);
		return { x: parseFloat(cs.left), y: parseFloat(cs.top), w: parseFloat(cs.width) };
	}

	const fontSize = (el: HTMLElement) => parseFloat(getComputedStyle(el).fontSize);

	function setFlip(el: HTMLElement, tx: number, ty: number, k: number) {
		el.style.setProperty('--tx', `${tx}px`);
		el.style.setProperty('--ty', `${ty}px`);
		el.style.setProperty('--k', `${k}`);
	}

	/** Snapshot of everything the FLIP depends on, to tell a real geometry
	 *  change from a resize that changes nothing here (iOS fires resize as
	 *  its toolbar collapses on scroll — re-arming then would cut a running
	 *  lockup transition short). */
	let measuredKey = '';
	/** The route (Top or not) the current --tx / --ty / --k were measured for. */
	let measuredFor: boolean | null = null;
	function geometryKey() {
		const boxes = [markEl, markSlotEl, tagEl, tagSlotEl].map((el) =>
			el ? Object.values(box(el)).join(',') : '-'
		);
		const sizes = [tagInEl, tagSlotInEl].map((el) => (el ? fontSize(el) : '-'));
		return [...boxes, ...sizes].join('|');
	}

	function measure() {
		measuredFor = isTop;
		if (markEl && markSlotEl) {
			const from = box(markEl);
			const to = box(markSlotEl);
			if (from.w) setFlip(markEl, to.x - from.x, to.y - from.y, to.w / from.w);
		}
		// The tagline is a 0×0 centre anchor: it moves anchor-to-anchor and
		// scales by font size, so fonts loading late never change the result.
		// Below 1024 it isn't flipped (it fades) — its slot is display:none.
		if (tagEl && tagInEl && tagSlotEl && tagSlotInEl) {
			if (getComputedStyle(tagSlotEl).display === 'none') {
				setFlip(tagEl, 0, 0, 1);
			} else {
				const from = box(tagEl);
				const to = box(tagSlotEl);
				setFlip(tagEl, to.x - from.x, to.y - from.y, fontSize(tagSlotInEl) / fontSize(tagInEl));
			}
		}
		measuredKey = geometryKey();
	}

	let armRaf = 0;
	let armRun = 0;
	/** Measure with transitions off, then switch them on ARM_FRAMES later.
	 *  Also releases html.is-prescrolled (the big logo stays hidden until its
	 *  compact transform is known). */
	async function measureThenArm() {
		const run = ++armRun;
		const forTop = isTop;
		ready = false;
		cancelAnimationFrame(armRaf);
		// The .is-ready removal has to reach the DOM before the transforms
		// move, or they would animate from the stale measurement.
		await tick();
		if (run !== armRun) return;
		measure();
		let frames = ARM_FRAMES;
		const step = () => {
			if (--frames > 0) {
				armRaf = requestAnimationFrame(step);
				return;
			}
			readyFor = forTop;
			ready = true;
			document.documentElement.classList.remove('is-prescrolled');
		};
		armRaf = requestAnimationFrame(step);
	}

	// ─── Colour: follows the surface under the compact wordmark ──────────
	// The header has no fill, so its colour follows what it sits on. Dark
	// surfaces (the hero photo, destinations, the footer) opt in with
	// data-header="dark"; the probe line is the compact wordmark's centre
	// (--mk-probe-y, read through .probe so safe-area-top is included).
	let probeRaf = 0;
	function probe() {
		probeRaf = 0;
		if (!probeEl) return;
		// Open, the light menu sheet is what is under it.
		if (menuOpen) {
			onDark = false;
			return;
		}
		const y = parseFloat(getComputedStyle(probeEl).top);
		onDark = Array.from(document.querySelectorAll('[data-header="dark"]')).some((el) => {
			const r = el.getBoundingClientRect();
			return r.top <= y && r.bottom > y;
		});
	}

	/** Coalesces scroll / resize / navigation bursts into one probe per frame. */
	function queueProbe() {
		if (probeRaf) return;
		probeRaf = requestAnimationFrame(probe);
	}

	$effect(() => {
		void menuOpen;
		queueProbe();
	});

	// ─── Scroll: compact state and tuck-away ──────────────────────────────
	let lastY = 0;

	function syncScroll() {
		scrolled = window.scrollY > COMPACT_AFTER_PX;
	}

	// Hides on a downward scroll once the hero has passed, returns on the
	// first upward one (ii). Small jitters accumulate until they reach the
	// threshold instead of resetting it.
	function updateTuck() {
		const y = window.scrollY;
		if (!isTop || menuOpen || focusInside) {
			tucked = false;
			lastY = y;
			return;
		}
		const dy = y - lastY;
		if (Math.abs(dy) < TUCK_DELTA_PX) return;
		tucked = dy > 0 && y > window.innerHeight;
		lastY = y;
	}

	afterNavigate(() => {
		// SvelteKit has already scrolled (top, hash or a restored position);
		// read it now rather than wait for the scroll event, so the first
		// painted frame of the new route is already in the right state.
		syncScroll();
		tucked = false;
		lastY = window.scrollY;
		// Entering or leaving the Top swaps the lockup's base geometry. With
		// .is-ready already off (readyFor !== isTop), measure synchronously so
		// a restored mid-page position never shows the big logo, then re-arm.
		// (On the first load onMount does this; measuredFor is still null.)
		if (measuredFor !== null && measuredFor !== isTop) {
			measure();
			measureThenArm();
		}
		queueProbe();
	});

	onMount(() => {
		syncScroll();
		lastY = window.scrollY;
		measureThenArm();
		queueProbe();

		const onScroll = () => {
			syncScroll();
			updateTuck();
			queueProbe();
		};

		let resizeRaf = 0;
		const onResize = () => {
			cancelAnimationFrame(resizeRaf);
			resizeRaf = requestAnimationFrame(() => {
				if (geometryKey() !== measuredKey) measureThenArm();
				queueProbe();
			});
		};

		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onResize, { passive: true });
		window.addEventListener('orientationchange', measureThenArm);
		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onResize);
			window.removeEventListener('orientationchange', measureThenArm);
			cancelAnimationFrame(resizeRaf);
			cancelAnimationFrame(armRaf);
			cancelAnimationFrame(probeRaf);
		};
	});

	// ─── Keyboard focus keeps the lockup compact ──────────────────────────
	// Keyboard focus only: a click also focuses a button in most browsers,
	// and that must not pin the lockup compact at the top of the page.
	function onFocusIn(e: FocusEvent) {
		if ((e.target as Element).matches(':focus-visible')) focusInside = true;
	}

	function onFocusOut(e: FocusEvent) {
		const next = e.relatedTarget as Node | null;
		if (!next || !headerEl?.contains(next)) focusInside = false;
	}

	function toggleMenu() {
		if (onToggleMenu) onToggleMenu();
		else menuOpen = !menuOpen;
	}
</script>

<header
	class="Header"
	class:is-top={isTop}
	class:is-compact={compact}
	class:is-ready={ready && readyFor === isTop}
	class:is-on-dark={onDark && !menuOpen}
	class:is-hidden={hidden}
	class:is-menu-open={menuOpen}
	bind:this={headerEl}
	onfocusin={onFocusIn}
	onfocusout={onFocusOut}
>
	<button
		class="menu-btn"
		type="button"
		aria-expanded={menuOpen}
		aria-controls="site-menu"
		aria-label={menuOpen ? i18n.t.menu.close : i18n.t.menu.open}
		onclick={toggleMenu}
	>
		<span class="lines" aria-hidden="true">
			<span class="line line--top"></span>
			<span class="line line--bottom"></span>
		</span>
	</button>

	<a class="lockup" href="/" aria-label="MOKUSEKI">
		<span class="lk-mark" bind:this={markEl}><Wordmark /></span>
		{#if isTop}
			<span class="lk-tag" bind:this={tagEl} aria-hidden="true" lang="en">
				<span class="lk-tag-in mk-tagline" bind:this={tagInEl}>
					<span class="lk-tag-line">{tagline[0]}</span>
					<span class="lk-tag-line">{tagline[1]}</span>
				</span>
			</span>
		{/if}
		<!-- Where the parts land in the compact state (see measure()). -->
		<span class="lk-slot-mark" bind:this={markSlotEl} aria-hidden="true"></span>
		{#if isTop}
			<span class="lk-slot-tag" bind:this={tagSlotEl} aria-hidden="true">
				<span class="lk-slot-tag-in mk-tagline" bind:this={tagSlotInEl} lang="en"
					>{tagline.join(' ')}</span
				>
			</span>
		{/if}
		<!-- The link's own box is zero-height, and an outline on the scaled
		     wordmark would scale too — the ring is drawn at the compact
		     geometry instead (keyboard focus always compacts the lockup). -->
		<span class="lk-ring" aria-hidden="true"></span>
		<!-- Tap target for the compact wordmark (120 × 12 on SP alone is far
		     under 44px). A separate box, so box() never measures it. -->
		<span class="lk-hit" aria-hidden="true"></span>
	</a>

	<div class="controls">
		<!-- PC: the target-language label. SP: the Reserve chip (the language
		     switch lives in the menu and footer there — 12px over the photo
		     can't reach 4.5:1). -->
		<div class="lang"><LanguageToggle target /></div>
		<a class="chip mk-eyebrow" href={RESERVE_URL} target="_blank" rel="noopener" lang="en"
			>Reserve</a
		>
	</div>

	<span class="probe" bind:this={probeEl} aria-hidden="true"></span>
</header>

<style>
	.Header {
		--safe-top: env(safe-area-inset-top, 0px);
		/* Menu button: the hit box pads around the drawn lines (Figma Group
		 * 82) — PC 84 × 48.5, SP 64 × 44. */
		--btn-pad-x: 12px;
		--btn-pad-y: 17.25px;
		--btn-x: max(var(--mk-icon-x), env(safe-area-inset-left, 0px));
		--btn-top: calc(var(--mk-icon-y) - var(--btn-pad-y) + var(--safe-top));
		--lines-h: calc(var(--mk-icon-gap) + var(--mk-icon-stroke));
		/* The icon's vertical centre (24.75 PC) — the PC language label's row. */
		--icon-mid: calc(var(--mk-icon-y) + var(--lines-h) / 2);
		/* Wordmark.svelte's viewBox is 300 × 30. */
		--lk-h: calc(var(--mk-lk-mark-w) / 10);
		/* Bottom edge of the compact lockup — how far tuck-away lifts it. */
		--lk-bottom: calc(var(--mk-lk-mark-top) + var(--lk-h) + var(--safe-top));
		--ring-pad-x: 8px;
		--ring-pad-y: 6px;
		--hit-h: 44px;
		--lang-pad-x: 8px;
		--lang-pad-y: 15px;
		--chip-pad-x: 18px;
		/* Same Ango cap-centring nudge as .mk-btn. */
		--cap-nudge: 1px;
		/* Below 1024 the big tagline sets in two lines (spec T1). */
		--tag-lh-stacked: 1.6;
		/* Below 1024 the big tagline's right edge: --mk-chrome-r on SP (370 at
		 * 390); tablet mirrors the wordmark's 40px inset (below). */
		--tag-right: var(--mk-chrome-r);
		/* Companion fades of the lockup FLIP (spec §2.7) and tuck-away's fade. */
		--fade-out: 0.25s;
		--fade-in: 0.5s;
		--fade-in-delay: 0.35s;
		--tuck-fade: 0.8s;
		--chip-dur: 0.3s;
		/* Menu icon cross (spec §5.1). */
		--cross-dur: 0.6s;
		/* OP start state and failsafe (spec §4.3 / §4.4). */
		--op-blur: 6px;
		--op-fs-delay: 3s;
		--op-fs-dur: 0.6s;

		/* Rust / ink on light surfaces, blush / white on dark ones — the
		 * mksk remap on .shell decides which palette these resolve to. */
		--hdr-fg: var(--hdr-fg-light);

		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 0;
		z-index: var(--z-header);
	}

	.Header.is-on-dark {
		--hdr-fg: var(--hdr-fg-dark);
		--focus: var(--focus-on-dark);
	}

	/* Until the app hydrates (and for good without JS, or when the bundle
	 * fails) nothing compacts the lockup or re-probes the surface under it:
	 * fixed, the big blush logo would ride over every section and vanish on
	 * the cream ones. Let the header scroll away with the first section. */
	:global(html:not(.is-hydrated)) .Header {
		position: absolute;
	}

	@media (min-width: 1024px) {
		.Header {
			--btn-pad-y: 18px;
		}
	}

	/* Tablet: "14px and inset 40" (spec §4.6) — the tagline ends 40px from
	 * the right, mirroring the wordmark's --mk-op-left, which is where the
	 * tablet contrast was measured (sim_tab.py: W − 40). */
	@media (min-width: 768px) and (max-width: 1023.98px) {
		.Header {
			--tag-right: max(var(--mk-op-left), env(safe-area-inset-right, 0px));
		}
	}

	/* Top ≥1024: the compact lockup also carries the 10px tagline (centred on
	 * y 76), so tuck-away has to lift that far. */
	@media (min-width: 1024px) {
		.Header.is-top {
			--lk-bottom: calc(
				var(--mk-lk-tag-mid) + var(--mk-fs-lockup-tag) * var(--mk-lh-label) / 2 + var(--safe-top)
			);
		}
	}

	/* ─── Menu button: two lines that cross at ±15° when open ─────────── */
	.menu-btn {
		position: absolute;
		top: var(--btn-top);
		left: calc(var(--btn-x) - var(--btn-pad-x));
		padding: var(--btn-pad-y) var(--btn-pad-x);
		appearance: none;
		background: transparent;
		border: 0;
		cursor: pointer;
		color: var(--hdr-fg);
	}

	.lines {
		position: relative;
		display: block;
		width: var(--mk-icon-w);
		height: var(--lines-h);
	}

	.line {
		position: absolute;
		left: 0;
		width: 100%;
		height: var(--mk-icon-stroke);
		background: currentColor;
		transition: transform var(--cross-dur) var(--mk-ease-silk);
	}

	.line--top {
		top: 0;
	}

	.line--bottom {
		bottom: 0;
	}

	/* Each line travels half the gap, so they cross on the icon's centre. */
	.Header.is-menu-open .line--top {
		transform: translateY(calc(var(--mk-icon-gap) / 2)) rotate(calc(-1 * var(--mk-icon-angle)));
	}

	.Header.is-menu-open .line--bottom {
		transform: translateY(calc(var(--mk-icon-gap) / -2)) rotate(var(--mk-icon-angle));
	}

	/* ─── Lockup ─────────────────────────────────────────────────────────── */
	.lockup {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 0;
		display: block;
		color: var(--hdr-fg);
		text-decoration: none;
	}

	.lockup:focus-visible {
		outline: none;
	}

	/* Base = compact geometry (220:663). It is all there is off the Top and
	 * without JS; the big geometry below needs html.js. */
	.lk-mark,
	.lk-slot-mark {
		position: absolute;
		top: calc(var(--mk-lk-mark-top) + var(--safe-top));
		left: calc(50% - var(--mk-lk-mark-w) / 2);
		width: var(--mk-lk-mark-w);
	}

	.lk-mark {
		transform-origin: 0 0;
	}

	.lk-mark :global(svg) {
		width: 100%;
		height: auto;
	}

	.lk-slot-mark {
		height: var(--lk-h);
	}

	.lk-slot-mark,
	.lk-slot-tag {
		visibility: hidden;
		pointer-events: none;
	}

	/* The tagline and its slot are 0×0 anchors on the text's centre; the
	 * text centres itself with the individual `translate` property, which
	 * leaves `transform` free for the FLIP. */
	.lk-tag,
	.lk-slot-tag {
		position: absolute;
		left: 50%;
		top: calc(var(--mk-lk-tag-mid) + var(--safe-top));
		width: 0;
		height: 0;
	}

	.lk-tag {
		transform-origin: 0 0;
	}

	.lk-tag-in,
	.lk-slot-tag-in {
		position: absolute;
		left: 0;
		top: 0;
		width: max-content;
		translate: -50% -50%;
		white-space: nowrap;
		font-size: var(--mk-fs-lockup-tag);
	}

	.lk-ring {
		position: absolute;
		top: calc(var(--mk-lk-mark-top) + var(--safe-top) - var(--ring-pad-y));
		left: calc(50% - var(--mk-lk-mark-w) / 2 - var(--ring-pad-x));
		width: calc(var(--mk-lk-mark-w) + 2 * var(--ring-pad-x));
		height: calc(var(--lk-h) + 2 * var(--ring-pad-y));
		outline: 1px solid var(--focus, currentColor);
		opacity: 0;
		pointer-events: none;
	}

	.lockup:focus-visible .lk-ring {
		opacity: 1;
	}

	/* 44px-tall hit area centred on the compact wordmark. Only while compact:
	 * in the big state that spot is empty hero, and an invisible home link
	 * there would be a trap. */
	.lk-hit {
		position: absolute;
		top: calc(var(--mk-lk-mark-top) + var(--safe-top) + var(--lk-h) / 2 - var(--hit-h) / 2);
		left: calc(50% - var(--mk-lk-mark-w) / 2 - var(--ring-pad-x));
		width: calc(var(--mk-lk-mark-w) + 2 * var(--ring-pad-x));
		height: var(--hit-h);
	}

	.Header.is-top:not(.is-compact) .lk-hit {
		display: none;
	}

	/* Open menu: the sheet carries its own language label, and on PC its
	 * house index starts right under the lockup (HOUSES eyebrow at y 82,
	 * x 720) — the compact 10px tagline and the PC label would sit on it. */
	.Header.is-menu-open .lk-tag,
	.Header.is-menu-open .lang {
		opacity: 0;
		visibility: hidden;
	}

	/* Compact on the Top: onto the slots (--tx / --ty / --k from measure()). */
	.Header.is-top.is-compact .lk-mark {
		transform: translate(var(--tx, 0px), var(--ty, 0px)) scale(var(--k, 1));
	}

	/* PC big geometry — Figma 218:604: wordmark 399 at x 73, centred on the
	 * horizon; tagline centred at x 68.333% on the same line. */
	@media (min-width: 1024px) {
		:global(html.js) .Header.is-top .lk-mark {
			left: var(--mk-op-left);
			top: calc(var(--mk-op-horizon) - var(--mk-op-mark-w) / 20);
			width: var(--mk-op-mark-w);
		}

		:global(html.js) .Header.is-top .lk-tag {
			left: var(--mk-op-tag-x);
			top: var(--mk-op-horizon);
		}

		:global(html.js) .Header.is-top .lk-tag-in {
			font-size: var(--mk-fs-op-tag);
		}

		.Header.is-top.is-compact .lk-tag {
			transform: translate(var(--tx, 0px), var(--ty, 0px)) scale(var(--k, 1));
		}
	}

	/* SP / tablet big geometry — the diagonal: wordmark above the horizon on
	 * the left, two-line tagline below it on the right. The tagline doesn't
	 * flip here (the bar has no room for it); it fades. */
	@media (max-width: 1023.98px) {
		.lk-slot-tag {
			display: none;
		}

		.lk-tag {
			left: auto;
			right: var(--tag-right);
			top: calc(var(--mk-op-horizon) + var(--mk-op-stack-gap));
			width: auto;
			height: auto;
			opacity: 0;
			visibility: hidden;
		}

		.lk-tag-in {
			position: static;
			display: block;
			width: auto;
			translate: none;
			text-align: right;
			line-height: var(--tag-lh-stacked);
			font-size: var(--mk-fs-op-tag);
		}

		.lk-tag-line {
			display: block;
		}

		/* Guarded like the footer reprise: landscape iPhones land in the
		 * tablet tier with a safe-area inset wider than its 40px. */
		:global(html.js) .Header.is-top .lk-mark {
			left: max(var(--mk-op-left), var(--mk-chrome-l));
			top: calc(var(--mk-op-horizon) - var(--mk-op-stack-gap) - var(--mk-op-mark-w) / 10);
			width: var(--mk-op-mark-w);
		}

		:global(html.js) .Header.is-top:not(.is-compact) .lk-tag {
			opacity: 1;
			visibility: visible;
		}
	}

	/* A restored mid-page position (reload, back/forward, #hash) must not
	 * flash the big logo before its compact transform is measured;
	 * measureThenArm() removes the class. */
	:global(html.is-prescrolled) .Header.is-top .lk-mark,
	:global(html.is-prescrolled) .Header.is-top .lk-tag-in {
		visibility: hidden;
	}

	/* Same failsafe as the OP start state: never hydrated, so never
	 * measured — show the logo where it is (the header scrolls with the
	 * hero in that state, see above). */
	:global(html.is-prescrolled:not(.is-hydrated)) .Header.is-top .lk-mark,
	:global(html.is-prescrolled:not(.is-hydrated)) .Header.is-top .lk-tag-in {
		animation: mk-op-fs-show var(--op-fs-dur) ease var(--op-fs-delay) forwards;
	}

	/* ─── Controls: PC language label / SP Reserve chip ─────────────────── */
	.controls {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 0;
	}

	/* Centred on the icon's row, its text's right edge on --mk-chrome-r. */
	.lang {
		--lang-pad: var(--lang-pad-y) var(--lang-pad-x);
		position: absolute;
		top: calc(var(--icon-mid) + var(--safe-top));
		right: calc(var(--mk-chrome-r) - var(--lang-pad-x));
		display: flex;
		translate: 0 -50%;
		color: var(--hdr-fg);
	}

	.chip {
		display: none;
	}

	@media (max-width: 1023.98px) {
		.lang {
			display: none;
		}

		/* Flush right, the bar's full height (+ the notch), solid fill. */
		.chip {
			position: absolute;
			top: 0;
			right: 0;
			display: flex;
			align-items: center;
			height: calc(var(--mk-bar-h) + var(--safe-top));
			padding: calc(var(--safe-top) + var(--cap-nudge))
				calc(var(--chip-pad-x) + env(safe-area-inset-right, 0px)) 0 var(--chip-pad-x);
			background: var(--chip-bg-light);
			color: var(--chip-fg-light);
			text-decoration: none;
		}

		.Header.is-on-dark .chip {
			background: var(--chip-bg-dark);
			color: var(--chip-fg-dark);
		}

		/* The open sheet carries Reserve itself. */
		.Header.is-menu-open .chip {
			opacity: 0;
			visibility: hidden;
		}
	}

	.probe {
		position: absolute;
		top: calc(var(--mk-probe-y) + var(--safe-top));
		left: 0;
		width: 0;
		height: 0;
		visibility: hidden;
		pointer-events: none;
	}

	/* ─── Tuck-away (Top only): each part lifts by its own bottom edge ───── */
	.Header.is-hidden .menu-btn {
		transform: translateY(calc(-100% - var(--btn-top)));
		opacity: 0;
	}

	.Header.is-hidden .lockup {
		transform: translateY(calc(-1 * var(--lk-bottom)));
		opacity: 0;
	}

	.Header.is-hidden .lang {
		transform: translateY(calc(-50% - var(--icon-mid) - var(--safe-top)));
		opacity: 0;
	}

	.Header.is-hidden .chip {
		transform: translateY(-100%);
		opacity: 0;
	}

	/* ─── Transitions: only once measured (.is-ready) ───────────────────── */
	.Header.is-ready .lk-mark {
		transition: transform var(--mk-lockup-dur) var(--mk-ease-inout);
	}

	.Header.is-ready :is(.menu-btn, .lockup, .lang) {
		transition:
			color var(--mk-color-dur) ease,
			transform var(--mk-tuck-dur) var(--mk-ease-out),
			opacity var(--tuck-fade) var(--mk-ease-out);
	}

	.Header.is-ready .chip {
		transition:
			background-color var(--chip-dur) ease,
			color var(--chip-dur) ease,
			transform var(--mk-tuck-dur) var(--mk-ease-out),
			opacity var(--tuck-fade) var(--mk-ease-out),
			visibility var(--tuck-fade);
	}

	@media (min-width: 1024px) {
		.Header.is-ready .lk-tag {
			transition: transform var(--mk-lockup-dur) var(--mk-ease-inout);
		}
	}

	/* SP tagline: out quickly as the lockup starts to shrink, back in once
	 * the wordmark has mostly returned. */
	@media (max-width: 1023.98px) {
		.Header.is-ready .lk-tag {
			transition:
				opacity var(--fade-out) ease,
				visibility var(--fade-out);
		}

		.Header.is-ready:not(.is-compact) .lk-tag {
			transition:
				opacity var(--fade-in) ease var(--fade-in-delay),
				visibility var(--fade-in) var(--fade-in-delay);
		}
	}

	/* ─── Opening (html[data-op='play'], phases from opening.ts) ─────────
	 * Every rule is prefixed with .Header so it outranks the resting rules
	 * above. After the OP, data-op = 'skip' and none of this matches; the
	 * resting values equal the OP's end frame, so nothing jumps. */

	/* Fast-forward: every OP duration becomes --op-fast, with no delays. */
	:global(html.op-fast) .Header {
		--op-logo-delay: 0s;
		--op-logo-in: var(--op-fast);
		--op-tag-delay: 0s;
		--op-tag-in: var(--op-fast);
		--op-chrome-delay: 0s;
		--op-chrome-in: var(--op-fast);
		--op-color: var(--op-fast);
		--op-controls-in: var(--op-fast);
	}

	/* First paint: nothing but the rust ground. */
	:global(html[data-op='play']:not([data-op-phase])) .Header .lk-mark :global(svg),
	:global(html[data-op='play']:not([data-op-phase])) .Header .lk-tag-in {
		opacity: 0;
		filter: blur(var(--op-blur));
	}

	:global(html[data-op='play']:not([data-op-phase])) .Header .lines {
		opacity: 0;
	}

	/* "logo": the wordmark, then the tagline, then the icon (218:604). */
	:global(html[data-op='play']) .Header .lk-mark :global(svg) {
		transition:
			opacity var(--op-logo-in) var(--mk-ease-op-in) var(--op-logo-delay),
			filter var(--op-logo-in) var(--mk-ease-op-in) var(--op-logo-delay);
	}

	:global(html[data-op='play']) .Header .lk-tag-in {
		transition:
			opacity var(--op-tag-in) var(--mk-ease-op-in) var(--op-tag-delay),
			filter var(--op-tag-in) var(--mk-ease-op-in) var(--op-tag-delay);
	}

	:global(html[data-op='play']) .Header .lines {
		transition: opacity var(--op-chrome-in) var(--mk-ease-op-in) var(--op-chrome-delay);
	}

	/* Until the photo: peach lockup, black icon (Figma 218:604). */
	:global(html[data-op='play']:not([data-op-phase='image']):not([data-op-phase='done']))
		.Header
		.lockup {
		color: var(--mk-peach);
	}

	:global(html[data-op='play']:not([data-op-phase='image']):not([data-op-phase='done']))
		.Header
		.menu-btn {
		color: var(--mk-op-icon);
	}

	/* "image": blush over the arriving photo whatever the probe says
	 * (218:637). From "done" the probe's --hdr-fg takes over — blush at the
	 * top, rust if a fast-forwarding scroll has already left the hero. */
	:global(html[data-op='play'][data-op-phase='image']) .Header .lockup,
	:global(html[data-op='play'][data-op-phase='image']) .Header .menu-btn {
		color: var(--mk-blush);
	}

	:global(html[data-op='play']) .Header .lockup,
	:global(html[data-op='play']) .Header .menu-btn {
		transition: color var(--op-color) var(--mk-ease-inout);
	}

	/* "done": the PC language label / SP chip arrive last. */
	:global(html[data-op='play']:not([data-op-phase='done'])) .Header .controls {
		opacity: 0;
		visibility: hidden;
	}

	:global(html[data-op='play']) .Header .controls {
		transition:
			opacity var(--op-controls-in) var(--mk-ease-out),
			visibility var(--op-controls-in);
	}

	/* Failsafe: if the app never hydrates, the server-rendered start state
	 * must not leave an empty rust screen. Hydration removes it, by which
	 * time opening.ts has either started the OP or settled it. */
	:global(html[data-op='play']:not([data-op-phase]):not(.is-hydrated))
		.Header
		.lk-mark
		:global(svg),
	:global(html[data-op='play']:not([data-op-phase]):not(.is-hydrated)) .Header .lk-tag-in,
	:global(html[data-op='play']:not([data-op-phase]):not(.is-hydrated)) .Header .lines,
	:global(html[data-op='play']:not([data-op-phase]):not(.is-hydrated)) .Header .controls {
		animation: mk-op-fs-show var(--op-fs-dur) ease var(--op-fs-delay) forwards;
	}

	:global(html[data-op='play']:not([data-op-phase]):not(.is-hydrated)) .Header .lockup,
	:global(html[data-op='play']:not([data-op-phase]):not(.is-hydrated)) .Header .menu-btn {
		animation: mk-op-fs-blush var(--op-fs-dur) ease var(--op-fs-delay) forwards;
	}

	@keyframes mk-op-fs-show {
		to {
			opacity: 1;
			filter: none;
			transform: none;
			visibility: visible;
		}
	}

	@keyframes mk-op-fs-blush {
		to {
			color: var(--mk-blush);
		}
	}

	/* Forced colours repaint author backgrounds with Canvas, which would
	 * erase the background-drawn icon lines (the button has no text). */
	@media (forced-colors: active) {
		.line {
			forced-color-adjust: none;
			background: ButtonText;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.menu-btn,
		.line,
		.lines,
		.lockup,
		.lk-mark,
		.lk-mark :global(svg),
		.lk-tag,
		.lk-tag-in,
		.controls,
		.lang,
		.chip {
			transition: none !important;
		}
	}
</style>
