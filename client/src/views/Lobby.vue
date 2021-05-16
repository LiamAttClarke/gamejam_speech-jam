<template>
  <div>
    <v-card>
      <v-card-title>How To Play</v-card-title>
      <v-card-text>
        <v-form>
          <v-row>
            <v-col>
              <v-text-field v-model="name" placeholder="Choose a Username" outlined dense></v-text-field>
            </v-col>
            <v-col>
              <v-btn color="success" @click="onChangeName">Save</v-btn>
            </v-col>
          </v-row>
        </v-form>This is a game of wits and subterfuge. Can you tell the difference between your friends and the rogue AI Agent?
      </v-card-text>
    </v-card>
    <Menu v-if="isHost"></Menu>
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


