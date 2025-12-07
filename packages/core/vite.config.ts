import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig( {
  build: {
    lib: {
      entry: {
        index: resolve( __dirname, 'src/index.ts' ),
        SmartSelect: resolve( __dirname, 'src/SmartSelect.ts' ),
        AITextEditor: resolve( __dirname, 'src/AITextEditor.ts' ),
        AIMarkdownEditor: resolve( __dirname, 'src/AIMarkdownEditor.ts' ),
        MarkdownPreview: resolve( __dirname, 'src/MarkdownPreview.ts' ),
        Toast: resolve( __dirname, 'src/Toast.ts' ),
        Dialog: resolve( __dirname, 'src/Dialog.ts' ),
        PopoverMenu: resolve( __dirname, 'src/PopoverMenu.ts' ),
        DateSelector: resolve( __dirname, 'src/DateSelector.ts' ),
        TreeView: resolve( __dirname, 'src/TreeView.ts' ),
        ContainerBox: resolve( __dirname, 'src/ContainerBox.ts' ),
        Drawer: resolve( __dirname, 'src/Drawer.ts' ),
        ImageView: resolve( __dirname, 'src/ImageView.ts' ),
        ChunkUploader: resolve( __dirname, 'src/ChunkUploader.ts' ),
        CheckList: resolve( __dirname, 'src/CheckList.ts' ),
        ButtonToolbar: resolve( __dirname, 'src/ButtonToolbar.ts' ),
      },
      formats: [ 'es' ],
      fileName: ( format, entryName ) => `${ entryName }.js`,
    },
    rollupOptions: {
      external: [],
      output: {
        preserveModules: false,
        exports: 'named',
      },
    },
    outDir: 'dist',
    emptyOutDir: false,
    sourcemap: true,
    minify: 'esbuild',
  },
  resolve: {
    extensions: [ '.ts', '.js' ],
  },
} );
