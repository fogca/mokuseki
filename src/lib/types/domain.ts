// Domain types used across the app.
// Hostex API responses are mapped into these types in the service layer
// so the rest of the app is insulated from Hostex schema changes.

export type Locale = 'ja' | 'en';

export type LocalizedText = Record<Locale, string>;

export type Property = {
	id: string;
	slug: string;
	name: LocalizedText;
	location: LocalizedText;
	description: LocalizedText;
	maxGuests: number;
	bedrooms: number;
	minNights: number;
	nightlyRate: number; // JPY, base rate (used until Hostex /rates is wired up)
	spaces: LocalizedText;
	features: LocalizedText[];
	around: LocalizedText[];
	galleryTones: string[]; // fallback tones shown behind photography
	images: string[]; // photography paths; [0] is the hero/lead image
};

export type Quote = {
	propertyId: string;
	checkIn: string; // YYYY-MM-DD
	checkOut: string; // YYYY-MM-DD
	nights: number;
	guests: number;
	subtotal: number;
	taxes: number;
	total: number;
	currency: 'JPY';
};

export type SearchCriteria = {
	checkIn: string;
	checkOut: string;
	guests: number;
};

export type SearchResult = {
	property: Property;
	quote: Quote;
};

export type GuestDetails = {
	lastName: string;
	firstName: string;
	email: string;
	phone: string;
	notes: string;
};

// A confirmed reservation. Persisted to Hostex once the service layer is
// wired up; for now generated in-process and handed to the confirmation
// page via a short-lived cookie.
export type Reservation = {
	reference: string;
	propertySlug: string;
	propertyName: LocalizedText;
	location: LocalizedText;
	checkIn: string;
	checkOut: string;
	nights: number;
	guests: number;
	total: number;
	currency: 'JPY';
	guest: Pick<GuestDetails, 'lastName' | 'firstName' | 'email'>;
};
