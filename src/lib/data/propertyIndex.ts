// Client-safe minimal index of properties (id, slug, name).
// Heavy data (rates, availability, gallery, etc.) lives in
// `src/lib/server/mock/properties.ts` and stays server-side.

import type { LocalizedText } from '$lib/types/domain';

export type PropertyIndexEntry = {
	slug: string;
	name: LocalizedText;
};

export const propertyIndex: PropertyIndexEntry[] = [
	{ slug: 'nagoya-castle', name: { ja: '名古屋城', en: 'Nagoya Castle' } },
	{ slug: 'kamejima', name: { ja: '亀島', en: 'Kamejima' } },
	{ slug: 'osu', name: { ja: '大須', en: 'Osu' } },
	{ slug: 'hida', name: { ja: '飛騨', en: 'Hida' } }
];
