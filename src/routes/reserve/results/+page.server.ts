import { redirect } from '@sveltejs/kit';
import { mockProperties, isMockAvailable } from '$lib/server/mock/properties';
import { buildQuote } from '$lib/server/quote';
import { parseStayCriteria } from '$lib/server/validation';
import { bookingOpen } from '$lib/server/flags';
import type { SearchResult } from '$lib/types/domain';
import type { PageServerLoad } from './$types';

const MAX_PARTY = Math.max(...mockProperties.map((p) => p.maxGuests));

export const load: PageServerLoad = ({ url }) => {
	if (!bookingOpen()) throw redirect(307, '/contact?notice=booking');

	const criteria = parseStayCriteria(url, MAX_PARTY);
	if (!criteria) throw redirect(307, '/reserve');
	const { checkIn, checkOut, guests, nights } = criteria;

	const results: SearchResult[] = mockProperties
		.filter((p) => p.maxGuests >= guests)
		// Keep this in sync with resolveStay in booking/[slug]/+page.server.ts —
		// anything listed here must also pass the booking re-check.
		.filter((p) => nights >= p.minNights)
		.filter((p) => isMockAvailable(p.id, checkIn, checkOut))
		.map((p) => ({
			property: p,
			quote: buildQuote(p, checkIn, checkOut, nights, guests)
		}));

	return {
		criteria: { checkIn, checkOut, guests, nights },
		results,
		// Set when the booking page bounced the guest back (stay no longer
		// bookable); the page renders a visible notice instead of a silent loop.
		notice: url.searchParams.get('notice') === 'unavailable' ? ('unavailable' as const) : null
	};
};
