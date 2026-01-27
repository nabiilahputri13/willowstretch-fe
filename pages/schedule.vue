<script setup lang="ts">
import { useAuthStore } from '~/store/auth'
import { 
  addDays, subDays, addMonths, subMonths, 
  format, isSameDay, startOfDay, isBefore, 
  startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval 
} from 'date-fns'

interface RawYogaClass {
  id: number
  name: string
  instructor_name: string
  room: string
  start_at: string
  duration_minutes: number
  max_capacity: number
  participant_count: number
  is_full: boolean
}

interface UiYogaClass {
  id: number
  class_name: string
  instructor: {
    user: {
      first_name: string
      last_name: string
    }
  }
  room: {
    name: string
  }
  start_time: string
  duration: number
  capacity: number
  booked_count: number
  is_full: boolean
  is_booked_by_user: boolean
}

interface FetchError {
  data?: {
    error?: string
  }
}

type ViewMode = 'week' | 'month'

const config = useRuntimeConfig()
const authStore = useAuthStore()
const router = useRouter()

const today = startOfDay(new Date())

const viewMode = ref<ViewMode>('week')
const viewStart = ref(new Date(today)) 
const currentMonth = ref(new Date(today))
const selectedDate = ref(new Date(today))

const bookingLoadingId = ref<number | null>(null)

const { data: rawClasses, pending: loading, refresh } = await useFetch<RawYogaClass[]>(
  `${config.public.apiBase}classes/`,
  {
    server: false, 
    headers: authStore.token ? { Authorization: `Bearer ${authStore.token}` } : undefined,
  }
)

const schedules = computed<UiYogaClass[]>(() => {
  if (!rawClasses.value) return []

  return rawClasses.value
    .filter((cls) => {
      const clsDate = new Date(cls.start_at) 
      return isSameDay(clsDate, selectedDate.value)
    })
    .sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime())
    .map((cls) => {
      const start = new Date(cls.start_at)
      return {
        id: cls.id,
        class_name: cls.name,
        instructor: {
          user: {
            first_name: cls.instructor_name,
            last_name: '',
          },
        },
        room: {
          name: cls.room,
        },
        start_time: format(start, 'HH:mm'),
        duration: cls.duration_minutes,
        capacity: cls.max_capacity,
        booked_count: cls.participant_count,
        is_full: cls.is_full,
        is_booked_by_user: false,
      }
    })
})

const handleBook = async (cls: UiYogaClass) => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  if (!confirm(`Book kelas ${cls.class_name} jam ${cls.start_time}?`)) return

  bookingLoadingId.value = cls.id
  try {
    await $fetch(`${config.public.apiBase}classes/${cls.id}/join/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authStore.token}` },
    })
    alert('Booking berhasil! ✨')
    refresh()
  // FIX 2: Ganti catch(e: any) dengan unknown + casting
  } catch (err: unknown) {
    const error = err as FetchError
    alert(error.data?.error || 'Gagal join kelas.')
  } finally {
    bookingLoadingId.value = null
  }
}

/* ========================
   DATE LOGIC
======================== */
const weekDates = computed(() => {
  return Array.from({ length: 7 }).map((_, i) => addDays(viewStart.value, i))
})

const nextWeek = () => {
  viewStart.value = addDays(viewStart.value, 7)
  if (isBefore(selectedDate.value, viewStart.value)) {
    selectedDate.value = new Date(viewStart.value)
  }
}

const prevWeek = () => {
  const target = subDays(viewStart.value, 7)
  if (isBefore(target, today)) {
    viewStart.value = new Date(today)
  } else {
    viewStart.value = target
  }
  if (!isSameDay(selectedDate.value, viewStart.value)) {
     selectedDate.value = new Date(viewStart.value)
  }
}

const isPrevWeekDisabled = computed(() => isSameDay(viewStart.value, today))

const monthDays = computed(() => {
  const start = startOfWeek(startOfMonth(currentMonth.value))
  const end = endOfWeek(endOfMonth(currentMonth.value))
  return eachDayOfInterval({ start, end })
})

const nextMonth = () => currentMonth.value = addMonths(currentMonth.value, 1)

const prevMonth = () => {
  const target = subMonths(currentMonth.value, 1)
  if (isBefore(endOfMonth(target), today)) return 
  currentMonth.value = target
}

const isPrevMonthDisabled = computed(() => {
  return isBefore(endOfMonth(subMonths(currentMonth.value, 1)), today)
})

const isDateDisabled = (date: Date) => isBefore(date, today)

</script>

<template>
  <div class="min-h-screen bg-pink-50 p-4 md:p-8 font-sans pb-20">
    <div class="max-w-6xl mx-auto">
      
      <div class="flex flex-col md:flex-row justify-between items-center mb-6 mt-24 gap-6">
        <div class="text-center md:text-left">
          <h1 class="text-4xl font-bold text-pink-600 mb-2">Schedule</h1>
          <p class="text-gray-500">
            {{ format(selectedDate, 'EEEE, d MMMM yyyy') }}
          </p>
        </div>

        <div class="bg-white p-1 rounded-xl shadow-sm border border-pink-100 flex">
          <button 
            class="px-6 py-2 rounded-lg text-sm font-bold transition-all"
            :class="viewMode === 'week' ? 'bg-pink-500 text-white shadow-sm' : 'text-gray-400 hover:text-pink-500'"
            @click="viewMode = 'week'"
          >
            Weekly
          </button>
          <button 
            class="px-6 py-2 rounded-lg text-sm font-bold transition-all"
            :class="viewMode === 'month' ? 'bg-pink-500 text-white shadow-sm' : 'text-gray-400 hover:text-pink-500'"
            @click="viewMode = 'month'"
          >
            Monthly
          </button>
        </div>
      </div>

      <div class="mb-8">
        <div class="bg-white p-4 rounded-3xl shadow-sm border border-pink-100">
          
          <div v-if="viewMode === 'week'" class="flex items-center gap-2">
            <button 
              :disabled="isPrevWeekDisabled" 
              class="w-10 h-20 flex items-center justify-center rounded-2xl hover:bg-pink-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-pink-600 font-bold text-xl"
              @click="prevWeek"
            >
              ‹
            </button>

            <div class="flex-1 overflow-x-auto scrollbar-hide py-2">
              <div class="flex gap-3 min-w-max justify-center">
                <button
                  v-for="date in weekDates"
                  :key="date.toISOString()"
                  class="flex flex-col items-center justify-center w-16 h-20 rounded-2xl transition-all duration-300 border-2"
                  :class="isSameDay(date, selectedDate) 
                    ? 'bg-pink-500 border-pink-500 text-white shadow-md transform -translate-y-1' 
                    : 'bg-white border-transparent text-gray-600 hover:bg-pink-50 hover:text-pink-500'"
                  @click="selectedDate = date"
                >
                  <span class="text-[10px] font-bold uppercase tracking-wider mb-1">
                    {{ format(date, 'EEE') }}
                  </span>
                  <span class="text-xl font-bold">{{ format(date, 'd') }}</span>
                </button>
              </div>
            </div>

            <button class="w-10 h-20 flex items-center justify-center rounded-2xl hover:bg-pink-50 transition-colors text-pink-600 font-bold text-xl" @click="nextWeek">
              ›
            </button>
          </div>

          <div v-else>
            <div class="flex items-center justify-between mb-4 px-2">
              <button :disabled="isPrevMonthDisabled" class="p-2 text-pink-600 font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-pink-50 rounded-lg transition" @click="prevMonth">
                ‹ Prev
              </button>
              <h3 class="text-lg font-bold text-gray-800">{{ format(currentMonth, 'MMMM yyyy') }}</h3>
              <button class="p-2 text-pink-600 font-bold hover:bg-pink-50 rounded-lg transition" @click="nextMonth">
                Next ›
              </button>
            </div>

            <div class="grid grid-cols-7 gap-2 text-center mb-2">
              <span v-for="day in ['Su','Mo','Tu','We','Th','Fr','Sa']" :key="day" class="text-xs font-bold text-gray-400 uppercase">
                {{ day }}
              </span>
            </div>
            <div class="grid grid-cols-7 gap-2">
              <button
                v-for="date in monthDays"
                :key="date.toISOString()"
                :disabled="isDateDisabled(date)"
                class="h-10 w-full rounded-lg text-sm font-medium transition-all flex items-center justify-center relative"
                :class="[
                  isSameDay(date, selectedDate) ? 'bg-pink-500 text-white shadow-md font-bold' : 
                  isDateDisabled(date) ? 'text-gray-300 cursor-not-allowed bg-gray-50' : 
                  'text-gray-600 hover:bg-pink-50 hover:text-pink-600',
                  format(date, 'MM') !== format(currentMonth, 'MM') ? 'opacity-30' : ''
                ]"
                @click="!isDateDisabled(date) && (selectedDate = date)"
              >
                {{ format(date, 'd') }}
                <span v-if="isSameDay(date, today) && !isSameDay(date, selectedDate)" class="absolute bottom-1 w-1 h-1 bg-pink-400 rounded-full"/>
              </button>
            </div>
          </div>

        </div>
      </div>

      <div class="space-y-6">
        
        <div v-if="loading" class="space-y-6">
          <div v-for="i in 3" :key="i" class="h-40 bg-white rounded-3xl animate-pulse shadow-sm" />
        </div>

        <div v-else-if="schedules.length === 0" class="text-center py-24 bg-white rounded-3xl border border-dashed border-pink-200">
          <p class="text-gray-400 text-lg">Tidak ada kelas jadwal di tanggal ini.</p>
        </div>

        <div
          v-for="cls in schedules"
          :key="cls.id"
          class="bg-white rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-pink-100 relative overflow-hidden group"
        >
          <!-- <div class="absolute top-0 right-0 w-32 h-32 bg-pink-200 rounded-bl-[100px] -z-0 transition-transform duration-500 group-hover:scale-110 opacity-50 md:opacity-100"/> -->
<div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-400 to-orange-300 rounded-bl-[100px] -z-0 transition-transform duration-500 group-hover:scale-110 opacity-30"/>

          <div class="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div class="flex gap-6 items-start flex-1">
              <div class="min-w-[90px] text-center md:text-left">
                <span class="block text-3xl font-extrabold text-pink-600 tracking-tight">
                  {{ cls.start_time }}
                </span>
                <span class="block text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                  {{ cls.duration }} MIN
                </span>
              </div>
              <div>
                <div class="flex items-center gap-2 mb-1">
                   <span class="bg-pink-100 text-pink-600 text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider">
                     {{ cls.room.name }}
                   </span>
                   <span v-if="cls.is_full" class="bg-red-100 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider">
                     Full Booked
                   </span>
                </div>
                <h3 class="text-xl md:text-2xl font-bold text-gray-800 mb-1 group-hover:text-pink-600 transition-colors">
                  {{ cls.class_name }}
                </h3>
                <p class="text-sm text-gray-500 font-medium">
                  with <span class="text-gray-800 font-bold">{{ cls.instructor.user.first_name }}</span>
                </p>
              </div>
            </div>

            <div class="w-full md:w-auto flex items-center justify-between md:flex-col md:items-end gap-3 mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-pink-50">
              <div class="text-left md:text-right">
                 <div class="text-xs font-bold text-gray-400 uppercase">Availability</div>
                 <div class="font-bold text-sm" :class="cls.is_full ? 'text-red-500' : 'text-emerald-500'">
                    {{ cls.is_full ? 'Full' : `${cls.capacity - cls.booked_count} Slots Left` }}
                 </div>
              </div>
              <button
                :disabled="cls.is_full || bookingLoadingId === cls.id"
                class="px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                :class="
                  cls.is_full
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                    : 'bg-pink-500 text-white hover:bg-pink-600'
                "
                @click="handleBook(cls)"
              >
                <span v-if="bookingLoadingId === cls.id" class="animate-spin">⏳</span>
                <span v-else>{{ cls.is_full ? 'Full' : 'Book Class' }}</span>
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>