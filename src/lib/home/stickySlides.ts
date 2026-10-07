// Sticky slide stack — the scroll model of omaivillas.com's Destinations
// ("sections_with_sticky_background_images", read from its theme bundle,
// 2026-10-07). A tall section pins a 100vh stage; its scroll progress
// (0 → 1 while pinned) is split evenly between the slides:
//   - background: the slide whose share holds the progress is active (the
//     component crossfades it in CSS — a timed fade, not scrubbed);
//   - text: scrubbed — each slide's text drifts +120 → −120px across its
//     whole share, fading in over the first 40% and out over the last 20%,
//     so a background always switches on an empty frame.

/** Text drift at either end of a slide's share, px (Omai: 120). */
export const TEXT_DRIFT_PX = 120;
/** Share of a slide's window spent fading its text in (Omai: 0.4). */
const FADE_IN_SHARE = 0.4;
/** Share of a slide's window spent fading its text out (Omai: 0.2). */
const FADE_OUT_SHARE = 0.2;

export type TextState = { opacity: number; y: number };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** 0 → 1 while the stage is pinned inside the section. */
export function stageProgress(section: HTMLElement, stage: HTMLElement): number {
	const travel = section.offsetHeight - stage.offsetHeight;
	if (travel <= 0) return 0;
	return clamp01(-section.getBoundingClientRect().top / travel);
}

/** Index of the slide whose share holds `progress`. */
export function activeSlide(progress: number, count: number): number {
	return Math.min(Math.floor(progress * count), count - 1);
}

/** Scrubbed opacity / drift of slide `index`'s text at `progress`. */
export function slideText(progress: number, index: number, count: number): TextState {
	const start = index / count;
	const end = (index + 1) / count;
	if (progress < start) return { opacity: 0, y: TEXT_DRIFT_PX };
	if (progress > end) return { opacity: 0, y: -TEXT_DRIFT_PX };

	const span = end - start;
	const t = (progress - start) / span;
	const fadeInEnd = start + span * FADE_IN_SHARE;
	const fadeOutStart = end - span * FADE_OUT_SHARE;
	let opacity = 1;
	if (progress < fadeInEnd) opacity = (progress - start) / (fadeInEnd - start);
	else if (progress > fadeOutStart) opacity = 1 - (progress - fadeOutStart) / (end - fadeOutStart);
	return { opacity: clamp01(opacity), y: TEXT_DRIFT_PX * (1 - 2 * t) };
}
