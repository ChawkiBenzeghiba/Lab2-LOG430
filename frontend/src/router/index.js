import { createRouter, createWebHistory } from 'vue-router'
import Home         from '../components/Home.vue'
import Rapport      from '../components/Rapport.vue'
import StockCentral from '../components/StockCentral.vue'
import Magasin from '../components/Magasin.vue';

const routes = [
  { path: '/',             name: 'Home',          component: Home },
  { path: '/rapport',      name: 'Rapport',       component: Rapport },
  { path: '/stock-central', name: 'StockCentral', component: StockCentral },
  { path: '/magasin/:id', component: Magasin },
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})