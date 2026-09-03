import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			registerType: 'autoUpdate',
			injectRegister: 'auto',
			devOptions: {
				enabled: true,
				type: 'module'
			},
			manifest: {
				name: 'MOKUSEKI',
				short_name: 'MOKUSEKI',
				description: 'A collection of private houses.',
				theme_color: '#f6f6f6',
				background_color: '#f6f6f6',
				display: 'standalone',
				start_url: '/',
				scope: '/',
				icons: [
					{
						src: '/icon-192.png',
						sizes: '192x192',
						type: 'image/png',
						purpose: 'any'
					},
					{
						src: '/icon-512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any'
					},
					{
						src: '/icon-512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable'
					}
				]
			},
			workbox: {
				globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}'],
				// Explicitly undefined, not omitted -- @vite-pwa/sveltekit's own
				// wrapper re-adds navigateFallback:'/' whenever this key is
				// absent from the object (checks `'navigateFallback' in
				// options.workbox`, which `undefined` satisfies but a missing
				// key doesn't). Left at its forced default, that fallback
				// registers a NavigationRoute bound to a precache entry for '/'
				// that can never exist here (this app is fully SSR'd, nothing
				// prerendered, so globPatterns -- static assets only, no .html
				// -- never puts page markup in the precache) -- and because
				// Workbox tries routes in registration order, that route would
				// claim every navigation before the NetworkFirst 'pages' rule
				// below ever got a chance to run, silently breaking offline
				// page loads outright rather than falling through to it.
				// (Confirmed live in the sibling OTIF project before this was
				// caught here.)
				navigateFallback: undefined,
				cleanupOutdatedCaches: true,
				runtimeCaching: [
					/* Page HTML — cache after first visit so offline browsing
					   works for the informational pages (home, houses, about,
					   contact, ...). NetworkFirst falls back to cache when the
					   network call fails.

					   Explicitly EXCLUDES /reserve and /booking/[slug]: those
					   are the live availability-search and booking-confirmation
					   flow. Serving a stale cached copy there while offline
					   would show wrong availability/booking state, which is
					   actively misleading rather than merely stale -- worse
					   than just failing to load. Everything else is safe to
					   cache: it's read-only marketing/informational content. */
					{
						urlPattern: ({ request, url }) =>
							request.mode === 'navigate' &&
							!url.pathname.startsWith('/reserve') &&
							!url.pathname.startsWith('/booking/'),
						handler: 'NetworkFirst',
						options: {
							cacheName: 'pages',
							networkTimeoutSeconds: 3,
							expiration: {
								maxEntries: 50,
								maxAgeSeconds: 60 * 60 * 24 * 7
							}
						}
					}
				]
			}
		})
	]
});
