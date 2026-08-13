import { LOCALE_COOKIE } from '$lib/i18n/store.svelte';
import { bookingOpen } from '$lib/server/flags';
import type { Locale } from '$lib/types/domain';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ cookies }) => {
	const locale: Locale = cookies.get(LOCALE_COOKIE) === 'en' ? 'en' : 'ja';
	return { locale, bookingOpen: bookingOpen() };
};
