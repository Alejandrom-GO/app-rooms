import { ref } from 'vue';

interface Toast {
  id: number;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

const toasts = ref<Toast[]>([]);
let toastId = 0;

export function useToast() {
  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = toastId++;
    toasts.value.push({ ...toast, id });
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: number) => {
    toasts.value = toasts.value.filter(t => t.id !== id);
  };

  const success = (message: string, title = 'Éxito') => {
    addToast({ type: 'success', title, message });
  };

  const error = (message: string, title = 'Error') => {
    addToast({ type: 'error', title, message });
  };

  const info = (message: string, title = 'Información') => {
    addToast({ type: 'info', title, message });
  };

  return {
    toasts,
    success,
    error,
    info,
    removeToast
  };
} 