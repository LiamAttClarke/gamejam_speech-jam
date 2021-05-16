<template>
  <div>
    <h2 class="mb-2">Time to Vote! Who is the real AI?</h2>
    <div class="grid-container">
      <!-- Change Card Colour based on player -->
      <v-card
        class="pa-2"
        color="grey"
        v-for="(player, index) in room.rounds[room.round].playerNames"
        :key="index"
      >
        <div class="d-flex justify-space-between align-center">
          <!-- Put Avatars Here -->
          <v-avatar size="56">
            <img
              alt="Player Avatar"
              src="https://cdn.pixabay.com/photo/2020/06/24/19/12/cabbage-5337431_1280.jpg"
            />
          </v-avatar>
          {{player}}
          <v-card-action>
            <v-btn color="success" @click="$store.dispatch('vote', player)">Vote!</v-btn>
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
  computed: {
    ...mapGetters(["room", "isHost"]),
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
