<template>
  <AuthLayout>
    <Card class="w-full shadow-lg">
      <CardHeader class="text-center pb-0">
        <CardTitle class="text-2xl">Iniciar sesión</CardTitle>
        <CardDescription>
          Ingresa tus credenciales para acceder a tu cuenta
        </CardDescription>
      </CardHeader>
      <CardContent class="pt-0">
        <form @submit="onSubmit" class="space-y-1.5">
          <FormField v-slot="{ componentField }" name="email" :validate-on-blur="!isFieldDirty">
            <FormItem v-auto-animate>
              <FormLabel>Correo electrónico</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="tu@ejemplo.com" 
                  v-bind="componentField"
                  :disabled="isLoading"
                  class="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          
          <FormField v-slot="{ componentField }" name="password" :validate-on-blur="!isFieldDirty">
            <FormItem v-auto-animate>
              <div class="flex items-center justify-between">
                <FormLabel>Contraseña</FormLabel>
                <a href="/forgot-password" class="text-sm text-primary hover:underline">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <FormControl>
                <div class="relative">
                  <Input 
                    :type="showPassword ? 'text' : 'password'" 
                    placeholder="••••••••" 
                    v-bind="componentField"
                    :disabled="isLoading"
                    class="w-full"
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    class="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                    @click="showPassword = !showPassword"
                    :disabled="isLoading"
                  >
                    <EyeIcon v-if="!showPassword" class="h-4 w-4" />
                    <EyeOffIcon v-else class="h-4 w-4" />
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          
          <FormField v-slot="{ componentField }" name="rememberMe">
            <FormItem v-auto-animate>
              <FormControl>
                <div class="flex items-center space-x-2">
                  <Checkbox v-bind="componentField" :disabled="isLoading" />
                  <label 
                    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Recordarme
                  </label>
                </div>
              </FormControl>
            </FormItem>
          </FormField>
          
          <div v-if="error" class="text-destructive text-sm text-center p-2 bg-destructive/10 rounded-md">
            {{ error }}
          </div>
          
          <Button type="submit" class="w-full" :disabled="isLoading">
            <Loader2Icon v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            {{ isLoading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
          </Button>
        </form>
      </CardContent>
      <CardFooter class="pt-0">
        <p class="text-center text-sm text-muted-foreground w-full">
          ¿No tienes una cuenta?
          <a href="/register" class="text-primary hover:underline font-medium">
            Regístrate
          </a>
        </p>
      </CardFooter>
    </Card>
  </AuthLayout>
</template>

<script setup lang="ts">
import AuthLayout from '../layouts/AuthLayout.vue';
import { ref } from 'vue';
import { 
  Eye as EyeIcon, 
  EyeOff as EyeOffIcon,
  Loader2 as Loader2Icon
} from 'lucide-vue-next';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { vAutoAnimate } from '@formkit/auto-animate/vue';
import * as z from 'zod';
import { useRouter, useRoute } from 'vue-router';
import authService from '../services/auth.service';
import { useToast } from '../components/ui/toast/use-toast';

// Importación de componentes UI
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form';


const showPassword = ref(false);
const isLoading = ref(false);
const router = useRouter();
const { toast } = useToast();
const error = ref('');

// Obtener la ruta de redirección de los parámetros de la URL
const route = useRoute();
const redirectPath = route.query.redirect as string || '/';

const formSchema = toTypedSchema(z.object({
  email: z.string()
    .min(1, 'El correo electrónico es requerido')
    .email('Ingresa un correo electrónico válido'),
  password: z.string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  rememberMe: z.boolean().optional()
}));

const { handleSubmit, isFieldDirty } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;
  error.value = '';
  
  try {
    const response = await authService.login({
      email: values.email,
      password: values.password
    });
    
    if (values.rememberMe) {
      localStorage.setItem('rememberMe', 'true');
    }
    
    toast({
      title: '¡Bienvenido!',
      description: response.message || 'Inicio de sesión exitoso',
    });
    
    // Redirigir a la ruta solicitada o a la página principal
    router.push(redirectPath);
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 'Error al iniciar sesión. Por favor, verifica tus credenciales.';
    error.value = errorMessage;
    toast({
      variant: 'destructive',
      title: 'Error',
      description: errorMessage,
    });
  } finally {
    isLoading.value = false;
  }
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
.border-destructive {
  border-color: hsl(var(--destructive));
}
</style>