import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import finalizeCsp from './scripts/finalize-csp.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://gibor06.github.io',
  base: '/',
  redirects: {
    '/gibor06': 'https://github.com/gibor06',
    '/github': 'https://github.com/gibor06',
  },
  output: 'static',
  security: {
    csp: {
      directives: [
        "default-src 'none'",
        "base-uri 'none'",
        "object-src 'none'",
        "form-action 'none'",
        "connect-src 'self'",
        "img-src 'self' data:",
        "font-src 'self' https://fonts.gstatic.com",
        "media-src 'self'",
        "frame-src 'none'",
        "worker-src 'none'",
        'upgrade-insecure-requests',
      ],
      scriptDirective: { resources: ["'self'", { resource: "'none'", kind: 'attribute' }] },
      styleDirective: {
        resources: ["'self'", 'https://fonts.googleapis.com', { resource: "'unsafe-inline'", kind: 'attribute' }],
      },
    },
  },
  integrations: [mdx(), sitemap(), finalizeCsp()],
  vite: {
    plugins: [tailwindcss()],
  },
});
