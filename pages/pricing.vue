<script setup lang="ts">
import { useAuthStore } from '~/store/auth'

// 1. Tambahkan is_active di interface agar TypeScript tau field ini ada
interface PricingPackage {
  id: number
  name: string
  description: string
  price: number
  credits: number
  duration_days: number
  is_active?: boolean // <--- TAMBAHAN PENTING
}

interface FetchError {
  data?: {
    error?: string
  }
}

const config = useRuntimeConfig()
const authStore = useAuthStore()
const router = useRouter()

const packages = ref<PricingPackage[]>([])
const loading = ref(false)
const processingId = ref<number | null>(null)

// --- FETCH DATA ---
const fetchPackages = async () => {
  loading.value = true
  try {
    const data = await $fetch<PricingPackage[]>(`${config.public.apiBase}pricing/`)
    packages.value = data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 2. LOGIC FILTER: Hanya tampilkan yang is_active === true
const sortedPackages = computed(() => {
  return packages.value
    .filter(pkg => pkg.is_active !== false) // Filter: Ambil yang aktif saja
    .sort((a, b) => a.price - b.price) // Baru di-sort berdasarkan harga
})

// --- ACTIONS ---
const handleBuy = async (pkg: PricingPackage) => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  if (!confirm(`Beli paket "${pkg.name}" seharga ${formatRupiah(pkg.price)}?`)) return

  processingId.value = pkg.id
  try {
    await $fetch(`${config.public.apiBase}pricing/buy/${pkg.id}/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authStore.token}` }
    })

    alert('Pembelian Berhasil! Kredit Anda sudah bertambah.')

  } catch (err: unknown) {
    const error = err as FetchError
    alert(error.data?.error || 'Gagal melakukan pembelian.')
  } finally {
    processingId.value = null
  }
}

const formatRupiah = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price)
}

onMounted(() => {
  fetchPackages()
})
</script>

<template>
  <div class="min-h-screen bg-pink-50 p-4 md:p-8 font-sans pb-20">
    <div class="max-w-6xl mx-auto">

      <div class="text-center mb-16 mt-24">
        <h1 class="text-4xl md:text-5xl font-black text-gray-800 tracking-tight mb-4 pt-4">Invest in Your Wellness<span class="text-pink-500">.</span></h1>
        <p class="text-gray-500 max-w-2xl mx-auto text-lg">
          Pilih paket yang sesuai dengan kebutuhan latihanmu. Fleksibel, tanpa komitmen.
        </p>
      </div>

      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="i in 3" :key="i" class="h-96 bg-white rounded-3xl animate-pulse shadow-sm"/>
      </div>

      <div v-else-if="sortedPackages.length === 0" class="text-center py-20">
        <p class="text-gray-400 text-lg">Belum ada paket yang tersedia saat ini.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
        
        <div 
          v-for="pkg in sortedPackages" 
          :key="pkg.id" 
          class="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-pink-100 flex flex-col relative overflow-hidden group h-full"
        >
          <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-400 to-orange-300 rounded-bl-[100px] -z-0 transition-transform duration-500 group-hover:scale-110 opacity-30"/>

          <div class="relative z-10 flex-1">
            <h3 class="text-2xl font-bold text-gray-800 mb-2">{{ pkg.name }}</h3>
            <p class="text-gray-500 text-sm mb-6 min-h-[40px] leading-relaxed">{{ pkg.description }}</p>

            <div class="flex items-baseline mb-8 pb-8 border-b border-pink-50">
              <span class="text-4xl font-extrabold text-pink-500">{{ formatRupiah(pkg.price).replace(',00', '') }}</span>
              <span class="text-gray-400 ml-2 text-sm">/ paket</span>
            </div>

            <ul class="space-y-4 mb-8">
              <li class="flex items-center gap-3 text-gray-600">
                <span class="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold">✓</span>
                <span class="font-medium">🎟️ {{ pkg.credits }}x Sesi Yoga</span>
              </li>
              <li class="flex items-center gap-3 text-gray-600">
                <span class="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold">✓</span>
                <span class="font-medium">📅 Masa aktif {{ pkg.duration_days }} Hari</span>
              </li>
              <li class="flex items-center gap-3 text-gray-600">
                <span class="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold">✓</span>
                <span>Akses semua kelas</span>
              </li>
              <li class="flex items-center gap-3 text-gray-600">
                <span class="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold">✓</span>
                <span>Booking via Website</span>
              </li>
            </ul>
          </div>

          <div class="relative z-10 mt-auto">
            <button 
              :disabled="processingId === pkg.id"
              class="w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 bg-pink-500 text-white hover:bg-pink-600"
              @click="handleBuy(pkg)"
            >
              <span v-if="processingId === pkg.id" class="animate-spin text-xl">⏳</span>
              <span v-else>Beli Sekarang</span>
            </button>
            
            <p v-if="!authStore.isAuthenticated" class="text-center text-xs text-gray-400 mt-3">
              *Login untuk membeli
            </p>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>