<template>
  <div class="bg-background min-h-screen flex flex-col">
    <!-- Header -->
    <header class="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="container flex h-14 items-center px-4 py-3">
        <div class="flex items-center">
          <a href="/" class="text-xl font-bold text-primary">RoomRent</a>
        </div>
      </div>
    </header>

    <!-- Content -->
    <div class="flex-1">
      <slot />
    </div>

    <!-- Footer -->
    <footer class="border-t py-4 bg-background">
      <div class="container flex flex-col items-center justify-center gap-2 text-center">
        <p class="text-sm text-muted-foreground">
          © 2025 RoomRent. Todos los derechos reservados.
        </p>
        <div class="flex gap-4 text-sm text-muted-foreground">
          <a href="#" class="hover:underline">Términos</a>
          <a href="#" class="hover:underline">Privacidad</a>
          <a href="#" class="hover:underline">Contacto</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// No necesitamos lógica adicional aquí
</script> 