<template>
  <div>
    <v-card class="ma-5">
      <v-card-title>How To Play</v-card-title>
      <v-card-text>
        <v-form>
          <v-row>
            <v-col>
              <v-text-field outlined v-model="name" placeholder="Choose a Username" dense @keydown.enter.prevent="onChangeName"></v-text-field>
            </v-col>
            <v-col>
              <v-btn @click.prevent="onChangeName">Save</v-btn>
            </v-col>
          </v-row>
        </v-form>
        <p>This is a game of wits and subterfuge. Can you tell the difference between your friends and the rogue AI Agent?</p>
        <p>
          <ol>
            <li><strong>Lobby:</strong> The game will start when everyone is ready or when the Host starts it.</li>
            <li><strong>Chat Round:</strong> Everyone gets the same topic and gets to prepare messages, this is the time to trick your friends by mimicking GPT2.</li>
            <li><strong>Vote Round:</strong> Use chat log evidence to deduce the bot and convince your friends to vote for you!</li>
            <li><strong>Reveal Round:</strong> The bot is revealed and points are awarded.
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  color="primary"
                  dark
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-information
                </v-icon>
              </template>
              <span>200 for a correct vote, 100 for being voted as bot</span>
            </v-tooltip></li>
          </ol>
        </p>
        <p><strong>Credits:</strong> Liam Clarke, Daria Anikanova, Victor Nguyen</p>
        <p><strong>Created for 2021 ToJam</strong></p>
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


