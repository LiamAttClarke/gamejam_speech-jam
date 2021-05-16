<template>
  <span class="timer">
    <span> {{ currentRoom }} </span>
  </span>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "RoundIndicator",
  data: () => ({
    currentRoom: "aa",
  }),
  computed: {
    ...mapGetters(["room"]),
  },
  watch: {
    "$store.state.room": function (newRoom, oldRoom) {

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
