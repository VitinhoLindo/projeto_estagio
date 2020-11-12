import { createRouter, createWebHistory } from 'vue-router'

import Home from '../../views/Home.vue'
import Itens from '../../views/Itens.vue'
import Collaborator from '../../views/Collaborators.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/itens',
    name: 'Itens',
    component: Itens
  },
  {
    path: '/collaborators',
    name: 'Collaborator',
    component: Collaborator
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
