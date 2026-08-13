// Booking flow gate. The current flow is a MOCK — it must never take
// "reservations" from real guests on the public domain (a guest would
// receive a reference code for a stay the hotel knows nothing about).
// Enable per-environment with BOOKING_OPEN=true (Cloudflare Pages env var)
// once the Hostex hand-off is live. Dev stays open for local work.

import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';

export function bookingOpen(): boolean {
	return dev || env.BOOKING_OPEN === 'true';
}
