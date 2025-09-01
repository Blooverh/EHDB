import { createRouter, createWebHistory } from 'vue-router'

// Importing Views
import NotFound from '@/views/NotFound.vue'
import Homepage from '@/views/Homepage.vue'

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
