<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-background border-t z-50">
    <div class="container flex justify-around items-center h-16 px-4">
      <router-link 
        v-for="item in navigationItems" 
        :key="item.path" 
        :to="item.path"
        class="flex flex-col items-center justify-center w-16 h-16"
        :class="{ 'text-primary': isCurrentRoute(item.path) }"
      >
        <component :is="item.icon" class="h-6 w-6" />
        <span class="text-xs mt-1">{{ item.name }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { 
  Home as HomeIcon, 
  Search as SearchIcon, 
  Heart as HeartIcon, 
  User as UserIcon 
} from 'lucide-vue-next';

const route = useRoute();

const navigationItems = [
  { name: 'Inicio', path: '/', icon: HomeIcon },
  { name: 'Habitaciones', path: '/rooms', icon: SearchIcon },
  { name: 'Favoritos', path: '/favorites', icon: HeartIcon },
  { name: 'Cuenta', path: '/account', icon: UserIcon }
];

const isCurrentRoute = (path: string) => {
  return route.path === path || route.path.startsWith(`${path}/`);
};
</script> 