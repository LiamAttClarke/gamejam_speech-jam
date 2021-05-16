<template>

  <v-container fill-height>

     <v-card
        :z-index="-2"
        :absolute="absolute"
        class="d-flex flex-column flex-grow-0 flex-shrink-0"
        flat
        tile
        height="100%"
      >
        <v-card
          :class="1"
          class="pa-2 mb-0"
          tile
        >
         <v-card-text>
            <p class="display-1 text--primary">
              Topic:
            </p>
            <div class="text--primary">
              well meaning and kindly.
              "a benevolent smile"
            </div>
          </v-card-text>
        </v-card>
        <v-container
          class="pa-2 align-end overflow-y-auto mt-auto"
          flat
          tile
        >
        <ChatList>
      </ChatList>

        </v-container>

        <v-card
          :class="1"
          :absolute="absolute"
          class="pa-2 'mt-auto"
          flat
          tile
        >
          <v-text-field
          outlined
          dense
          class="chat_input align-self-end mx-auto"
          placeholder="Type Here..."
          :disabled="room.state === 'vote'"
          hide-details="true"
          :value="message"
          v-model="message"
          append-outer-icon="mdi-send"
          @keyup.enter="sendMessage"
          @click:append-outer="sendMessage"
        ></v-text-field>
        </v-card>
      </v-card>

  </v-container>

</template>

<script>
/*
  <ChatList
      class="d-flex align-end flex-row mx-auto overflow-hidden" >
      </ChatList>
      */
import { mapGetters } from "vuex";
import ChatList from "../components/ChatList";

export default {
  name: "ChatRoom",
  components: {ChatList},
  data: () => ({
    sticky: true,
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

