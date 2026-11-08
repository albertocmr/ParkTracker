import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel'

const env = { ...loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), ''), ...process.env };
const apiOrigin = new URL(env.PUBLIC_API_URL || 'https://parktracker-backend-odec.onrender.com').origin;
const auth0Origin = `https://${env.PUBLIC_AUTH0_DOMAIN || 'dev-01ujkdlvuv2fm5gp.eu.auth0.com'}`;

// https://astro.build/config
// Tailwind se aplica con PostCSS (postcss.config.js + src/styles/global.css):
// la integración @astrojs/tailwind ya no es compatible con Astro 6+.
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [react()],

  // Content Security Policy: Astro añade a cada página un <meta> con los hashes de sus scripts
  // y estilos, así que un script inyectado (XSS) no se ejecuta. Solo actúa en la build, no en `astro dev`.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        // El backend (análisis y parques) y Auth0 (renovación de tokens)
        `connect-src 'self' ${apiOrigin} ${auth0Origin}`,
        // Auth0 recurre a un iframe oculto si no hay refresh token; "Crea tu ruta" incrusta el mapa de OSRM
        `frame-src ${auth0Origin} https://map.project-osrm.org`,
        // Teselas de OpenStreetMap y la foto de perfil del usuario (Google, Gravatar…)
        "img-src 'self' data: blob: https:",
        "font-src 'self' https://fonts.gstatic.com",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ],
      styleDirective: {
        resources: ["'self'", 'https://fonts.googleapis.com'],
      },
    },
  },

  server: {
    port: 8001,
  },
});
