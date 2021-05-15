<template>
  <v-navigation-drawer permanent clipped app>
    <v-list color="primary">
      <v-list-item>
        <v-list-item-icon>
          <!-- Emoji Picked by Player -->
          <v-icon color="accent">mdi-emoticon-happy-outline</v-icon>
        </v-list-item-icon>
        <v-list-item-content>Player 1</v-list-item-content>
        <!-- Toggle icon if player is host -->
        <v-icon color="accent darken-1">mdi-crown</v-icon>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "PlayerList",
  computed: {
    bigOrSmall: function () {
      // Check which state the game is in
      return false;
    },
  },
};
</script>

