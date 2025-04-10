<template>
  <div>
  <nav class="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="container flex h-14 items-center px-4 py-3">
      <div class="flex items-center mr-6">
        <router-link to="/" class="text-xl font-bold text-primary">RoomRent</router-link>
      </div>
      

      
      <div class="ml-auto flex items-center space-x-4">
        <div class="relative">
          <button @click="showSettings= !showSettings">
            <settings-icon class="h-5 w-5 text-gray-700" />
          </button>
          

        </div>
      </div>
    </div>
  </nav>

      <!-- Settings Modal -->
      <div 
      v-if="showSettings" 
      class="fixed inset-0 bg-black bg-opacity-50 z-30 flex items-center justify-center p-4"
      @click.self="showSettings = false"
    >
      <div class="bg-white rounded-lg w-full max-w-md p-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-bold text-lg">Configuración</h3>
          <button @click="showSettings = false">
            <x-icon class="h-5 w-5 text-gray-700" />
          </button>
        </div>
        
        <div class="space-y-4">
          <!-- Selector de entorno -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <server-icon class="h-5 w-5 text-gray-500 mr-3" />
              <span>Entorno</span>
            </div>
            <div class="flex items-center space-x-2">
              <button
                v-for="env in environments"
                :key="env"
                @click="changeEnvironment(env)"
                :class="[
                  'px-2 py-1 rounded-md text-xs',
                  currentEnv === env
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                ]"
              >
                {{ env.toUpperCase() }}
              </button>
            </div>
          </div>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <moon-icon class="h-5 w-5 text-gray-500 mr-3" />
              <span>Modo oscuro</span>
            </div>
            <div class="flex items-center space-x-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <globe-icon class="h-5 w-5 text-gray-500 mr-3" />
              <span>Idioma</span>
            </div>
            <select class="border border-gray-300 rounded-md py-1 px-2 text-sm">
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <dollar-sign-icon class="h-5 w-5 text-gray-500 mr-3" />
              <span>Moneda</span>
            </div>
            <select class="border border-gray-300 rounded-md py-1 px-2 text-sm">
              <option value="mxn">MXN</option>
              <option value="usd">USD</option>
              <option value="eur">EUR</option>
            </select>
          </div>
        </div>
        
        <div class="mt-6 pt-4 border-t border-gray-200">
          <div class="text-sm text-gray-500 mb-2">Acerca de</div>
          <div class="space-y-2">
            <button class="w-full text-left text-sm py-1">Términos y condiciones</button>
            <button class="w-full text-left text-sm py-1">Política de privacidad</button>
            <button class="w-full text-left text-sm py-1">Versión 1.0.0</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
  Settings as SettingsIcon,
  Camera as CameraIcon,
  MapPin as MapPinIcon,
  CreditCard as CreditCardIcon,
  MoreVertical as MoreVerticalIcon,
  Calendar as CalendarIcon,
  Bell as BellIcon,
  Lock as LockIcon,
  Shield as ShieldIcon,
  HelpCircle as HelpCircleIcon,
  ChevronRight as ChevronRightIcon,
  X as XIcon,
  Home as HomeIcon,
  Search as SearchIcon,
  Heart as HeartIcon,
  User as UserIcon,
  Moon as MoonIcon,
  Globe as GlobeIcon,
  DollarSign as DollarSignIcon,
  ChevronLeft as ChevronLeftIcon,
  Server as ServerIcon,
  Menu as MenuIcon,
  LogOut as LogOutIcon
} from 'lucide-vue-next';
import { Button } from './ui/button';
import ThemeToggle from './ThemeToggle.vue';
import LanguageToggle from './LanguageToggle.vue';
import { getEnvironment, setEnvironment, type Environment } from '../config/environment';

const router = useRouter();
const route = useRoute();
const showSettings = ref(false);
const environments: Environment[] = ['local', 'dev', 'pro'];
const currentEnv = ref<Environment>('local');

const navigationItems = [
  { name: 'Inicio', href: '/', icon: HomeIcon },
  { name: 'Buscar', href: '/search', icon: SearchIcon },
  { name: 'Favoritos', href: '/favorites', icon: HeartIcon },
  { name: 'Perfil', href: '/profile', icon: UserIcon }
];

const isCurrentRoute = (path: string) => {
  return router.currentRoute.value.path === path;
};

const toggleUserMenu = () => {
  // Implementación del menú de usuario
};

// Cerrar el menú al hacer clic fuera de él
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.relative')) {
    showSettings.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  currentEnv.value = getEnvironment();
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const changeEnvironment = (env: Environment) => {
  setEnvironment(env);
  currentEnv.value = env;
  // Recargar la página para aplicar los cambios
  window.location.reload();
};
</script> 