import { redirect } from '@sveltejs/kit';
import { takeReservation } from '$lib/server/booking';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ cookies }) => {
	const reservation = takeReservation(cookies);
	// Direct hits / refreshes have no hand-off cookie — send them to reserve.
	if (!reservation) throw redirect(307, '/reserve');
	return { reservation };
};
