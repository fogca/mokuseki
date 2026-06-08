<script lang="ts">
	import { useI18n } from '$lib/i18n/store.svelte';
	import { propertyIndex } from '$lib/data/propertyIndex';

	type Props = { open: boolean; onClose: () => void };
	let { open, onClose }: Props = $props();

	const i18n = useI18n();

	const exploreLinks = $derived([
		{ href: '/', label: i18n.t.footer.nav.home },
		{ href: '/about', label: i18n.t.footer.nav.about },
		{ href: '/#concept', label: i18n.t.footer.nav.concept },
		{ href: '/#experience', label: i18n.t.footer.nav.experience },
		{ href: '/reserve', label: i18n.t.footer.nav.reserve },
		{ href: '/contact', label: i18n.t.footer.nav.contact }
	]);

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && open) onClose();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<!--
	Menu overlay sits BELOW the fixed header (lower z-index than .brand)
	so the brand wordmark and Menu/Close toggle never shift position when
	the menu opens. The background fades in first, then the contents
	follow with a slight delay.
-->
<div
	class="menu"
	class:open
	aria-hidden={!open}
	role="dialog"
	aria-modal="true"
	aria-label="Site menu"
>
	<div class="menu-inner">
		<nav class="col" aria-label="Explore">
			<p class="eyebrow">{i18n.t.menu.exploreHeading}</p>
			<ul class="links">
				{#each exploreLinks as link (link.href)}
					<li>
						<a class="h2" href={link.href} onclick={onClose}>
							{link.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<nav class="col" aria-label="Houses">
			<p class="eyebrow">{i18n.t.menu.housesHeading}</p>
			<ul class="links">
				{#each propertyIndex as p, i (p.slug)}
					<li>
						<a class="h2 house-link" href={`/properties/${p.slug}`} onclick={onClose}>
							<span class="house-num meta">{String(i + 1).padStart(2, '0')}</span>
							<span>{p.name.en}</span>
							{#if i18n.locale === 'ja'}
								<span class="h-ja house-name-ja">{p.name.ja}</span>
							{/if}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</div>
</div>

<style>
	.menu {
		position: fixed;
		inset: 0;
		z-index: 30; /* below the fixed header (z-index 50) */
		background: var(--bg);
		opacity: 0;
		visibility: hidden;
		transition:
			opacity 350ms ease,
			visibility 0s linear 350ms;
	}

	.menu.open {
		opacity: 1;
		visibility: visible;
		transition:
			opacity 350ms ease,
			visibility 0s linear 0s;
	}

	.menu-inner {
		max-width: 1280px;
		width: 100%;
		height: 100%;
		margin: 0 auto;
		padding: clamp(96px, 14vh, 140px) clamp(24px, 5vw, 80px) 64px;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: clamp(40px, 5vw, 96px);
		align-content: start;

		/* contents enter after the background fade */
		opacity: 0;
		transform: translateY(6px);
		transition:
			opacity 450ms cubic-bezier(0.22, 0.61, 0.36, 1) 0ms,
			transform 450ms cubic-bezier(0.22, 0.61, 0.36, 1) 0ms;
	}

	.menu.open .menu-inner {
		opacity: 1;
		transform: translateY(0);
		transition:
			opacity 500ms cubic-bezier(0.22, 0.61, 0.36, 1) 200ms,
			transform 500ms cubic-bezier(0.22, 0.61, 0.36, 1) 200ms;
	}

	.col {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.links {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.links a {
		text-decoration: none;
		color: var(--ink);
		transition: color 300ms ease;
		display: inline-flex;
		align-items: baseline;
		gap: 12px;
	}

	.links a:hover {
		color: var(--accent);
	}

	.house-num {
		min-width: 28px;
	}

	.house-name-ja {
		margin-left: 10px;
		color: var(--ink-faint);
	}

	@media (max-width: 720px) {
		.menu-inner {
			grid-template-columns: 1fr;
			gap: clamp(32px, 5vh, 48px);
		}

		.links {
			gap: 12px;
		}
	}
</style>
