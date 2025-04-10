<template>
  <div class="bg-background min-h-screen flex flex-col">
    <!-- Header -->
    <header class="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="container flex h-14 items-center justify-between px-4 py-3">
        <div class="flex items-center">
          <Button variant="ghost" size="icon" @click="goBack" class="mr-2">
            <ChevronLeftIcon class="h-5 w-5" />
          </Button>
          <h1 class="text-lg font-medium">Proceso de pago</h1>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 container mx-auto px-4 py-6 md:py-8">
      <div v-if="loading" class="flex justify-center items-center h-64">
        <Loader2Icon class="h-8 w-8 animate-spin text-primary" />
        <span class="ml-2">Cargando página de pago...</span>
      </div>
      
      <div v-else-if="error" class="flex flex-col items-center justify-center h-64">
        <div class="text-destructive text-lg mb-2">Error al cargar la página de pago</div>
        <p class="text-muted-foreground mb-4">{{ error }}</p>
        <Button @click="loadPaymentPage">Intentar de nuevo</Button>
      </div>
      
      <div v-else class="h-[calc(100vh-8rem)]">
        <iframe 
          v-if="paymentUrl" 
          :src="paymentUrl" 
          class="w-full h-full border-0 rounded-lg shadow-md"
          allow="payment"
        ></iframe>
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t py-4 bg-background">
      <div class="container flex flex-col items-center justify-center gap-2 text-center">
        <p class="text-sm text-muted-foreground">
          © 2025 RoomRent. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { 
  ChevronLeft as ChevronLeftIcon,
  Loader2 as Loader2Icon
} from 'lucide-vue-next';

// Importación de componentes shadcn-vue
import { 
  Button
} from '@/components/ui';

// Estado
const loading = ref(true);
const error = ref(null);
const paymentUrl = ref(null);

const route = useRoute();
const router = useRouter();

// Función para cargar la página de pago
const loadPaymentPage = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // Obtener la URL de pago de los parámetros de la ruta
    const url = route.query.url;
    
    if (!url) {
      throw new Error('No se proporcionó una URL de pago');
    }
    
    // Verificar que la URL sea de Stripe
    if (!url.includes('stripe.com')) {
      throw new Error('URL de pago inválida');
    }
    
    paymentUrl.value = url;

    // Escuchar mensajes del iframe de Stripe
    window.addEventListener('message', (event) => {
      // Verificar que el mensaje sea de Stripe
      if (event.origin.includes('stripe.com')) {
        // Si el pago fue exitoso, redirigir a la vista de éxito
        if (event.data.type === 'payment_success') {
          router.push('/payment/success');
        }
      }
    });
  } catch (err) {
    console.error('Error al cargar la página de pago:', err);
    error.value = err.message || 'Error al cargar la página de pago';
  } finally {
    loading.value = false;
  }
};

// Métodos
const goBack = () => {
  router.back();
};

// Cargar datos al montar el componente
onMounted(() => {
  loadPaymentPage();
});
</script>

<style>
:root {
  /* Colores del tema shadcn */
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 240 10% 3.9%;
  --primary: 346 100% 67%;
  --primary-foreground: 355.7 100% 97.3%;
  --secondary: 240 4.8% 95.9%;
  --secondary-foreground: 240 5.9% 10%;
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  --accent: 240 4.8% 95.9%;
  --accent-foreground: 240 5.9% 10%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 5.9% 90%;
  --input: 240 5.9% 90%;
  --ring: 346 100% 67%;
  --radius: 0.5rem;
}

.dark {
  --background: 20 14.3% 4.1%;
  --foreground: 0 0% 95%;
  --card: 24 9.8% 10%;
  --card-foreground: 0 0% 95%;
  --popover: 0 0% 9%;
  --popover-foreground: 0 0% 95%;
  --primary: 346 100% 67%;
  --primary-foreground: 355.7 100% 97.3%;
  --secondary: 240 3.7% 15.9%;
  --secondary-foreground: 0 0% 98%;
  --muted: 0 0% 15%;
  --muted-foreground: 240 5% 64.9%;
  --accent: 12 6.5% 15.1%;
  --accent-foreground: 0 0% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 0 85.7% 97.3%;
  --border: 240 3.7% 15.9%;
  --input: 240 3.7% 15.9%;
  --ring: 346 100% 67%;
}

/* Utilidades para convertir variables CSS a colores */
.bg-background {
  background-color: hsl(var(--background));
}
.text-primary {
  color: hsl(var(--primary));
}
.text-muted-foreground {
  color: hsl(var(--muted-foreground));
}
.text-destructive {
  color: hsl(var(--destructive));
}
</style> 