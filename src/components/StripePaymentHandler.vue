<template>
  <div v-if="showStatus" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <div class="text-center">
        <div v-if="loading" class="mb-4">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p class="mt-2 text-gray-600">Procesando pago...</p>
        </div>
        <div v-else-if="success" class="mb-4">
          <div class="bg-green-100 rounded-full h-12 w-12 flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p class="mt-2 text-green-600 font-medium">¡Pago exitoso!</p>
        </div>
        <div v-else class="mb-4">
          <div class="bg-red-100 rounded-full h-12 w-12 flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p class="mt-2 text-red-600 font-medium">Error en esl pago</p>
        </div>
        <p class="text-gray-600 mb-4">{{ statusMessage }}</p>
        <button 
          @click="closeHandler" 
          class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          {{ success ? 'Continuar' : 'Cerrar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const props = defineProps<{
  stripeUrl: string;
  roomId: string;
  sessionId: string;
}>();

const router = useRouter();
const stripeWindow = ref<Window | null>(null);
const showStatus = ref(false);
const loading = ref(true);
const success = ref(false);
const statusMessage = ref('');
const verificationAttempts = ref(0);
const maxVerificationAttempts = 10;

// Función para abrir la ventana de Stripe
const openStripeWindow = () => {
  try {
    // Abrir la ventana de Stripe
    stripeWindow.value = window.open(props.stripeUrl, 'StripeCheckout', 'width=800,height=800');
    
    if (!stripeWindow.value) {
      throw new Error('No se pudo abrir la ventana de pago. Es posible que el navegador esté bloqueando las ventanas emergentes.');
    }
    
    // Mostrar el estado de carga
    showStatus.value = true;
    loading.value = true;
    success.value = false;
    statusMessage.value = 'Procesando tu pago...';
    
    // Configurar el temporizador para verificar si la ventana se cierra
    const checkWindowClosed = setInterval(() => {
      if (stripeWindow.value && stripeWindow.value.closed) {
        clearInterval(checkWindowClosed);
        // La ventana se cerró, verificar el estado del pago
        checkPaymentStatus();
      }
    }, 1000);
    
    // Limpiar el temporizador cuando el componente se desmonte
    onUnmounted(() => {
      clearInterval(checkWindowClosed);
    });
  } catch (error) {
    console.error('Error al abrir la ventana de pago:', error);
    showStatus.value = true;
    loading.value = false;
    success.value = false;
    statusMessage.value = 'No se pudo abrir la ventana de pago. Por favor, verifica la configuración de tu navegador para permitir ventanas emergentes.';
  }
};

// Función para verificar el estado del pago
const checkPaymentStatus = async () => {
  try {
    // Verificar el estado del pago con la API
    const response = await api.get(`/payments/verify-payment/${props.sessionId}`);
    
    if (response.data.success) {
      // Pago exitoso
      loading.value = false;
      success.value = true;
      statusMessage.value = 'Tu pago ha sido procesado correctamente.';
      
      // Redirigir a la vista de PaymentHandlerView
      router.push(`/payment-handler/${props.sessionId}`);
    } else {
      // Si el pago aún no está confirmado y no hemos excedido el número máximo de intentos
      if (verificationAttempts.value < maxVerificationAttempts) {
        verificationAttempts.value++;
        // Intentar nuevamente después de un breve retraso
        setTimeout(checkPaymentStatus, 2000);
      } else {
        // Hemos excedido el número máximo de intentos
        loading.value = false;
        success.value = false;
        statusMessage.value = 'No se pudo confirmar el estado del pago. Por favor, contacta a soporte.';
        
        // Redirigir a la vista de PaymentHandlerView
        router.push(`/payment-handler/${props.sessionId}`);
      }
    }
  } catch (error: any) {
    console.error('Error al verificar el estado del pago:', error);
    
    // Si el error es 404 (no encontrado) y no hemos excedido el número máximo de intentos
    if (error.response && error.response.status === 404 && verificationAttempts.value < maxVerificationAttempts) {
      verificationAttempts.value++;
      // Intentar nuevamente después de un breve retraso
      setTimeout(checkPaymentStatus, 2000);
    } else {
      loading.value = false;
      success.value = false;
      statusMessage.value = 'Hubo un error al procesar tu pago. Por favor, intenta nuevamente.';
      
      // Redirigir a la vista de PaymentHandlerView
      router.push(`/payment-handler/${props.sessionId}`);
    }
  }
};

// Función para cerrar el manejador
const closeHandler = () => {
  showStatus.value = false;
  
  if (success.value) {
    // Redirigir a la página de éxito
    router.push(`/payment-success`);
  }
};

// Escuchar mensajes de la ventana de Stripe
const handleMessage = (event: MessageEvent) => {
  // Verificar el origen del mensaje para seguridad
  if (event.origin !== window.location.origin) return;
  
  // Verificar si el mensaje es de la ventana de Stripe
  if (event.data && event.data.type === 'stripe-payment-success') {
    // Verificar el estado del pago con la API
    checkPaymentStatus();
    
    // Cerrar la ventana de Stripe si está abierta
    if (stripeWindow.value && !stripeWindow.value.closed) {
      stripeWindow.value.close();
    }
  } else if (event.data && event.data.type === 'stripe-payment-error') {
    loading.value = false;
    success.value = false;
    statusMessage.value = event.data.message || 'Hubo un error al procesar tu pago. Por favor, intenta nuevamente.';
    
    // Cerrar la ventana de Stripe si está abierta
    if (stripeWindow.value && !stripeWindow.value.closed) {
      stripeWindow.value.close();
    }
  }
};

// Configurar el event listener para mensajes
onMounted(() => {
  window.addEventListener('message', handleMessage);
  openStripeWindow();
});

// Limpiar el event listener cuando el componente se desmonte
onUnmounted(() => {
  window.removeEventListener('message', handleMessage);
  
  // Cerrar la ventana de Stripe si está abierta
  if (stripeWindow.value && !stripeWindow.value.closed) {
    stripeWindow.value.close();
  }
});
</script> 