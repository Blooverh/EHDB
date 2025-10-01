import { createRouter, createWebHistory } from 'vue-router'

// Importing Views
import NotFound from '@/views/NotFound.vue'
import Homepage from '@/views/Homepage.vue'
import ServerCollection from '@/views/ServerCollection.vue';
import CpuCollection from '@/views/CpuCollection.vue';
import IndividualCpu from '@/views/IndividualCpu.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home Page',
      component: Homepage,
      meta: { title: 'EHDB Home Page'}
    },
    {
      path: '/servers',
      name: 'Server Collection',
      component: ServerCollection,
      meta: {title: 'Server Collection'}
    },
    {
      path: '/cpus',
      name: 'CPU Collection',
      component: CpuCollection,
      meta: { title: 'CPU Collection'}
    },
    {
      path: '/cpus/:brand/:slug',
      name: 'Individual CPU',
      component: IndividualCpu,
      meta: { title: `CPU Individual`} // need to change to brand and model
    },
    {
      path: '/:pathMatch(.*)*', name: 'Not Found', component: NotFound,
      meta: { title: 'EHDB - Not Found'} 
    },
  ],
});

// Change document title after each navigation
router.afterEach((to) => {
  if(to.meta.title){
    document.title = to.meta.title;
  }
});

export default router
