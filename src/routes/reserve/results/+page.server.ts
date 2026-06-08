import { error, redirect } from '@sveltejs/kit';
import { mockProperties, isMockAvailable } from '$lib/server/mock/properties';
import { buildQuote, diffInDays } from '$lib/server/quote';
import type { SearchResult } from '$lib/types/domain';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => {
	const checkIn = url.searchParams.get('checkIn');
	const checkOut = url.searchParams.get('checkOut');
	const guestsRaw = url.searchParams.get('guests');
	const guests = guestsRaw ? Number(guestsRaw) : NaN;

	if (!checkIn || !checkOut || !Number.isFinite(guests) || guests < 1) {
		throw redirect(307, '/reserve');
	}

	const nights = diffInDays(checkIn, checkOut);
	if (nights < 1) {
		throw error(400, 'Invalid date range');
	}

	const results: SearchResult[] = mockProperties
		.filter((p) => p.maxGuests >= guests)
		.filter((p) => isMockAvailable(p.id, checkIn, checkOut))
		.map((p) => ({
			property: p,
			quote: buildQuote(p, checkIn, checkOut, nights, guests)
		}));

	return {
		criteria: { checkIn, checkOut, guests, nights },
		results
	};
};
