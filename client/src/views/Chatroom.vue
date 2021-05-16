<template>
  <div class="chatroom">
    <div class="messages">
      <div class="topic" v-if="currentRound">
        <h2>Topic</h2>
        <p>{{ currentRound.topic }}</p>
      </div>
      <ul class="messages__list">
        <li v-for="(message, index) in currentRound.messages" :key="index">
          <b>{{ message.playerName }}</b>
          <p>{{ message.message }}</p>
        </li>
      </ul>
    </div>
    <div class="chatbar">
      <v-text-field
        outlined
        dense
        class="chat_input align-self-end mx-auto"
        placeholder="Type Here..."
        :disabled="room.state !== 'chat'"
        hide-details="true"
        :value="message"
        v-model="message"
        append-outer-icon="mdi-send"
        @keyup.enter="sendMessage"
        @click:append-outer="sendMessage"
      ></v-text-field>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chatroom {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.messages {
  flex-grow: 1;
  flex-shrink: 1;
  overflow-y: auto;
  padding: 16px;
}

.messages__list {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.chatbar {
  flex-grow: 0;
  flex-shrink: 0;
  padding: 16px;
  border-top: solid 1px #ccc;
}
</style>

<script>
/*
  <ChatList
      class="d-flex align-end flex-row mx-auto overflow-hidden" >
      </ChatList>
      */
import { mapGetters } from "vuex";

export default {
  name: "ChatRoom",
  data: () => ({
    sticky: true,
    message: "",
  }),
  computed: {
    ...mapGetters(["room", 'currentRound']),
  },
  methods: {
    sendMessage() {
      this.$store.dispatch("addMessage", this.message);
      this.message = "";
    },
  },
};
</script>

