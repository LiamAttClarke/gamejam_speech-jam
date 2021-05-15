<template>
  <div>
    <h1>Room State:</h1>
    <pre>{{ roomDebug }}</pre>
    <div v-if="room.state === 'lobby'">
      <input type="text" v-model="name">
      <button @click="() => $store.dispatch('setName', name)">Set Name</button>
      <hr>
    </div>
    <div v-else-if="room.state === 'chat'">
      <input type="text" v-model="message">
      <button @click="() => $store.dispatch('addMessage', message)">Add Message</button>
      <hr>
    </div>
    <div v-else-if="room.state === 'vote'">
      <h3>Vote For The Imposter</h3>
      <button
        v-for="anonName in currentRound.playerNames"
        :key="anonName"
        @click="() => $store.dispatch('voteImposter', anonName)">{{ anonName }}</button>
      <hr>
    </div>
    <div v-if="isHost">
      <button @click="() => $store.dispatch('continue')">Continue</button>
      <button @click="() => $store.dispatch('reset')">Reset</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Debug',
  computed: {
    ...mapGetters([
      'roomDebug',
      'room',
      'isHost',
      'currentRound'
    ]),
  },
  data: () => ({
    name: '',
    message: '',
  }),
}
</script>
