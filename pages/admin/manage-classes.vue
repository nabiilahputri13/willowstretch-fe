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

interface Teacher {
  id: number
  name: string
}

interface FetchError {
  data?: {
    error?: string
  }
}

const config = useRuntimeConfig()
const authStore = useAuthStore()

const classes = ref<YogaClass[]>([])
const teachers = ref<Teacher[]>([]) 
const loading = ref(false)
const showModal = ref(false)
const isEditing = ref(false)
const errorMessage = ref('')
const minDateTime = ref('')

type FilterType = 'upcoming' | 'past' | 'all'
const filterStatus = ref<FilterType>('upcoming')

const form = ref<YogaClass>({
  name: '',
  instructor_name: '',
  start_at: '',
  duration_minutes: 60,
  max_capacity: 10,
  room: ''
})

const isPast = (dateString: string) => {
  return new Date(dateString) < new Date()
}

const filteredClasses = computed(() => {
  const now = new Date()
  const nowTime = now.getTime()
  
  const filtered = classes.value.filter(c => {
    const classTime = new Date(c.start_at)
    if (filterStatus.value === 'upcoming') return classTime >= now
    if (filterStatus.value === 'past') return classTime < now
    return true 
  })

  return filtered.sort((a, b) => {
    const timeA = new Date(a.start_at).getTime()
    const timeB = new Date(b.start_at).getTime()

    
    if (filterStatus.value === 'all') {
      const isPastA = timeA < nowTime
      const isPastB = timeB < nowTime

      if (isPastA !== isPastB) {
        return isPastA ? 1 : -1 
      }

      if (!isPastA) return timeA - timeB
      
      return timeB - timeA
    }

    if (filterStatus.value === 'upcoming') {
      return timeA - timeB
    }

    return timeB - timeA
  })
})

const getLocalISOString = (dateInput?: string | Date) => {
  const date = dateInput ? new Date(dateInput) : new Date()
  const offset = date.getTimezoneOffset() * 60000 
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

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

const fetchTeachers = async () => {
  try {
    const data = await $fetch<Teacher[]>(`${config.public.apiBase}teachers/`)
    teachers.value = data
  } catch (err) {
    console.error('Gagal fetch teachers', err)
  }
}

const openAddModal = () => {
  isEditing.value = false
  errorMessage.value = ''
  minDateTime.value = getLocalISOString()
  fetchTeachers()

  form.value = {
    name: '',
    instructor_name: '',
    start_at: minDateTime.value,
    duration_minutes: 60,
    max_capacity: 10,
    room: '' 
  }
  showModal.value = true
}

const openEditModal = (item: YogaClass) => {
  isEditing.value = true
  errorMessage.value = ''
  minDateTime.value = getLocalISOString()
  fetchTeachers()

  const localTime = item.start_at ? getLocalISOString(item.start_at) : ''
  form.value = { ...item, start_at: localTime }
  showModal.value = true
}

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
      
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 mt-24">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">Manage Classes<span class="text-pink-500">.</span></h1>
          <p class="text-sm md:text-base text-gray-500">Atur jadwal yoga di sini</p>
        </div>
        <button 
          class="w-full md:w-auto bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full shadow-md transition font-medium flex items-center justify-center gap-2"
          @click="openAddModal"
        >
          <span>+</span> Tambah Kelas
        </button>
      </div>

      <div class="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button 
          class="px-5 py-2 rounded-full text-sm font-semibold transition border whitespace-nowrap"
          :class="filterStatus === 'upcoming' ? 'bg-pink-500 text-white border-pink-500 shadow-md' : 'bg-white text-gray-500 border-gray-200 hover:bg-pink-50 hover:text-pink-600'"
          @click="filterStatus = 'upcoming'"
        >
          Upcoming
        </button>
        <button 
          class="px-5 py-2 rounded-full text-sm font-semibold transition border whitespace-nowrap"
          :class="filterStatus === 'past' ? 'bg-pink-500 text-white border-pink-500 shadow-md' : 'bg-white text-gray-500 border-gray-200 hover:bg-pink-50 hover:text-pink-600'"
          @click="filterStatus = 'past'"
        >
          Past History
        </button>
        <button 
          class="px-5 py-2 rounded-full text-sm font-semibold transition border whitespace-nowrap"
          :class="filterStatus === 'all' ? 'bg-pink-500 text-white border-pink-500 shadow-md' : 'bg-white text-gray-500 border-gray-200 hover:bg-pink-50 hover:text-pink-600'"
          @click="filterStatus = 'all'"
        >
          All Classes
        </button>
      </div>

      <div v-if="loading && !showModal" class="text-center py-12 text-pink-400">Loading data...</div>

      <div v-else>
        <div class="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden border border-pink-100">
          <table class="w-full text-left">
            <thead class="bg-pink-100 text-pink-700 uppercase text-sm font-bold">
              <tr>
                <th class="p-4">Nama Kelas</th>
                <th class="p-4">Instruktur</th>
                <th class="p-4">Waktu</th>
                <th class="p-4 text-center">Ruangan</th>
                <th class="p-4 text-center">Kapasitas</th>
                <th class="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-pink-50">
              
              <tr 
                v-for="item in filteredClasses" 
                :key="item.id" 
                class="transition"
                :class="isPast(item.start_at) 
                  ? 'bg-gray-50 opacity-60 grayscale-[50%]' 
                  : 'hover:bg-pink-50 bg-white'"
              >
                <td class="p-4 font-medium" :class="isPast(item.start_at) ? 'text-gray-500' : 'text-gray-800'">
                   {{ item.name }}
                   <span v-if="isPast(item.start_at)" class="ml-2 text-[10px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded border border-gray-300">DONE</span>
                </td>
                
                <td class="p-4 text-gray-600">{{ item.instructor_name }}</td>
                
                <td class="p-4 text-gray-600">
                  {{ formatDate(item.start_at) }}
                  <span class="text-[10px] block font-bold" :class="isPast(item.start_at) ? 'text-gray-400' : 'text-pink-400'">
                    ({{ item.duration_minutes }} MIN)
                  </span>
                </td>

                <td class="p-4 text-center">
                  <span 
                    class="px-2 py-1 rounded text-xs font-bold"
                    :class="isPast(item.start_at) ? 'bg-gray-200 text-gray-500' : 'bg-pink-50 text-pink-600'"
                  >
                    {{ item.room }}
                  </span>
                </td>

                <td class="p-4 text-center text-gray-600 font-medium">{{ item.max_capacity }}</td>
                
                <td class="p-4 text-center flex justify-center gap-2">
                  <button class="text-blue-500 hover:text-blue-700 text-sm font-semibold" @click="openEditModal(item)">Edit</button>
                  <button class="text-red-400 hover:text-red-600 text-sm font-semibold" @click="deleteClass(item.id!)">Hapus</button>
                </td>
              </tr>

              <tr v-if="filteredClasses.length === 0">
                <td colspan="6" class="p-8 text-center text-gray-400 italic">
                  Tidak ada kelas {{ filterStatus === 'upcoming' ? 'yang akan datang' : filterStatus === 'past' ? 'yang sudah lewat' : '' }}.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="md:hidden space-y-4">
           <div v-if="filteredClasses.length === 0" class="text-center text-gray-400 italic py-8 bg-white rounded-xl">
              Tidak ada kelas {{ filterStatus === 'upcoming' ? 'yang akan datang' : filterStatus === 'past' ? 'yang sudah lewat' : '' }}.
          </div>

          <div 
            v-for="item in filteredClasses" 
            :key="item.id" 
            class="p-5 rounded-xl shadow-sm border transition"
            :class="isPast(item.start_at) 
              ? 'bg-gray-50 border-gray-200 opacity-70 grayscale-[50%]' 
              : 'bg-white border-pink-100'"
          >
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-bold text-lg" :class="isPast(item.start_at) ? 'text-gray-600' : 'text-gray-800'">
                {{ item.name }}
              </h3>
              <span 
                class="text-xs px-2 py-1 rounded-full font-bold"
                :class="isPast(item.start_at) ? 'bg-gray-200 text-gray-500' : 'bg-pink-100 text-pink-700'"
              >
                {{ item.room }}
              </span>
            </div>
            <p class="text-sm text-gray-600 mb-1">{{ item.instructor_name }}</p>
            <p class="text-xs text-gray-400 mb-3">{{ formatDate(item.start_at) }}</p>
            
            <div class="flex gap-3 border-t pt-3 mt-3" :class="isPast(item.start_at) ? 'border-gray-200' : 'border-pink-50'">
              <button class="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-semibold" @click="openEditModal(item)">Edit</button>
              <button class="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-semibold" @click="deleteClass(item.id!)">Hapus</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4 text-left">
        <div class="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
          <div class="p-6 border-b border-gray-100">
            <h2 class="text-xl md:text-2xl font-bold text-pink-600">{{ isEditing ? 'Edit Kelas' : 'Buat Kelas Baru' }}</h2>
          </div>
          <div class="p-6 overflow-y-auto">
            <form class="space-y-5" @submit.prevent="saveClass">
              <div>
                <label class="block text-sm font-medium mb-1 text-gray-700">Nama Kelas</label>
                <input v-model="form.name" type="text" required class="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-pink-300 transition" placeholder="e.g. Vinyasa Flow">
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-1 text-gray-700">Instruktur</label>
                <div class="relative">
                  <select 
                    v-model="form.instructor_name" 
                    required 
                    class="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 outline-none bg-white transition appearance-none cursor-pointer focus:ring-2 focus:ring-pink-300"
                    :class="{'text-gray-400': !form.instructor_name, 'text-gray-800': form.instructor_name}"
                  >
                    <option value="" disabled>Pilih instruktur...</option>
                    <option v-for="t in teachers" :key="t.id" :value="t.name" class="text-gray-800">{{ t.name }}</option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium mb-1 text-gray-700">Waktu Mulai</label>
                  <input v-model="form.start_at" type="datetime-local" :min="minDateTime" required class="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-pink-300 transition text-gray-800">
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1 text-gray-700">Durasi (Menit)</label>
                  <input v-model.number="form.duration_minutes" type="number" required class="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-pink-300 transition" placeholder="60">
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium mb-1 text-gray-700">Ruangan</label>
                  <div class="relative">
                    <select 
                      v-model="form.room" 
                      required 
                      class="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 outline-none bg-white transition appearance-none cursor-pointer focus:ring-2 focus:ring-pink-300"
                      :class="{'text-gray-400': !form.room, 'text-gray-800': form.room}"
                    >
                      <option value="" disabled>Pilih ruangan</option>
                      <option value="Sun Room" class="text-gray-800">Sun Room</option>
                      <option value="Moon Studio" class="text-gray-800">Moon Studio</option>
                      <option value="Garden Area" class="text-gray-800">Garden Area</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1 text-gray-700">Kapasitas</label>
                  <input v-model.number="form.max_capacity" type="number" required class="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-pink-300 transition" placeholder="10">
                </div>
              </div>

              <div v-if="errorMessage" class="text-red-500 text-sm p-2 bg-red-50 rounded-lg border border-red-100">{{ errorMessage }}</div>

              <div class="flex justify-end gap-3 mt-6">
                <button type="button" class="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition" @click="showModal = false">Batal</button>
                <button type="submit" class="px-6 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium shadow-sm transition">Simpan Kelas</button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>