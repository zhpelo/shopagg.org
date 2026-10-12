import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://shopagg.org',
  output: 'static',
  build: {
    format: 'file'
  }
});
