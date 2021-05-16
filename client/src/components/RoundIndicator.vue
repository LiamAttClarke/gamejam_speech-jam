<template>
  <span>
    <h1> {{ currentRoom }} <span v-if="currentRound >= 0">Round: {{ currentRound }} </span></h1>
  </span>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "RoundIndicator",
  data: () => ({
    currentRoom: "",
    currentRound: -1,
  }),
  computed: {
    ...mapGetters(["room"]),
  },
  watch: {
    "$store.state.room": function (newRoom, oldRoom) {
      this.currentRound = newRoom.round;
      switch (newRoom.state) {
        case "lobby":
          this.currentRoom = "Lobby";
          break;
        case "prepare":
          this.currentRoom = "Prepare";
          break;
        case "chat":
          this.currentRoom = "Chat";
          break;
        case "vote":
          this.currentRoom = "Vote";
          break;
        case "reveal":
          this.currentRoom = "Reveal";
          break;
      }
    },
  },
};
</script>
