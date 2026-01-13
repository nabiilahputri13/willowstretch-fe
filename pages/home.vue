<template>
  <div class="min-h-screen bg-[#FDFBF0] font-['Quicksand'] text-[#5D6D4E]">
    <navbar />

    <header class="relative h-[80vh] flex items-center justify-center text-center text-white">
      <img src="/hero-bg.jpg" class="absolute inset-0 w-full h-full object-cover brightness-75" alt="Willow Trees">
      <div class="relative z-10">
        <h1 class="font-['Irish_Grover'] text-7xl mb-2">Willowstretch</h1>
        <p class="text-xl mb-8 font-light italic">A gentle place to return to your body</p>
        <button class="px-8 py-2 border-2 border-white rounded-full font-medium hover:bg-white hover:text-[#5D6D4E] transition">
          Book A Class
        </button>
      </div>
    </header>

    <section class="py-20 px-12 text-center max-w-5xl mx-auto">
      <h2 class="font-['Irish_Grover'] text-4xl mb-6">About Us</h2>
      <p class="leading-relaxed mb-16 text-[#7D6B5D]">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-[#F7D0D6] p-10 rounded-lg shadow-sm flex items-center justify-center aspect-video md:aspect-square">
          <h3 class="font-['Irish_Grover'] text-2xl text-[#CA4489] leading-tight">Certified<br>Teachers</h3>
        </div>
        <div class="bg-[#F0B87B] p-10 rounded-lg shadow-sm flex items-center justify-center aspect-video md:aspect-square">
          <h3 class="font-['Irish_Grover'] text-2xl text-[#7D4F2A] leading-tight">Nature-Inspired<br>Shala</h3>
        </div>
        <div class="bg-[#FFE39F] p-10 rounded-lg shadow-sm flex items-center justify-center aspect-video md:aspect-square">
          <h3 class="font-['Irish_Grover'] text-2xl text-[#B9922C] leading-tight">Various<br>Classes</h3>
        </div>
      </div>
    </section>

    <section class="relative h-[60vh] flex items-center justify-center text-white">
      <img src="/hero-bg-2.png" class="absolute inset-0 w-full h-full object-cover" alt="Yoga in Nature">
      <div class="relative z-10 text-center">
        <h2 class="text-5xl font-bold mb-4">Rest, release, renew.</h2>
        <p class="text-lg mb-6">Where soft bodies find calm</p>
        <button class="px-8 py-2 border-2 border-white rounded-full hover:bg-white hover:text-[#5D6D4E] transition">
          Join Membership
        </button>
      </div>
    </section>

    <section class="py-24 px-12 max-w-6xl mx-auto">
      <h2 class="font-['Irish_Grover'] text-4xl text-center mb-16">Our Location</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <!-- <div class="rounded-2xl overflow-hidden shadow-xl">
          <img src="/location-blur.jpg" class="w-full h-80 object-cover" alt="Location Aura">
        </div> -->
        <div class="text-[#7D6B5D] leading-relaxed">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>
      </div>
    </section>

    <footer class="bg-[#0A261F] text-[#8C9E7E] pt-20 pb-10 px-12">
      <div class="grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
        <div class="col-span-1 md:col-span-1">
          <h4 class="font-['Irish_Grover'] text-xl text-white mb-4">Willowstretch</h4>
          <p class="text-xs mb-4">+1-800-000-000</p>
          <div class="flex gap-2">
            <div class="w-6 h-6 bg-white/20 rounded-full"/>
            <div class="w-6 h-6 bg-white/20 rounded-full"/>
            <div class="w-6 h-6 bg-white/20 rounded-full"/>
          </div>
          <button class="mt-6 bg-black text-white px-6 py-2 rounded-full text-xs">Contact Us</button>
        </div>
        <div>
          <h5 class="text-white font-bold mb-4 text-sm">Product</h5>
          <ul class="text-xs space-y-2">
            <li>Landing Page</li>
            <li>Group Builder</li>
          </ul>
        </div>
        <div>
          <h5 class="text-white font-bold mb-4 text-sm">Resources</h5>
          <ul class="text-xs space-y-2">
            <li>Academy</li>
            <li>Blog</li>
          </ul>
        </div>
        <div>
          <h5 class="text-white font-bold mb-4 text-sm">Company</h5>
          <ul class="text-xs space-y-2">
            <li>About Us</li>
            <li>Careers</li>
          </ul>
        </div>
      </div>
      <div class="border-t border-white/10 pt-8 flex justify-between text-[10px] items-center">
        <p>© 2026 All rights reserved.</p>
        <div class="flex gap-4">
          <span>Privacy Policy</span>
          <span>Terms of Care</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Data meta tags untuk SEO peri kamu
useHead({
  title: 'Willowstretch - A Gentle Place to Return to Your Body',
})
</script>