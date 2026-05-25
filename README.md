# Tech-Hub

AI-powered electronics marketplace built with React, Vite, Tailwind CSS, and Framer Motion.

## Auto Deploy (GitHub Actions -> Vercel)

Pushes to the `dev` branch trigger `.github/workflows/vercel-deploy.yml` and deploy a Vercel preview build.

### Required GitHub Secrets

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
