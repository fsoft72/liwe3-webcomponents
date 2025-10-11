import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		lib: {
			entry: 'src/lib/index.ts',
			formats: ['es']
		}
	}
});
