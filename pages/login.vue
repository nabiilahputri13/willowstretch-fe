<template>
  <div class="min-h-screen flex items-center justify-center bg-[#FFFCDE] font-['Quicksand'] p-4">
    <div class="absolute top-10 left-10 text-4xl opacity-20 select-none">🌿</div>
    <div class="absolute bottom-10 right-10 text-4xl opacity-20 select-none">🦋</div>

    <div class="w-full max-w-md bg-[#F7CED0] border border-[#CA4489] p-8 rounded-[2rem] shadow-xl">
      <div class="text-center mb-8">
        <h1 class="font-['Irish_Grover'] text-3xl text-[#CA4489] mb-2">Welcome Back!</h1>
        <p class="text-[#8d6e63] text-sm">Enter the forest to continue your journey</p>
      </div>

      <form class="space-y-6" @submit.prevent="handleLogin">
        <div>
          <label class="block text-[#CA4489] text-sm font-medium mb-1">Email Address</label>
          <input 
            v-model="email" 
            type="email" 
            class="w-full px-4 py-2 bg-white/80 border border-[#CA4489] rounded-full focus:outline-none focus:ring-2 focus:ring-[#aed581] transition-all"
            placeholder="fairy@willow.stretch"
          >
        </div>

        <div>
          <label class="block text-[#CA4489] text-sm font-medium mb-1">Password</label>
          <input 
            v-model="password" 
            type="password" 
            class="w-full px-4 py-2 bg-white/80 border border-[#CA4489] rounded-full focus:outline-none focus:ring-2 focus:ring-[#aed581] transition-all"
            placeholder="••••••••"
          >
        </div>

        <button 
  :disabled="authStore.loading"
  type="submit" 
  class="w-full py-3 bg-[#CA4489] hover:bg-[#7cb342] text-white font-medium rounded-full shadow-lg transform transition active:scale-95 disabled:bg-gray-300"
>
  {{ authStore.loading ? 'Casting Spell... ✨' : 'Spread Wings & Login' }}
</button>
      </form>

      <p class="mt-6 text-center text-sm text-[#8d6e63]">
        New traveler? 
        <NuxtLink to="/register" class="text-[#556b2f] font-bold hover:underline">Seek a new path</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/auth'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')

const handleLogin = async () => {
  const result = await authStore.login({
    email: email.value, // Django biasanya pakai username, sesuaikan dengan backend-mu
    password: password.value
  })

  if (result.success) {
    alert('✨ Magic successful! Welcome back.')
    router.push('/') // Pindah ke dashboard/beranda
  } else {
    alert('🌿 The forest denies your entry: ' + (result.error?.detail || 'Invalid credentials'))
  }
}
</script>