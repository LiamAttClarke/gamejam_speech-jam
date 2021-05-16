<template>
  <div>
    <v-card>
      <v-card-title>Game Settings</v-card-title>
      <v-card-text>
        <v-form>
          <v-row>
            <v-col>
              <v-select
                label="Prep Time"
                dense
                :value="room.options.prepareTime"
                outlined
                :items="prepareTimeOptions"
                @change="(v) => $store.dispatch('setOptions', { prepareTime: v })"
              ></v-select>
            </v-col>
            <v-col>
              <v-select
                label="Chat Time"
                dense
                :value="room.options.chatTime"
                outlined
                :items="chatTimeOptions"
                @change="(v) => $store.dispatch('setOptions', { chatTime: v })"
              ></v-select>
            </v-col>
            <v-col>
              <v-select
                label="Vote Time"
                dense
                :value="room.options.voteTime"
                outlined
                :items="voteTimeOptions"
                @change="(v) => $store.dispatch('setOptions', { voteTime: v })"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-slider
                :value="room.options.rounds"
                label="Number of Rounds"
                thumb-label
                style="width:50%"
                max="50"
                min="1"
                @change="(v) => $store.dispatch('setOptions', { rounds: v })"
              >
                <template v-slot:append>
                  <v-text-field
                    v-model="room.options.rounds"
                    class="mt-0 pt-0"
                    hide-details
                    outlined
                    single-line
                    dense
                    readonly
                    type="number"
                    style="width: 60px"
                  ></v-text-field>
                </template>
              </v-slider>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "Menu",
  computed: {
    ...mapGetters(["room", "isHost"]),
  },
  data: () => ({
    prepareTimeOptions: [
      { text: "5 seconds", value: 5 },
      { text: "10 seconds", value: 10 },
      { text: "15 seconds", value: 15 },
      { text: "20 seconds", value: 20 },
      { text: "30 seconds", value: 30 },
    ],
    chatTimeOptions: [
      { text: "30 seconds", value: 30 },
      { text: "1 minute", value: 60 },
      { text: "2 minutes", value: 60 * 2 },
      { text: "5 minutes", value: 60 * 5 },
      { text: "10 minutes", value: 60 * 10 },
    ],
    voteTimeOptions: [
      { text: "1 minute", value: 60 * 1 },
      { text: "2 minutes", value: 60 * 2 },
      { text: "3 minutes", value: 60 * 3 },
      { text: "4 minutes", value: 60 * 4 },
      { text: "5 minutes", value: 60 * 5 },
    ],
  }),
  methods: {},
};
</script>
