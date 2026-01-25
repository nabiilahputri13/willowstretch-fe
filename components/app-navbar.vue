<template>
  <nav 
    :class="[
      'fixed top-0 left-0 w-full z-50 px-12 py-4 flex items-center justify-between transition-all duration-500 ease-in-out',
      showNavbar ? 'translate-y-0' : '-translate-y-full',
      isAtTop ? 'bg-transparent text-white' : 'bg-[#0F3525]/95 backdrop-blur-md text-white shadow-lg'
    ]"
    @mouseenter="showNavbar = true"
  >
    <NuxtLink to="/home" class="font-['Irish_Grover'] text-2xl tracking-wider">
      Willowstretch
    </NuxtLink>

    <div class="flex gap-8 font-medium items-center">
      <NuxtLink 
        v-for="link in navLinks" 
        :key="link.path" 
        :to="link.path"
        class="hover:text-[#F7D0D6] transition-colors"
        active-class="text-[#F7D0D6]"
      >
        {{ link.name }}
      </NuxtLink>

      <div 
        v-if="authStore.isAdmin" 
        class="relative group"
        @mouseenter="showManageDropdown = true"
        @mouseleave="showManageDropdown = false"
      >
        <button 
          class="flex items-center gap-1 hover:text-[#F7D0D6] transition-colors py-2"
          :class="{ 'text-[#F7D0D6]': isManageActive }"
        >
          Manage
          <span class="text-[10px] transition-transform duration-300" :class="showManageDropdown ? 'rotate-180' : ''">
            ▼
          </span>
        </button>

        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
        >
          <div 
            v-show="showManageDropdown"
            class="absolute left-0 mt-1 w-48 bg-[#0F3525] border border-white/10 rounded-lg shadow-xl overflow-hidden"
          >
            <NuxtLink 
              v-for="adminLink in adminLinks" 
              :key="adminLink.path"
              :to="adminLink.path"
              class="block px-5 py-3 text-sm hover:bg-white/10 hover:text-[#F7D0D6] transition-colors"
              active-class="bg-white/5 text-[#F7D0D6] font-bold"
            >
              {{ adminLink.name }}
            </NuxtLink>
          </div>
        </transition>
      </div>
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
import { ref, watch, computed, onMounted } from 'vue'
import { useWindowScroll } from '@vueuse/core'
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/store/auth' // Pastikan folder namanya 'stores' (jamak) sesuai standar Nuxt

const { y } = useWindowScroll()
const route = useRoute()
const authStore = useAuthStore()

const showNavbar = ref(true)
const isAtTop = ref(true)
const lastScrollPos = ref(0)
const showManageDropdown = ref(false)

const navLinks = [
  { name: 'Home', path: '/home' },
  { name: 'Schedule', path: '/schedule' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'Teachers', path: '/teachers' },
]

const adminLinks = [
  { name: 'Manage Pricing', path: '/admin/pricing' },
  { name: 'Manage Classes', path: '/admin/manage-classes' },
]

const isManageActive = computed(() => {
  return adminLinks.some(link => route.path.startsWith(link.path))
})

// Cek user saat komponen dimuat (untuk persistency saat refresh page)
onMounted(async () => {
  if (!authStore.user) {
    await authStore.fetchUser()
  }
})

// Scroll Logic
watch(y, (currentY) => {
  isAtTop.value = currentY < 50

  if (currentY <= 0) {
    showNavbar.value = true
    return
  }

  if (currentY > lastScrollPos.value && currentY > 100) {
    showNavbar.value = false
    showManageDropdown.value = false // Tutup dropdown saat navbar sembunyi
  } else {
    showNavbar.value = true
  }
  
  lastScrollPos.value = currentY
})
</script>