<template>
  <v-row justify="center">
    <v-dialog
      v-model="endDialog"
      scrollable
      max-width="400px"
    >
      <v-card>
        <v-card-title>Game Over</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 300px;">
          List of players
        </v-card-text>
        <v-card-actions v-if="isHost">
          <v-btn
          x-large
          class="primary"
        @click="() => $store.dispatch('continue', self.id)">
          Continue to Lobby
        </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "EndModal",
  data: () => ({
    dialogm1: '',
    endDialog: false,
  }),
  computed: {
    ...mapGetters(["room", "currentRound","isHost"]),
  },
  methods: {
    openEndDialog () {
      //this.$store.dispatch("continue", true);
      //this.$store.dispatch("continue", true); // emit the event to the bus
    }
  },
  watch: {
    room: {
      handler: function () {
        if(this.room.state == "end"){
          this.endDialog=true;
        }else{
          this.endDialog=false;
        }
      },
    },
  },
};
</script>
