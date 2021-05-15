import Vue from 'vue';
import Vuex from 'vuex';
import { io } from 'socket.io-client';

Vue.use(Vuex);

const socket = io('http://localhost:3000');
const store = new Vuex.Store({
  state: {
    room: {
      id: null,
      state: 'lobby',
      round: 0,
      host: null,
      players: [],
      scores: {},
      messages: []
    }
  },
  getters: {
    room: state => state.room
  },
  mutations: {
    setRoom(state, room) {
      state.room = room;
    }
  },
  actions: {
    setName(context, name) {
      socket.emit('set:name', name);
    },
    addMessage(context, message) {
      socket.emit('add:message', message);
    }
  }
});

socket.on('connect', () => {
  console.log('Connected');
});

socket.on('disconnect', reason => {
  console.log(`Disconnected. Reason: ${reason}`);
});

socket.on('error', error => alert(error));

socket.on('joined:room', room => store.commit('setRoom', room));

export default store;
