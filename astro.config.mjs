import { defineConfig } from 'astro/config';
export default defineConfig({
  site: process.env.SITE_URL || 'https://example.com',
  output: 'static',
  trailingSlash: 'always',
  server: { host: '0.0.0.0', port: 4173, allowedHosts: ['terminal.local'] },
});
