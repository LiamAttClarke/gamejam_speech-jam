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
      rounds: [],
    }
  },
  getters: {
    room: (state) => state.room,
    roomDebug: (state) => JSON.stringify(state.room, null, 2),
    self: (state) => state.room.players.find((p) => p.id === socket.id),
    isHost: (state) => state.room.host === socket.id,
    currentRound: (state) => state.room.rounds.length ? state.room.rounds[state.room.round] : null,
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
    },
    vote(context, anonName) {
      socket.emit('set:vote', anonName);
    },
    continue(context) {
      socket.emit('continue');
    },
    reset(context) {
      socket.emit('reset');
    }
  }
});

socket.on('connect', () => {
  console.log('Connected');
});

socket.on('disconnect', reason => {
  console.log(`Disconnected. Reason: ${reason}`);
});

socket.on('error', (error) => {
  console.error(error);
  alert(error);
});

socket.on('update:state', room => store.commit('setRoom', room));

export default store;
