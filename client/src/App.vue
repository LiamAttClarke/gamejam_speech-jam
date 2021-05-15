<template>
  <div id="app">
    <h1>Room:</h1>
    <ul>
      <li><b>Id: </b><span>{{ room.id }}</span></li>
      <li><b>State: </b><span>{{ room.state }}</span></li>
      <li><b>Round: </b><span>{{ room.round }}</span></li>
      <li><b>Host Id: </b><span>{{ room.host }}</span></li>
      <li>
        <b>Players: </b>
        <ul>
          <li v-for="p in room.players" :key="p.id">
            <div><b>id:</b> {{ p.id }}</div>
            <div><b>name:</b> {{ p.name }}</div>
            <div><b>isSpectator:</b> {{ p.isSpectator }}</div>
            <div><b>isReady:</b> {{ p.isReady }}</div>
            <div><b>score:</b> {{ p.score }}</div>
          </li>
        </ul>
      </li>
    </ul>
    <router-view/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'room'
    ]),
  }
}
</script>

<style lang="scss">
#app {
  font-family: sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
