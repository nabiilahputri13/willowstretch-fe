<script setup lang="ts">
import { useAuthStore } from '~/store/auth'

interface YogaClass {
  id?: number
  name: string
  instructor_name: string
  start_at: string
  duration_minutes: number
  max_capacity: number
  room: string
}

interface FetchError {
  data?: {
    error?: string
  }
}

const config = useRuntimeConfig()
const authStore = useAuthStore()

const classes = ref<YogaClass[]>([])
const loading = ref(false)
const showModal = ref(false)
const isEditing = ref(false)
const errorMessage = ref('')

// State untuk membatasi tanggal minimum (biar gak bisa pilih masa lalu)
const minDateTime = ref('')

const form = ref<YogaClass>({
  name: '',
  instructor_name: '',
  start_at: '',
  duration_minutes: 60,
  max_capacity: 10,
  room: ''
})

// --- HELPER FUNCTION: Timezone Fix ---
// Mengubah Date Object/String UTC menjadi format string untuk input datetime-local (YYYY-MM-DDTHH:mm)
// Sesuai dengan jam lokal user (WIB/WITA/WIT)
const getLocalISOString = (dateInput?: string | Date) => {
  const date = dateInput ? new Date(dateInput) : new Date()
  
  // getTimezoneOffset mengembalikan selisih dalam menit (WIB = -420)
  // Kita kurangi waktu UTC dengan offset ini agar saat toISOString dipanggil, angkanya sesuai jam lokal
  const offset = date.getTimezoneOffset() * 60000 
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

// --- FETCH DATA ---
const fetchClasses = async () => {
  loading.value = true
  try {
    const data = await $fetch<YogaClass[]>(`${config.public.apiBase}classes/`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    classes.value = data
  } catch {
    alert('Gagal mengambil data kelas.')
  } finally {
    loading.value = false
  }
}

// --- MODAL HANDLERS ---
const openAddModal = () => {
  isEditing.value = false
  errorMessage.value = ''
  
  // Set batas minimum ke waktu sekarang
  minDateTime.value = getLocalISOString()

  form.value = {
    name: '',
    instructor_name: '',
    // Default waktu: Sekarang
    start_at: minDateTime.value,
    duration_minutes: 60,
    max_capacity: 10,
    // Default room kosong string biar placeholder muncul
    room: '' 
  }
  showModal.value = true
}

const openEditModal = (item: YogaClass) => {
  isEditing.value = true
  errorMessage.value = ''
  
  // Update minDateTime biar validasinya fresh
  minDateTime.value = getLocalISOString()

  // Konversi waktu dari server (UTC) ke format input lokal
  const localTime = item.start_at ? getLocalISOString(item.start_at) : ''

  form.value = { ...item, start_at: localTime }
  showModal.value = true
}

// --- CRUD ACTIONS ---
const saveClass = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const method = isEditing.value ? 'PUT' : 'POST'
    const url = isEditing.value 
      ? `${config.public.apiBase}classes/${form.value.id}/` 
      : `${config.public.apiBase}classes/`

    await $fetch(url, {
      method: method,
      body: form.value,
      headers: { Authorization: `Bearer ${authStore.token}` }
    })

    showModal.value = false
    fetchClasses()
  } catch (err: unknown) {
    const error = err as FetchError
    errorMessage.value = error.data?.error || 'Terjadi kesalahan saat menyimpan.'
  } finally {
    loading.value = false
  }
}

const deleteClass = async (id: number) => {
  if (!confirm('Yakin mau menghapus kelas ini?')) return
  try {
    await $fetch(`${config.public.apiBase}classes/${id}/`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    fetchClasses()
  } catch {
    alert('Gagal menghapus kelas.')
  }
}

const formatDate = (isoString: string) => {
  return new Date(isoString).toLocaleString('id-ID', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

onMounted(() => {
    fetchClasses()
})
</script>

<template>
  <div class="min-h-screen bg-pink-50 p-4 md:p-8 font-sans pb-20">
    <div class="max-w-6xl mx-auto">
      
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 mt-16">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-pink-600">Manage Classes</h1>
          <p class="text-sm md:text-base text-gray-500">Atur jadwal yoga studio di sini</p>
        </div>
        <button 
          class="w-full md:w-auto bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full shadow-md transition font-medium flex items-center justify-center gap-2"
          @click="openAddModal"
        >
          <span>+</span> Tambah Kelas
        </button>
      </div>

      <div v-if="loading && !showModal" class="text-center py-12 text-pink-400">Loading data...</div>

      <div v-else>
        
        <div class="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden border border-pink-100">
          <table class="w-full text-left">
            <thead class="bg-pink-100 text-pink-700 uppercase text-sm">
              <tr>
                <th class="p-4">Nama Kelas</th>
                <th class="p-4">Instruktur</th>
                <th class="p-4">Waktu</th>
                <th class="p-4">Ruangan</th>
                <th class="p-4">Kapasitas</th>
                <th class="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-pink-50">
              <tr v-for="item in classes" :key="item.id" class="hover:bg-pink-50 transition">
                <td class="p-4 font-medium text-gray-800">{{ item.name }}</td>
                <td class="p-4 text-gray-600">{{ item.instructor_name }}</td>
                <td class="p-4 text-gray-600">
                  {{ formatDate(item.start_at) }}
                  <span class="text-xs text-gray-400 block">({{ item.duration_minutes }} min)</span>
                </td>
                <td class="p-4 text-gray-600">{{ item.room }}</td>
                <td class="p-4 text-gray-600">{{ item.max_capacity }}</td>
                <td class="p-4 text-center flex justify-center gap-2">
                  <button class="text-blue-500 hover:text-blue-700 text-sm font-semibold" @click="openEditModal(item)">Edit</button>
                  <button class="text-red-400 hover:text-red-600 text-sm font-semibold" @click="deleteClass(item.id!)">Hapus</button>
                </td>
              </tr>
              <tr v-if="classes.length === 0">
                <td colspan="6" class="p-8 text-center text-gray-400">Belum ada kelas.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="md:hidden space-y-4">
          <div v-if="classes.length === 0" class="text-center text-gray-400 py-8 bg-white rounded-xl">
            Belum ada kelas.
          </div>

          <div v-for="item in classes" :key="item.id" class="bg-white p-5 rounded-xl shadow-sm border border-pink-100">
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-bold text-gray-800 text-lg">{{ item.name }}</h3>
              <span class="bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded-full font-medium">
                {{ item.room }}
              </span>
            </div>
            
            <div class="space-y-2 text-sm text-gray-600 mb-4">
              <div class="flex items-center gap-2">
                <span class="text-lg">🧘‍♀️</span> 
                <span>{{ item.instructor_name }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-lg">⏰</span> 
                <span>{{ formatDate(item.start_at) }} ({{ item.duration_minutes }} min)</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-lg">👥</span> 
                <span>Max Capacity: {{ item.max_capacity }} orang</span>
              </div>
            </div>

            <div class="flex gap-3 border-t border-pink-50 pt-3">
              <button 
                class="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-100 transition"
                @click="openEditModal(item)" 
              >
                Edit
              </button>
              <button 
                class="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition"
                @click="deleteClass(item.id!)" 
              >
                Hapus
              </button>
            </div>
          </div>
        </div>

      </div>

      <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
        <div class="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
          
          <div class="p-6 border-b border-gray-100">
            <h2 class="text-xl md:text-2xl font-bold text-pink-600">{{ isEditing ? 'Edit Kelas' : 'Buat Kelas Baru' }}</h2>
          </div>

          <div class="p-6 overflow-y-auto">
            <form class="space-y-4" @submit.prevent="saveClass">
              
              <div>
                <label class="block text-sm font-medium mb-1 text-gray-700">Nama Kelas</label>
                <input v-model="form.name" type="text" required placeholder="Vinyasa Flow" class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-pink-300 focus:border-pink-500 outline-none transition">
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-1 text-gray-700">Instruktur</label>
                <input v-model="form.instructor_name" type="text" required placeholder="Nama Instruktur" class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-pink-300 focus:border-pink-500 outline-none transition">
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium mb-1 text-gray-700">Waktu Mulai</label>
                  <input 
                    v-model="form.start_at" 
                    type="datetime-local" 
                    :min="minDateTime"
                    required 
                    class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-pink-300 focus:border-pink-500 outline-none transition"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1 text-gray-700">Durasi (Menit)</label>
                  <input v-model.number="form.duration_minutes" type="number" required class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-pink-300 focus:border-pink-500 outline-none transition">
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium mb-1 text-gray-700">Ruangan</label>
                  <div class="relative">
                    <select 
                      v-model="form.room" 
                      required
                      class="w-full border border-gray-300 rounded-lg p-2.5 bg-white appearance-none focus:ring-2 focus:ring-pink-300 focus:border-pink-500 outline-none transition"
                      :class="{'text-gray-400': form.room === ''}"
                    >
                      <option value="" disabled selected>Pilih ruangan</option>
                      <option value="Sun Room">Sun Room</option>
                      <option value="Moon Studio">Moon Studio</option>
                      <option value="Garden Area">Garden Area</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1 text-gray-700">Kapasitas</label>
                  <input v-model.number="form.max_capacity" type="number" required class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-pink-300 focus:border-pink-500 outline-none transition">
                </div>
              </div>

              <div v-if="errorMessage" class="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">{{ errorMessage }}</div>

              <div class="flex flex-col-reverse md:flex-row justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                <button type="button" class="w-full md:w-auto px-4 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg font-medium transition" @click="showModal = false">Batal</button>
                <button type="submit" :disabled="loading" class="w-full md:w-auto px-6 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-lg shadow-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed">
                  {{ loading ? 'Menyimpan...' : 'Simpan Kelas' }}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>