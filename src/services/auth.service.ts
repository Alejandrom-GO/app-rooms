import api from './api';

export interface LoginResponse {
  message: string;
  session: {
    access_token: string;
    token_type: string;
    expires_in: number;
    expires_at: number;
    refresh_token: string;
    user: any;
  };
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    location: string;
    birthdate: string;
    gender: string;
    language: string;
    bio: string;
    profileimage: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface TokenVerificationResponse {
  success: boolean;
  message?: string;
  error?: string;
  details?: string;
  user?: {
    id: string;
    email: string;
    role: string;
    metadata: {
      email: string;
      email_verified: boolean;
      phone_verified: boolean;
      sub: string;
    };
    name: string;
    phone: string;
    location: string;
    birthdate: string;
    gender: string;
    language: string;
    bio: string;
    profileimage: string;
  };
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.session.access_token) {
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('access_token', response.data.session.access_token);
        localStorage.setItem('token_expires_at', response.data.session.expires_at.toString());
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        // Llamar al endpoint de logout
        await api.post('/auth/logout');
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      // Limpiar el almacenamiento local independientemente del resultado
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      localStorage.removeItem('token_expires_at');
      localStorage.removeItem('rememberMe');
    }
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    const expiresAt = localStorage.getItem('token_expires_at');
    const user = localStorage.getItem('user');
    
    if (!token || !expiresAt || !user) {
      return false;
    }
    
    // Verificar si el token ha expirado
    const currentTime = Math.floor(Date.now() / 1000);
    const expirationTime = parseInt(expiresAt);
    
    return currentTime < expirationTime;
  }

  async verifyToken(): Promise<TokenVerificationResponse> {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        return {
          success: false,
          error: 'No token found',
          message: 'No se encontró token de autenticación'
        };
      }

      const response = await api.get('/auth/verify-token');
      return response.data;
    } catch (error: any) {
      console.error('Error al verificar el token:', error);
      return {
        success: false,
        error: 'Error al verificar token',
        details: error.response?.data?.details || error.message
      };
    }
  }
}

export default new AuthService(); 