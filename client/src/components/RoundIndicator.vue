<template>
  <span
    class="round-indicator"
    v-if="!['lobby', 'end'].includes(room.state)"
  >
    <span class="round-indicator__info">Round: <span class="round-indicator__info-value">{{ room.round + 1 }}</span></span>
    <span class="round-indicator__info">Stage: <span class="round-indicator__info-value">{{ room.state.toUpperCase() }}</span></span>&nbsp;
    <span class="round-indicator__info" v-if="room.timerRemaining > 0">Time Left: <span class="round-indicator__info-value"><Timer /></span></span>
  </span>
</template>

<script>
import { mapGetters } from "vuex";
import Timer from "./Timer.vue";

export default {
  name: "RoundIndicator",
  components: { Timer },
  computed: {
    ...mapGetters(["room"]),
  },
};
</script>

<style scoped>
.round-indicator__info {
  margin-right: 8px;
}

.round-indicator__info-value {
  font-weight: bold;
}
</style>
