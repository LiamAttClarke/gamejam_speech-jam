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
      <v-btn
        x-large
        class="primary"
      @click="() => $store.dispatch('continue', self.id)">
        Continue to Next Round
      </v-btn>
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
    ...mapGetters(["room", "self","currentRound"]),
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
