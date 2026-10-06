// Top page opening (OP) controller — Figma 218:604 → 218:637.
//
// The OP has no overlay and no timeline library: it is three attribute
// states on <html> (data-op-phase = logo → image → done), and every visual
// change is a CSS transition declared under html[data-op='play'] in the
// components that own the elements (SiteHeader: lockup, icon, controls;
// TopHero: photo, legal line). This file only decides WHEN each phase starts.
//
// Whether it plays at all is decided before first paint by the inline script
// in src/app.html (html[data-op] = 'play' | 'skip'); this controller never
// starts an OP on its own. Once it finishes — or is cut short — it leaves
// data-op = 'skip', whose CSS defaults equal the OP's end frame, so nothing
// jumps when the OP selectors stop matching.

/** sessionStorage key the pre-paint script in app.html sets ("OP seen in
 *  this tab"). Not read here — kept so the two stay in sync. */
export const OP_SEEN_KEY = 'mk-op';

/** Hydrated later than this after navigation start → settle, never replay.
 *  Shorter than the CSS failsafe's 3s delay, so the failsafe and the
 *  controller can never both run (no replay, no snap-back). */
export const OP_START_LATE_MS = 2500;
/** Earliest moment the photo phase may start, counted from "logo". */
export const OP_IMAGE_AT_MS = 1800;
/** Longest the photo phase waits for the hero image to decode. */
export const OP_IMAGE_WAIT_MS = 2500;
/** "image" → "done" (header controls fade in). */
export const OP_DONE_AFTER_MS = 1200;
/** "done" → settle (attributes removed). */
export const OP_CLEANUP_AFTER_MS = 600;
/** Fast-forward: how long the shortened transitions (--op-fast) run. */
export const OP_FAST_MS = 400;
/** A restored scroll position above this counts as "not at the top". */
const PRESCROLLED_PX = 4;
/** About one frame at 60Hz. */
const FRAME_MS = 17;

/** Any of these from the visitor fast-forwards the OP. The event itself is
 *  never cancelled — the page scrolls, a press on the icon opens the menu. */
const INPUT_EVENTS = ['wheel', 'touchstart', 'pointerdown', 'keydown'] as const;
const INPUT_OPTIONS: AddEventListenerOptions = { capture: true, passive: true, once: true };

type Phase = 'logo' | 'image' | 'done';

const noop = () => {};

/** Final state: the CSS defaults (resting 218:637) take over. Exported for
 *  +layout.svelte's guard: a first load of "/" that renders an error page
 *  never mounts the hero, and would otherwise leave the OP's hidden start
 *  state on the header for good. */
export function settle() {
	const root = document.documentElement;
	delete root.dataset.opPhase;
	root.dataset.op = 'skip';
	root.classList.remove('op-fast');
}

/** Elements whose OP transitions fast-forward re-times. */
const OP_SCOPE = '.Header, .mk-hero';

/**
 * Makes every OP transition still running finish within `ms`, smoothly.
 * html.op-fast only shortens transitions that START after it is set; the
 * ones already under way (the wordmark's 1.1s fade, say) would keep their
 * long duration and then be cut — a visible snap — when settle() removes
 * the OP selectors. Raising their playback rate instead lands them on time.
 */
function hurryRunningTransitions(ms: number) {
	for (const anim of document.getAnimations()) {
		if (!(anim instanceof CSSTransition)) continue;
		const target = (anim.effect as KeyframeEffect | null)?.target;
		if (!(target instanceof Element) || !target.closest(OP_SCOPE)) continue;
		const end = anim.effect?.getComputedTiming().endTime;
		const now = anim.currentTime;
		if (typeof end !== 'number' || typeof now !== 'number') continue;
		const remaining = end - now;
		if (remaining > ms) anim.updatePlaybackRate(remaining / ms);
	}
}

/**
 * Plays the OP if the pre-paint script chose to. Call from the hero's
 * onMount with its photo; returns the cleanup for onMount's return (a client
 * navigation away mid-OP settles everything instead of leaving it half-run).
 */
export function runOpening(photo: HTMLImageElement): () => void {
	const root = document.documentElement;
	if (root.dataset.op !== 'play') return noop;

	// Late hydration (slow device / network) or a page already scrolled:
	// replaying from the rust ground now would yank content the visitor is
	// already looking at — show the end frame at once instead.
	if (performance.now() > OP_START_LATE_MS || window.scrollY > PRESCROLLED_PX) {
		settle();
		return noop;
	}

	let finished = false;
	let fastForwarded = false;
	let raf = 0;
	const timers = new Set<ReturnType<typeof setTimeout>>();

	const later = (ms: number, fn: () => void) => {
		const id = setTimeout(() => {
			timers.delete(id);
			fn();
		}, ms);
		timers.add(id);
	};
	const sleep = (ms: number) => new Promise<void>((resolve) => later(ms, resolve));
	const clearTimers = () => {
		timers.forEach(clearTimeout);
		timers.clear();
	};

	const setPhase = (phase: Phase) => {
		root.dataset.opPhase = phase;
	};

	const onInput = () => fastForward();
	const removeInputListeners = () => {
		for (const type of INPUT_EVENTS) window.removeEventListener(type, onInput, INPUT_OPTIONS);
	};

	function finish() {
		if (finished) return;
		finished = true;
		cancelAnimationFrame(raf);
		clearTimers();
		removeInputListeners();
		settle();
	}

	// html.op-fast shortens every --op-* duration to --op-fast with no
	// delays (in the components' CSS), then "done" moves everything to its
	// end state at once; transitions already running are sped up to land in
	// the same window. Clearing the timers also orphans start()'s pending
	// sleeps, so it never reaches its later phases.
	function fastForward() {
		if (finished || fastForwarded) return;
		fastForwarded = true;
		clearTimers();
		removeInputListeners();
		root.classList.add('op-fast');
		setPhase('done');
		hurryRunningTransitions(OP_FAST_MS);
		// One frame of margin so settle() never lands on a transition's last frame.
		later(OP_FAST_MS + FRAME_MS, finish);
	}

	async function start() {
		if (finished || fastForwarded) return;
		// The clock starts here (not at navigation start), so a slow first
		// paint never eats into the logo's hold.
		setPhase('logo');
		const decoded = Promise.race([photo.decode().catch(noop), sleep(OP_IMAGE_WAIT_MS)]);
		await Promise.all([sleep(OP_IMAGE_AT_MS), decoded]);
		if (finished || fastForwarded) return;
		setPhase('image');
		later(OP_DONE_AFTER_MS, () => {
			setPhase('done');
			later(OP_CLEANUP_AFTER_MS, finish);
		});
	}

	for (const type of INPUT_EVENTS) window.addEventListener(type, onInput, INPUT_OPTIONS);

	// Two frames: the first paint (pre-phase, everything hidden) must be on
	// screen before "logo" flips, or the fade-ins have no start state to
	// transition from.
	raf = requestAnimationFrame(() => {
		raf = requestAnimationFrame(() => void start());
	});

	return finish;
}
