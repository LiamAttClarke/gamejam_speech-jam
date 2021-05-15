import Vue from 'vue';
import VueRouter from 'vue-router';

import Debug from '../views/Debug.vue';
import Lobby from '../views/Lobby.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Lobby',
    component: Lobby
  },
  {
    path: '/debug',
    name: 'Debug',
    component: Debug
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
