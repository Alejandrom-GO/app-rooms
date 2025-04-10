<template>
<AppLayout>
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
          <div class="relative pb-[60%]">
            <img 
              :src="currentImage" 
              :alt="room.name"
              class="absolute h-full w-full object-cover"
            />
            <!-- Botones de navegación -->
            <button 
              v-if="room.images.length > 1"
              @click="previousImage" 
              class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors"
            >
              <chevron-left-icon class="h-6 w-6 text-gray-700" />
            </button>
            <button 
              v-if="room.images.length > 1"
              @click="nextImage" 
              class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors"
            >
              <chevron-right-icon class="h-6 w-6 text-gray-700" />
            </button>
            <!-- Contador de imágenes -->
            <div v-if="room.images.length > 1" class="absolute bottom-4 right-4 bg-white/80 rounded-full px-3 py-1 text-sm font-medium">
              {{ currentImageIndex + 1 }} / {{ room.images.length }}
            </div>
          </div>
          <!-- Miniaturas de imágenes -->
          <div v-if="room.images.length > 1" class="flex space-x-2 mt-2 overflow-x-auto pb-2">
            <button 
              v-for="(image, index) in room.images" 
              :key="index"
              @click="currentImageIndex = index"
              class="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden"
              :class="{ 'ring-2 ring-primary': currentImageIndex === index }"
            >
              <img 
                :src="image" 
                :alt="`${room.name} - imagen ${index + 1}`"
                class="w-full h-full object-cover"
              />
            </button>
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
          <div v-if="room_amenities && room_amenities.length > 0" class="grid grid-cols-2 gap-4">
            <div v-for="amenity in room_amenities" :key="amenity.amenities.id" class="flex items-center">
              <component 
                :is="getAmenityIcon(amenity.amenities.icon)" 
                class="h-5 w-5 text-green-500 mr-2" 
              />
              <span>{{ amenity.amenities.name }}</span>
            </div>
          </div>
          <div v-else class="text-gray-500 text-center py-4">
            No hay servicios disponibles
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
</AppLayout>
</template>

<script setup>
import AppLayout from '../layouts/AppLayout.vue';
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  ChevronLeft as ChevronLeftIcon, 
  ChevronRight as ChevronRightIcon,
  Heart as HeartIcon, 
  Share as ShareIcon, 
  Camera as CameraIcon,
  Star as StarIcon,
  Bed as BedIcon,
  Users as UsersIcon,
  Ruler as RulerIcon,
  Wifi as WifiIcon,
  CheckCircle as CheckCircleIcon,
  Snowflake as AcIcon,
  Flame as HeatingIcon,
  Dumbbell as GymIcon
} from 'lucide-vue-next'
import { getApiBaseUrl } from '../config/environment'
import api from '../services/api'

const route = useRoute()
const router = useRouter()
const room = ref(null)
const room_amenities = ref([])
const isFavorite = ref(false)
const loading = ref(true)
const currentImageIndex = ref(0)

const currentImage = computed(() => {
  if (!room.value || !room.value.images || room.value.images.length === 0) {
    return '/images/placeholder.svg?height=200&width=300'
  }
  return room.value.images[currentImageIndex.value]
})

const nextImage = () => {
  if (room.value && room.value.images) {
    currentImageIndex.value = (currentImageIndex.value + 1) % room.value.images.length
  }
}

const previousImage = () => {
  if (room.value && room.value.images) {
    currentImageIndex.value = currentImageIndex.value === 0 
      ? room.value.images.length - 1 
      : currentImageIndex.value - 1
  }
}

// Función para cargar los datos de la habitación
const loadRoomData = async () => {
  loading.value = true;
  try {
    // Primero intentamos obtener los datos del localStorage
    const storedData = localStorage.getItem('currentRoomDetails');
    if (storedData) {
      const data = JSON.parse(storedData);
      console.log('Datos del localStorage:', data);
      room.value = {
        id: data.id,
        name: data.title,
        rating: 4.8,
        reviews: 0,
        description: data.description,
        bedType: data.type === 'individual' ? 'Cama Individual' : 'Cama Doble',
        capacity: data.max_occupancy || 1,
        size: data.size || 'No especificado',
        price: data.price,
        services: data.amenities || [],
        location: data.location,
        images: data.images.map(img => img.url) || [],
        bathroom_type: data.bathroom_type,
        available_from: data.available_from,
        minimum_stay: data.minimum_stay,
        address: data.address
      };
      room_amenities.value = data.room_amenities || [];
      console.log('room_amenities después de localStorage:', room_amenities.value);
      loading.value = false;
      return;
    }

    // Si no hay datos en localStorage, los obtenemos de la API
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No hay token de autenticación');
      router.push('/login');
      return;
    }

    const response = await api.get(`/rooms/${route.params.id}`);
    const data = response.data;
    console.log('Datos de la API:', data);
    room.value = {
      id: data.id,
      name: data.title,
      rating: 4.8,
      reviews: 0,
      description: data.description,
      bedType: data.type === 'individual' ? 'Cama Individual' : 'Cama Doble',
      capacity: data.max_occupancy || 1,
      size: data.size || 'No especificado',
      price: data.price,
      services: data.amenities || [],
      location: data.location,
      images: data.images.map(img => img.url) || [],
      bathroom_type: data.bathroom_type,
      available_from: data.available_from,
      minimum_stay: data.minimum_stay,
      address: data.address
    };
    room_amenities.value = data.room_amenities || [];
    console.log('room_amenities después de API:', room_amenities.value);
    console.log('room_amenities.value en template:', room_amenities.value);
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
  if (room.value && room.value.id) {
    router.push(`/confirm-booking-view/${room.value.id}`);
  } else {
    console.error('No se puede reservar: datos de habitación no disponibles');
  }
}

const getAmenityIcon = (iconName) => {
  const iconMap = {
    'wifi': WifiIcon,
    'ac': AcIcon,
    'heating': HeatingIcon,
    'gym': GymIcon
  }
  return iconMap[iconName] || CheckCircleIcon
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