import { error } from '@sveltejs/kit';
import { mockProperties } from '$lib/server/mock/properties';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const property = mockProperties.find((p) => p.slug === params.slug);
	if (!property) {
		throw error(404, 'Property not found');
	}
	return { property };
};
