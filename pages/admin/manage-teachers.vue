<script setup lang="ts">
import { useAuthStore } from '~/store/auth'

interface Teacher {
  id?: number
  name: string
  image?: string | File | null 
  bio: string
  specialty: string
  certification: string
}

interface FetchError {
  data?: {
    error?: string
  }
}

const config = useRuntimeConfig()
const authStore = useAuthStore()

const teachers = ref<Teacher[]>([])
const loading = ref(false)
const showModal = ref(false)
const isEditing = ref(false)
const errorMessage = ref('')
const previewImage = ref<string | null>(null) 

const form = ref<Teacher>({
  name: '',
  image: null,
  bio: '',
  specialty: '',
  certification: ''
})

const selectedFile = ref<File | null>(null)

const getImageUrl = (imagePath: string | File | null) => {
  if (!imagePath || typeof imagePath !== 'string') return null
  if (imagePath.startsWith('http')) return imagePath
  const baseUrl = config.public.apiBase.replace('/api/', '') 
  return `${baseUrl}${imagePath}`
}

const fetchTeachers = async () => {
  loading.value = true
  try {
    const data = await $fetch<Teacher[]>(`${config.public.apiBase}teachers/`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    teachers.value = data
  } catch {
    alert('Gagal mengambil data pengajar.')
  } finally {
    loading.value = false
  }
}

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    selectedFile.value = file
    previewImage.value = URL.createObjectURL(file)
  }
}

const openAddModal = () => {
  isEditing.value = false
  errorMessage.value = ''
  selectedFile.value = null
  previewImage.value = null
  
  form.value = {
    name: '',
    image: null,
    bio: '',
    specialty: '',
    certification: ''
  }
  showModal.value = true
}

const openEditModal = (item: Teacher) => {
  isEditing.value = true
  errorMessage.value = ''
  selectedFile.value = null
  
  previewImage.value = typeof item.image === 'string' ? getImageUrl(item.image) : null

  form.value = { ...item }
  showModal.value = true
}

const saveTeacher = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const method = isEditing.value ? 'PATCH' : 'POST'
    const url = isEditing.value 
      ? `${config.public.apiBase}teachers/${form.value.id}/` 
      : `${config.public.apiBase}teachers/`

    const formData = new FormData()
    formData.append('name', form.value.name)
    formData.append('bio', form.value.bio)
    formData.append('specialty', form.value.specialty)
    formData.append('certification', form.value.certification)

    if (selectedFile.value) {
      formData.append('image', selectedFile.value)
    }

    await $fetch(url, {
      method: method,
      body: formData,
      headers: { Authorization: `Bearer ${authStore.token}` }
    })

    showModal.value = false
    fetchTeachers()
  } catch (err: unknown) {
    const error = err as FetchError
    console.error('Save error:', error.data)
    errorMessage.value = error.data?.error || 'Terjadi kesalahan saat menyimpan.'
  } finally {
    loading.value = false
  }
}

const deleteTeacher = async (id: number) => {
  if (!confirm('Yakin ingin menghapus pengajar ini?')) return

  loading.value = true
  try {
    await $fetch(`${config.public.apiBase}teachers/${id}/`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    fetchTeachers()
  } catch {
    alert('Gagal menghapus.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTeachers()
})
</script>

<template>
  <div class="min-h-screen bg-pink-50 p-4 md:p-8 font-sans pb-20">
    <div class="max-w-6xl mx-auto"> 
      
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 mt-24">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">Manage Teachers<span class="text-pink-500">.</span></h1>
          <p class="text-sm md:text-base text-gray-500">Daftar instruktur & profil lengkap</p>
        </div>
        <button 
          class="w-full md:w-auto bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full shadow-md transition font-medium flex items-center justify-center gap-2"
          @click="openAddModal"
        >
          <span>+</span> Tambah Teacher
        </button>
      </div>

      <div v-if="loading && !showModal" class="text-center py-12 text-pink-400">Loading data...</div>

      <div v-else>
        <div class="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden border border-pink-100">
          <table class="w-full text-left"> 
            <thead class="bg-pink-100 text-pink-700 uppercase text-sm font-bold">
              <tr>
                <th class="p-4 text-center">Foto</th>
                <th class="p-4">Nama</th>
                <th class="p-4">Spesialisasi</th>
                <th class="p-4">Bio</th> 
                <th class="p-4">Sertifikasi</th>
                <th class="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-pink-50">
              <tr v-for="teacher in teachers" :key="teacher.id" class="hover:bg-pink-50 transition">
                
                <td class="p-4 text-center">
                  <div class="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-pink-200 mx-auto">
                    <img 
                      v-if="teacher.image" 
                      :src="getImageUrl(teacher.image as string) || ''" 
                      class="w-full h-full object-cover" 
                      alt="Foto"
                    >
                    <div v-else class="w-full h-full flex items-center justify-center text-[10px] text-gray-400">No Pic</div>
                  </div>
                </td>

                <td class="p-4 align-middle">
                  <span class="font-medium text-gray-800 block truncate">{{ teacher.name }}</span>
                </td>
                
                <td class="p-4 align-middle">
                  <span class="inline-block bg-pink-100 text-pink-600 text-xs px-2 py-1 rounded-md font-bold uppercase tracking-wide truncate">
                    {{ teacher.specialty }}
                  </span>
                </td>

                <td class="p-4 align-middle">
                  <p class="text-sm text-gray-600 line-clamp-2 italic leading-relaxed" :title="teacher.bio">
                    "{{ teacher.bio }}"
                  </p>
                </td>
                
                <td class="p-4 align-middle">
                  <span class="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-full font-bold border border-purple-100 truncate block text-center">
                    {{ teacher.certification }}
                  </span>
                </td>
                
                <td class="p-4 text-center flex justify-center gap-2 align-middle">
                  <button class="text-blue-500 hover:text-blue-700 text-sm font-semibold" @click="openEditModal(teacher)">Edit</button>
                  <button class="text-red-400 hover:text-red-600 text-sm font-semibold" @click="deleteTeacher(teacher.id!)">Hapus</button>
                </td>
              </tr>
              <tr v-if="teachers.length === 0">
                <td colspan="6" class="p-8 text-center text-gray-400 text-sm">Belum ada data teacher.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="md:hidden space-y-4">
          <div v-if="teachers.length === 0" class="text-center text-gray-400 py-8 bg-white rounded-xl">
            Belum ada data teacher.
          </div>

          <div v-for="teacher in teachers" :key="teacher.id" class="bg-white p-4 rounded-xl shadow-sm border border-pink-100 flex gap-4">
            <div class="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border border-pink-200 flex-shrink-0 mt-1">
               <img v-if="teacher.image" :src="getImageUrl(teacher.image as string) || ''" class="w-full h-full object-cover" >
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-start">
                <h3 class="font-bold text-gray-800 text-base truncate">{{ teacher.name }}</h3>
                <div class="flex gap-2">
                   <button class="text-blue-600 text-xs font-bold" @click="openEditModal(teacher)">Edit</button>
                   <button class="text-red-400 text-xs font-bold" @click="deleteTeacher(teacher.id!)">Hapus</button>
                </div>
              </div>
              
              <div class="mt-1 mb-2">
                 <span class="text-[10px] font-bold bg-pink-100 text-pink-600 px-2 py-0.5 rounded">
                   {{ teacher.specialty }}
                 </span>
              </div>
              
              <p class="text-xs text-gray-500 line-clamp-2 italic mb-2">
                "{{ teacher.bio }}"
              </p>

              <div class="text-[10px] text-purple-600 font-bold bg-purple-50 inline-block px-2 py-0.5 rounded-full">
                🎖 {{ teacher.certification }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
        <div class="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
          
          <div class="p-6 border-b border-gray-100">
            <h2 class="text-xl md:text-2xl font-bold text-pink-600">{{ isEditing ? 'Edit Teacher' : 'Tambah Teacher Baru' }}</h2>
          </div>

          <div class="p-6 overflow-y-auto">
            <form class="space-y-5" @submit.prevent="saveTeacher">
              
              <div class="flex justify-center mb-6">
                <div class="relative w-32 h-32 rounded-full overflow-hidden border-4 border-pink-50 bg-gray-100 group cursor-pointer shadow-inner">
                  <img v-if="previewImage" :src="previewImage" class="w-full h-full object-cover" >
                  <div v-else class="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <span class="text-2xl">📷</span>
                    <span class="text-[10px] mt-1">Upload</span>
                  </div>
                  
                  <div class="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span class="text-white text-xs font-bold">Ganti Foto</span>
                  </div>
                  <input type="file" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer" @change="handleFileChange">
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium mb-1 text-gray-700">Nama Lengkap</label>
                <input v-model="form.name" type="text" placeholder="e.g. Nabiilah Putri Safa" required class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-pink-300 outline-none">
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium mb-1 text-gray-700">Spesialisasi</label>
                  <input v-model="form.specialty" type="text" placeholder="e.g. Vinyasa" required class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-pink-300 outline-none">
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1 text-gray-700">Sertifikasi</label>
                  <input v-model="form.certification" type="text" placeholder="e.g. RYT-200" required class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-pink-300 outline-none">
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium mb-1 text-gray-700">Bio</label>
                <textarea 
                  v-model="form.bio" 
                  rows="3" 
                  placeholder="Insert teacher's bio..." 
                  class="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-pink-300 outline-none resize-none"
                />
              </div>

              <div v-if="errorMessage" class="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">{{ errorMessage }}</div>

              <div class="flex flex-col-reverse md:flex-row justify-end gap-3 pt-2">
                <button type="button" class="w-full md:w-auto px-4 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg font-medium transition" @click="showModal = false">Batal</button>
                <button type="submit" :disabled="loading" class="w-full md:w-auto px-6 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-lg shadow-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed">
                  {{ loading ? 'Simpan...' : 'Simpan Data' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>