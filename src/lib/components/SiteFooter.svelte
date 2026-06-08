<script lang="ts">
	import { useI18n } from '$lib/i18n/store.svelte';
	import Wordmark from './Wordmark.svelte';

	const i18n = useI18n();
	let email = $state('');

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		// Newsletter signup will be wired up later (Phase 7+).
		email = '';
	}
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

		<!-- Column 2 — Navigation -->
		<nav class="col" aria-label={i18n.t.footer.navHeading}>
			<h2 class="eyebrow">{i18n.t.footer.navHeading}</h2>
			<ul class="links">
				<li><a class="body-sm" href="/">{i18n.t.footer.nav.home}</a></li>
				<li><a class="body-sm" href="/#houses">{i18n.t.footer.nav.houses}</a></li>
				<li><a class="body-sm" href="/about">{i18n.t.footer.nav.about}</a></li>
				<li><a class="body-sm" href="/#concept">{i18n.t.footer.nav.concept}</a></li>
				<li><a class="body-sm" href="/#experience">{i18n.t.footer.nav.experience}</a></li>
				<li><a class="body-sm" href="/reserve">{i18n.t.footer.nav.reserve}</a></li>
				<li><a class="body-sm" href="/contact">{i18n.t.footer.nav.contact}</a></li>
			</ul>
		</nav>

		<!-- Column 3 — Contact + Social -->
		<div class="col">
			<h2 class="eyebrow">{i18n.t.footer.contactHeading}</h2>
			<address class="address">
				{#each i18n.t.footer.contactLines as line (line)}
					<span class="body-sm">{line}</span>
				{/each}
			</address>

			<h2 class="eyebrow social-heading">{i18n.t.footer.socialHeading}</h2>
			<ul class="links">
				{#each i18n.t.footer.socialItems as item (item.label)}
					<li>
						<a
							class="body-sm social-link"
							href={item.href}
							target="_blank"
							rel="noopener noreferrer"
						>
							{item.label}
							<span class="ext" aria-hidden="true">↗</span>
						</a>
					</li>
				{/each}
			</ul>
		</div>

		<!-- Column 4 — Newsletter -->
		<div class="col">
			<h2 class="eyebrow">{i18n.t.footer.newsletterHeading}</h2>
			<p class="body-sm letter-body">{i18n.t.footer.newsletterBody}</p>
			<form class="letter-form" onsubmit={handleSubmit}>
				<input
					type="email"
					required
					bind:value={email}
					placeholder={i18n.t.footer.newsletterPlaceholder}
					aria-label={i18n.t.footer.newsletterPlaceholder}
				/>
				<button class="meta letter-submit" type="submit">
					<span>{i18n.t.footer.newsletterSubmit}</span>
					<span class="arrow" aria-hidden="true">→</span>
				</button>
			</form>
		</div>
	</div>

	<div class="rule" aria-hidden="true"></div>

	<div class="bottom">
		<p class="meta copy">{i18n.t.footer.copy}</p>
		<ul class="legal">
			<li><a class="meta" href="/privacy">{i18n.t.footer.legal.privacy}</a></li>
			<li aria-hidden="true" class="meta sep">/</li>
			<li><a class="meta" href="/terms">{i18n.t.footer.legal.terms}</a></li>
		</ul>
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
		font-weight: 300;
	}

	.top {
		max-width: 1280px;
		margin: 0 auto;
		padding: 0 clamp(24px, 5vw, 80px);
		display: grid;
		grid-template-columns: 1.3fr 0.8fr 1fr 1.1fr;
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
		color: var(--bg);
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

	.address {
		font-style: normal;
		display: flex;
		flex-direction: column;
		gap: 7px;
	}

	.social-heading {
		margin-top: 20px;
	}

	.social-link {
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}

	.ext {
		font-size: 11px;
		color: inherit;
		opacity: 0.5;
		transition:
			transform 400ms ease,
			opacity 400ms ease;
	}

	.social-link:hover .ext {
		transform: translate(2px, -2px);
		opacity: 1;
	}

	.letter-body {
		max-width: 24ch;
	}

	.letter-form {
		display: flex;
		align-items: center;
		border-bottom: 1px solid rgba(246, 246, 246, 0.4);
		padding-bottom: 8px;
		gap: 12px;
		margin-top: 4px;
	}

	.letter-form input {
		flex: 1;
		appearance: none;
		background: transparent;
		border: none;
		font-family: var(--display);
		font-size: var(--fs-meta);
		font-weight: 300;
		letter-spacing: 0;
		line-height: var(--lh-en);
		color: var(--bg);
		padding: 7px 0;
		min-width: 0;
	}

	.letter-form input::placeholder {
		color: rgba(246, 246, 246, 0.4);
	}

	.letter-form input:focus {
		outline: none;
	}

	.letter-submit {
		appearance: none;
		background: transparent;
		border: none;
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding: 4px 0;
		transition: color 300ms ease;
	}

	.letter-submit:hover {
		color: var(--accent);
	}

	.letter-submit .arrow {
		text-transform: none;
		letter-spacing: 0;
		transition: transform 300ms ease;
	}

	.letter-submit:hover .arrow {
		transform: translateX(3px);
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
		gap: 12px;
	}

	.legal a {
		text-decoration: none;
		transition: opacity 300ms ease;
		opacity: 0.6;
	}

	.legal a:hover {
		opacity: 1;
	}

	.legal .sep {
		opacity: 0.5;
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

		.bottom {
			justify-content: center;
			text-align: center;
		}
	}
</style>
