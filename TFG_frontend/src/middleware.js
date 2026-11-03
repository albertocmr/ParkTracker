import { defineMiddleware } from "astro:middleware";

// Cabeceras de seguridad que completan la CSP que genera Astro (security.csp en astro.config.mjs)
const SECURITY_HEADERS = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  // Ubicación solo para la propia web (futuro "¿estoy dentro del parque?"); el resto, desactivado
  "Permissions-Policy": "geolocation=(self), camera=(), microphone=(), payment=(), usb=()",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains",
};

// Nadie puede incrustar la web en un iframe (clickjacking). Se añade a la CSP de Astro, sin sustituirla.
const FRAME_ANCESTORS = "frame-ancestors 'none'";

function applyHeaders(headers) {
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(name, value);
  }
  const csp = headers.get("Content-Security-Policy");
  headers.set("Content-Security-Policy", csp ? `${csp.replace(/;\s*$/, "")}; ${FRAME_ANCESTORS}` : FRAME_ANCESTORS);
}

export const onRequest = defineMiddleware(async (_context, next) => {
  let response = await next();
  try {
    applyHeaders(response.headers);
  } catch {
    // Algunas respuestas (p. ej. Response.redirect) tienen las cabeceras inmutables: se copian
    response = new Response(response.body, response);
    applyHeaders(response.headers);
  }
  return response;
});
