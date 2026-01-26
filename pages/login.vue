<script setup lang="ts">
import { useAuthStore } from '~/store/auth'

definePageMeta({
  layout: 'blank'
})

interface LoginResult {
  success: boolean
  error?: {
    error?: string
  }
}

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')

const handleLogin = async () => {
  if (!email.value || !password.value) {
    alert('Mohon isi email dan password.')
    return
  }

  const result = await authStore.login({
    email: email.value,
    password: password.value
  }) as LoginResult

  if (result.success) {
    router.push('/home') 
  } else {
    const msg = result.error?.error || 'Login gagal. Periksa kembali email dan password Anda.'
    alert(msg)
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-pink-50 font-sans p-4">
    <div class="w-full max-w-md bg-white border border-pink-100 p-8 md:p-10 rounded-3xl shadow-lg">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-extrabold text-pink-600 mb-2">Welcome Back!</h1>
        <p class="text-gray-500">Silakan login untuk melanjutkan.</p>
      </div>

      <form class="space-y-6" @submit.prevent="handleLogin">
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
          <input 
            v-model="email" 
            type="email" 
            required
            class="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
            placeholder="nama@email.com"
          >
        </div>

        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2">Password</label>
          <input 
            v-model="password" 
            type="password" 
            required
            class="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
            placeholder="••••••••"
          >
        </div>

        <button 
          :disabled="authStore.loading"
          type="submit" 
          class="w-full py-3.5 bg-pink-500 hover:bg-pink-600 text-white font-bold text-lg rounded-xl shadow-md transform transition active:scale-[0.98] disabled:bg-pink-300 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <svg v-if="authStore.loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          {{ authStore.loading ? 'Memproses...' : 'Login' }}
        </button>
      </form>

      <p class="mt-8 text-center text-sm text-gray-500">
        Belum punya akun? 
        <NuxtLink to="/register" class="text-pink-600 font-bold hover:text-pink-700 hover:underline transition">Daftar sekarang</NuxtLink>
      </p>
    </div>
  </div>
</template>