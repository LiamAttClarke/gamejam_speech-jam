<template>

  <div fill-height>
    <v-toolbar
      dense
      floating
    >
      <v-text-field
        hide-details
        prepend-icon="mdi-magnify"
        single-line
      ></v-text-field>

      <v-btn icon>
        <v-icon>mdi-crosshairs-gps</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-toolbar>
     <v-card
        :z-index="-2"
        class="d-flex flex-column flex-grow-0 flex-shrink-0"
        flat
        tile
        height="100%"
      >
        <v-card
          :class="1"
          class="pa-2 mb-auto"
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
        <v-card
          class="pa-2 align-end ma-auto"
          flat
          tile
        >
        <p>tests</p>
        <p>tests</p>
        <p>tests</p>
        <p>tests</p>
        <p>tests</p>
        <p>tests</p>
        <p>tests</p>
        <p>tests</p>
        <p>tests</p>
        <p>tests</p>

        </v-card>
        <v-card
          :class="1"
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
          :value="message"
          v-model="message"
          append-outer-icon="mdi-send"
          @keyup.enter="sendMessage"
          @click:append-outer="sendMessage"
        ></v-text-field>
        </v-card>
      </v-card>

  </div>

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

