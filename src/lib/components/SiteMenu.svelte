<script lang="ts">
	import { useI18n } from '$lib/i18n/store.svelte';
	import { propertyIndex } from '$lib/data/propertyIndex';
	import { RESERVE_URL } from '$lib/site';

	type Props = { open: boolean; onClose: () => void };
	let { open, onClose }: Props = $props();

	const i18n = useI18n();

	const exploreLinks = $derived([
		{ href: '/', label: i18n.t.footer.nav.home, external: false },
		{ href: '/about', label: i18n.t.footer.nav.about, external: false },
		{ href: '/#concept', label: i18n.t.footer.nav.concept, external: false },
		{ href: '/#experience', label: i18n.t.footer.nav.experience, external: false },
		// Booking now lives entirely on an external platform (see $lib/site).
		{ href: RESERVE_URL, label: i18n.t.footer.nav.reserve, external: true },
		{ href: '/contact', label: i18n.t.footer.nav.contact, external: false }
	]);

	let menuEl = $state<HTMLDivElement | null>(null);

	// Focus management: enter the dialog on open, restore on close. Links in
	// the closed menu are unreachable anyway (visibility: hidden), so the
	// trap only needs to cycle within the open overlay; Escape closes.
	$effect(() => {
		if (!open || !menuEl) return;
		const previous = document.activeElement as HTMLElement | null;
		menuEl.querySelector<HTMLElement>('a')?.focus();
		return () => previous?.focus();
	});

	function handleKeydown(event: KeyboardEvent) {
		if (!open) return;
		if (event.key === 'Escape') {
			onClose();
			return;
		}
		if (event.key === 'Tab' && menuEl) {
			const links = Array.from(menuEl.querySelectorAll<HTMLElement>('a'));
			if (links.length === 0) return;
			const first = links[0];
			const last = links[links.length - 1];
			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		}
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
	bind:this={menuEl}
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
				{#each exploreLinks as link (link.label)}
					<li>
						<a
							class="h2"
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

	/* One grey for the whole menu (was two: --ink for the link label,
	 * --ink-faint for the eyebrow/house-number/JA-name — inconsistent). */
	.eyebrow,
	.links a,
	.house-num,
	.house-name-ja {
		color: var(--ink);
	}

	.links a {
		text-decoration: none;
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

	@media (max-width: 540px) {
		/* Section titles as a nav LIST read too large at --fs-h2 (29px). */
		.links a {
			font-size: 20px;
		}
	}
</style>
