// Reactive locale store using Svelte 5 runes + context.
// Persists the selected locale to localStorage so refresh keeps the choice.

import { getContext, setContext } from 'svelte';
import { browser } from '$app/environment';
import type { Locale } from '$lib/types/domain';
import { messages } from './messages';

const KEY = Symbol('i18n');
const STORAGE_KEY = 'mokuseki.locale';

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
			try {
				localStorage.setItem(STORAGE_KEY, next);
			} catch {
				// noop — storage may be unavailable
			}
		}
	}
}

export function provideI18n(): I18nStore {
	const initial: Locale =
		browser && (localStorage.getItem(STORAGE_KEY) as Locale | null) === 'en' ? 'en' : 'ja';
	const store = new I18nStore(initial);
	setContext(KEY, store);
	return store;
}

export function useI18n(): I18nStore {
	const store = getContext<I18nStore | undefined>(KEY);
	if (!store) throw new Error('useI18n() must be called within a layout that calls provideI18n()');
	return store;
}
