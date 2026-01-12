<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fdfcfb] to-[#e2d1c3] font-['Quicksand'] p-4">
    <div class="w-full max-w-md bg-white/60 backdrop-blur-sm border border-[#d7ccc8] p-8 rounded-[2rem] shadow-lg">
      <div class="text-center mb-8">
        <h1 class="font-['Irish_Grover'] text-3xl text-[#795548] mb-2">Join the Grove</h1>
        <p class="text-[#a1887f] text-sm">Create your fairy identity</p>
      </div>

      <form class="space-y-4" @submit.prevent="handleRegister">
        <input v-model="form.username" type="text" placeholder="Fairy Name" class="w-full px-4 py-2 bg-white/80 border border-[#d7ccc8] rounded-full focus:ring-2 focus:ring-[#d7ccc8] outline-none" required >
        <input v-model="form.email" type="email" placeholder="Email" class="w-full px-4 py-2 bg-white/80 border border-[#d7ccc8] rounded-full focus:ring-2 focus:ring-[#d7ccc8] outline-none" required >
        <input v-model="form.password" type="password" placeholder="Password" class="w-full px-4 py-2 bg-white/80 border border-[#d7ccc8] rounded-full focus:ring-2 focus:ring-[#d7ccc8] outline-none" required >
        
        <button 
          :disabled="authStore.loading"
          class="w-full py-3 bg-[#a1887f] hover:bg-[#8d6e63] text-white rounded-full mt-4 transition-colors shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {{ authStore.loading ? 'Casting Spell... ✨' : 'Create Account' }}
        </button>
      </form>

      <p class="text-center mt-4 text-xs text-[#a1887f]">
        Already a fairy? <NuxtLink to="/login" class="underline">Go to Login</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/auth'

const authStore = useAuthStore()
const router = useRouter()

const form = reactive({
  username: '',
  email: '',
  password: ''
})

const handleRegister = async () => {
  const result = await authStore.register(form)
  
  if (result.success) {
    alert('✨ Welcome to the grove! Pendaftaran berhasil.')
    router.push('/login') // Pindah ke halaman login
  } else {
    // Menampilkan error dari Django (misal: "This email is already taken")
    const errorMsg = result.error?.message || 'Something went wrong in the forest.'
    alert('🌿 ' + errorMsg)
  }
}
</script>