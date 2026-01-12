import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any,
    token: null as string | null,
    loading: false,
  }),
  
  actions: {
    async register(formData: any) {
      const config = useRuntimeConfig()
      this.loading = true
      
      try {
        const data = await $fetch(`${config.public.apiBase}register/`, {
          method: 'POST',
          body: formData
        })
        return { success: true, data }
      } catch (error: any) {
        return { success: false, error: error.data }
      } finally {
        this.loading = false
      }
    },

    async login(credentials: any) {
  const config = useRuntimeConfig()
  this.loading = true
  
  try {
    // GANTI 'token/' menjadi 'login/' agar sesuai dengan urls.py Django kamu
    const response: any = await $fetch(`${config.public.apiBase}login/`, { 
      method: 'POST',
      body: credentials
    })
    
    // Simpan token (pastikan nama field 'access' sesuai dengan response Django-mu)
    this.token = response.access || response.token
    const tokenCookie = useCookie('auth_token')
    tokenCookie.value = this.token
    
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.data }
  } finally {
    this.loading = false
  }
}
  }
})