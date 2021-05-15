<template>
  <div class="home">
   <b-form @submit="onSubmit" @reset="onReset">
      <b-form-group
        id="input-group-1"
        label="Username:"
        label-for="input-1"
        description="Please choose a username"
      >
        <b-form-input
          id="input-1"
          v-model="username"
          type="username"
          placeholder="Username"
          required
        ></b-form-input>
      </b-form-group>
    </b-form>
  </div>
</template>
<script>


export default {
  name: 'Lobby',
  components: {},
  data: () => ({
    username: '',
  }),
  computed: {
  },
  methods: {
  },
}
</script>


