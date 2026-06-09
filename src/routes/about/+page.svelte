<script lang="ts">
	import { useI18n } from '$lib/i18n/store.svelte';
	import { messages } from '$lib/i18n/messages';
	import SEO from '$lib/components/SEO.svelte';

	const i18n = useI18n();
	const en = messages.en.about;
</script>

<SEO title={i18n.t.meta.about.title} description={i18n.t.meta.about.description} />

<!-- ─── Hero ────────────────────────────────────────── -->
<section class="hero">
	<p class="eyebrow">{en.hero.eyebrow}</p>
	<h1 class="h1">
		{en.hero.ledeLine1}<br />
		{en.hero.ledeLine2}
	</h1>
	{#if i18n.locale === 'ja'}
		<p class="h-ja">
			{i18n.t.about.hero.ledeLine1}{i18n.t.about.hero.ledeLine2}
		</p>
	{/if}
	<div class="hero-figure" aria-hidden="true">
		<div class="hero-tone"></div>
	</div>
	<p class="body-sm hero-sub">
		{#each i18n.t.about.hero.sub.split('\n') as line, i (i)}
			{#if i > 0}<br />{/if}{line}
		{/each}
	</p>
</section>

<!-- ─── Origin ─────────────────────────────────────── -->
<section class="section">
	<header class="sec-head">
		<p class="eyebrow">{en.origin.eyebrow}</p>
		<h2 class="h2">{en.origin.heading}</h2>
		{#if i18n.locale === 'ja'}
			<p class="h-ja">{i18n.t.about.origin.heading}</p>
		{/if}
	</header>

	<div class="origin-body">
		<div class="origin-figure" aria-hidden="true">
			<div class="tone" style:background-color="#d4d4d4"></div>
		</div>
		<div class="origin-text">
			{#each i18n.t.about.origin.paragraphs as para (para)}
				<p class="body">{para}</p>
			{/each}
		</div>
	</div>
</section>

<!-- ─── Approach (Five gestures) ───────────────────── -->
<section class="section">
	<header class="sec-head">
		<p class="eyebrow">{en.approach.eyebrow}</p>
		<h2 class="h2">{en.approach.heading}</h2>
		{#if i18n.locale === 'ja'}
			<p class="h-ja">{i18n.t.about.approach.heading}</p>
		{/if}
		<p class="body-sm head-intro">{i18n.t.about.approach.intro}</p>
	</header>

	<ol class="pillars">
		{#each i18n.t.about.approach.pillars as pillar, i (pillar.index)}
			{@const enPillar = en.approach.pillars[i]}
			<li class="pillar">
				<span class="meta pillar-num">{pillar.index}</span>
				<div class="pillar-body">
					<h3 class="h2">{enPillar.title}</h3>
					{#if i18n.locale === 'ja'}
						<p class="h-ja">{pillar.title}</p>
					{/if}
					<p class="body-sm pillar-desc">{pillar.description}</p>
				</div>
			</li>
		{/each}
	</ol>
</section>

<!-- ─── Closing CTA ────────────────────────────────── -->
<section class="section closing">
	<p class="eyebrow">{en.closing.eyebrow}</p>
	<h2 class="h1 closing-heading">{en.closing.heading}</h2>
	{#if i18n.locale === 'ja'}
		<p class="h-ja closing-heading-ja">{i18n.t.about.closing.heading}</p>
	{/if}
	<a class="btn" href="/reserve">
		<span>{en.closing.cta}</span>
		<span class="arrow" aria-hidden="true">→</span>
	</a>
</section>

<style>
	.section {
		width: 100%;
		max-width: 1180px;
		margin: 0 auto;
		padding: clamp(80px, 14vh, 160px) 0;
	}

	.sec-head {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		text-align: left;
		gap: 8px;
		margin: 0 0 clamp(56px, 8vh, 96px);
		max-width: 720px;
	}

	.head-intro {
		margin-top: 24px;
	}

	/* ─── Hero ────────────────────────────────────────── */
	.hero {
		width: 100%;
		max-width: 1180px;
		margin: 0 auto;
		padding: clamp(48px, 8vh, 96px) 0 clamp(80px, 12vh, 144px);
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		text-align: left;
		gap: 8px;
	}

	.hero-figure {
		width: 100%;
		margin: 24px 0;
	}

	.hero-tone {
		width: 100%;
		aspect-ratio: 21 / 9;
		background:
			linear-gradient(180deg, transparent 70%, rgba(26, 26, 26, 0.06)),
			url('/images/mood_01.png') center / cover no-repeat,
			linear-gradient(135deg, #e0e0e0 0%, #cfcfcf 60%, #b8b8b8 100%);
	}

	.hero-sub {
		max-width: 32ch;
	}

	/* ─── Origin ─────────────────────────────────────── */
	.origin-body {
		display: grid;
		grid-template-columns: 0.9fr 1.1fr;
		gap: clamp(40px, 5vw, 80px);
		align-items: start;
	}

	.origin-figure {
		position: sticky;
		top: 48px;
	}

	.tone {
		width: 100%;
		aspect-ratio: 4 / 5;
		background-color: var(--bg-soft);
		position: relative;
	}

	.tone::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, transparent 60%, rgba(26, 26, 26, 0.06));
	}

	.origin-text {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	/* ─── Approach (Pillars) ─────────────────────────── */
	.pillars {
		list-style: none;
		padding: 0;
		margin: 0 auto;
		max-width: 880px;
		display: flex;
		flex-direction: column;
	}

	.pillar {
		display: grid;
		grid-template-columns: 80px 1fr;
		gap: 40px;
		padding: clamp(36px, 4vh, 48px) 0;
		border-top: 1px solid var(--rule);
		align-items: start;
	}

	.pillar:last-child {
		border-bottom: 1px solid var(--rule);
	}

	.pillar-body {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.pillar-desc {
		margin-top: 8px;
	}

	/* ─── Closing ────────────────────────────────────── */
	.closing {
		max-width: 580px;
		text-align: left;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 8px;
	}

	.closing-heading {
		margin-top: 20px;
	}

	.closing-heading-ja {
		margin-bottom: 40px;
	}

	@media (max-width: 880px) {
		.origin-body {
			grid-template-columns: 1fr;
			gap: 32px;
		}

		.origin-figure {
			position: static;
		}

		.tone {
			aspect-ratio: 3 / 2;
		}
	}

	@media (max-width: 540px) {
		.pillar {
			grid-template-columns: 56px 1fr;
			gap: 24px;
		}

		.hero-tone {
			aspect-ratio: 4 / 3;
		}
	}
</style>
