// Stay-criteria validation shared by the search results and booking flows.
// All dates are calendar dates in the property's timezone (Asia/Tokyo);
// comparisons stay in YYYY-MM-DD string space to avoid UTC/local drift.

import { diffInDays } from './quote';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isValidDateString(s: string): boolean {
	// Date.parse rejects out-of-range ISO dates (e.g. 2026-02-31), unlike
	// the lenient non-ISO parser paths.
	return DATE_RE.test(s) && !Number.isNaN(Date.parse(`${s}T00:00:00Z`));
}

// Today's calendar date in JST regardless of server timezone — Cloudflare
// Workers run in UTC, so `new Date()` local-date shortcuts are off by up
// to 9 hours around midnight.
export function todayJST(): string {
	// en-CA formats as YYYY-MM-DD.
	return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tokyo' }).format(new Date());
}

export type StayCriteria = {
	checkIn: string;
	checkOut: string;
	guests: number;
	nights: number;
};

// Parse + validate search criteria from URL params. Returns null for
// malformed input (bad dates, NaN/fractional guests, past check-in,
// checkOut <= checkIn) — callers redirect back to the search form.
export function parseStayCriteria(url: URL, maxGuests: number): StayCriteria | null {
	const checkIn = url.searchParams.get('checkIn') ?? '';
	const checkOut = url.searchParams.get('checkOut') ?? '';
	const guests = Number(url.searchParams.get('guests'));

	if (!isValidDateString(checkIn) || !isValidDateString(checkOut)) return null;
	if (!Number.isInteger(guests) || guests < 1 || guests > maxGuests) return null;
	if (checkIn < todayJST()) return null;

	const nights = diffInDays(checkIn, checkOut);
	if (!Number.isInteger(nights) || nights < 1) return null;

	return { checkIn, checkOut, guests, nights };
}
