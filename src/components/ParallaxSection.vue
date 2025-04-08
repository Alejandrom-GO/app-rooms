<template>
  <div class="parallax-container relative overflow-hidden h-[500px]">
    <div 
      class="parallax-layer absolute inset-0 bg-cover bg-center"
      :style="{ 
        backgroundImage: `url(${backgroundImage})`,
        transform: `translateY(${scrollY * 0.5}px)`
      }"
    ></div>
    <div 
      class="parallax-content absolute inset-0 flex flex-col items-center justify-center text-white z-10"
      :style="{ transform: `translateY(${scrollY * 0.2}px)` }"
    >
      <h2 class="text-4xl font-bold mb-4">{{ title }}</h2>
      <p class="text-xl max-w-2xl text-center">{{ description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  backgroundImage: string;
  title: string;
  description: string;
}>();

const scrollY = ref(0);

const handleScroll = () => {
  scrollY.value = window.scrollY;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.parallax-container {
  perspective: 1px;
  transform-style: preserve-3d;
}

.parallax-layer {
  will-change: transform;
}

.parallax-content {
  will-change: transform;
}
</style> 