// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  routeRules: {
    '/': { redirect: '/home' },
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    'lucide-nuxt',
    '@nuxt/eslint',
  ],
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:8000/' 
    }
  },
  app: {
    head: {
      link: [
        { 
          rel: 'stylesheet', 
          href: 'https://fonts.googleapis.com/css2?family=Irish+Grover&family=Quicksand:wght@300;400;500;600&family=Lora:ital,wght@0,400;1,500&display=swap'
        }
      ]
    }
  },
})