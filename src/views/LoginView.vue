<template>
  <AppLayout>
    <div class="flex-1 flex items-center justify-center p-4">
      <Card class="w-full max-w-md">
        <CardHeader>
          <CardTitle>Iniciar sesión</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder a tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit="onSubmit" class="space-y-4">
            <FormField v-slot="{ componentField }" name="email" :validate-on-blur="!isFieldDirty">
              <FormItem v-auto-animate>
                <FormLabel>Correo electrónico</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="tu@ejemplo.com" 
                    v-bind="componentField"
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
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      class="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                      @click="showPassword = !showPassword"
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
                    <Checkbox v-bind="componentField" />
                    <label 
                      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Recordarme
                    </label>
                  </div>
                </FormControl>
              </FormItem>
            </FormField>
            
            <Button type="submit" class="w-full" :disabled="isLoading">
              <Loader2Icon v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
              Iniciar sesión
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p class="text-center text-sm text-muted-foreground w-full">
            ¿No tienes una cuenta?
            <a href="/register" class="text-primary hover:underline font-medium">
              Regístrate
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '../layouts/AppLayout.vue';
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

// Importación de componentes UI
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form';


const showPassword = ref(false);
const isLoading = ref(false);

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

const onSubmit = handleSubmit((values) => {
  isLoading.value = true;
  
  // En una aplicación real, aquí harías la llamada a la API
  setTimeout(() => {
    console.log('Login con:', values);
    // Redirigir al usuario (en una app real)
    // router.push('/dashboard');
    isLoading.value = false;
  }, 1500);
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