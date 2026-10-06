// Mouse drag-to-scroll for horizontal rails (2026-10 Top redesign; used by
// HouseRail). Touch and pen already scroll a rail natively — with snap — so
// only a mouse needs help, and only once a press has clearly become a drag.
//
// Pointer capture is taken AFTER the movement threshold, never on
// pointerdown: capturing on press retargets the follow-up click to the rail
// itself, which silently kills plain clicks on the card links inside it.
// A press that did turn into a drag swallows exactly one click (the one
// fired on release), so letting go over a card doesn't navigate.
//
// The drag state class (.is-dragging: snap off, grabbing cursor) lives in
// base.css, since it's toggled from here rather than by a component.
import type { Action } from 'svelte/action';

// Movement (px) before a press counts as a drag; below it, it's a click.
const DRAG_THRESHOLD_PX = 6;

const DRAGGING_CLASS = 'is-dragging';

// PointerEvent.button value / .buttons bit of the primary (left) button.
const PRIMARY_BUTTON = 0;
const PRIMARY_BUTTONS_BIT = 1;

export const dragScroll: Action<HTMLElement> = (node) => {
	let pointerId: number | null = null;
	let startX = 0;
	let startY = 0;
	let startScroll = 0;
	let dragging = false;
	let suppressClick = false;
	let clearTimer: ReturnType<typeof setTimeout> | undefined;

	function reset() {
		pointerId = null;
		if (dragging) node.classList.remove(DRAGGING_CLASS);
		dragging = false;
	}

	function onPointerDown(e: PointerEvent) {
		if (e.pointerType !== 'mouse' || e.button !== PRIMARY_BUTTON) return;
		// A fresh press always starts clean — a stale suppression (from a
		// drag whose release produced no click) must never eat this one.
		suppressClick = false;
		pointerId = e.pointerId;
		startX = e.clientX;
		startY = e.clientY;
		startScroll = node.scrollLeft;
		dragging = false;
	}

	function onPointerMove(e: PointerEvent) {
		if (e.pointerId !== pointerId) return;
		// Released outside the window before the threshold (no capture yet,
		// so no pointerup reached us): a later hover must not resume a drag.
		if ((e.buttons & PRIMARY_BUTTONS_BIT) === 0) {
			reset();
			return;
		}
		const dx = e.clientX - startX;
		if (!dragging) {
			if (Math.hypot(dx, e.clientY - startY) <= DRAG_THRESHOLD_PX) return;
			dragging = true;
			node.setPointerCapture(e.pointerId);
			node.classList.add(DRAGGING_CLASS);
			// A press that began on caption text may already have started a
			// selection; a drag shouldn't leave one highlighted.
			window.getSelection()?.removeAllRanges();
		}
		node.scrollLeft = startScroll - dx;
	}

	function onPointerUp(e: PointerEvent) {
		if (e.pointerId !== pointerId) return;
		const wasDrag = dragging;
		if (node.hasPointerCapture(e.pointerId)) node.releasePointerCapture(e.pointerId);
		reset();
		if (!wasDrag) return;
		suppressClick = true;
		// The click (if any) is dispatched in the same task as this
		// pointerup, so a 0ms timer only ever clears a suppression that no
		// click consumed — e.g. a keyboard "click" on a link later on.
		clearTimeout(clearTimer);
		clearTimer = setTimeout(() => (suppressClick = false), 0);
	}

	// Cancelled or capture lost mid-drag (element hidden, window blur …):
	// no click follows, so just drop the drag.
	function onPointerAbort(e: PointerEvent) {
		if (e.pointerId === pointerId) reset();
	}

	// Capture phase, so it runs before the card link's own handling (and
	// before SvelteKit's router sees the click).
	function onClickCapture(e: MouseEvent) {
		if (!suppressClick) return;
		suppressClick = false;
		e.preventDefault();
		e.stopPropagation();
	}

	// Links and images are natively draggable; the browser's drag-and-drop
	// would start before our threshold and cancel the pointer stream.
	function onDragStart(e: DragEvent) {
		if (pointerId !== null) e.preventDefault();
	}

	node.addEventListener('pointerdown', onPointerDown);
	node.addEventListener('pointermove', onPointerMove);
	node.addEventListener('pointerup', onPointerUp);
	node.addEventListener('pointercancel', onPointerAbort);
	node.addEventListener('lostpointercapture', onPointerAbort);
	node.addEventListener('click', onClickCapture, true);
	node.addEventListener('dragstart', onDragStart);

	return {
		destroy() {
			clearTimeout(clearTimer);
			node.removeEventListener('pointerdown', onPointerDown);
			node.removeEventListener('pointermove', onPointerMove);
			node.removeEventListener('pointerup', onPointerUp);
			node.removeEventListener('pointercancel', onPointerAbort);
			node.removeEventListener('lostpointercapture', onPointerAbort);
			node.removeEventListener('click', onClickCapture, true);
			node.removeEventListener('dragstart', onDragStart);
		}
	};
};
