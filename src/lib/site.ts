// Site-wide constants shared by SEO, sitemap and structured data.

// TODO(launch): set the production origin once the domain is fixed
// (e.g. 'https://mokuseki.jp'). While null, canonical/OG URLs fall back
// to the request origin — fine behind the pre-launch robots Disallow,
// but must be pinned before the domain goes live.
export const SITE_ORIGIN: string | null = null;

export const SITE_NAME = 'MOKUSEKI';

// TODO(launch): booking now happens entirely on an external platform — set
// this to that platform's URL once decided. All in-site reservation entry
// points (header, footer, home/about CTAs) point here and open in a new
// tab. Until set, '#' is a harmless placeholder (no-op click).
export const RESERVE_URL = '#';
