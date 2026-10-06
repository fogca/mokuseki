// Client-safe minimal index of properties (id, slug, name, lead image).
// Heavy data (rates, availability, gallery, etc.) lives in
// `src/lib/server/mock/properties.ts` and stays server-side.

import type { LocalizedText } from '$lib/types/domain';

export type PropertyIndexEntry = {
	slug: string;
	name: LocalizedText;
	/** Lead photo for the menu's house tiles — the same rotation the mock
	 *  data uses for each house's first image, until real per-house
	 *  photography arrives. */
	image: string;
};

export const propertyIndex: PropertyIndexEntry[] = [
	{
		slug: 'nagoya-castle',
		name: { ja: '名古屋城', en: 'Nagoya Castle' },
		image: '/images/mood_00.webp'
	},
	{ slug: 'kamejima', name: { ja: '亀島', en: 'Kamejima' }, image: '/images/mood_01.webp' },
	{ slug: 'osu', name: { ja: '大須', en: 'Osu' }, image: '/images/mood_02.webp' },
	{ slug: 'hida', name: { ja: '飛騨', en: 'Hida' }, image: '/images/mood_03.webp' }
];
