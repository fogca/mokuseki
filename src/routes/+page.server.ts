import { mockProperties } from '$lib/server/mock/properties';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	return {
		properties: mockProperties
	};
};
