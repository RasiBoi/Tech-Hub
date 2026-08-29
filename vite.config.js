import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // Dispute FastAPI host (not Laravel). Prefer dedicated proxy target so
  // VITE_AI_SERVICE_URL can stay as same-origin `/api/ai`.
  const aiServiceTarget =
    env.VITE_AI_PROXY_TARGET ||
    (env.VITE_AI_SERVICE_URL?.startsWith('http') && !env.VITE_AI_SERVICE_URL.includes('/api/ai')
      ? env.VITE_AI_SERVICE_URL
      : 'http://127.0.0.1:8080')
  const catalogServiceTarget = env.VITE_CATALOG_SERVICE_URL || 'http://localhost:8000'
  const commerceServiceTarget = env.VITE_COMMERCE_SERVICE_URL || 'http://localhost:8000'

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/api/ai': {
          target: aiServiceTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/ai/, ''),
          // Keep connection alive so Vite doesn't timeout on slow Supabase-backed endpoints
          headers: { Connection: 'keep-alive' },
          timeout: 45000,
        },
        '/api/catalog': {
          target: catalogServiceTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/catalog/, ''),
          headers: { Connection: 'keep-alive' },
          timeout: 45000,
        },
        '/api/commerce': {
          target: commerceServiceTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/commerce/, ''),
          headers: { Connection: 'keep-alive' },
          timeout: 45000,
        },
      },
    },
  }
})

