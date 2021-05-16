<template>
  <div>
    <h2 class="mb-2">Time to Vote! Who is the real AI?</h2>

    <div class="grid-container">
      <v-card
        class="pa-2"
        v-for="player in activePlayers"
        :disabled="room.state !== 'vote'"
        @click="() => $store.dispatch('vote', player.id)"
        :key="player.id"
      >
        <v-card-title class="d-flex pa-0">
          <v-avatar size="56">
            <span class="text-h5">{{ room.state === 'vote' ? '🤖' : player.avatar }}</span>
          </v-avatar>
          <span>{{ player.anonName }}</span>
        </v-card-title>
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
    };
  },
  computed: {
    ...mapGetters(["room", "activePlayers"]),
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
