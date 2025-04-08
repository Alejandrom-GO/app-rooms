<template>
  <div class="bg-gray-50 min-h-screen pb-16">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <div class="container mx-auto px-4 py-3 flex justify-between items-center">
        <div class="flex items-center">
          <router-link to="/" class="mr-2">
            <chevron-left-icon class="h-6 w-6 text-gray-700" />
          </router-link>
          <h1 class="text-lg font-bold text-primary">Favoritos</h1>
        </div>
        <div class="flex items-center space-x-3">
          <button @click="showOptions = !showOptions" class="relative">
            <more-horizontal-icon class="h-5 w-5 text-gray-700" />
            
            <!-- Options Dropdown -->
            <div 
              v-if="showOptions" 
              class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20"
              @click.stop
            >
              <button 
                @click="shareAllFavorites" 
                class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <share-icon class="h-4 w-4 mr-2" />
                Compartir favoritos
              </button>
              <button 
                @click="createCollection" 
                class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <folder-plus-icon class="h-4 w-4 mr-2" />
                Crear colección
              </button>
              <button 
                @click="clearAllFavorites" 
                class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                <trash-icon class="h-4 w-4 mr-2" />
                Eliminar todos
              </button>
            </div>
          </button>
        </div>
      </div>
    </header>

    <!-- Favorites Content -->
    <section class="py-4 px-4">
      <div class="container mx-auto">
        <!-- Empty State -->
        <div v-if="favoriteRooms.length === 0" class="py-12 text-center">
          <div class="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
            <heart-icon class="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 class="text-lg font-medium text-gray-700 mb-2">No tienes favoritos</h3>
            <p class="text-gray-500 mb-6">Guarda tus habitaciones favoritas para verlas más tarde</p>
            <button 
              @click="exploreRooms" 
              class="px-4 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary-dark transition-colors"
            >
              Explorar habitaciones
            </button>
          </div>
        </div>
        
        <!-- Favorites List -->
        <div v-else>
          <!-- Favorites Stats -->
          <div class="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="font-medium">Tus favoritos</h3>
                <p class="text-sm text-gray-500">{{ favoriteRooms.length }} habitaciones guardadas</p>
              </div>
              <div class="relative">
                <div class="flex items-center space-x-1">
                  <arrow-up-down-icon class="h-4 w-4 text-primary" />
                  <select 
                    v-model="sortOption" 
                    class="appearance-none bg-transparent pl-1 pr-8 py-1 text-sm font-medium focus:outline-none text-gray-700 border-b-2 border-transparent hover:border-primary focus:border-primary transition-colors"
                  >
                    <option value="date_added">Fecha: más recientes</option>
                    <option value="price_low">Precio: menor a mayor</option>
                    <option value="price_high">Precio: mayor a menor</option>
                  </select>
                  <div class="absolute right-0 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <chevron-down-icon class="h-4 w-4 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Room Cards -->
          <div class="grid grid-cols-1 gap-4">
            <div 
              v-for="room in sortedFavorites" 
              :key="room.id"
              class="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div class="flex flex-col sm:flex-row">
                <div class="relative sm:w-1/3">
                  <img 
                    :src="room.image" 
                    :alt="room.title" 
                    class="h-48 sm:h-full w-full object-cover"
                  />
                  <div class="absolute top-2 right-2 bg-white p-1 rounded-full">
                    <heart-icon 
                      class="h-5 w-5 text-red-500 fill-current" 
                      @click="removeFromFavorites(room.id)"
                    />
                  </div>
                  <div v-if="room.isNew" class="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-md">
                    Nuevo
                  </div>
                </div>
                <div class="p-4 flex-1 flex flex-col">
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
                  <div class="mt-auto pt-4 flex justify-between items-center">
                    <span class="text-xs text-gray-500">
                      Guardado {{ room.savedDate }}
                    </span>
                    <div class="flex space-x-2">
                      <button 
                        @click="shareRoom(room)" 
                        class="p-2 text-gray-500 hover:text-primary rounded-full hover:bg-gray-100"
                      >
                        <share-icon class="h-5 w-5" />
                      </button>
                      <button 
                        @click="viewRoomDetails(room.id)" 
                        class="px-3 py-1 bg-primary text-white text-sm rounded-md"
                      >
                        Ver detalles
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Create Collection Modal -->
    <div 
      v-if="showCollectionModal" 
      class="fixed inset-0 bg-black bg-opacity-50 z-30 flex items-center justify-center p-4"
      @click.self="showCollectionModal = false"
    >
      <div class="bg-white rounded-lg w-full max-w-md p-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-bold text-lg">Crear colección</h3>
          <button @click="showCollectionModal = false">
            <x-icon class="h-5 w-5 text-gray-700" />
          </button>
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre de la colección</label>
          <input 
            type="text" 
            v-model="collectionName" 
            placeholder="Ej: Habitaciones cerca de la universidad" 
            class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Descripción (opcional)</label>
          <textarea 
            v-model="collectionDescription" 
            placeholder="Añade una descripción..." 
            class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent h-24"
          ></textarea>
        </div>
        
        <div class="flex justify-end space-x-2">
          <button 
            @click="showCollectionModal = false" 
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium"
          >
            Cancelar
          </button>
          <button 
            @click="saveCollection" 
            class="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium"
            :disabled="!collectionName"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { 
  Heart as HeartIcon,
  MapPin as MapPinIcon,
  MoreHorizontal as MoreHorizontalIcon,
  Share as ShareIcon,
  FolderPlus as FolderPlusIcon,
  Trash as TrashIcon,
  X as XIcon,
  ChevronDown as ChevronDownIcon,
  Home as HomeIcon,
  Search as SearchIcon,
  User as UserIcon,
  ArrowUpDown as ArrowUpDownIcon
} from 'lucide-vue-next';

// UI State
const showOptions = ref(false);
const showCollectionModal = ref(false);
const collectionName = ref('');
const collectionDescription = ref('');
const sortOption = ref('date_added');

// Mock Data - Favorite Rooms
const favoriteRooms = ref([
  {
    id: 1,
    title: 'Habitación Individual',
    price: 350,
    location: 'Centro de la ciudad',
    distance: 'A 10 min del metro',
    image: '/images/placeholder.svg?height=200&width=300',
    amenities: ['Wifi', 'Amueblada', 'Cocina'],
    type: 'individual',
    isNew: true,
    savedDate: 'hace 2 días'
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
    isNew: false,
    savedDate: 'hace 1 semana'
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
    isNew: false,
    savedDate: 'hace 3 días'
  }
]);

// Close dropdown when clicking outside
const closeDropdown = (e) => {
  if (showOptions.value) {
    showOptions.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', closeDropdown);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
});

// Computed
const sortedFavorites = computed(() => {
  const sorted = [...favoriteRooms.value];
  
  switch (sortOption.value) {
    case 'price_low':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price_high':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'date_added':
      // In a real app, you would sort by actual date
      // For this demo, we'll keep the original order which is assumed to be by date
      break;
  }
  
  return sorted;
});

// Methods
function removeFromFavorites(roomId) {
  favoriteRooms.value = favoriteRooms.value.filter(room => room.id !== roomId);
}

function viewRoomDetails(roomId) {
  // In a real app, this would navigate to the room details page
  console.log('View room details:', roomId);
}

function shareRoom(room) {
  // In a real app, this would open a share dialog
  console.log('Share room:', room.title);
}

function shareAllFavorites() {
  // In a real app, this would share all favorites
  console.log('Share all favorites');
  showOptions.value = false;
}

function createCollection() {
  showCollectionModal.value = true;
  showOptions.value = false;
}

function saveCollection() {
  // In a real app, this would save the collection
  console.log('Save collection:', {
    name: collectionName.value,
    description: collectionDescription.value,
    rooms: favoriteRooms.value.map(room => room.id)
  });
  
  // Reset and close modal
  collectionName.value = '';
  collectionDescription.value = '';
  showCollectionModal.value = false;
}

function clearAllFavorites() {
  // In a real app, you might want to show a confirmation dialog
  favoriteRooms.value = [];
  showOptions.value = false;
}

function exploreRooms() {
  // In a real app, this would navigate to the rooms listing
  console.log('Navigate to rooms listing');
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

.hover\:bg-primary-dark:hover {
  background-color: var(--color-primary-dark);
}

.focus\:ring-primary:focus {
  --tw-ring-color: var(--color-primary);
}

.text-red-500 {
  color: #ef4444;
}
.text-red-600 {
  color: #dc2626;
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
</style>