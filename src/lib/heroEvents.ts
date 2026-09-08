// Shared event name for the home hero's OP effect (see +page.svelte) and
// anything that needs to sync its own entrance to the exact moment the
// hero photo starts revealing — currently the header, see +layout.svelte.
// A plain DOM CustomEvent keeps the two components decoupled (no store,
// no prop-drilling across the layout/page boundary).
export const HERO_IMAGE_START_EVENT = 'mokuseki:hero-image-start';
