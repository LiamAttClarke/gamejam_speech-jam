<template>
  <v-navigation-drawer permanent clipped app width="500">
    <v-list>
      <v-list-item v-for="player in room.players" :key="player.id" class="player-info">
        <v-list-item-icon>
          <v-avatar>
            <!-- Emoji Picked by Player -->
            <v-icon>mdi-emoticon-happy-outline</v-icon>
          </v-avatar>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            <v-icon v-if="player.id === room.host" color="accent darken-1">mdi-crown</v-icon>
            {{player.name}}
          </v-list-item-title>
        </v-list-item-content>

        <!-- Add unique ids for each player -->
        <v-checkbox label="Ready" :value="player.isReady" @change="onReady" color="success"></v-checkbox>
      </v-list-item>
    </v-list>
    <template v-if="isHost" v-slot:append>
      <div class="pa-2">
        <v-btn
          color="accent"
          :disabled="room.players.length < 2"
          block
          @onClick="$store.dispatch('continue')"
        >Force Start</v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "PlayerList",
  computed: {
    ...mapGetters(["room", "isHost"]),
  },
  methods: {
    onReady(isReady) {
      this.$store.dispatch("setReady", isReady);
    },
  },
};
</script>

