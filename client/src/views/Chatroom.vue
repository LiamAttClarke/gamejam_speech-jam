<template>
  <div class="chat d-flex px-4" style="height: 100%">
    <v-text-field
      outlined
      dense
      class="chat_input align-self-end"
      placeholder="Type Here..."
      :disabled="room.state === 'vote'"
      :value="message"
      v-model="message"
      append-outer-icon="mdi-send"
      @keyup.enter="sendMessage"
      @click:append-outer="sendMessage"
    ></v-text-field>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "ChatRoom",
  data: () => ({
    message: "",
  }),
  computed: {
    ...mapGetters(["room"]),
  },
  methods: {
    sendMessage() {
      this.$store.dispatch("addMessage", { message: this.message });
      this.message = "";
    },
  },
};
</script>

