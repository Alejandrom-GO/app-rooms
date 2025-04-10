<template>
  <div class="min-h-screen bg-background text-foreground">


    <!-- Main Content -->
    <main class="container">
      <!-- <Card class="p-6">
        <div class="space-y-4">
          <h2 class="text-2xl font-bold">Buscar Habitaciones</h2>
          <div class="flex gap-4">
            <Input placeholder="Buscar por ubicación..." class="flex-1" />
            <Button>Buscar</Button>
          </div>
        </div>
      </Card> -->
      <router-view></router-view>
    </main>



    <Toaster />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onBeforeRouteUpdate } from 'vue-router';
import { Toaster } from './components/ui/toast';

const isMenuOpen = ref(false);

const closeMenu = () => {
  isMenuOpen.value = false;
};

// Cerrar el menú cuando se cambie de ruta
onBeforeRouteUpdate(() => {
  closeMenu();
});
</script>

<style>
:root {
  --color-primary: #FF5A5F;
  --color-primary-dark: #FF2D35;
}

.text-primary {
  color: var(--color-primary);
}

.bg-primary {
  background-color: var(--color-primary);
}

.hover\:bg-primary-dark:hover {
  background-color: var(--color-primary-dark);
}

.focus\:ring-primary:focus {
  --tw-ring-color: var(--color-primary);
}

.router-link-active {
  color: var(--color-primary);
  font-weight: 500;
}
</style>