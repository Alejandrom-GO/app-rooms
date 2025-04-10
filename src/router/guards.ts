import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import authService from '../services/auth.service';

export const authGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  // Si la ruta es pública, permitir el acceso
  if (to.meta.public) {
    return next();
  }

  // Verificar si el usuario está autenticado
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    // Si no está autenticado, redirigir al login
    return next({ path: '/login', query: { redirect: to.fullPath } });
  }

  // Verificar el token con el servidor
  const tokenVerification = await authService.verifyToken();
  
  if (!tokenVerification.success) {
    // Si el token no es válido, cerrar sesión y redirigir al login
    await authService.logout();
    return next({ path: '/login', query: { redirect: to.fullPath } });
  }

  // Si todo está bien, permitir el acceso
  return next();
}; 