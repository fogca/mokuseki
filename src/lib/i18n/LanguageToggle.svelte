<script lang="ts">
	import { useI18n } from './store.svelte';
	const i18n = useI18n();

	// compact: SP header — show only the active locale as a single tap
	// target that flips to the other one (both stay reachable, just not
	// both visible at once).
	// target (2026-10 redesign): show only the language you'd SWITCH TO
	// ("EN" while Japanese is active). Its accessible name starts with the
	// visible text (WCAG 2.5.3, label in name). Colour is currentColor, so
	// the header/menu/footer that places it decides it.
	let { compact = false, target = false }: { compact?: boolean; target?: boolean } = $props();

	const next = $derived(i18n.locale === 'ja' ? 'en' : 'ja');
</script>

{#if target}
	<button
		type="button"
		class="mk-eyebrow lang-target"
		lang={next}
		aria-label={next === 'en' ? 'EN — Switch to English' : 'JP — 日本語に切り替え'}
		onclick={() => i18n.setLocale(next)}
	>
		{next === 'en' ? 'EN' : 'JP'}
	</button>
{:else if compact}
	<button
		type="button"
		class="toggle-compact"
		aria-label={i18n.locale === 'ja' ? 'Switch to English' : '日本語に切り替え'}
		onclick={() => i18n.setLocale(i18n.locale === 'ja' ? 'en' : 'ja')}
	>
		{i18n.locale === 'ja' ? 'JP' : 'EN'}
	</button>
{:else}
	<div class="toggle" role="group" aria-label="Language">
		<button
			type="button"
			class:active={i18n.locale === 'ja'}
			aria-pressed={i18n.locale === 'ja'}
			onclick={() => i18n.setLocale('ja')}
		>
			JP
		</button>
		<span class="sep" aria-hidden="true">/</span>
		<button
			type="button"
			class:active={i18n.locale === 'en'}
			aria-pressed={i18n.locale === 'en'}
			onclick={() => i18n.setLocale('en')}
		>
			EN
		</button>
	</div>
{/if}

<style>
	.lang-target {
		appearance: none;
		background: transparent;
		border: 0;
		color: currentColor;
		cursor: pointer;
		/* Hit area set by the placing context (header / menu / footer). */
		padding: var(--lang-pad, 0);
	}

	/* Colors come from the header's theme variables (--hdr-fg / --hdr-fg-soft,
	 * set on .brand in +layout.svelte) so the toggle flips white/ink together with
	 * the rest of the header; the fallbacks keep the old ink colors anywhere
	 * those variables aren't defined. */
	.toggle-compact {
		appearance: none;
		background: transparent;
		border: none;
		padding: 4px 0;
		font-family: var(--display);
		font-size: var(--fs-sm);
		letter-spacing: var(--ls-en);
		line-height: var(--lh-en);
		text-transform: uppercase;
		color: var(--hdr-fg-soft, var(--ink-faint));
		cursor: pointer;
		transition: color 300ms ease;
	}

	.toggle-compact:hover {
		color: var(--hdr-fg, var(--ink));
	}

	.toggle {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-family: var(--display);
		font-size: var(--fs-sm);
		letter-spacing: var(--ls-en);
		line-height: var(--lh-en);
		text-transform: uppercase;
	}

	.toggle button {
		appearance: none;
		background: transparent;
		border: none;
		padding: 4px 0;
		font: inherit;
		letter-spacing: inherit;
		color: var(--hdr-fg-soft, var(--ink-faint));
		cursor: pointer;
		transition: color 300ms ease;
	}

	.toggle button:hover {
		color: var(--hdr-fg, var(--ink));
	}

	.toggle button.active {
		color: var(--hdr-fg, var(--ink));
	}

	.sep {
		color: var(--hdr-fg-soft, var(--ink-faint));
		opacity: 0.4;
	}
</style>
