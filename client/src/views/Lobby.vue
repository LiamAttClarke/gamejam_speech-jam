<template>
  <div>
    <v-card>
      <v-form>
        <v-text-field placeholder="Choose a Username" outlined></v-text-field>
      </v-form>
      <h2>How To Play:</h2>
      <p>This is a game of wits and subterfuge. Can you tell the difference between your friends and the rogue AI Agent?</p>
    </v-card>
    <Menu></Menu>
  </div>
</template>
<script>
import Menu from "../components/Menu.vue";

export default {
  name: "Lobby",
  components: { Menu },
  data: () => ({
    username: "",
    isHost: true,
  }),
  computed: {},
  methods: {},
};
</script>


