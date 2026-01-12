import { defineStore } from 'pinia'

// Kita definisikan interface agar ESLint tidak marah karena 'any'
interface User {
  id: number
  username: string
  email: string
}

interface AuthResponse {
  access?: string
  token?: string
  user?: User
  message?: string
  detail?: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    loading: false,
  }),

  actions: {
    async register(formData: Record<string, string | unknown>) {
      const config = useRuntimeConfig()
      this.loading = true

      try {
        const data = await $fetch<AuthResponse>(`${config.public.apiBase}register/`, {
          method: 'POST',
          body: formData,
        })
        return { success: true, data }
      } catch (error: unknown) {
        // Menangani error dengan tipe yang aman
        const fetchError = error as { data: AuthResponse }
        return { success: false, error: fetchError.data }
      } finally {
        this.loading = false
      }
    },

    async login(credentials: Record<string, string | unknown>) {
      const config = useRuntimeConfig()
      this.loading = true

      try {
        const response = await $fetch<AuthResponse>(`${config.public.apiBase}login/`, {
          method: 'POST',
          body: credentials,
        })

        // Simpan token (access dari SimpleJWT atau token dari DRF)
        this.token = response.access || response.token || null
        
        if (this.token) {
          const tokenCookie = useCookie('auth_token')
          tokenCookie.value = this.token
        }

        return { success: true }
      } catch (error: unknown) {
        const fetchError = error as { data: AuthResponse }
        return { success: false, error: fetchError.data }
      } finally {
        this.loading = false
      }
    },
  },
})