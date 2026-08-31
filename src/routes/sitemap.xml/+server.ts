import { propertyIndex } from '$lib/data/propertyIndex';
import { SITE_ORIGIN } from '$lib/site';
import type { RequestHandler } from './$types';

// Indexable, canonical pages only — transactional routes (results,
// booking, confirmation) are noindex and excluded.
const STATIC_PATHS = [
	'/',
	'/houses',
	'/about',
	'/reserve',
	'/contact',
	'/privacy',
	'/terms',
	'/legal'
];

export const GET: RequestHandler = ({ url }) => {
	const origin = SITE_ORIGIN ?? url.origin;
	const paths = [...STATIC_PATHS, ...propertyIndex.map((p) => `/properties/${p.slug}`)];

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `\t<url><loc>${origin}${p}</loc></url>`).join('\n')}
</urlset>`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
