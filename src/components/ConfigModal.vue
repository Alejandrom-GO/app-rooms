<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">Configuración</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="space-y-6">
        <!-- Selector de entorno -->
        <div>
          <h3 class="text-sm font-semibold mb-2">Entorno</h3>
          <div class="space-y-2">
            <button
              v-for="env in environments"
              :key="env"
              @click="changeEnvironment(env)"
              :class="[
                'px-3 py-1 rounded-md text-sm w-full text-left',
                currentEnv === env
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              ]"
            >
              {{ env.toUpperCase() }}
            </button>
          </div>
        </div>
        
        <!-- Aquí puedes añadir más secciones de configuración en el futuro -->
      </div>
      
      <div class="mt-6 flex justify-end">
        <button @click="closeModal" class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getEnvironment, setEnvironment, type Environment } from '../config/environment';

const isOpen = ref(false);
const environments: Environment[] = ['local', 'dev', 'pro'];
const currentEnv = ref<Environment>('local');

onMounted(() => {
  currentEnv.value = getEnvironment();
});

const changeEnvironment = (env: Environment) => {
  setEnvironment(env);
  currentEnv.value = env;
  // Recargar la página para aplicar los cambios
  window.location.reload();
};

const closeModal = () => {
  isOpen.value = false;
};

// Exponer métodos para abrir el modal desde fuera
defineExpose({
  openModal: () => {
    isOpen.value = true;
  }
});
</script> 