import { LOCALE_COOKIE } from '$lib/i18n/store.svelte';
import type { Handle } from '@sveltejs/kit';

// Keep <html lang> in sync with the locale cookie so SSR ships the right
// language attribute (screen readers, translation prompts, SEO).
export const handle: Handle = async ({ event, resolve }) => {
	const lang = event.cookies.get(LOCALE_COOKIE) === 'en' ? 'en' : 'ja';
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', lang)
	});
};
