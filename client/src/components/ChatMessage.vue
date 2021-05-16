<template>

  <v-list-item>
    <v-list-item-avatar v-if="reverse == false">
        <v-img :src="avatar"></v-img>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title>{{ message.name }}</v-list-item-title>
        <v-list-item-subtitle>{{ message.message }}</v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-avatar v-if="reverse == true">
        <v-img :src="avatar"></v-img>
      </v-list-item-avatar>
  </v-list-item>

</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "ChatMessage",
  computed: {
    ...mapGetters(["room", "isHost"]),
  },
  props: {
    message: Object,
  },
  data: () => ({
    avatar: 'https://placekitten.com/32/32',
    reverse: true,
  }),
  methods: {
    setMessage (avatar,name,message,reverse) {
      this.avatar = avatar;
      this.name = name;
      this.message = message;
      this.reverse = reverse;
    },
  },

};
</script>
