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
      timerDuration: 0,
      timerRemaining: 0,
      players: [],
      rounds: []
    }
  },
  getters: {
    room: state => state.room,
    activePlayers: state => state.room.players.filter(p => !p.isSpectator),
    self: state => state.room.players.find(p => p.id === socket.id),
    isHost: state => state.room.host === socket.id,
    currentRound: state => (state.room.rounds.length ? state.room.rounds[state.room.round] : null),
    timerProgress: state => state.room.timerRemaining / state.room.timerDuration,
    timerMinutes: state => Math.floor(state.room.timerRemaining / 60),
    timerSeconds: state => Math.floor(state.room.timerRemaining % 60)
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
    setReady(context, isReady) {
      socket.emit('set:ready', isReady);
    },
    addMessage(context, message) {
      socket.emit('add:message', message);
    },
    vote(context, playerId) {
      socket.emit('set:vote', playerId);
    },
    setOptions(context, options) {
      socket.emit('set:options', options);
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

socket.on('error', error => {
  console.error(error);
  alert(error);
});

socket.on('update:state', room => {
  console.log(room);
  store.commit('setRoom', room);
});

export default store;
