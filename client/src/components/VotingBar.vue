<template>
  <v-card>
    <v-card-title>Time to Vote! Who is the real AI?</v-card-title>
    <div class="grid-container">
      <v-btn
        v-for="(player, index) in room.rounds[room.round].playerNames"
        :key="index"
        @click="$store.dispatch('vote', player)"
      >{{player}}</v-btn>
    </div>
  </v-card>
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
.grid-container {
  display: grid;
}
</style>
