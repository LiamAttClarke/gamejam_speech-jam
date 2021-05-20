<template>
  <v-dialog
    :value="room.state === 'end'"
    scrollable
    max-width="400px"
  >
    <v-card>
      <v-card-title>Game Over</v-card-title>
      <v-divider></v-divider>
      <v-card-text style="height: 300px;">
        List of players
      </v-card-text>
      <v-card-actions v-if="isHost">
        <v-btn
        x-large
        class="primary"
        @click="() => $store.dispatch('continue')">
        Continue to Lobby
      </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "EndModal",
  computed: {
    ...mapGetters(["room", "isHost"]),
  },
};
</script>
