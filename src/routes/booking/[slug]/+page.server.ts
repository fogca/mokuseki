import { error, fail, redirect } from '@sveltejs/kit';
import { mockProperties, isMockAvailable } from '$lib/server/mock/properties';
import { buildQuote } from '$lib/server/quote';
import { parseStayCriteria } from '$lib/server/validation';
import { bookingOpen } from '$lib/server/flags';
import { createReference, stashReservation } from '$lib/server/booking';
import type { GuestDetails, Reservation } from '$lib/types/domain';
import type { Actions, PageServerLoad } from './$types';

const MAX_PARTY = Math.max(...mockProperties.map((p) => p.maxGuests));

// Resolve + validate the search criteria against a property. Shared by the
// load (renders the summary) and the action (re-checks before committing).
function resolveStay(slug: string, url: URL) {
	const property = mockProperties.find((p) => p.slug === slug);
	if (!property) throw error(404, 'House not found');

	const criteria = parseStayCriteria(url, MAX_PARTY);
	if (!criteria) throw redirect(307, '/reserve');
	const { checkIn, checkOut, guests, nights } = criteria;

	if (
		guests > property.maxGuests ||
		nights < property.minNights ||
		!isMockAvailable(property.id, checkIn, checkOut)
	) {
		// Stay no longer bookable — back to fresh results, with a visible
		// notice (otherwise this reads as a silent broken loop).
		const q = new URLSearchParams({
			checkIn,
			checkOut,
			guests: String(guests),
			notice: 'unavailable'
		});
		throw redirect(307, `/reserve/results?${q}`);
	}

	const quote = buildQuote(property, checkIn, checkOut, nights, guests);
	return { property, quote };
}

export const load: PageServerLoad = ({ params, url }) => {
	if (!bookingOpen()) throw redirect(307, '/contact?notice=booking');
	const { property, quote } = resolveStay(params.slug, url);
	return { property, quote };
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Server-side caps so a hostile/broken client can't stuff the hand-off
// cookie past the 4 KB browser limit (which would silently drop it).
const FIELD_MAX: Record<keyof GuestDetails, number> = {
	lastName: 100,
	firstName: 100,
	email: 254,
	phone: 40,
	notes: 1000
};

function validateGuest(form: FormData): {
	values: GuestDetails;
	errors: Partial<Record<keyof GuestDetails, 'required' | 'email'>>;
} {
	const field = (name: keyof GuestDetails) =>
		(form.get(name) ?? '').toString().trim().slice(0, FIELD_MAX[name]);

	const values: GuestDetails = {
		lastName: field('lastName'),
		firstName: field('firstName'),
		email: field('email'),
		phone: field('phone'),
		notes: field('notes')
	};

	const errors: Partial<Record<keyof GuestDetails, 'required' | 'email'>> = {};
	if (!values.lastName) errors.lastName = 'required';
	if (!values.firstName) errors.firstName = 'required';
	if (!values.email) errors.email = 'required';
	else if (!EMAIL_RE.test(values.email)) errors.email = 'email';
	if (!values.phone) errors.phone = 'required';

	return { values, errors };
}

export const actions: Actions = {
	default: async ({ params, url, request, cookies }) => {
		if (!bookingOpen()) throw redirect(307, '/contact?notice=booking');
		const { property, quote } = resolveStay(params.slug, url);
		const form = await request.formData();
		const { values, errors } = validateGuest(form);

		if (Object.keys(errors).length > 0) {
			return fail(400, { errors, values });
		}

		const reservation: Reservation = {
			reference: createReference(),
			propertySlug: property.slug,
			propertyName: property.name,
			location: property.location,
			checkIn: quote.checkIn,
			checkOut: quote.checkOut,
			nights: quote.nights,
			guests: quote.guests,
			total: quote.total,
			currency: quote.currency,
			guest: {
				lastName: values.lastName,
				firstName: values.firstName,
				email: values.email
			}
		};

		// TODO(hostex): POST to Hostex reservations API and use its
		// confirmation code instead of the generated reference.
		stashReservation(cookies, reservation);

		throw redirect(303, `/booking/${property.slug}/confirmed`);
	}
};
