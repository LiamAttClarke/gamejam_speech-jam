<template>
  <v-app>
    <v-app-bar color="white" :elevation="1" app clipped-left>
      <v-app-bar-nav-icon class="no-events">
        <v-img contain max-height="50" max-width="50" src="./assets/goat.svg"></v-img>
      </v-app-bar-nav-icon>
      <v-toolbar-title class="mr-8">SpeechJam</v-toolbar-title>
      <RoundIndicator />
    </v-app-bar>
    <PlayerList />
    <v-main class="main">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import RoundIndicator from "./components/RoundIndicator.vue";
import PlayerList from "./components/PlayerList.vue";

export default {
  name: "App",
  components: { RoundIndicator, PlayerList },
  watch: {
    "$store.state.room": function (newRoom, oldRoom) {
      if (newRoom.state !== oldRoom.state) {
        let routeName = null;
        switch (newRoom.state) {
          case "lobby":
            routeName = 'Lobby';
            break;
          case "prepare":
          case "chat":
          case "vote":
          case "reveal":
            routeName = 'Chatroom';
            break;
        }
        if (routeName && routeName !== this.$route.name) {
          this.$router.push({ name: routeName });
        }
      }
    },
  },
};
</script>

<style scoped>
.main {
  height: calc(100vh - 64px);
}
</style>
