import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import RoomsView from '../views/RoomsView.vue'
import FavoritesView from '../views/FavoritesView.vue'
import AccountView from '../views/AccountView.vue'
import RoomDetailsView from '../views/RoomDetailsView.vue'
import Parallax from '../views/Parallax.vue'
import ThreeScene from '../views/ThreeScene.vue'

const routes: Array<RouteRecordRaw> = [

  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/',
    name: 'home',
    component: LoginView
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
    component:  Parallax
  },
  {
    path: '/three-demo',
    name: 'three-demo',
    component: ThreeScene
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 