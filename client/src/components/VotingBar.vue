<template>
  <div>
    <h3
      class="mb-4"
    >{{ room.state === 'vote' ? 'Time to Vote! Who is the real AI?' : 'All Is Revealed!'}}</h3>

    <div class="grid-container">
      <v-card
        class="pa-2 vote-btn"
        elevation="5"
        v-for="player in randomizedPlayers"
        :disabled="room.state !== 'vote'"
        @click="() => $store.dispatch('vote', player.id)"
        :key="player.id"
        :class=" { 'voted' : self.vote == player.id}"
      >
        <v-card-title class="d-flex pa-0">
          <v-avatar size="56">
            <span class="text-h5">{{ room.state === 'vote' ? '🤖' : player.avatar }}</span>
          </v-avatar>
          <div>
            {{ player.anonName }}
            <br />
            <span v-if="room.state === 'reveal'">AKA {{ player.name }}</span>
          </div>
        </v-card-title>
        <v-card-title v-show="room.state === 'reveal'">+{{ addedPoints(player) }} points</v-card-title>
      </v-card>
    </div>
  </div>
</template>
<style lang="scss" scoped>
$card-disabled-opacity: 0.9;

.vote-btn {
  border-style: solid;
  border-width: 3px;
  border-color: transparent;
}

.voted {
  border-style: solid;
  border-width: 3px;
  background-color: #c8e6c9 !important;
  border-color: green !important;
}
</style>

<script>
import { mapGetters } from "vuex";
export default {
  name: "VotingBar",
  data: () => {
    return {
      random: Math.random(),
    };
  },
  computed: {
    ...mapGetters(["room", "activePlayers", "self"]),
    randomizedPlayers() {
      return [...this.activePlayers].sort(() => this.random - 0.5);
    },
  },
  methods: {
    addedPoints(player) {
      return player.scoreHistory[player.scoreHistory.length - 1];
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
