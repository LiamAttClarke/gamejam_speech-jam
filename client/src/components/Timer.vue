<template>
  <span class="timer" v-show="room.timerRemaining > 0">
    <span v-show="timerMinutes > 0" class="timer__minutes mr-2">{{ timerMinutes.toFixed(0) }}m</span>
    <span class="timer__seconds">{{ timerSeconds.toFixed(0) }}s</span>
  </span>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Timer",
  computed: {
    ...mapGetters(["room", 'timerMinutes', 'timerSeconds']),
  },
};
</script>
