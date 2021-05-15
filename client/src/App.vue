<template>
  <v-app>
    <v-app-bar color="primary" flat app clipped-left>
      <v-app-bar-nav-icon class="no-events">
        <v-img contain max-height="50" max-width="50" src="./assets/goat.svg"></v-img>
      </v-app-bar-nav-icon>
      <v-toolbar-title>SpeechJam</v-toolbar-title>
      <v-spacer></v-spacer>
      <Timer></Timer>
    </v-app-bar>
    <PlayerList></PlayerList>
    <v-main class="d-inline-flex">
      <router-view />
    </v-main>
    <v-footer app class="primary">
      <v-col class="text-center">
        <p>
          Created by
          <a href="#">ToJelly</a> for ToJam 2021
        </p>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
import Timer from "./components/Timer.vue";
import PlayerList from "./components/PlayerList.vue";

export default {
  components: { Timer, PlayerList },
  name: "App",
  data: () => ({
    //
  }),
};
</script>

