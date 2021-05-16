<template>

    <v-container>
     <v-list three-line>

        <template v-for="(message, index) in messages">

          <ChatMessage
          v-bind:key="index"
          v-bind:name="message.name">
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
    ...mapGetters(["room", "isHost"]),
  },
  data: () => ({
    messages: [{name:"testing"},{},{}

    ],
  }),
  methods: {
    addMessage () {
      console.log(this.messages);
      //this.messages.push()
      //this.marker = !this.marker
    },
  },

};
</script>
