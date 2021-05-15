<template>
  <div>
    <div v-if="room.state === 'lobby'" class="d-flex">
      <v-text-field type="text" v-model="name" />
      <v-btn @click="() => $store.dispatch('setName', name)">Set Name</v-btn>
      <hr>
    </div>
    <div v-else-if="room.state === 'chat'" class="d-flex">
      <v-text-field type="text" v-model="message" />
      <v-btn @click="() => $store.dispatch('addMessage', message)">Add Message</v-btn>
      <hr>
    </div>
    <div v-else-if="room.state === 'vote'">
      <h3>Vote For The Imposter</h3>
      <div class="d-flex">
        <v-btn
          v-for="anonName in currentRound.playerNames"
          :key="anonName"
          @click="() => $store.dispatch('voteImposter', anonName)">{{ anonName }}</v-btn>
      </div>

      <hr>
    </div>
    <div v-if="isHost">
      <v-btn @click="() => $store.dispatch('continue')">Continue</v-btn>
      <v-btn @click="() => $store.dispatch('reset')">Reset</v-btn>
    </div>
    <hr>
    <h1>Room State:</h1>
    <pre>{{ roomDebug }}</pre>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

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
