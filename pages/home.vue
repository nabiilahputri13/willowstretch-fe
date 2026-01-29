<template>
  <div class="min-h-screen bg-pink-50 font-sans text-gray-900 overflow-x-hidden selection:bg-pink-200">
    <navbar />

    <header class="relative h-[85vh] md:h-screen flex flex-col items-center justify-center text-center text-white overflow-hidden mesh-gradient-container">
      
      <div class="absolute inset-0 z-0 liquid-bg"/>
      <div class="absolute inset-0 opacity-20 z-[1] mix-blend-overlay pointer-events-none" style="background-image: url('https://grainy-gradients.vercel.app/noise.svg')"/>

      <div class="relative z-10 px-6 max-w-5xl mx-auto drop-shadow-sm">
        <div class="inline-block mb-6 md:mb-8 px-4 py-1.5 md:px-5 md:py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl animate-fade-in-up">
           <span class="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] text-white">Est. 2026</span>
        </div>
        
        <h1 class="text-6xl md:text-[10rem] font-black tracking-tighter leading-[0.9] md:leading-[0.85] mb-6 md:mb-8 drop-shadow-2xl animate-fade-in-up delay-100">
          Willow<br>stretch<span class="text-pink-200">.</span>
        </h1>
        
        <p class="text-lg md:text-3xl mb-8 md:mb-12 font-medium italic opacity-95 tracking-tight text-white animate-fade-in-up delay-200">
          "A gentle place to return to your body"
        </p>
        
        <NuxtLink to="/schedule" class="group relative inline-flex items-center justify-center px-10 py-4 md:px-12 md:py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 hover:scale-105 hover:shadow-[0_20px_50px_rgba(219,39,119,0.3)] overflow-hidden animate-fade-in-up delay-300">
          <span class="relative z-10">Book A Class</span>
          <div class="absolute inset-0 bg-pink-50 translate-y-full group-hover:translate-y-0 transition-transform duration-300"/>
        </NuxtLink>
      </div>
    </header>

    <section class="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto relative">
      
      <div class="absolute top-1/4 left-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"/>
      <div class="absolute bottom-1/4 right-0 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"/>

      <div class="flex flex-col items-center mb-16 md:mb-24 relative z-10">
        <h2 class="text-[10px] font-black text-pink-500 uppercase tracking-[0.4em] mb-6">Discovery</h2>
        <p class="text-4xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none text-center">
          Rest, release, <br>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400">renew.</span>
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        
        <div class="group relative bg-pink-100 rounded-[3rem] p-10 border-4 border-white transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-pink-500/20 overflow-hidden flex flex-col justify-between h-[450px] md:h-[500px]">
          <div class="absolute top-0 right-0 w-48 h-48 bg-pink-200 rounded-full -mr-16 -mt-16 blur-2xl opacity-50"/>
          
          <div class="relative z-10">
             <div class="w-16 h-16 bg-white text-3xl flex items-center justify-center rounded-2xl mb-8 shadow-sm group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
               🧘‍♀️
             </div>
             <h3 class="text-3xl md:text-4xl font-black text-gray-800 tracking-tighter leading-[0.9] mb-6">
               Certified<br>Guides.
             </h3>
             <p class="text-gray-600 font-medium leading-relaxed">
               Guided by practitioners who don't just teach yoga, but live it every single day. Experienced and dedicated to your growth.
             </p>
          </div>

          <div class="relative z-10 pt-8 border-t border-pink-200 mt-auto flex items-center gap-2 text-pink-500 font-bold uppercase text-[10px] tracking-widest group-hover:gap-4 transition-all">
            <span>Meet Teachers</span>
            <span>→</span>
          </div>
        </div>

        <div class="group relative bg-orange-100 rounded-[3rem] p-10 border-4 border-white transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-orange-500/20 overflow-hidden flex flex-col justify-between h-[450px] md:h-[500px] md:translate-y-12">
           <div class="absolute top-0 right-0 w-48 h-48 bg-orange-200 rounded-full -mr-16 -mt-16 blur-2xl opacity-50"/>

           <div class="relative z-10">
             <div class="w-16 h-16 bg-white text-3xl flex items-center justify-center rounded-2xl mb-8 shadow-sm group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">
               🌿
             </div>
             <h3 class="text-3xl md:text-4xl font-black text-gray-800 tracking-tighter leading-[0.9] mb-6">
               Nature<br>Inspired.
             </h3>
             <p class="text-gray-600 font-medium leading-relaxed">
               Designed to ground you. Natural light, calming scents, and organic elements that bring the outdoors in.
             </p>
          </div>

          <div class="relative z-10 pt-8 border-t border-orange-200 mt-auto flex items-center gap-2 text-orange-500 font-bold uppercase text-[10px] tracking-widest group-hover:gap-4 transition-all">
            <span>The Space</span>
            <span>→</span>
          </div>
        </div>

        <div class="group relative bg-rose-100 rounded-[3rem] p-10 border-4 border-white transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-rose-500/20 overflow-hidden flex flex-col justify-between h-[450px] md:h-[500px]">
           <div class="absolute top-0 right-0 w-48 h-48 bg-rose-200 rounded-full -mr-16 -mt-16 blur-2xl opacity-50"/>

           <div class="relative z-10">
             <div class="w-16 h-16 bg-white text-3xl flex items-center justify-center rounded-2xl mb-8 shadow-sm group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
               ✨
             </div>
             <h3 class="text-3xl md:text-4xl font-black text-gray-800 tracking-tighter leading-[0.9] mb-6">
               Various<br>Flows.
             </h3>
             <p class="text-gray-600 font-medium leading-relaxed">
               From dynamic Vinyasa to restorative Yin. A curated rhythm for every mood and every body type.
             </p>
          </div>

          <div class="relative z-10 pt-8 border-t border-rose-200 mt-auto flex items-center gap-2 text-rose-500 font-bold uppercase text-[10px] tracking-widest group-hover:gap-4 transition-all">
            <span>Explore Classes</span>
            <span>→</span>
          </div>
        </div>

      </div>
    </section>

    <section class="relative h-[60vh] md:h-[80vh] flex items-center justify-center text-white overflow-hidden group mt-12 md:mt-0">
      <div class="absolute inset-0 bg-gray-900">
        <img src="/yoga-studio.jpg" class="w-full h-full object-cover opacity-60 transition-transform duration-[2s] group-hover:scale-110" alt="Calmness" >
      </div>
      <div class="absolute inset-0 bg-gradient-to-b from-pink-600/40 to-orange-300/40 mix-blend-multiply"/>
      
      <div class="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h2 class="text-4xl md:text-8xl font-black mb-10 tracking-tighter leading-[0.9] drop-shadow-xl">Where soft bodies<br> find <span class="italic font-light">calm.</span></h2>
        <NuxtLink to="/pricing" class="px-10 py-4 md:px-12 md:py-5 bg-white text-gray-900 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-pink-500 hover:text-white transition-all duration-500 shadow-2xl hover:scale-110 inline-block">
          Join Membership
        </NuxtLink>
      </div>
    </section>

    <section class="py-24 md:py-40 px-6 md:px-12 max-w-7xl mx-auto">
      <div class="flex flex-col lg:flex-row gap-12 md:gap-24 items-center">
        <div class="flex-1 text-left">
          <div class="w-20 h-1 bg-pink-500 mb-8 md:mb-12"/>
          <h2 class="text-[10px] font-black text-pink-500 uppercase tracking-[0.4em] mb-6">Our Sanctuary</h2>
          <h3 class="text-4xl md:text-7xl font-black text-gray-800 tracking-tighter mb-8 md:mb-10 leading-none text-balance">The heart of<br>Jakarta.</h3>
          <p class="text-lg md:text-xl text-gray-500 leading-relaxed font-medium mb-12">
            Terletak di area yang tenang, studio kami dirancang untuk memberikan kedamaian instan begitu Anda melangkah masuk. Dengan pencahayaan alami dan aroma terapi yang menenangkan.
          </p>
        </div>
        
       <div class="flex-1 w-full h-[400px] md:h-[500px] relative group flex items-center justify-center">
          <div class="absolute inset-0 bg-pink-100 rounded-[3.5rem] rotate-6 scale-100 border-4 border-white shadow-sm transition-transform duration-700 group-hover:-rotate-12"/>
          
          <div class="relative w-full h-full bg-pink-50 rounded-[3.5rem] border-8 border-white shadow-2xl -rotate-2 hover:rotate-0 hover:scale-[1.02] transition-all duration-700 overflow-hidden flex flex-col justify-center p-8 md:p-12 text-left">
            <div class="space-y-6 md:space-y-8 relative z-10">
              <div class="inline-flex items-center justify-center w-16 h-16 text-white text-3xl animate-bounce">
                📍
              </div>
              
              <div>
                <h4 class="text-xs font-black uppercase tracking-[0.3em] text-pink-500 mb-2">Location</h4>
                <p class="text-2xl md:text-3xl font-black text-gray-800 tracking-tighter leading-none">
                  Kebayoran Lama,<br>South Jakarta
                </p>
              </div>

              <div class="pt-6 border-t border-pink-200">
                <p class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Opening Hours</p>
                <div class="grid grid-cols-2 gap-4 text-sm font-bold text-gray-600">
                  <div>
                    <p class="text-gray-400 font-medium">Mon - Fri</p>
                    <p>07:00 - 20:00</p>
                  </div>
                  <div>
                    <p class="text-gray-400 font-medium">Sat - Sun</p>
                    <p>08:00 - 16:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>


<style scoped>
.mesh-gradient-container {
  background-color: #db2777; 
}

.liquid-bg {
  background: 
    radial-gradient(circle at 50% 50%, #db2777 0%, transparent 50%),
    radial-gradient(circle at 5% 5%, #f472b6 0%, transparent 45%),
    radial-gradient(circle at 95% 95%, #fdba74 0%, transparent 45%),
    radial-gradient(circle at 95% 5%, #ff743d 0%, transparent 45%),
    radial-gradient(circle at 5% 95%, #f97316 0%, transparent 45%);
  background-size: 180% 180%;
  animation: liquid-flow 8s ease-in-out infinite;
  filter: blur(40px);
  transform: scale(1.3);
}

@keyframes liquid-flow {
  0% { background-position: 0% 0%; transform: scale(1.3) rotate(0deg); }
  50% { background-position: 100% 100%; transform: scale(1.4) rotate(2deg); }
  100% { background-position: 0% 0%; transform: scale(1.3) rotate(0deg); }
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-up {
  animation: fade-in-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.delay-100 { animation-delay: 0.1s; }
.delay-200 { animation-delay: 0.2s; }
.delay-300 { animation-delay: 0.3s; }

@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
.animate-blob {
  animation: blob 7s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
</style>