<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-primary text-white py-6 px-4">
      <div class="container mx-auto">
        <h2 class="text-2xl font-bold mb-4">Encuentra tu habitación ideal</h2>
        <p class="mb-6">Habitaciones cómodas y accesibles para rentar</p>
        
        <!-- Search Bar -->
        <div class="bg-white rounded-lg shadow-md p-4 mb-4">
          <div class="flex flex-col space-y-4">
            <div>
              <label class="block text-gray-700 text-sm font-medium mb-1">Ubicación</label>
              <div class="relative">
                <map-pin-icon class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input 
                  type="text" 
                  placeholder="¿Dónde buscas?" 
                  class="pl-10 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label class="block text-gray-700 text-sm font-medium mb-1">Fechas</label>
              <div class="relative">
                <calendar-icon class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input 
                  type="text" 
                  placeholder="Fecha de entrada - Fecha de salida" 
                  class="pl-10 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            
            <button class="bg-primary text-white py-2 px-4 rounded-md font-medium hover:bg-primary-dark transition-colors">
              Buscar
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Filters -->
    <section class="py-4 px-4 overflow-x-auto">
      <div class="flex space-x-2 whitespace-nowrap">
        <button class="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-100">
          Todos
        </button>
        <button class="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-100">
          Individuales
        </button>
        <button class="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-100">
          Compartidas
        </button>
        <button class="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-100">
          Amuebladas
        </button>
        <button class="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-100">
          Con baño
        </button>
      </div>
    </section>

    <!-- Featured Rooms -->
    <section class="py-6 px-4">
      <div class="container mx-auto">
        <h2 class="text-xl font-bold mb-4">Habitaciones destacadas</h2>
        
        <div class="grid grid-cols-1 gap-4">
          <!-- Room Cards -->
          <div 
            class="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
            @click="viewRoomDetails(1)"
          >
            <div class="relative pb-[60%]">
              <img 
                src="/images/placeholder.svg?height=200&width=300" 
                alt="Habitación individual" 
                class="absolute h-full w-full object-cover"
              />
              <div class="absolute top-2 right-2 bg-white p-1 rounded-full">
                <heart-icon class="h-5 w-5 text-gray-500" />
              </div>
            </div>
            <div class="p-4">
              <div class="flex justify-between items-start">
                <h3 class="font-bold">Habitación Individual</h3>
                <span class="font-bold text-primary">$350/mes</span>
              </div>
              <p class="text-gray-600 text-sm mt-1">Centro de la ciudad</p>
              <div class="flex items-center mt-2 text-sm text-gray-600">
                <map-pin-icon class="h-4 w-4 mr-1" />
                <span>A 10 min del metro</span>
              </div>
              <div class="flex flex-wrap gap-2 mt-3">
                <span class="bg-gray-100 text-xs px-2 py-1 rounded-md">Wifi</span>
                <span class="bg-gray-100 text-xs px-2 py-1 rounded-md">Amueblada</span>
                <span class="bg-gray-100 text-xs px-2 py-1 rounded-md">Cocina</span>
              </div>
            </div>
          </div>
          
          <!-- More room cards... -->
        </div>
      </div>
    </section>

    <!-- Demos Section -->
    <section class="py-6 px-4 bg-gray-50">
      <div class="container mx-auto">
        <h2 class="text-xl font-bold mb-4">Demos Interactivas</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Parallax Demo Card -->
          <router-link to="/parallax-demo" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div class="relative pb-[60%]">
              <img 
                src="/images/placeholder.svg?height=200&width=300" 
                alt="Demo Parallax" 
                class="absolute h-full w-full object-cover"
              />
            </div>
            <div class="p-4">
              <h3 class="font-bold text-lg">Efecto Parallax</h3>
              <p class="text-gray-600 text-sm mt-1">Explora nuestro efecto de parallax interactivo</p>
            </div>
          </router-link>
          
          <!-- Three.js Demo Card -->
          <router-link to="/three-demo" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div class="relative pb-[60%]">
              <img 
                src="/images/placeholder.svg?height=200&width=300" 
                alt="Demo Three.js" 
                class="absolute h-full w-full object-cover"
              />
            </div>
            <div class="p-4">
              <h3 class="font-bold text-lg">Three.js 3D</h3>
              <p class="text-gray-600 text-sm mt-1">Explora nuestra demo 3D con Three.js</p>
            </div>
          </router-link>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { 
  MapPin as MapPinIcon, 
  Calendar as CalendarIcon,
  Heart as HeartIcon,
  Home as HomeIcon,
  Search as SearchIcon,
  User as UserIcon,
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();

// Función para navegar a los detalles de la habitación
function viewRoomDetails(roomId) {
  console.log('Intentando navegar a detalles de habitación:', roomId);
  try {
    router.push(`/rooms/${roomId}`);
    console.log('Navegación exitosa');
  } catch (error) {
    console.error('Error al navegar:', error);
  }
}

// Función para cerrar todos los menús
function closeAllMenus() {
  // Esta función se puede expandir si se agregan más menús en el futuro
  // Por ahora, no hay menús que cerrar en la página de inicio
}
</script> 