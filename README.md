# Tech-Hub

AI-powered electronics marketplace built with React, Vite, Tailwind CSS, and Framer Motion.

## Distributed Architecture (Frontend Gateway)

The frontend is now structured to consume independently deployed backend services.

- AI service: configured through `VITE_AI_SERVICE_URL`
- Catalog service: configured through `VITE_CATALOG_SERVICE_URL`
- Commerce service: configured through `VITE_COMMERCE_SERVICE_URL`

Service integration is organized under:

- `src/config/serviceRegistry.js`
- `src/services/httpClient.js`
- `src/services/aiService.js`
- `src/hooks/useAiServiceStatus.js`

For local development, Vite proxies these routes to separate services:

- `/api/ai`
- `/api/catalog`
- `/api/commerce`

Copy `.env.example` to `.env` and set service URLs for your environment.

## Auto Deploy (GitHub Actions -> Vercel)

Pushes to the `dev` branch trigger `.github/workflows/vercel-deploy.yml` and deploy a Vercel preview build.

### Required GitHub Secrets

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
