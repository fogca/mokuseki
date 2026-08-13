// Reactive locale store using Svelte 5 runes + context.
// The locale persists in a cookie (not localStorage) so the server can
// render the chosen language on first paint — no ja→en flash after
// hydration, and <html lang> stays correct (see hooks.server.ts).

import { getContext, setContext } from 'svelte';
import { browser } from '$app/environment';
import type { Locale } from '$lib/types/domain';
import { messages } from './messages';

const KEY = Symbol('i18n');

// Shared with +layout.server.ts and hooks.server.ts.
export const LOCALE_COOKIE = 'mokuseki.locale';

class I18nStore {
	locale = $state<Locale>('ja');

	constructor(initial: Locale) {
		this.locale = initial;
	}

	get t() {
		return messages[this.locale];
	}

	setLocale(next: Locale) {
		this.locale = next;
		if (browser) {
			document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
			document.documentElement.lang = next;
		}
	}
}

export function provideI18n(initial: Locale = 'ja'): I18nStore {
	const store = new I18nStore(initial);
	setContext(KEY, store);
	return store;
}

export function useI18n(): I18nStore {
	const store = getContext<I18nStore | undefined>(KEY);
	if (!store) throw new Error('useI18n() must be called within a layout that calls provideI18n()');
	return store;
}
