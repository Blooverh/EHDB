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
      // this guard runs before the route is loaded, so before we mount the component itself
      beforeEnter: async (to, from, next) => {
        
        try{
          const {brand, slug} = to.params;
          // we use fetch for looking to a relative URL since backend and frontend are different services
          const response = await fetch(`/api/cpus/${brand}/${slug}`);

          if(!response.ok){
            return next({ name: 'Not Found' }); // redirect to 404 page if no cpu found
          }

          const cpu = await response.json();
          // setting up meta title dynamically
          to.meta.title = `CPU: ${cpu.brand} ${cpu.model}`;

          next();

        }catch(err){
          console.error('Failed to fetch CPU data for title:', err)
          // fallback title in case of API error
          to.meta.title = 'CPU Details';
          next(); // proceed to route anyway which will lead to 404 page
        }
      },
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
