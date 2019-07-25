import Vue from 'vue';
import Router from 'vue-router';
import FHIRUserAuthz from './services/FHIRUserAuthz';

import Home from './views/Home.vue';
import Welcome from './views/Welcome.vue';
import FHIRRedirect from './views/FHIRRedirect.vue';


Vue.use(Router);


const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Welcome
    },
    {
      path: '/profile',
      name: 'profile',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Profile.vue'),
    },
    {
      path: '/medications',
      name: 'medications',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Medications.vue'),
    },
    {
      path: '/immunizations',
      name: 'immunizations',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Immunizations.vue'),
    },
    {
      path: '/lab-results',
      name: 'lab-results',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/LabResults.vue'),
    },
    {
      path: '/redirect/datasync',
      name: 'fhir-redirect',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: FHIRRedirect
    },
  ],
})
router.beforeEach((to, from, next) => {
  if(FHIRUserAuthz.isLoggedIn()) { 
    next() 
  }
  else if(['login', 'fhir-redirect'].includes(to.name))  
    next() 
  else {
    next({name: 'login'})
  }
})

export default router
