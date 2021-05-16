<template>
  <div>
    <h2 class="mb-2">Time to Vote! Who is the real AI?</h2>

    <div class="grid-container">
      <!-- Change Card Colour based on player -->
      <v-card class="pa-2" v-for="player in activePlayers" :key="player.id">
        <div class="d-flex justify-space-between align-center">
          <!-- Put Avatars Here -->
          <v-avatar size="56">
            <v-img src="http://placekitten.com/200/300"></v-img>
          </v-avatar>
          <span>{{ player.anonName }}</span>
          <v-card-action>
            <v-btn
              v-if="selected !== player"
              color="primary"
              @click="() => $store.dispatch('vote', player.id)"
            >Vote</v-btn>
          </v-card-action>
        </div>
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
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  grid-gap: 0.5rem;
}
</style>
