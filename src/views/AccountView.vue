<template>
  <div class="bg-gray-50 min-h-screen pb-16">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <div class="container mx-auto px-4 py-3 flex justify-between items-center">
        <div class="flex items-center">
          <router-link to="/" class="mr-2">
            <chevron-left-icon class="h-6 w-6 text-gray-700" />
          </router-link>
          <h1 class="text-lg font-bold text-primary">Mi Cuenta</h1>
        </div>
        <div class="flex items-center space-x-3">
          <button @click="showSettings = !showSettings">
            <settings-icon class="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </div>
    </header>

    <!-- Profile Content -->
    <section class="py-4 px-4">
      <div class="container mx-auto max-w-lg">
        <!-- User Profile Card -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div class="bg-primary h-24 relative">
            <div class="absolute -bottom-12 left-4 border-4 border-white rounded-full overflow-hidden">
              <img 
                src="/images/placeholder.svg?height=80&width=80" 
                alt="Profile picture" 
                class="h-24 w-24 object-cover"
              />
            </div>
            <button class="absolute top-3 right-3 bg-white bg-opacity-20 p-1.5 rounded-full">
              <camera-icon class="h-5 w-5 text-white" />
            </button>
          </div>
          
          <div class="pt-14 pb-4 px-4">
            <div class="flex justify-between items-start">
              <div>
                <h2 class="text-xl font-bold">{{ user.name }}</h2>
                <p class="text-gray-600 text-sm">{{ user.email }}</p>
              </div>
              <button 
                @click="editProfile = true" 
                class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
              >
                Editar perfil
              </button>
            </div>
            
            <div class="flex items-center mt-3 text-sm text-gray-600">
              <map-pin-icon class="h-4 w-4 mr-1" />
              <span>{{ user.location }}</span>
            </div>
            
            <div class="mt-4 flex space-x-4">
              <div class="text-center">
                <div class="font-bold">{{ user.bookings }}</div>
                <div class="text-xs text-gray-500">Reservas</div>
              </div>
              <div class="text-center">
                <div class="font-bold">{{ user.favorites }}</div>
                <div class="text-xs text-gray-500">Favoritos</div>
              </div>
              <div class="text-center">
                <div class="font-bold">{{ user.reviews }}</div>
                <div class="text-xs text-gray-500">Reseñas</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Account Sections -->
        <div class="space-y-4">
          <!-- Personal Information -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-4 border-b border-gray-100">
              <h3 class="font-medium">Información personal</h3>
            </div>
            <div class="p-4 space-y-4">
              <div class="flex justify-between items-center">
                <div>
                  <div class="text-sm text-gray-500">Teléfono</div>
                  <div>{{ user.phone }}</div>
                </div>
                <button class="text-primary text-sm">Editar</button>
              </div>
              
              <div class="flex justify-between items-center">
                <div>
                  <div class="text-sm text-gray-500">Fecha de nacimiento</div>
                  <div>{{ user.birthdate }}</div>
                </div>
                <button class="text-primary text-sm">Editar</button>
              </div>
              
              <div class="flex justify-between items-center">
                <div>
                  <div class="text-sm text-gray-500">Género</div>
                  <div>{{ user.gender }}</div>
                </div>
                <button class="text-primary text-sm">Editar</button>
              </div>
              
              <div class="flex justify-between items-center">
                <div>
                  <div class="text-sm text-gray-500">Idioma</div>
                  <div>{{ user.language }}</div>
                </div>
                <button class="text-primary text-sm">Editar</button>
              </div>
            </div>
          </div>
          
          <!-- Payment Methods -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 class="font-medium">Métodos de pago</h3>
              <button class="text-primary text-sm">Añadir</button>
            </div>
            <div v-if="user.paymentMethods.length === 0" class="p-8 text-center">
              <credit-card-icon class="h-12 w-12 mx-auto text-gray-300 mb-2" />
              <p class="text-gray-500 text-sm">No tienes métodos de pago guardados</p>
            </div>
            <div v-else class="divide-y divide-gray-100">
              <div 
                v-for="(method, index) in user.paymentMethods" 
                :key="index"
                class="p-4 flex justify-between items-center"
              >
                <div class="flex items-center">
                  <credit-card-icon class="h-6 w-6 text-gray-500 mr-3" />
                  <div>
                    <div class="font-medium">{{ method.type }}</div>
                    <div class="text-sm text-gray-500">**** **** **** {{ method.lastFour }}</div>
                  </div>
                </div>
                <button class="text-gray-500">
                  <more-vertical-icon class="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          
          <!-- Bookings -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 class="font-medium">Reservas recientes</h3>
              <button class="text-primary text-sm">Ver todas</button>
            </div>
            <div v-if="user.recentBookings.length === 0" class="p-8 text-center">
              <calendar-icon class="h-12 w-12 mx-auto text-gray-300 mb-2" />
              <p class="text-gray-500 text-sm">No tienes reservas recientes</p>
            </div>
            <div v-else class="divide-y divide-gray-100">
              <div 
                v-for="(booking, index) in user.recentBookings" 
                :key="index"
                class="p-4"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <div class="font-medium">{{ booking.roomName }}</div>
                    <div class="text-sm text-gray-500">{{ booking.dates }}</div>
                  </div>
                  <div :class="['text-xs px-2 py-1 rounded-full', getStatusClass(booking.status)]">
                    {{ booking.status }}
                  </div>
                </div>
                <div class="mt-2 flex justify-between items-center">
                  <div class="text-sm text-gray-600">${{ booking.price }} total</div>
                  <button class="text-primary text-sm">Detalles</button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Account Settings -->
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-4 border-b border-gray-100">
              <h3 class="font-medium">Configuración de la cuenta</h3>
            </div>
            <div class="divide-y divide-gray-100">
              <button 
                @click="showNotificationSettings = true"
                class="w-full p-4 flex justify-between items-center text-left"
              >
                <div class="flex items-center">
                  <bell-icon class="h-5 w-5 text-gray-500 mr-3" />
                  <span>Notificaciones</span>
                </div>
                <chevron-right-icon class="h-5 w-5 text-gray-400" />
              </button>
              
              <button 
                @click="showPrivacySettings = true"
                class="w-full p-4 flex justify-between items-center text-left"
              >
                <div class="flex items-center">
                  <lock-icon class="h-5 w-5 text-gray-500 mr-3" />
                  <span>Privacidad</span>
                </div>
                <chevron-right-icon class="h-5 w-5 text-gray-400" />
              </button>
              
              <button 
                @click="showSecuritySettings = true"
                class="w-full p-4 flex justify-between items-center text-left"
              >
                <div class="flex items-center">
                  <shield-icon class="h-5 w-5 text-gray-500 mr-3" />
                  <span>Seguridad</span>
                </div>
                <chevron-right-icon class="h-5 w-5 text-gray-400" />
              </button>
              
              <button 
                @click="showHelpCenter = true"
                class="w-full p-4 flex justify-between items-center text-left"
              >
                <div class="flex items-center">
                  <help-circle-icon class="h-5 w-5 text-gray-500 mr-3" />
                  <span>Centro de ayuda</span>
                </div>
                <chevron-right-icon class="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>
          
          <!-- Logout Button -->
          <button 
            @click="logout" 
            class="w-full p-4 text-center text-red-600 font-medium bg-white rounded-lg shadow-md"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </section>

    <!-- Edit Profile Modal -->
    <div 
      v-if="editProfile" 
      class="fixed inset-0 bg-black bg-opacity-50 z-30 flex items-center justify-center p-4"
      @click.self="editProfile = false"
    >
      <div class="bg-white rounded-lg w-full max-w-md p-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-bold text-lg">Editar perfil</h3>
          <button @click="editProfile = false">
            <x-icon class="h-5 w-5 text-gray-700" />
          </button>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
            <input 
              type="text" 
              v-model="editedUser.name" 
              class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              v-model="editedUser.email" 
              class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input 
              type="tel" 
              v-model="editedUser.phone" 
              class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
            <input 
              type="text" 
              v-model="editedUser.location" 
              class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Biografía</label>
            <textarea 
              v-model="editedUser.bio" 
              class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent h-24"
            ></textarea>
          </div>
        </div>
        
        <div class="flex justify-end space-x-2 mt-6">
          <button 
            @click="editProfile = false" 
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium"
          >
            Cancelar
          </button>
          <button 
            @click="saveProfile" 
            class="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>

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
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <moon-icon class="h-5 w-5 text-gray-500 mr-3" />
              <span>Modo oscuro</span>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="darkMode" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
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

<script setup>
import { ref, reactive } from 'vue';
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
  DollarSign as DollarSignIcon
} from 'lucide-vue-next';

// UI State
const editProfile = ref(false);
const showSettings = ref(false);
const showNotificationSettings = ref(false);
const showPrivacySettings = ref(false);
const showSecuritySettings = ref(false);
const showHelpCenter = ref(false);
const darkMode = ref(false);

// User Data
const user = reactive({
  name: 'Carlos Rodríguez',
  email: 'carlos.rodriguez@example.com',
  phone: '+52 123 456 7890',
  location: 'Ciudad de México',
  birthdate: '15/04/1992',
  gender: 'Masculino',
  language: 'Español',
  bio: 'Estudiante de arquitectura buscando habitación cerca de la universidad.',
  bookings: 3,
  favorites: 5,
  reviews: 2,
  paymentMethods: [
    { type: 'Visa', lastFour: '4567', default: true },
    { type: 'Mastercard', lastFour: '8901', default: false }
  ],
  recentBookings: [
    { 
      roomName: 'Habitación Individual', 
      dates: '10 Jun - 10 Jul 2025', 
      price: 350, 
      status: 'Activa' 
    },
    { 
      roomName: 'Suite con Baño', 
      dates: '15 Mar - 15 Abr 2025', 
      price: 450, 
      status: 'Completada' 
    }
  ]
});

// Edited user data (for the form)
const editedUser = reactive({
  name: user.name,
  email: user.email,
  phone: user.phone,
  location: user.location,
  bio: user.bio
});

// Methods
function getStatusClass(status) {
  switch (status) {
    case 'Activa':
      return 'bg-green-100 text-green-800';
    case 'Pendiente':
      return 'bg-yellow-100 text-yellow-800';
    case 'Completada':
      return 'bg-blue-100 text-blue-800';
    case 'Cancelada':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function saveProfile() {
  // In a real app, this would save the profile to the backend
  user.name = editedUser.name;
  user.email = editedUser.email;
  user.phone = editedUser.phone;
  user.location = editedUser.location;
  user.bio = editedUser.bio;
  
  editProfile.value = false;
  
  // Show success message
  console.log('Profile updated successfully');
}

function logout() {
  // In a real app, this would log the user out
  console.log('User logged out');
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

.text-red-600 {
  color: #dc2626;
}

/* Status colors */
.bg-green-100 {
  background-color: #dcfce7;
}
.text-green-800 {
  color: #166534;
}

.bg-yellow-100 {
  background-color: #fef9c3;
}
.text-yellow-800 {
  color: #854d0e;
}

.bg-blue-100 {
  background-color: #dbeafe;
}
.text-blue-800 {
  color: #1e40af;
}

.bg-red-100 {
  background-color: #fee2e2;
}
.text-red-800 {
  color: #991b1b;
}
</style>