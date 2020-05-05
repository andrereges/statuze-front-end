<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-black glossy text-white">

        <q-toolbar-title>
          <q-btn
            flat
            dense
            round
            @click="index"
          >
            <q-avatar>
              <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg">
            </q-avatar>

            {{ this.$globals.appName }}

            <q-tooltip content-class="bg-indigo" content-style="font-size: 16px" :offset="[10, 10]">
              Início
            </q-tooltip>
          </q-btn>
        </q-toolbar-title>

        <q-btn
          push
          flat
          dense
          round
          @click="profile"
          arial-label="Profile">
          <q-tooltip content-class="bg-indigo" content-style="font-size: 16px" :offset="[10, 10]">
            Perfil
          </q-tooltip>

          <div class="container text-center">
            <div class="row justify-center">
              <q-avatar size="42px">
                <img :src="loggedUser.image">
              </q-avatar>
            </div>
            <div class="row">
              {{ loggedUser.nickName }}
            </div>
          </div>

        </q-btn>

        <q-btn
          push
          flat
          dense
          round
          @click="logout"
          arial-label="Logout">

          <q-tooltip content-class="bg-indigo" content-style="font-size: 16px" :offset="[10, 10]">
            Sair
          </q-tooltip>

          <q-icon name="exit_to_app"></q-icon>

        </q-btn>

      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { LocalStorage } from 'quasar'

export default {
  name: 'MainLayout',

  data () {
    return {
      loggedUser: '',
      links: [
        {
          title: 'Home',
          caption: 'Status',
          icon: 'access_time',
          link: '/'
        }
      ]
    }
  },
  mounted () {
    this.loggedUser = this.$globals.user
  },
  methods: {
    logout () {
      this.$axios.post('/auth/logout')
        .then(() => {
          LocalStorage.remove('statuze_access_token')
          LocalStorage.remove('statuze_logged_user')
          this.$router.push('/login')
        })
        .catch(() => {
          this.$router.push('/login')
        })
    },
    profile () {
      this.$router.push('/profile')
    },
    index () {
      this.$router.push('/')
    }
  }
}
</script>
