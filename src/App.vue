<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header class="sticky top-0 z-10 border-b bg-background">
      <div class="container mx-auto px-4 py-3 flex justify-between items-center">
        <div class="flex items-center">
          <h1 class="text-xl font-bold text-primary">RoomRent</h1>
        </div>
        <nav>
          <Button variant="ghost" size="icon" @click="isMenuOpen = !isMenuOpen">
            <MenuIcon v-if="!isMenuOpen" class="h-6 w-6" />
            <XIcon v-else class="h-6 w-6" />
          </Button>
        </nav>
      </div>
      <!-- Mobile Menu -->
      <div v-if="isMenuOpen" class="container mx-auto px-4 py-3 bg-background border-t">
        <div class="flex flex-col space-y-3">
          <router-link to="/" @click="closeMenu" class="text-foreground hover:text-primary">Inicio</router-link>
          <router-link to="/rooms" @click="closeMenu" class="text-foreground hover:text-primary">Habitaciones</router-link>
          <router-link to="/favorites" @click="closeMenu" class="text-foreground hover:text-primary">Favoritos</router-link>
          <router-link to="/account" @click="closeMenu" class="text-foreground hover:text-primary">Mi Cuenta</router-link>
          <router-link to="/parallax-demo" @click="closeMenu" class="text-foreground hover:text-primary">Parallax</router-link>
          <router-link to="/three-demo" @click="closeMenu" class="text-foreground hover:text-primary">Three.js Demo</router-link>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-6">
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

    <!-- Footer -->
    <footer class="bg-muted text-muted-foreground py-6 px-4 mt-6">
      <div class="container mx-auto">
        <div class="grid grid-cols-1 gap-6">
          <div>
            <h3 class="text-lg font-bold mb-3">RoomRent</h3>
            <p class="text-sm">
              La mejor plataforma para encontrar habitaciones en renta.
            </p>
          </div>
          
          <div>
            <h4 class="font-medium mb-3">Enlaces rápidos</h4>
            <ul class="space-y-2 text-sm">
              <li><router-link to="/" @click="closeMenu" class="hover:text-foreground">Inicio</router-link></li>
              <li><router-link to="/rooms" @click="closeMenu" class="hover:text-foreground">Habitaciones</router-link></li>
              <li><router-link to="/favorites" @click="closeMenu" class="hover:text-foreground">Favoritos</router-link></li>
              <li><router-link to="/account" @click="closeMenu" class="hover:text-foreground">Mi Cuenta</router-link></li>
            </ul>
          </div>
          
          <div>
            <h4 class="font-medium mb-3">Contacto</h4>
            <div class="space-y-2 text-sm">
              <div class="flex items-center">
                <MailIcon class="h-4 w-4 mr-2" />
                <span>info@roomrent.com</span>
              </div>
              <div class="flex items-center">
                <PhoneIcon class="h-4 w-4 mr-2" />
                <span>+123 456 7890</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-6 pt-6 border-t border-border text-center text-sm">
          <p>© 2025 RoomRent. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>

    <!-- Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-background border-t border-border py-2 px-4 z-50">
      <div class="flex justify-around">
        <router-link 
          to="/" 
          class="flex flex-col items-center text-xs"
          :class="{ 'text-primary': $route.path === '/' }"
          @click="closeMenu"
        >
          <HomeIcon class="h-6 w-6" :class="{ 'text-primary': $route.path === '/', 'text-muted-foreground': $route.path !== '/' }" />
          <span class="mt-1" :class="{ 'text-primary font-medium': $route.path === '/', 'text-muted-foreground': $route.path !== '/' }">Inicio</span>
        </router-link>
        <router-link 
          to="/rooms" 
          class="flex flex-col items-center text-xs"
          :class="{ 'text-primary': $route.path === '/rooms' }"
          @click="closeMenu"
        >
          <SearchIcon class="h-6 w-6" :class="{ 'text-primary': $route.path === '/rooms', 'text-muted-foreground': $route.path !== '/rooms' }" />
          <span class="mt-1" :class="{ 'text-primary font-medium': $route.path === '/rooms', 'text-muted-foreground': $route.path !== '/rooms' }">Buscar</span>
        </router-link>
        <router-link 
          to="/favorites" 
          class="flex flex-col items-center text-xs"
          :class="{ 'text-primary': $route.path === '/favorites' }"
          @click="closeMenu"
        >
          <HeartIcon class="h-6 w-6" :class="{ 'text-primary': $route.path === '/favorites', 'text-muted-foreground': $route.path !== '/favorites' }" />
          <span class="mt-1" :class="{ 'text-primary font-medium': $route.path === '/favorites', 'text-muted-foreground': $route.path !== '/favorites' }">Favoritos</span>
        </router-link>
        <router-link 
          to="/account" 
          class="flex flex-col items-center text-xs"
          :class="{ 'text-primary': $route.path === '/account' }"
          @click="closeMenu"
        >
          <UserIcon class="h-6 w-6" :class="{ 'text-primary': $route.path === '/account', 'text-muted-foreground': $route.path !== '/account' }" />
          <span class="mt-1" :class="{ 'text-primary font-medium': $route.path === '/account', 'text-muted-foreground': $route.path !== '/account' }">Perfil</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { onBeforeRouteUpdate } from 'vue-router';
import { 
  Search as SearchIcon,
  X as XIcon,
  Heart as HeartIcon,
  Home as HomeIcon,
  User as UserIcon,
  Menu as MenuIcon, 
  Mail as MailIcon,
  Phone as PhoneIcon
} from 'lucide-vue-next';
import Button from './components/ui/button/Button.vue';
import Card from './components/ui/card/Card.vue';
import Input from './components/ui/input/Input.vue';

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