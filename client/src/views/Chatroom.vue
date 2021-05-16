<template>
  <div class="chatroom">
    <div class="messages">
      <v-card class="topic py-2 px-4 mb-2" v-if="currentRound">
        <h2>Topic</h2>
        <p>{{ currentRound.topic }}</p>
      </v-card>
      <ul class="messages__list">
        <li v-for="(message, index) in currentRound.messages" :key="index">
          <b>{{ message.playerName }}</b>
          <p>{{ message.message }}</p>
        </li>
      </ul>
    </div>
    <div class="chatbar">
      <v-text-field
        v-if="room.state === 'chat' || room.state === 'prepare'"
        :disabled="room.state === 'prepare'"
        outlined
        dense
        class="chat_input align-self-end mx-auto"
        :placeholder="room.state === 'prepare' ? 'Read the Topic First' : 'Type Here...'"
        hide-details="true"
        :value="message"
        v-model="message"
        @keyup.enter="room.state === 'chat' ? sendMessage : ''"
      >
        <!-- Slot template, append outer -->
        <v-btn @click="sendMessage">Submit</v-btn>
      </v-text-field>
      <VotingBar v-if="room.state === 'vote'"></VotingBar>
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
import VotingBar from "../components/VotingBar.vue";

export default {
  name: "ChatRoom",
  components: { VotingBar },
  data: () => ({
    message: "",
  }),
  computed: {
    ...mapGetters(["room", "currentRound"]),
  },
  methods: {
    scrollToEnd() {
      var container = this.$el.querySelector(".messages");
      container.scrollTop =
        container.scrollHeight + container.lastElementChild.offsetTop;
    },
    sendMessage() {
      this.$store.dispatch("addMessage", this.message);
      this.message = "";
    },
  },
  watch: {
    currentRound: {
      handler: function () {
        //need to give some time or else we are always off by 1 element
        setTimeout(() => this.scrollToEnd(), 100);
      },
    },
  },
};
</script>

