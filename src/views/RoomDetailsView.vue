<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <div class="container mx-auto px-4 py-3 flex justify-between items-center">
        <div class="flex items-center">
          <router-link to="/rooms" class="mr-2">
            <chevron-left-icon class="h-6 w-6 text-gray-700" />
          </router-link>
          <h1 class="text-lg font-bold text-primary">Detalles de la Habitación</h1>
        </div>
        <div class="flex items-center space-x-3">
          <button @click="toggleFavorite">
            <heart-icon :class="['h-5 w-5', isFavorite ? 'text-red-500' : 'text-gray-700']" />
          </button>
          <button @click="shareRoom">
            <share-icon class="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </div>
    </header>

    <!-- Contenido Principal -->
    <main class="container mx-auto px-4 py-6">
      <!-- Estado de carga -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>

      <!-- Contenido cuando los datos están cargados -->
      <div v-else-if="room">
        <!-- Galería de Imágenes -->
        <div class="relative rounded-lg overflow-hidden mb-6">
          <img 
            :src="room.images[0]" 
            :alt="room.name"
            class="w-full h-64 object-cover"
          />
          <div class="absolute bottom-4 right-4 bg-white rounded-full p-2 shadow-md">
            <camera-icon class="h-5 w-5 text-gray-700" />
          </div>
        </div>

        <!-- Información Principal -->
        <div class="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <h2 class="text-2xl font-bold mb-2">{{ room.name }}</h2>
          <div class="flex items-center mb-4">
            <star-icon class="h-5 w-5 text-yellow-400 mr-1" />
            <span class="text-gray-600">{{ room.rating }} ({{ room.reviews }} reseñas)</span>
          </div>
          <p class="text-gray-600 mb-4">{{ room.description }}</p>
          
          <!-- Características -->
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="flex items-center">
              <bed-icon class="h-5 w-5 text-gray-600 mr-2" />
              <span>{{ room.bedType }}</span>
            </div>
            <div class="flex items-center">
              <users-icon class="h-5 w-5 text-gray-600 mr-2" />
              <span>{{ room.capacity }} personas</span>
            </div>
            <div class="flex items-center">
              <ruler-icon class="h-5 w-5 text-gray-600 mr-2" />
              <span>{{ room.size }}m²</span>
            </div>
            <div class="flex items-center">
              <wifi-icon class="h-5 w-5 text-gray-600 mr-2" />
              <span>WiFi gratis</span>
            </div>
          </div>

          <!-- Precio -->
          <div class="border-t border-gray-200 pt-4">
            <div class="flex justify-between items-center">
              <div>
                <span class="text-2xl font-bold text-primary">${{ room.price }}</span>
                <span class="text-gray-500">/noche</span>
              </div>
              <button 
                @click="bookRoom"
                class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
              >
                Reservar
              </button>
            </div>
          </div>
        </div>

        <!-- Servicios Incluidos -->
        <div class="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <h3 class="text-lg font-bold mb-4">Servicios Incluidos</h3>
          <div class="grid grid-cols-2 gap-4">
            <div v-for="service in room.services" :key="service" class="flex items-center">
              <check-circle-icon class="h-5 w-5 text-green-500 mr-2" />
              <span>{{ service }}</span>
            </div>
          </div>
        </div>

        <!-- Ubicación -->
        <div class="bg-white rounded-lg p-6 shadow-sm">
          <h3 class="text-lg font-bold mb-4">Ubicación</h3>
          <div class="h-48 bg-gray-200 rounded-lg mb-4">
            <!-- Aquí iría el mapa -->
          </div>
          <p class="text-gray-600">{{ room.location }}</p>
        </div>
      </div>

      <!-- Mensaje de error si no se encuentra la habitación -->
      <div v-else class="text-center py-12">
        <h2 class="text-xl font-bold text-gray-700 mb-2">Habitación no encontrada</h2>
        <p class="text-gray-500 mb-4">La habitación que buscas no existe o ha sido eliminada.</p>
        <router-link to="/rooms" class="text-primary hover:underline">
          Volver a la lista de habitaciones
        </router-link>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { 
  ChevronLeft as ChevronLeftIcon, 
  Heart as HeartIcon, 
  Share as ShareIcon, 
  Camera as CameraIcon,
  Star as StarIcon,
  Bed as BedIcon,
  Users as UsersIcon,
  Ruler as RulerIcon,
  Wifi as WifiIcon,
  CheckCircle as CheckCircleIcon
} from 'lucide-vue-next'

const route = useRoute()
const room = ref(null)
const isFavorite = ref(false)
const loading = ref(true)

// Función para cargar los datos de la habitación
const loadRoomData = async () => {
  loading.value = true;
  try {
    // Aquí deberías hacer la llamada a tu API o store
    // Por ahora usamos datos de ejemplo
    console.log('Cargando datos para habitación ID:', route.params.id);
    
    // Simulamos un retraso para mostrar el estado de carga
    await new Promise(resolve => setTimeout(resolve, 500));
    
    room.value = {
      id: route.params.id,
      name: 'Habitación Deluxe con Vista al Mar',
      rating: 4.8,
      reviews: 124,
      description: 'Hermosa habitación con vista panorámica al mar, decoración moderna y todas las comodidades necesarias para una estancia perfecta.',
      bedType: 'Cama King Size',
      capacity: 2,
      size: 35,
      price: 150,
      services: [
        'Desayuno incluido',
        'Servicio de limpieza diario',
        'TV Smart 55"',
        'Minibar',
        'Aire acondicionado',
        'Caja fuerte',
        'Secador de pelo',
        'Productos de baño'
      ],
      location: 'Av. del Mar 123, Playa del Carmen',
      images: ['/images/placeholder.svg?height=200&width=300']
    }
    console.log('Datos cargados:', room.value);
  } catch (error) {
    console.error('Error al cargar los datos de la habitación:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadRoomData();
});

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value;
}

const shareRoom = () => {
  // Implementar lógica de compartir
}

const bookRoom = () => {
  // Implementar lógica de reserva
}
</script>

<style scoped>
.animate-slide-in-right {
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
</style> 