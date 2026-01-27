<template>
  <footer class="relative bg-[#1A1114] text-white pt-20 md:pt-32 pb-12 px-6 md:px-12 overflow-hidden">
    <div class="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-pink-500/10 blur-[80px] md:blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"/>
    <div class="absolute bottom-0 left-0 w-48 md:w-64 h-48 md:h-64 bg-orange-400/5 blur-[80px] md:blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2"/>

    <div class="max-w-7xl mx-auto relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 md:mb-24">
        
        <div class="col-span-1 flex flex-col items-center md:items-start text-center md:text-left">
          <h4 class="text-3xl font-black tracking-tighter mb-6 md:mb-8">
            Willowstretch<span class="text-pink-400">.</span>
          </h4>
          
          <div class="md:hidden flex flex-col items-center">
            <p class="text-gray-400 text-xs leading-relaxed mb-6 max-w-[280px] font-medium">
              A curated sanctuary for conscious movement and mindful living. Embark on a journey back to yourself.
            </p>
            <button class="px-8 py-3 bg-gradient-to-r from-pink-500 to-orange-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-pink-500/20 active:scale-95 transition-all w-fit">
              Contact Us
            </button>
          </div>

          <div class="hidden md:block">
            <p class="text-gray-400 text-sm leading-relaxed mb-8 max-w-[240px] font-medium">
              A curated sanctuary for conscious movement and mindful living. Embark on a journey back to yourself.
            </p>
            <div class="flex gap-4">
              <div v-for="social in ['IG', 'FB', 'TW']" :key="social" class="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-pink-500 transition-all text-[10px] font-black border border-white/5 cursor-pointer">
                {{ social }}
              </div>
            </div>
          </div>
        </div>

        <div class="hidden md:block">
          <h5 class="text-[10px] font-black uppercase tracking-[0.4em] text-pink-400 mb-10">Offerings</h5>
          <ul class="space-y-5 text-sm font-bold text-gray-400">
            <li class="hover:text-white cursor-pointer transition-all">Yoga Classes</li>
            <li class="hover:text-white cursor-pointer transition-all">Membership</li>
            <li class="hover:text-white cursor-pointer transition-all">Private Session</li>
          </ul>
        </div>

        <div class="hidden md:block">
          <h5 class="text-[10px] font-black uppercase tracking-[0.4em] text-pink-400 mb-10">The Studios</h5>
          <ul class="space-y-5 text-sm font-bold text-gray-400">
            <li class="hover:text-white cursor-pointer transition-all">Jakarta Selatan</li>
            <li class="hover:text-white cursor-pointer transition-all">Menteng Central</li>
            <li class="hover:text-white cursor-pointer transition-all">BSD Sanctuary</li>
          </ul>
        </div>

        <div class="hidden md:block">
          <h5 class="text-[10px] font-black uppercase tracking-[0.4em] text-pink-400 mb-10">Stay In Touch</h5>
          <div class="space-y-6">
            <p class="text-sm font-black text-white underline decoration-pink-500/30 underline-offset-8">hello@willowstretch.com</p>
            <p class="text-xs font-bold text-gray-500 leading-loose">Jl. Kemang Raya No. 12<br>Jakarta Selatan, 12730</p>
            
            <button class="w-full py-4 bg-gradient-to-r from-pink-500 to-orange-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-pink-500/20 hover:scale-[1.02] active:scale-95 transition-all">
              Contact Us
            </button>
          </div>
        </div>
      </div>

      <div class="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-6 text-center">
        <div class="flex flex-col md:flex-row items-center gap-2 md:gap-4 font-black uppercase tracking-widest text-[9px]">
           <p class="text-gray-500">© 2026 NABIILAH PUTRI SAFA</p>
           <div class="hidden md:block w-1 h-1 rounded-full bg-gray-800"/>
           <p class="italic text-gray-600">WILLOWSTRETCH STUDIO</p>
        </div>
        
        <div class="flex gap-8 md:gap-10 text-[9px] font-black uppercase tracking-[0.2em]">
          <span class="text-gray-500 hover:text-pink-400 cursor-pointer transition-colors">PRIVACY POLICY</span>
          <span class="text-gray-500 hover:text-pink-400 cursor-pointer transition-colors">TERMS OF SERVICE</span>
        </div>
      </div>
    </div>
  </footer>
</template>