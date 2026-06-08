<script lang="ts">
	import { useI18n } from './store.svelte';
	const i18n = useI18n();
</script>

<div class="toggle" role="group" aria-label="Language">
	<button type="button" class:active={i18n.locale === 'ja'} onclick={() => i18n.setLocale('ja')}>
		JP
	</button>
	<span class="sep" aria-hidden="true">/</span>
	<button type="button" class:active={i18n.locale === 'en'} onclick={() => i18n.setLocale('en')}>
		EN
	</button>
</div>

<style>
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
		color: var(--ink-faint);
		cursor: pointer;
		transition: color 300ms ease;
	}

	.toggle button:hover {
		color: var(--ink);
	}

	.toggle button.active {
		color: var(--ink);
	}

	.sep {
		color: var(--ink-faint);
		opacity: 0.4;
	}
</style>
