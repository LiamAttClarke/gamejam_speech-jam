<template>
  <v-dialog :value="room.state === 'end'" scrollable max-width="400px">
    <v-card>
      <v-card-title>Game Over</v-card-title>
      <v-divider></v-divider>
      <v-list>
        <v-list-item
          v-for="player in room.players"
          :key="player.id"
          class="player-info"
          :class=" { 'grey lighten-3' : self.id == player.id}"
        >
          <v-list-item-icon>
            <span class="text-h5">{{ player.avatar }}</span>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>
              {{player.name}}
              <span v-if="self.id === player.id">(You)</span>
            </v-list-item-title>
            <v-list-item-title>
              <span>Score: {{player.score}}</span>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-card-actions>
        <v-btn
          x-large
          block
          class="primary"
          @click="() => $store.dispatch('continue')"
        >Continue to Lobby</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "EndModal",
  computed: {
    ...mapGetters(["room", "self", "isHost"]),
  },
};
</script>
