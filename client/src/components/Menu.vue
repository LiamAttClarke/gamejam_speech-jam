<template>
  <div>
    <v-card>
      <v-form>
        <h2>Game Configeration</h2>
        <v-select v-model="timerDurations"></v-select>
      </v-form>
    </v-card>
  </div>
</template>
<script>
export default {
  name: "Menu",
  data: () => ({
    timerDurations: {
      fast: [30, 30, 30],
      normal: [30, 30, 30],
      long: [30, 30, 30],
    },
  }),
  methods: {
    hostGame() {
      console.log("Make me host!");
    },
    joinGame() {
      console.log("Let me in!");
    },
  },
};
</script>
