<template>
<AppLayout>
  <TooltipProvider>
    <div class="bg-background min-h-screen flex flex-col">
      <!-- Header -->
      <header class="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div class="container flex h-14 items-center justify-between px-4 py-3">
          <div class="flex items-center">
            <Button variant="ghost" size="icon" @click="goBack" class="mr-2">
              <ChevronLeftIcon class="h-5 w-5" />
            </Button>
            <h1 class="text-lg font-medium">Confirmar reserva</h1>
          </div>
        </div>
      </header>
  
      <!-- Main Content -->
      <main class="flex-1 container mx-auto px-4 py-6 md:py-8">
        <div v-if="loadingRoom" class="flex justify-center items-center h-64">
          <Loader2Icon class="h-8 w-8 animate-spin text-primary" />
          <span class="ml-2">Cargando información de la habitación...</span>
        </div>
        
        <div v-else-if="roomError" class="flex flex-col items-center justify-center h-64">
          <div class="text-destructive text-lg mb-2">Error al cargar la habitación</div>
          <p class="text-muted-foreground mb-4">{{ roomError }}</p>
          <Button @click="loadRoomData">Intentar de nuevo</Button>
        </div>
        
        <div v-else-if="roomData" class="grid gap-6 md:grid-cols-3">
          <!-- Room Summary -->
          <div class="md:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-0">
                <div class="flex flex-col sm:flex-row">
                  <div class="relative sm:w-1/3">
                    <img 
                      :src="roomData.images && roomData.images.length > 0 ? roomData.images[0].url : '/placeholder.svg?height=200&width=300'" 
                      :alt="roomData.title" 
                      class="h-48 sm:h-full w-full object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-t-none"
                    />
                  </div>
                  <div class="p-4 flex-1">
                    <div class="flex justify-between items-start">
                      <div>
                        <h3 class="font-bold text-lg">{{ roomData.title }}</h3>
                        <p class="text-muted-foreground text-sm">{{ roomData.location }}</p>
                        <div class="flex items-center mt-1 text-sm text-muted-foreground">
                          <MapPinIcon class="h-4 w-4 mr-1" />
                          <span>{{ roomData.address || 'Ubicación disponible' }}</span>
                        </div>
                      </div>
                      <div class="flex items-center">
                        <StarIcon class="h-4 w-4 text-yellow-400 fill-current" />
                        <span class="ml-1 font-medium">4.8</span>
                        <span class="text-muted-foreground text-sm ml-1">(42)</span>
                      </div>
                    </div>
                    <div class="flex flex-wrap gap-2 mt-3">
                      <Badge 
                        v-for="amenity in roomData.amenities" 
                        :key="amenity.id" 
                        variant="secondary" 
                        class="text-xs"
                      >
                        {{ amenity.name }}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
  
            <!-- Booking Details -->
            <Card>
              <CardHeader>
                <CardTitle>Detalles de la reserva</CardTitle>
              </CardHeader>
              <CardContent>
                <div class="space-y-4">
                  <!-- Dates -->
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Fecha de entrada</Label>
                      <div class="flex gap-2">
                        <Popover>
                          <PopoverTrigger as-child>
                            <Button variant="outline" size="icon"
                            :class="cn(
                              'w-[280px] justify-start text-left font-normal px-3',
                              !checkInDate && 'text-muted-foreground',
                            )">
                              <CalendarIcon class="mr-2 h-4 w-4"/>
                              {{ checkInDate ? df.format(checkInDate.toDate(getLocalTimeZone())) : "Seleccionar fecha" }}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent class="w-auto p-0">
                            <Calendar 
                              v-model="checkInDate" 
                              initial-focus 
                              :min-date="todayDate"
                              :max-date="checkOutDate ? checkOutDate.subtract({ days: 1 }) : undefined"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>


                    </div>
                    <div>
                      <Label>Fecha de salida</Label>
                      <div class="flex gap-2">
                        <Popover>
                          <PopoverTrigger as-child>
                            <Button variant="outline" size="icon"
                            :class="cn(
                              'w-[280px] justify-start text-left font-normal px-3',
                              !checkOutDate && 'text-muted-foreground',
                            )">
                              <CalendarIcon class="mr-2 h-4 w-4"/>
                              {{ checkOutDate ? df.format(checkOutDate.toDate(getLocalTimeZone())) : "Seleccionar fecha" }}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent class="w-auto p-0">
                            <Calendar 
                              v-model="checkOutDate" 
                              initial-focus 
                              :min-date="checkInDate ? checkInDate.add({ days: 1 }) : todayDate.add({ days: 1 })"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
  
                  <Separator />


  
                  <!-- Duration -->
                  <div>
                    <Label>Duración</Label>
                    <div class="flex items-center mt-1">
                      <ClockIcon class="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{{ booking.duration }} {{ booking.duration === 1 ? 'día' : 'días' }}
                        <template v-if="booking.months > 0">
                          ({{ booking.months }} {{ booking.months === 1 ? 'mes' : 'meses' }})
                        </template>
                      </span>
                    </div>
                  </div>
  
                  <Separator />
  
                  <!-- Guests -->
                  <div>
                    <Label>Huéspedes</Label>
                    <div class="flex items-center mt-1">
                      <UserIcon class="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{{ booking.guests }} persona</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
  
            <!-- Payment Method -->
            <Card>
              <CardHeader>
                <CardTitle>Método de pago</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup v-model="selectedPaymentMethod">
                  <div class="space-y-3">
                    <div v-for="method in paymentMethods" :key="method.id" 
                      class="flex items-center space-x-2 border rounded-md p-3"
                      :class="{'border-primary bg-primary/5': selectedPaymentMethod === method.id, 'border-border': selectedPaymentMethod !== method.id}"
                    >
                      <RadioGroupItem :value="method.id" :id="`payment-${method.id}`" />
                      <Label :for="`payment-${method.id}`" class="flex-1 flex items-center cursor-pointer">
                        <CreditCardIcon class="h-5 w-5 mr-2 text-muted-foreground" />
                        <div>
                          <div class="font-medium">{{ method.type }}</div>
                          <div class="text-sm text-muted-foreground">**** **** **** {{ method.lastFour }}</div>
                        </div>
                      </Label>
                    </div>
  
                    <div class="flex items-center space-x-2 border rounded-md p-3 border-dashed">
                      <RadioGroupItem value="new" id="payment-new" />
                      <Label for="payment-new" class="flex-1 flex items-center cursor-pointer">
                        <PlusCircleIcon class="h-5 w-5 mr-2 text-muted-foreground" />
                        <div class="font-medium">Añadir nuevo método de pago</div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
  
            <!-- Cancellation Policy -->
            <Card>
              <CardHeader>
                <CardTitle>Política de cancelación</CardTitle>
              </CardHeader>
              <CardContent>
                <div class="text-sm text-muted-foreground">
                  <p>Cancelación gratuita hasta 7 días antes de la fecha de entrada. Después de ese período, se cobrará el 50% del primer mes.</p>
                  <p class="mt-2">Lee nuestra <a href="#" class="text-primary hover:underline">política de cancelación completa</a>.</p>
                </div>
              </CardContent>
            </Card>
          </div>
  
          <!-- Price Summary -->
          <div class="space-y-6">
            <Card class="sticky top-20">
              <CardHeader>
                <CardTitle>Resumen de precio</CardTitle>
              </CardHeader>
              <CardContent>
                <div class="space-y-4">
                  <div class="flex justify-between">
                    <span>{{ booking.pricePerMonth }} × {{ booking.duration }} {{ booking.duration === 1 ? 'noche' : 'noches' }}</span>
                    <span>{{ booking.subtotal }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Depósito de seguridad</span>
                    <span>{{ booking.deposit }}</span>
                  </div>
                  <div class="flex justify-between">
                    <Tooltip>
                      <TooltipTrigger class="flex items-center">
                        <span>Tarifa de servicio</span>
                        <InfoIcon class="h-4 w-4 ml-1 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p class="w-60 text-sm">Esta tarifa ayuda a mantener nuestra plataforma y proporcionar soporte al cliente 24/7.</p>
                      </TooltipContent>
                    </Tooltip>
                    <span>{{ booking.serviceFee }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Impuestos</span>
                    <span>{{ booking.taxes }}</span>
                  </div>
  
                  <Separator />
  
                  <div class="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{{ booking.total }}</span>
                  </div>
  
                  <div class="text-sm text-muted-foreground">
                    <p>Se te cobrará ahora: <span class="font-medium">{{ booking.initialPayment }}</span></p>
                    <p>Pagos mensuales (3 pagos): <span class="font-medium">{{ booking.monthlyPayment }}</span> cada mes a partir del {{ booking.nextPaymentDate }}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter class="flex flex-col space-y-4">
                <div class="flex items-center space-x-2 w-full">
                  <Checkbox id="terms" v-model:checked="acceptTerms" />
                  <label 
                    for="terms" 
                    class="text-sm leading-none"
                    :class="{'text-destructive': showTermsError}"
                  >
                    Acepto los 
                    <a href="/terms" class="text-primary hover:underline">términos y condiciones</a>
                  </label>
                </div>
                <p v-if="showTermsError" class="text-sm text-destructive">Debes aceptar los términos y condiciones</p>
                
                <Button class="w-full" size="lg" @click="confirmBooking" :disabled="isLoading">
                  <Loader2Icon v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
                  Confirmar y pagar
                </Button>
                <Button variant="outline" class="w-full" @click="goBack">
                  Cancelar
                </Button>
              </CardFooter>
            </Card>
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
      
      <!-- Stripe Payment Handler -->
      <StripePaymentHandler 
        v-if="showStripeHandler && stripeUrl && sessionId" 
        :stripe-url="stripeUrl" 
        :room-id="roomData.id" 
        :session-id="sessionId"
      />
    </div>
  </TooltipProvider>
</AppLayout>
</template>
  
<script setup>
import AppLayout from '../layouts/AppLayout.vue';
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { cn } from '@/lib/utils';
import { 
  ChevronLeft as ChevronLeftIcon,
  MapPin as MapPinIcon,
  Star as StarIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  User as UserIcon,
  CreditCard as CreditCardIcon,
  PlusCircle as PlusCircleIcon,
  Info as InfoIcon,
  Loader2 as Loader2Icon
} from 'lucide-vue-next';

// Importación de componentes shadcn-vue
import { 
  Button, 
  Card, 
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Label,
  Badge,
  Separator,
  RadioGroup,
  RadioGroupItem,
  Checkbox,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from '@/components/ui';

// Importación del componente Calendar y utilidades de fecha
import { Calendar } from '@/components/ui/calendar';
import { 
  getLocalTimeZone, 
  today, 
  parseDate, 
  toZoned,
  DateFormatter
} from '@internationalized/date';

// Importación de componentes Popover
import { 
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/ui/popover';

// Importación del componente StripePaymentHandler
import StripePaymentHandler from '@/components/StripePaymentHandler.vue';

import { getApiBaseUrl } from '../config/environment';
import api from '../services/api';

const route = useRoute();
const router = useRouter();

// Formateador de fechas
const dateFormatter = new DateFormatter('es-ES', {
  dateStyle: 'long'
});

// Funciones de utilidad
const formatDateForInput = (date) => {
  if (!date) return '';
  if (typeof date === 'string') {
    return date;
  }
  return date.toString();
};

const parseInputDate = (dateString) => {
  try {
    return parseDate(dateString);
  } catch (error) {
    console.error('Error al parsear la fecha:', error);
    return today(getLocalTimeZone());
  }
};

const formatDate = (date) => {
  if (!date) return '';
  try {
    // Si es una fecha de @internationalized/date
    if (typeof date.toDate === 'function') {
      return dateFormatter.format(date.toDate(getLocalTimeZone()));
    }
    // Si es un objeto Date nativo
    if (date instanceof Date) {
      return dateFormatter.format(date);
    }
    // Si es un string o otro formato, intentar convertirlo a Date
    const dateObj = new Date(date);
    if (!isNaN(dateObj.getTime())) {
      return dateFormatter.format(dateObj);
    }
    return '';
  } catch (error) {
    console.error('Error al formatear la fecha:', error);
    return '';
  }
};

const calculateMonths = (startDate, endDate) => {
  if (!startDate || !endDate) return { days: 0, months: 0 };
  try {
    const start = startDate.toDate(getLocalTimeZone());
    const end = endDate.toDate(getLocalTimeZone());
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // Solo contar meses completos (30 días)
    const diffMonths = Math.floor(diffDays / 30);
    return { days: diffDays, months: diffMonths };
  } catch (error) {
    console.error('Error al calcular los meses:', error);
    return { days: 0, months: 0 };
  }
};

// Función para calcular días exactos entre dos fechas
const calculateExactDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  try {
    const start = startDate.toDate(getLocalTimeZone());
    const end = endDate.toDate(getLocalTimeZone());
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch (error) {
    console.error('Error al calcular los días:', error);
    return 0;
  }
};

// Estado
const isLoading = ref(false);
const acceptTerms = ref(false);
const showTermsError = ref(false);
const selectedPaymentMethod = ref('card1');
const roomData = ref(null);
const loadingRoom = ref(true);
const roomError = ref(null);
const showStripeHandler = ref(false);
const stripeUrl = ref('');
const sessionId = ref('');

// Fechas de reserva usando @internationalized/date
const todayDate = today(getLocalTimeZone());
const tomorrowDate = todayDate.add({ days: 1 });

const checkInDate = ref(todayDate);
const checkOutDate = ref(tomorrowDate);

// Inputs de fecha para edición manual
const checkInDateInput = ref(checkInDate.value.toString());
const checkOutDateInput = ref(checkOutDate.value.toString());

// Formateador para los botones del calendario
const df = new DateFormatter('es-ES', {
  dateStyle: 'long'
});

// Datos de ejemplo para la reserva
const booking = ref({
  checkIn: '',
  checkOut: '',
  duration: 0,
  months: 0,
  guests: 1,
  pricePerMonth: '$0',
  subtotal: '0',
  deposit: '0',
  serviceFee: '0',
  taxes: '0',
  total: '0',
  initialPayment: '0',
  nextPaymentDate: '',
  monthlyPayment: '$0'
});

const paymentMethods = [
  { id: 'card1', type: 'Visa', lastFour: '4567', default: true },
  { id: 'card2', type: 'Mastercard', lastFour: '8901', default: false }
];

// Función para formatear números con dos decimales
const formatPrice = (price) => {
  return `$${parseFloat(price).toFixed(2)}`;
};

// Función para actualizar los cálculos de precios
const updatePricing = () => {
  if (!roomData.value) return;

  const totalNights = calculateExactDays(checkInDate.value, checkOutDate.value);
  const pricePerNight = parseFloat(roomData.value.price);
  const pricePerMonth = pricePerNight * 0.5; // Precio mensual basado en el precio por noche
  
  booking.value.months = Math.floor(totalNights / 30);
  booking.value.duration = totalNights;
  booking.value.checkIn = formatDate(checkInDate.value);
  booking.value.checkOut = formatDate(checkOutDate.value);
  booking.value.pricePerMonth = formatPrice(pricePerNight); // Mostramos el precio por noche
  
  // Calcular subtotal basado en días exactos
  booking.value.subtotal = formatPrice(pricePerNight * totalNights);
  
  // Calcular depósito (equivalente a 30 noches)
  booking.value.deposit = formatPrice(pricePerMonth);
  
  // Calcular tarifa de servicio (5% del subtotal)
  booking.value.serviceFee = formatPrice((pricePerNight * totalNights) * 0.05);
  
  // Calcular impuestos (2% del subtotal)
  booking.value.taxes = formatPrice((pricePerNight * totalNights) * 0.02);
  
  // Calcular total
  const subtotal = parseFloat(booking.value.subtotal.replace('$', ''));
  const deposit = parseFloat(booking.value.deposit.replace('$', ''));
  const serviceFee = parseFloat(booking.value.serviceFee.replace('$', ''));
  const taxes = parseFloat(booking.value.taxes.replace('$', ''));
  
  const total = subtotal + deposit + serviceFee + taxes;
  booking.value.total = formatPrice(total);
  
  // Calcular pago inicial (depósito + tarifa de servicio + impuestos)
  booking.value.initialPayment = formatPrice(deposit + serviceFee + taxes);

  // Calcular pagos mensuales (total dividido en 3 más 6% de interés)
  const monthlyPayment = (total / 3) * 1.06;
  booking.value.monthlyPayment = formatPrice(monthlyPayment);
  
  // Calcular próxima fecha de pago
  if (checkInDate.value) {
    const nextPayment = new Date(checkInDate.value.toDate(getLocalTimeZone()));
    nextPayment.setMonth(nextPayment.getMonth() + 1);
    booking.value.nextPaymentDate = formatDate(nextPayment);
  } else {
    booking.value.nextPaymentDate = '';
  }
};

// Observar cambios en los inputs de fecha
watch([checkInDateInput, checkOutDateInput], ([newCheckIn, newCheckOut]) => {
  if (newCheckIn && newCheckOut) {
    checkInDate.value = parseInputDate(newCheckIn);
    checkOutDate.value = parseInputDate(newCheckOut);
    updatePricing();
  }
});

// Observar cambios en las fechas
watch([checkInDate, checkOutDate], ([newCheckIn, newCheckOut]) => {
  if (newCheckIn && newCheckOut) {
    // Asegurarse de que la fecha de salida no sea anterior a la de entrada
    if (newCheckOut.compare(newCheckIn) <= 0) {
      checkOutDate.value = newCheckIn.add({ days: 1 });
    }
    // Asegurarse de que la fecha de entrada no sea anterior a hoy
    if (newCheckIn.compare(todayDate) < 0) {
      checkInDate.value = todayDate;
    }
    updatePricing();
  }
}, { immediate: true });

// Función para cargar los datos de la habitación
const loadRoomData = async () => {
  loadingRoom.value = true;
  roomError.value = null;
  
  try {
    const roomId = route.params.id;
    if (!roomId) {
      roomError.value = 'No se proporcionó un ID de habitación';
      return;
    }
    
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    const response = await api.get(`/rooms/${roomId}`);
    roomData.value = response.data;
    
    // Actualizar los precios después de cargar los datos de la habitación
    updatePricing();
  } catch (error) {
    console.error('Error al cargar la habitación:', error);
    roomError.value = error.message || 'Error al cargar la habitación';
  } finally {
    loadingRoom.value = false;
  }
};

// Métodos
const goBack = () => {
  router.push('/rooms');
};

const confirmBooking = async () => {
  showTermsError.value = false;
  isLoading.value = true;
  
  try {
    // Obtener el token de autenticación
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    // Preparar los datos para la sesión de pago
    const paymentData = {
      amount: parseInt(booking.value.total.replace('$', '')),
      currency: "mxn",
      email: "cliente@ejemplo.com", // Aquí deberías obtener el email del usuario actual
      roomDetails: {
        roomId: roomData.value.id,
        name: roomData.value.title,
        checkIn: booking.value.checkIn,
        checkOut: booking.value.checkOut,
        guests: booking.value.guests
      }
    };
    
    // Llamar a la API para crear la sesión de pago
    const response = await api.post('/payments/create-checkout-session', paymentData);
    
    // Verificar si tenemos la URL de Stripe
    if (response.data && response.data.url) {
      // Redirigir directamente a la URL de Stripe
      window.location.href = response.data.url;
    } else {
      console.error('No se recibió la URL de Stripe');
      alert('Error al procesar el pago. Por favor, intenta nuevamente.');
    }
  } catch (error) {
    console.error('Error al crear la sesión de pago:', error);
    alert('Error al procesar el pago. Por favor, intenta nuevamente.');
  } finally {
    isLoading.value = false;
  }
};

// Cargar datos al montar el componente
onMounted(() => {
  loadRoomData();
});
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
.bg-primary\/5 {
  background-color: hsla(var(--primary), 0.05);
}
.text-foreground {
  color: hsl(var(--foreground));
}
.text-primary {
  color: hsl(var(--primary));
}
.text-muted-foreground {
  color: hsl(var(--muted-foreground));
}
.text-destructive {
  color: hsl(var(--destructive));
}
.border-border {
  border-color: hsl(var(--border));
}
.border-primary {
  border-color: hsl(var(--primary));
}
.text-yellow-400 {
  color: #facc15;
}
</style>