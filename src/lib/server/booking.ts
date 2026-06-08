// Booking helpers — reference generation and the short-lived hand-off
// cookie that carries a confirmed reservation from the POST action to the
// confirmation page. Replaced by the Hostex booking API in Phase 1.

import type { Cookies } from '@sveltejs/kit';
import type { Reservation } from '$lib/types/domain';

export const BOOKING_COOKIE = 'mokuseki.booking';

// Seconds the confirmation hand-off stays valid. Long enough for the
// redirect, short enough that a stale reservation never re-renders.
const HANDOFF_MAX_AGE = 600;

const REF_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous chars

// MK-XXXX-XXXX — readable, unique enough for a mock. Hostex will supply the
// canonical confirmation code once connected.
export function createReference(): string {
	let body = '';
	for (let i = 0; i < 8; i++) {
		if (i === 4) body += '-';
		body += REF_ALPHABET[Math.floor(Math.random() * REF_ALPHABET.length)];
	}
	return `MK-${body}`;
}

export function stashReservation(cookies: Cookies, reservation: Reservation): void {
	cookies.set(BOOKING_COOKIE, JSON.stringify(reservation), {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		maxAge: HANDOFF_MAX_AGE
	});
}

export function takeReservation(cookies: Cookies): Reservation | null {
	const raw = cookies.get(BOOKING_COOKIE);
	if (!raw) return null;
	cookies.delete(BOOKING_COOKIE, { path: '/' });
	try {
		return JSON.parse(raw) as Reservation;
	} catch {
		return null;
	}
}
