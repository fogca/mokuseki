import { redirect } from '@sveltejs/kit';
import { bookingOpen } from '$lib/server/flags';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	if (!bookingOpen()) throw redirect(307, '/contact?notice=booking');
	return {};
};
