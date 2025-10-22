import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        SmartSelect: resolve(__dirname, 'src/SmartSelect.ts'),
        AITextEditor: resolve(__dirname, 'src/AITextEditor.ts'),
        Toast: resolve(__dirname, 'src/Toast.ts'),
        PopoverMenu: resolve(__dirname, 'src/PopoverMenu.ts'),
      },
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: [],
      output: {
        preserveModules: false,
        exports: 'named',
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    minify: 'esbuild',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
});
