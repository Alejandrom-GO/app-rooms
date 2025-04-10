import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import RoomsView from '../views/RoomsView.vue'
import FavoritesView from '../views/FavoritesView.vue'
import AccountView from '../views/AccountView.vue'
import RoomDetailsView from '../views/RoomDetailsView.vue'
import Parallax from '../views/Parallax.vue'
import ThreeScene from '../views/ThreeScene.vue'
import ConfirmBookingView from '../views/ConfirmBookingView.vue'
import StripePaymentView from '../views/StripePaymentView.vue'
import PaymentSuccessView from '../views/PaymentSuccessView.vue'
import PaymentHandlerView from '../views/PaymentHandlerView.vue'
import { authGuard } from './guards'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { public: true }
  },
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { public: true }
  },
  {
    path: '/rooms',
    name: 'rooms',
    component: RoomsView
  },
  {
    path: '/rooms/:id',
    name: 'room-details',
    component: RoomDetailsView
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: FavoritesView
  },
  {
    path: '/account',
    name: 'account',
    component: AccountView
  },
  {
    path: '/parallax-demo',
    name: 'parallax-demo',
    component: Parallax,
    meta: { public: true }
  },
  {
    path: '/three-demo',
    name: 'three-demo',
    component: ThreeScene,
    meta: { public: true }
  },
  {
    path: '/confirm-booking-view/:id',
    name: 'confirm-booking-view',
    component: ConfirmBookingView,
    meta: { public: true }
  },
  {
    path: '/payment',
    name: 'payment',
    component: StripePaymentView,
    meta: { public: true }
  },
  {
    path: '/payment-success',
    name: 'payment-success',
    component: PaymentSuccessView,
    meta: { public: true }
  },
  {
    path: '/payment-handler/:sessionId',
    name: 'payment-handler',
    component: PaymentHandlerView,
    meta: { public: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Aplicar el guard de autenticación a todas las rutas
router.beforeEach(authGuard)

export default router 