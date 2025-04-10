<template>
  <div class="bg-background min-h-screen flex flex-col">
    <!-- Header -->
    <header class="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="container flex h-14 items-center justify-between px-4 py-3">
        <div class="flex items-center">
          <h1 class="text-lg font-medium">Pago Exitoso</h1>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 container mx-auto px-4 py-6 md:py-8">
      <div class="flex flex-col items-center justify-center h-[calc(100vh-8rem)]">
        <div class="text-center space-y-6">
          <div class="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircleIcon class="h-10 w-10 text-green-500" />
          </div>
          <h2 class="text-2xl font-semibold">¡Pago Completado!</h2>
          <p class="text-muted-foreground max-w-md">
            Tu pago ha sido procesado exitosamente. Recibirás un correo electrónico con los detalles de tu reserva.
          </p>
          <Button @click="goToHome" class="mt-4">
            <HomeIcon class="h-5 w-5 mr-2" />
            Volver al inicio
          </Button>
        </div>
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
import { useRouter } from 'vue-router';
import { CheckCircle as CheckCircleIcon, Home as HomeIcon } from 'lucide-vue-next';
import { Button } from '@/components/ui';

const router = useRouter();

const goToHome = () => {
  router.push('/');
};
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
.text-muted-foreground {
  color: hsl(var(--muted-foreground));
}
</style> 