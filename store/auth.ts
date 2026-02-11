import { defineStore } from 'pinia'

interface User {
  id: number
  username: string
  email: string
  is_admin: boolean 
}

interface AuthResponse {
  access?: string
  user?: User
  message?: string
  detail?: string
}

interface FetchError {
  data: Record<string, unknown>
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    loading: false,
  }),

  getters: {
    isAdmin: (state) => state.user?.is_admin || false,
    isAuthenticated: (state) => !!state.token,
  },

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
      } catch (err) {
        const error = err as FetchError
        return { success: false, error: error.data }
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

        // 1. Simpan Token
        this.token = response.access || null
        
        // 2. Simpan User
        if (response.user) {
          this.user = response.user
        }
        
        // 3. Simpan token ke cookie 'access_token'
        if (this.token) {
          const tokenCookie = useCookie('access_token', {
            maxAge: 60 * 60, // 1 Jam
            path: '/'
          })
          tokenCookie.value = this.token
        }

        return { success: true }
      } catch (err) {
        const error = err as FetchError
        return { success: false, error: error.data }
      } finally {
        this.loading = false
      }
    },

    async fetchUser() {
      const config = useRuntimeConfig()
      // Ambil dari cookie 'access_token'
      const tokenCookie = useCookie('access_token')
      
      const token = this.token || tokenCookie.value
      
      if (!token) return

      this.token = token

      try {
        const userData = await $fetch<User>(`${config.public.apiBase}/me/`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.user = userData
      } catch {
        this.logout()
      }
    },

    logout() {
      this.token = null
      this.user = null
      // Hapus cookie 'access_token'
      const tokenCookie = useCookie('access_token')
      tokenCookie.value = null
    }
  },
})