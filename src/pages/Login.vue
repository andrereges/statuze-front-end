<template>
  <q-page class="bg-light window-height window-width row justify-center items-center">
    <div class="column">
      <div class="row">
        <h5 class="text-h5 q-my-md">Login</h5>
      </div>
      <div class="row">
        <q-card square bordered class="q-pa-lg shadow-1">
          <q-card-section>
            <q-input v-model="token" type="text" label="token" />
          </q-card-section>
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input square filled clearable v-model="email" type="email" label="email" />
              <q-input square filled clearable v-model="password" type="password" label="password" />
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-md">
            <q-btn v-on:click="login()" unelevated color="light-green-7" size="lg" class="full-width" label="Login" />
          </q-card-actions>
          <q-card-actions class="q-px-md">
            <q-btn v-on:click="logout()" unelevated color="light-blue-3" size="lg" class="full-width" label="Logout" />
          </q-card-actions>
          <q-card-section class="text-center q-pa-none">
            <p class="text-grey-3">Not reigistered? Created an Account</p>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<style>
  .q-card {
      width: 360px;
    }
</style>

<script>
import { LocalStorage } from 'quasar'

export default {
  name: 'Login',
  data () {
    return {
      email: 'asantos@lliege.com.br',
      password: 'change123',
      token: ''
    }
  },
  methods: {
    login () {
      this.$axios.post('/auth/login',
        {
          email: this.email,
          password: this.password
        }
      )
        .then((response) => {
          LocalStorage.set('statuze_access_token', response.data.access_token)
          this.token = response.data.access_token
        })
        .catch((error) => console.log(error))
    },
    logout () {
      this.$axios.post('/auth/logout')
        .then((response) => {
          LocalStorage.removeItem('statuze_access_token')
          this.token = ''
        })
        .catch((error) => console.log(error))
    }
  }
}
</script>
