import { redirect } from '@sveltejs/kit';
import { readReservation } from '$lib/server/booking';
import { bookingOpen } from '$lib/server/flags';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ cookies }) => {
	if (!bookingOpen()) throw redirect(307, '/contact?notice=booking');
	const reservation = readReservation(cookies);
	// Direct hits / expired hand-offs have no cookie — send them to reserve.
	if (!reservation) throw redirect(307, '/reserve');
	return { reservation };
};
