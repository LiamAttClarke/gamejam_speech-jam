<template>

    <v-container>
     <v-list three-line v-if="currentRound">

        <template v-for="(message, index) in currentRound.messages">
          <ChatMessage
            :key="index"
            :message="message">
          </ChatMessage>
        </template>

      </v-list>

    </v-container>

</template>

<script>
import { mapGetters } from "vuex";
import ChatMessage from "./ChatMessage.vue";

export default {
  name: "ChatList",
  components: { ChatMessage },
  computed: {
    ...mapGetters(["room", "currentRound"]),
  },
};
</script>
