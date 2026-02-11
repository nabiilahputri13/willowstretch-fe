<script setup lang="ts">
import { useAuthStore } from '~/store/auth'

interface Subscription {
  id: number
  package_name: string
  remaining_credits: number
  expired_at: string
  is_active: boolean
}

interface JoinedClass {
  id: number
  name: string
  start_at: string
  room: string
  instructor_name: string
}

const authStore = useAuthStore()
const config = useRuntimeConfig()

const { data: subs, pending: pendingSubs } = await useFetch<Subscription[]>(
  () => `${config.public.apiBase}pricing/my-subscriptions/`, 
  {
    immediate: !!authStore.token,
    headers: computed(() => ({ Authorization: `Bearer ${authStore.token}` })),
    key: 'profile-subs'
  }
)

const { data: myClasses, pending: pendingClasses } = await useFetch<JoinedClass[]>(
  () => `${config.public.apiBase}classes/me/?status=upcoming`, 
  {
    immediate: !!authStore.token,
    headers: computed(() => ({ Authorization: `Bearer ${authStore.token}` })),
    key: 'profile-classes'
  }
)

const activeSubscriptions = computed(() => {
  return subs.value?.filter(s => s.is_active) || []
})

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

const formatTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit'
  })
}

onMounted(async () => {
  if (authStore.token && !authStore.user) {
    await authStore.fetchUser()
  }
})
</script>

<template>
  <div class="min-h-screen bg-pink-50/50 pt-32 pb-20 px-6 font-sans">
    
    <div v-if="!authStore.user" class="flex flex-col items-center justify-center py-20 mt-40">
       <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-pink-500 mb-4"/>
       <p class="text-pink-400 font-medium tracking-wide">Menghubungkan ke Willowstretch...</p>
    </div>

    <div v-else class="max-w-2xl mx-auto">
      <div class="mb-10 text-center md:text-left">
        <h1 class="text-3xl md:text-4xl font-black text-gray-800 tracking-tight">
          My Profile<span class="text-pink-500">.</span>
        </h1>
        <p class="text-gray-500 mt-2 font-medium">Informasi akun, paket, dan jadwal kelasmu</p>
      </div>

      <div class="bg-white rounded-[2rem] p-6 shadow-sm border border-pink-100 flex flex-col md:flex-row items-center gap-6 mb-12">
        <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center text-3xl font-black text-white shadow-lg shadow-pink-200 rotate-3">
          <span class="-rotate-3">{{ authStore.user?.username?.charAt(0).toUpperCase() }}</span>
        </div>
        <div class="text-center md:text-left">
          <h2 class="text-xl font-bold text-gray-800 leading-tight">{{ authStore.user?.username }}</h2>
          <p class="text-sm text-gray-400 font-medium mt-1">{{ authStore.user?.email }}</p>
          
          <div class="mt-3 flex justify-center md:justify-start">
            <span 
              v-if="authStore.isAdmin"
              class="px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-[0.15em] border border-orange-100 flex items-center gap-1.5"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"/>
              Admin
            </span>
            <span 
              v-else
              class="px-3 py-1 rounded-lg bg-pink-50 text-pink-600 text-[10px] font-black uppercase tracking-[0.15em] border border-pink-100 flex items-center gap-1.5"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-pink-400"/>
              Member
            </span>
          </div>
        </div>
      </div>

      <div class="mb-6 flex items-center justify-between px-2">
        <h3 class="font-black text-gray-400 uppercase tracking-widest text-[10px]">Paket Aktif Saya</h3>
        <NuxtLink to="/pricing" class="text-xs font-bold text-pink-500 hover:text-pink-600 hover:underline">+ Beli Paket</NuxtLink>
      </div>

      <div v-if="pendingSubs" class="text-center py-6 text-pink-300 italic text-sm">Mengecek sisa kredit...</div>
      <div v-else-if="activeSubscriptions.length > 0" class="grid gap-4 mb-12">
        <div 
          v-for="sub in activeSubscriptions" 
          :key="sub.id"
          class="bg-white rounded-2xl p-5 shadow-sm border-l-8 border-l-pink-500 border border-pink-100 flex justify-between items-center"
        >
          <div class="relative z-10">
            <p class="text-[10px] font-black text-pink-400 uppercase tracking-[0.2em] mb-1">{{ sub.package_name }}</p>
            <div class="flex items-center gap-2">
              <span class="text-4xl font-black text-gray-800">{{ sub.remaining_credits }}</span>
              <div class="leading-none">
                <p class="text-xs font-bold text-gray-600 uppercase tracking-wider">Credits</p>
                <p class="text-[10px] text-gray-500 font-medium">Remaining</p>
              </div>
            </div>
            <p class="text-[11px] text-gray-400 mt-4 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-green-400"/>
              Valid until <span class="text-gray-600 font-bold">{{ formatDate(sub.expired_at) }}</span>
            </p>
          </div>
          
          <div class="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-xl shadow-inner">
             ✨
          </div>
        </div>
      </div>
      <div v-else class="bg-white rounded-3xl p-8 text-center border border-dashed border-pink-200 text-gray-400 text-sm mb-12">
        Belum ada paket aktif.
      </div>

      <div class="mb-6 flex items-center justify-between px-2">
        <h3 class="font-black text-gray-400 uppercase tracking-widest text-[10px]">Jadwal Kelas Mendatang</h3>
        <NuxtLink to="/schedule" class="text-xs font-bold text-pink-500 hover:text-pink-600 hover:underline">Lihat Semua</NuxtLink>
      </div>

      <div v-if="pendingClasses" class="text-center py-6 text-pink-300 italic text-sm">Mengambil jadwal...</div>
      <div v-else-if="myClasses && myClasses.length > 0" class="grid gap-4">
        <div v-for="item in myClasses" :key="item.id" class="bg-white rounded-[1.5rem] p-5 shadow-sm border border-pink-50 flex items-center gap-5 group hover:border-pink-200 transition-colors">
          <div class="bg-gray-900 text-white w-14 h-14 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 shadow-lg shadow-gray-200 group-hover:bg-pink-500 transition-colors duration-300">
            <span class="text-[9px] font-bold uppercase opacity-80">{{ new Date(item.start_at).toLocaleDateString('id-ID', { month: 'short' }) }}</span>
            <span class="text-xl font-black leading-none">{{ new Date(item.start_at).getDate() }}</span>
          </div>

          <div class="flex-1 min-w-0">
            <h4 class="font-bold text-gray-800 truncate group-hover:text-pink-600 transition-colors">{{ item.name }}</h4>
            <div class="flex flex-wrap items-center gap-y-1 gap-x-4 mt-1">
              <span class="text-[11px] font-bold text-gray-500 flex items-center gap-1">
                <span class="opacity-60">🕒</span> {{ formatTime(item.start_at) }}
              </span>
              <span class="text-[11px] font-bold text-gray-500 flex items-center gap-1">
                <span class="opacity-60">📍</span> {{ item.room }}
              </span>
              <span class="text-[11px] font-bold text-pink-500 flex items-center gap-1">
                <span class="opacity-60">🧘</span> {{ item.instructor_name || 'Expert' }}
              </span>
            </div>
          </div>
          
          <div class="hidden sm:block">
            <div class="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-100 flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"/>
              <span class="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                Upcoming
              </span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="bg-white rounded-3xl p-8 text-center border border-dashed border-pink-200 text-gray-400 text-sm">
        Belum ada kelas mendatang.
      </div>

    </div>
  </div>
</template>

<style scoped>
.grid {
  animation: fadeInUp 0.4s ease-out forwards;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>