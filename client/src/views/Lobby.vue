<template>
  <div>
    <v-card class="ma-5">
      <v-card-title>How To Play</v-card-title>
      <v-card-text>
        <p>This is a game of wits and subterfuge. Can you tell the difference between your friends and the rogue AI Agent?</p>
        <p>Compete with friends to blend in with an AI in a chatroom. Vote on the real AI, get points for guessing correctly and for tricking your opponents.</p>
        <p>
          <ol>
            <li><strong>Lobby:</strong> Don't forget to set your username! The game will start when everyone is ready or when the Host starts.</li>
            <li><strong>Chat:</strong> Everyone gets the same topic and gets to prepare messages, this is the time to trick your friends by mimicking GPT2.</li>
            <li><strong>Vote:</strong> Use chat log evidence to deduce the bot and convince your friends to vote for you!</li>
            <li><strong>Reveal:</strong> The bot is revealed and points are awarded.
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
        <p>
          <span class="mr-1">Created by</span>
          <span class="mr-1"><a href="https://github.com/LiamAttClarke" target="_blank">Liam Clarke,</a> </span>
          <span class="mr-1"><a href="https://github.com/DariaAnikanova" target="_blank">Daria Anikanova,</a> </span>
          <span class="mr-1"><a href="https://github.com/nguvictor" target="_blank">Victor Nguyen</a> </span>
          <span>for <a href="https://tojam.ca">ToJam 2021</a></span>
        </p>
        <v-form>
          <v-row>
            <v-col>
              <v-text-field outlined v-model="name" placeholder="Choose a Username" dense @keydown.enter.prevent="onChangeName"></v-text-field>
            </v-col>
            <v-col>
              <v-btn color="success" @click.prevent="onChangeName">Save</v-btn>
            </v-col>
          </v-row>
        </v-form>
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


