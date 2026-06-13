import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const aiServiceTarget = env.VITE_AI_SERVICE_URL || 'http://localhost:8000'
  const catalogServiceTarget = env.VITE_CATALOG_SERVICE_URL || 'http://localhost:8001'
  const commerceServiceTarget = env.VITE_COMMERCE_SERVICE_URL || 'http://localhost:8002'

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
        },
        '/api/catalog': {
          target: catalogServiceTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/catalog/, ''),
        },
        '/api/commerce': {
          target: commerceServiceTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/commerce/, ''),
        },
      },
    },
  }
})
