<template>
  <nav 
    :class="[
      'fixed top-0 left-0 w-full z-50 px-12 py-4 flex items-center justify-between transition-all duration-500 ease-in-out',
      showNavbar ? 'translate-y-0' : '-translate-y-full',
      isAtTop ? 'bg-transparent text-white' : 'bg-[#0F3525]/95 backdrop-blur-md text-white shadow-lg'
    ]"
    @mouseenter="showNavbar = true"
  >
    <NuxtLink to="/" class="font-['Irish_Grover'] text-2xl tracking-wider">
      Willowstretch
    </NuxtLink>

    <div class="flex gap-8 font-medium">
      <NuxtLink 
        v-for="link in navLinks" 
        :key="link.path" 
        :to="link.path"
        class="hover:text-[#F7D0D6] transition-colors"
        active-class="text-[#F7D0D6]"
      >
        {{ link.name }}
      </NuxtLink>
    </div>

    <div class="flex items-center gap-4">
      <NuxtLink to="/login" class="w-10 h-10 rounded-full border border-white flex items-center justify-center hover:bg-white/20 transition">
        <span class="text-xs">👤</span>
      </NuxtLink>
    </div>

    <div 
      class="absolute top-0 left-0 w-full h-4 -z-10" 
      @mouseenter="showNavbar = true"
    />
  </nav>
</template>

<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'

const { y } = useWindowScroll()
const showNavbar = ref(true)
const isAtTop = ref(true)
const lastScrollPos = ref(0)

const navLinks = [
  { name: 'Home', path: '/home' },
  { name: 'Schedule', path: '/schedule' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'Teachers', path: '/teachers' },
]

// Pantau arah scroll
watch(y, (currentY) => {
  // Cek apakah di paling atas
  isAtTop.value = currentY < 50

  if (currentY <= 0) {
    showNavbar.value = true
    return
  }

  // Jika scroll ke bawah, sembunyikan. Jika ke atas, munculkan.
  if (currentY > lastScrollPos.value && currentY > 100) {
    showNavbar.value = false // Scroll Down
  } else {
    showNavbar.value = true // Scroll Up
  }
  
  lastScrollPos.value = currentY
})
</script>