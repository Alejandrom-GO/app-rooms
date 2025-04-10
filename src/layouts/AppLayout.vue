<template>
  <div class="bg-background min-h-screen">
    <Navigation v-if="isAuthenticated" />
    <main :class="{ 'pb-16': isAuthenticated }">
      <slot />
    </main>
    <BottomNavigation v-if="isAuthenticated" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Navigation from '../components/Navigation.vue';
import BottomNavigation from '../components/BottomNavigation.vue';
import authService from '../services/auth.service';

const isAuthenticated = computed(() => {
  return authService.isAuthenticated();
});
</script> 