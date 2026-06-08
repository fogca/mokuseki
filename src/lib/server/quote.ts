// Quote/pricing helpers shared by the search results and booking flows.
// Kept framework-agnostic so the Hostex service layer can call the same
// math once `/rates` is wired up.

import type { Property, Quote } from '$lib/types/domain';

export const TAX_RATE = 0.1;

export function diffInDays(start: string, end: string): number {
	const ms = new Date(end).getTime() - new Date(start).getTime();
	return Math.round(ms / (1000 * 60 * 60 * 24));
}

export function buildQuote(
	property: Property,
	checkIn: string,
	checkOut: string,
	nights: number,
	guests: number
): Quote {
	const subtotal = property.nightlyRate * nights;
	const taxes = Math.round(subtotal * TAX_RATE);
	return {
		propertyId: property.id,
		checkIn,
		checkOut,
		nights,
		guests,
		subtotal,
		taxes,
		total: subtotal + taxes,
		currency: 'JPY'
	};
}
