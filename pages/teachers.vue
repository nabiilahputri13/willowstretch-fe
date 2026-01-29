<script setup lang="ts">
const config = useRuntimeConfig()

interface Teacher {
  id: number
  name: string
  image: string
  bio: string
  specialty: string
  certification: string
}

const teachers = ref<Teacher[]>([])
const loading = ref(true)

const getImageUrl = (imagePath: string | null) => {
  if (!imagePath) return 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80'
  if (imagePath.startsWith('http')) return imagePath
  const baseUrl = config.public.apiBase.replace('/api/', '') 
  return `${baseUrl}${imagePath}`
}

const fetchTeachers = async () => {
  try {
    const data = await $fetch<Teacher[]>(`${config.public.apiBase}teachers/`)
    teachers.value = data
  } catch (error) {
    console.error('Failed to fetch teachers', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTeachers()
})
</script>

<template>
  <div class="min-h-screen bg-pink-50 pt-32 pb-20 px-6 font-sans">
    <div class="max-w-[1400px] mx-auto">
      
      <div class="text-center mb-16">
        <span class="text-[10px] font-black text-pink-500 uppercase tracking-[0.4em] mb-4 block">
          Meet The Guides
        </span>
        <h1 class="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-tight">
          Souls of<br>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400">Willowstretch.</span>
        </h1>
        <p class="mt-6 text-gray-400 max-w-md mx-auto font-medium italic">
          "Expert practitioners dedicated to guiding you back to your body, mind, and spirit."
        </p>
      </div>

      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="i in 4" :key="i" class="aspect-[3/4] bg-white rounded-[3rem] animate-pulse"/>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div 
          v-for="teacher in teachers" 
          :key="teacher.id"
          class="group relative w-full"
        > 
          <div class="relative aspect-[3/4] w-full overflow-hidden rounded-[3rem] shadow-xl shadow-pink-500/5 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl">
            
            <img 
              :src="getImageUrl(teacher.image)" 
              class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              alt="Teacher Photo"
            >

            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"/>

            <div class="absolute top-5 right-5 z-20">
              <span class="inline-flex items-center px-3 py-1.5 bg-pink-100 border border-pink-500 rounded-full text-pink-600 text-[9px] font-black uppercase tracking-widest shadow-sm">
                {{ teacher.certification }}
              </span>
            </div>

            <div class="absolute bottom-0 left-0 w-full p-8 pb-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 z-20">
              
              <span class="inline-block px-3 py-1 mb-3 rounded-full bg-pink-500/20 backdrop-blur-md border border-pink-500/30 text-pink-200 text-[9px] font-black uppercase tracking-[0.2em]">
                {{ teacher.specialty }}
              </span>

              <h3 class="text-3xl font-black text-white mb-2 leading-none">
                {{ teacher.name }}
              </h3>

              <p class="text-xs text-gray-300 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 italic">
                "{{ teacher.bio }}"
              </p>
            </div>

          </div>

          <div class="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[90%] bg-gradient-to-br from-pink-200 to-orange-100 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"/>

        </div>
      </div>
      
      <div v-if="!loading && teachers.length === 0" class="text-center py-20">
        <p class="text-gray-400 italic text-xl">No guides found yet.</p>
      </div>

    </div>
  </div>
</template>