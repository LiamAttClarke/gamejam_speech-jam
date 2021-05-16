<template>
  <div>
    <v-card class="ma-5">
      <v-card-title>How To Play</v-card-title>
      <v-card-text>
        <v-form>
          <v-row>
            <v-col>
              <v-text-field outlined v-model="name" placeholder="Choose a Username" dense></v-text-field>
            </v-col>
            <v-col>
              <v-btn color="success" @click="onChangeName">Save</v-btn>
            </v-col>
          </v-row>
        </v-form>
        <p>This is a game of wits and subterfuge. Can you tell the difference between your friends and the rogue AI Agent?</p>
        <p>The game will start when everyone is ready or when the Host starts it.</p>
      </v-card-text>
    </v-card>
    <Menu v-if="isHost" class="ma-5"></Menu>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Menu from "../components/Menu.vue";

export default {
  name: "Lobby",
  components: { Menu },
  computed: {
    ...mapGetters(["room", "isHost"]),
  },
  data: () => ({
    name: "",
  }),
  methods: {
    onChangeName() {
      this.$store.dispatch("setName", this.name);
      this.name = "";
    },
  },
};
</script>


