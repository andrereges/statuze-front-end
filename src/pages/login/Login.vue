<template>
  <q-page class="flex flex-center">
    <q-card style="width: 350px">

      <q-bar class="bg-black glossy unelevated text-white">
        <q-label>Autenticação</q-label>

        <q-space />

        <q-btn
          glossy unelevated
          color="grey-4"
          text-color="black"
          icon="lock"
          @click="showDialog = !showDialog"
        />

      </q-bar>

      <q-card-section>
        <q-input outlined
          ref="email"
          v-model="email"
          label="Email*"
          placeholder=""
          hint=""
          :rules="[
            val => !!val || 'Email obrigatório',
            val => this.validateEmail(val) || 'Formato de email inválido'
          ]" />
      </q-card-section>

      <q-card-section>
        <q-input outlined
          ref="password"
          v-model="password"
          label="Senha*"
          type="password"
          placeholder=""
          hint=""
          :rules="[val => !!val || 'Senha obrigatória']" />
      </q-card-section>

      <q-card-section>
        <q-btn
          glossy unelevated
          push
          color="primary"
          text-color="black"
          label="Entrar"
          class="full-width"
          size="lg"
          @click="login"
        />
      </q-card-section>

    </q-card>
  </q-page>
</template>

<script>
import isEmail from 'validator/lib/isEmail'
import { Notify, LocalStorage } from 'quasar'

export default {
  name: 'Login',

  data () {
    return {
      email: 'asantos@lliege.com.br',
      password: 'change123'
    }
  },
  methods: {
    validateEmail (value) {
      return isEmail(value)
    },
    login () {
      const emailSelector = this.$refs.email
      const passwordSelector = this.$refs.password

      emailSelector.validate()
      passwordSelector.validate()

      if (emailSelector.hasError || passwordSelector.hasError) {
        return false
      } else {
        const data = {
          email: this.email,
          password: this.password
        }

        this.tryAuth(data)
      }
    },
    tryAuth (payload) {
      this.$axios.post('/auth/login', payload)
        .then((response) => {
          LocalStorage.set('statuze_user', response.data.logged_user)
          LocalStorage.set('statuze_access_token', response.data.access_token)
          LocalStorage.set('statuze_token_expires_in', response.data.expires_in)
          this.$router.push({ name: 'home' })
        })
        .catch((error) => {
          Notify.create({
            message: error.message,
            position: 'top',
            color: 'red',
            icon: 'error_outline'
          })
        })
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (vm.$globals.logged_user) {
        vm.$router.push({ name: 'home' })
      }
    })
  }
}

</script>
