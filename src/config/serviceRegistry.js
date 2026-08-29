const normalizeBaseUrl = (value, fallback) => {
  const rawValue = (value || fallback || '').trim();
  return rawValue.replace(/\/+$/, '');
};

export const serviceRegistry = Object.freeze({
  /** Dispute AI (FastAPI) — /chat, /health, /sessions */
  ai: normalizeBaseUrl(import.meta.env.VITE_AI_SERVICE_URL, '/api/ai'),
  /** Mia product recommend stub (Laravel AiController) */
  recommendAi: normalizeBaseUrl(
    import.meta.env.VITE_RECOMMEND_AI_URL,
    'http://localhost:8000/api/ai',
  ),
  catalog: normalizeBaseUrl(import.meta.env.VITE_CATALOG_SERVICE_URL, '/api/catalog'),
  commerce: normalizeBaseUrl(import.meta.env.VITE_COMMERCE_SERVICE_URL, '/api/commerce'),
});

export const serviceRuntimeConfig = Object.freeze({
  requestTimeoutMs: Number(import.meta.env.VITE_API_TIMEOUT_MS || 15000),
  healthPollIntervalMs: Number(import.meta.env.VITE_AI_HEALTH_POLL_MS || 25000),
});
