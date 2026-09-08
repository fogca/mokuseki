// Scroll-reveal action — mirrors the omaivillas.com reference: elements
// fade (+ rise, for text) into view once, the moment they cross into the
// viewport, then are left alone (no re-hide on scroll back up).
//
// A single shared IntersectionObserver drives every `use:reveal` node,
// toggling `.is-visible` — the actual motion (opacity/transform, duration,
// easing) lives entirely in base.css's `.reveal-text` / `.reveal-img`
// utility classes, so this file only ever decides *when*, never *how*.
import type { Action } from 'svelte/action';

// Matches the reference's IntersectionObserver config: trigger a touch
// before the element's bottom fully clears the viewport, not right at the
// edge, so the reveal reads as "arriving into place" rather than "popping
// in at the last pixel".
const OBSERVER_OPTIONS: IntersectionObserverInit = {
	root: null,
	rootMargin: '0px 0px -10% 0px',
	threshold: 0.2
};

let observer: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver | null {
	if (typeof IntersectionObserver === 'undefined') return null;
	if (observer) return observer;
	observer = new IntersectionObserver((entries) => {
		for (const entry of entries) {
			if (!entry.isIntersecting) continue;
			entry.target.classList.add('is-visible');
			observer?.unobserve(entry.target);
		}
	}, OBSERVER_OPTIONS);
	return observer;
}

// `use:reveal` — apply alongside a `.reveal-text` / `.reveal-img` class.
// No IntersectionObserver support (very old browsers) → reveal immediately;
// never leave content permanently hidden.
export const reveal: Action<HTMLElement> = (node) => {
	const obs = getObserver();
	if (!obs) {
		node.classList.add('is-visible');
		return;
	}
	obs.observe(node);
	return {
		destroy() {
			obs.unobserve(node);
		}
	};
};
