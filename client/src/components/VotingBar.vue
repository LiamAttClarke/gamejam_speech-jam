<template>
  <div>
    <h2 class="mb-2">Time to Vote! Who is the real AI?</h2>

    <v-btn-toggle v-model="selected" class="grid-container">
      <!-- Change Card Colour based on player -->
      <v-card class="pa-2" v-for="player in room.chatPlayers" :key="player.id">
        <div class="d-flex justify-space-between align-center">
          <!-- Put Avatars Here -->
          <v-avatar size="56">
            <span class="text-h5">{{ room.state === 'vote' ? '🤖' : player.avatar }}</span>
          </v-avatar>
          <b>{{ room.state === 'vote' ? player.anonName : player.name }}</b>
          <v-card-action>
            <v-btn
              v-if="room.state === 'vote' && selected !== player"
              color="primary"
              @click="() => $store.dispatch('vote', player.id)"
            >Vote</v-btn>
          </v-card-action>
        </div>
      </v-card>
    </v-btn-toggle>
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
    ...mapGetters(["room"]),
  },
};
</script>
<style lang="scss" scoped>
.vote-container {
  padding: 1rem;
}
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  grid-gap: 0.5rem;
}
</style>
