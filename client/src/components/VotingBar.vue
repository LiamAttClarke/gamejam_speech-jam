<template>
  <div>
    <h2
      class="mb-2"
    >{{ room.state === 'vote' ? 'Time to Vote! Who is the real AI?' : 'All Is Revealed!'}}</h2>

    <div class="grid-container">
      <v-card
        1337
        class="pa-2"
        v-for="player in randomizedPlayers"
        :disabled="room.state !== 'vote'"
        @click="() => $store.dispatch('vote', player.id)"
        :key="player.id"
      >
        <v-card-title class="d-flex pa-0">
          <v-avatar size="56">
            <span class="text-h5">{{ room.state === 'vote' ? '🤖' : player.avatar }}</span>
          </v-avatar>
          <span>{{ room.state === 'vote' ? player.anonName : player.name}}</span>
        </v-card-title>
        <v-card-subtitle v-if="room.state === 'reveal'">Score: {{ player.score }}</v-card-subtitle>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "VotingBar",
  data: () => {
    return {
      selected: "",
      random: Math.random(),
    };
  },
  computed: {
    ...mapGetters(["room", "activePlayers"]),
    computed: {
      randomizedPlayers() {
        return this.activePlayers.sort(() => this.random - 0.5);
      },
    },
  },
};
</script>
<style lang="scss" scoped>
.vote-container {
  padding: 1rem;
}
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: 0.5rem;
}
.active {
  color: green;
}
</style>
