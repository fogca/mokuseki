<script lang="ts">
	import { useI18n } from '$lib/i18n/store.svelte';
	import LanguageToggle from '$lib/i18n/LanguageToggle.svelte';
	import { RESERVE_URL } from '$lib/site';
	import LegalLine from './LegalLine.svelte';
	import Wordmark from './Wordmark.svelte';

	// The footer reprises the OP1 frame (Figma 218:604) as the page's bookend:
	// big wordmark left, tagline right, one colour (2026-10 redesign, spec §5.4).
	// Colours come only from --footer-bg / --footer-fg, so the Top gets peach
	// on rust through the mksk remap and every other route keeps ink / ink-fg.
	// flushTop: the page above already ends in a full-bleed band (the Top's
	// reservation section) — no top margin, so no strip of page background
	// shows between them.
	// inert: set by +layout while the menu is open — the menu's modality comes
	// from inert on main + footer, not from aria-modal.
	let { flushTop = false, inert = false }: { flushTop?: boolean; inert?: boolean } = $props();

	const i18n = useI18n();
	// English in both locales; split where the SP layout breaks it.
	const tagline = $derived(i18n.t.home.op.tagline);
</script>

<footer class="mk-footer" class:flush-top={flushTop} data-header="dark" {inert}>
	<div class="band">
		<a class="mark" href="/" aria-label="MOKUSEKI"><Wordmark /></a>
		<!-- One line on PC; the two halves stack (right-aligned) below 1024. -->
		<p class="mk-tagline tag" lang="en">
			<span class="tag-line">{tagline[0]}</span>{' '}<span class="tag-line">{tagline[1]}</span>
		</p>
	</div>

	<div class="row">
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
		<div class="lang"><LanguageToggle target /></div>
	</div>

	<div class="legal"><LegalLine variant="footer" /></div>
</footer>

<style>
	.mk-footer {
		/* Spec §5.4 — the OP1 reprise (Figma 218:604 geometry) */
		--ft-gap-above: clamp(64px, 8vh, 96px); /* off the Top only (flushTop) */
		--ft-band-h: 400px;
		--ft-nav-gap: 40px;
		--ft-legal-gap: 120px;
		--ft-bottom: 16px;
		--ft-row-h: 44px; /* SP rows + every hit target here */
		--ft-lang-gap: 16px;
		--ft-tag-lh-stacked: 1.6; /* T1 when it breaks onto two lines */
		--ft-underline-offset: 0.25em;
		/* The OP's wordmark x — max() only matters on a landscape phone, where
		 * the 40px tablet value would sit under the notch. */
		--ft-left: max(var(--mk-op-left), var(--mk-chrome-l));
		/* The language label's hit box is a full 44px row around its 12px text. */
		--ft-lang-pad-y: calc((var(--ft-row-h) - var(--mk-fs-label) * var(--mk-lh-label)) / 2);
		--ft-lang-pad-x: 8px;
		/* Fallbacks = the legacy :root values (spec §2.2), in case the chrome
		 * layer isn't defined. */
		--legal-fg: var(--footer-fg, var(--ink-fg));

		margin-top: var(--ft-gap-above);
		padding-bottom: calc(var(--ft-bottom) + env(safe-area-inset-bottom, 0px));
		background: var(--footer-bg, var(--ink));
		color: var(--footer-fg, var(--ink-fg));
		container-type: inline-size;
	}

	.mk-footer.flush-top {
		margin-top: 0;
	}

	/* ─── Reprise band ─────────────────────────────────── */
	.band {
		position: relative;
		height: var(--ft-band-h);
		/* The nowrap tagline's pre-translate box runs past the right edge;
		 * clip so it can never add horizontal page scroll. */
		overflow: clip;
	}

	/* Same box as the OP's big wordmark: centred on the band's horizon
	 * (height = w/10, Wordmark.svelte is 300×30). */
	.mark {
		position: absolute;
		left: var(--ft-left);
		top: calc(50% - var(--mk-op-mark-w) / 20);
		width: var(--mk-op-mark-w);
		line-height: 0;
	}

	.mark :global(svg) {
		width: 100%;
		height: auto;
	}

	/* Centred on x 68.333% / y 50%, exactly like the OP tagline. */
	.tag {
		position: absolute;
		left: var(--mk-op-tag-x);
		top: 50%;
		translate: -50% -50%;
		width: max-content;
		white-space: nowrap;
	}

	/* ─── Nav row ──────────────────────────────────────── */
	/* Baseline-aligned so the 12px language label sits on the links' line. */
	.row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		padding: 0 var(--mk-chrome-r) 0 var(--ft-left);
	}

	.links {
		display: flex;
		flex-wrap: wrap;
		column-gap: var(--ft-nav-gap);
	}

	.links a:hover {
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: var(--ft-underline-offset);
	}

	/* Negative margins cancel the hit padding, so the visible label lands
	 * on the row's right edge and doesn't make the row taller. Flex (not a
	 * line box) so the button's 44px box is the row height exactly — no
	 * strut from the inherited font can add to it. */
	.lang {
		--lang-pad: var(--ft-lang-pad-y) var(--ft-lang-pad-x);
		display: flex;
		margin: calc(-1 * var(--ft-lang-pad-y)) calc(-1 * var(--ft-lang-pad-x));
	}

	/* ─── Legal row ────────────────────────────────────── */
	/* PC: flush with the viewport — LegalLine pads itself to --mk-chrome-l
	 * and pins the © at x 312. */
	.legal {
		margin-top: var(--ft-legal-gap);
	}

	/* ─── SP / tablet (<1024): the OP's diagonal ───────── */
	@media (max-width: 1023.98px) {
		.mk-footer {
			--ft-band-h: 320px;
			--ft-legal-gap: 48px;
		}

		/* Wordmark above the horizon (the band's middle), tagline below it. */
		.mark {
			top: calc(50% - var(--mk-op-stack-gap) - var(--mk-op-mark-w) / 10);
		}

		.tag {
			left: auto;
			right: var(--mk-inset);
			top: calc(50% + var(--mk-op-stack-gap));
			translate: none;
			text-align: right;
			line-height: var(--ft-tag-lh-stacked);
		}

		.tag-line {
			display: block;
		}

		.row {
			flex-direction: column;
			align-items: flex-start;
			padding: 0 var(--mk-inset);
		}

		.links {
			flex-direction: column;
		}

		.links a {
			display: flex;
			align-items: center;
			min-height: var(--ft-row-h);
		}

		.lang {
			margin: var(--ft-lang-gap) 0 0 calc(-1 * var(--ft-lang-pad-x));
		}

		/* LegalLine wraps here and doesn't pad itself — align it to the inset. */
		.legal {
			padding-inline: var(--mk-inset);
		}
	}
</style>
