<template>
  <div class="min-h-screen bg-[#fafafa] font-sans text-gray-900 overflow-x-hidden">
    <navbar />

    <header class="relative h-[80vh] flex items-center justify-center text-center text-white overflow-hidden">
      <img src="/hero-bg.jpg" class="absolute inset-0 w-full h-full object-cover brightness-75 scale-105" alt="Willow Trees">
      
      <div class="relative z-10 px-6">
        <div class="inline-block mb-4 px-4 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
           <span class="text-[10px] font-black uppercase tracking-[0.4em]">Est. 2026</span>
        </div>
        <h1 class="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-4">
          Willowstretch<span class="text-pink-400">.</span>
        </h1>
        <p class="text-lg md:text-xl mb-10 font-medium italic opacity-90 tracking-wide">
          "A gentle place to return to your body"
        </p>
        <NuxtLink to="/schedule" class="px-10 py-4 bg-pink-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-pink-600 transition-all duration-500 shadow-xl shadow-pink-500/20">
          Book A Class
        </NuxtLink>
      </div>
    </header>

    <section class="py-24 px-12 text-center max-w-5xl mx-auto">
      <h2 class="text-[10px] font-black text-pink-500 uppercase tracking-[0.4em] mb-6 text-center">About Us</h2>
      <p class="text-2xl md:text-4xl font-black text-gray-800 tracking-tighter leading-tight mb-12">
        Rest, release, <span class="text-pink-500 underline decoration-pink-200 underline-offset-8">renew.</span>
      </p>
      <p class="leading-relaxed mb-20 text-gray-500 max-w-2xl mx-auto font-medium">
        Willowstretch bukan sekadar studio yoga. Kami adalah ruang untuk bernapas di tengah hiruk-pikuk Jakarta. Desain studio kami terinspirasi dari kelembutan pohon willow yang kuat namun fleksibel.
      </p>

     <div class="grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
  
  <div class="md:col-span-7 md:row-span-2 bg-pink-100 rounded-[3.5rem] p-10 md:p-16 flex flex-col justify-between overflow-hidden group relative">
    <div class="relative z-10">
      <span class="text-[10px] font-black uppercase tracking-[0.4em] text-pink-600 mb-4 block">The Experts</span>
      <h3 class="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter leading-none">
        Certified<br><span class="text-pink-500">Teachers.</span>
      </h3>
      <p class="mt-6 text-gray-500 max-w-xs font-medium leading-relaxed">
        Guided by practitioners who don't just teach yoga, but live it every single day.
      </p>
    </div>
    
    <div class="absolute -right-10 -bottom-10 text-[15rem] opacity-10 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-700">
      🧘‍♀️
    </div>
  </div>

  <div class="md:col-span-5 md:row-span-1 bg-orange-50 rounded-[3rem] p-10 flex items-center justify-between group">
    <div>
      <h3 class="text-2xl font-black text-orange-700 tracking-tight leading-tight mb-2">
        Nature-Inspired<br>Shala
      </h3>
      <p class="text-xs text-orange-900/40 font-bold uppercase tracking-widest">Minimalist & Calm</p>
    </div>
    <div class="text-5xl group-hover:rotate-12 transition-transform duration-500">🌿</div>
  </div>

  <div class="md:col-span-5 md:row-span-1 bg-pink-50 rounded-[3rem] p-10 flex items-center justify-between group">
    <div>
      <h3 class="text-2xl font-black text-pink-600 tracking-tight leading-tight mb-2">
        Various<br>Classes
      </h3>
      <p class="text-xs text-pink-900/30 font-bold uppercase tracking-widest">Flow, Rest, or Power</p>
    </div>
    <div class="text-5xl group-hover:scale-125 transition-transform duration-500">✨</div>
  </div>

</div>
    </section>

    <section class="relative h-[60vh] flex items-center justify-center text-white overflow-hidden">
      <img src="/hero-bg-2.png" class="absolute inset-0 w-full h-full object-cover brightness-50" alt="Yoga in Nature">
      <div class="relative z-10 text-center px-6">
        <h2 class="text-4xl md:text-6xl font-black mb-6 tracking-tighter">Where soft bodies find calm</h2>
        <NuxtLink to="/pricing" class="px-10 py-4 bg-white text-gray-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-pink-500 hover:text-white transition-all duration-500">
          Join Membership
        </NuxtLink>
      </div>
    </section>

    <section class="py-32 px-12 max-w-6xl mx-auto">
      <div class="flex flex-col md:flex-row gap-16 items-center">
        <div class="flex-1">
          <h2 class="text-[10px] font-black text-pink-500 uppercase tracking-[0.4em] mb-6">Our Sanctuary</h2>
          <h3 class="text-4xl font-black text-gray-800 tracking-tighter mb-6">Visit our studio in the heart of Jakarta.</h3>
          <p class="text-gray-500 leading-relaxed font-medium">
            Terletak di area yang tenang, studio kami dirancang untuk memberikan kedamaian instan begitu Anda melangkah masuk. Dengan pencahayaan alami dan aroma terapi yang menenangkan.
          </p>
        </div>
        <div class="flex-1 w-full bg-pink-100 h-80 rounded-[3rem] overflow-hidden rotate-2 border-8 border-white shadow-xl hover:scale-110 hover:-rotate-2 transition-transform duration-500">
           <div class="w-full h-full flex items-center justify-center text-pink-300 font-black tracking-widest uppercase text-xs italic">Willow Studio View</div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Willowstretch - A Gentle Place to Return to Your Body',
})
</script>

<style scoped>
/* Styling khusus biar teks hero lebih pop */
h1 {
  text-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
</style>