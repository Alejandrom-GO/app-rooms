<template>
  <Teleport to="body">
    <TransitionGroup
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5"
      >
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <CheckCircleIcon
                v-if="toast.type === 'success'"
                class="h-6 w-6 text-green-400"
              />
              <XCircleIcon
                v-else-if="toast.type === 'error'"
                class="h-6 w-6 text-red-400"
              />
              <InfoIcon
                v-else
                class="h-6 w-6 text-blue-400"
              />
            </div>
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p class="text-sm font-medium text-gray-900">
                {{ toast.title }}
              </p>
              <p class="mt-1 text-sm text-gray-500">
                {{ toast.message }}
              </p>
            </div>
            <div class="ml-4 flex flex-shrink-0">
              <button
                type="button"
                class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                @click="removeToast(toast.id)"
              >
                <span class="sr-only">Cerrar</span>
                <XMarkIcon class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { CheckCircle as CheckCircleIcon, XCircle as XCircleIcon, InformationCircle as InfoIcon, XMark as XMarkIcon } from 'lucide-vue-next';

interface Toast {
  id: number;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

const toasts = ref<Toast[]>([]);
let toastId = 0;

const addToast = (toast: Omit<Toast, 'id'>) => {
  const id = toastId++;
  toasts.value.push({ ...toast, id });
  setTimeout(() => removeToast(id), 5000);
};

const removeToast = (id: number) => {
  toasts.value = toasts.value.filter(t => t.id !== id);
};

// Exponer la función addToast para que pueda ser usada desde otros componentes
defineExpose({ addToast });
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 50;
}
</style> 