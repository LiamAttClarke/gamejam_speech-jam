<template>
  <v-row justify="center">
    <v-dialog
      v-model="revealModal"
      scrollable
      hide-overlay="true"
      max-width="400px"
      persistent="true"
      class="text-center"
    >
      <v-btn v-if="isHost"
        x-large
        class="primary"
      @click="() => $store.dispatch('continue', self.id)">
        Continue to Next Round
      </v-btn>
      <v-card v-else
          class="mx-auto info"
          max-width="344"
        >
          <v-card-title>
            <h1>Waiting on the host to continue</h1>
          </v-card-title>
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
    revealModal: false,
  }),
  computed: {
    ...mapGetters(["room", "self","currentRound","isHost"]),
  },
  methods: {

  },
  watch: {
    room: {
      handler: function () {
        if(this.room.state == "reveal"){
          this.revealModal = true;
        }else{
          this.revealModal = false;
        }
      },
    },
  },
};
</script>
