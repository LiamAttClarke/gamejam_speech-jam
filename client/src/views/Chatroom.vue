<template>
  <div class="chatroom">
    <div class="messages">
      <v-card class="topic py-2 px-4 mb-2" v-if="currentRound">
        <h2 class="mb-2">Topic</h2>
        <p class="mb-0">{{ currentRound.topic }}</p>
      </v-card>
      <ul class="messages__list">
        <li v-for="(message, index) in currentRound.messages" :key="index">
          <b>{{ message.player.anonName }}</b>
          <p>{{ message.message }}</p>
        </li>
      </ul>
    </div>
    <div class="chatbar">
      <div class="chatbar__input" v-if="room.state === 'prepare' || room.state === 'chat'">
        <v-text-field
          :disabled="room.state === 'prepare'"
          outlined
          dense
          class="chat_input mr-4"
          placeholder="Type Here..."
          hide-details="true"
          :value="message"
          v-model="message"
          @keyup.enter="sendMessage"
        ></v-text-field>
        <v-btn
          color="primary"
          :disabled="room.state !== 'chat' "
          @click="sendMessage"
        >Send</v-btn>
      </div>
      <VotingBar v-else></VotingBar>
      <div v-if="isHost && room.state === 'reveal'" class="mt-4 d-flex justify-end">
        <v-btn
          x-large
          class="primary"
          @click="() => $store.dispatch('continue')">
          Continue
        </v-btn>
      </div>
    </div>
    <EndModal />
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
  padding: 16px;
}

.chatbar {
  flex-grow: 0;
  flex-shrink: 0;
  padding: 16px;
  border-top: solid 1px #ccc;
}

.chatbar__input {
  display: flex;
  align-items: center;
}

.chatbar__input > * {
  margin-right: 8px;
}

.chatbar__input:last-child {
  margin-right: 0;
}
</style>

<script>
import { mapGetters } from "vuex";
import VotingBar from "../components/VotingBar.vue";
import EndModal from "../components/EndModal.vue";

export default {
  name: "ChatRoom",
  components: { VotingBar, EndModal },
  data: () => ({
    message: "",
  }),
  computed: {
    ...mapGetters(["room", "currentRound","isHost"]),
  },
  methods: {
    scrollToEnd() {
      if (this.room.state === 'chat') {
        var container = this.$el.querySelector(".messages");
        container.scrollTop = container.scrollHeight + container.lastElementChild.offsetTop;
      }
    },
    sendMessage() {
      if (this.room.state === "chat") {
        this.$store.dispatch("addMessage", this.message);
        this.message = "";
      }
    }
  },
  watch: {
    currentRound: {
      handler: function () {
        // need to give some time or else we are always off by 1 element
        setTimeout(() => this.scrollToEnd(), 1000);
      },
    },
  },
};
</script>

