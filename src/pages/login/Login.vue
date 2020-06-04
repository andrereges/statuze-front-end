<template>
  <q-page class="flex flex-center" id="login">
    <q-card style="width: 350px">

      <q-bar class="bg-black glossy unelevated text-white">
        <q-item-label>Autenticação</q-item-label>

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
          ]">

          <template v-slot:prepend>
            <q-icon name="mail" />
          </template>
        </q-input>
      </q-card-section>

      <q-card-section>
        <q-input outlined
          ref="password"
          v-model="password"
          label="Senha*"
          type="password"
          placeholder=""
          hint=""
          :rules="[val => !!val || 'Senha obrigatória']"
        >

          <template v-slot:prepend>
            <q-icon name="vpn_key" />
          </template>
        </q-input>
      </q-card-section>

      <q-card-section>
        <q-btn
          glossy unelevated
          push
          color="primary"
          text-color="black"
          class="full-width"
          size="lg"
          @click="login"
          :disabled="loading"
        >
          <div class="row">
            <template v-if="loading">
              <q-spinner-pie
                glossy
                unelevated
                class="custumizacao"
                size="1em"
              />
              Entrando...
          </template>
          <template v-else>
            <q-icon size="32px" name="input" class="custumizacao" />
            Entrar
          </template>
          </div>
        </q-btn>
      </q-card-section>

    </q-card>
  </q-page>
</template>

<script>
import isEmail from 'validator/lib/isEmail'
import { LocalStorage } from 'quasar'

export default {
  name: 'Login',

  data () {
    return {
      email: 'asantos@lliege.com.br',
      password: 'change123',
      loading: false
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
    async tryAuth (payload) {
      this.loading = true

      await this.$axios.post('/auth/login', payload)
        .then((response) => {
          LocalStorage.set('statuze_user', response.data.logged_user)
          LocalStorage.set('statuze_access_token', response.data.access_token)
          LocalStorage.set('statuze_token_expires_in', response.data.expires_in)
          this.$globals.refreshPage()
        })
        .catch((error) => {
          this.$globals.showNotify('error', error.message)
        })

      this.loading = false
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

<style>
#login {
  background-color: #444;
  height: 100vh;
}
.custumizacao {
  padding-right: 10px;
  color: black
}
</style>
