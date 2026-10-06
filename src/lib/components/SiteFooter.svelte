<script lang="ts">
	import { useI18n } from '$lib/i18n/store.svelte';
	import LanguageToggle from '$lib/i18n/LanguageToggle.svelte';
	import { RESERVE_URL } from '$lib/site';
	import LegalLine from './LegalLine.svelte';
	import Wordmark from './Wordmark.svelte';

	// Compact footer (2026-10): the header's compact lockup (Figma 220:663 —
	// wordmark 188.37 with the 10px tagline centred beneath) mirrored at the
	// page's foot: lockup centred, nav centred beneath it, and a bottom row
	// that answers the header's top one — legal line left (the OP's
	// 218:604 legal line), language label right.
	// Colours come only from --footer-bg / --footer-fg, so the Top gets peach
	// on rust through the mksk remap and every other route keeps ink / ink-fg.
	// flushTop: the page above already ends in a full-bleed band (the Top's
	// reservation section) — no top margin, so no strip of page background
	// shows between them.
	// inert: set by +layout while the menu is open — the menu's modality comes
	// from inert on main + footer, not from aria-modal.
	let { flushTop = false, inert = false }: { flushTop?: boolean; inert?: boolean } = $props();

	const i18n = useI18n();
	// English in both locales.
	const tagline = $derived(i18n.t.home.op.tagline);
</script>

<footer class="mk-footer" class:flush-top={flushTop} data-header="dark" {inert}>
	<div class="lockup">
		<a class="mark" href="/" aria-label="MOKUSEKI"><Wordmark /></a>
		<p class="mk-tagline tag" lang="en">{tagline[0]} {tagline[1]}</p>
	</div>

	<nav aria-label={i18n.t.footer.navHeading}>
		<ul class="links">
			<li><a class="mk-body" href="/houses">{i18n.t.footer.nav.houses}</a></li>
			<li><a class="mk-body" href="/about">{i18n.t.footer.nav.about}</a></li>
			<li>
				<a class="mk-body" href={RESERVE_URL} target="_blank" rel="noopener">
					{i18n.t.footer.nav.reserve}
				</a>
			</li>
			<li><a class="mk-body" href="/contact">{i18n.t.footer.nav.contact}</a></li>
		</ul>
	</nav>

	<div class="foot">
		<div class="legal"><LegalLine variant="footer" /></div>
		<div class="lang"><LanguageToggle target /></div>
	</div>
</footer>

<style>
	.mk-footer {
		--ft-gap-above: clamp(64px, 8vh, 96px); /* off the Top only (flushTop) */
		--ft-pad-top: 72px;
		/* Wordmark → tagline, as in the header's compact lockup (220:663:
		 * wordmark bottom y 55.8, tagline top y 70). */
		--ft-lk-gap: 14px;
		--ft-nav-top: 40px;
		--ft-nav-gap: 40px;
		--ft-foot-top: 64px;
		--ft-bottom: 16px;
		--ft-row-h: 44px; /* SP rows + every hit target here */
		--ft-underline-offset: 0.25em;
		/* The language label's hit box is a full 44px row around its 12px text. */
		--ft-lang-pad-y: calc((var(--ft-row-h) - var(--mk-fs-label) * var(--mk-lh-label)) / 2);
		--ft-lang-pad-x: 8px;
		/* Fallbacks = the legacy :root values (spec §2.2), in case the chrome
		 * layer isn't defined. */
		--legal-fg: var(--footer-fg, var(--ink-fg));

		margin-top: var(--ft-gap-above);
		padding-top: var(--ft-pad-top);
		padding-bottom: calc(var(--ft-bottom) + env(safe-area-inset-bottom, 0px));
		background: var(--footer-bg, var(--ink));
		color: var(--footer-fg, var(--ink-fg));
		container-type: inline-size;
	}

	.mk-footer.flush-top {
		margin-top: 0;
	}

	/* ─── Lockup ───────────────────────────────────────── */
	.lockup {
		display: flex;
		flex-direction: column;
		align-items: center;
		row-gap: var(--ft-lk-gap);
		padding-inline: var(--mk-inset);
	}

	.mark {
		display: block;
		width: var(--mk-lk-mark-w);
		line-height: 0;
	}

	.mark :global(svg) {
		width: 100%;
		height: auto;
	}

	/* T2: the T1 class at the lockup's 10px. Balanced, so a phone too narrow
	 * for one line breaks it into two even halves. */
	.tag {
		font-size: var(--mk-fs-lockup-tag);
		text-align: center;
		text-wrap: balance;
	}

	/* ─── Nav ──────────────────────────────────────────── */
	.links {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		column-gap: var(--ft-nav-gap);
		margin-top: var(--ft-nav-top);
		padding-inline: var(--mk-inset);
	}

	.links a:hover {
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: var(--ft-underline-offset);
	}

	/* ─── Bottom row: legal left, language right ───────── */
	/* Baseline-aligned so the 12px language label sits on the legal line. */
	.foot {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-top: var(--ft-foot-top);
		padding-right: var(--mk-chrome-r);
	}

	/* PC: flush with the viewport — LegalLine pads itself to --mk-chrome-l
	 * and pins the © at x 312. */
	.legal {
		flex: 1;
	}

	/* Negative margins cancel the hit padding, so the visible label lands
	 * on the row's right edge and doesn't make the row taller. Flex (not a
	 * line box) so the button's 44px box is the row height exactly. */
	.lang {
		--lang-pad: var(--ft-lang-pad-y) var(--ft-lang-pad-x);
		display: flex;
		margin: calc(-1 * var(--ft-lang-pad-y)) calc(-1 * var(--ft-lang-pad-x));
	}

	/* ─── SP / tablet (<1024) ──────────────────────────── */
	@media (max-width: 1023.98px) {
		.mk-footer {
			--ft-pad-top: 56px;
			--ft-lk-gap: 12px;
			--ft-nav-top: 24px;
			--ft-nav-gap: 24px;
			--ft-foot-top: 24px;
		}

		/* A 2 × 2 grid of 44px tap targets: wrapping the row leaves a lone
		 * fourth link on its own line. */
		.links {
			display: grid;
			grid-template-columns: repeat(2, max-content);
			justify-content: center;
			justify-items: center;
		}

		.links a {
			display: flex;
			align-items: center;
			min-height: var(--ft-row-h);
		}

		/* LegalLine wraps here (links row, © beneath) and doesn't pad itself
		 * — align it to the inset. The language label stays on its first
		 * (links) row. */
		.foot {
			padding-inline: var(--mk-inset);
		}
	}
</style>
