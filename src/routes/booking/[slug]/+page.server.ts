import { error, fail, redirect } from '@sveltejs/kit';
import { mockProperties, isMockAvailable } from '$lib/server/mock/properties';
import { buildQuote, diffInDays } from '$lib/server/quote';
import { createReference, stashReservation } from '$lib/server/booking';
import type { GuestDetails, Reservation } from '$lib/types/domain';
import type { Actions, PageServerLoad } from './$types';

// Resolve + validate the search criteria against a property. Shared by the
// load (renders the summary) and the action (re-checks before committing).
function resolveStay(slug: string, url: URL) {
	const checkIn = url.searchParams.get('checkIn');
	const checkOut = url.searchParams.get('checkOut');
	const guestsRaw = url.searchParams.get('guests');
	const guests = guestsRaw ? Number(guestsRaw) : NaN;

	const property = mockProperties.find((p) => p.slug === slug);
	if (!property) throw error(404, 'House not found');

	if (!checkIn || !checkOut || !Number.isFinite(guests) || guests < 1) {
		throw redirect(307, '/reserve');
	}

	const nights = diffInDays(checkIn, checkOut);
	if (
		nights < 1 ||
		guests > property.maxGuests ||
		nights < property.minNights ||
		!isMockAvailable(property.id, checkIn, checkOut)
	) {
		// Stay no longer bookable — send the guest back to fresh results.
		throw redirect(
			307,
			`/reserve/results?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`
		);
	}

	const quote = buildQuote(property, checkIn, checkOut, nights, guests);
	return { property, quote };
}

export const load: PageServerLoad = ({ params, url }) => {
	const { property, quote } = resolveStay(params.slug, url);
	return { property, quote };
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateGuest(form: FormData): {
	values: GuestDetails;
	errors: Partial<Record<keyof GuestDetails, 'required' | 'email'>>;
} {
	const values: GuestDetails = {
		lastName: (form.get('lastName') ?? '').toString().trim(),
		firstName: (form.get('firstName') ?? '').toString().trim(),
		email: (form.get('email') ?? '').toString().trim(),
		phone: (form.get('phone') ?? '').toString().trim(),
		notes: (form.get('notes') ?? '').toString().trim()
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
