// Site-wide constants shared by SEO, sitemap and structured data.

// TODO(launch): set the production origin once the domain is fixed
// (e.g. 'https://mokuseki.jp'). While null, canonical/OG URLs fall back
// to the request origin — fine behind the pre-launch robots Disallow,
// but must be pinned before the domain goes live.
export const SITE_ORIGIN: string | null = null;

export const SITE_NAME = 'MOKUSEKI';
