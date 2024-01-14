import adapter from '@sveltejs/adapter-auto';
//import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';


/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// base: dev ? '' : '/your-repo-name', // If building for GitHub pages
		adapter: adapter()
	}
};

export default config;
