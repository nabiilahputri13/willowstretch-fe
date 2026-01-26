<script setup lang="ts">
import { useAuthStore } from '~/store/auth'

definePageMeta({
  layout: 'blank'
})

const authStore = useAuthStore()
const router = useRouter()

const form = reactive({
  username: '',
  email: '',
  password: ''
})

const handleRegister = async () => {
  if (!form.username || !form.email || !form.password) {
    alert('Mohon lengkapi semua data pendaftaran.')
    return
  }

  // Cast 'any' agar TypeScript tidak komplain soal tipe return
  const result: any = await authStore.register(form)
  
  if (result.success) {
    alert('Pendaftaran Berhasil! Silakan login dengan akun baru Anda.')
    router.push('/login') 
  } else {
    let errorMsg = 'Terjadi kesalahan saat mendaftar.'
    
    // FIX ERROR: "Type 'undefined' cannot be used as an index type"
    // Kita pastikan result.error itu object dan punya key
    if (result.error && typeof result.error === 'object') {
        const keys = Object.keys(result.error)
        const firstKey = keys[0] // Simpan ke variabel dulu

        // Cek apakah firstKey benar-benar ada (tidak undefined)
        if (firstKey) {
            // TypeScript sekarang tahu 'firstKey' pasti string
            errorMsg = `${firstKey}: ${result.error[firstKey]}`
        }
    } else if (result.error) {
        // Fallback kalau error cuma string biasa
        errorMsg = String(result.error)
    }
    
    alert(errorMsg)
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-pink-50 font-sans p-4">
    
    <div class="w-full max-w-md bg-white border border-pink-100 p-8 md:p-10 rounded-3xl shadow-lg">
      
      <div class="text-center mb-8">
        <h1 class="text-3xl font-extrabold text-pink-600 mb-2">Join Willowstretch</h1>
        <p class="text-gray-500">Buat akun baru untuk memulai perjalanan yoga Anda.</p>
      </div>

      <form class="space-y-5" @submit.prevent="handleRegister">
        
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2">Username</label>
          <input 
            v-model="form.username" 
            type="text" 
            required
            class="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
            placeholder="Pilih username unik"
          >
        </div>

        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
          <input 
            v-model="form.email" 
            type="email" 
            required
            class="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
            placeholder="nama@email.com"
          >
        </div>

        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2">Password</label>
          <input 
            v-model="form.password" 
            type="password" 
            required
            class="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
            placeholder="••••••••"
          >
          <p class="text-xs text-gray-400 mt-1">*Minimal 8 karakter</p>
        </div>
        
        <button 
          :disabled="authStore.loading"
          class="w-full py-3.5 bg-pink-500 hover:bg-pink-600 text-white font-bold text-lg rounded-xl shadow-md transform transition active:scale-[0.98] disabled:bg-pink-300 disabled:cursor-not-allowed flex items-center justify-center mt-6"
        >
           <svg v-if="authStore.loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ authStore.loading ? 'Mendaftar...' : 'Buat Akun' }}
        </button>
      </form>

      <p class="text-center mt-8 text-sm text-gray-500">
        Sudah punya akun? 
        <NuxtLink to="/login" class="text-pink-600 font-bold hover:text-pink-700 hover:underline transition">Login di sini</NuxtLink>
      </p>
    </div>
  </div>
</template>