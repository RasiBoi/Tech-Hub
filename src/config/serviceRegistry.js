const normalizeBaseUrl = (value, fallback) => {
  const rawValue = (value || fallback || '').trim();
  return rawValue.replace(/\/+$/, '');
};

export const serviceRegistry = Object.freeze({
  ai: normalizeBaseUrl(import.meta.env.VITE_AI_SERVICE_URL, '/api/ai'),
  catalog: normalizeBaseUrl(import.meta.env.VITE_CATALOG_SERVICE_URL, '/api/catalog'),
  commerce: normalizeBaseUrl(import.meta.env.VITE_COMMERCE_SERVICE_URL, '/api/commerce'),
});

export const serviceRuntimeConfig = Object.freeze({
  requestTimeoutMs: Number(import.meta.env.VITE_API_TIMEOUT_MS || 8000),
  healthPollIntervalMs: Number(import.meta.env.VITE_AI_HEALTH_POLL_MS || 25000),
});
