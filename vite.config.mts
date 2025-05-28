import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite'
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [react(), tailwindcss(), dts({ insertTypesEntry: true })],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'ThaiCustomDatePicker',
      fileName: (format) => `index.${format === 'es' ? 'esm' : 'cjs'}.js`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'dayjs'],
      output: { globals: { react: 'React', 'react-dom': 'ReactDOM', dayjs: 'Dayjs' } },
    },
    sourcemap: true,
    copyPublicDir: false
  },
});