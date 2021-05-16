<template>
  <v-app>
    <v-app-bar color="white" elevation="2" app clipped-left>
      <v-app-bar-nav-icon class="no-events">
        <v-img contain max-height="50" max-width="50" src="./assets/goat.svg"></v-img>
      </v-app-bar-nav-icon>
      <v-toolbar-title>SpeechJam</v-toolbar-title>
      <v-spacer></v-spacer>
      <RoundIndicator></RoundIndicator>
      <v-spacer></v-spacer>
      <Timer></Timer>
    </v-app-bar>
    <PlayerList></PlayerList>
    <v-main style="height: calc(100vh - 64px);">
      <router-view />
    </v-main>
    <!-- <v-footer app class="primary">
      <v-col class="text-center">
        <p>
          Created by
          <a href="#">ToJelly</a> for ToJam 2021
        </p>
      </v-col>
    </v-footer> -->
  </v-app>
</template>

<script>
import Timer from "./components/Timer.vue";
import RoundIndicator from "./components/RoundIndicator.vue";
import PlayerList from "./components/PlayerList.vue";

export default {
  name: "App",
  components: { Timer, RoundIndicator, PlayerList },
  watch: {
    "$store.state.room": function (newRoom, oldRoom) {
      if (newRoom.state !== oldRoom.state) {
        switch (newRoom.state) {
          case "lobby":
            this.$router.push({ name: "Lobby" });
            break;
          case "prepare":
          case "chat":
          case "vote":
          case "reveal":
            this.$router.push({ name: "Chatroom" });
            break;
        }
      }
    },
  },
};
</script>

