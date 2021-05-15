import Vue from 'vue';
import VueRouter from 'vue-router';

import Debug from '../views/Debug.vue';

import Menu from '../views/Menu.vue';
import Lobby from '../views/Lobby.vue';
import Chatroom from '../views/Chatroom.vue';
import Score from '../views/Score.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Menu',
    component: Menu
  },
  {
    path: '/lobby',
    name: 'Lobby',
    component: Lobby
  },
  {
    path: '/game',
    name: 'Chatroom',
    component: Chatroom
  },
  {
    path: '/scores',
    name: 'Score',
    component: Score
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
