import { createRouter, createWebHistory } from 'vue-router'
import Home         from '../components/Home.vue'
import Rapport      from '../components/Rapport.vue'
import StockCentral from '../components/StockCentral.vue'

const routes = [
  { path: '/',             name: 'Home',          component: Home },
  { path: '/rapport',      name: 'Rapport',       component: Rapport },
  { path: '/stock-central', name: 'StockCentral', component: StockCentral }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})