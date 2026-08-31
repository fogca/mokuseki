<script lang="ts">
	import { useI18n } from '$lib/i18n/store.svelte';
	import Wordmark from './Wordmark.svelte';
	import { RESERVE_URL } from '$lib/site';

	const i18n = useI18n();
</script>

<footer class="site-footer inverse">
	<div class="top">
		<!-- Column 1 — Brand mark + tagline -->
		<div class="col col-brand">
			<a href="/" class="footer-wordmark" aria-label="MOKUSEKI">
				<Wordmark />
			</a>
			<p class="body-sm tagline">{i18n.t.footer.tagline}</p>
		</div>

		<!-- Column 2 — Navigation. Heading kept for a11y (aria-label) only —
		     visually removed per representative's "Navigation不要" direction.
		     Simplified to 4 links (Houses/About/Reserve/Contact). -->
		<nav class="col" aria-label={i18n.t.footer.navHeading}>
			<ul class="links">
				<li><a class="body-sm uppercase" href="/houses">{i18n.t.footer.nav.houses}</a></li>
				<li><a class="body-sm uppercase" href="/about">{i18n.t.footer.nav.about}</a></li>
				<li>
					<a class="body-sm uppercase" href={RESERVE_URL} target="_blank" rel="noopener">
						{i18n.t.footer.nav.reserve}
					</a>
				</li>
				<li><a class="body-sm uppercase" href="/contact">{i18n.t.footer.nav.contact}</a></li>
			</ul>
		</nav>

		<!-- Column 3 (Contact/address) parked for now — the address/tel are
		     still placeholder values (see representative's 2026-08-13 note).
		     Restore once real contact details are ready. -->

		<!-- TODO(launch): Journal/social links — restore once the brand
		     accounts exist (hrefs in messages.ts currently point at the
		     platform homepages). -->

		<!-- TODO(launch): newsletter column — restore once a real signup
		     endpoint exists; the previous form silently discarded emails. -->
	</div>

	<div class="rule" aria-hidden="true"></div>

	<div class="bottom">
		<ul class="legal">
			<li><a class="meta" href="/privacy">{i18n.t.footer.legal.privacy}</a></li>
			<li><a class="meta" href="/terms">{i18n.t.footer.legal.terms}</a></li>
			<li><a class="meta" href="/legal">{i18n.t.footer.legal.tokushoho}</a></li>
		</ul>
		<p class="meta copy">{i18n.t.footer.copy}</p>
	</div>
</footer>

<style>
	.site-footer {
		/* Shell no longer applies horizontal padding, so the footer
		 * naturally spans the viewport. Inner blocks get padding back. */
		margin-top: clamp(64px, 8vh, 96px);
		padding-top: clamp(64px, 8vh, 96px);
		padding-bottom: 24px;
	}

	/* TsukuGo L for the footer's Japanese text (Latin stays Mokuseki Sans
	 * via the fallback chain in --font-tsuku). */
	.site-footer :global(.body),
	.site-footer :global(.body-sm),
	.site-footer :global(.h-ja),
	.site-footer :global(address span) {
		font-family: var(--font-tsuku);
		font-weight: 250;
	}

	/* One unified text color for the whole footer (wordmark, tagline, nav,
	 * legal, copyright) — reuses --ink-fg so it stays identical to the
	 * buttons' text color (previously diverged from base.css's default
	 * .inverse treatment, which gives .body-sm and .meta two different
	 * opacities of white). */
	.footer-wordmark,
	.site-footer :global(.body-sm),
	.site-footer :global(.meta) {
		color: var(--ink-fg);
	}

	.top {
		max-width: 1280px;
		margin: 0 auto;
		padding: 0 clamp(24px, 5vw, 80px);
		/* 2 columns — Contact/newsletter/social columns are parked (see
		 * TODOs above). */
		display: grid;
		grid-template-columns: 1.4fr 0.6fr;
		gap: clamp(32px, 4vw, 64px);
		align-items: start;
	}

	.col {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.footer-wordmark {
		display: inline-flex;
		/* color set by the unified footer-color rule above. */
		text-decoration: none;
		line-height: 0;
	}

	.footer-wordmark :global(svg) {
		height: 18px;
		width: auto;
		display: block;
	}

	.tagline {
		max-width: 22ch;
		margin-top: 8px;
	}

	.links {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.links a {
		text-decoration: none;
		transition: color 300ms ease;
	}

	.links a:hover {
		color: var(--accent);
	}

	.rule {
		/* spans the full viewport */
		height: 1px;
		background: rgba(246, 246, 246, 0.2);
		margin: clamp(48px, 5vh, 64px) 0 24px;
	}

	.bottom {
		max-width: 1280px;
		margin: 0 auto;
		padding: 0 clamp(24px, 5vw, 80px);
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 16px;
	}

	.legal {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		align-items: center;
		gap: 14px;
	}

	.legal a {
		text-decoration: none;
		transition: opacity 300ms ease;
		opacity: 0.6;
	}

	.legal a:hover {
		opacity: 1;
	}

	@media (max-width: 960px) {
		.top {
			grid-template-columns: 1fr 1fr;
			row-gap: clamp(40px, 5vh, 56px);
		}
	}

	@media (max-width: 540px) {
		.top {
			grid-template-columns: 1fr;
			row-gap: clamp(40px, 5vh, 56px);
		}
	}
</style>
