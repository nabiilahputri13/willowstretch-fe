<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useWindowScroll } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '~/store/auth'

const { y } = useWindowScroll()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const showNavbar = ref(true)
const isAtTop = ref(true)
const lastScrollPos = ref(0)
const showManageDropdown = ref(false)
const showUserDropdown = ref(false) 
const isMobileMenuOpen = ref(false)

const navLinks = [
  { name: 'Home', path: '/home' },
  { name: 'Schedule', path: '/schedule' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'Teachers', path: '/teachers' },
]

// Icon SVG path data
const icons = {
  // Admin Icons
  // pricing: 'M2.25 18.75V7.5A2.25 2.25 0 0 1 4.5 5.25h15a2.25 2.25 0 0 1 2.25 2.25v11.25m-19.5 0A2.25 2.25 0 0 0 4.5 21h15a2.25 2.25 0 0 0 2.25-2.25m-19.5 0v-1.5A2.25 2.25 0 0 1 4.5 15h15a2.25 2.25 0 0 1 2.25 2.25v1.5m-16.5-7.5h15m-1.5-5.25L12 3m0 0-3.5 4.5M12 3v18', // Banknotes/Money
  // classes: 'M12 18.75a6 6 0 0 0 6-6c0-3.314-2.686-6-6-6s-6 2.686-6 6a6 6 0 0 0 6 6Z M12 6.75a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5ZM5.25 12h-1.5M20.25 12h-1.5M12 21v-2.25M12 6V3.75', // Yoga/Meditation style
  // pricing: 'M2.25 18.75V7.5A2.25 2.25 0 0 1 4.5 5.25h15a2.25 2.25 0 0 1 2.25 2.25v11.25m-19.5 0A2.25 2.25 0 0 0 4.5 21h15a2.25 2.25 0 0 0 2.25-2.25m-19.5 0v-1.5A2.25 2.25 0 0 1 4.5 15h15a2.25 2.25 0 0 1 2.25 2.25v1.5m-16.5-7.5h15m-1.5-5.25L12 3m0 0-3.5 4.5M12 3v18',
  // Manage Classes: Pose Yoga minimalis (lebih rapi)
  classes: 'M12 18c3.3 0 6 1.1 6 2.5S15.3 23 12 23s-6-1.1-6-2.5 2.7-2.5 6-2.5zm0-7c2.8 0 5 1 5 2.2s-2.2 2.2-5 2.2-5-1-5-2.2 2.2-2.2 5-2.2zm0-6c2.2 0 4 .9 4 2s-1.8 2-4 2-4-.9-4-2 1.8-2 4-2z',
    pricing: 'M2 7a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7zm10 2a3 3 0 100 6 3 3 0 000-6zM2 10h3m14 0h3',
  // classes: 'M12 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm-1 2h2v5h5v2h-5v7h-2v-7H6v-2h5V7Z',
  // My Packages: Tetap Ticket
  teachers: 'M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z',
  events: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.722L17.25 12l-1.009-3.278a1.875 1.875 0 00-1.213-1.213L11.75 6.5l3.278-1.009a1.875 1.875 0 001.213-1.213L17.25 1l1.009 3.278a1.875 1.875 0 001.213 1.213L22.75 6.5l-3.278 1.009a1.875 1.875 0 00-1.213 1.213z',
  // Ikon Rooms (Studio / Layout)
  rooms: 'M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0h-10.5',
  // User Icons
  profile: 'M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z',
  packages: 'M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z', // Ticket
  schedule: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z',
  logout: 'M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9'
}

const adminLinks = [
  { name: 'Manage Pricing', path: '/admin/manage-pricing', icon: icons.pricing },
  { name: 'Manage Classes', path: '/admin/manage-classes', icon: icons.classes },
  { name: 'Manage Teachers', path: '/admin/manage-teachers', icon: icons.teachers },
  { name: 'Manage Rooms', path: '/admin/manage-rooms', icon: icons.rooms },
  { name: 'Manage Events', path: '/admin/manage-events', icon: icons.events },
]

const userLinks = [
  { name: 'Profile', path: '/profile', icon: icons.profile },
  { name: 'My Packages', path: '/my-packages', icon: icons.packages },
  { name: 'My Schedule', path: '/my-schedule', icon: icons.schedule },
]

const isTransparent = computed(() => route.path === '/home' && isAtTop.value && !isMobileMenuOpen.value)
const isManageActive = computed(() => adminLinks.some(link => route.path.startsWith(link.path)))
const isUserMenuActive = computed(() => userLinks.some(link => route.path.startsWith(link.path)))

watch(() => route.fullPath, () => {
  isMobileMenuOpen.value = false
  showUserDropdown.value = false
  showManageDropdown.value = false
})

onMounted(async () => {
  if (!authStore.user) await authStore.fetchUser()
})

watch(y, (currentY) => {
  isAtTop.value = currentY < 20
  if (isMobileMenuOpen.value) { showNavbar.value = true; return }
  if (currentY <= 0) { showNavbar.value = true; return }
  if (currentY > lastScrollPos.value && currentY > 100) {
    showNavbar.value = false
    showManageDropdown.value = false 
    showUserDropdown.value = false
  } else {
    showNavbar.value = true
  }
  lastScrollPos.value = currentY
})

const handleLogout = () => {
  authStore.logout()
  isMobileMenuOpen.value = false 
  showUserDropdown.value = false
  router.push('/login')
}
</script>

<template>
  <nav 
    :class="[
      'fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out font-sans',
      showNavbar ? 'translate-y-0' : '-translate-y-full',
      isTransparent 
        ? 'bg-transparent py-6' 
        : 'bg-gradient-to-r from-pink-500 to-orange-300 shadow-lg shadow-pink-500/20 py-4 backdrop-blur-sm opacity-95'
    ]"
    @mouseenter="showNavbar = true"
  >
    <div class="px-6 md:px-12 flex items-center justify-between">
      
      <NuxtLink to="/home" class="group relative z-50 flex-shrink-0">
        <h1 class="text-2xl font-black tracking-tighter transition-colors text-white">
          Willowstretch<span class="text-pink-200">.</span>
        </h1>
      </NuxtLink>

      <div class="hidden md:flex gap-4 font-bold items-center text-sm tracking-wide">
        <NuxtLink 
          v-for="link in navLinks" 
          :key="link.path" 
          :to="link.path"
          class="px-4 py-2 rounded-full transition-all duration-300 text-white/80 hover:text-white hover:bg-white/10"
          active-class="bg-white/20 !text-white shadow-sm ring-1 ring-white/30"
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
            class="flex items-center gap-1 px-4 py-2 rounded-full transition-all duration-300 font-bold"
            :class="isManageActive || showManageDropdown 
              ? 'bg-white/20 text-white shadow-sm ring-1 ring-white/30' 
              : 'text-white/80 hover:text-white hover:bg-white/10'"
          >
            Manage
            <svg class="w-4 h-4 transition-transform duration-300" :class="showManageDropdown ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          <transition enter-active-class="transition duration-200 ease-out" enter-from-class="transform scale-95 opacity-0 translate-y-2" enter-to-class="transform scale-100 opacity-100 translate-y-0" leave-active-class="transition duration-150 ease-in" leave-from-class="transform scale-100 opacity-100 translate-y-0" leave-to-class="transform scale-95 opacity-0 translate-y-2">
            <div v-show="showManageDropdown" class="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-white border border-pink-50 rounded-2xl shadow-xl overflow-hidden p-1.5 z-[60]">
              <NuxtLink v-for="adminLink in adminLinks" :key="adminLink.path" :to="adminLink.path" class="group flex items-center gap-3 px-4 py-3 text-sm rounded-xl text-gray-600 hover:bg-pink-50 hover:text-pink-600 transition-all font-semibold" active-class="bg-pink-100 text-pink-600 font-black">
                <svg class="w-5 h-5 text-gray-400 group-hover:text-pink-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" :d="adminLink.icon" />
                </svg>
                {{ adminLink.name }}
              </NuxtLink>
            </div>
          </transition>
        </div>
      </div>

      <div class="hidden md:flex items-center gap-4">
        <NuxtLink v-if="!authStore.user" to="/login" class="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-md transform active:scale-95 border bg-white text-pink-600 border-white hover:bg-pink-50">
          Login
        </NuxtLink>

        <div v-else class="relative group" @mouseenter="showUserDropdown = true" @mouseleave="showUserDropdown = false">
          <button class="flex items-center gap-3 px-3 py-1.5 rounded-full transition-all duration-300 focus:outline-none" :class="isUserMenuActive || showUserDropdown ? 'bg-white/20 ring-1 ring-white/30' : ''">
            <div class="text-right hidden sm:block leading-tight">
              <p class="text-xs font-black text-white tracking-wide">Hi, {{ authStore.user.username }}!</p>
              <p class="text-[10px] text-pink-100 font-bold uppercase tracking-widest">Member</p>
            </div>
            <div class="w-10 h-10 rounded-full border-2 shadow-sm flex items-center justify-center font-black bg-white border-pink-200 text-pink-600 group-hover:scale-105 transition-transform">
              <span class="text-sm">{{ authStore.user.username.charAt(0).toUpperCase() }}</span>
            </div>
          </button>

          <transition enter-active-class="transition duration-200 ease-out" enter-from-class="transform scale-95 opacity-0 translate-y-2" enter-to-class="transform scale-100 opacity-100 translate-y-0" leave-active-class="transition duration-150 ease-in" leave-from-class="transform scale-100 opacity-100 translate-y-0" leave-to-class="transform scale-95 opacity-0 translate-y-2">
            <div v-show="showUserDropdown" class="absolute right-0 mt-2 w-56 bg-white border border-pink-50 rounded-2xl shadow-xl overflow-hidden p-1.5 z-[60]">
              <NuxtLink v-for="link in userLinks" :key="link.path" :to="link.path" class="group flex items-center gap-3 px-4 py-3 text-sm rounded-xl text-gray-600 hover:bg-pink-50 hover:text-pink-600 transition-all font-semibold" active-class="bg-pink-100 text-pink-600 font-black">
                <svg class="w-5 h-5 text-gray-400 group-hover:text-pink-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" :d="link.icon" />
                </svg>
                {{ link.name }}
              </NuxtLink>
              <div class="h-px bg-pink-50 my-1.5 mx-2"/>
              <button class="group w-full flex items-center gap-3 px-4 py-3 text-sm rounded-xl text-red-500 hover:bg-red-50 transition-all font-bold text-left" @click="handleLogout">
                <svg class="w-5 h-5 text-red-400 group-hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" :d="icons.logout" />
                </svg>
                Logout
              </button>
            </div>
          </transition>
        </div>
      </div>

      <button class="md:hidden z-50 relative w-10 h-10 flex items-center justify-center text-white focus:outline-none" @click="isMobileMenuOpen = !isMobileMenuOpen">
        <div class="w-6 h-5 relative flex flex-col justify-between">
          <span class="w-full h-0.5 bg-white rounded-full transition-all duration-300 origin-left" :class="isMobileMenuOpen ? 'rotate-45 translate-x-0.5' : ''"/>
          <span class="w-full h-0.5 bg-white rounded-full transition-all duration-300" :class="isMobileMenuOpen ? 'opacity-0' : 'opacity-100'"/>
          <span class="w-full h-0.5 bg-white rounded-full transition-all duration-300 origin-left" :class="isMobileMenuOpen ? '-rotate-45 translate-x-0.5' : ''"/>
        </div>
      </button>

    </div>

    <transition enter-active-class="transition duration-300 ease-out" enter-from-class="transform -translate-y-10 opacity-0" enter-to-class="transform translate-y-0 opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="transform translate-y-0 opacity-100" leave-to-class="transform -translate-y-10 opacity-0">
      <div v-if="isMobileMenuOpen" class="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-pink-100 flex flex-col p-6 max-h-[90vh] overflow-y-auto">
        <div class="flex flex-col space-y-2 mb-6">
          <NuxtLink v-for="link in navLinks" :key="link.path" :to="link.path" class="text-lg font-bold text-gray-500 hover:text-pink-600 transition-colors px-4 py-2 rounded-lg" active-class="text-pink-600 bg-pink-50">
            {{ link.name }}
          </NuxtLink>
        </div>

        <div v-if="authStore.user" class="mb-6 pt-4 border-t border-gray-100">
          <p class="text-xs font-bold text-gray-400 uppercase mb-3 tracking-widest px-4">Account</p>
          <div class="flex flex-col space-y-1">
             <NuxtLink v-for="link in userLinks" :key="link.path" :to="link.path" class="flex items-center gap-3 text-base font-medium text-gray-600 hover:text-pink-600 px-4 py-3 rounded-xl" active-class="text-pink-600 bg-pink-50 font-bold">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" :d="link.icon" /></svg>
                {{ link.name }}
              </NuxtLink>
          </div>
        </div>

        <div v-if="authStore.isAdmin" class="mb-6 pt-4 border-t border-gray-100">
          <p class="text-xs font-bold text-gray-400 uppercase mb-3 tracking-widest px-4">Admin Manage</p>
          <div class="flex flex-col space-y-1">
             <NuxtLink v-for="adminLink in adminLinks" :key="adminLink.path" :to="adminLink.path" class="flex items-center gap-3 text-base font-medium text-gray-600 hover:text-pink-600 px-4 py-3 rounded-xl" active-class="text-pink-600 bg-pink-50 font-bold">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" :d="adminLink.icon" /></svg>
                {{ adminLink.name }}
              </NuxtLink>
          </div>
        </div>

        <div class="pt-6 border-t border-gray-100">
          <div v-if="!authStore.user">
            <NuxtLink to="/login" class="block w-full text-center py-3 rounded-xl bg-pink-500 text-white font-bold hover:bg-pink-600 transition shadow-md">Login</NuxtLink>
          </div>
          <div v-else class="flex items-center justify-between px-4">
            <div class="flex items-center gap-3">
               <div class="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-black border border-pink-200">{{ authStore.user.username.charAt(0).toUpperCase() }}</div>
               <div>
                  <p class="text-sm font-bold text-gray-800">Hi, {{ authStore.user.username }}!</p>
                  <p class="text-xs text-green-500 font-medium">● Online</p>
               </div>
            </div>
            <button class="px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg transition" @click="handleLogout">Logout</button>
          </div>
        </div>
      </div>
    </transition>

    <div class="absolute top-0 left-0 w-full h-6 -z-10 hidden md:block" @mouseenter="showNavbar = true" />
  </nav>
</template>