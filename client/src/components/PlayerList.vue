<template>
  <v-navigation-drawer :mini-variant="room.state !== 'lobby'" permanent clipped app width="500">
    <v-list>
      <v-list-item v-for="player in room.players" :key="player.id" class="player-info">
        <v-list-item-icon>
          <!-- Emoji Picked by Player -->
          <v-icon>mdi-emoticon-happy-outline</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            <v-icon v-if="player.id === room.host" color="accent darken-1">mdi-crown</v-icon>
            {{player.name}}
          </v-list-item-title>
        </v-list-item-content>
        <v-checkbox label="Ready" :value="player.isReady" @change="onReady" color="success"></v-checkbox>
      </v-list-item>
    </v-list>
    <template v-if="isHost" v-slot:append>
      <div class="pa-2">
        <v-btn
          color="accent"
          :disabled="room.players.length < 2"
          v-if="room.state === 'lobby'"
          block
          @click="() => $store.dispatch('continue')"
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
<style lang="scss" scoped>
.player-info {
  border-bottom: 1px solid #ccc;
}
</style>
