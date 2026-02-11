// middleware/admin-guard.global.ts
import { useAuthStore } from '~/store/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path.startsWith('/admin')) {
    const authStore = useAuthStore()

    // Ambil data user jika belum ada (karena refresh)
    if (!authStore.user) {
      await authStore.fetchUser()
    }

    // Jika bukan admin, tendang keluar
    if (!authStore.isAuthenticated || !authStore.isAdmin) {
      
      // Ganti 'process.client' menjadi 'import.meta.client'
      if (import.meta.client) {
        alert("Access Denied: Admin Only Area")
      }
      
      return navigateTo('/')
    }
  }
})