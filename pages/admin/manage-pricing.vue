<script setup lang="ts">
import { useAuthStore } from '~/store/auth'

interface PricingPackage {
  id?: number
  name: string
  description: string
  price: number
  credits: number
  duration_days: number
  is_active: boolean
}

interface FetchError {
  data?: {
    error?: string
  }
}

const config = useRuntimeConfig()
const authStore = useAuthStore()

const packages = ref<PricingPackage[]>([])
const loading = ref(false)
const showModal = ref(false)
const isEditing = ref(false)
const errorMessage = ref('')

const form = ref<PricingPackage>({
  name: '',
  description: '',
  price: 100000,
  credits: 5,
  duration_days: 30,
  is_active: true
})

const fetchPackages = async () => {
  loading.value = true
  try {
    const data = await $fetch<PricingPackage[]>(`${config.public.apiBase}pricing/`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    packages.value = data
  } catch {
    alert('Gagal mengambil data paket.')
  } finally {
    loading.value = false
  }
}

const openAddModal = () => {
  isEditing.value = false
  errorMessage.value = ''
  form.value = {
    name: '',
    description: '',
    price: 100000,
    credits: 5,
    duration_days: 30,
    is_active: true
  }
  showModal.value = true
}

const openEditModal = (item: PricingPackage) => {
  isEditing.value = true
  errorMessage.value = ''
  form.value = { ...item } 
  showModal.value = true
}

const savePackage = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const method = isEditing.value ? 'PUT' : 'POST'
    const url = isEditing.value 
      ? `${config.public.apiBase}pricing/${form.value.id}/` 
      : `${config.public.apiBase}pricing/`

    await $fetch(url, {
      method: method,
      body: form.value,
      headers: { Authorization: `Bearer ${authStore.token}` }
    })

    showModal.value = false
    fetchPackages()
  } catch (err: unknown) {
    const error = err as FetchError
    errorMessage.value = error.data?.error || 'Terjadi kesalahan saat menyimpan.'
  } finally {
    loading.value = false
  }
}

const formatRupiah = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price)
}

const sortedPackages = computed(() => {
  return [...packages.value].sort((a, b) => a.price - b.price)
})

onMounted(() => {
  fetchPackages()
})
</script>

<template>
  <div class="min-h-screen bg-pink-50 p-4 md:p-8 font-sans pb-20">
    <div class="max-w-6xl mx-auto">
      
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 mt-24">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold ont-black text-gray-800 tracking-tight">Manage Pricing<span class="text-pink-500">.</span></h1>
          <p class="text-sm md:text-base text-gray-500">Atur katalog paket harga</p>
        </div>
        <button 
          class="w-full md:w-auto bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full shadow-md transition font-medium flex items-center justify-center gap-2"
          @click="openAddModal"
        >
          <span>+</span> Tambah Paket
        </button>
      </div>

      <div v-if="loading && !showModal" class="text-center py-12 text-pink-400">Loading data...</div>

      <div v-else>
        
        <div class="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden border border-pink-100">
          <table class="w-full text-left">
            <thead class="bg-pink-100 text-pink-700 uppercase text-sm">
              <tr>
                <th class="p-4">Nama Paket</th>
                <th class="p-4">Deskripsi</th>
                <th class="p-4">Harga</th>
                <th class="p-4">Detail</th>
                <th class="p-4">Status</th>
                <th class="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-pink-50">
              <tr v-for="item in sortedPackages" :key="item.id" class="hover:bg-pink-50 transition">
                <td class="p-4 font-medium text-gray-800 w-1/5">{{ item.name }}</td>
                <td class="p-4 text-gray-500 text-sm w-1/4">
                  <span class="block whitespace-normal break-words">{{ item.description || '-' }}</span>
                </td>
                <td class="p-4 text-green-600 font-semibold w-1/6">{{ formatRupiah(item.price) }}</td>
                <td class="p-4 text-gray-600 w-1/5">
                  <div class="flex flex-col gap-1 text-sm">
                    <span class="inline-flex items-center gap-1">
                      🎟️ <b>{{ item.credits }}</b> Class
                    </span>
                    <span class="inline-flex items-center gap-1">
                      📅 <b>{{ item.duration_days }}</b> Hari
                    </span>
                  </div>
                </td>
                <td class="p-4 w-1/8">
                  <span v-if="item.is_active" class="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">Aktif</span>
                  <span v-else class="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-bold">Non-aktif</span>
                </td>
                <td class="p-4 text-center justify-center w-1/12">
                  <button class="text-blue-500 hover:text-blue-700 text-sm font-semibold" @click="openEditModal(item)">Edit</button>
                </td>
              </tr>
              <tr v-if="sortedPackages.length === 0">
                <td colspan="6" class="p-8 text-center text-gray-400">Belum ada paket harga.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="md:hidden space-y-4">
          <div v-if="sortedPackages.length === 0" class="text-center text-gray-400 py-8 bg-white rounded-xl">
            Belum ada paket harga.
          </div>

          <div v-for="item in sortedPackages" :key="item.id" class="bg-white p-5 rounded-xl shadow-sm border border-pink-100 relative overflow-hidden">
            <div v-if="!item.is_active" class="absolute top-0 right-0 bg-red-100 text-red-600 text-xs px-3 py-1 rounded-bl-lg font-bold">
              Non-aktif
            </div>

            <div class="flex justify-between items-start mb-2">
              <h3 class="font-bold text-gray-800 text-lg pr-4">{{ item.name }}</h3>
            </div>
            
            <div class="text-green-600 font-bold text-xl mb-2">
              {{ formatRupiah(item.price) }}
            </div>

            <p class="text-sm text-gray-500 mb-4 line-clamp-2">
              {{ item.description || 'Tidak ada deskripsi.' }}
            </p>
            
            <div class="flex gap-2 mb-4 text-sm">
              <span class="bg-purple-50 text-purple-700 px-3 py-1 rounded-lg font-medium flex-1 text-center">
                🎟️ {{ item.credits }} Sesi
              </span>
              <span class="bg-orange-50 text-orange-700 px-3 py-1 rounded-lg font-medium flex-1 text-center">
                📅 {{ item.duration_days }} Hari
              </span>
            </div>

            <div class="flex gap-3 pt-2 border-t border-gray-50">
              <button 
                class="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-100 transition"
                @click="openEditModal(item)" 
              >
                Edit
              </button>
            </div>
          </div>
        </div>

      </div>

      <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
        <div class="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
          
          <div class="p-6 border-b border-gray-100">
            <h2 class="text-xl md:text-2xl font-bold text-pink-600">{{ isEditing ? 'Edit Paket' : 'Buat Paket Baru' }}</h2>
          </div>

          <div class="p-6 overflow-y-auto">
            <form class="space-y-5" @submit.prevent="savePackage">
              
              <div>
                <label class="block text-sm font-medium mb-1 text-gray-700">Nama Paket</label>
                <input v-model="form.name" type="text" placeholder="e.g. Starter Pack" required class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-pink-300 outline-none">
              </div>

              <div>
                <label class="block text-sm font-medium mb-1 text-gray-700">Deskripsi</label>
                <textarea 
                  v-model="form.description" 
                  rows="2" 
                  placeholder="Deskripsi singkat..." 
                  class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-pink-300 outline-none resize-none"
                />
              </div>

              <div class="bg-pink-50 p-4 rounded-xl space-y-4">
                <div>
                    <label class="block text-sm font-bold text-pink-700 mb-1">Harga (IDR)</label>
                    <div class="relative">
                    <span class="absolute left-3 top-2.5 text-pink-500 font-bold">Rp</span>
                    <input v-model.number="form.price" type="number" placeholder="0" required class="w-full pl-10 border border-pink-200 rounded-lg p-2.5 focus:ring-2 focus:ring-pink-400 outline-none bg-white">
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                    <label class="block text-sm font-medium mb-1 text-gray-700">Total Kredit</label>
                    <input v-model.number="form.credits" type="number" min="1" required class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-pink-300 outline-none">
                    </div>
                    <div>
                    <label class="block text-sm font-medium mb-1 text-gray-700">Durasi (Hari)</label>
                    <input v-model.number="form.duration_days" type="number" min="1" required class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-pink-300 outline-none">
                    </div>
                </div>
              </div>

              <div class="border-t border-gray-100 pt-4">
                  <label class="flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors" :class="form.is_active ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'">
                    <div class="flex-1 pr-4">
                      <span class="block text-sm font-bold mb-1" :class="form.is_active ? 'text-green-700' : 'text-gray-600'">
                        Status: {{ form.is_active ? 'AKTIF (Tayang)' : 'NON-AKTIF (Disembunyikan)' }}
                      </span>
                      <p class="text-xs text-gray-500 leading-relaxed">
                        {{ form.is_active 
                          ? 'Paket ini akan muncul di halaman pembelian dan bisa dibeli oleh semua user.' 
                          : 'Paket tidak akan muncul di halaman pembelian baru.' 
                        }}
                      </p>
                      <p class="text-[11px] text-pink-600 font-medium mt-1 italic">
                        *User yang sudah membeli tetap bisa memakai kreditnya sampai masa aktif paket habis.
                      </p>
                    </div>
                    <div class="relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in">
                        <input v-model="form.is_active" type="checkbox" class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300" :class="form.is_active ? 'right-0 border-green-400' : 'left-0 border-gray-300'">
                        <label class="toggle-label block overflow-hidden h-6 rounded-full cursor-pointer" :class="form.is_active ? 'bg-green-400' : 'bg-gray-300'"/>
                    </div>
                  </label>
              </div>

              <div v-if="errorMessage" class="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">{{ errorMessage }}</div>

              <div class="flex flex-col-reverse md:flex-row justify-end gap-3 pt-2">
                <button type="button" class="w-full md:w-auto px-4 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg font-medium transition" @click="showModal = false">Batal</button>
                <button type="submit" :disabled="loading" class="w-full md:w-auto px-6 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-lg shadow-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed">
                  {{ loading ? 'Simpan Perubahan' : 'Simpan Paket' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>