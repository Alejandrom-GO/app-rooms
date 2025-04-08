<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <div class="container mx-auto px-4 py-3 flex justify-between items-center">
        <div class="flex items-center">
          <router-link to="/" class="mr-2">
            <chevron-left-icon class="h-6 w-6 text-gray-700" />
          </router-link>
          <h1 class="text-lg font-bold text-primary">Habitaciones</h1>
        </div>
        <div class="flex items-center space-x-3">
          <button @click="showSearch = !showSearch">
            <search-icon class="h-5 w-5 text-gray-700" />
          </button>
          <button @click="showFilters = !showFilters">
            <sliders-icon class="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </div>
      
      <!-- Search Bar (Collapsible) -->
      <div v-if="showSearch" class="container mx-auto px-4 py-3 bg-white border-t border-gray-100">
        <div class="relative">
          <search-icon class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Buscar habitaciones..." 
            class="pl-10 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
    </header>

    <!-- Filters Panel (Slide from right) -->
    <div 
      v-if="showFilters" 
      class="fixed inset-0 bg-black bg-opacity-50 z-20 flex justify-end"
      @click.self="showFilters = false"
    >
      <div class="bg-white w-4/5 max-w-md h-full overflow-y-auto animate-slide-in-right">
        <div class="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 class="font-bold text-lg">Filtros</h2>
          <button @click="showFilters = false">
            <x-icon class="h-5 w-5 text-gray-700" />
          </button>
        </div>
        
        <div class="p-4 space-y-6">
          <!-- Price Range -->
          <div>
            <h3 class="font-medium mb-3">Rango de precio</h3>
            <div class="flex items-center space-x-4">
              <input 
                type="number" 
                v-model="priceMin" 
                placeholder="Mín" 
                class="w-full border border-gray-300 rounded-md py-2 px-3"
              />
              <span>-</span>
              <input 
                type="number" 
                v-model="priceMax" 
                placeholder="Máx" 
                class="w-full border border-gray-300 rounded-md py-2 px-3"
              />
            </div>
          </div>
          
          <!-- Room Type -->
          <div>
            <h3 class="font-medium mb-3">Tipo de habitación</h3>
            <div class="space-y-2">
              <label class="flex items-center space-x-2">
                <input type="checkbox" v-model="roomTypes.individual" class="rounded text-primary focus:ring-primary" />
                <span>Individual</span>
              </label>
              <label class="flex items-center space-x-2">
                <input type="checkbox" v-model="roomTypes.shared" class="rounded text-primary focus:ring-primary" />
                <span>Compartida</span>
              </label>
              <label class="flex items-center space-x-2">
                <input type="checkbox" v-model="roomTypes.suite" class="rounded text-primary focus:ring-primary" />
                <span>Suite</span>
              </label>
            </div>
          </div>
          
          <!-- Amenities -->
          <div>
            <h3 class="font-medium mb-3">Comodidades</h3>
            <div class="space-y-2">
              <label class="flex items-center space-x-2">
                <input type="checkbox" v-model="amenities.wifi" class="rounded text-primary focus:ring-primary" />
                <span>WiFi</span>
              </label>
              <label class="flex items-center space-x-2">
                <input type="checkbox" v-model="amenities.privateBathroom" class="rounded text-primary focus:ring-primary" />
                <span>Baño privado</span>
              </label>
              <label class="flex items-center space-x-2">
                <input type="checkbox" v-model="amenities.furnished" class="rounded text-primary focus:ring-primary" />
                <span>Amueblada</span>
              </label>
              <label class="flex items-center space-x-2">
                <input type="checkbox" v-model="amenities.kitchen" class="rounded text-primary focus:ring-primary" />
                <span>Cocina</span>
              </label>
              <label class="flex items-center space-x-2">
                <input type="checkbox" v-model="amenities.laundry" class="rounded text-primary focus:ring-primary" />
                <span>Lavandería</span>
              </label>
            </div>
          </div>
          
          <!-- Location -->
          <div>
            <h3 class="font-medium mb-3">Ubicación</h3>
            <div class="relative">
              <select 
                v-model="selectedLocation" 
                class="w-full appearance-none bg-white border border-gray-300 rounded-md py-2 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-700"
              >
                <option value="">Todas las ubicaciones</option>
                <option value="centro">Centro</option>
                <option value="norte">Zona Norte</option>
                <option value="sur">Zona Sur</option>
                <option value="universidad">Zona Universitaria</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <chevron-down-icon class="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
        
        <div class="p-4 border-t border-gray-200 flex space-x-3">
          <button 
            @click="resetFilters" 
            class="flex-1 py-2 border border-gray-300 rounded-md font-medium"
          >
            Limpiar
          </button>
          <button 
            @click="applyFilters" 
            class="flex-1 py-2 bg-primary text-white rounded-md font-medium"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>

    <!-- Sort Options -->
    <div class="bg-white border-b border-gray-200">
      <div class="container mx-auto px-4 py-3 flex justify-between items-center">
        <div class="text-sm text-gray-600">{{ filteredRooms.length }} habitaciones</div>
        <div class="relative">
          <div class="flex items-center space-x-1">
            <arrow-up-down-icon class="h-4 w-4 text-primary" />
            <select 
              v-model="sortOption" 
              class="appearance-none bg-transparent pl-1 pr-8 py-1 text-sm font-medium focus:outline-none text-gray-700 border-b-2 border-transparent hover:border-primary focus:border-primary transition-colors"
            >
              <option value="recommended">Recomendados</option>
              <option value="price_low">Precio: menor a mayor</option>
              <option value="price_high">Precio: mayor a menor</option>
              <option value="newest">Más recientes</option>
            </select>
            <div class="absolute right-0 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <chevron-down-icon class="h-4 w-4 text-primary" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Room List -->
    <section class="py-4 px-4">
      <div class="container mx-auto">
        <div v-if="loading" class="flex justify-center items-center min-h-[50vh]">
          <div class="w-full max-w-md space-y-4">
            <!-- Skeleton Header -->
            <div class="flex justify-between items-center">
              <div class="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              <div class="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
            </div>
            
            <!-- Skeleton Room Cards -->
            <div v-for="i in 2" :key="i" class="bg-white rounded-lg shadow-md overflow-hidden">
              <div class="relative pb-[60%] bg-gray-200 animate-pulse"></div>
              <div class="p-4 space-y-3">
                <div class="flex justify-between items-start">
                  <div class="h-5 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  <div class="h-5 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                </div>
                <div class="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div class="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                <div class="flex space-x-2">
                  <div class="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                  <div class="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                  <div class="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else-if="displayedRooms.length === 0" class="py-12 text-center">
          <frown-icon class="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 class="text-lg font-medium text-gray-700 mb-2">No se encontraron habitaciones</h3>
          <p class="text-gray-500">Intenta con otros filtros o amplía tu búsqueda</p>
        </div>
        
        <div v-else class="grid grid-cols-1 gap-4">
          <!-- Room Card (Clickable) -->
          <div 
            v-for="room in displayedRooms" 
            :key="room.id"
            class="bg-white rounded-lg shadow-md overflow-hidden"
            @click="viewRoomDetails(room.id)"
          >
            <div class="relative pb-[60%]">
              <img 
                :src="room.image" 
                :alt="room.title" 
                class="absolute h-full w-full object-cover"
              />
              <div class="absolute top-2 right-2 bg-white p-1 rounded-full">
                <heart-icon 
                  :class="['h-5 w-5', room.isFavorite ? 'text-red-500 fill-current' : 'text-gray-500']" 
                  @click.stop="toggleFavorite(room.id)"
                />
              </div>
              <div v-if="room.isNew" class="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-md">
                Nuevo
              </div>
            </div>
            <div class="p-4">
              <div class="flex justify-between items-start">
                <h3 class="font-bold">{{ room.title }}</h3>
                <span class="font-bold text-primary">${{ room.price }}/mes</span>
              </div>
              <p class="text-gray-600 text-sm mt-1">{{ room.location }}</p>
              <div class="flex items-center mt-2 text-sm text-gray-600">
                <map-pin-icon class="h-4 w-4 mr-1" />
                <span>{{ room.distance }}</span>
              </div>
              <div class="flex flex-wrap gap-2 mt-3">
                <span 
                  v-for="(amenity, index) in room.amenities" 
                  :key="index" 
                  class="bg-gray-100 text-xs px-2 py-1 rounded-md"
                >
                  {{ amenity }}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Load More / Show Less Buttons -->
        <div v-if="!loading" class="mt-6 text-center space-x-4">
          <button 
            v-if="hasMoreRooms" 
            @click="loadMoreRooms" 
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
          >
            Cargar más
          </button>
          <button 
            v-if="!hasMoreRooms && displayedRooms.length > initialRoomsCount" 
            @click="showLessRooms" 
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
          >
            Ver menos
          </button>
        </div>
      </div>
    </section>


  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { 
  ChevronLeft as ChevronLeftIcon,
  Search as SearchIcon,
  Sliders as SlidersIcon,
  X as XIcon,
  ChevronDown as ChevronDownIcon,
  Heart as HeartIcon,
  MapPin as MapPinIcon,
  Frown as FrownIcon,
  Home as HomeIcon,
  User as UserIcon,
  ArrowUpDown as ArrowUpDownIcon
} from 'lucide-vue-next';

const router = useRouter();

// UI State
const showSearch = ref(false);
const showFilters = ref(false);
const loading = ref(true);
const searchQuery = ref('');
const sortOption = ref('recommended');

// Filters
const priceMin = ref('');
const priceMax = ref('');
const roomTypes = ref({
  individual: false,
  shared: false,
  suite: false
});
const amenities = ref({
  wifi: false,
  privateBathroom: false,
  furnished: false,
  kitchen: false,
  laundry: false
});
const selectedLocation = ref('');

// Pagination
const page = ref(1);
const hasMoreRooms = ref(true);
const initialRoomsCount = ref(2);
const visibleRoomsCount = ref(2);

// Mock Data
const rooms = ref([]);
const displayedRooms = ref([]);

// Generate mock data
onMounted(() => {
  setTimeout(() => {
    rooms.value = [
      {
        id: 1,
        title: 'Habitación Individual',
        price: 350,
        location: 'Centro de la ciudad',
        distance: 'A 10 min del metro',
        image: '/images/placeholder.svg?height=200&width=300',
        amenities: ['Wifi', 'Amueblada', 'Cocina'],
        type: 'individual',
        isFavorite: false,
        isNew: true
      },
      {
        id: 2,
        title: 'Habitación Compartida',
        price: 250,
        location: 'Zona Universitaria',
        distance: 'Cerca de la universidad',
        image: '/images/placeholder.svg?height=200&width=300',
        amenities: ['Wifi', 'Baño compartido', 'Lavandería'],
        type: 'shared',
        isFavorite: true,
        isNew: false
      },
      {
        id: 3,
        title: 'Suite con Baño',
        price: 450,
        location: 'Zona Residencial',
        distance: 'Barrio tranquilo',
        image: '/images/placeholder.svg?height=200&width=300',
        amenities: ['Wifi', 'Baño privado', 'Terraza'],
        type: 'suite',
        isFavorite: false,
        isNew: false
      },
      {
        id: 4,
        title: 'Habitación Luminosa',
        price: 380,
        location: 'Zona Norte',
        distance: 'A 5 min de la estación',
        image: '/images/placeholder.svg?height=200&width=300',
        amenities: ['Wifi', 'Amueblada', 'Balcón'],
        type: 'individual',
        isFavorite: false,
        isNew: true
      },
      {
        id: 5,
        title: 'Habitación Doble',
        price: 300,
        location: 'Zona Sur',
        distance: 'Cerca del parque',
        image: '/images/placeholder.svg?height=200&width=300',
        amenities: ['Wifi', 'Cocina compartida', 'Jardín'],
        type: 'shared',
        isFavorite: false,
        isNew: false
      },
      {
        id: 6,
        title: 'Estudio Completo',
        price: 500,
        location: 'Centro de la ciudad',
        distance: 'Zona comercial',
        image: '/images/placeholder.svg?height=200&width=300',
        amenities: ['Wifi', 'Baño privado', 'Cocina equipada'],
        type: 'suite',
        isFavorite: false,
        isNew: false
      }
    ];
    displayedRooms.value = rooms.value.slice(0, initialRoomsCount.value);
    loading.value = false;
  }, 1000);
});

// Computed
const filteredRooms = computed(() => {
  let result = [...rooms.value];
  
  // Search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(room => 
      room.title.toLowerCase().includes(query) || 
      room.location.toLowerCase().includes(query)
    );
  }
  
  // Price range
  if (priceMin.value) {
    result = result.filter(room => room.price >= parseInt(priceMin.value));
  }
  if (priceMax.value) {
    result = result.filter(room => room.price <= parseInt(priceMax.value));
  }
  
  // Room types
  const selectedTypes = Object.entries(roomTypes.value)
    .filter(([_, selected]) => selected)
    .map(([type]) => type);
  
  if (selectedTypes.length > 0) {
    result = result.filter(room => selectedTypes.includes(room.type));
  }
  
  // Location
  if (selectedLocation.value) {
    result = result.filter(room => 
      room.location.toLowerCase().includes(selectedLocation.value.toLowerCase())
    );
  }
  
  // Amenities
  const selectedAmenities = Object.entries(amenities.value)
    .filter(([_, selected]) => selected)
    .map(([amenity]) => {
      // Map the amenity key to a display name
      const amenityMap = {
        wifi: 'Wifi',
        privateBathroom: 'Baño privado',
        furnished: 'Amueblada',
        kitchen: 'Cocina',
        laundry: 'Lavandería'
      };
      return amenityMap[amenity];
    });
  
  if (selectedAmenities.length > 0) {
    result = result.filter(room => 
      selectedAmenities.every(amenity => 
        room.amenities.some(a => a.toLowerCase() === amenity.toLowerCase())
      )
    );
  }
  
  // Sorting
  switch (sortOption.value) {
    case 'price_low':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price_high':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      break;
    // For 'recommended', we keep the original order
  }
  
  return result;
});

// Methods
function goBack() {
  // In a real app, this would use router.back() or similar
  console.log('Go back');
}

function resetFilters() {
  priceMin.value = '';
  priceMax.value = '';
  roomTypes.value = {
    individual: false,
    shared: false,
    suite: false
  };
  amenities.value = {
    wifi: false,
    privateBathroom: false,
    furnished: false,
    kitchen: false,
    laundry: false
  };
  selectedLocation.value = '';
}

function applyFilters() {
  showFilters.value = false;
}

function toggleFavorite(roomId) {
  const room = rooms.value.find(r => r.id === roomId);
  if (room) {
    room.isFavorite = !room.isFavorite;
  }
}

function viewRoomDetails(roomId) {
  console.log('Navegando a detalles de habitación:', roomId);
  router.push({
    name: 'room-details',
    params: { id: roomId }
  });
}

function loadMoreRooms() {
  loading.value = true;
  
  // Desplazar la página hacia arriba para que el usuario vea el indicador de carga
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
  
  // Simulate loading more rooms
  setTimeout(() => {
    const filteredResults = filteredRooms.value;
    const nextRooms = filteredResults.slice(
      displayedRooms.value.length,
      displayedRooms.value.length + visibleRoomsCount.value
    );
    
    if (nextRooms.length > 0) {
      displayedRooms.value = [...displayedRooms.value, ...nextRooms];
      hasMoreRooms.value = displayedRooms.value.length < filteredResults.length;
    } else {
      hasMoreRooms.value = false;
    }
    
    loading.value = false;
  }, 1000);
}

function showLessRooms() {
  loading.value = true;
  
  // Desplazar la página hacia arriba para que el usuario vea el indicador de carga
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
  
  setTimeout(() => {
    displayedRooms.value = filteredRooms.value.slice(0, initialRoomsCount.value);
    hasMoreRooms.value = filteredRooms.value.length > initialRoomsCount.value;
    loading.value = false;
  }, 1000);
}

function closeAllMenus() {
  showSearch.value = false;
  showFilters.value = false;
}
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

.border-primary {
  border-color: var(--color-primary);
}

.focus\:ring-primary:focus {
  --tw-ring-color: var(--color-primary);
}

.text-red-500 {
  color: #ef4444;
}

/* Animation for filter panel */
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

/* Custom select styling */
select {
  background-image: none;
}

select:focus {
  box-shadow: 0 0 0 2px rgba(255, 90, 95, 0.2);
}

/* Add a custom hover effect */
select:hover {
  border-color: var(--color-primary);
}

/* Style the options (works in some browsers) */
option {
  padding: 8px;
}

option:checked {
  background-color: var(--color-primary);
  color: white;
}

/* Sort dropdown specific styles */
.sort-dropdown {
  transition: all 0.2s ease;
}

.sort-dropdown:hover {
  color: var(--color-primary);
}
</style>